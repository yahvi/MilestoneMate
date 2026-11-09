import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';
import { mockDB } from '../utils/mockDB.js';

class NotificationService {
  async notify({ userId, title, message, type = 'info', projectId = null, milestoneId = null }) {
    if (!userId) return null;
    try {
      if (mongoose.connection.readyState === 1) {
        return await Notification.create({
          userId,
          title,
          message,
          type,
          relatedProjectId: projectId,
          relatedMilestoneId: milestoneId,
        });
      } else {
        const notif = {
          _id: '6600000000000000' + Math.floor(10000000 + Math.random() * 90000000),
          userId: userId.toString(),
          title,
          message,
          type,
          relatedProjectId: projectId,
          relatedMilestoneId: milestoneId,
          isRead: false,
          createdAt: new Date(),
        };
        mockDB.notifications.unshift(notif);
        return notif;
      }
    } catch (err) {
      console.error('Failed to create notification:', err.message);
      return null;
    }
  }

  async logActivity({ projectId, userId, action, description }) {
    if (!projectId || !userId) return null;
    try {
      if (mongoose.connection.readyState === 1) {
        return await ActivityLog.create({
          projectId,
          userId,
          action,
          description,
        });
      } else {
        const log = {
          _id: '6600000000000000' + Math.floor(10000000 + Math.random() * 90000000),
          projectId: projectId.toString(),
          userId: userId.toString(),
          action,
          description,
          createdAt: new Date(),
        };
        mockDB.activities.unshift(log);
        return log;
      }
    } catch (err) {
      console.error('Failed to log activity:', err.message);
      return null;
    }
  }
}

export default new NotificationService();
