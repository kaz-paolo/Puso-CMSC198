import express from "express";
import {
  completeProfile,
  createUser,
  getAllUsers,
  getBasicInfo,
} from "../controllers/usersController.js";

const router = express.Router();

router.get("/", getAllUsers);

router.get("/basic-info/:id", getBasicInfo);

router.post("/", createUser);

router.post("/complete-profile", completeProfile);

export default router;
