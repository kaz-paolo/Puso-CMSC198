import express from "express";
import {
  getEventVolunteers,
  joinEvent,
  updateVolunteerStatus,
  removeVolunteer,
  getEventStats,
} from "./volunteers.controller.js";

const router = express.Router();

// Get all volunteers for an event
router.get("/:eventId/volunteers", getEventVolunteers);
// OUTPUT data: id, first/lastname, student number, degree, mobile, email, rolename, status, role id, evuserid

// User joins an event
router.post("/:eventId/join", joinEvent);
// INPUT data: user id, role id

// Update volunteer status (e.g. Confirm, Decline) - Admin/Staff
router.put("/:eventId/volunteers/:userId/status", updateVolunteerStatus);
// INPUT data: status

// Remove volunteer (Soft delete) - Admin/Staff/User
router.delete("/:eventId/volunteers/:userId", removeVolunteer);
// DELETE: deleted by

// Get statistics for dashboard
router.get("/:eventId/stats", getEventStats);
// OUTPUT data: overall{confirmed,pending,declined}, byrole{id,name,capacity,confirmed,pending}

export default router;
