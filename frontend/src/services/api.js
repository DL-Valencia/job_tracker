import axios from 'axios';

// Get base URL and ensure it ends with /api/ correctly for proper joining
let baseURL = import.meta.env.VITE_API_URL || '/api';

if (baseURL.startsWith('http')) {
  // Ensure /api is present
  if (!baseURL.includes('/api')) {
    baseURL = baseURL.endsWith('/') ? `${baseURL}api/` : `${baseURL}/api/`;
  } 
  // Ensure trailing slash exists for relative joining
  else if (!baseURL.endsWith('/')) {
    baseURL = `${baseURL}/`;
  }
} else if (baseURL === '/api') {
  baseURL = '/api/';
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jt_token');
      localStorage.removeItem('jt_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('auth/register', data),
  login: (data) => api.post('auth/login', data),
  getMe: () => api.get('auth/me'),
};

// ─── Applications ────────────────────────────────────────────────────────────
export const applicationsAPI = {
  getAll: (params) => api.get('applications', { params }),
  getOne: (id) => api.get(`applications/${id}`),
  create: (data) => api.post('applications', data),
  update: (id, data) => api.put(`applications/${id}`, data),
  delete: (id) => api.delete(`applications/${id}`),
};

// ─── System ──────────────────────────────────────────────────────────────────
export const systemAPI = {
  healthCheck: () => api.get('health'),
};

export default api;
