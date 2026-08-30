import express from "express";

import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// APPLY FOR JOB
// ==========================================

router.post("/:jobId", authMiddleware, applyForJob);

// ==========================================
// GET MY APPLICATIONS - CANDIDATE
// ==========================================

router.get("/my-applications", authMiddleware, getMyApplications);

// ==========================================
// GET APPLICATIONS FOR MY JOB - RECRUITER
// ==========================================

router.get("/job/:jobId", authMiddleware, getJobApplications);

// ==========================================
// UPDATE APPLICATION STATUS - RECRUITER
// ==========================================

router.patch("/:applicationId/status", authMiddleware, updateApplicationStatus);

export default router;
