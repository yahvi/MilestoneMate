import api from './api.js';

export const projectService = {
  async getProjects() {
    const res = await api.get('/projects');
    return res.data.projects;
  },

  async getProjectById(id) {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },

  async createProject(projectData) {
    const res = await api.post('/projects', projectData);
    return res.data.project;
  },

  async updateProject(id, updateData) {
    const res = await api.put(`/projects/${id}`, updateData);
    return res.data.project;
  },

  async deleteProject(id) {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  },
};
