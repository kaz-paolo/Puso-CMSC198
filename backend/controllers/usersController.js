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

    // Verify user exists
    const [userExists] = await sql`
      SELECT 1 FROM neon_auth.users_sync WHERE id = ${authUserId}
    `;

    if (!userExists) {
      return res.status(404).json({ error: "User not found in Neon Auth" });
    }

    // Map camelCase to snake_case
    const dbFields = {};
    Object.entries(PROFILE_FIELDS).forEach(([camelKey, snakeKey]) => {
      if (profileData[camelKey] !== undefined) {
        dbFields[snakeKey] = profileData[camelKey];
      }
    });

    // Add auth_user_id
    dbFields.auth_user_id = authUserId;

    // Generate dynamic SQL
    const columns = Object.keys(dbFields);
    const values = Object.values(dbFields);

    const updateClauses = columns
      .filter((col) => col !== "auth_user_id")
      .map((col) => `${col} = EXCLUDED.${col}`)
      .join(", ");

    const [result] = await sql`
      INSERT INTO user_info ${sql(dbFields)}
      ON CONFLICT (auth_user_id)
      DO UPDATE SET ${sql.unsafe(updateClauses)}
      RETURNING *
    `;

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("completeProfile error:", error);
    res.status(500).json({ error: "Server error" });
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

    const events = await sql`
      SELECT 
        e.id,
        e.event_title,
        e.start_date,
        e.end_date
      FROM event_volunteers ev
      INNER JOIN events e ON ev.event_id = e.id
      WHERE ev.user_id = ${id}
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
