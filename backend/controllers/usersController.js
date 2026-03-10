import { sql } from "../config/db.js";

// Define field mappings once
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

export const getAllUsers = async (req, res) => {
  res.send("Get all users");
};

export const getBasicInfo = async (req, res) => {
  try {
    const { id } = req.params;

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
      WHERE auth_user_id = ${id}
    `;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error("getBasicInfo error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const completeProfile = async (req, res) => {
  try {
    const { authUserId, ...profileData } = req.body;

    if (!authUserId) {
      return res.status(400).json({ error: "authUserId is required" });
    }

    console.log("Completing profile for user:", authUserId);
    console.log("Received profile data:", profileData);

    // Verify user exists
    const [userExists] = await sql`
      SELECT 1 FROM neon_auth.user WHERE id = ${authUserId}
    `;

    if (!userExists) {
      console.error("User not found in neon_auth.user:", authUserId);
      return res.status(404).json({ error: "User not found in Neon Auth" });
    }

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

    console.log("Mapped database fields:", dbFields);

    // Check required fields
    if (!dbFields.first_name || !dbFields.last_name) {
      return res.status(400).json({
        error: "First name and last name are required",
        details: "Missing required fields",
      });
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

    const result = await sql.query(
      `INSERT INTO user_info (${columnList})
       VALUES (${valuePlaceholders})
       ON CONFLICT (auth_user_id)
       DO UPDATE SET ${updateClauses}
       RETURNING *`,
      values,
    );

    console.log("Profile completed successfully for user:", authUserId);

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("completeProfile error:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

export const getCompleteInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const [user] = await sql`
      SELECT * FROM user_info WHERE auth_user_id = ${id}
    `;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("getCompleteInfo error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export async function getUserJoinedEvents(req, res) {
  try {
    const { id } = req.params;

    let userInfoId = id;

    if (isNaN(id)) {
      const [userRow] = await sql`
        SELECT id FROM user_info WHERE auth_user_id = ${id}
      `;
      if (!userRow) {
        return res.json({ success: true, data: [] });
      }
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

    res.json({ success: true, data: events });
  } catch (error) {
    console.error("getUserJoinedEvents error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch joined events",
    });
  }
}

export async function checkExistingMember(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [result] = await sql`
      SELECT 1 
      FROM existing_members 
      WHERE LOWER(up_email) = ${normalizedEmail}
      LIMIT 1
    `;

    return res.status(200).json({
      success: true,
      exists: !!result,
    });
  } catch (error) {
    console.error("checkExistingMember error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check existing members",
    });
  }
}
