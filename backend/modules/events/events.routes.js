import express from "express";
import { eventsController } from "./events.controller.js";

const router = express.Router();

// get all events
router.get("/", eventsController.getAllEvents);
// OUTPUT data: event_id, event_title, volunteer_roles(role_name, capacity, current_count), current_volunteer

// create an event
router.post("/", eventsController.createEvent);
// INPUT data: events table: event_title, description, event_type, location, start_date, start_time, end_date, end_time, registration_allowed, approval_required, publish_event, volunteer_capacity
// INPUT data: event_volunteer_roles table: event_id, role_name, capacity

// get event by ID
router.get("/:id", eventsController.getEventById);
//
// update event
// TODO
// router.get("");
// (soft) delete event
// TODO
// router.get("");
// archive event
// TODO
// router.get("");

export default router;
