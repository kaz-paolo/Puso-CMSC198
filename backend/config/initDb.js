import { sql } from "./db.js";

export async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS user_info (
        id SERIAL PRIMARY KEY,
        auth_user_id VARCHAR(255) UNIQUE,
        role VARCHAR(100) DEFAULT 'volunteer',
        first_name VARCHAR(255) NOT NULL,
        middle_name VARCHAR(255),
        last_name VARCHAR(255) NOT NULL,
        student_number VARCHAR(255),
        nickname VARCHAR(255),
        sex VARCHAR(50),
        civil_status VARCHAR(50),
        dob DATE,
        birth_place VARCHAR(255),
        height DECIMAL(5,2),
        weight DECIMAL(5,2),
        blood_type VARCHAR(10),
        languages TEXT,
        mobile VARCHAR(20),
        hometown TEXT,
        present_address TEXT,
        classification VARCHAR(100),
        college VARCHAR(100),
        degree VARCHAR(255),
        year_level VARCHAR(50),
        year_graduated VARCHAR(10),
        campus VARCHAR(100),
        designation VARCHAR(100),
        organization VARCHAR(255),
        organizations TEXT,
        illness TEXT,
        arukahik_join_date DATE,
        hobbies TEXT,
        skills TEXT,
        expertise TEXT,
        software TEXT,
        committee1 VARCHAR(100),
        why_committee1 TEXT,
        committee2 VARCHAR(100),
        why_committee2 TEXT,
        committee3 VARCHAR(100),
        why_committee3 TEXT,
        strengths TEXT,
        facebook VARCHAR(255) 
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        event_title VARCHAR(255) NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS event_volunteer_roles (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        role_name VARCHAR(255) NOT NULL,
        capacity INTEGER NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS event_volunteers (
        user_id INTEGER NOT NULL REFERENCES user_info(id) ON DELETE CASCADE,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        role_id INTEGER REFERENCES event_volunteer_roles(id) ON DELETE SET NULL,
        volunteer_status VARCHAR(50) NOT NULL,
        PRIMARY KEY (user_id, event_id)
      );
    `;

    const alterTableQueries = [
      `ALTER TABLE events ADD COLUMN description TEXT;`,
      `ALTER TABLE events ADD COLUMN event_type VARCHAR(50) NOT NULL DEFAULT '';`,
      `ALTER TABLE events ADD COLUMN location VARCHAR(255) NOT NULL DEFAULT '';`,
      `ALTER TABLE events ADD COLUMN start_date DATE;`,
      `ALTER TABLE events ADD COLUMN start_time TIME;`,
      `ALTER TABLE events ADD COLUMN end_date DATE;`,
      `ALTER TABLE events ADD COLUMN end_time TIME;`,
      `ALTER TABLE events ADD COLUMN registration_allowed BOOLEAN NOT NULL DEFAULT false;`,
      `ALTER TABLE events ADD COLUMN publish_event BOOLEAN NOT NULL DEFAULT false;`,
      `ALTER TABLE events ADD COLUMN volunteer_capacity INTEGER NOT NULL DEFAULT 0;`,
      `ALTER TABLE events ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'upcoming';`,
    ];

    for (const query of alterTableQueries) {
      try {
        await sql.unsafe(query);
      } catch (error) {
        if (!error.message.includes("already exists")) {
          throw error;
        }
      }
    }

    try {
      await sql.unsafe(`
        ALTER TABLE event_volunteers 
        ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES event_volunteer_roles(id) ON DELETE SET NULL;
      `);
    } catch (error) {
      if (!error.message.includes("already exists")) {
        console.error("Error adding role_id column:", error);
      }
    }

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}
