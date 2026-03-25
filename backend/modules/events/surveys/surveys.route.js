import express from "express";
import * as SurveyController from "./surveys.controller.js";

const router = express.Router({ mergeParams: true });
get: eventId;

// under /api/events/:eventId/survey
router.get("/", SurveyController.getEventSurvey);

router.post("/update", SurveyController.updateEventSurvey);
router.get("/responses", SurveyController.getSurveyResponses);
router.get("/active", SurveyController.getEventSurvey);
router.post("/submit", SurveyController.submitSurveyResponse);
router.get("/response/:registrationId", SurveyController.getSurveyResponseById);

export default router;
