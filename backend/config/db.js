import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

// creates SQL connection
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
export const sql = neon(
  `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&channel_binding=require`
);
