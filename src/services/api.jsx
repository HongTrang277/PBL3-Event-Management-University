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
    try{
      const response = await api.get('/events');
      console.log('Response:', response);
      return response;
    }
    catch (error) {
      console.error('Error during getAllEvents:', error);
      throw error;
    }
  },
  getEvent: async (id) => {
    return api.get(`/events/${id}`);
  },
  createEvent: async (eventData) => {
    // Gửi dữ liệu sự kiện qua endpoint /events
    try {
      console.log('Sending eventtt data:', eventData);
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
  registerUserForEvent: async (userId, eventId)=>{
    try{
      const response = await api.post(`/registrations/${userId}/${eventId}`);
      console.log('Response:', response);
      return response.data;
    }
    catch (error) {
      console.error('Error during registerUserForEvent:', error);
      throw error;
    }
  },
  // Lấy danh sách tất cả các đăng ký
  getAllRegistrations: async () => {
    try {
      const response = await api.get('/registrations');
      return response.data; // Trả về danh sách đăng ký
    } catch (error) {
      console.error('Error fetching all registrations:', error);
      throw error;
    }
  },
  // Lấy danh sách người dùng đã đăng ký cho một sự kiện
  getUsersRegisteredForEvent: async (eventId) => {
    try {
      const response = await api.get(`/registrations/Users/${eventId}`);
      return response.data; // Trả về danh sách người dùng
    } catch (error) {
      console.error(`Error fetching users registered for event ${eventId}:`, error);
      throw error;
    }
  },
  // Lấy danh sách sự kiện mà một người dùng đã đăng ký
  getEventsUserRegisteredFor: async (userId) => {
    try {
      const response = await api.get(`/registrations/Events/${userId}`);
      return response.data; // Trả về danh sách sự kiện
    } catch (error) {
      console.error(`Error fetching events registered for user ${userId}:`, error);
      throw error;
    }
  },
  removeRegistration: async (registrationId) => {
    try {
      const response = await api.delete(`/registrations/${registrationId}`);
      return response.data; // Trả về kết quả hủy đăng ký
    } catch (error) {
      console.error(`Error removing registration ${registrationId}:`, error);
      throw error;
    }
  },
  

};

export default api;