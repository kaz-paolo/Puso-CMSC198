import { surveysService } from "./surveys.service.js";
import { triggerZapierWebhook } from "../../../utils/webhook.js";

export async function getEventSurvey(req, res) {
  try {
    const survey = await surveysService.getSurvey(req.params.eventId);
    res.json({ success: true, data: survey });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching survey" });
  }
}

export async function updateEventSurvey(req, res) {
  try {
    const result = await surveysService.saveSurvey(
      req.params.eventId,
      req.body,
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error saving survey" });
  }
}

export async function getSurveyResponses(req, res) {
  try {
    const responses = await surveysService.getResponses(req.params.eventId);
    res.json({ success: true, data: responses });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching responses" });
  }
}

export async function getSurveyResponseById(req, res) {
  try {
    const response = await surveysService.getResponseByRegistrationId(
      req.params.eventId,
      req.params.registrationId,
    );
    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "Registration not found." });
    }
    res.json({ success: true, data: response });
  } catch (error) {
    console.error("Error fetching registration by ID:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching registration." });
  }
}

export async function submitSurveyResponse(req, res) {
  try {
    const result = await surveysService.submitResponse(
      req.params.eventId,
      req.body,
    );

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    if (error.code === "23505") {
      // (survey_id, email)
      return res.status(409).json({
        success: false,
        message: "This email has already been registered for this event.",
      });
    }
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    console.error("Error submitting survey response:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while submitting.",
    });
  }
}
