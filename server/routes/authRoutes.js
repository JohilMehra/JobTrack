import express from "express";
import { googleLogin } from "../controllers/googleAuthController.js";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/google", googleLogin);

// Protected Route
router.get("/me", authMiddleware, getMe);

export default router;
