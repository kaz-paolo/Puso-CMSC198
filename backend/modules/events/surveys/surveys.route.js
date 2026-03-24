import express from "express";
import * as SurveyController from "./surveys.controller.js";

const router = express.Router({ mergeParams: true }); // mergeParams is important to get :eventId

// Mount under /api/events/:eventId/survey
router.get("/", SurveyController.getEventSurvey);
router.put("/", SurveyController.updateEventSurvey);
router.get("/responses", SurveyController.getSurveyResponses);

export default router;
