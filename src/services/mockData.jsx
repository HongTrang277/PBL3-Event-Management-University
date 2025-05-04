// src/services/mockData.js
export const mockEvents = [
    {
      "event_id": "evt_12345",
      "event_name": "Tech Conference 2025",
      "description": "Annual conference focusing on emerging technologies.",
      "create_on": "2025-04-30T10:00:00Z", // Giả định ngày tạo
      "start_date": "2025-06-15T09:00:00Z",
      "end_date": "2025-06-15T17:00:00Z",
      "capacity": 500,
      "host_id": "Khoa Công nghệ thông tin", // Tên Khoa
      "approval_status": "approved",
      "submit_at": "2025-04-29T15:30:00Z", // Giả định ngày nộp
      "approval_at": "2025-04-30T08:00:00Z", // Giả định ngày duyệt
      "logo_url": "https://via.placeholder.com/150/0000FF/808080?text=Event+Logo+1",
      "cover_url": "https://via.placeholder.com/600x200/FF0000/FFFFFF?text=Event+Cover+1",
      "plan_link": null,
      "update_at": "2025-04-30T11:00:00Z",
      "attendance_type": "offline",
      "location": "Hội trường F, Khu F, Đại học Bách Khoa ĐN",
      "tags": ["Công nghệ", "Hội thảo"] // Thêm tags ví dụ
    },
    {
      "event_id": "evt_67890",
      "event_name": "Workshop Lập trình Web Nâng cao",
      "description": "Tìm hiểu các kỹ thuật frontend và backend hiện đại.",
      "create_on": "2025-05-01T11:00:00Z",
      "start_date": "2025-07-20T13:30:00Z",
      "end_date": "2025-07-20T17:30:00Z",
      "capacity": 50,
      "host_id": "Khoa Công nghệ thông tin",
      "approval_status": "approved",
      "submit_at": "2025-05-01T09:00:00Z",
      "approval_at": "2025-05-01T10:00:00Z",
      "logo_url": "https://via.placeholder.com/150/008000/FFFFFF?text=Event+Logo+2",
      "cover_url": "https://via.placeholder.com/600x200/0000FF/FFFFFF?text=Event+Cover+2",
      "plan_link": null,
      "update_at": "2025-05-01T12:00:00Z",
      "attendance_type": "online",
      "location": "Google Meet / Zoom",
      "tags": ["Công nghệ", "Workshop", "Lập trình"] // Thêm tags ví dụ
    },
    // Thêm sự kiện khác nếu cần
  ];
  
  export const mockSingleEvent = mockEvents[0];
  
  export const mockCategories = [
    { "categoryId": "cat_001", "categoryName": "Công nghệ" },
    { "categoryId": "cat_002", "categoryName": "Hội thảo" },
    { "categoryId": "cat_003", "categoryName": "Workshop" },
    { "categoryId": "cat_004", "categoryName": "Văn nghệ" },
    { "categoryId": "cat_005", "categoryName": "Thể thao" },
    { "categoryId": "cat_006", "categoryName": "Tình nguyện" },
    { "categoryId": "cat_007", "categoryName": "Học thuật" },
    // Thêm các tag khác nếu cần
  ];

  const mockFacultyCredentials = [
    // Định nghĩa email giả lập cho từng đơn vị
    { email: "nhietdienlanh.khoa@dut.udn.vn", name: "Khoa Công nghệ Nhiệt - Điện lạnh", password: "khoa_nhiet_pass", role: ROLES.EVENT_CREATOR },
    { email: "cntt.khoa@dut.udn.vn", name: "Khoa Công nghệ thông tin", password: "khoa_cntt_pass", role: ROLES.EVENT_CREATOR },
    { email: "ck.khoa@dut.udn.vn", name: "Khoa Cơ khí", password: "khoa_ck_pass", role: ROLES.EVENT_CREATOR },
    { email: "ckgt.khoa@dut.udn.vn", name: "Khoa Cơ khí giao thông", password: "khoa_ckgt_pass", role: ROLES.EVENT_CREATOR },
    { email: "dien.khoa@dut.udn.vn", name: "Khoa Điện", password: "khoa_dien_pass", role: ROLES.EVENT_CREATOR },
    { email: "dtvt.khoa@dut.udn.vn", name: "Khoa Điện tử - Viễn thông", password: "khoa_dtvt_pass", role: ROLES.EVENT_CREATOR },
    { email: "hoa.khoa@dut.udn.vn", name: "Khoa Hóa", password: "khoa_hoa_pass", role: ROLES.EVENT_CREATOR },
    { email: "kientruc.khoa@dut.udn.vn", name: "Khoa Kiến trúc", password: "khoa_kientruc_pass", role: ROLES.EVENT_CREATOR },
    { email: "moitruong.khoa@dut.udn.vn", name: "Khoa Môi trường", password: "khoa_moitruong_pass", role: ROLES.EVENT_CREATOR },
    { email: "qlda.khoa@dut.udn.vn", name: "Khoa Quản lý dự án", password: "khoa_qldt_pass", role: ROLES.EVENT_CREATOR },
    { email: "spkt.khoa@dut.udn.vn", name: "Khoa Sư phạm kỹ thuật", password: "khoa_spkt_pass", role: ROLES.EVENT_CREATOR },
    { email: "xdcd.khoa@dut.udn.vn", name: "Khoa Xây dựng Cầu đường", password: "khoa_xdcd_pass", role: ROLES.EVENT_CREATOR },
    { email: "xdddcn.khoa@dut.udn.vn", name: "Khoa Xây dựng Dân dụng & Công nghiệp", password: "khoa_xddd_pass", role: ROLES.EVENT_CREATOR },
    { email: "xdctt.khoa@dut.udn.vn", name: "Khoa Xây dựng Công trình Thủy", password: "khoa_xdctt_pass", role: ROLES.EVENT_CREATOR },
    { email: "doanthanhnien@dut.udn.vn", name: "Đoàn Thanh niên Trường", password: "doantruong_pass", role: ROLES.UNION }
];

  
  // Lưu trữ sự kiện đã tạo (để check trùng)
  let createdEvents = [...mockEvents];
  
  // Hàm giả lập lấy tất cả sự kiện
  export const getAllEvents = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: createdEvents });
      }, 500); // Giả lập độ trễ mạng
    });
  };
  
  // Hàm giả lập tạo sự kiện mới
  export const createNewEvent = (newEventData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check trùng tên và ngày bắt đầu
        const isDuplicate = createdEvents.some(event =>
          event.event_name === newEventData.event_name &&
          new Date(event.start_date).toDateString() === new Date(newEventData.start_date).toDateString()
          // Có thể check thêm giờ nếu cần độ chính xác cao hơn
        );
  
        if (isDuplicate) {
          reject({ message: "Sự kiện với tên và ngày bắt đầu này đã tồn tại." });
          return;
        }
  
        const newEvent = {
          ...newEventData,
          event_id: `evt_${Date.now()}`, // Tạo ID duy nhất
          create_on: new Date().toISOString(),
          approval_status: 'pending', // Trạng thái chờ duyệt (ví dụ)
          submit_at: new Date().toISOString(),
          update_at: new Date().toISOString(),
          // host_id sẽ được lấy từ thông tin người dùng đăng nhập
        };
        createdEvents.push(newEvent);
        console.log("Mock Create Event:", newEvent);
        resolve({ data: newEvent });
      }, 1000); // Giả lập độ trễ mạng
    });
  };
  
  
  
  // src/services/mockData.js
