import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // ==========================================
    // CANDIDATE
    // ==========================================

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // JOB
    // ==========================================

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // ==========================================
    // APPLICATION STATUS
    // ==========================================

    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Rejected", "Interview", "Hired"],
      default: "Applied",
    },

    // ==========================================
    // COVER LETTER
    // ==========================================

    coverLetter: {
      type: String,
      trim: true,
      maxlength: [2000, "Cover letter cannot exceed 2000 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// PREVENT DUPLICATE APPLICATION
// Same candidate cannot apply twice
// to the same job
// ==========================================

applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
