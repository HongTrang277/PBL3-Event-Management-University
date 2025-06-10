import React, { useState, useEffect, useMemo } from "react";
import { ThemeProvider, Typography, Card, CardHeader, CardBody, Select, Option, Progress, Spinner } from "@material-tailwind/react";
import { FaUsers, FaClipboardCheck, FaRegChartBar, FaUserGraduate, FaPercentage, FaTags, FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa";
import Chart from "react-apexcharts";
import _ from 'lodash';

// Import các service và hook cần thiết
import { useAuth } from "../contexts/AuthContext";
import { eventService, facultyService, registrationService, userService, attendanceService, EventCategoryService } from "../services/api";

// --- Custom Theme (Giữ nguyên) ---
const customTheme = {
    // ... (giữ nguyên theme của bạn)
};

// --- Các Component Tái sử dụng (Giữ nguyên) ---
const StatCard = ({ icon, title, value, footer }) => (
    <Card className="hover:shadow-xl transition-shadow">
        <CardBody className="flex flex-col p-4">
            <div className="flex items-center gap-4">
                <div className="bg-light-blue-500/10 p-3 rounded-xl">{icon}</div>
                <div>
                    <Typography variant="small" color="blue-gray" className="font-semibold">{title}</Typography>
                    <Typography variant="h4" color="blue-gray" className="font-bold">{value}</Typography>
                </div>
            </div>
            {footer && <Typography variant="small" className="text-gray-600 mt-2">{footer}</Typography>}
        </CardBody>
    </Card>
);

const ChartCard = ({ title, chart }) => (
    <Card>
        <CardHeader variant="gradient" color="light-blue" floated={false} shadow={false} className="p-4">
            <Typography variant="h6" color="white">{title}</Typography>
        </CardHeader>
        <CardBody>{chart}</CardBody>
    </Card>
);

// --- Các Component UI phụ trợ ---
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spinner className="h-16 w-16 text-light-blue-500/50" />
        <Typography color="blue-gray" className="ml-4 font-semibold">Đang tải dữ liệu...</Typography>
    </div>
);

const ErrorDisplay = ({ message }) => (
    <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg shadow-md font-semibold text-lg flex items-center justify-center gap-4">
        <FaExclamationTriangle className="h-8 w-8" />
        {message}
    </div>
);

