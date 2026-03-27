import express from "express";
import { evaluationController } from "./evaluation.controller.js";

const router = express.Router();

// Volunteer routes
router.get("/user/:userId/pending", evaluationController.getPendingEvaluations);
router.get("/user/:userId/history", evaluationController.getEvaluationHistory);
router.get(
  "/event/:eventId/questions",
  evaluationController.getEvaluationQuestions,
);
router.post("/event/:eventId/submit", evaluationController.submitEvaluation);
router.post("/general", evaluationController.submitGeneralFeedback);

// Admin routes
router.get("/admin/events", evaluationController.getAdminEvaluations);
router.post(
  "/admin/event/:eventId/launch",
  evaluationController.launchEvaluation,
);
router.post(
  "/admin/event/:eventId/close",
  evaluationController.closeEvaluation,
);
router.get(
  "/admin/event/:eventId/results",
  evaluationController.getEvaluationResults,
);
router.post("/admin/event/:eventId/rate", evaluationController.rateVolunteer);

export default router;
