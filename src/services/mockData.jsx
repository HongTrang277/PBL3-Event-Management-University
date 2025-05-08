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
      "logo_url": "https://i.pinimg.com/736x/6c/86/82/6c868260ba3228e2a3638f35c9b0226f.jpg",
      "cover_url": "https://i.pinimg.com/736x/fd/51/3e/fd513efeb80ba5ccd5b62812c1c59151.jpg",
      "plan_link": null,
      "update_at": "2025-04-30T11:00:00Z",
      "attendance_type": "offline",
      "location": "Hội trường F, Khu F, Đại học Bách Khoa ĐN",
      "tags": ["Công nghệ", "Hội thảo"] // Thêm tags ví dụ
    },
    {
      "event_id": "evt_z1234",
      "event_name": "Đêm nhạc Acoustic Gây quỹ từ thiện",
      "description": "Thưởng thức âm nhạc và chung tay đóng góp cho các hoạt động thiện nguyện của sinh viên Bách Khoa.",
      "create_on": "2025-04-20T13:00:00Z",
      "start_date": "2025-05-18T19:00:00Z", // Sự kiện sắp diễn ra
      "end_date": "2025-05-18T21:30:00Z",
      "capacity": 300,
      "host_id": "Khoa Quản lý dự án", // Một khoa khác
      "approval_status": "approved",
      "submit_at": "2025-04-19T09:00:00Z",
      "approval_at": "2025-04-20T10:00:00Z",
      "logo_url": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      "cover_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
      "plan_link": null,
      "update_at": "2025-04-20T14:00:00Z",
      
      "location": "Sân khấu ngoài trời Khu A, ĐH Bách Khoa",
      "tags": ["Văn nghệ", "Âm nhạc", "Từ thiện", "Acoustic"]
    },
    {
      "event_id": "evt_fghij",
      "event_name": "Cuộc thi Sáng tạo Robot BKDN 2025",
      "description": "Sân chơi trí tuệ cho sinh viên đam mê robot. Thể hiện tài năng, kỹ năng thiết kế và lập trình robot của bạn.",
      "create_on": "2025-02-20T14:00:00Z",
      "start_date": "2025-09-10T08:30:00Z", // Sự kiện trong tương lai xa hơn
      "end_date": "2025-09-12T17:00:00Z",
      "capacity": 100, // Số đội hoặc thành viên tham gia
      "host_id": "Khoa Cơ khí",
      "approval_status": "approved",
      "submit_at": "2025-02-19T11:00:00Z",
      "approval_at": "2025-02-20T10:00:00Z",
      "logo_url": "https://images.unsplash.com/photo-1581092921440-5c51d1e9e909?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      "cover_url": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
      "plan_link": null,
      "update_at": "2025-02-21T09:00:00Z",
      // "attendance_type": ATTENDANCE_TYPES.OFFLINE,
      "location": "Xưởng thực hành Khoa Cơ khí",
      "tags": ["Học thuật", "Công nghệ", "Robot", "Thi đấu"]
    },
    {
      "event_id": "evt_klmno",
      "event_name": "Talkshow: Kỹ năng mềm cho Kỹ sư thế kỷ 21",
      "description": "Chia sẻ từ các chuyên gia về các kỹ năng giao tiếp, làm việc nhóm, tư duy phản biện cần thiết cho kỹ sư trong thời đại mới.",
      "create_on": "2025-04-15T16:00:00Z",
      "start_date": "2025-05-10T18:00:00Z", // Sự kiện đã diễn ra (giả sử hôm nay > 10/5/2025)
      "end_date": "2025-05-10T20:00:00Z",
      "capacity": 200,
      "host_id": "Khoa Điện tử - Viễn thông",
      "approval_status": "approved",
      "submit_at": "2025-04-15T10:00:00Z",
      "approval_at": "2025-04-16T09:00:00Z",
      "logo_url": "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      "cover_url": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlibrb-1.2.1&auto=format&fit=crop&w=750&q=80",
      "plan_link": null,
      "update_at": "2025-04-16T11:00:00Z",
      // "attendance_type": ATTENDANCE_TYPES.ONLINE,
      "location": "Nền tảng MS Teams (Khoa ĐTVT)",
      "tags": ["Kỹ năng mềm", "Hội thảo", "Hướng nghiệp"]
    },
    
    {
      "event_id": "evt_pqrst",
      "event_name": "Giải bóng đá Sinh viên DUT Mở rộng",
      "description": "Giải đấu thường niên quy tụ các đội bóng mạnh nhất từ các khoa và các trường bạn. Tinh thần thể thao, giao lưu và đoàn kết.",
      "create_on": "2025-03-01T08:00:00Z",
      "start_date": "2025-04-05T07:00:00Z", // Sự kiện đã diễn ra
      "end_date": "2025-04-26T17:00:00Z", // Kéo dài nhiều ngày
      "capacity": 16, // Số đội
      "host_id": "Đoàn Thanh niên Trường",
      "approval_status": "approved",
      "submit_at": "2025-02-28T14:00:00Z",
      "approval_at": "2025-03-01T10:00:00Z",
      "logo_url": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      "cover_url": "https://scontent.fhan14-2.fna.fbcdn.net/v/t39.30808-6/489786430_1308896494579152_4453476905909770114_n.jpg?stp=dst-jpg_s600x600_tt6&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=IfdaAXCX6oMQ7kNvwEQE_eJ&_nc_oc=Adm17jVPLtHt-WFnau8lnqF-TXxIdwSQxykbK7_MMdzzh6Tyn2OX7_ydZtdPMFj5Dp1xx6PchqVngz7mZH1MWDXG&_nc_zt=23&_nc_ht=scontent.fhan14-2.fna&_nc_gid=8d66yS2vOBgJnBOMAdoWGA&oh=00_AfK3T16fJhzeMnOc71gmBnG5ASB3LUmw08rPspuhON5_Bw&oe=681FF69B",
      "plan_link": null,
      "update_at": "2025-03-02T13:00:00Z",
      // "attendance_type": ATTENDANCE_TYPES.OFFLINE,
      "location": "Sân cỏ nhân tạo Khu KTX DMC",
      "tags": ["Thể thao", "Bóng đá", "Giải đấu", "Toàn trường"]
    },
    {
      "event_id": "evt_uvwxy",
      "event_name": "Khóa học An toàn thông tin cơ bản",
      "description": "Trang bị kiến thức nền tảng về an toàn thông tin, các mối đe dọa phổ biến và cách phòng chống cho sinh viên.",
      "create_on": "2025-05-01T10:00:00Z",
      "start_date": "2025-06-01T09:00:00Z",
      "end_date": "2025-06-01T11:30:00Z",
      "capacity": 100,
      "host_id": "Khoa Công nghệ thông tin",
      "approval_status": "pending", // Sự kiện đang chờ duyệt
      "submit_at": "2025-04-30T15:00:00Z",
      "approval_at": null,
      "logo_url": "https://images.unsplash.com/photo-1526374965328-5f61d48c09f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      "cover_url": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
      "plan_link": null,
      "update_at": "2025-05-01T10:00:00Z",
      // "attendance_type": ATTENDANCE_TYPES.ONLINE,
      "location": "Zoom Webinar",
      "tags": ["Công nghệ", "An toàn thông tin", "Workshop"]
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
    { email: "cntt.khoa@dut.udn.vn", name: "Khoa Công nghệ thông tin", password: "khoa_cntt_pass", role: ROLES.FALCUTY_UNION },
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

// Thêm mockRegistrations object để lưu trữ đăng ký sự kiện
const mockRegistrations = {};

// Hàm giả lập lấy dữ liệu thống kê
export const getStatisticsData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // --- Dữ liệu thô từ mock ---
      const events = createdEvents;
      
      // --- Mô phỏng dữ liệu đăng ký ---
      const simulatedRegistrations = events.map(event => {
          const registeredCount = getRandomInt(0, event.capacity);
          const attendanceCount = Math.floor(registeredCount * getRandomInt(70, 95) / 100); // 70-95% người đăng ký tham gia
          return {
              eventId: event.event_id,
              eventName: event.event_name,
              hostId: event.host_id,
              capacity: event.capacity,
              registeredCount: registeredCount,
              attendanceCount: attendanceCount,
              participationRate: event.capacity > 0 ? (registeredCount / event.capacity) : 0,
              attendanceRate: registeredCount > 0 ? (attendanceCount / registeredCount) : 0,
              tags: event.tags || [],
              startDate: new Date(event.start_date),
              endDate: new Date(event.end_date),
              duration: (new Date(event.end_date) - new Date(event.start_date)) / (1000 * 60 * 60), // Duration in hours
              approvalTime: event.approval_at ? (new Date(event.approval_at) - new Date(event.submit_at)) / (1000 * 60 * 60) : null // Approval time in hours
          };
      });

      // --- Tính toán thống kê ---
      const totalEvents = events.length;
      const totalRegistrations = _.sumBy(simulatedRegistrations, 'registeredCount');
      const totalAttendance = _.sumBy(simulatedRegistrations, 'attendanceCount');
      const overallAvgParticipation = _.meanBy(simulatedRegistrations.filter(e => e.capacity > 0), 'participationRate') * 100;
      const overallAvgAttendance = _.meanBy(simulatedRegistrations.filter(e => e.registeredCount > 0), 'attendanceRate') * 100;

      // Thống kê theo thời gian
      const monthlyStats = _.chain(simulatedRegistrations)
          .groupBy(reg => new Date(reg.startDate).toLocaleString('default', { month: 'long', year: 'numeric' }))
          .map((events, month) => ({
              month,
              eventCount: events.length,
              registrationCount: _.sumBy(events, 'registeredCount'),
              attendanceCount: _.sumBy(events, 'attendanceCount')
          }))
          .value();

      // Thống kê theo Khoa/Đoàn trường
      const statsByHost = _.groupBy(simulatedRegistrations, 'hostId');
      const facultyStats = FACULTIES.map(hostName => {
          const hostEvents = statsByHost[hostName] || [];
          const totalHostedEvents = hostEvents.length;
          const totalRegisteredForHost = _.sumBy(hostEvents, 'registeredCount');
          const totalAttendanceForHost = _.sumBy(hostEvents, 'attendanceCount');
          const totalCapacityForHost = _.sumBy(hostEvents, 'capacity');
          const avgParticipationRate = totalHostedEvents > 0
              ? _.meanBy(hostEvents.filter(e => e.capacity > 0), 'participationRate') * 100
              : 0;
          const avgAttendanceRate = totalHostedEvents > 0
              ? _.meanBy(hostEvents.filter(e => e.registeredCount > 0), 'attendanceRate') * 100
              : 0;
          const avgApprovalTime = _.meanBy(hostEvents.filter(e => e.approvalTime !== null), 'approvalTime');

          return {
              name: hostName,
              eventsHosted: totalHostedEvents,
              totalRegistered: totalRegisteredForHost,
              totalAttendance: totalAttendanceForHost,
              avgParticipation: avgParticipationRate,
              avgAttendance: avgAttendanceRate,
              totalCapacity: totalCapacityForHost,
              avgApprovalTime: avgApprovalTime || 0
          };
      });

      // Sắp xếp để thi đua
      const rankedFacultyStats = _.orderBy(facultyStats, ['totalRegistered', 'eventsHosted'], ['desc', 'desc']);

      // Thống kê theo Thể loại (Tags)
      const allTags = _.flatMap(simulatedRegistrations, 'tags');
      const tagCounts = _.countBy(allTags);
      const eventTypeStats = Object.entries(tagCounts).map(([name, count]) => ({
          name,
          value: count,
          registrations: _.sumBy(simulatedRegistrations.filter(e => e.tags.includes(name)), 'registeredCount'),
          attendance: _.sumBy(simulatedRegistrations.filter(e => e.tags.includes(name)), 'attendanceCount')
      }));

      // Thống kê thời gian phê duyệt
      const approvalTimeStats = {
          avgApprovalTime: _.meanBy(simulatedRegistrations.filter(e => e.approvalTime !== null), 'approvalTime'),
          minApprovalTime: _.minBy(simulatedRegistrations.filter(e => e.approvalTime !== null), 'approvalTime')?.approvalTime || 0,
          maxApprovalTime: _.maxBy(simulatedRegistrations.filter(e => e.approvalTime !== null), 'approvalTime')?.approvalTime || 0
      };

      // Thống kê thời lượng sự kiện
      const durationStats = {
          avgDuration: _.meanBy(simulatedRegistrations, 'duration'),
          minDuration: _.minBy(simulatedRegistrations, 'duration')?.duration || 0,
          maxDuration: _.maxBy(simulatedRegistrations, 'duration')?.duration || 0
      };

      // --- Kết quả cuối cùng ---
      const statistics = {
          summary: {
              totalEvents,
              totalRegistrations,
              totalAttendance,
              overallAvgParticipation,
              overallAvgAttendance,
              avgApprovalTime: approvalTimeStats.avgApprovalTime,
              avgEventDuration: durationStats.avgDuration
          },
          monthlyStats,
          facultyRanking: rankedFacultyStats,
          eventTypeDistribution: eventTypeStats,
          approvalTimeStats,
          durationStats
      };

      console.log("Mock Statistics Data:", statistics);
      resolve({ data: statistics });
    }, 1500);
  });
};