// =================================================================
// HOOK 1: Tách logic fetch và chuẩn hóa dữ liệu
// =================================================================
// =================================================================
// HOOK 1 (ĐÃ SỬA LỖI VÀ TỐI ƯU): Lấy toàn bộ dữ liệu một cách hiệu quả
// =================================================================
const useStatisticsData = (user) => {
    const [allData, setAllData] = useState({
        events: [], registrations: [], users: [], attendances: [], faculties: [], eventCategories: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            setError("Vui lòng đăng nhập để xem thống kê.");
            return;
        }

        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Bước 1: Gọi tất cả các API cần thiết cùng lúc bằng Promise.all
                const [
                    eventsRes,
                    registrationsRes,
                    usersRes,
                    attendancesRes,
                    facultiesRes,
                    eventCategoriesRes
                ] = await Promise.all([
                    eventService.getAllEvents(),
                    registrationService.getAllRegistrations(),
                    userService.getAllUsers(),
                    attendanceService.getAllAttendances(),
                    facultyService.getAllFaculties(),
                    EventCategoryService.getAllEventCategories(),
                ]);

                // Bước 2: Chuẩn hóa dữ liệu event (nếu cần)
                // Giờ đây chúng ta làm việc trực tiếp với kết quả từ getAllEvents
                const normalizedEvents = (Array.isArray(eventsRes) ? eventsRes : []).map(e => ({
                    ...e,
                    // Đảm bảo hostId luôn tồn tại để tránh lỗi khi join dữ liệu
                    hostId: e.hostId || e.hostID, 
                }));

                // Bước 3: Cập nhật state với toàn bộ dữ liệu đã lấy được
                // Luôn đảm bảo rằng các giá trị là một mảng để tránh lỗi ở tầng xử lý
                setAllData({
                    events: normalizedEvents,
                    registrations: Array.isArray(registrationsRes) ? registrationsRes : [],
                    users: Array.isArray(usersRes) ? usersRes : [],
                    attendances: Array.isArray(attendancesRes) ? attendancesRes : [],
                    faculties: Array.isArray(facultiesRes) ? facultiesRes : [],
                    eventCategories: Array.isArray(eventCategoriesRes) ? eventCategoriesRes : [],
                });

            } catch (err) {
                console.error("Error fetching statistics data:", err);
                setError("Không thể tải dữ liệu thống kê. Vui lòng kiểm tra lại đường truyền hoặc liên hệ quản trị viên.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [user]); // Hook chỉ phụ thuộc vào 'user'
    console.log("BƯỚC 1: DỮ LIỆU THÔ TỪ API:", allData);

    return { allData, loading, error };
};
// =================================================================
// HOOK 2: Tách logic tính toán và xử lý thống kê
// =================================================================
const useProcessedStatistics = (allData, user) => {
    const chartBaseOptions = useMemo(() => ({
        chart: { toolbar: { show: false }, fontFamily: 'inherit' },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3 },
        legend: { position: 'top', horizontalAlign: 'right' },
        colors: ["#38bdf8", "#818cf8", "#fb923c", "#f87171", "#a78bfa"],
        grid: { borderColor: '#e7e7e7', strokeDashArray: 5 },
    }), []);

    return useMemo(() => {
        const { events, registrations, users, attendances, eventCategories } = allData;

        // THAY ĐỔI 2: Logic lọc sự kiện hoàn toàn mới
        // ==================================================
        // Nếu không có user hoặc không có event, trả về rỗng
        if (!user?.id || !events.length) {
            return {
                summaryStats: { totalEvents: 0, totalRegistrations: 0, totalUniqueStudents: 0, attendanceRate: 0 },
                cohortRanking: [],
                registrationsOverTimeChart: { options: {}, series: [] },
                categoryDistributionChart: { options: {}, series: [] },
                recentEvents: [],
            };
        }

        // Lọc ra các sự kiện do chính user này tạo ra
        const userEvents = events.filter(event => String(event.hostId) === String(user.id));

        if (userEvents.length === 0) {
            // Trả về state rỗng nếu user này chưa tạo sự kiện nào
            return {
                summaryStats: { totalEvents: 0, totalRegistrations: 0, totalUniqueStudents: 0, attendanceRate: 0 },
                cohortRanking: [],
                registrationsOverTimeChart: { options: {}, series: [] },
                categoryDistributionChart: { options: {}, series: [] },
                recentEvents: [],
            };
        }
        // B1: Lọc người dùng theo khoa
        const userEventIds = new Set(userEvents.map(e => e.eventId));
        const userRegistrations = registrations.filter(reg => userEventIds.has(reg.eventId));
        const userAttendances = attendances.filter(att => userRegistrations.some(reg => reg.registrationId === att.registrationId));

        // --- Thống kê tổng quan ---
        const totalRegistrations = userRegistrations.length;
        const totalAttendances = userAttendances.length;
        const attendanceRate = totalRegistrations > 0 ? _.round((totalAttendances / totalRegistrations) * 100) : 0;
        const summaryStats = {
            totalEvents: userEvents.length,
            totalRegistrations,
            totalUniqueStudents: new Set(userRegistrations.map(r => r.userId)).size,
            attendanceRate,
        };
        
        // --- Xếp hạng Khóa (tính toán vẫn như cũ, nhưng dựa trên dữ liệu đã lọc) ---
        const userMap = new Map(users.map(u => [u.id, u]));
        const cohortStats = userRegistrations.reduce((acc, reg) => {
            const registeredUser = userMap.get(reg.userId);
            if (registeredUser?.class && typeof registeredUser.class === 'string') {
                const cohortNumber = registeredUser.class.substring(0, 2);
                if (/^\d{2}$/.test(cohortNumber)) {
                    const cohortName = `Khóa ${cohortNumber}`;
                    if (!acc[cohortName]) acc[cohortName] = { name: cohortName, registrations: 0 };
                    acc[cohortName].registrations++;
                }
            }
            return acc;
        }, {});
        const cohortRanking = _.orderBy(Object.values(cohortStats), 'registrations', 'desc').slice(0, 5);
        
        // --- Danh sách sự kiện gần đây ---
        const recentEvents = _.orderBy(userEvents, 'startDate', 'desc').slice(0, 7);

        // --- DỮ LIỆU BIỂU ĐỒ ĐƯỜNG: Lượt tham gia theo thời gian ---
        const monthlyRegistrations = _.chain(userRegistrations)
            .groupBy(r => new Date(r.registrationDate).toISOString().substring(0, 7)) // Group by YYYY-MM
            .map((values, key) => ({ month: key, count: values.length }))
            .orderBy('month', 'asc')
            .slice(-6)
            .value();

        const registrationsOverTimeChart = {
            options: {
                ...chartBaseOptions,
                xaxis: { categories: monthlyRegistrations.map(d => d.month) },
                title: { text: 'Lượt tham gia theo tháng', style: { fontSize: '14px', fontWeight: 'bold' } },
                tooltip: { y: { formatter: (val) => `${val} lượt` } }
            },
            series: [{ name: 'Lượt tham gia', data: monthlyRegistrations.map(d => d.count) }]
        };

        // --- DỮ LIỆU BIỂU ĐỒ TRÒN: Phân bổ loại sự kiện ---
        const categoryMap = new Map();
        eventCategories.forEach(ec => {
            if (ec.category && ec.category.categoryName) {
                if (!categoryMap.has(ec.eventId)) categoryMap.set(ec.eventId, []);
                categoryMap.get(ec.eventId).push(ec.category.categoryName);
            }
        });

        const categoryStats = _.chain(userEvents)
            .flatMap(event => categoryMap.get(event.eventId) || [])
            .countBy()
            .map((count, name) => ({ name, count }))
            .orderBy('count', 'desc')
            .value();

        const categoryDistributionChart = {
            options: {
                ...chartBaseOptions,
                chart: { type: 'donut' },
                labels: categoryStats.map(c => c.name),
                legend: { position: 'bottom' },
                title: { text: 'Phân bổ loại sự kiện', style: { fontSize: '14px', fontWeight: 'bold' } },
                noData: { text: 'Chưa có dữ liệu phân loại' }
            },
            series: categoryStats.map(c => c.count)
        };

        // --- TRẢ VỀ ĐẦY ĐỦ DỮ LIỆU ---
        return { 
            summaryStats, 
            cohortRanking, 
            registrationsOverTimeChart, 
            categoryDistributionChart, 
            recentEvents 
        };

    }, [allData, user, chartBaseOptions]);
};

// =================================================================
// COMPONENT CHÍNH
// =================================================================
const StatisticsDashboard = () => {
    const { user } = useAuth();
    const { allData, loading, error } = useStatisticsData(user);
    const [selectedFacultyId, setSelectedFacultyId] = useState('');
     const [fullUserProfile, setFullUserProfile] = useState(null);
     

    // Tự động chọn khoa khi dữ liệu đã sẵn sàng
     useEffect(() => {
    if (loading || error) return; // Chờ cho đến khi có dữ liệu và không có lỗi

    // ƯU TIÊN 1: Luôn lấy khoa từ chính người dùng đang đăng nhập nếu có
     console.log("KIỂM TRA ĐỐI TƯỢNG USER TỪ AUTHCONTEXT:", user);
    if (user?.facultyId) {
      // Dùng String() để đảm bảo kiểu dữ liệu luôn là chuỗi
      setSelectedFacultyId(String(user.facultyId));
    } 
    // ƯU TIÊN 2 (DỰ PHÒNG): Nếu người dùng không thuộc khoa nào, mới lấy khoa đầu tiên
    else if (allData.faculties.length > 0) {
      setSelectedFacultyId(allData.faculties[0].facultyId);
    }
  }, [loading, error, user, allData.faculties]);
    console.log("BƯỚC 2: DỮ LIỆU ĐẦU VÀO CHO BỘ TÍNH TOÁN:", {
        selectedFacultyId: selectedFacultyId,
        soLuongKhoa: allData.faculties.length,
        soLuongSuKien: allData.events.length,
        soLuongNguoiDung: allData.users.length
    });

    const { summaryStats, cohortRanking, registrationsOverTimeChart, categoryDistributionChart, recentEvents } = useProcessedStatistics(allData, user);

    // --- Giao diện ---
    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorDisplay message={error} />;
    }

    const maxRankingRegistrations = cohortRanking.length > 0 ? cohortRanking[0].registrations : 0;
    
    return (
        <ThemeProvider value={customTheme}>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-4 md:p-8">
                <div className="max-w-8xl mx-auto">
                    {/* --- Header & Bộ lọc --- */}
                    <header className="flex flex-wrap justify-between items-center mb-8 gap-4">
                        <div>
                            <Typography variant="h2" color="blue-gray">Bảng Thống Kê</Typography>
                            <Typography color="gray" className="mt-1 font-normal">Phân tích tổng quan về hoạt động sự kiện của khoa.</Typography>
                        </div>
                       
                    </header>

                    {/* --- Nội dung chính --- */}
                    {/* Hiển thị nội dung chỉ khi đã chọn khoa */}
                    {!selectedFacultyId ? (
                        <div className="p-8 text-center text-blue-gray-500 bg-white rounded-lg shadow-md font-semibold text-lg">
                            Vui lòng chọn một khoa để xem thống kê.
                        </div>
                    ) : (
                        <>
                            {/* --- Thẻ thống kê tổng quan --- */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <StatCard icon={<FaRegChartBar className="h-7 w-7 text-light-blue-500" />} title="Sự kiện" value={summaryStats.totalEvents} />
                                <StatCard icon={<FaClipboardCheck className="h-7 w-7 text-indigo-500" />} title="Lượt tham gia" value={summaryStats.totalRegistrations} />
                                <StatCard icon={<FaUsers className="h-7 w-7 text-green-500" />} title="Sinh viên" value={summaryStats.totalUniqueStudents} />
                                <StatCard icon={<FaPercentage className="h-7 w-7 text-amber-500" />} title="Tỷ lệ tham dự" value={`${summaryStats.attendanceRate}%`} />
                            </div>

                            {/* --- Bố cục chính cho biểu đồ và bảng xếp hạng --- */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Cột chính (2/3) */}
                                <div className="lg:col-span-2 flex flex-col gap-8">
                                    <ChartCard
                                        title="Xu hướng tham gia sự kiện"
                                        chart={<Chart type="area" {...registrationsOverTimeChart} height={350} />}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <ChartCard
                                            title="Loại hình sự kiện"
                                            chart={<Chart type="donut" {...categoryDistributionChart} height={300} />}
                                        />
                                        <Card>
                                             <CardHeader variant="gradient" color="light-blue" floated={false} shadow={false} className="p-4">
                                                <Typography variant="h6" color="white">Top Khóa Tích Cực</Typography>
                                            </CardHeader>
                                            <CardBody className="flex flex-col gap-4 p-4">
                                                {cohortRanking.length > 0 ? cohortRanking.map(cohort => (
                                                    <div key={cohort.name}>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <Typography variant="h6" color="blue-gray" className="font-semibold">{cohort.name}</Typography>
                                                            <Typography color="blue-gray" className="font-medium">{cohort.registrations} lượt</Typography>
                                                        </div>
                                                        <Progress
                                                            value={maxRankingRegistrations > 0 ? (cohort.registrations / maxRankingRegistrations) * 100 : 0}
                                                            color="light-blue"
                                                            variant="filled"
                                                        />
                                                    </div>
                                                )) : (
                                                    <Typography className="text-center text-gray-500 py-8">Không có dữ liệu xếp hạng.</Typography>
                                                )}
                                            </CardBody>
                                        </Card>
                                    </div>
                                </div>

                                {/* Cột phụ (1/3) */}
                                <div className="lg:col-span-1">
                                     <Card>
                                        <CardHeader variant="gradient" color="light-blue" floated={false} shadow={false} className="p-4 flex items-center gap-3">
                                            <FaCalendarAlt className="h-6 w-6 text-white" />
                                            <Typography variant="h6" color="white">Sự kiện Gần đây</Typography>
                                        </CardHeader>
                                        <CardBody className="p-0">
                                            <ul className="divide-y divide-gray-200">
                                                {recentEvents.length > 0 ? recentEvents.map((event) => (
                                                    <li key={event.eventId} className="p-4 flex items-start gap-4 hover:bg-light-blue-50/50 transition-colors">
                                                        <div className={`mt-1 h-3 w-3 rounded-full ${new Date(event.startDate) > new Date() ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                        <div>
                                                            <Typography color="blue-gray" className="font-bold">{event.eventName}</Typography>
                                                            <Typography variant="small" color="gray">{new Date(event.startDate).toLocaleDateString('vi-VN')}</Typography>
                                                        </div>
                                                    </li>
                                                )) : (
                                                    <Typography className="text-center text-gray-500 p-8">Khoa này chưa có sự kiện nào.</Typography>
                                                )}
                                            </ul>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </ThemeProvider>
    );
};

export default StatisticsDashboard;