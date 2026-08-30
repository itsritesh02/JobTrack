import express from "express";

import {
  createJob,
  getAllJobs,
  getJobById,
  searchJobs,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

import { createJobValidator } from "../validators/jobValidator.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// CREATE JOB
// ==========================================

router.post("/", authMiddleware, createJobValidator, createJob);

// ==========================================
// SEARCH & FILTER JOBS
// ==========================================

router.get("/search", searchJobs);

// ==========================================
// GET ALL ACTIVE JOBS
// ==========================================

router.get("/", getAllJobs);

// ==========================================
// UPDATE JOB
// ==========================================

router.put("/:id", authMiddleware, updateJob);

// ==========================================
// DELETE JOB
// ==========================================

router.delete("/:id", authMiddleware, deleteJob);

// ==========================================
// GET SINGLE JOB
// ==========================================

router.get("/:id", getJobById);

export default router;
