import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
  Button,
  Tabs,
  TabsHeader,
  Tab,
  Select,
  Option
} from "@material-tailwind/react";

// Sử dụng React Icons thay vì Heroicons để tránh lỗi import
import {
  FaUserAlt as UserIcon,
  FaCalendarAlt as CalendarIcon,
  FaChartBar as ChartBarIcon,
  FaGraduationCap as AcademicCapIcon,
  FaClipboardCheck as ClipboardDocumentCheckIcon,
  FaTrophy as TrophyIcon,
  FaChartPie as DocumentChartBarIcon,
  FaArrowUp as ArrowTrendingUpIcon,
  FaArrowDown as ArrowTrendingDownIcon,
  FaUsers as UserGroupIcon
} from "react-icons/fa";

import Chart from "react-apexcharts";
import { eventService, facultyService, registrationService, authService } from "../services/api";

// Dữ liệu mẫu cho biểu đồ
const sampleChartData = {
  attendanceRate: {
    series: [{
      name: "Tỷ lệ tham gia",
      data: [75, 60, 90, 45, 85, 70, 55]
    }],
    options: {
      chart: { type: 'bar', height: 350 },
      plotOptions: { bar: { borderRadius: 4, horizontal: true } },
      colors: ['#3b82f6'],
      dataLabels: { enabled: true, formatter: (val) => `${val}%` },
      xaxis: {
        categories: ["Hội thảo CNTT", "Workshop AI", "Cuộc thi lập trình", "Ngày hội việc làm", "Tech Talk", "Triển lãm", "Tham quan doanh nghiệp"],
        max: 100
      }
    }
  },
  eventsOverTime: {
    series: [{
      name: "Sự kiện",
      data: [4, 3, 5, 7, 8, 6, 10, 12, 15, 8, 6, 4]
    }],
    options: {
      chart: { type: 'area', height: 350 },
      stroke: { curve: 'smooth' },
      colors: ['#8b5cf6'],
      xaxis: {
        categories: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", 
                    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"]
      }
    }
  },
  registrationsPerEvent: {
    series: [{
      data: [120, 95, 85, 75, 62, 55]
    }],
    options: {
      chart: { type: 'bar' },
      plotOptions: { bar: { borderRadius: 4, distributed: true } },
      colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#6366f1'],
      dataLabels: { enabled: false },
      xaxis: {
        categories: ["Tech Talk 2023", "Ngày hội việc làm", "Workshop AI", "Cuộc thi lập trình", "Tham quan doanh nghiệp", "Triển lãm công nghệ"]
      }
    }
  },
  studentParticipation: {
    series: [68, 22, 10],
    options: {
      chart: { type: 'donut' },
      labels: ['Đã tham gia ít nhất 1 sự kiện', 'Chưa tham gia sự kiện nào', 'Tham gia 3+ sự kiện'],
      colors: ['#10b981', '#f59e0b', '#3b82f6'],
      legend: { position: 'bottom' },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: { width: 200 },
          legend: { position: 'bottom' }
        }
      }]
    }
  },
  categoryDistribution: {
    series: [44, 55, 13, 43, 22],
    options: {
      chart: { type: 'pie' },
      labels: ['Hội thảo', 'Văn hóa', 'Học thuật', 'Thể thao', 'Thiện nguyện'],
      colors: ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'],
      legend: { position: 'bottom' },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: { width: 200 },
          legend: { position: 'bottom' }
        }
      }]
    }
  }
};

// Dữ liệu mẫu cho faculties
const sampleFaculties = [
  { facultyId: "cntt", facultyName: "Công nghệ thông tin" },
  { facultyId: "ddt", facultyName: "Điện-Điện tử" },
  { facultyId: "xd", facultyName: "Xây dựng" },
  { facultyId: "kt", facultyName: "Kinh tế" },
  { facultyId: "nn", facultyName: "Ngoại ngữ" }
];

