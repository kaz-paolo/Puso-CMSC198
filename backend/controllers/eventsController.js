import { sql } from "../config/db.js";

export async function getAllEvents(req, res) {
  try {
    const events = await sql`
      SELECT 
        e.*,
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
        ) as current_volunteers
      FROM events e
      ORDER BY e.start_date DESC
    `;
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error("Fetch events error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch events" });
  }
}

export async function createEvent(req, res) {
  try {
    const {
      event_title,
      description,
      event_type,
      location,
      start_date,
      start_time,
      end_date,
      end_time,
      registration_allowed,
      publish_event,
      volunteer_capacity,
      volunteer_roles,
    } = req.body;

    // Create event
    const newEvent = await sql`
      INSERT INTO events
        (event_title, description, event_type, location, start_date, start_time, end_date, end_time, registration_allowed, publish_event, volunteer_capacity, status)
      VALUES
        (${event_title}, ${description}, ${event_type}, ${location}, ${start_date}, ${start_time}, ${end_date}, ${end_time}, ${registration_allowed}, ${publish_event}, ${volunteer_capacity}, 'upcoming')
      RETURNING *;
    `;

    // Insert volunteer roles if provided
    if (volunteer_roles && volunteer_roles.length > 0) {
      const eventId = newEvent[0].id;
      for (const role of volunteer_roles) {
        await sql`
          INSERT INTO event_volunteer_roles
            (event_id, role_name, capacity)
          VALUES
            (${eventId}, ${role.role}, ${role.capacity});
        `;
      }
    }

    res.status(200).json({ success: true, data: newEvent[0] });
  } catch (error) {
    console.log("Create event error: ", error);
    res.status(500).json({ error: "Failed to create event" });
  }
}

export async function getEventById(req, res) {
  try {
    const { id } = req.params;
    const events = await sql`
      SELECT 
        e.*, 
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
        ) as current_volunteers
      FROM events e 
      WHERE e.id = ${id}
    `;
    if (events.length === 0) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    console.log("Event fetched:", events[0]);
    res.status(200).json({ success: true, data: events[0] });
  } catch (error) {
    console.error("Fetch event error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch event" });
  }
}

export async function joinEvent(req, res) {
  try {
    const { eventId } = req.params;
    const { userId: authUserId, roleId } = req.body;

    if (!authUserId || !eventId) {
      return res.status(400).json({
        success: false,
        error: "Missing userId or eventId",
      });
    }

    let users = await sql`
      SELECT id FROM user_info WHERE auth_user_id = ${authUserId}
    `;

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const userId = users[0].id;

    // Check if event has roles and roleId is provided
    if (roleId) {
      // Verify the role exists and has capacity
      const [role] = await sql`
        SELECT * FROM event_volunteer_roles 
        WHERE id = ${roleId} AND event_id = ${eventId}
      `;

      if (!role) {
        return res.status(404).json({
          success: false,
          error: "Role not found",
        });
      }

      // Check current count for role
      const [countResult] = await sql`
        SELECT COUNT(*) as count 
        FROM event_volunteers 
        WHERE event_id = ${eventId} AND role_id = ${roleId}
      `;

      if (parseInt(countResult.count) >= role.capacity) {
        return res.status(409).json({
          success: false,
          error: "This role is already full",
        });
      }
    }

    // Insert volunteer with role
    const registration = await sql`
      INSERT INTO event_volunteers (user_id, event_id, role_id, volunteer_status)
      VALUES (${userId}, ${eventId}, ${roleId || null}, 'joined')
      ON CONFLICT (user_id, event_id)
      DO NOTHING
      RETURNING *;
    `;

    if (registration.length === 0) {
      return res.status(409).json({
        success: true,
        message: "User already joined this event",
      });
    }

    res.status(201).json({
      success: true,
      data: registration[0],
    });
  } catch (error) {
    console.error("Join event error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to join event",
    });
  }
}

export async function getEventVolunteers(req, res) {
  try {
    const { eventId } = req.params;

    const volunteers = await sql`
      SELECT ui.id, ui.first_name, ui.last_name, ui.role, ui.student_number, ui.degree
      FROM event_volunteers er
      JOIN user_info ui ON er.user_id = ui.id
      WHERE er.event_id = ${eventId}
    `;

    res.status(200).json({ success: true, data: volunteers });
  } catch (error) {
    console.error("Fetch volunteers error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch volunteers" });
  }
}
