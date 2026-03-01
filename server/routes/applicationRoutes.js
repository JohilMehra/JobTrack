import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getUpcomingFollowUps } from "../controllers/applicationController.js";

import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getApplicationStats,
  processEmail, // ⭐ NEW
} from "../controllers/applicationController.js";

const router = express.Router();

// 🔐 Protect all routes
router.use(authMiddleware);

// ======================================================
// 🚀 SPECIAL ROUTES (keep BEFORE /:id)
// ======================================================

router.post("/process-email", processEmail); // ⭐ NEW
router.get("/stats", getApplicationStats);
router.get("/upcoming-followups", getUpcomingFollowUps);

// ======================================================
// 📦 CRUD ROUTES
// ======================================================

router.post("/", createApplication);
router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;