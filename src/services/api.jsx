import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5044/api';
console.log('API_URL:', API_URL);
// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để gắn token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Các service cho từng tính năng
export const authService = {
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },
  getProfile: async () => {
    return api.get('/auth/profile');
  },
};

export const eventService = {
  getAllEvents: async () => {
    return api.get('/events');
  },
  getEvent: async (id) => {
    return api.get(`/events/${id}`);
  },
  createEvent: async (eventData) => {
    // Gửi dữ liệu sự kiện qua endpoint /events
    try {
      console.log('Sending event data:', eventData);
      const response = await api.post('/events', eventData);
      console.log('Response:', response);
      return response;
    } catch (error) {
      console.error('Error during createEvent:', error);
      throw error;
    }
  },
  updateEvent: async (id, eventData) => {
    return api.put(`/events/${id}`, eventData);
  },
  deleteEvent: async (id) => {
    return api.delete(`/events/${id}`);
  },
  
};

export const categoryService = {
  getAllCategories: async () => {
    return api.get('/categories');
  },
};

export const registrationService = {
  registerForEvent: async (eventId, registrationData) => {
    return api.post(`/events/${eventId}/registrations`, registrationData);
  },
  getRegistrations: async (eventId) => {
    return api.get(`/events/${eventId}/registrations`);
  },
  cancelRegistration: async (registrationId) => {
    return api.delete(`/registrations/${registrationId}`);
  },
};

export default api;