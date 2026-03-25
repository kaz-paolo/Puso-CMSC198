import express from "express";
import {
  completeProfile,
  getAllUsers,
  getBasicInfo,
  getCompleteInfo,
  getUserJoinedEvents,
  checkExistingMember,
} from "./user.controller.js";

const router = express.Router();

// Get all users
router.get("/", getAllUsers);

// Get basic info by auth ID
router.get("/:id/basic-info", getBasicInfo);

// Get complete info by auth ID
router.get("/:id/complete-info", getCompleteInfo);

// Update/Complete profile
router.post("/complete-profile", completeProfile);

// Get joined events
router.get("/:id/joined-events", getUserJoinedEvents);

// Check existing member
router.post("/check-existing/", checkExistingMember);

export default router;
