import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    // ==========================================
    // JOB BASIC INFORMATION
    // ==========================================

    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },

    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },

    // ==========================================
    // JOB DETAILS
    // ==========================================

    salary: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    jobType: {
      type: String,
      enum: ["Full Time", "Part Time", "Internship", "Contract", "Remote"],
      required: [true, "Job type is required"],
    },

    experience: {
      type: String,
      trim: true,
      default: "Fresher",
    },

    skills: {
      type: [String],
      default: [],
    },

    // ==========================================
    // JOB STATUS
    // ==========================================

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },

    // ==========================================
    // RECRUITER
    // ==========================================

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
