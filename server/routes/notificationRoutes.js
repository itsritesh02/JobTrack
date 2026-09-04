import express from "express";

import {
  getMyNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

router.get("/", authMiddleware, getMyNotifications);

// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================

router.patch("/:notificationId/read", authMiddleware, markNotificationAsRead);

// ==========================================
// DELETE NOTIFICATION
// ==========================================

router.delete("/:notificationId", authMiddleware, deleteNotification);

export default router;
