// src/utils/constants.js
export const FACULTIES = [
    "Khoa Công nghệ Nhiệt - Điện lạnh",
    "Khoa Công nghệ thông tin",
    "Khoa Cơ khí",
    "Khoa Cơ khí giao thông",
    "Khoa Điện",
    "Khoa Điện tử - Viễn thông",
    "Khoa Hóa",
    "Khoa Kiến trúc",
    "Khoa Môi trường",
    "Khoa Quản lý dự án",
    "Khoa Sư phạm kỹ thuật",
    "Khoa Xây dựng Cầu đường",
    "Khoa Xây dựng Dân dụng & Công nghiệp",
    "Khoa Xây dựng Công trình Thủy",
    "Đoàn Thanh niên Trường" // Tài khoản đặc biệt
  ];
  
  export const ROLES = {
    STUDENT: 'User',
    EVENT_CREATOR: 'event_creator', // Chung cho Khoa và Đoàn trường
    UNION: 'union' // Role đặc biệt của Đoàn trường (có thể kế thừa EVENT_CREATOR)
  };
  
  export const ATTENDANCE_TYPES = {
    ONLINE: 'online',
    OFFLINE: 'offline',
  };
  
  export const TAGS = [ // Lấy từ mockCategories hoặc định nghĩa ở đây
      "Công nghệ", "Hội thảo", "Workshop", "Văn nghệ", "Thể thao", "Tình nguyện", "Học thuật"
  ];