import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import { mockDB } from '../utils/mockDB.js';

export const getNotifications = async (req, res, next) => {
  try {
    const userIdStr = req.user._id.toString();

    if (mongoose.connection.readyState === 1) {
      const notifications = await Notification.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(30);

      const unreadCount = await Notification.countDocuments({
        userId: req.user._id,
        isRead: false,
      });

      return res.json({ success: true, unreadCount, notifications });
    } else {
      const notifications = mockDB.notifications
        .filter((n) => n.userId?.toString() === userIdStr)
        .slice(0, 30);
      const unreadCount = notifications.filter((n) => !n.isRead).length;

      return res.json({ success: true, unreadCount, notifications });
    }
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notifId = req.params.id;
    if (mongoose.connection.readyState === 1) {
      const notification = await Notification.findOneAndUpdate(
        { _id: notifId, userId: req.user._id },
        { isRead: true },
        { new: true }
      );
      return res.json({ success: true, notification });
    } else {
      const notification = mockDB.notifications.find((n) => n._id.toString() === notifId.toString());
      if (notification) notification.isRead = true;
      return res.json({ success: true, notification });
    }
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const userIdStr = req.user._id.toString();
    if (mongoose.connection.readyState === 1) {
      await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    } else {
      mockDB.notifications.forEach((n) => {
        if (n.userId?.toString() === userIdStr) n.isRead = true;
      });
    }
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};
