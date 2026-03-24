import { sql } from "../../../config/db.js";

export async function getSurvey(eventId) {
  const surveys =
    await sql`SELECT * FROM event_surveys WHERE event_id = ${eventId}`;
  if (surveys.length === 0) return null;

  const survey = surveys[0];
  const questions = await sql`
    SELECT * FROM survey_questions 
    WHERE survey_id = ${survey.id} 
    ORDER BY order_index ASC
  `;

  return { ...survey, questions };
}

export async function saveSurvey(eventId, surveyData) {
  const { title, description, privacy_notice, accepting_responses, questions } =
    surveyData;

  return await sql.begin(async (sql) => {
    // 1. Upsert Survey Details
    const existing =
      await sql`SELECT id FROM event_surveys WHERE event_id = ${eventId}`;
    let surveyId;

    if (existing.length > 0) {
      surveyId = existing[0].id;
      await sql`
        UPDATE event_surveys 
        SET title = ${title}, description = ${description}, privacy_notice = ${privacy_notice}, accepting_responses = ${accepting_responses}
        WHERE id = ${surveyId}
      `;
    } else {
      const inserted = await sql`
        INSERT INTO event_surveys (event_id, title, description, privacy_notice, accepting_responses)
        VALUES (${eventId}, ${title}, ${description}, ${privacy_notice}, ${accepting_responses})
        RETURNING id
      `;
      surveyId = inserted[0].id;
    }

    // 2. Replace Questions (Delete old, insert new to handle order and removals cleanly)
    await sql`DELETE FROM survey_questions WHERE survey_id = ${surveyId}`;

    if (questions && questions.length > 0) {
      const questionsToInsert = questions.map((q, index) => ({
        survey_id: surveyId,
        question_text: q.question_text,
        question_type: q.question_type,
        validation_type: q.validation_type || "none",
        options: q.options ? JSON.stringify(q.options) : null,
        is_required: q.is_required,
        order_index: index,
      }));

      await sql`INSERT INTO survey_questions ${sql(questionsToInsert)}`;
    }

    return { success: true, surveyId };
  });
}

export async function getResponses(eventId) {
  const surveys =
    await sql`SELECT id FROM event_surveys WHERE event_id = ${eventId}`;
  if (surveys.length === 0) return [];

  const surveyId = surveys[0].id;

  // Get all responses
  const responses = await sql`
    SELECT * FROM survey_responses WHERE survey_id = ${surveyId} ORDER BY registered_at DESC
  `;

  // Attach answers to each response
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
}
