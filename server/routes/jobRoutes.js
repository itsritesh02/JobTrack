import express from "express";

import { createJob } from "../controllers/jobController.js";

import { createJobValidator } from "../validators/jobValidator.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// CREATE JOB
// ==========================================

router.post("/", authMiddleware, createJobValidator, createJob);

export default router;
