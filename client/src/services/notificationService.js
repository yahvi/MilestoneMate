import api from './api.js';

export const notificationService = {
  async getNotifications() {
    const res = await api.get('/notifications');
    return res.data;
  },

  async markAsRead(id) {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data.notification;
  },

  async markAllAsRead() {
    const res = await api.put('/notifications/mark-all/read');
    return res.data;
  },
};
