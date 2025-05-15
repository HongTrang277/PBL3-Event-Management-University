import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { eventService } from '../services/api';
import { attendanceService, registrationService } from '../services/api';
import { mockEvents } from '../services/mockData';
// --- Styled Components ---

const PageWrapper = styled.div`
  padding: 1.5rem;
  max-width: 1280px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1f2937;
  font-family: 'DM Sans', sans-serif;
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const EventCard = styled.div`
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const EventTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const EventDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
`;

const DetailWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  margin-top: 1.5rem;
`;

const DetailTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const DetailText = styled.p`
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 1rem;
`;

const AttendanceButton = styled.button`
  background-color: #3b82f6;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #2563eb;
  }
`;

const StatusText = styled.p`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

const ErrorText = styled(StatusText)`
  color: #dc2626;
`;

// --- Component ---

  const AttendancePage = () => {
    const { user } = useAuth();
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    // ...fetch events...
    const mapEventData = (eventItem) => {
        if (!eventItem) return null;
        let correctedEndDate = eventItem.endDate;
        if (typeof eventItem.endDate === 'string' && eventItem.endDate.includes("-25T")) {
            console.warn(`Ngày kết thúc không hợp lệ: ${eventItem.endDate} cho sự kiện ${eventItem.eventName}. Sửa thành null.`);
            correctedEndDate = null;
        }
        return {
            ...eventItem,
            coverUrl: eventItem.coverUrl1 || eventItem.coverUrl,
            logoUrl: eventItem.logoUrl1 || eventItem.logoUrl,
            hostId: eventItem.hostID || eventItem.hostId,
            endDate: correctedEndDate,
        };
    };

    useEffect(() => {
            const fetchRegisteredEvents = async () => {
                if (!user?.id) {
                    setError("Vui lòng đăng nhập để xem sự kiện đã đăng ký.");
                    setIsLoading(false);
                    setRegisteredEvents([]);
                    setSelectedEvent(null);
                    return;
                }
    
                setIsLoading(true);
                setError(null);
                try {
                    const eventDataFromApi = await registrationService.getEventsUserRegisteredFor(user.id);
                    
                    if (Array.isArray(eventDataFromApi)) {
                        const mappedEvents = eventDataFromApi.map(mapEventData).filter(Boolean); // Lọc bỏ null nếu mapEventData trả về null
                        //lọc các sự kiện có thời gian hiện tại nằm giữa thời gian bắt đầu và kết thúc
                        const currentDate = new Date();
                        const filteredEvents = mappedEvents.filter(event => {
                            const startDate = new Date(event.startDate || event.start_date);
                            const endDate = new Date(event.endDate || event.end_date);
                            return currentDate >= startDate && currentDate <= endDate;
                        });
                        setRegisteredEvents(filteredEvents);
    
                        if (mappedEvents.length > 0) {
                            // Nếu chưa có sự kiện nào được chọn, hoặc sự kiện đang được chọn không còn trong danh sách mới
                            if (!selectedEvent || !mappedEvents.find(e => e.eventId === selectedEvent.eventId)) {
                               setSelectedEvent(mappedEvents[0]); // Chọn sự kiện đầu tiên
                            }
                        } else {
                            setSelectedEvent(null); // Không có sự kiện nào, không chọn gì cả
                            setError(null);
                        }
                    } else {
                        console.error("API không trả về một mảng:", eventDataFromApi);
                        setError("Dữ liệu sự kiện đã đăng ký trả về không hợp lệ.");
                        setRegisteredEvents([]);
                        setSelectedEvent(null);
                    }
                } catch (err) {
                    console.error("Lỗi khi tải sự kiện đã đăng ký:", err);
                    let errorMessage = 'Không thể tải danh sách sự kiện đã đăng ký.';
                    if (err.response) {
                        if (err.response.status === 404) {
                            setError(null); 
                        } else if (err.response.data?.message) {
                            errorMessage = err.response.data.message;
                            setError(errorMessage);
                        } else {
                            setError(errorMessage);
                        }
                    } else {
                        setError(err.message || errorMessage);
                    }
                    setRegisteredEvents([]);
                    setSelectedEvent(null);
                } finally {
                    setIsLoading(false);
                }
            };
    
            if (user && user.id) {
                fetchRegisteredEvents();
            } else if (user === null) { // User đã load xong, nhưng không đăng nhập
                setError("Vui lòng đăng nhập để xem sự kiện đã đăng ký.");
                setIsLoading(false);
                setRegisteredEvents([]);
                setSelectedEvent(null);
            } else { // user là undefined (đang trong quá trình useAuth xác thực)
                setIsLoading(true); // Tiếp tục loading
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [user]); // Chỉ fetch lại khi user thay đổi

    
    const handleAttendance = async () => {
      if (!user?.id) {
        alert('Bạn cần đăng nhập để điểm danh.');
        return;
      }
      if (!navigator.geolocation) {
        alert('Trình duyệt của bạn không hỗ trợ GPS.');
        return;
      }
  
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          //! const { latitude, longitude } = position.coords;
          const latitude=0.0;
          const longitude=0.0;
          //convert latitude, longitude to double
          const latitudeDouble = parseFloat(latitude);
          const longitudeDouble = parseFloat(longitude);
          try {
            // Lấy danh sách đăng ký của user
           const registrations = await registrationService.getAllRegistrations();
               console.log("Danh sách đăng ký:", registrations);
               // Tìm registrationId theo eventId
               const registration = registrations.find(r => r.eventId === selectedEvent.eventId && r.userId === user.id);
               const registrationId = registration?.registrationId;
               console.log("registrationId:", registrationId);
            if (!registrationId) {
              alert('Bạn chưa đăng ký sự kiện này hoặc không tìm thấy đăng ký.');
              return;
            }
            // Gửi điểm danh
            console.log("Gửi điểm danh với tọa độ:", latitude, longitude);
            console.log("registrationId:", registrationId);
            console.log({
  registrationId,
  latitude: latitudeDouble,
  longitude: longitudeDouble
});
            await attendanceService.markAttendance({ registrationId, latitude, longitude });
            
            alert('Điểm danh thành công!');
          } catch (err) {
            alert(err.response?.data?.message || 'Điểm danh thất bại.');
          }
        },
        (error) => {
          alert('Không thể lấy tọa độ GPS. Vui lòng thử lại.');
          console.error('GPS Error:', error);
        }
      );
    };
  
    // ...UI giữ nguyên...
  return (
    <PageWrapper>
      <Title>Sự kiện đã đăng ký</Title>

      {isLoading && <StatusText>Đang tải danh sách sự kiện...</StatusText>}
      {error && <ErrorText>Lỗi: {error}</ErrorText>}
      {!isLoading && !error && (
        <>
          {registeredEvents.length === 0 ? (
            <StatusText>Bạn chưa đăng ký sự kiện nào.</StatusText>
          ) : selectedEvent ? (
            <DetailWrapper>
              <DetailTitle>{selectedEvent.eventName}</DetailTitle>
              <DetailText>{selectedEvent.description}</DetailText>
              <DetailText>
                <strong>Thời gian:</strong> {new Date(selectedEvent.startDate || selectedEvent.start_date).toLocaleString()} 
                {selectedEvent.endDate && ` - ${new Date(selectedEvent.endDate).toLocaleString()}`}
              </DetailText>
              <DetailText>
                <strong>Địa điểm:</strong> {selectedEvent.location}
              </DetailText>
              <DetailText>
                <strong>Trạng thái:</strong> {selectedEvent.status || "Đã đăng ký"}
              </DetailText>
              <AttendanceButton onClick={handleAttendance}>Điểm danh</AttendanceButton>
              <AttendanceButton
                style={{ marginLeft: '1rem', backgroundColor: '#6b7280' }}
                onClick={() => setSelectedEvent(null)}
              >
                Quay lại danh sách
              </AttendanceButton>
            </DetailWrapper>
          ) : (
            <EventGrid>
              {registeredEvents.map((event) => (
                <EventCard key={event.eventId} onClick={() => setSelectedEvent(event)}>
                  <EventTitle>{event.eventName}</EventTitle>
                  <EventDescription>
                    {new Date(event.startDate || event.start_date).toLocaleDateString()}
                  </EventDescription>
                  <EventDescription>
                    Trạng thái: {event.status || "Đã đăng ký"}
                  </EventDescription>
                </EventCard>
              ))}
            </EventGrid>
          )}
        </>
      )}
    </PageWrapper>
  );
};


export default AttendancePage;