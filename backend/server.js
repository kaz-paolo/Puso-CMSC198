import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./modules/users/user.routes.js";
import eventsRoutes from "./modules/events/events.routes.js";
import tasksRoutes from "./modules/events/tasks/tasks.routes.js";
import resourcesRoutes from "./modules/events/resources/resources.routes.js";
import volunteersRoutes from "./modules/events/volunteers/volunteers.routes.js";
import evaluationRoutes from "./modules/evaluation/evaluation.routes.js";
import { initDb } from "./schema/initDb.js";
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

// Mount API routes
app.use("/api/users", usersRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/events", tasksRoutes);
app.use("/api/events", resourcesRoutes);
app.use("/api/events", volunteersRoutes);
app.use("/api/evaluation", evaluationRoutes);
// Example test route (optional)
// app.get("/api/products", (req, res) => {
//   res.status(200).json({
//     success: true,
//     data: [
//       { id: 1, name: "Product 1" },
//       { id: 2, name: "Product 2" },
//     ],
//   });
// });
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
