import express from "express";
import {
  getEventResources,
  createEventResource,
  updateEventResource,
  deleteEventResource,
} from "./resources.controller.js";

const router = express.Router();

// get resources for event
router.get("/:eventId/resources", getEventResources);
// OUTPUT data: ID, title, url, desc, uploader, sublinks{}

// insert resources for event
router.post("/:eventId/resources", createEventResource);
// INPUT data: title, url, desc, parentID, uploaded by

// update resources for event
router.put("/:eventId/resources/:resourceId", updateEventResource);
// UPDATE data: title, url, desc

// soft delete resources for event
router.delete("/:eventId/resources/:resourceId", deleteEventResource);
// soft  DELETE data: deleted by

export default router;
