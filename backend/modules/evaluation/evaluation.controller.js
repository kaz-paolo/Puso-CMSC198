import { evaluationService } from "./evaluation.service.js";

export const evaluationController = {
  async getPendingEvaluations(req, res) {
    try {
      const data = await evaluationService.getPendingEvaluations(
        req.params.userId,
      );
      res.status(200).json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch pending evaluations" });
    }
  },
  async getEvaluationHistory(req, res) {
    try {
      const data = await evaluationService.getEvaluationHistory(
        req.params.userId,
      );
      res.status(200).json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch history" });
    }
  },
  async getEvaluationQuestions(req, res) {
    try {
      const data = await evaluationService.getEvaluationQuestions(
        req.params.eventId,
      );
      res.status(200).json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch questions" });
    }
  },
  async submitEvaluation(req, res) {
    try {
      const { userId, answers } = req.body;
      await evaluationService.submitEvaluation(
        req.params.eventId,
        userId,
        answers,
      );
      res.status(201).json({ success: true });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to submit evaluation" });
    }
  },
  async submitGeneralFeedback(req, res) {
    try {
      const data = await evaluationService.submitGeneralFeedback(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to submit feedback" });
    }
  },
  async getAdminEvaluations(req, res) {
    try {
      const data = await evaluationService.getAdminEvaluations();
      res.status(200).json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch evaluations" });
    }
  },
  async launchEvaluation(req, res) {
    try {
      const { questions } = req.body;
      await evaluationService.launchEvaluation(req.params.eventId, questions);
      res.status(200).json({ success: true });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to launch evaluation" });
    }
  },
  async closeEvaluation(req, res) {
    try {
      await evaluationService.closeEvaluation(req.params.eventId);
      res.status(200).json({ success: true });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to close evaluation" });
    }
  },
  async getEvaluationResults(req, res) {
    try {
      const data = await evaluationService.getEvaluationResults(
        req.params.eventId,
      );
      res.status(200).json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch results" });
    }
  },
  async rateVolunteer(req, res) {
    try {
      const { userId, rating, note, adminId } = req.body;
      const data = await evaluationService.rateVolunteer(
        req.params.eventId,
        userId,
        adminId,
        rating,
        note,
      );
      res.status(200).json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to rate volunteer" });
    }
  },
};
