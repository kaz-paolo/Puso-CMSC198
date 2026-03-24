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
      if (value !== undefined && value !== null && value !== "") {
        dbFields[snakeKey] = value;
      } else {
        dbFields[snakeKey] = null;
      }
    });

    if (!dbFields.first_name || !dbFields.last_name) {
      throw new Error("Missing required fields: first_name or last_name");
    }

    const result = await sql`
      INSERT INTO user_info (
        auth_user_id,
        first_name, middle_name, last_name, student_number, nickname,
        sex, civil_status, dob, birth_place, height, weight,
        blood_type, languages, mobile, hometown, present_address,
        classification, college, degree, year_level, year_graduated,
        campus, designation, organization, organizations, illness,
        arukahik_join_date, hobbies, skills, expertise, software,
        committee1, why_committee1, committee2, why_committee2,
        committee3, why_committee3, strengths, facebook
      ) VALUES (
        ${authUserId},
        ${dbFields.first_name}, ${dbFields.middle_name}, ${dbFields.last_name}, ${dbFields.student_number}, ${dbFields.nickname},
        ${dbFields.sex}, ${dbFields.civil_status}, ${dbFields.dob}, ${dbFields.birth_place}, ${dbFields.height}, ${dbFields.weight},
        ${dbFields.blood_type}, ${dbFields.languages}, ${dbFields.mobile}, ${dbFields.hometown}, ${dbFields.present_address},
        ${dbFields.classification}, ${dbFields.college}, ${dbFields.degree}, ${dbFields.year_level}, ${dbFields.year_graduated},
        ${dbFields.campus}, ${dbFields.designation}, ${dbFields.organization}, ${dbFields.organizations}, ${dbFields.illness},
        ${dbFields.arukahik_join_date}, ${dbFields.hobbies}, ${dbFields.skills}, ${dbFields.expertise}, ${dbFields.software},
        ${dbFields.committee1}, ${dbFields.why_committee1}, ${dbFields.committee2}, ${dbFields.why_committee2},
        ${dbFields.committee3}, ${dbFields.why_committee3}, ${dbFields.strengths}, ${dbFields.facebook}
      )
      ON CONFLICT (auth_user_id) DO UPDATE SET
        first_name = COALESCE(EXCLUDED.first_name, user_info.first_name),
        middle_name = COALESCE(EXCLUDED.middle_name, user_info.middle_name),
        last_name = COALESCE(EXCLUDED.last_name, user_info.last_name),
        student_number = COALESCE(EXCLUDED.student_number, user_info.student_number),
        nickname = COALESCE(EXCLUDED.nickname, user_info.nickname),
        sex = COALESCE(EXCLUDED.sex, user_info.sex),
        civil_status = COALESCE(EXCLUDED.civil_status, user_info.civil_status),
        dob = COALESCE(EXCLUDED.dob, user_info.dob),
        birth_place = COALESCE(EXCLUDED.birth_place, user_info.birth_place),
        height = COALESCE(EXCLUDED.height, user_info.height),
        weight = COALESCE(EXCLUDED.weight, user_info.weight),
        blood_type = COALESCE(EXCLUDED.blood_type, user_info.blood_type),
        languages = COALESCE(EXCLUDED.languages, user_info.languages),
        mobile = COALESCE(EXCLUDED.mobile, user_info.mobile),
        hometown = COALESCE(EXCLUDED.hometown, user_info.hometown),
        present_address = COALESCE(EXCLUDED.present_address, user_info.present_address),
        classification = COALESCE(EXCLUDED.classification, user_info.classification),
        college = COALESCE(EXCLUDED.college, user_info.college),
        degree = COALESCE(EXCLUDED.degree, user_info.degree),
        year_level = COALESCE(EXCLUDED.year_level, user_info.year_level),
        year_graduated = COALESCE(EXCLUDED.year_graduated, user_info.year_graduated),
        campus = COALESCE(EXCLUDED.campus, user_info.campus),
        designation = COALESCE(EXCLUDED.designation, user_info.designation),
        organization = COALESCE(EXCLUDED.organization, user_info.organization),
        organizations = COALESCE(EXCLUDED.organizations, user_info.organizations),
        illness = COALESCE(EXCLUDED.illness, user_info.illness),
        arukahik_join_date = COALESCE(EXCLUDED.arukahik_join_date, user_info.arukahik_join_date),
        hobbies = COALESCE(EXCLUDED.hobbies, user_info.hobbies),
        skills = COALESCE(EXCLUDED.skills, user_info.skills),
        expertise = COALESCE(EXCLUDED.expertise, user_info.expertise),
        software = COALESCE(EXCLUDED.software, user_info.software),
        committee1 = COALESCE(EXCLUDED.committee1, user_info.committee1),
        why_committee1 = COALESCE(EXCLUDED.why_committee1, user_info.why_committee1),
        committee2 = COALESCE(EXCLUDED.committee2, user_info.committee2),
        why_committee2 = COALESCE(EXCLUDED.why_committee2, user_info.why_committee2),
        committee3 = COALESCE(EXCLUDED.committee3, user_info.committee3),
        why_committee3 = COALESCE(EXCLUDED.why_committee3, user_info.why_committee3),
        strengths = COALESCE(EXCLUDED.strengths, user_info.strengths),
        facebook = COALESCE(EXCLUDED.facebook, user_info.facebook)
      RETURNING *;
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
