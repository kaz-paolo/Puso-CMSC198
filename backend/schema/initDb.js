import { sql } from "../config/db.js";

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
        event_title VARCHAR(255) NOT NULL,
        description TEXT,
        event_type VARCHAR(50) NOT NULL DEFAULT '',
        location VARCHAR(255) NOT NULL DEFAULT '',
        start_date DATE,
        start_time TIME,
        end_date DATE,
        end_time TIME,
        registration_allowed BOOLEAN NOT NULL DEFAULT false,
        publish_event BOOLEAN NOT NULL DEFAULT false,
        volunteer_capacity INTEGER NOT NULL DEFAULT 0,
        approval_required BOOLEAN NOT NULL DEFAULT true,
        created_by INTEGER REFERENCES user_info(id)
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

    await sql`
      CREATE TABLE IF NOT EXISTS event_tasks (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        task_title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        status VARCHAR(50) NOT NULL DEFAULT 'To Do',
        priority VARCHAR(50),
        deadline_date DATE,
        deadline_time TIME, 
        task_details TEXT,
        relevant_links TEXT[],
        created_by INTEGER REFERENCES user_info(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS task_assignees (
        id SERIAL PRIMARY KEY,
        task_id INTEGER NOT NULL REFERENCES event_tasks(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES user_info(id) ON DELETE CASCADE,
        role_id INTEGER REFERENCES event_volunteer_roles(id) ON DELETE CASCADE,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT assignee_type CHECK (
          (user_id IS NOT NULL AND role_id IS NULL) OR 
          (user_id IS NULL AND role_id IS NOT NULL)
        )
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS event_resources (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        description TEXT,
        parent_resource_id INTEGER REFERENCES event_resources(id) ON DELETE CASCADE,
        uploaded_by INTEGER REFERENCES user_info(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

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

    // For event_volunteers
    await sql`
      ALTER TABLE event_volunteers 
      ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS deleted_by INTEGER REFERENCES user_info(id)
    `;

    // For event_resources
    await sql`
      ALTER TABLE event_resources 
      ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS deleted_by INTEGER REFERENCES user_info(id)
    `;

    // For event_tasks
    await sql`
      ALTER TABLE event_tasks 
      ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS deleted_by INTEGER REFERENCES user_info(id)
    `;

    // For survey and participants

    // Survey Main
    await sql`
    
      CREATE TABLE IF NOT EXISTS event_surveys (
        id SERIAL PRIMARY KEY,
        event_id INTEGER UNIQUE NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        privacy_notice TEXT,
        accepting_responses BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Specific survey questions
    await sql`
      CREATE TABLE IF NOT EXISTS survey_questions (
        id SERIAL PRIMARY KEY,
        survey_id INTEGER NOT NULL REFERENCES event_surveys(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        question_type VARCHAR(50) NOT NULL, -- e.g., 'text', 'choices', 'dropdown'
        validation_type VARCHAR(50), -- e.g., 'none', 'text', 'number', 'email'
        options JSONB, -- Stores array of strings for choices/dropdowns
        is_required BOOLEAN DEFAULT true,
        order_index INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // responses (only the consistent like name etc)
    await sql`
      CREATE TABLE IF NOT EXISTS survey_responses (
        id SERIAL PRIMARY KEY,
        survey_id INTEGER NOT NULL REFERENCES event_surveys(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        contact_number VARCHAR(50),
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(survey_id, email) -- Prevents the same email from registering twice
      );
    `;

    // Answers
    await sql`
      CREATE TABLE IF NOT EXISTS survey_answers (
        id SERIAL PRIMARY KEY,
        response_id INTEGER NOT NULL REFERENCES survey_responses(id) ON DELETE CASCADE,
        question_id INTEGER NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
        answer_text TEXT
      );
    `;

    // Evaluation and Feedback

    // General Feedback
    await sql`
      CREATE TABLE IF NOT EXISTS general_feedback (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES user_info(id) ON DELETE CASCADE,
        topic VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Event Evaluations
    await sql`
      CREATE TABLE IF NOT EXISTS event_evaluations (
        id SERIAL PRIMARY KEY,
        event_id INTEGER UNIQUE NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'open', 'closed'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Event Evaluation Questions
    await sql`
      CREATE TABLE IF NOT EXISTS event_evaluation_questions (
        id SERIAL PRIMARY KEY,
        evaluation_id INTEGER NOT NULL REFERENCES event_evaluations(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        question_type VARCHAR(50) DEFAULT 'text',
        order_index INTEGER
      );
    `;

    // Event Evaluation Responses
    await sql`
      CREATE TABLE IF NOT EXISTS event_evaluation_responses (
        id SERIAL PRIMARY KEY,
        evaluation_id INTEGER NOT NULL REFERENCES event_evaluations(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES user_info(id) ON DELETE CASCADE,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(evaluation_id, user_id)
      );
    `;

    // Event Evaluation Answers
    await sql`
      CREATE TABLE IF NOT EXISTS event_evaluation_answers (
        id SERIAL PRIMARY KEY,
        response_id INTEGER NOT NULL REFERENCES event_evaluation_responses(id) ON DELETE CASCADE,
        question_id INTEGER NOT NULL REFERENCES event_evaluation_questions(id) ON DELETE CASCADE,
        answer_text TEXT
      );
    `;

    // Volunteer Performance Ratings
    await sql`
      CREATE TABLE IF NOT EXISTS volunteer_performance_ratings (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES user_info(id) ON DELETE CASCADE,
        rating DECIMAL(3,1) CHECK (rating >= 1.0 AND rating <= 5.0),
        note TEXT,
        rated_by INTEGER REFERENCES user_info(id) ON DELETE SET NULL,
        rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, user_id)
      );
    `;

    // User Statistics
    await sql`
      CREATE TABLE IF NOT EXISTS user_stats (
        user_id INTEGER PRIMARY KEY REFERENCES user_info(id) ON DELETE CASCADE,
        total_hours_volunteered DECIMAL(10, 2) DEFAULT 0,
        ongoing_events_joined INTEGER DEFAULT 0,
        total_events_joined INTEGER DEFAULT 0,
        total_individuals_reached INTEGER DEFAULT 0,
        pending_tasks INTEGER DEFAULT 0,
        average_rating DECIMAL(3, 2),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}
