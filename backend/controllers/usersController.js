import { sql } from "../config/db.js";

export const getAllUsers = async (req, res) => {
  res.send("Get all users");
};

export const createUser = async (req, res) => {
  res.send("Create new user");
};

export const completeProfile = async (req, res) => {
  try {
    const { authUserId, fullName, dob, mobile } = req.body;

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
      INSERT INTO user_info (auth_user_id, full_name, dob, mobile)
      VALUES (${authUserId}, ${fullName}, ${dob}, ${mobile})
      ON CONFLICT (auth_user_id)
      DO UPDATE SET 
        full_name = EXCLUDED.full_name,
        dob = EXCLUDED.dob,
        mobile = EXCLUDED.mobile
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
