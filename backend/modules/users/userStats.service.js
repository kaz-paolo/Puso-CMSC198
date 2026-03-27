import { sql } from "../../config/db.js";

// update user_stat table
async function upsertStats(userId, statsObject) {
  if (!statsObject || Object.keys(statsObject).length === 0) return;

  const total_hours_volunteered = statsObject.total_hours_volunteered ?? null;
  const ongoing_events_joined = statsObject.ongoing_events_joined ?? null;
  const total_events_joined = statsObject.total_events_joined ?? null;
  const total_individuals_reached =
    statsObject.total_individuals_reached ?? null;
  const pending_tasks = statsObject.pending_tasks ?? null;
  const average_rating = statsObject.average_rating ?? null;

  await sql`
    INSERT INTO user_stats (
      user_id,
      total_hours_volunteered,
      ongoing_events_joined,
      total_events_joined,
      total_individuals_reached,
      pending_tasks,
      average_rating,
      updated_at
    )
    VALUES (
      ${userId},
      COALESCE(${total_hours_volunteered}::numeric, 0),
      COALESCE(${ongoing_events_joined}::int, 0),
      COALESCE(${total_events_joined}::int, 0),
      COALESCE(${total_individuals_reached}::int, 0),
      COALESCE(${pending_tasks}::int, 0),
      ${average_rating}::numeric,
      CURRENT_TIMESTAMP
    )
    ON CONFLICT (user_id) DO UPDATE SET
      total_hours_volunteered = COALESCE(${total_hours_volunteered}::numeric, user_stats.total_hours_volunteered),
      ongoing_events_joined = COALESCE(${ongoing_events_joined}::int, user_stats.ongoing_events_joined),
      total_events_joined = COALESCE(${total_events_joined}::int, user_stats.total_events_joined),
      total_individuals_reached = COALESCE(${total_individuals_reached}::int, user_stats.total_individuals_reached),
      pending_tasks = COALESCE(${pending_tasks}::int, user_stats.pending_tasks),
      average_rating = COALESCE(${average_rating}::numeric, user_stats.average_rating),
      updated_at = CURRENT_TIMESTAMP
  `;
}

export const userStatsService = {
  // event related stats (hours (from only completed events), joined, ongoing)
  async updateUserEventStats(userId) {
    const [stats] = await sql`
      WITH user_events AS (
        SELECT e.id, e.start_date, e.start_time, e.end_date, e.end_time
        FROM event_volunteers ev
        JOIN events e ON ev.event_id = e.id
        WHERE ev.user_id = ${userId} AND ev.volunteer_status = 'CONFIRMED' AND ev.deleted_at IS NULL
      ),
      event_durations AS (
        SELECT 
          CASE 
            WHEN e.start_date IS NOT NULL AND e.end_date IS NOT NULL AND e.start_time IS NOT NULL AND e.end_time IS NOT NULL
            THEN EXTRACT(EPOCH FROM (e.end_date + e.end_time) - (e.start_date + e.start_time)) / 3600
            ELSE 0 
          END as duration_hours
        FROM events e
        JOIN user_events ue ON e.id = ue.id
        WHERE e.end_date < CURRENT_DATE -- Only count completed events for hours
      )
      SELECT
        (SELECT COALESCE(SUM(duration_hours), 0) FROM event_durations) as total_hours_volunteered,
        (SELECT COUNT(*) FROM user_events WHERE end_date >= CURRENT_DATE) as ongoing_events_joined,
        (SELECT COUNT(*) FROM user_events WHERE end_date < CURRENT_DATE) as total_events_joined
    `;
    await upsertStats(userId, stats);
  },

  // individuals reached from completed events
  async recalculateTotalIndividualsReached(userId) {
    const [stats] = await sql`
      WITH user_completed_event_ids AS (
        SELECT ev.event_id
        FROM event_volunteers ev
        JOIN events e ON ev.event_id = e.id
        WHERE ev.user_id = ${userId}
          AND ev.volunteer_status = 'CONFIRMED'
          AND ev.deleted_at IS NULL
          AND e.end_date < CURRENT_DATE
      )
      SELECT COALESCE(COUNT(sr.id), 0)::int as total_individuals_reached
      FROM survey_responses sr
      JOIN event_surveys es ON sr.survey_id = es.id
      WHERE es.event_id IN (SELECT event_id FROM user_completed_event_ids)
    `;
    await upsertStats(userId, {
      total_individuals_reached: stats.total_individuals_reached,
    });
  },

  // pending tasks
  async updateUserTaskStats(userId) {
    const [stats] = await sql`
      SELECT COUNT(*) as pending_tasks
      FROM task_assignees ta
      JOIN event_tasks et ON ta.task_id = et.id
      WHERE ta.user_id = ${userId} AND et.status NOT IN ('Done', 'Archived') AND et.deleted_at IS NULL
    `;
    await upsertStats(userId, stats);
  },

  // average rating
  async updateUserRating(userId) {
    const [stats] = await sql`
      SELECT AVG(rating) as average_rating
      FROM volunteer_performance_ratings
      WHERE user_id = ${userId}
    `;
    await upsertStats(userId, { average_rating: stats.average_rating });
  },

  // recalculate all
  async updateAllUserStats(userId) {
    await this.updateUserEventStats(userId);
    await this.recalculateTotalIndividualsReached(userId);
    await this.updateUserTaskStats(userId);
    await this.updateUserRating(userId);
  },

  // get user stats and recheck completed events for updates
  async getUserStats(userId) {
    let [stats] = await sql`SELECT * FROM user_stats WHERE user_id = ${userId}`;

    if (!stats) {
      await this.updateAllUserStats(userId);
      [stats] = await sql`SELECT * FROM user_stats WHERE user_id = ${userId}`;
    } else {
      // check if any events have been completed
      const [needsUpdate] = await sql`
        SELECT 1 FROM event_volunteers ev
        JOIN events e ON ev.event_id = e.id
        WHERE ev.user_id = ${userId}
          AND ev.volunteer_status = 'CONFIRMED'
          AND e.end_date < CURRENT_DATE
          AND e.end_date >= ${stats.updated_at}::date
        LIMIT 1
      `;

      if (needsUpdate) {
        // if event completed, update stats
        await this.updateUserEventStats(userId);
        await this.recalculateTotalIndividualsReached(userId);
        // fetch updated
        [stats] = await sql`SELECT * FROM user_stats WHERE user_id = ${userId}`;
      }
    }
    return stats;
  },
};
