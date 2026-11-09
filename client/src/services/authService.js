import api from './api.js';

export const authService = {
  async register(userData) {
    const res = await api.post('/auth/register', userData);
    if (res.data.token) {
      localStorage.setItem('milestonemate_token', res.data.token);
      localStorage.setItem('milestonemate_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem('milestonemate_token', res.data.token);
      localStorage.setItem('milestonemate_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data.user;
  },

  async updateProfile(profileData) {
    const res = await api.put('/auth/profile', profileData);
    if (res.data.user) {
      localStorage.setItem('milestonemate_user', JSON.stringify(res.data.user));
    }
    return res.data.user;
  },

  async updatePassword(passwordData) {
    const res = await api.put('/auth/password', passwordData);
    return res.data;
  },

  logout() {
    localStorage.removeItem('milestonemate_token');
    localStorage.removeItem('milestonemate_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('milestonemate_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('milestonemate_token');
  },
};
