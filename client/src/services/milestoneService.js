import api from './api.js';

export const milestoneService = {
  async getMilestones(projectId) {
    const res = await api.get(`/milestones/project/${projectId}`);
    return res.data.milestones;
  },

  async createMilestone(projectId, milestoneData) {
    const res = await api.post(`/milestones/project/${projectId}`, milestoneData);
    return res.data.milestone;
  },

  async saveBulkMilestones(projectId, milestones) {
    const res = await api.post(`/milestones/project/${projectId}/bulk`, { milestones });
    return res.data.milestones;
  },

  async updateMilestone(id, updateData) {
    const res = await api.put(`/milestones/${id}`, updateData);
    return res.data.milestone;
  },

  async submitMilestone(id, { deliverables, submissionNotes }) {
    const res = await api.post(`/milestones/${id}/submit`, { deliverables, submissionNotes });
    return res.data;
  },

  async approveMilestone(id, feedback = '') {
    const res = await api.post(`/milestones/${id}/approve`, { feedback });
    return res.data;
  },

  async requestRevision(id, feedback) {
    const res = await api.post(`/milestones/${id}/request-revision`, { feedback });
    return res.data;
  },
};
