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

// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================

export const markNotificationAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    // ==========================================
    // FIND USER'S NOTIFICATION
    // ==========================================

    const notification = await Notification.findOne({
      _id: notificationId,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // ==========================================
    // MARK AS READ
    // ==========================================

    notification.isRead = true;

    await notification.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: {
        notification,
      },
    });
  } catch (error) {
    next(error);
  }
};





export const deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    // ==========================================
    // FIND USER'S NOTIFICATION
    // ==========================================

    const notification = await Notification.findOne({
      _id: notificationId,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // ==========================================
    // DELETE NOTIFICATION
    // ==========================================

    await Notification.findByIdAndDelete(notificationId);

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};