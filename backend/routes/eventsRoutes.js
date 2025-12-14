import express from "express";
import { createEvent, getAllEvents, getEventById } from "../controllers/eventsController.js";

const router = express.Router();

router.get("/", getAllEvents);

router.post("/", createEvent);

router.get("/:id", getEventById);

export default router;
