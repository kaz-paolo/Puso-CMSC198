import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  getEventVolunteers,
  joinEvent,
} from "../controllers/eventsController.js";

const router = express.Router();

router.get("/", getAllEvents);

router.post("/", createEvent);

router.get("/:id", getEventById);

router.get("/:eventId/volunteers", getEventVolunteers);

router.post("/:eventId/join", joinEvent);

export default router;
