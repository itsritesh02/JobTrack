import express from "express";

import { getMyNotifications } from "../controllers/notificationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

router.get("/", authMiddleware, getMyNotifications);

export default router;
