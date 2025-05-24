import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { attendanceService, registrationService } from '../services/api';
import { FaMapMarkerAlt, FaClock, FaCheckCircle, FaArrowLeft } from "react-icons/fa";

// --- Styled Components ---
const PageWrapper = styled.div`
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f0f9ff;
`;

const Title = styled.h1`
  font-size: 2.3rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: #0284c7;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: -1px;
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
`;

const EventCard = styled.div`
  background: #fff;
  border-radius: 1.25rem;
  box-shadow: 0 4px 24px 0 #bae6fd55;
  padding: 2rem 1.5rem;
  cursor: pointer;
  border: 2px solid #e0f2fe;
  transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;

  &:hover {
    transform: translateY(-6px) scale(1.04);
    box-shadow: 0 8px 32px 0 #38bdf855;
    border-color: #38bdf8;
    background: #e0f2fe;
  }
`;

const EventTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0284c7;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EventDescription = styled.p`
  font-size: 1rem;
  color: #0369a1;
  margin-bottom: 0.5rem;
`;

const DetailWrapper = styled.div`
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px 0 #bae6fd77;
  padding: 2.5rem 2rem;
  margin-top: 2rem;
  border: 2px solid #38bdf8;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: flex-start;
`;

const DetailTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #0369a1;
  margin-bottom: 1.2rem;
  letter-spacing: -1px;
  background: #e0f2fe;
  border-radius: 0.7rem;
  padding: 0.7rem 1.2rem;
  display: inline-block;
`;

const HighlightField = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  background: #e0f2fe;
  color: #0284c7;
  border-left: 6px solid #38bdf8;
  border-radius: 0.75rem;
  padding: 0.7rem 1.2rem;
  font-weight: 600;
  font-size: 1.08rem;
  margin-bottom: 0.3rem;
`;

const AttendanceButton = styled.button`
  background: linear-gradient(90deg, #0284c7 0%, #38bdf8 100%);
  color: #fff;
  padding: 0.85rem 2.2rem;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  margin-top: 1.2rem;
  margin-right: 1rem;
  box-shadow: 0 4px 16px 0 #38bdf833;
  transition: background 0.18s, transform 0.18s;

  &:hover {
    background: linear-gradient(90deg, #38bdf8 0%, #0284c7 100%);
    transform: scale(1.04);
  }
`;

const BackButton = styled(AttendanceButton)`
  background: linear-gradient(90deg, #0e7490 0%, #bae6fd 100%);
  color: #fff;
  margin-top: 1.2rem;
  margin-right: 0;
  &:hover {
    background: linear-gradient(90deg, #bae6fd 0%, #0e7490 100%);
    color: #0369a1;
  }
`;

const StatusText = styled.p`
  text-align: center;
  padding: 2.5rem;
  color: #0284c7;
  font-size: 1.2rem;
  font-weight: 500;
`;

const ErrorText = styled(StatusText)`
  color: #dc2626;
  background: #fee2e2;
  border-radius: 1rem;
`;

const CurrentTime = styled.div`
  font-size: 1.08rem;
  color: #0e7490;
  background: #e0f2fe;
  border-radius: 0.7rem;
  padding: 0.5rem 1.1rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.7rem;
`;

