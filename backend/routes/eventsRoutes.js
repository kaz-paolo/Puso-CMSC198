import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  getEventVolunteers,
  joinEvent,
  updateVolunteerStatus,
  removeVolunteer,
  getEventStats,
  getEventResources,
  createEventResource,
  updateEventResource,
  deleteEventResource,
} from "../controllers/eventsController.js";

const router = express.Router();

router.get("/", getAllEvents);
router.post("/", createEvent);
router.get("/:id", getEventById);

router.get("/:eventId/volunteers", getEventVolunteers);
router.post("/:eventId/join", joinEvent);

// volunteer role/join
router.put("/:eventId/volunteers/:userId/status", updateVolunteerStatus);
router.delete("/:eventId/volunteers/:userId", removeVolunteer);
router.get("/:eventId/stats", getEventStats);

// resource routes
router.get("/:eventId/resources", getEventResources);
router.post("/:eventId/resources", createEventResource);
router.put("/:eventId/resources/:resourceId", updateEventResource);
router.delete("/:eventId/resources/:resourceId", deleteEventResource);

export default router;
