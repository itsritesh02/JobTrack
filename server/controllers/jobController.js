import { validationResult } from "express-validator";
import Job from "../models/Job.js";

// ==========================================
// CREATE JOB
// ==========================================

export const createJob = async (req, res, next) => {
  try {
    // ==========================================
    // VALIDATION
    // ==========================================

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // ==========================================
    // GET JOB DATA
    // ==========================================

    const {
      title,
      company,
      description,
      salary,
      location,
      jobType,
      experience,
      skills,
    } = req.body;

    // ==========================================
    // CREATE JOB
    // ==========================================

    const job = await Job.create({
      title,
      company,
      description,
      salary,
      location,
      jobType,
      experience,
      skills,
      postedBy: req.user._id,
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: {
        job,
      },
    });
  } catch (error) {
    next(error);
  }
};
