import api from './api.js';

export const paymentService = {
  async createOrder(milestoneId) {
    const res = await api.post('/payments/create-order', { milestoneId });
    return res.data;
  },

  async captureOrder(orderId) {
    const res = await api.post('/payments/capture-order', { orderId });
    return res.data;
  },

  async getHistory() {
    const res = await api.get('/payments/history');
    return res.data.payments;
  },

  async getProjectPayments(projectId) {
    const res = await api.get(`/payments/project/${projectId}`);
    return res.data.payments;
  },
};
