import express from "express";
import {
  completeProfile,
  getAllUsers,
  getBasicInfo,
  getCompleteInfo,
} from "../controllers/usersController.js";

const router = express.Router();

router.get("/", getAllUsers);

router.get("/basic-info/:id", getBasicInfo);

router.get("/user-info/:id", getCompleteInfo);

router.post("/complete-profile", completeProfile);

export default router;
