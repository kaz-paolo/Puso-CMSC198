import express from "express";
import * as authController from "./auth.controller.js";
import { uploadProfile } from "../config/upload.js";

const router = express.Router();

router.post("/signup", uploadProfile.single("image"), authController.signUp);
router.post("/verify", authController.verifyEmail);
router.post("/login", authController.login);
router.get("/session", authController.getSession);

export default router;
