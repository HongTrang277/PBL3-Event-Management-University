export const mockFacultyUnionStatistics = {
  summary: {
    totalEvents: 24,
    organized: 18,
    pending: 4,
    rejected: 2,
    totalRegistered: 1200,
    totalParticipated: 950,
    participationRate: 79.2, // %
    avgRating: 4.32, // trên 5
    successRate: 83.3, // % sự kiện >= 4 sao
    firstApprovalRate: 75.0, // %
    positiveFeedback: 88.5, // % đánh giá >= 4 sao
    rankingScore: 92.5, // điểm tổng hợp
    rankingPosition: 2, // xếp hạng so với các khoa
    totalFaculties: 12
  },
  topicDistribution: [
    { name: 'Học thuật', value: 10 },
    { name: 'Thể thao', value: 6 },
    { name: 'Văn nghệ', value: 5 },
    { name: 'Khác', value: 3 }
  ],
  statusDistribution: [
    { name: 'Đã tổ chức', value: 18 },
    { name: 'Chờ phê duyệt', value: 4 },
    { name: 'Bị từ chối', value: 2 }
  ],
  eventList: [
    {
      id: 'evt_001',
      name: 'Tech Conference 2025',
      date: '2025-06-15',
      topic: 'Học thuật',
      status: 'Đã tổ chức',
      registered: 300,
      participated: 250,
      participationRate: 83.3,
      avgRating: 4.5,
      positiveFeedback: 90,
      firstApproval: true,
      feedbacks: 120,
    },
    {
      id: 'evt_002',
      name: 'Giải bóng đá sinh viên',
      date: '2025-04-20',
      topic: 'Thể thao',
      status: 'Đã tổ chức',
      registered: 200,
      participated: 160,
      participationRate: 80.0,
      avgRating: 4.2,
      positiveFeedback: 85,
      firstApproval: false,
      feedbacks: 80,
    },
    {
      id: 'evt_003',
      name: 'Đêm nhạc gây quỹ',
      date: '2025-05-18',
      topic: 'Văn nghệ',
      status: 'Đã tổ chức',
      registered: 180,
      participated: 140,
      participationRate: 77.8,
      avgRating: 4.7,
      positiveFeedback: 95,
      firstApproval: true,
      feedbacks: 60,
    },
    {
      id: 'evt_004',
      name: 'Workshop An toàn thông tin',
      date: '2025-07-20',
      topic: 'Học thuật',
      status: 'Chờ phê duyệt',
      registered: 0,
      participated: 0,
      participationRate: 0,
      avgRating: null,
      positiveFeedback: null,
      firstApproval: null,
      feedbacks: 0,
    },
    // ...thêm các sự kiện khác nếu cần
  ],
  rankingTable: [
    { faculty: 'Khoa Công nghệ thông tin', score: 92.5, position: 2 },
    { faculty: 'Khoa Cơ khí', score: 95.0, position: 1 },
    { faculty: 'Khoa Điện', score: 88.0, position: 3 },
    // ...
  ],
  suggestions: [
    'Tăng số lượng sự kiện Văn nghệ để thu hút sinh viên nhiều hơn.',
    'Cải thiện tỷ lệ phê duyệt lần đầu bằng cách chuẩn bị hồ sơ kỹ lưỡng.',
    'Khuyến khích sinh viên phản hồi sau sự kiện để tăng tỷ lệ phản hồi tích cực.',
    'Tổ chức thêm các workshop về kỹ năng mềm.'
  ],
  filters: {
    time: ['Tuần này', 'Tháng này', 'Quý này', 'Năm nay'],
    topic: ['Tất cả', 'Học thuật', 'Thể thao', 'Văn nghệ', 'Khác'],
    status: ['Tất cả', 'Đã tổ chức', 'Chờ phê duyệt', 'Bị từ chối']
  }
};

// Hàm giả lập lấy dữ liệu (có thể thêm delay nếu muốn)
export function getMockFacultyUnionStatistics() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFacultyUnionStatistics);
    }, 800);
  });
} 