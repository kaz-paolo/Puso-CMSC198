import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./routes/usersRoutes.js";
import eventsRoutes from "./routes/eventsRoutes.js";
import tasksRoutes from "./routes/tasksRoutes.js";
import { sql } from "./config/db.js";
import { initDb } from "./config/initDb.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

app.use(morgan("dev")); // logs requests to console

// app.get("/", (req, res) => {
//   res.send("Hello test route");
// });

app.use("/api/users", usersRoutes);

app.use("/api/events", eventsRoutes);

app.use("/api/events", tasksRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
