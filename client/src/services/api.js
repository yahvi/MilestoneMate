import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  const cleaned = envUrl.trim().replace(/\/+$/, '');
  return cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('milestonemate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthenticated responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid and on protected route
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('milestonemate_token');
        localStorage.removeItem('milestonemate_user');
      }
    }
    return Promise.reject(error);
  }
);

// Helper to verify backend connectivity
export const checkBackendHealth = async () => {
  try {
    const res = await api.get('/health', { timeout: 60000 });
    return { ok: true, data: res.data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

export default api;