// ... (phần code mockEvents, createNewEvent, etc. đã có) ...

// Hàm giả lập lấy chi tiết một sự kiện bằng ID
export const getEventById = (eventId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const event = createdEvents.find(e => e.event_id === eventId);
        if (event) {
          console.log("Mock Get Event By ID:", eventId, event);
          resolve({ data: event });
        } else {
          console.error("Mock Get Event By ID: Not Found", eventId);
          reject(new Error("Không tìm thấy sự kiện."));
        }
      }, 700); // Giả lập độ trễ mạng
    });
  };

  export const getRegisteredEventsForStudent = (userId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const registeredEventIds = mockRegistrations[userId] || [];
            const events = createdEvents.filter(event => registeredEventIds.includes(event.event_id));
            console.log(`Mock Get Registered Events for User ${userId}:`, events);
            resolve({ data: events });
        }, 600); // Giả lập độ trễ mạng
    });
};

  
  // Thêm hàm giả lập đăng ký sự kiện (cho sinh viên)
  export const registerForEvent = (eventId, userId) => {
    return new Promise((resolve, reject) => { // Thêm reject
         setTimeout(() => {
              const eventExists = createdEvents.some(e => e.event_id === eventId);
              if (!eventExists) {
                   return reject(new Error("Sự kiện không tồn tại."));
              }

              // Kiểm tra xem đã đăng ký chưa
              if (mockRegistrations[userId] && mockRegistrations[userId].includes(eventId)) {
                  // Có thể trả về lỗi hoặc thông báo đã đăng ký rồi
                  return resolve({ message: "Bạn đã đăng ký sự kiện này rồi." });
                  // Hoặc: return reject(new Error("Bạn đã đăng ký sự kiện này rồi."));
              }

              // Thêm đăng ký mới
              if (!mockRegistrations[userId]) {
                  mockRegistrations[userId] = [];
              }
              mockRegistrations[userId].push(eventId);

              console.log(`Mock Register: User ${userId} registered for Event ${eventId}`);
              console.log("Current Mock Registrations:", mockRegistrations);
              resolve({ message: "Đăng ký thành công!" });
         }, 500);
    });
};

  // src/services/mockData.js
