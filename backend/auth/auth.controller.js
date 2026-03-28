import { sql } from "../config/db.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET;

// random 32 char hex string as unique primary key ID
const generateId = () => crypto.randomBytes(16).toString("hex");

// construct JWT (json web token)
const createToken = (payload) => {
  // algorithm and token type
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
  ).toString("base64url");
  // encode the payload (e.g., user ID, role)
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  // cryptographic signature for token
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
};

// validate an incoming JWT and extract payload
const verifyToken = (token) => {
  try {
    const [header, body, signature] = token.split(".");
    // try to remake the signature with what recieved
    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");
    // if not match
    if (signature !== expectedSig) return null;
    // if match, decode and return the payload
    return JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
  } catch (err) {
    return null;
  }
};

// user registration
export const signUp = async (req, res) => {
  try {
    const { email, password, firstName, middleName, lastName } = req.body;

    // if email exists
    const [existing] = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing)
      return res.status(400).json({ error: "Email already exists" });

    const userId = generateId();

    // insert new user profile details
    await sql`
      INSERT INTO users (id, first_name, middle_name, last_name, email)
      VALUES (${userId}, ${firstName}, ${middleName || null}, ${lastName}, ${email})
    `;

    // generate ID and hashed password
    const accountId = generateId();
    // hash passowrd, 10 salt
    const hashedPass = await bcrypt.hash(password, 10);

    // insert authentication credentials
    await sql`
      INSERT INTO accounts (id, user_id, provider, provider_account_id, password)
      VALUES (${accountId}, ${userId}, 'credential', ${email}, ${hashedPass})
    `;

    // generated 6 digit otp for verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationId = generateId();
    // expire after 15 mins
    const expiresAt = new Date(Date.now() + 15 * 60000);

    // insert otp to database
    await sql`
      INSERT INTO verifications (id, identifier, value, expires_at)
      VALUES (${verificationId}, ${email}, ${otp}, ${expiresAt})
    `;

    res.status(200).json({ verificationCode: otp });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during signup" });
  }
};

// validate otp
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // look for match and unexpired
    const [verification] = await sql`
      SELECT id FROM verifications
      WHERE identifier = ${email} AND value = ${otp} AND expires_at > NOW()
      ORDER BY created_at DESC LIMIT 1
    `;

    if (!verification)
      return res.status(400).json({ error: "Invalid or expired code" });

    // update email as verified
    await sql`UPDATE users SET email_verified = NOW() WHERE email = ${email}`;
    // delete otp
    await sql`DELETE FROM verifications WHERE identifier = ${email}`;

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ error: "Server error during verification" });
  }
};

// authenticate login and generate JWT session
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find email
    const [account] = await sql`
      SELECT user_id, password FROM accounts 
      WHERE provider_account_id = ${email} AND provider = 'credential'
    `;

    if (!account)
      return res.status(400).json({ error: "Invalid email or password" });

    // compare input password
    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch)
      return res.status(400).json({ error: "Invalid email or password" });

    // fetch details
    const [user] =
      await sql`SELECT id, email, first_name, role FROM users WHERE id = ${account.user_id}`;

    // generate JWT with the details
    const token = createToken({
      id: user.id,
      email: user.email,
      name: user.first_name,
      role: user.role,
    });

    // token to frontend for future requests
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.first_name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

// get active user session based on jwt token
export const getSession = async (req, res) => {
  try {
    // find the bearer token header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    // decrypt  and validate token
    const payload = verifyToken(token);

    if (!payload) return res.status(401).json({ error: "Invalid token" });

    // use decrypted ID to get detail
    const [user] =
      await sql`SELECT id, email, first_name, role, email_verified FROM users WHERE id = ${payload.id}`;
    if (!user) return res.status(401).json({ error: "User not found" });

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.first_name,
        role: user.role,
        email_verified: user.email_verified,
      },
    });
  } catch (err) {
    console.error("Session error:", err);
    res.status(500).json({ error: "Server error fetching session" });
  }
};
