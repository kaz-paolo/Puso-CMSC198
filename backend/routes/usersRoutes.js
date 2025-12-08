import express from "express";
import {
  createUser,
  getAllUsers,
  updateDisplayName,
} from "../controllers/usersController.js";

const router = express.Router();

router.get("/", getAllUsers);

router.post("/", createUser);

router.post("/update-displayname", updateDisplayName);

export default router;