// ... (code khác đã có) ...

let mockStudentCredentials = [
  { email: 'test@gmail.com', password: 'password123', name: 'Test Student', id: 'student_1' },
  // Bạn có thể thêm các tài khoản giả lập khác ở đây
];

// Hàm giả lập đăng ký người dùng mới (sinh viên)
export const registerUser = ({ name, email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // --- VALIDATION (Mock-side) ---
      // 1. Kiểm tra định dạng Gmail
      if (!email || !email.toLowerCase().endsWith('@gmail.com')) {
        console.error("Mock Register Failed: Invalid Gmail format", email);
        reject(new Error("Vui lòng sử dụng địa chỉ email Gmail hợp lệ (@gmail.com)."));
        return;
      }
      // 2. Kiểm tra email đã tồn tại chưa
      const emailLower = email.toLowerCase();
      if (mockStudentCredentials.some(cred => cred.email === emailLower)) {
        console.error("Mock Register Failed: Email already exists", email);
        reject(new Error("Địa chỉ email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập."));
        return;
    }
      // 3. Kiểm tra cơ bản khác (vd: password không được rỗng - nên làm ở client-side)
      if(!password) {
          reject(new Error("Mật khẩu không được để trống."));
          return;
      }
      if(!name) {
        reject(new Error("Tên không được để trống."));
        return;
    }


      // --- SUCCESS ---
      // Thêm email vào danh sách đã đăng ký (chỉ mock)
      const newUserId = `student_${Date.now()}`;
      const newUserCredentials = {
        id: newUserId,
        name: name,
        email: emailLower,
        password: password // Lưu mật khẩu (không an toàn!)
      };
      mockStudentCredentials.push(newUserCredentials);

      const newUserForResponse = { // Dữ liệu trả về không nên chứa password
        id: newUserId,
        name: name,
        email: emailLower,
        role: ROLES.STUDENT,
      };

      console.log("Mock Register Success. New credentials added:", newUserCredentials);
      console.log("Current mockStudentCredentials:", mockStudentCredentials);
      resolve({ message: "Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.", user: newUserForResponse });

    }, 1200);
  });
};

export const verifyStudentCredentials = async (email, password) => {
  console.log("Mock verifyStudentCredentials for:", email);
  const emailLower = email.toLowerCase();
  const foundUser = mockStudentCredentials.find(cred => cred.email === emailLower);

  if (foundUser) {
      console.log("User found in mock data. Checking password...");
      // So sánh mật khẩu trực tiếp (không an toàn trong thực tế)
      if (foundUser.password === password) {
          console.log("Password matches.");
          // Trả về thông tin user (không bao gồm password) nếu khớp
          return {
              id: foundUser.id,
              name: foundUser.name,
              email: foundUser.email,
              role: ROLES.STUDENT
          };
      } else {
          console.log("Password does NOT match.");
          return null; // Sai mật khẩu
      }
  } else {
      console.log("User email not found in mock data.");
      return null; // Không tìm thấy email
  }
  // Không cần setTimeout ở đây vì hàm login đã có rồi
};


// src/services/mockData.js
import _ from 'lodash'; // Import lodash đã cài đặt
import { FACULTIES, ROLES, TAGS } from '../utils/constants';

// ... (code mockEvents, getEventById, etc. đã có) ...

