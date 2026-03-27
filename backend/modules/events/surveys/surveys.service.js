import { sql } from "../../../config/db.js";
import { userStatsService } from "../../users/userStats.service.js";
import crypto from "crypto";

export const surveysService = {
  async getSurvey(eventId) {
    const surveys =
      await sql`SELECT * FROM event_surveys WHERE event_id = ${eventId}`;
    if (surveys.length === 0) return null;

    const survey = surveys[0];
    const currentVersion = survey.current_version || 1;

    const questions = await sql`
      SELECT * FROM survey_questions 
      WHERE survey_id = ${survey.id} AND version = ${currentVersion}
      ORDER BY order_index ASC
    `;

    // questions'options' stored as a JSON
    const parsedQuestions = questions.map((q) => {
      const options =
        q.options && typeof q.options === "string"
          ? JSON.parse(q.options)
          : q.options;
      return { ...q, options: options || [] }; // ensure options is array
    });

    return { ...survey, questions: parsedQuestions };
  },

  async saveSurvey(eventId, surveyData) {
    const {
      title,
      description,
      privacy_notice,
      accepting_responses,
      questions,
    } = surveyData;

    // version fallback
    await sql`ALTER TABLE event_surveys ADD COLUMN IF NOT EXISTS current_version INTEGER DEFAULT 1`;
    await sql`ALTER TABLE survey_questions ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1`;

    //Survey Details
    const existing =
      await sql`SELECT id, current_version FROM event_surveys WHERE event_id = ${eventId}`;
    let surveyId;
    let newVersion = 1;

    if (existing.length > 0) {
      surveyId = existing[0].id;
      newVersion = (existing[0].current_version || 1) + 1;
      await sql`
        UPDATE event_surveys 
        SET title = ${title}, description = ${description}, privacy_notice = ${privacy_notice}, accepting_responses = ${accepting_responses}, current_version = ${newVersion}
        WHERE id = ${surveyId}
      `;
    } else {
      const inserted = await sql`
        INSERT INTO event_surveys (event_id, title, description, privacy_notice, accepting_responses, current_version)
        VALUES (${eventId}, ${title}, ${description}, ${privacy_notice}, ${accepting_responses}, 1)
        RETURNING id
      `;
      surveyId = inserted[0].id;
    }

    // insert new version of questions not deleting old
    if (questions && questions.length > 0) {
      await Promise.all(
        questions.map(
          (q, index) =>
            sql`
            INSERT INTO survey_questions (
              survey_id,
              question_text,
              question_type,
              validation_type,
              options,
              is_required,
              order_index,
              version
            ) VALUES (
              ${surveyId},
              ${q.question_text},
              ${q.question_type},
              ${q.validation_type || "none"},
              ${q.options ? JSON.stringify(q.options) : null},
              ${q.is_required},
              ${index},
              ${newVersion}
            )
          `,
        ),
      );
    }

    return { success: true, surveyId };
  },

  async getResponses(eventId) {
    const surveys =
      await sql`SELECT id FROM event_surveys WHERE event_id = ${eventId}`;
    if (surveys.length === 0) return [];

    const surveyId = surveys[0].id;

    const responses = await sql`
      SELECT *, survey_version FROM survey_responses WHERE survey_id = ${surveyId} ORDER BY registered_at DESC
    `;

    // attach answers to each response
    for (let response of responses) {
      const answers = await sql`
        SELECT a.answer_text, q.question_text 
        FROM survey_answers a
        JOIN survey_questions q ON a.question_id = q.id
        WHERE a.response_id = ${response.id}
      `;
      response.answers = answers;
    }

    return responses;
  },

  async getResponseByRegistrationId(eventId, registrationId) {
    if (!registrationId || !eventId) {
      return null;
    }

    const responses = await sql`
      SELECT 
        r.name, 
        r.email, 
        r.registered_at, 
        r.registration_id,
        s.title as survey_title,
        s.event_id
      FROM survey_responses r
      JOIN event_surveys s ON r.survey_id = s.id
      WHERE r.registration_id = ${registrationId} AND s.event_id = ${eventId}
    `;

    if (responses.length === 0) {
      return null;
    }

    const response = responses[0];

    return {
      name: response.name,
      date: response.registered_at,
      regId: response.registration_id,
    };
  },

  async submitResponse(eventId, responseData) {
    const { name, email, contact_number, answers } = responseData;

    await sql`ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS survey_version INTEGER DEFAULT 1`;
    await sql`ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS registration_id VARCHAR(50)`;

    // get survey and check if active
    const surveys =
      await sql`SELECT id, accepting_responses, current_version FROM event_surveys WHERE event_id = ${eventId}`;
    if (surveys.length === 0) {
      const err = new Error("Survey not found for this event.");
      err.statusCode = 404;
      throw err;
    }
    const survey = surveys[0];
    if (!survey.accepting_responses) {
      const err = new Error(
        "This survey is not currently accepting responses.",
      );
      err.statusCode = 400;
      throw err;
    }

    const currentVersion = survey.current_version || 1;

    // unique Registration id
    let registrationId;
    let isUnique = false;
    while (!isUnique) {
      registrationId = `REG-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
      const existing =
        await sql`SELECT id FROM survey_responses WHERE registration_id = ${registrationId}`;
      if (existing.length === 0) isUnique = true;
    }

    // main response record
    const insertedResponse = await sql`
      INSERT INTO survey_responses (survey_id, name, email, contact_number, survey_version, registration_id)
      VALUES (${survey.id}, ${name}, ${email}, ${contact_number}, ${currentVersion}, ${registrationId})
      RETURNING id
    `;
    const responseId = insertedResponse[0].id;

    // insert answers
    if (answers && Object.keys(answers).length > 0) {
      const answerEntries = Object.entries(answers);
      await Promise.all(
        answerEntries.map(
          ([questionId, answerText]) =>
            sql`
            INSERT INTO survey_answers (
              response_id,
              question_id,
              answer_text
            ) VALUES (
              ${responseId},
              ${questionId},
              ${answerText}
            )
          `,
        ),
      );
    }

    return { success: true, responseId, registrationId };
  },
};
