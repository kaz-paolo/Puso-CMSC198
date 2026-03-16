import { sql } from "../../config/db.js";

// Define field mappings
const PROFILE_FIELDS = {
  firstName: "first_name",
  middleName: "middle_name",
  lastName: "last_name",
  studentNumber: "student_number",
  nickname: "nickname",
  sex: "sex",
  civilStatus: "civil_status",
  birthDate: "dob",
  birthPlace: "birth_place",
  height: "height",
  weight: "weight",
  bloodType: "blood_type",
  languages: "languages",
  mobile: "mobile",
  hometown: "hometown",
  presentAddress: "present_address",
  classification: "classification",
  college: "college",
  degree: "degree",
  yearLevel: "year_level",
  yearGraduated: "year_graduated",
  campus: "campus",
  designation: "designation",
  organization: "organization",
  organizations: "organizations",
  illness: "illness",
  arukahikJoinDate: "arukahik_join_date",
  hobbies: "hobbies",
  skills: "skills",
  expertise: "expertise",
  software: "software",
  committee1: "committee1",
  whyCommittee1: "why_committee1",
  committee2: "committee2",
  whyCommittee2: "why_committee2",
  committee3: "committee3",
  whyCommittee3: "why_committee3",
  strengths: "strengths",
  facebook: "facebook",
};

export const userService = {
  async getBasicInfo(authUserId) {
    const [user] = await sql`
      SELECT 
        id, 
        auth_user_id,
        first_name, 
        last_name, 
        dob, 
        mobile, 
        present_address, 
        student_number, 
        degree, 
        role 
      FROM user_info 
      WHERE auth_user_id = ${authUserId}
    `;
    return user;
  },

  async verifyAuthUser(authUserId) {
    const [userExists] = await sql`
      SELECT 1 FROM neon_auth.user WHERE id = ${authUserId}
    `;
    return !!userExists;
  },

  async completeProfile(authUserId, profileData) {
    // Map camelCase to snake_case and filter empty values
    const dbFields = {};
    Object.entries(PROFILE_FIELDS).forEach(([camelKey, snakeKey]) => {
      const value = profileData[camelKey];
      // include if value exists and is not empty string
      if (value !== undefined && value !== null && value !== "") {
        dbFields[snakeKey] = value;
      }
    });

    dbFields.auth_user_id = authUserId;

    if (!dbFields.first_name || !dbFields.last_name) {
      throw new Error("Missing required fields: first_name or last_name");
    }

    const columns = Object.keys(dbFields);
    const values = Object.values(dbFields);

    const columnList = columns.join(", ");
    const valuePlaceholders = columns.map((_, i) => `$${i + 1}`).join(", ");

    // UPDATE clause for ON CONFLICT
    const updateClauses = columns
      .filter((col) => col !== "auth_user_id")
      .map((col, i) => `${col} = $${columns.indexOf(col) + 1}`)
      .join(", ");

    const result = await sql`
      INSERT INTO user_info ${sql(dbFields)}
      ON CONFLICT (auth_user_id)
      DO UPDATE SET ${sql(
        dbFields,
        columns.filter((c) => c !== "auth_user_id"),
      )}
      RETURNING *
    `;

    return result[0];
  },

  async getCompleteInfo(authUserId) {
    const [user] = await sql`
      SELECT * FROM user_info WHERE auth_user_id = ${authUserId}
    `;
    return user;
  },

  async getUserJoinedEvents(id) {
    let userInfoId = id;

    if (isNaN(id)) {
      const [userRow] = await sql`
        SELECT id FROM user_info WHERE auth_user_id = ${id}
      `;
      if (!userRow) return [];
      userInfoId = userRow.id;
    }

    const events = await sql`
      SELECT 
        e.id,
        e.event_title,
        e.start_date,
        e.end_date,
        ev.volunteer_status
      FROM event_volunteers ev
      INNER JOIN events e ON ev.event_id = e.id
      WHERE ev.user_id = ${userInfoId}
        AND ev.deleted_at IS NULL
      ORDER BY e.start_date ASC
    `;

    return events;
  },

  async checkExistingMember(email) {
    const normalizedEmail = email.trim().toLowerCase();
    const [result] = await sql`
      SELECT 1 
      FROM existing_members 
      WHERE LOWER(up_email) = ${normalizedEmail}
      LIMIT 1
    `;
    return !!result;
  },
};
