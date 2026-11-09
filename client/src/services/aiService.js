import api from './api.js';

export const aiService = {
  async generateMilestones(params) {
    const res = await api.post('/ai/generate-milestones', params);
    return res.data.milestones;
  },

  async getProgressSummary(projectId) {
    const res = await api.post('/ai/progress-summary', { projectId });
    return res.data.summary;
  },

  async getNextTaskAdvice(projectId) {
    const res = await api.post('/ai/next-task', { projectId });
    return res.data.advice;
  },

  async getDelayAnalysis(projectId) {
    const res = await api.post('/ai/delay-analysis', { projectId });
    return res.data;
  },
};
