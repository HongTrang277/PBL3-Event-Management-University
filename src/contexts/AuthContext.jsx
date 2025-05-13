// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Sửa lỗi import
import {  ROLES } from '../utils/constants';
import { verifyFacultyCredentials, verifyStudentCredentials } from '../services/mockData';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Chứa thông tin user { id, name, email, role, faculty? }
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [loading, setLoading] = useState(true); // Trạng thái chờ khi kiểm tra token lúc đầu

  useEffect(() => {

    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Kiểm tra token hết hạn (nếu token có trường 'exp')
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          // Lấy thông tin user từ token (điều chỉnh dựa trên cấu trúc token thực tế)
          const userData = {
            id: decoded.sub || decoded.id, // Hoặc trường nào chứa ID user
            name: decoded.name || decoded.username,
            email: decoded.email,
            role: decoded.role || ROLES.STUDENT, // Mặc định là student nếu không có role
            // Thêm faculty nếu là role EVENT_CREATOR hoặc UNION
            faculty: decoded.role !== ROLES.STUDENT ? decoded.faculty || "Unknown Faculty" : undefined,
          };
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout(); // Token không hợp lệ, đăng xuất
      }
    }
    setLoading(false); // Kết thúc kiểm tra token
  }, [token]);

  // Hàm giả lập đăng nhập
  const login = async (credentials) => {
    console.log("Attempting login with:", credentials);
    // --- GIẢ LẬP GỌI API ĐĂNG NHẬP ---
    return new Promise((resolve, reject) => {
      setTimeout(async() => {
        let mockToken = null;
        let userData = null;

        try {
          const verifiedFacultyData = await verifyFacultyCredentials(credentials.username, credentials.password);
          if (verifiedFacultyData) {
              userData = verifiedFacultyData; // Lấy dữ liệu user đã xác thực
               // Tạo mock token
               const stringToEncode = JSON.stringify({
                  sub: userData.id,
                  name: userData.name,
                  email: userData.email,
                  role: userData.role,
                  faculty: userData.faculty,
                  exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 giờ
               });
               mockToken = btoa(unescape(encodeURIComponent(stringToEncode)));
          }
      } catch (facultyError) {
           console.error("Error verifying faculty credentials:", facultyError);
           // Tiếp tục thử xác thực sinh viên
      }


      // **SỬA ĐỔI:** 2. Nếu không phải Khoa/ĐT, thử xác thực với tư cách Sinh viên
      // Chỉ thử nếu bước trên không thành công (userData vẫn là null)
      // và username trông giống email sinh viên
      if (!userData && credentials.username.toLowerCase().endsWith('@gmail.com')) {
           try {
              const verifiedStudentData = await verifyStudentCredentials(credentials.username, credentials.password);
              if (verifiedStudentData) {
                  userData = verifiedStudentData; // Lấy dữ liệu user đã xác thực
                   // Tạo mock token
                   const stringToEncode = JSON.stringify({
                      sub: userData.id,
                      name: userData.name,
                      email: userData.email,
                      role: userData.role,
                      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 1 ngày
                   });
                   mockToken = btoa(unescape(encodeURIComponent(stringToEncode)));
              }
           } catch (studentError) {
              console.error("Error verifying student credentials:", studentError);
              // Sẽ bị reject ở dưới
           }
      }


      if (userData) {
        const mockHeader = { alg: 'none', typ: 'JWT' }; // Header giả, không cần chữ ký
        const payload = {
          sub: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          // Chỉ thêm faculty nếu không phải student
          ...(userData.role !== ROLES.STUDENT && { faculty: userData.faculty }),
          // Đặt thời gian hết hạn (ví dụ: 1 giờ cho faculty, 1 ngày cho student)
          exp: Math.floor(Date.now() / 1000) + (userData.role === ROLES.STUDENT ? (60 * 60 * 24) : (60 * 60))
        };

        // Hàm mã hóa Base64Url (an toàn hơn btoa cho JWT)
        const base64UrlEncode = (str) => {
            // Chuyển đổi sang UTF-8 trước khi mã hóa Base64
            const utf8Bytes = new TextEncoder().encode(str);
            // Mã hóa Base64 từ Uint8Array
            let binaryString = '';
            utf8Bytes.forEach(byte => {
                binaryString += String.fromCharCode(byte);
            });
            return btoa(binaryString)
                .replace(/\+/g, '-') // Thay '+' bằng '-'
                .replace(/\//g, '_') // Thay '/' bằng '_'
                .replace(/=+$/, ''); // Loại bỏ dấu '=' ở cuối
        };

        const encodedHeader = base64UrlEncode(JSON.stringify(mockHeader));
        const encodedPayload = base64UrlEncode(JSON.stringify(payload));

        // Tạo token giả với cấu trúc header.payload. (giả signature rỗng)
        // Hoặc thêm một signature giả nếu muốn: .mockSignature
        mockToken = `${encodedHeader}.${encodedPayload}.`;

        if (mockToken) {
          localStorage.setItem('authToken', mockToken);
          setToken(mockToken);
          setUser(userData);
          setIsAuthenticated(true);
          console.log("Login successful, Role:", userData.role, "Generated Mock Token:", mockToken);
          resolve(userData);
        } else {
          // Trường hợp này ít xảy ra nếu userData tồn tại
          console.error("Failed to generate mock token even after successful authentication.");
          reject(new Error("Không thể tạo token giả lập sau khi xác thực."));
        }

      } else {
        // Nếu userData vẫn là null sau cả 2 lần thử
        console.log("Login failed: Credentials incorrect or verification error.");
        reject(new Error("Tên đăng nhập hoặc mật khẩu không đúng"));
      }
    }, 1000); // Giả lập độ trễ mạng
  });
  // --- KẾT THÚC GIẢ LẬP ---
};

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    // Có thể điều hướng về trang đăng nhập ở đây nếu muốn
    // navigate('/login'); // Cần import useNavigate từ react-router-dom
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading, // Thêm loading state
    login,
    logout,
  };

  // Chỉ render children khi đã kiểm tra token xong (tránh FOUC)
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};