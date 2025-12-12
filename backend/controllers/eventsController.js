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
