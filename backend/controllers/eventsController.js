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
