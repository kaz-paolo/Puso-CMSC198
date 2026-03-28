import { sql } from "../../../config/db.js";
import { userStatsService } from "../../users/userStats.service.js";

export const volunteersService = {
  async getUserIdByAuthId(authUserId) {
    const users =
      await sql`SELECT id FROM user_info WHERE auth_user_id = ${authUserId}`;
    return users[0]?.id;
  },

  async getEventValues(eventId) {
    const events =
      await sql`SELECT approval_required FROM events WHERE id = ${eventId}`;
    return events[0];
  },

  async getRole(roleId, eventId) {
    const roles =
      await sql`SELECT * FROM event_volunteer_roles WHERE id = ${roleId} AND event_id = ${eventId}`;
    return roles[0];
  },

  async getRoleCount(eventId, roleId) {
    const countResult = await sql`
      SELECT COUNT(*) as count
      FROM event_volunteers
      WHERE event_id = ${eventId} AND role_id = ${roleId}
        AND deleted_at IS NULL
    `;
    return parseInt(countResult[0]?.count || 0);
  },

  async joinEvent(userId, eventId, roleId, status) {
    const registration = await sql`
      INSERT INTO event_volunteers (user_id, event_id, role_id, volunteer_status)
      VALUES (${userId}, ${eventId}, ${roleId || null}, ${status})
      ON CONFLICT (user_id, event_id)
      DO UPDATE SET
        role_id = EXCLUDED.role_id,
        volunteer_status = EXCLUDED.volunteer_status,
        deleted_at = NULL,
        deleted_by = NULL
      RETURNING *;
    `;

    if (registration[0] && registration[0].volunteer_status === "CONFIRMED") {
      //  update user stats
      userStatsService.updateUserEventStats(userId).catch(console.error);
      userStatsService
        .recalculateTotalIndividualsReached(userId)
        .catch(console.error);
    }
    return registration[0];
  },

  async updateStatus(eventId, userId, status) {
    const updated = await sql`
      UPDATE event_volunteers
      SET volunteer_status = ${status}
      WHERE user_id = ${userId} AND event_id = ${eventId}
      RETURNING *;
    `;

    if (updated[0]) {
      // update user stats
      userStatsService.updateUserEventStats(userId).catch(console.error);
      userStatsService
        .recalculateTotalIndividualsReached(userId)
        .catch(console.error);
    }
    return updated[0];
  },

  async removeVolunteer(eventId, userId, deletedBy) {
    const softDeleted = await sql`
      UPDATE event_volunteers
      SET
        deleted_at = CURRENT_TIMESTAMP,
        deleted_by = ${deletedBy},
        volunteer_status = 'REMOVED'
      WHERE user_id = ${userId} AND event_id = ${eventId} AND deleted_at IS NULL
      RETURNING *;
    `;

    if (softDeleted[0]) {
      // update user stats
      userStatsService.updateUserEventStats(userId).catch(console.error);
      userStatsService
        .recalculateTotalIndividualsReached(userId)
        .catch(console.error);
    }
    return softDeleted[0];
  },

  async getStats(eventId) {
    // overall stats
    const [stats] = await sql`
        SELECT
          COUNT(*) FILTER (WHERE volunteer_status = 'CONFIRMED') as confirmed_count,
          COUNT(*) FILTER (WHERE volunteer_status = 'PENDING') as pending_count,
          COUNT(*) FILTER (WHERE volunteer_status = 'DECLINED') as declined_count
        FROM event_volunteers
        WHERE event_id = ${eventId} AND deleted_at IS NULL
      `;

    // Stats by role
    const roleStats = await sql`
        SELECT
          evr.id,
          evr.role_name,
          evr.capacity,
          COUNT(ev.user_id) FILTER (WHERE ev.volunteer_status = 'CONFIRMED' AND ev.deleted_at IS NULL) as confirmed_count,
          COUNT(ev.user_id) FILTER (WHERE ev.volunteer_status = 'PENDING' AND ev.deleted_at IS NULL) as pending_count
        FROM event_volunteer_roles evr
        LEFT JOIN event_volunteers ev ON evr.id = ev.role_id AND ev.event_id = ${eventId}
        WHERE evr.event_id = ${eventId}
        GROUP BY evr.id, evr.role_name, evr.capacity
      `;

    return { overall: stats, byRole: roleStats };
  },

  async getVolunteers(eventId) {
    const volunteers = await sql`
      SELECT
        ui.id,
        ui.first_name,
        ui.last_name,
        ui.student_number,
        ui.degree,
        ui.mobile,
        au.email,
        evr.role_name,
        ev.volunteer_status,
        ev.role_id,
        ev.user_id as ev_user_id
      FROM event_volunteers ev
      LEFT JOIN user_info ui ON ev.user_id = ui.id
      LEFT JOIN users au ON ui.auth_user_id = au.id
      LEFT JOIN event_volunteer_roles evr ON ev.role_id = evr.id
      WHERE ev.event_id = ${eventId}
        AND ev.deleted_at IS NULL
      ORDER BY ui.first_name, ui.last_name
    `;
    return volunteers;
  },
};
