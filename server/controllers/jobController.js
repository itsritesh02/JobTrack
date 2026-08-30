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


// ==========================================
// GET ALL ACTIVE JOBS
// ==========================================

export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: "active" })
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: {
        jobs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET SINGLE JOB BY ID
// ==========================================

export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Job.findOne({
      _id: id,
      status: "active",
    }).populate("postedBy", "name email");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        job,
      },
    });
  } catch (error) {
    next(error);
  }
};



// ==========================================
// SEARCH & FILTER JOBS
// ==========================================

export const searchJobs = async (req, res, next) => {
  try {
    const {
      keyword,
      location,
      jobType,
      experience,
    } = req.query;

    const filter = {
      status: "active",
    };

    // ==========================================
    // KEYWORD SEARCH
    // ==========================================

    if (keyword) {
      filter.$or = [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          company: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }

    // ==========================================
    // LOCATION FILTER
    // ==========================================

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    // ==========================================
    // JOB TYPE FILTER
    // ==========================================

    if (jobType) {
      filter.jobType = jobType;
    }

    // ==========================================
    // EXPERIENCE FILTER
    // ==========================================

    if (experience) {
      filter.experience = {
        $regex: experience,
        $options: "i",
      };
    }

    // ==========================================
    // FIND JOBS
    // ==========================================

    const jobs = await Job.find(filter)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: {
        jobs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE JOB
// ==========================================

export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      title,
      company,
      description,
      salary,
      location,
      jobType,
      experience,
      skills,
      status,
    } = req.body;

    // ==========================================
    // FIND JOB
    // ==========================================

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ==========================================
    // CHECK JOB OWNER
    // ==========================================

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this job",
      });
    }

    // ==========================================
    // UPDATE FIELDS
    // ==========================================

    if (title !== undefined) {
      job.title = title;
    }

    if (company !== undefined) {
      job.company = company;
    }

    if (description !== undefined) {
      job.description = description;
    }

    if (salary !== undefined) {
      job.salary = salary;
    }

    if (location !== undefined) {
      job.location = location;
    }

    if (jobType !== undefined) {
      job.jobType = jobType;
    }

    if (experience !== undefined) {
      job.experience = experience;
    }

    if (skills !== undefined) {
      job.skills = skills;
    }

    if (status !== undefined) {
      job.status = status;
    }

    // ==========================================
    // SAVE
    // ==========================================

    await job.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: {
        job,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// DELETE JOB
// ==========================================

export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ==========================================
    // FIND JOB
    // ==========================================

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ==========================================
    // CHECK JOB OWNER
    // ==========================================

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this job",
      });
    }

    // ==========================================
    // DELETE JOB
    // ==========================================

    await Job.findByIdAndDelete(id);

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

