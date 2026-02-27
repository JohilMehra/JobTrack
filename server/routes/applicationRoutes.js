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
} from "../controllers/applicationController.js";

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// CRUD Routes
router.post("/", createApplication);
router.get("/", getApplications);
router.get("/stats", getApplicationStats);
router.get("/upcoming-followups", getUpcomingFollowUps); // ⭐ move here
router.get("/:id", getApplicationById);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);


export default router;
