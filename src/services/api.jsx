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
      return response.data;
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
  registerUserForEvent: async (userId, eventId) => {
    try {
      // Swagger: POST /api/Registrations/{userId}/{eventId}
      const response = await api.post(`/Registrations/${userId}/${eventId}`); // Đảm bảo viết hoa 'R'
      // console.log('Response from registerUserForEvent:', response);
      return response.data;
    } catch (error) {
      // console.error('Error during registerUserForEvent:', error.response?.data || error.message);
      throw error;
    }
  },
  getAllRegistrations: async () => {
    try {
      // Swagger: GET /api/Registrations
      const response = await api.get('/Registrations'); // Đảm bảo viết hoa 'R'
      return response.data;
    } catch (error) {
      // console.error('Error fetching all registrations:', error.response?.data || error.message);
      throw error;
    }
  },
  getUsersRegisteredForEvent: async (eventId) => {
    try {
      const response = await api.get(`/Registrations/Users/${eventId}`);
      return response.data;
    } catch (error) {
      // console.error(`Error fetching users registered for event ${eventId}:`, error.response?.data || error.message);
      throw error;
    }
  },
  getEventsUserRegisteredFor: async (userId) => {
    try {
      const response = await api.get(`/Registrations/Events/${userId}`);
      return response.data;
    } catch (error) {
      // console.error(`Error fetching events registered for user ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  },
  removeRegistration: async (registrationId) => {
    try {
      // Swagger: DELETE /api/Registrations/{registrationId}
      const response = await api.delete(`/Registrations/${registrationId}`); // Đảm bảo viết hoa 'R'
      return response.data;
    } catch (error) {
      // console.error(`Error removing registration ${registrationId}:`, error.response?.data || error.message);
      throw error;
    }
  },
};

export const uploadService = {
  uploadFile: async (file) => {
    // Tạo đối tượng FormData
    const formData = new FormData();
    // 'file' là key mà API controller mong đợi (IFormFile file)
    formData.append('file', file);

    try {
      const response = await api.post('/uploads', formData, {
        headers: {
        'Content-Type': null, // Hoặc 'Content-Type': undefined
         }
      });
      console.log('File uploaded successfully:', response.data);
      return response.data; // API trả về kết quả từ _uploadService.SaveFileAsync(file)
    } catch (error) {
      console.error('Error uploading file:', error.response?.data || error.message);
      throw error;
    }
  },
  // Nếu bạn muốn có một hàm để lấy URL xem file (tương ứng với ViewFile)
  getFileUrl: (fileName) => {
    return `${API_URL}/uploads/${fileName}`;
  }
};

export default api;