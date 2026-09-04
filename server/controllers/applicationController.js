
import mongoose from "mongoose";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Notification from "../models/Notification.js";

// ==========================================
// APPLY FOR JOB
// ==========================================

export const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    // ==========================================
    // VALIDATE JOB ID
    // ==========================================

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // ==========================================
    // CHECK JOB
    // ==========================================

    const job = await Job.findOne({
      _id: jobId,
      status: "active",
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or no longer active",
      });
    }

    // ==========================================
    // PREVENT APPLYING TO OWN JOB
    // ==========================================

    if (job.postedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot apply to your own job",
      });
    }

    // ==========================================
    // CHECK EXISTING APPLICATION
    // ==========================================

    const existingApplication = await Application.findOne({
      candidate: req.user._id,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // ==========================================
    // CREATE APPLICATION
    // ==========================================

    const application = await Application.create({
      candidate: req.user._id,
      job: jobId,
      coverLetter:
        typeof coverLetter === "string" ? coverLetter.trim() : "",
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Job application submitted successfully",
      data: {
        application,
      },
    });
  } catch (error) {
    // Duplicate index safety
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    next(error);
  }
};

// ==========================================
// GET MY APPLICATIONS
// ==========================================

export const getMyApplications = async (req, res, next) => {
  try {
    // ==========================================
    // DEBUG USER
    // ==========================================

    console.log("LOGGED IN USER ID:", req.user._id);
    console.log("LOGGED IN USER:", req.user);

    // ==========================================
    // FIND APPLICATIONS
    // ==========================================

    const applications = await Application.find({
      candidate: req.user._id,
    })
      .populate(
        "job",
        "title company salary location jobType experience skills status",
      )
      .sort({ createdAt: -1 });

    console.log(
      "MY APPLICATIONS COUNT:",
      applications.length,
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: {
        applications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET APPLICATIONS FOR MY JOB
// ==========================================

export const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // ==========================================
    // VALIDATE JOB ID
    // ==========================================

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // ==========================================
    // FIND JOB
    // ==========================================

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ==========================================
    // CHECK JOB OWNER
    // ==========================================

    if (
      job.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view these applications",
      });
    }

    // ==========================================
    // FIND APPLICATIONS
    // ==========================================

    const applications = await Application.find({
      job: jobId,
    })
      .populate("candidate", "name email profile")
      .populate(
        "job",
        "title company location jobType experience",
      )
      .sort({ createdAt: -1 });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: {
        applications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE APPLICATION STATUS
// ==========================================

export const updateApplicationStatus = async (
  req,
  res,
  next,
) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // ==========================================
    // VALIDATE APPLICATION ID
    // ==========================================

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    // ==========================================
    // VALIDATE STATUS
    // ==========================================

    const allowedStatuses = [
      "Applied",
      "Shortlisted",
      "Rejected",
      "Interview",
      "Hired",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    // ==========================================
    // FIND APPLICATION
    // ==========================================

    const application =
      await Application.findById(applicationId).populate(
        "job",
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // ==========================================
    // CHECK JOB OWNER
    // ==========================================

    if (
      application.job.postedBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this application",
      });
    }

    // ==========================================
    // UPDATE STATUS
    // ==========================================

    application.status = status;

    await application.save();

    // ==========================================
    // CREATE NOTIFICATION
    // ==========================================

    const notification = await Notification.create({
      user: application.candidate,
      application: application._id,
      message: `Your application for ${application.job.title} at ${application.job.company} has been ${status}.`,
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: {
        application,
        notification,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// WITHDRAW APPLICATION
// ==========================================

export const withdrawApplication = async (
  req,
  res,
  next,
) => {
  try {
    const { applicationId } = req.params;

    // ==========================================
    // VALIDATE APPLICATION ID
    // ==========================================

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    // ==========================================
    // FIND CANDIDATE'S APPLICATION
    // ==========================================

    const application = await Application.findOne({
      _id: applicationId,
      candidate: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // ==========================================
    // PREVENT WITHDRAWING AFTER FINAL DECISION
    // ==========================================

    if (
      application.status === "Hired" ||
      application.status === "Rejected"
    ) {
      return res.status(400).json({
        success: false,
        message: `You cannot withdraw an application with status "${application.status}"`,
      });
    }

    // ==========================================
    // DELETE APPLICATION
    // ==========================================

    await Application.findByIdAndDelete(applicationId);

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
    });
  } catch (error) {
    next(error);
  }
};
