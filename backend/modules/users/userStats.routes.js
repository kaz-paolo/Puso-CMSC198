import express from "express";
import { userStatsController } from "./userStats.controller.js";

const router = express.Router({ mergeParams: true });

// /api/users/:userId/stats

router.get("/", userStatsController.getUserStats);
router.post("/refresh", userStatsController.refreshUserStats);

export default router;
