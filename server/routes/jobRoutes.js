import express from "express";

import {
  createJob,
  getAllJobs,
  getJobById,
  searchJobs,
  updateJob,
  deleteJob,
  getMyJobs,
  getJobStats,
} from "../controllers/jobController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// GET MY JOBS
// ==========================================

router.get("/my-jobs", authMiddleware, getMyJobs);

// ==========================================
// SEARCH & FILTER JOBS
// ==========================================

router.get("/search", searchJobs);

// ==========================================
// GET JOB STATISTICS
// IMPORTANT: BEFORE /:id
// ==========================================

router.get("/stats", authMiddleware, getJobStats);

// ==========================================
// GET ALL ACTIVE JOBS
// ==========================================

router.get("/", getAllJobs);

// ==========================================
// CREATE JOB
// ==========================================

router.post("/", authMiddleware, createJob);

// ==========================================
// UPDATE JOB
// ==========================================

router.patch("/:id", authMiddleware, updateJob);

// ==========================================
// DELETE JOB
// ==========================================

router.delete("/:id", authMiddleware, deleteJob);

// ==========================================
// GET SINGLE JOB
// MUST BE LAST
// ==========================================

router.get("/:id", getJobById);

export default router;
