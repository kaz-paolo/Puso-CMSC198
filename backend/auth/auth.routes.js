import express from "express";
import * as authController from "./auth.controller.js";

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/verify", authController.verifyEmail);
router.post("/login", authController.login);
router.get("/session", authController.getSession);

export default router;
