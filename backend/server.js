import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./routes/usersRoutes.js";
import { sql } from "./config/db.js";
import { initDb } from "./config/initDb.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev")); // logs requests to console

app.get("/", (req, res) => {
  res.send("Hello test route");
});

// app.get("api/products", (req, res) => {
//   // get all products from db
//   res.status(200).json({
//     success: true,
//     data: [
//       { id: 1, name: "Product 1" },
//       { id: 2, name: "Product 2" },
//     ],
//   });
// });

app.use("/api/users", usersRoutes);

// async function initDB() {
//   try {
//     await sql`
//       CREATE TABLE IF NOT EXISTS products (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         image VARCHAR(255) NOT NULL,
//         price decimal(10,2) NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP.
//       )
//     `;

//     console.log("Database initialized successfully.");
//   } catch (error) {
//     console.log("Error initDB", error);
//   }
// }

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
