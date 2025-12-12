import { sql } from "./db.js";

export async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS user_info (
        id SERIAL PRIMARY KEY,
        auth_user_id TEXT NOT NULL UNIQUE REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
        full_name TEXT,
        dob DATE,
        mobile TEXT
      );
    `;

    // await sql`
    //   CREATE TABLE IF NOT EXISTS users (
    //     id SERIAL PRIMARY KEY,
    //     user_id UUID NOT NULL REFERENCES auth.users(id),
    //     student_id VARCHAR(50) NOT NULL UNIQUE,
    //     name VARCHAR(255) NOT NULL,
    //     role VARCHAR(50) NOT NULL,
    //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    //   );
    // `;

    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        event_name VARCHAR(255) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        time TIME NOT NULL,
        venue VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS event_registrations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        registration_status VARCHAR(50) NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS event_attendance (
        id SERIAL PRIMARY KEY,
        registration_id INTEGER NOT NULL REFERENCES event_registrations(id) ON DELETE CASCADE,
        time_in TIMESTAMP,
        time_out TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS event_committees (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS committee_members (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        committee_id INTEGER NOT NULL REFERENCES event_committees(id) ON DELETE CASCADE,
        role VARCHAR(255) NOT NULL
      );
    `;

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initDB", error);
  }
}
