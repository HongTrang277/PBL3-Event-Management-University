// src/pages/StudentDashboardPage.jsx
import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { getAllEvents, getRegisteredEventsForStudent, registerForEvent, unregisterForEvent } from '../services/mockData'; // Import hàm lấy event
import EventSearchBar from '../components/features/Search/EventSearchBar/EventSearchBar';
import EventCard from '../components/features/Events/EventCard/EventCard'; // Import EventCard
import { ROLES } from '../utils/constants';

// --- Styled Components ---
const DashboardWrapper = styled.div`
  padding: 1.5rem;
  width:100% /* Example container */
  margin: 0 auto;
`;

const WelcomeMessage = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1f2937;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* Responsive grid */
  gap: 1.5rem;
`;

const LoadingText = styled.p`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

const ErrorText = styled.p`
  text-align: center;
  padding: 2rem;
  color: #dc2626; /* ~text-red-600 */
`;

// --- Component ---
const StudentDashboardPage = () => {
  const { user } = useAuth();
  // const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State cho tìm kiếm
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
  // Fetch events khi component mount
  useEffect(() => {
    const fetchData = async () => {
        // Chỉ fetch nếu user đã load và là student
        if (!user?.id || user?.role !== ROLES.STUDENT) {
             setIsLoading(false);
             // Có thể đặt lỗi hoặc không hiển thị gì nếu không phải student vào dashboard này
             if (user && user.role !== ROLES.STUDENT) {
                setError("Trang này chỉ dành cho sinh viên.");
             }
             return;
        }

        setIsLoading(true);
        setError(null);
        setRegisteredEventIds(new Set()); // Reset trước khi fetch

        try {
            // Dùng Promise.all để fetch song song
            const [eventsResponse, registeredResponse] = await Promise.all([
                getAllEvents(),
                getRegisteredEventsForStudent(user.id) // Fetch event đã đăng ký
            ]);

            // Lọc chỉ lấy các sự kiện đã được duyệt
            const approvedEvents = (eventsResponse.data || []).filter(e => e.approval_status === 'approved');
            setAllEvents(approvedEvents);

            // Lưu ID các sự kiện đã đăng ký vào Set
            const ids = new Set((registeredResponse.data || []).map(e => e.event_id));
            setRegisteredEventIds(ids);

        } catch (err) {
            setError(err.message || 'Không thể tải dữ liệu trang.');
            setAllEvents([]); // Xóa sự kiện nếu có lỗi
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
}, [user]); // Chạy lại khi user thay đổi (login/logout)

const handleRegister = async (eventId, studentId) => {
  // Kiểm tra lại phòng trường hợp gọi nhầm
  if (registeredEventIds.has(eventId)) {
       alert("Bạn đã đăng ký sự kiện này rồi.");
       return;
  }
  try {
      await registerForEvent(eventId, studentId);
      setRegisteredEventIds(prev => new Set(prev).add(eventId)); // Cập nhật state
      alert("Đăng ký thành công!");
  } catch (err) {
      alert(`Đăng ký thất bại: ${err.message}`);
  }
};

// Hàm xử lý hủy đăng ký (truyền xuống EventCard)
const handleUnregister = async (eventId, studentId) => {
  if (!registeredEventIds.has(eventId)) {
       alert("Bạn chưa đăng ký sự kiện này.");
       return;
  }
  try {
      await unregisterForEvent(eventId, studentId);
      setRegisteredEventIds(prev => { // Cập nhật state
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
      });
      alert("Hủy đăng ký thành công!");
  } catch (err) {
      alert(`Hủy đăng ký thất bại: ${err.message}`);
  }
};


  // Lọc sự kiện dựa trên searchTerm
  const filteredEvents = allEvents.filter(event =>
    event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
    // Thêm các trường tìm kiếm khác nếu muốn (ví dụ: host_id, tags)
  );

  const handleSearch = (term) => {
      setSearchTerm(term);
  };

  return (
    <DashboardWrapper>
      <WelcomeMessage>
        Chào mừng, {user?.name || 'Sinh viên'}!
      </WelcomeMessage>

      <Section>
        <SectionTitle>Tìm kiếm Sự kiện</SectionTitle>
        {/* Truyền hàm xử lý tìm kiếm vào EventSearchBar */}
        <EventSearchBar onSearch={handleSearch} placeholder="Tìm sự kiện theo tên, mô tả..." />
      </Section>

      <Section>
                <SectionTitle>
                    {searchTerm ? `Kết quả tìm kiếm (${filteredEvents.length})` : `Sự kiện nổi bật (${allEvents.length})`}
                </SectionTitle>
                {isLoading && <LoadingText>Đang tải sự kiện...</LoadingText>}
                {error && <ErrorText>Lỗi: {error}</ErrorText>}
                {!isLoading && !error && (
                    <EventGrid>
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => (
                                <EventCard
                                    key={event.event_id}
                                    event={event}
                                    // Xác định trạng thái đăng ký cho card này
                                    isAlreadyRegistered={registeredEventIds.has(event.event_id)}
                                    // Truyền các hàm xử lý xuống
                                    onRegister={handleRegister}
                                    onUnregister={handleUnregister}
                                />
                            ))
                        ) : (
                            <p>{searchTerm ? "Không tìm thấy sự kiện phù hợp." : "Chưa có sự kiện nào."}</p>
                        )}
                    </EventGrid>
                )}
            </Section>
    </DashboardWrapper>
  );
};

export default StudentDashboardPage;