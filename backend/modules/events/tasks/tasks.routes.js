import express from "express";
import {
  getTasksByEventId,
  createTask,
  updateTask,
  deleteTask,
} from "./tasks.controller.js";

const router = express.Router();

// Get tasks for event
router.get("/:eventId/tasks", getTasksByEventId);
// OUTPUT: todo{id, title etc}, inprogress{}, inreview{}, done{}

// Create task
router.post("/:eventId/tasks", createTask);
// INPUT: title, etc

// Update task
router.put("/:eventId/tasks/:taskId", updateTask);
// INPUT: status, assignees

// Delete task (soft delete)
router.delete("/:eventId/tasks/:taskId", deleteTask);
// INPUT: deletedby

export default router;
