import express from "express";
import {
  completeProfile,
  getAllUsers,
  getBasicInfo,
  getCompleteInfo,
  getUserJoinedEvents,
} from "../controllers/usersController.js";

const router = express.Router();

router.get("/", getAllUsers);

// router.get("/basic-info/:id", getBasicInfo);

router.get("/:id/basic-info", getBasicInfo);

// router.get("/user-info/:id", getCompleteInfo);

router.get("/:id/complete-info", getCompleteInfo);

router.post("/complete-profile", completeProfile);

router.get("/:id/joined-events", getUserJoinedEvents);

export default router;