// --- Component ---
const AttendancePage = () => {
  const { user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Cập nhật thời gian hiện tại mỗi giây khi đang ở trang chi tiết
  useEffect(() => {
    if (!selectedEvent) return;
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [selectedEvent]);

  const mapEventData = (eventItem) => {
    if (!eventItem) return null;
    let correctedEndDate = eventItem.endDate;
    if (typeof eventItem.endDate === 'string' && eventItem.endDate.includes("-25T")) {
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
          const mappedEvents = eventDataFromApi.map(mapEventData).filter(Boolean);
          const currentDate = new Date();
          const filteredEvents = mappedEvents.filter(event => {
            const startDate = new Date(event.startDate || event.start_date);
            const endDate = new Date(event.endDate || event.end_date);
            return currentDate >= startDate && currentDate <= endDate;
          });
          setRegisteredEvents(filteredEvents);

          if (mappedEvents.length > 0) {
            if (!selectedEvent || !mappedEvents.find(e => e.eventId === selectedEvent.eventId)) {
              setSelectedEvent(mappedEvents[0]);
            }
          } else {
            setSelectedEvent(null);
            setError(null);
          }
        } else {
          setError("Dữ liệu sự kiện đã đăng ký trả về không hợp lệ.");
          setRegisteredEvents([]);
          setSelectedEvent(null);
        }
      } catch (err) {
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
    } else if (user === null) {
      setError("Vui lòng đăng nhập để xem sự kiện đã đăng ký.");
      setIsLoading(false);
      setRegisteredEvents([]);
      setSelectedEvent(null);
    } else {
      setIsLoading(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
        const latitude = 0.0;
        const longitude = 0.0;
        const latitudeDouble = parseFloat(latitude);
        const longitudeDouble = parseFloat(longitude);
        try {
          const registrations = await registrationService.getAllRegistrations();
          const registration = registrations.find(r => r.eventId === selectedEvent.eventId && r.userId === user.id);
          const registrationId = registration?.registrationId;
          if (!registrationId) {
            alert('Bạn chưa đăng ký sự kiện này hoặc không tìm thấy đăng ký.');
            return;
          }
          await attendanceService.markAttendance({ registrationId, latitude, longitude });
          alert('Điểm danh thành công!');
        } catch (err) {
          alert(err.response?.data?.message || 'Điểm danh thất bại.');
        }
      },
      (error) => {
        alert('Không thể lấy tọa độ GPS. Vui lòng thử lại.');
      }
    );
  };

  // --- UI ---
  return (
    <PageWrapper>
      <Title>
        <FaCheckCircle style={{ color: "#0284c7", marginRight: "0.5rem" }} />
        Sự kiện đã đăng ký
      </Title>

      {isLoading && <StatusText>Đang tải danh sách sự kiện...</StatusText>}
      {error && <ErrorText>Lỗi: {error}</ErrorText>}
      {!isLoading && !error && (
        <>
          {registeredEvents.length === 0 ? (
            <StatusText>Bạn chưa đăng ký sự kiện nào.</StatusText>
          ) : selectedEvent ? (
            <DetailWrapper>
              <CurrentTime>
                <FaClock style={{ marginRight: 8 }} />
                Thời gian hiện tại: {currentTime.toLocaleString()}
              </CurrentTime>
              <DetailTitle>{selectedEvent.eventName}</DetailTitle>
              <HighlightField>
                <FaCheckCircle style={{ color: "#38bdf8" }} />
                {selectedEvent.description}
              </HighlightField>
              <HighlightField>
                <FaClock style={{ color: "#0284c7" }} />
                <strong>Thời gian:</strong> {new Date(selectedEvent.startDate || selectedEvent.start_date).toLocaleString()}
                {selectedEvent.endDate && ` - ${new Date(selectedEvent.endDate).toLocaleString()}`}
              </HighlightField>
              <HighlightField>
                <FaMapMarkerAlt style={{ color: "#0ea5e9" }} />
                <strong>Địa điểm:</strong> {selectedEvent.location}
              </HighlightField>
              <HighlightField>
                <strong>Trạng thái:</strong> {selectedEvent.status || "Đã đăng ký"}
              </HighlightField>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <AttendanceButton onClick={handleAttendance}>
                  <FaCheckCircle style={{ marginRight: "0.5rem" }} />
                  Điểm danh
                </AttendanceButton>
                <BackButton onClick={() => setSelectedEvent(null)}>
                  <FaArrowLeft style={{ marginRight: "0.5rem" }} />
                  Quay lại danh sách
                </BackButton>
              </div>
            </DetailWrapper>
          ) : (
            <EventGrid>
              {registeredEvents.map((event) => (
                <EventCard key={event.eventId} onClick={() => setSelectedEvent(event)}>
                  <EventTitle>
                    <FaCheckCircle style={{ color: "#0284c7" }} />
                    {event.eventName}
                  </EventTitle>
                  <EventDescription>
                    <FaClock style={{ color: "#0ea5e9" }} /> {new Date(event.startDate || event.start_date).toLocaleDateString()}
                  </EventDescription>
                  <EventDescription>
                    <FaCheckCircle style={{ color: "#22c55e" }} /> Trạng thái: {event.status || "Đã đăng ký"}
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