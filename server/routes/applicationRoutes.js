import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getApplicationStats,
  getUpcomingFollowUps,
} from "../controllers/applicationController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/stats", getApplicationStats);
router.get("/upcoming-followups", getUpcomingFollowUps);

router.post("/", createApplication);
router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;
