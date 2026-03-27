import express from "express";
import {
  completeProfile,
  getAllUsers,
  getBasicInfo,
  getCompleteInfo,
  getUserJoinedEvents,
  checkExistingMember,
} from "./user.controller.js";
import userStatsRoutes from "./userStats.routes.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/complete-profile", completeProfile);
router.post("/check-existing", checkExistingMember);

// User stats routes
router.use("/:userId/stats", userStatsRoutes);

// Get basic info by auth ID
router.get("/:id/basic-info", getBasicInfo);

// Get complete info by auth ID
router.get("/:id/complete-info", getCompleteInfo);

// Get joined events
router.get("/:id/joined-events", getUserJoinedEvents);

export default router;
