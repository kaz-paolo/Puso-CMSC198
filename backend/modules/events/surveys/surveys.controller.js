import * as SurveyService from "./surveys.service.js";

export async function getEventSurvey(req, res) {
  try {
    const survey = await SurveyService.getSurvey(req.params.eventId);
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
    const result = await SurveyService.saveSurvey(req.params.eventId, req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error saving survey" });
  }
}

export async function getSurveyResponses(req, res) {
  try {
    const responses = await SurveyService.getResponses(req.params.eventId);
    res.json({ success: true, data: responses });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching responses" });
  }
}