const StatisticsLCDPage = () => {
  // State
  const [selectedFaculty, setSelectedFaculty] = useState("cntt");
  const [selectedTimeRange, setSelectedTimeRange] = useState("year");
  const [faculties, setFaculties] = useState(sampleFaculties);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEvents: 87,
    totalRegistrations: 1432,
    totalStudents: 652,
    activeEvents: 12,
    completedEvents: 75,
    registrationsGrowth: 12,
    eventsGrowth: 8,
    studentsGrowth: 3
  });

  // Chart data
  const [chartData, setChartData] = useState(sampleChartData);

  // Load faculties
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        setLoading(true);
        // Thử lấy từ API thực
        const response = await facultyService.getAllFaculties();
        if (response && response.data) {
          setFaculties(response.data);
          if (response.data.length > 0 && !selectedFaculty) {
            setSelectedFaculty(response.data[0].facultyId);
          }
        }
      } catch (err) {
        console.log("Using sample faculty data");
        // Sử dụng dữ liệu mẫu nếu API lỗi
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, []);

  // Xử lý khi thay đổi khoa hoặc thời gian
  useEffect(() => {
    // Giả lập API call khi thay đổi lựa chọn
    setLoading(true);
    
    // Giả lập delay API
    setTimeout(() => {
      // Không thay đổi dữ liệu biểu đồ, chỉ cập nhật một số thống kê
      setStats(prev => ({
        ...prev,
        totalEvents: Math.floor(Math.random() * 30) + 60,
        totalRegistrations: Math.floor(Math.random() * 500) + 1000,
        activeEvents: Math.floor(Math.random() * 10) + 5,
      }));
      setLoading(false);
    }, 800);
  }, [selectedFaculty, selectedTimeRange]);

  return (
    <ThemeProvider>
      <div className="bg-gray-50 min-h-screen px-4 py-8">
        {/* Tiêu đề và bộ lọc */}
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <Typography variant="h2" className="text-gray-800 mb-2">
                Thống kê khoa
              </Typography>
              <Typography variant="paragraph" color="gray" className="mb-4 md:mb-0">
                Theo dõi và phân tích dữ liệu về sự kiện và sinh viên
              </Typography>
            </div>

            {/* Bộ lọc */}
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <div className="w-full md:w-64">
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                >
                  {faculties.map((faculty) => (
                    <option key={faculty.facultyId} value={faculty.facultyId}>
                      {faculty.facultyName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-auto">
                <div className="bg-white border border-gray-300 rounded-md flex">
                  <button
                    className={`px-4 py-2 ${selectedTimeRange === "month" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                    onClick={() => setSelectedTimeRange("month")}
                  >
                    Tháng
                  </button>
                  <button
                    className={`px-4 py-2 ${selectedTimeRange === "quarter" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                    onClick={() => setSelectedTimeRange("quarter")}
                  >
                    Quý
                  </button>
                  <button
                    className={`px-4 py-2 ${selectedTimeRange === "year" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                    onClick={() => setSelectedTimeRange("year")}
                  >
                    Năm
                  </button>
                  <button
                    className={`px-4 py-2 ${selectedTimeRange === "all" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                    onClick={() => setSelectedTimeRange("all")}
                  >
                    Tất cả
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Thẻ thống kê tổng quan */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-500/20 p-3">
                      <CalendarIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <Typography variant="h6" color="blue-gray">
                        Tổng sự kiện
                      </Typography>
                      <Typography variant="h4" className="mt-1 font-bold">
                        {stats.totalEvents}
                      </Typography>
                      <div className={`flex items-center gap-1 text-sm font-medium ${stats.eventsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stats.eventsGrowth >= 0 ? <ArrowTrendingUpIcon className="h-4 w-4" /> : <ArrowTrendingDownIcon className="h-4 w-4" />}
                        {Math.abs(stats.eventsGrowth)}% so với kỳ trước
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-purple-500/20 p-3">
                      <ClipboardDocumentCheckIcon className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <Typography variant="h6" color="blue-gray">
                        Lượt đăng ký
                      </Typography>
                      <Typography variant="h4" className="mt-1 font-bold">
                        {stats.totalRegistrations}
                      </Typography>
                      <div className={`flex items-center gap-1 text-sm font-medium ${stats.registrationsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stats.registrationsGrowth >= 0 ? <ArrowTrendingUpIcon className="h-4 w-4" /> : <ArrowTrendingDownIcon className="h-4 w-4" />}
                        {Math.abs(stats.registrationsGrowth)}% so với kỳ trước
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-green-500/20 p-3">
                      <UserGroupIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <Typography variant="h6" color="blue-gray">
                        Sinh viên khoa
                      </Typography>
                      <Typography variant="h4" className="mt-1 font-bold">
                        {stats.totalStudents}
                      </Typography>
                      <div className={`flex items-center gap-1 text-sm font-medium ${stats.studentsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stats.studentsGrowth >= 0 ? <ArrowTrendingUpIcon className="h-4 w-4" /> : <ArrowTrendingDownIcon className="h-4 w-4" />}
                        {Math.abs(stats.studentsGrowth)}% so với kỳ trước
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-amber-500/20 p-3">
                      <TrophyIcon className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <Typography variant="h6" color="blue-gray">
                        Sự kiện đã kết thúc
                      </Typography>
                      <Typography variant="h4" className="mt-1 font-bold">
                        {stats.completedEvents}
                      </Typography>
                      <div className="text-sm text-blue-gray-500">
                        {stats.activeEvents} sự kiện đang diễn ra
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Biểu đồ và thống kê chi tiết */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Biểu đồ sự kiện theo thời gian */}
                <div className="bg-white p-6 rounded-xl shadow col-span-2">
                  <div className="mb-4 bg-blue-500 p-4 rounded-t-lg">
                    <h3 className="text-white text-xl font-semibold">
                      Sự kiện theo thời gian
                    </h3>
                  </div>
                  <div>
                    <Chart
                      options={chartData.eventsOverTime.options}
                      series={chartData.eventsOverTime.series}
                      type="area"
                      height={350}
                    />
                  </div>
                </div>
                
                {/* Biểu đồ phân bố sự kiện theo thể loại */}
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="mb-4 bg-indigo-500 p-4 rounded-t-lg">
                    <h3 className="text-white text-xl font-semibold">
                      Phân bố theo thể loại
                    </h3>
                  </div>
                  <div>
                    <Chart
                      options={chartData.categoryDistribution.options}
                      series={chartData.categoryDistribution.series}
                      type="pie"
                      height={300}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Biểu đồ đăng ký theo sự kiện */}
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="mb-4 bg-green-500 p-4 rounded-t-lg">
                    <h3 className="text-white text-xl font-semibold">
                      Số lượng đăng ký theo sự kiện
                    </h3>
                  </div>
                  <div>
                    <Chart
                      options={chartData.registrationsPerEvent.options}
                      series={chartData.registrationsPerEvent.series}
                      type="bar"
                      height={350}
                    />
                  </div>
                </div>

                {/* Biểu đồ tỷ lệ tham gia */}
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="mb-4 bg-amber-500 p-4 rounded-t-lg">
                    <h3 className="text-white text-xl font-semibold">
                      Tỷ lệ tham gia sự kiện
                    </h3>
                  </div>
                  <div>
                    <Chart
                      options={chartData.attendanceRate.options}
                      series={chartData.attendanceRate.series}
                      type="bar"
                      height={350}
                    />
                  </div>
                </div>
              </div>

              {/* Biểu đồ phân bố sinh viên theo tham gia và bảng chi tiết */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="mb-4 bg-purple-500 p-4 rounded-t-lg">
                    <h3 className="text-white text-xl font-semibold">
                      Phân bố sinh viên theo tham gia
                    </h3>
                  </div>
                  <div>
                    <Chart
                      options={chartData.studentParticipation.options}
                      series={chartData.studentParticipation.series}
                      type="donut"
                      height={300}
                    />
                  </div>
                </div>

                {/* Bảng thống kê top sinh viên tham gia */}
                <div className="bg-white p-6 rounded-xl shadow col-span-2">
                  <div className="mb-4 bg-red-500 p-4 rounded-t-lg">
                    <h3 className="text-white text-xl font-semibold">
                      Top sinh viên tham gia sự kiện
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max table-auto text-left">
                      <thead>
                        <tr>
                          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                              Sinh viên
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                              MSSV
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                              Sự kiện tham gia
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                              Hoàn thành
                            </Typography>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...Array(5)].map((_, index) => (
                          <tr key={index} className="hover:bg-blue-gray-50/50">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <UserIcon className="h-5 w-5 text-blue-500" />
                                </div>
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                  Nguyễn Văn {String.fromCharCode(65 + index)}
                                </Typography>
                              </div>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray" className="font-normal">
                                10230{index + 1}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray" className="font-normal">
                                {10 - index}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <div className="w-full">
                                <Typography variant="small" className="mb-1 block font-medium">
                                  {90 - (index * 5)}%
                                </Typography>
                                <div className="h-2 w-full bg-blue-gray-50 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${index < 2 ? "bg-green-500" : (index < 4 ? "bg-blue-500" : "bg-amber-500")}`}
                                    style={{ width: `${90 - (index * 5)}%` }} 
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      Trang 1 trong 1
                    </Typography>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 text-sm border border-blue-gray-200 rounded disabled:opacity-50" disabled>
                        Trước
                      </button>
                      <button className="px-4 py-2 text-sm border border-blue-gray-200 rounded disabled:opacity-50" disabled>
                        Tiếp theo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default StatisticsLCDPage;