import express from "express";
import { eventsController } from "./events.controller.js";
import surveyRouter from "./surveys/surveys.route.js";

const router = express.Router();

router.get("/dashboard-stats", eventsController.getDashboardStats);
// get all events
router.get("/", eventsController.getAllEvents);
// OUTPUT data: event_id, event_title, volunteer_roles(role_name, capacity, current_count), current_volunteer

// create an event
router.post("/", eventsController.createEvent);
// INPUT data: events table: event_title, description, event_type, location, start_date, start_time, end_date, end_time, registration_allowed, approval_required, publish_event, volunteer_capacity
// INPUT data: event_volunteer_roles table: event_id, role_name, capacity

// get event by ID
router.get("/:id", eventsController.getEventById);
// get event surveyy
router.use("/:eventId/survey", surveyRouter);

//
// update event
// TODO
// router.get("");

// (soft) delete event
router.delete("/:eventId", eventsController.deleteEvent);

// archive event
// TODO
// router.get("");

export default router;
