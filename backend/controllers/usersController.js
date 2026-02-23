import { sql } from "../config/db.js";

export const getAllUsers = async (req, res) => {
  res.send("Get all users");
};

export const getBasicInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const result =
      await sql`SELECT id, first_name, last_name, dob, mobile, present_address, student_number, degree, role FROM user_info WHERE auth_user_id = ${id}`;

    if (result.length === 0)
      return res.status(404).json({ error: "User not found" });

    res.status(200).json({ success: true, data: result[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const completeProfile = async (req, res) => {
  try {
    const {
      authUserId,
      firstName,
      middleName,
      lastName,
      studentNumber,
      nickname,
      sex,
      civilStatus,
      birthDate,
      birthPlace,
      height,
      weight,
      bloodType,
      languages,
      mobile,
      hometown,
      presentAddress,
      classification,
      college,
      degree,
      yearLevel,
      yearGraduated,
      campus,
      designation,
      organization,
      organizations,
      illness,
      arukahikJoinDate,
      hobbies,
      skills,
      expertise,
      software,
      committee1,
      whyCommittee1,
      committee2,
      whyCommittee2,
      committee3,
      whyCommittee3,
      strengths,
      committeeCount,
      facebook,
    } = req.body;

    if (!authUserId) {
      return res.status(400).json({ error: "authUserId is required" });
    }

    const [userExists] = await sql`
      SELECT id FROM neon_auth.users_sync WHERE id = ${authUserId};
    `;

    if (!userExists) {
      return res.status(404).json({ error: "User not found in Neon Auth" });
    }

    const result = await sql`
      INSERT INTO user_info (
        auth_user_id,
        first_name,
        middle_name,
        last_name,
        student_number,
        nickname,
        sex,
        civil_status,
        dob,
        birth_place,
        height,
        weight,
        blood_type,
        languages,
        mobile,
        hometown,
        present_address,
        classification,
        college,
        degree,
        year_level,
        year_graduated,
        campus,
        designation,
        organization,
        organizations,
        illness,
        arukahik_join_date,
        hobbies,
        skills,
        expertise,
        software,
        committee1,
        why_committee1,
        committee2,
        why_committee2,
        committee3,
        why_committee3,
        strengths,
        facebook
      )
      VALUES (
        ${authUserId},
        ${firstName},
        ${middleName},
        ${lastName},
        ${studentNumber},
        ${nickname},
        ${sex},
        ${civilStatus},
        ${birthDate},
        ${birthPlace},
        ${height},
        ${weight},
        ${bloodType},
        ${languages},
        ${mobile},
        ${hometown},
        ${presentAddress},
        ${classification},
        ${college},
        ${degree},
        ${yearLevel},
        ${yearGraduated},
        ${campus},
        ${designation},
        ${organization},
        ${organizations},
        ${illness},
        ${arukahikJoinDate},
        ${hobbies},
        ${skills},
        ${expertise},
        ${software},
        ${committee1},
        ${whyCommittee1},
        ${committee2},
        ${whyCommittee2},
        ${committee3},
        ${whyCommittee3},
        ${strengths},
        ${facebook}
      )
      ON CONFLICT (auth_user_id)
      DO UPDATE SET
        first_name = EXCLUDED.first_name,
        middle_name = EXCLUDED.middle_name,
        last_name = EXCLUDED.last_name,
        student_number = EXCLUDED.student_number,
        nickname = EXCLUDED.nickname,
        sex = EXCLUDED.sex,
        civil_status = EXCLUDED.civil_status,
        dob = EXCLUDED.dob,
        birth_place = EXCLUDED.birth_place,
        height = EXCLUDED.height,
        weight = EXCLUDED.weight,
        blood_type = EXCLUDED.blood_type,
        languages = EXCLUDED.languages,
        mobile = EXCLUDED.mobile,
        hometown = EXCLUDED.hometown,
        present_address = EXCLUDED.present_address,
        classification = EXCLUDED.classification,
        college = EXCLUDED.college,
        degree = EXCLUDED.degree,
        year_level = EXCLUDED.year_level,
        year_graduated = EXCLUDED.year_graduated,
        campus = EXCLUDED.campus,
        designation = EXCLUDED.designation,
        organization = EXCLUDED.organization,
        organizations = EXCLUDED.organizations,
        illness = EXCLUDED.illness,
        arukahik_join_date = EXCLUDED.arukahik_join_date,
        hobbies = EXCLUDED.hobbies,
        skills = EXCLUDED.skills,
        expertise = EXCLUDED.expertise,
        software = EXCLUDED.software,
        committee1 = EXCLUDED.committee1,
        why_committee1 = EXCLUDED.why_committee1,
        committee2 = EXCLUDED.committee2,
        why_committee2 = EXCLUDED.why_committee2,
        committee3 = EXCLUDED.committee3,
        why_committee3 = EXCLUDED.why_committee3,
        strengths = EXCLUDED.strengths,
        facebook = EXCLUDED.facebook
      RETURNING *;
    `;

    res.status(200).json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("completeProfile error", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCompleteInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql`
      SELECT * FROM user_info WHERE auth_user_id = ${id};
    `;
    if (result.length === 0)
      return res.status(404).json({ error: "User not found" });

    res.status(200).json({ success: true, data: result[0] });
  } catch (error) {
    console.error(error);
  }
};

export async function getUserJoinedEvents(req, res) {
  try {
    const { id } = req.params;

    const events = await sql`
      SELECT 
        e.id,
        e.event_name,
        e.date,
        e.status
      FROM event_volunteers ev
      JOIN events e ON ev.event_id = e.id
      WHERE ev.user_id = ${id}
        AND e.status IN ('upcoming', 'ongoing')

    `;

    res.json({ success: true, data: events });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch joined events" });
  }
}

export async function checkExistingMember(req, res) {
  try {
    console.log("Check existing member");

    const { email } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const result = await sql`
      SELECT 1 
      FROM existing_members 
      WHERE up_email = ${normalizedEmail}
      LIMIT 1
    `;

    return res.status(200).json({
      success: true,
      exists: result.length > 0,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to check existing members" });
  }
}
