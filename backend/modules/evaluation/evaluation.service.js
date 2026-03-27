import { sql } from "../../config/db.js";
import { userStatsService } from "../users/userStats.service.js";

export const evaluationService = {
  // volunteer
  async getPendingEvaluations(userId) {
    return await sql`
      SELECT 
        e.id as event_id, e.event_title, e.description, e.start_date, e.end_date, e.location,
        ee.id as evaluation_id
      FROM events e
      JOIN event_volunteers ev ON e.id = ev.event_id
      JOIN event_evaluations ee ON e.id = ee.event_id
      LEFT JOIN event_evaluation_responses eer ON ee.id = eer.evaluation_id AND eer.user_id = ${userId}
      WHERE ev.user_id = ${userId} AND ee.status = 'open' AND eer.id IS NULL
    `;
  },

  async getEvaluationHistory(userId) {
    return await sql`
      SELECT 
        e.id as event_id, e.event_title, e.start_date, e.location,
        eer.submitted_at
      FROM event_evaluation_responses eer
      JOIN event_evaluations ee ON eer.evaluation_id = ee.id
      JOIN events e ON ee.event_id = e.id
      WHERE eer.user_id = ${userId}
      ORDER BY eer.submitted_at DESC
    `;
  },

  async getEvaluationQuestions(eventId) {
    return await sql`
      SELECT eq.* 
      FROM event_evaluation_questions eq
      JOIN event_evaluations ee ON eq.evaluation_id = ee.id
      WHERE ee.event_id = ${eventId}
      ORDER BY eq.order_index ASC
    `;
  },

  async submitEvaluation(eventId, userId, answers) {
    await sql`BEGIN`;
    try {
      const [evaluation] =
        await sql`SELECT id FROM event_evaluations WHERE event_id = ${eventId}`;
      if (!evaluation) throw new Error("Evaluation not found");

      const [response] = await sql`
        INSERT INTO event_evaluation_responses (evaluation_id, user_id)
        VALUES (${evaluation.id}, ${userId})
        RETURNING id
      `;

      for (const answer of answers) {
        await sql`
          INSERT INTO event_evaluation_answers (response_id, question_id, answer_text)
          VALUES (${response.id}, ${answer.question_id}, ${answer.answer_text})
        `;
      }
      await sql`COMMIT`;
      return { success: true };
    } catch (err) {
      await sql`ROLLBACK`;
      throw err;
    }
  },

  async submitGeneralFeedback(data) {
    const [feedback] = await sql`
      INSERT INTO general_feedback (user_id, topic, subject, message)
      VALUES (${data.user_id}, ${data.topic}, ${data.subject}, ${data.message})
      RETURNING *
    `;
    return feedback;
  },

  // admin
  async getAdminEvaluations() {
    return await sql`
      SELECT 
        e.id, e.event_title, e.start_date, e.end_date, 
        ee.status as evaluation_status, ee.id as evaluation_id
      FROM events e
      LEFT JOIN event_evaluations ee ON e.id = ee.event_id
      WHERE e.end_date < CURRENT_DATE 
      ORDER BY e.end_date DESC
    `;
  },

  async launchEvaluation(eventId, questions) {
    await sql`BEGIN`;
    try {
      let evaluation =
        await sql`SELECT id, status FROM event_evaluations WHERE event_id = ${eventId}`;

      if (evaluation.length === 0) {
        evaluation = await sql`
          INSERT INTO event_evaluations (event_id, status)
          VALUES (${eventId}, 'open')
          RETURNING id
        `;
      } else {
        await sql`UPDATE event_evaluations SET status = 'open' WHERE id = ${evaluation[0].id}`;
      }

      const evaluationId = evaluation[0].id;
      await sql`DELETE FROM event_evaluation_questions WHERE evaluation_id = ${evaluationId}`;

      for (let i = 0; i < questions.length; i++) {
        await sql`
          INSERT INTO event_evaluation_questions (evaluation_id, question_text, order_index)
          VALUES (${evaluationId}, ${questions[i].text}, ${i})
        `;
      }
      await sql`COMMIT`;
      return { success: true };
    } catch (err) {
      await sql`ROLLBACK`;
      throw err;
    }
  },

  async closeEvaluation(eventId) {
    await sql`
      UPDATE event_evaluations
      SET status = 'closed'
      WHERE event_id = ${eventId}
    `;
    return { success: true };
  },

  async getEvaluationResults(eventId) {
    const questions = await sql`
      SELECT eq.id, eq.question_text 
      FROM event_evaluation_questions eq
      JOIN event_evaluations ee ON eq.evaluation_id = ee.id
      WHERE ee.event_id = ${eventId}
      ORDER BY eq.order_index ASC
    `;

    const answers = await sql`
      SELECT ea.question_id, ea.answer_text, u.first_name, u.last_name
      FROM event_evaluation_answers ea
      JOIN event_evaluation_responses er ON ea.response_id = er.id
      JOIN event_evaluations ee ON er.evaluation_id = ee.id
      JOIN user_info u ON er.user_id = u.id
      WHERE ee.event_id = ${eventId}
    `;

    const volunteers = await sql`
      SELECT 
        u.id, u.first_name, u.last_name,
        CASE WHEN er.id IS NOT NULL THEN true ELSE false END as has_answered,
        vr.rating, vr.note
      FROM event_volunteers ev
      JOIN user_info u ON ev.user_id = u.id
      LEFT JOIN event_evaluations ee ON ev.event_id = ee.event_id
      LEFT JOIN event_evaluation_responses er ON ee.id = er.evaluation_id AND er.user_id = u.id
      LEFT JOIN volunteer_performance_ratings vr ON ev.event_id = vr.event_id AND vr.user_id = u.id
      WHERE ev.event_id = ${eventId}
    `;

    return { questions, answers, volunteers };
  },

  async rateVolunteer(eventId, userId, adminId, rating, note) {
    const existing = await sql`
      SELECT id FROM volunteer_performance_ratings 
      WHERE event_id = ${eventId} AND user_id = ${userId}
    `;

    let result;
    if (existing.length > 0) {
      result = await sql`
        UPDATE volunteer_performance_ratings
        SET rating = ${rating}, note = ${note}, rated_by = ${adminId}, rated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing[0].id}
        RETURNING *
      `;
    } else {
      result = await sql`
        INSERT INTO volunteer_performance_ratings (event_id, user_id, rating, note, rated_by)
        VALUES (${eventId}, ${userId}, ${rating}, ${note}, ${adminId})
        RETURNING *
      `;
    }

    // Hook update user stats
    userStatsService.updateUserRating(userId).catch(console.error);

    return result;
  },
};
