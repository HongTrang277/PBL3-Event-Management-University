import axios from 'axios';
import { get } from 'lodash';
import { v4 as uuid } from 'uuid';
// Lấy URL API từ biến môi trường hoặc mặc định


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


export const eventService = {
  getAllEvents: async () => {
    try {
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
    try {
      console.log('Sending event data:', eventData);
      const response = await api.post('/events', eventData);

      // KHI THÀNH CÔNG: BE trả về object event.
      // Một response với status 2xx đã được coi là thành công bởi axios.
      // Ta chỉ cần kiểm tra xem dữ liệu trả về có đúng định dạng không.
      if (response.data && response.data.eventId) {
        console.log('Event created successfully:', response.data);
        return response.data; // Trả về object sự kiện đã được tạo
      } else {
        // Đây là trường hợp phòng vệ: API trả về 2xx nhưng không có dữ liệu event
        throw new Error('API không trả về dữ liệu sự kiện như mong đợi.');
      }

    } catch (error) {
      // KHỐI CATCH NÀY CHỈ CHẠY KHI BE TRẢ VỀ LỖI (HTTP 4xx hoặc 5xx)

      console.error('Error during createEvent:', error.response?.data || error.message);

      // Cố gắng lấy thông điệp lỗi tường minh từ BE
      let errorMessage = 'Tạo sự kiện thất bại. Vui lòng thử lại.';
      if (error.response?.data) {
        const errorData = error.response.data;
        // Xử lý lỗi validation của ASP.NET Core
        if (typeof errorData.errors === 'object') {
          errorMessage = Object.values(errorData.errors).flat().join(' ');
        }
        // Xử lý các lỗi dạng { message: "..." } hoặc chuỗi thuần
        else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string' && errorData.length > 0) {
          errorMessage = errorData;
        }
      }

      // Ném lại lỗi với thông điệp đã được làm sạch
      throw new Error(errorMessage);
    }
  },
  updateEvent: async (id, eventData) => {
    return api.put(`/events/${id}`, eventData);
  },
  deleteEvent: async (id) => {
    return api.delete(`/events/${id}`);
  },
  addFacultiesToScope: async (eventId, facultyIds) => {
    try {
      // Make sure facultyIds is an array
      const facultyIdsArray = Array.isArray(facultyIds) ? facultyIds : [facultyIds];

      // Send the array of faculty IDs to the backend
      const response = await api.post(`/events/${eventId}/AddFacultiesToScope`, facultyIdsArray, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Faculty scope response:', response);
      return response.data;
    } catch (error) {
      console.error('Error adding faculties to event scope:', error);
      throw error;
    }
  }
};

export const categoryService = {
  getAllCategories: async () => {
    return api.get('/categories');
  },
};

export const registrationService = {
  registerUserForEvent: async (userId, eventId) => {
    try {
      // Đăng ký người dùng cho sự kiện
      const response = await api.post(`/Registrations/${userId}/${eventId}`);
      console.log('Response from registerUserForEvent:', response.data);

      if (response.status === 200 || response.status === 201) {
        try {
          // Lấy email người dùng
          const userResponse = await api.get(`/appusers/${userId}`);
          console.log('User response:', userResponse);

          if (userResponse.data && userResponse.data.email) {
            const userEmail = userResponse.data.email;
            console.log('User email retrieved:', userEmail);

            // CÁCH 1: Gửi email thông qua query params (lựa chọn tốt nhất)
            await api.post(
              `http://localhost:5044/api/Email/SendRegisteredConfirmation/${eventId}`,
              [userEmail], // gửi array trong body
              {
                headers: {
                  "Content-Type": "application/json"
                }
              }
            );

            // HOẶC - CÁCH 2: Gửi email dưới dạng form data
            // const formData = new FormData();
            // formData.append('recipientEmails', userEmail);
            // await api.post(`/Email/SendRegisteredConfirmation/${eventId}`, formData);

            console.log('Email sent successfully to:', userEmail);
          } else {
            console.warn('User email not found in the response');
          }
        } catch (emailError) {
          console.error('Error sending registration confirmation email:', emailError);
          console.error('Error details:', emailError.response?.data || emailError.message);
        }
      }

      return response.data;
    } catch (error) {
      console.error('Error during registerUserForEvent:', error.response?.data || error.message);
      throw error;
    }
  },
  getUsersRegisteredForEvent: async (eventId) => {
    try {
      const response = await api.get(`/Registrations/Users/${eventId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(`Event ${eventId} has no registered users. Returning an empty array.`);
        return []; // Trả về mảng rỗng thay vì ném lỗi
      }
      console.error(`Error fetching users registered for event ${eventId}:`, error.response?.data || error.message);
      throw error;
    }
  },
  getEventsUserRegisteredFor: async (userId) => {
    try {
      const response = await api.get(`/Registrations/Events/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching events registered for user ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  },
  removeRegistration: async (eventId, userId) => {
    try {
      // Swagger: DELETE /api/Registrations/{registrationId}
      const response = await api.delete(`/Registrations/${eventId}/${userId}`); // Đảm bảo viết hoa 'R'
      return response.data;
    } catch (error) {
      console.error(`Error removing registration ${eventId}/${userId}:`, error.response?.data || error.message);
      throw error;
    }
  },
  getAllRegistrations: async () => {
    try {
      // Swagger: GET /api/Registrations
      const response = await api.get('/Registrations'); // Đảm bảo viết hoa 'R'
      return response.data;
    } catch (error) {
      console.error('Error fetching all registrations:', error.response?.data || error.message);
      throw error;
    }
  },
  getUserRegistrations: async (userId) => {
    try {
      const response = await registrationService.getAllRegistrations();
      // Lọc các đăng ký của người dùng theo userId
      const userRegistrations = response.filter(registration => registration.userId === userId);
      if (userRegistrations.length === 0) {
        console.warn(`No registrations found for user ${userId}`);
        return []; // Trả về mảng rỗng nếu không có đăng ký
      }
      return userRegistrations;
    } catch (error) {
      console.error(`Error fetching registrations for user ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  },


};
export const attendanceService = {
  // Lấy tất cả attendance
  getAllAttendances: async () => {
    const response = await api.get('/Attendances');
    return response.data;
  },
  // Lấy attendance theo registrationId
  getAttendanceByRegistrationId: async (registrationId) => {
    const response = await api.get(`/Attendances/${registrationId}`);
    return response.data;
  },
  // Chấm công (điểm danh)
  markAttendance: async ({ registrationId, latitude = 0, longitude = 0 }) => {
    try {
      const response = await api.post('/Attendances/Mark', {
        registrationId,
        latitude,
        longitude
      });
      return response.data;
    }
    catch (error) {
      console.error('Error marking attendance:', error.response?.data || error.message);
      throw error;
    }
  },

  // Lấy danh sách user đã điểm danh cho 1 event
  getUsersMarkedAttendanceForEvent: async (eventId) => {
    const response = await api.get(`/Attendances/Users/${eventId}`);
    return response.data;
  },
  // Lấy danh sách event user đã điểm danh
  getEventsUserMarkedAttendanceFor: async (userId) => {
    const response = await api.get(`/Attendances/Events/${userId}`);
    return response.data;
  },

  // Xóa attendance
  removeAttendance: async (attendanceId) => {
    const response = await api.delete(`/Attendances/${attendanceId}`);
    return response.data;
  },
  markAttendanceByQrCode: async (registrationId) => {
    try {
      const response = await api.post(`/Attendances/MarkByQRRegistration/${registrationId}`);
      return response.data;
    } catch (error) {
      console.error('Error marking attendance by QR code:', error.response?.data || error.message);
      throw error;
    }
  }
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

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      console.log('Login response:', response.data); // Thêm log để kiểm tra cấu trúc

      if (response.data.token) {
        // Store JWT token
        localStorage.setItem('token', response.data.token);

        // Store refresh token if your backend provides it
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }

        // Lưu thông tin user - điều chỉnh phù hợp với cấu trúc API trả về
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else if (response.data.userData) {
          localStorage.setItem('user', JSON.stringify(response.data.userData));
        }
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', {
        userName: userData.userName,
        email: userData.email,
        password: userData.password,
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  },
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await api.post('/auth/refresh', { token: refreshToken });

      // Update tokens in localStorage
      localStorage.setItem('token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }

      return response.data;
    } catch (error) {
      console.error('Refresh token error:', error.response?.data || error.message);
      throw error;
    }
  },
  logout: () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  getProfile: async () => {
    try {
      const response = await api.get('appusers/me');
      return response.data;
    }
    catch (error) {
      console.error('Error fetching profile:', error.response?.data || error.message);
      throw error;
    }
  },
  getUserRoles: async (userId) => {
    try {
      const response = await api.get(`/appusers/${userId}/roles`);
      return response.data;
    }
    catch (error) {
      console.error('Error fetching user roles:', error.response?.data || error.message);
      throw error;
    }
  },
  addUserToRole: async (userId, roleName) => {
    try {
      const response = await api.post(`/auth/roles/${userId}/add`, JSON.stringify(roleName), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding user to role:', error.response?.data || error.message);
      throw error;
    }
  },

  decodeToken: (token) => {
    try {
      // Base64Url decode
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decodedPayload = JSON.parse(jsonPayload);
      return decodedPayload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },
  getClaims: (tokenParam = null) => {
    const jwtToken = tokenParam || localStorage.getItem('token');
    if (!jwtToken) return null;

    try {
      // Kiểm tra tokenParam có phải là chuỗi không
      if (typeof jwtToken !== 'string') {
        console.error('JWT token is not a string:', jwtToken);
        return null;
      }

      const parts = jwtToken.split('.');
      if (parts.length !== 3) {
        console.error('Invalid JWT token format:', jwtToken);
        return null;
      }

      // Giải mã phần payload
      const encodedPayload = parts[1];
      const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');

      // Giải mã base64 an toàn
      try {
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
      } catch (e) {
        console.error('Error decoding base64:', e);
        // Fallback: thử decode trực tiếp
        try {
          const rawPayload = atob(base64);
          return JSON.parse(rawPayload);
        } catch (e2) {
          console.error('Error with fallback decoding:', e2);
          return null;
        }
      }
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  },
  hasRole: (role) => {
    const claims = authService.getClaims();
    if (!claims) return false;

    // Kiểm tra claim "role" hoặc "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    const roles = claims.role || claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (!roles) return false;

    // Nếu roles là mảng
    if (Array.isArray(roles)) {
      return roles.includes(role);
    }

    // Nếu roles là string
    return roles === role;
  },
  getUserById: async (userId) => {
    try {
      console.log(`Fetching user with ID: ${userId}`);
      const response = await api.get(`/appusers/${userId}`);

      // Check if we have valid data
      if (!response || !response.data) {
        console.warn('API returned empty response');
        return { data: null };
      }

      // Log the response for debugging
      console.log('API Response:', response);

      // Return formatted data
      return {
        data: {
          ...response.data,
          // Add default values for missing fields
          fullName: response.data.fullName || '',
          studentId: response.data.studentId || '',
          class: response.data.class || '',
          facultyId: response.data.facultyId || '',
          emailConfirmed: !!response.data.emailConfirmed,
          userImageUrl: response.data.userImageUrl || ''
        }
      };
    } catch (error) {
      console.error("Error in getUserById:", error);
      // Return a stable response with null data to avoid errors
      return { data: null };
    }
  },

  updateUserProfile: async (userId, userData) => {
    try {
      console.log(`Updating user ${userId} with data:`, userData);
      const response = await api.put(`/appusers/${userId}`, userData);
      return response;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }
}
export const facultyService = {
  getAllFaculties: async () => {
    try {
      const response = await api.get('/faculties');
      return response.data;
    } catch (error) {
      console.error('Error fetching faculties:', error.response?.data || error.message);
      throw error;
    }
  },
  getFacultyById: async (id) => {
    try {
      const response = await api.get(`/faculties/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching faculty with ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }
}
export const CategoryService = {
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error.response?.data || error.message);
      throw error;
    }
  },
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }
}
export const EventCategoryService = {
  getAllEventCategories: async () => {
    try {
      const response = await api.get('/eventcategories');
      return response.data;
    } catch (error) {
      console.error('Error fetching event categories:', error.response?.data || error.message);
      throw error;
    }
  },
  getEventCategoryById: async (id) => {
    try {
      const response = await api.get(`/eventcategories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event category with ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },
  // Cập nhật hàm addEventCategory trong api.jsx
  addEventCategory: async (eventId, categoryIds) => {
    try {
      // Chuyển đổi thành mảng nếu chưa phải
      const categoryArray = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
      if (categoryArray.length === 0) {
        throw new Error('Category IDs array cannot be empty');
      }

      console.log(`Adding categories to event ${eventId}:`, categoryArray);

      // Lấy tên category từ các categoryId
      const categoryNames = await Promise.all(
        categoryArray.map(async (categoryId) => {
          try {
            const categoryData = await CategoryService.getCategoryById(categoryId);
            return categoryData.categoryName; // Trả về tên category
          } catch (error) {
            console.error(`Error fetching category ${categoryId}:`, error);
            throw error;
          }
        })
      );

      console.log('Category names to be sent:', categoryNames);

      // Gửi danh sách tên category tới API
      const response = await api.post(`/eventcategories/${eventId}/categories`, categoryNames, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Response after adding categories:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error adding categories to event ${eventId}:`, error.response?.data || error.message);
      throw error;
    }
  }
}
// Sửa phần qrService trong api.jsx

export const qrService = {
  checkIn: async (registrationId) => {
    try {
      const response = await api.post(`/Attendances/MarkByQRRegistration/${registrationId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error during check-in:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Check-in failed'
      };
    }
  },

  // Fix the getUserRegistrations method to work properly
  getUserRegistrations: async () => {
    try {
      const userData = authService.getUser();
      if (!userData || !userData.id) {
        throw new Error('User not authenticated');
      }

      // Use the existing method from registrationService
      const response = await registrationService.getEventsUserRegisteredFor(userData.id);
      const responseRegistrationId = await registrationService.getUserRegistrations(userData.id);
      console.log('User registrations:', response);
      console.log('User registration IDs:', responseRegistrationId);
      //merge the two responses
      const mergedResponse = response.map(event => {
        const registration = responseRegistrationId.find(reg => reg.eventId === event.eventId);
        return {
          ...event,
          registrationId: registration ? registration.registrationId : `reg-${event.eventId}-${userData.id}`
        };
      });
      console.log('Merged response:', mergedResponse);
      // Kiểm tra xem mergedResponse có phải là mảng không


      // Convert to the format expected by our components
      const formattedData = Array.isArray(mergedResponse) ? mergedResponse.map(event => ({
        registrationId: event.registrationId,
        eventId: event.eventId,
        eventName: event.eventName || event.name,
        eventDate: event.startDate || event.start_date,
        location: event.location || "Không có thông tin",
        status: event.status || "confirmed"
      })) : [];
      console.log('Formatted user registrations:', formattedData);

      return formattedData;
    } catch (error) {
      console.error('Error getting user registrations:', error.response?.data || error.message);

      // In development mode, return sample data instead of failing
      if (process.env.NODE_ENV === 'development') {
        return [
          {
            registrationId: "sample-reg-123",
            eventId: "event1",
            eventName: "Hội thảo Công nghệ Blockchain",
            eventDate: new Date().toISOString(),
            location: "Hội trường A",
            status: "confirmed"
          },
          {
            registrationId: "sample-reg-456",
            eventId: "event2",
            eventName: "Workshop AI",
            eventDate: new Date().toISOString(),
            location: "Phòng Lab B",
            status: "confirmed"
          }
        ];
      }

      throw error;
    }
  },

  checkInUser: async (registrationId) => {
    try {
      const response = await api.post(`/Attendances/MarkByQRRegistration/${registrationId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error during QR check-in:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Check-in failed'
      };
    }
  },

  generateQRCode: async (registrationId) => {
    // Đây chỉ là một helper function, không cần gọi API
    // QR code sẽ được tạo trực tiếp ở frontend
    return {
      registrationId,
      qrData: registrationId // Có thể mã hóa hoặc thêm dữ liệu bảo mật nếu cần
    };
  }
};


export default api;

export const badgeService = {
    /**
     * Lấy tất cả huy hiệu có trong hệ thống
     * Tương ứng với: GET /api/Badges
     */
    getAllBadges: async () => {
        try {
            const response = await api.get('/Badges');
            return response.data;
        } catch (error) {
            console.error('Error fetching all badges:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Lấy danh sách huy hiệu của một người dùng cụ thể
     * Tương ứng với: GET /api/Badges/User/{userId}
     */
    getBadgesByUserId: async (userId) => {
        try {
            const response = await api.get(`/Badges/User/${userId}`);
            return response.data;
        } catch (error) {
            // Khi người dùng chưa có huy hiệu nào, API có thể trả về 404.
            // Trong trường hợp này, ta trả về mảng rỗng để không làm crash trang.
            if (error.response && error.response.status === 404) {
                console.warn(`No badges found for user ${userId}. Returning empty array.`);
                return [];
            }
            console.error(`Error fetching badges for user ${userId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Lấy huy hiệu theo ID sự kiện
     * Tương ứng với: GET /api/Badges/Event/{eventId}
     */
    getBadgesByEventId: async (eventId) => {
        try {
            const response = await api.get(`/Badges/Event/${eventId}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return []; // Trả về mảng rỗng nếu không có huy hiệu, đây là hành vi mong muốn.
            }
            console.error(`Error fetching badges for event ${eventId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Lấy huy hiệu theo ID của chính nó
     * Tương ứng với: GET /api/Badges/{badgeId}
     */
    getBadgeById: async (badgeId) => {
        try {
            const response = await api.get(`/Badges/${badgeId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching badge with ID ${badgeId}:`, error.response?.data || error.message);
            throw error;
        }
    },
    createBadge: async (badgeData) => {
        try {
            // badgeData phải là object chứa: eventId, badgeText, iconUrl
            const response = await api.post('/Badges', badgeData);
            return response.data;
        } catch (error) {
            console.error('Error creating badge:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Cập nhật huy hiệu
     * Tương ứng với: PUT /api/Badges/{badgeId}
     */
    updateBadge: async (badgeId, updatedData) => {
        try {
            const response = await api.put(`/Badges/${badgeId}`, updatedData);
            return response.data;
        } catch (error) {
            console.error(`Error updating badge ${badgeId}:`, error.response?.data || error.message);
            throw error;
        }
    },
    
    /**
     * Xóa huy hiệu
     * Tương ứng với: DELETE /api/Badges/{badgeId}
     */
    deleteBadge: async (badgeId) => {
        try {
            const response = await api.delete(`/Badges/${badgeId}`);
            return response.data; // Thường trả về true/false
        } catch (error) {
            console.error(`Error deleting badge ${badgeId}:`, error.response?.data || error.message);
            throw error;
        }
    }
};