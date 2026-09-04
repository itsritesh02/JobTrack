import express from "express";

import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
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

// ==========================================
// WITHDRAW APPLICATION - CANDIDATE
// ==========================================

router.delete("/:applicationId/withdraw", authMiddleware, withdrawApplication);

export default router;
