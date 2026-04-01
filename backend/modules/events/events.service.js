import { sql } from "../../config/db.js";

export const eventsService = {
  // Selects all events
  // attached volunteer roles and count
  async getAllEvents() {
    const events = await sql`
      SELECT e.*,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', r.id,
                'role_name', r.role_name,
                'capacity', r.capacity,
                'current_count', (
                  SELECT COUNT(*) FROM event_volunteers ev 
                  WHERE ev.event_id = e.id AND ev.role_id = r.id
                )
              )
            )
            FROM event_volunteer_roles r 
            WHERE r.event_id = e.id
          ),
          '[]'::json
        ) as volunteer_roles,
        (
          SELECT COUNT(*) FROM event_volunteers ev 
          WHERE ev.event_id = e.id
        ) as current_volunteers,
        (
          SELECT COUNT(*) FROM survey_responses sr 
          JOIN event_surveys es ON sr.survey_id = es.id
          WHERE es.event_id = e.id
        ) as current_participants
      FROM events e
      ORDER BY e.start_date DESC
    `;
    // TODO: filter out soft deleted
    // TODO: Add a function(?) to only get either: ongoing, completed, upcoming for optimization shts
    return events;
  },

  // Insert event data to events table
  async createEvent(eventData) {
    let {
      event_title,
      description,
      event_type,
      location,
      start_date,
      start_time,
      end_date,
      end_time,
      registration_allowed,
      approval_required,
      publish_event,
      volunteer_capacity,
      volunteer_roles,
      created_by,
    } = eventData;

    if (typeof volunteer_roles === "string") {
      try {
        volunteer_roles = JSON.parse(volunteer_roles);
      } catch (err) {
        volunteer_roles = [];
      }
    }

    try {
      // create event
      return await sql.begin(async (sql) => {
        const [newEvent] = await sql`
          INSERT INTO events
            (event_title, description, event_type, location, start_date, start_time, end_date, end_time, registration_allowed, approval_required, publish_event, volunteer_capacity, created_by)
          VALUES
            (${event_title}, ${description}, ${event_type}, ${location}, ${start_date}, ${start_time}, ${end_date}, ${end_time}, ${registration_allowed}, ${approval_required}, ${publish_event}, ${volunteer_capacity}, ${created_by})
          RETURNING *;
        `;

        // add volunteer roles if provided
        if (volunteer_roles && volunteer_roles.length > 0) {
          const eventId = newEvent.id;

          await Promise.all(
            volunteer_roles.map(
              (role) =>
                sql`
                INSERT INTO event_volunteer_roles
                  (event_id, role_name, capacity)
                VALUES
                  (${eventId}, ${role.role_name || role.role || "Unnamed Role"}, ${role.capacity})
              `,
            ),
          );
        }

        return newEvent;
      });
    } catch (error) {
      throw error;
    }
  },

  // Fetch specific event detail and unique volunteers count, and roles for that event and count
  async getEventById(id) {
    const events = await sql`
      SELECT 
        e.*,
        COUNT(DISTINCT ev.user_id) as current_volunteers,
        (
          SELECT COUNT(*) FROM survey_responses sr 
          JOIN event_surveys es ON sr.survey_id = es.id
          WHERE es.event_id = e.id
        ) as current_participants
      FROM events e
      LEFT JOIN event_volunteers ev ON e.id = ev.event_id
      WHERE e.id = ${id}
      GROUP BY e.id
    `;

    if (events.length === 0) return null;

    // Fetch volunteer roles
    const roles = await sql`
      SELECT 
        evr.id,
        evr.role_name,
        evr.capacity,
        COUNT(ev.user_id) as current_count
      FROM event_volunteer_roles evr
      LEFT JOIN event_volunteers ev ON evr.id = ev.role_id
      WHERE evr.event_id = ${id}
      GROUP BY evr.id, evr.role_name, evr.capacity
    `;

    return {
      ...events[0],
      volunteer_roles: roles,
    };
  },
  async deleteEvent(eventId, deletedBy) {
    const [deletedEvent] = await sql`
      UPDATE events
      SET 
        deleted_at = CURRENT_TIMESTAMP,
        deleted_by = ${deletedBy}
      WHERE id = ${eventId} AND deleted_at IS NULL
      RETURNING *;
    `;
    return deletedEvent;
  },

  async archiveEvent(eventId) {
    const [archivedEvent] = await sql`
    UPDATE events
    SET is_archived = NOT COALESCE(is_archived, FALSE)
    WHERE id = ${eventId}
    RETURNING *;
  `;
    return archivedEvent;
  },

  async getDashboardStats() {
    const [stats] = await sql`
      SELECT
        COALESCE(SUM(CASE WHEN e.end_date < CURRENT_DATE THEN EXTRACT(EPOCH FROM (e.end_date + e.end_time) - (e.start_date + e.start_time)) / 3600 ELSE 0 END), 0)::numeric AS total_impact_hours,
        COUNT(DISTINCT e.location) AS partner_communities,
        COALESCE(COUNT(DISTINCT ev.user_id), 0)::int AS total_volunteers
      FROM events e
      LEFT JOIN event_volunteers ev ON e.id = ev.event_id
        AND ev.volunteer_status = 'CONFIRMED'
        AND ev.deleted_at IS NULL
      ;
    `;

    return {
      totalImpactHours: stats.total_impact_hours,
      partnerCommunities: stats.partner_communities,
      totalVolunteers: stats.total_volunteers,
    };
  },
};
