import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && error.response?.data?.expired && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// QR Code API
export const qrCodeAPI = {
  getAll: (params) => api.get('/qrcodes', { params }),
  getOne: (id) => api.get(`/qrcodes/${id}`),
  create: (data) => api.post('/qrcodes', data),
  update: (id, data) => api.put(`/qrcodes/${id}`, data),
  delete: (id) => api.delete(`/qrcodes/${id}`),
  download: (id, format = 'png') => api.get(`/qrcodes/${id}/download?format=${format}`, { responseType: 'blob' }),
  bulkUpload: (file) => {
    const formData = new FormData();
    formData.append('csv', file);
    return api.post('/qrcodes/bulk/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

// Analytics API
export const analyticsAPI = {
  getOverview: (days = 30) => api.get('/analytics/overview', { params: { days } }),
  getQRAnalytics: (qrCodeId, days = 30) => api.get(`/analytics/${qrCodeId}`, { params: { days } }),
};

export default api;
