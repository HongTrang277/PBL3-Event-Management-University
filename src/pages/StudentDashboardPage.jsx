// src/pages/StudentDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { eventService, registrationService } from '../services/api';
import EventSearchBar from '../components/features/Search/EventSearchBar/EventSearchBar';
import EventCard from '../components/features/Events/EventCard/EventCard';
import { ROLES } from '../utils/constants';

// --- Styled Components (Giữ nguyên) ---
const DashboardWrapper = styled.div`
  padding: 1.5rem;
  width:100%;
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
  color: #dc2626;
`;

// --- Component ---
const StudentDashboardPage = () => {
  const { user, userRoles, isAuthenticated } = useAuth();
  const [allEvents, setAllEvents] = useState([]); // Sẽ chứa tất cả sự kiện, không lọc approvalStatus
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [registeredEventMap, setRegisteredEventMap] = useState(new Map());

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user?.id) {
      setIsLoading(false);
      setAllEvents([]);
      setRegisteredEventMap(new Map());
      if (!isAuthenticated) {
        setError("Vui lòng đăng nhập để xem trang này.");
      }
      return;
    }

    // Chấp nhận cả 'User' và 'STUDENT'
    const isValidRole = user?.role === ROLES.STUDENT || user?.role === 'User' || 
                       (Array.isArray(userRoles) && userRoles.some(r => 
                         ['student', 'Student', 'User'].includes(r)
                       ));
    
    if (!isValidRole) {
      setError("Trang này chỉ dành cho sinh viên.");
      setIsLoading(false);
      return;
    }

      setIsLoading(true);
      setError(null);

      try {
        const eventsFromApi = await eventService.getAllEvents();

        if (!Array.isArray(eventsFromApi)) {
          console.error("API getAllEvents không trả về một mảng:", eventsFromApi);
          setError("Dữ liệu sự kiện trả về không hợp lệ.");
          setAllEvents([]);
          setIsLoading(false);
          return;
        }

        // BỎ LỌC THEO approvalStatus, LẤY TẤT CẢ SỰ KIỆN
        const eventsToDisplay = [...eventsFromApi].sort((a,b) => new Date(b.startDate) - new Date(a.startDate));
        setAllEvents(eventsToDisplay);

        // Xử lý việc lấy danh sách sự kiện đã đăng ký (vẫn giữ nguyên logic này)
        try {
          const registeredResponse = await registrationService.getEventsUserRegisteredFor(user.id);
          const registeredData = Array.isArray(registeredResponse) ? registeredResponse : (registeredResponse?.data || []);
          const newRegisteredMap = new Map();
          if (Array.isArray(registeredData)) {
            registeredData.forEach(reg => {
              const eventIdFromReg = reg.event?.eventId || reg.eventId;
              const registrationIdFromReg = reg.registrationId;
              if (eventIdFromReg && registrationIdFromReg) {
                newRegisteredMap.set(eventIdFromReg, registrationIdFromReg);
              }
            });
          }
          setRegisteredEventMap(newRegisteredMap);
        } catch (regError) {
          if (regError.isAxiosError && regError.response?.status === 404) {
            console.warn(`API /Registrations/Events/${user.id} trả về 404. Coi như người dùng chưa đăng ký sự kiện nào. Message từ server:`, regError.response?.data);
            setRegisteredEventMap(new Map());
          } else {
            console.error("Lỗi khi lấy danh sách sự kiện đã đăng ký:", regError);
            setRegisteredEventMap(new Map()); // Coi như chưa đăng ký nếu có lỗi
          }
        }
      } catch (mainError) {
        console.error("Lỗi khi fetch data chính (getAllEvents):", mainError);
        setError(mainError.response?.data?.message || mainError.message || 'Không thể tải dữ liệu trang.');
        setAllEvents([]);
        setRegisteredEventMap(new Map());
      } finally {
        setIsLoading(false);
      }
    };
    const isValidRole = user?.role === ROLES.STUDENT || user?.role === 'User' || 
                   (Array.isArray(userRoles) && userRoles.some(r => 
                     ['student', 'Student', 'User'].includes(r)
                   ));
    // Chỉ fetch khi đã xác thực và là sinh viên
    if (isAuthenticated && user?.id && isValidRole) {
        fetchData();
    } else {
        // Xử lý trường hợp chưa đăng nhập hoặc không phải sinh viên ở đây nếu cần thiết
        // (phần này đã được xử lý ở đầu hàm fetchData)
        setIsLoading(false); // Đảm bảo loading dừng nếu không fetch
    }
  }, [user, isAuthenticated]); // Dependency array

  const handleRegister = async (eventId) => {
    if (!user?.id) {
      alert("Vui lòng đăng nhập để đăng ký.");
      return;
    }
    if (registeredEventMap.has(eventId)) {
      alert("Bạn đã đăng ký sự kiện này rồi.");
      return;
    }
    try {
      const registrationData = await registrationService.registerUserForEvent(user.id, eventId);
      if (registrationData && registrationData.registrationId) {
        setRegisteredEventMap(prevMap => new Map(prevMap).set(registrationData.eventId || eventId, registrationData.registrationId));
        alert("Đăng ký thành công!");
      } else {
        alert("Đăng ký thành công nhưng không thể cập nhật trạng thái ngay. Vui lòng làm mới trang.");
        console.warn("API registerUserForEvent không trả về registrationId:", registrationData);
      }
    } catch (err) {
      alert(`Đăng ký thất bại: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleUnregister = async (eventId) => {
    if (!user?.id) {
      alert("Vui lòng đăng nhập.");
      return;
    }
    const registrationId = registeredEventMap.get(eventId);
    if (!registrationId) {
      alert("Bạn chưa đăng ký sự kiện này hoặc có lỗi xảy ra.");
      console.error("Không tìm thấy registrationId cho eventId:", eventId, "trong map:", registeredEventMap);
      return;
    }
    try {
      await registrationService.removeRegistration(registrationId);
      setRegisteredEventMap(prevMap => {
        const newMap = new Map(prevMap);
        newMap.delete(eventId);
        return newMap;
      });
      alert("Hủy đăng ký thành công!");
    } catch (err) {
      alert(`Hủy đăng ký thất bại: ${err.response?.data?.message || err.message}`);
    }
  };

  // Lọc sự kiện dựa trên searchTerm (áp dụng cho allEvents đã lấy về)
  const filteredEvents = allEvents.filter(event => {
    const eventName = event.eventName || "";
    const eventDescription = event.description || "";
    const eventTagsArray = Array.isArray(event.tagsList) ? event.tagsList : (Array.isArray(event.tags) ? event.tags : []);

    return eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           eventDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (eventTagsArray.some(tag => String(tag).toLowerCase().includes(searchTerm.toLowerCase())));
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (!isAuthenticated && !isLoading) {
      return (
          <DashboardWrapper>
              <ErrorText>{error || "Vui lòng đăng nhập để truy cập trang này."}</ErrorText>
          </DashboardWrapper>
      );
  }

  return (
    <DashboardWrapper>
      <WelcomeMessage>
        Chào mừng, {user?.name || 'Sinh viên'}!
      </WelcomeMessage>

      <Section>
        <SectionTitle>Tìm kiếm Sự kiện</SectionTitle>
        <EventSearchBar onSearch={handleSearch} placeholder="Tìm sự kiện theo tên, mô tả, tag..." />
      </Section>

      <Section>
        <SectionTitle>
          {/* Hiển thị số lượng sự kiện sau khi lọc tìm kiếm, hoặc tổng số sự kiện nếu không tìm kiếm */}
          {searchTerm ? `Kết quả tìm kiếm (${filteredEvents.length})` : `Tất cả Sự kiện (${allEvents.length})`}
        </SectionTitle>
        {isLoading && <LoadingText>Đang tải sự kiện...</LoadingText>}
        {error && !isLoading && <ErrorText>Lỗi: {error}</ErrorText>}
        {!isLoading && !error && (
          <EventGrid>
            {/* Luôn render từ filteredEvents */}
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard
                  key={event.eventId}
                  event={event}
                  isAlreadyRegistered={registeredEventMap.has(event.eventId)}
                  onRegister={() => handleRegister(event.eventId)}
                  onUnregister={() => handleUnregister(event.eventId)}
                />
              ))
            ) : (
              <p>{searchTerm ? "Không tìm thấy sự kiện phù hợp." : (allEvents.length === 0 ? "Hiện chưa có sự kiện nào." : "Không có sự kiện nào khớp với tìm kiếm.")}</p>
            )}
          </EventGrid>
        )}
      </Section>
    </DashboardWrapper>
  );
};

export default StudentDashboardPage;