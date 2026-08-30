import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // ==========================================
    // CANDIDATE WHO WILL RECEIVE NOTIFICATION
    // ==========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // NOTIFICATION MESSAGE
    // ==========================================

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // RELATED APPLICATION
    // ==========================================

    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    // ==========================================
    // READ / UNREAD
    // ==========================================

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
