import { sql } from "../config/db.js";

export async function getAllEvents(req, res) {
  try {
    const events = await sql`SELECT * FROM events ORDER BY date ASC`;
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
}

export async function createEvent(req, res) {
  try {
    const {
      event_name,
      description,
      date,
      time,
      venue,
      status,
      volunteer_count,
    } = req.body;

    const newEvent = await sql`
      INSERT INTO events
        (event_name, description, date, time, venue, volunteer_count, status)
      VALUES
        (${event_name}, ${description}, ${date}, ${time}, ${venue}, ${volunteer_count}, ${status})
      RETURNING *;
    `;

    res.status(200).json({ success: true, data: newEvent[0] });
  } catch (error) {
    console.log("Create event error: ", error);
  }
}

export async function getEventById(req, res) {
  try {
    const { id } = req.params;
    const events = await sql`SELECT * FROM events WHERE id = ${id}`;
    if (events.length === 0) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }
    res.status(200).json({ success: true, data: events[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch event" });
  }
}

export async function joinEvent(req, res) {
  try {
    const { eventId } = req.params;
    const { userId: authUserId } = req.body;

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

    const registration = await sql`
      INSERT INTO event_registrations (user_id, event_id, registration_status)
      VALUES (${userId}, ${eventId}, 'joined')
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
      FROM event_registrations er
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
