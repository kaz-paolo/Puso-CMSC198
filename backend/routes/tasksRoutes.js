import express from "express";
import {
  getTasksByEventId,
  createTask,
} from "../controllers/tasksController.js";

const router = express.Router();

router.get("/:eventId/tasks", getTasksByEventId);
router.post("/:eventId/tasks", createTask);

export default router;
