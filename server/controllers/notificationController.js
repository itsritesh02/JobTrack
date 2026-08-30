import Notification from "../models/Notification.js";

// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    })
      .populate("application", "status coverLetter createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: {
        notifications,
      },
    });
  } catch (error) {
    next(error);
  }
};