// Hàm tạo số ngẫu nhiên trong khoảng [min, max]
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// **MỚI:** Hàm giả lập kiểm tra thông tin đăng nhập Khoa/Đoàn trường
export const verifyFacultyCredentials = async (email, password) => {
  const emailLower = email ? email.toLowerCase() : ''; // Kiểm tra null/undefined và chuyển về chữ thường
  console.log("Mock verifyFacultyCredentials for email:", emailLower);

  // Tìm kiếm trong mảng dựa trên email
  const foundFaculty = mockFacultyCredentials.find(cred => cred.email.toLowerCase() === emailLower);

  if (foundFaculty) {
      console.log("Faculty/Union email found in mock data. Checking password...");
      // So sánh mật khẩu trực tiếp
      if (foundFaculty.password === password) {
          console.log("Password matches.");
          // Trả về thông tin user nếu khớp
          return {
              id: foundFaculty.email, // Dùng email làm id tạm thời
              name: foundFaculty.name, // Lấy tên đầy đủ
              email: foundFaculty.email,
              role: foundFaculty.role,
              faculty: foundFaculty.name // faculty là tên đầy đủ
          };
      } else {
          console.log("Password does NOT match.");
          return null; // Sai mật khẩu
      }
  } else {
      console.log("Faculty/Union email not found in mock data.");
      return null; // Không tìm thấy email
  }
};

// Hàm giả lập lấy dữ liệu thống kê
export const getStatisticsData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // --- Dữ liệu thô từ mock ---
      const events = createdEvents; // Sử dụng danh sách sự kiện đã có
      const faculties = FACULTIES.filter(f => f !== "Đoàn Thanh niên Trường"); // Lấy danh sách các Khoa (Liên chi đoàn)

      // --- Mô phỏng dữ liệu đăng ký ---
      const simulatedRegistrations = events.map(event => {
          // Tạo số lượng đăng ký ngẫu nhiên, không vượt quá capacity
          const registeredCount = getRandomInt(0, event.capacity);
          return {
              eventId: event.event_id,
              eventName: event.event_name,
              hostId: event.host_id,
              capacity: event.capacity,
              registeredCount: registeredCount,
              participationRate: event.capacity > 0 ? (registeredCount / event.capacity) : 0,
              tags: event.tags || []
          };
      });

      // --- Tính toán thống kê ---
      // 1. Tổng số sự kiện
      const totalEvents = events.length;

      // 2. Thống kê theo Khoa/Đoàn trường (Host)
      const statsByHost = _.groupBy(simulatedRegistrations, 'hostId');
      const facultyStats = FACULTIES.map(hostName => {
          const hostEvents = statsByHost[hostName] || []; // Lấy các sự kiện (đã mô phỏng đăng ký) của host này
          const totalHostedEvents = hostEvents.length;
          const totalRegisteredForHost = _.sumBy(hostEvents, 'registeredCount');
          const totalCapacityForHost = _.sumBy(hostEvents, 'capacity');
          const avgParticipationRate = totalHostedEvents > 0
              ? _.meanBy(hostEvents.filter(e => e.capacity > 0), 'participationRate') // Chỉ tính rate cho sự kiện có capacity > 0
              : 0;

          return {
              name: hostName, // Tên Khoa/Đoàn trường
              eventsHosted: totalHostedEvents,
              totalRegistered: totalRegisteredForHost, // Tổng SV đăng ký các sự kiện do Khoa/ĐT này tổ chức
              avgParticipation: avgParticipationRate * 100, // Tính %
              totalCapacity: totalCapacityForHost
          };
      });

      // Sắp xếp để thi đua (ví dụ: theo số lượt đăng ký)
      const rankedFacultyStats = _.orderBy(facultyStats, ['totalRegistered', 'eventsHosted'], ['desc', 'desc']);


      // 3. Thống kê theo Thể loại (Tags)
      const allTags = _.flatMap(simulatedRegistrations, 'tags'); // Lấy tất cả tags từ các sự kiện
      const tagCounts = _.countBy(allTags); // Đếm số lần xuất hiện của mỗi tag
      const eventTypeStats = Object.entries(tagCounts).map(([name, count]) => ({ name, value: count })); // Format cho Pie Chart

      // 4. Các thống kê tổng quan khác
      const totalRegistrations = _.sumBy(simulatedRegistrations, 'registeredCount');
      const overallAvgParticipation = _.meanBy(simulatedRegistrations.filter(e => e.capacity > 0), 'participationRate') * 100;

      // --- Kết quả cuối cùng ---
      const statistics = {
          summary: {
              totalEvents: totalEvents,
              totalRegistrations: totalRegistrations,
              overallAvgParticipation: overallAvgParticipation,
          },
          facultyRanking: rankedFacultyStats, // Thống kê theo Khoa/ĐT đã sắp xếp
          eventTypeDistribution: eventTypeStats, // Phân bố theo thể loại
      };

      console.log("Mock Statistics Data:", statistics);
      resolve({ data: statistics });

    }, 1500); // Giả lập độ trễ mạng
  });
};

