import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { eventService } from '../services/api';
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
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

    // Fetch events when component mounts
    
    
    useEffect(() => {
      const fetchEvents = async () => {
        setIsLoading(true);
        setError(null);
    
        try {
          // Sử dụng mockData thay vì gọi API
          // const response = await eventService.getAllEvents();
          // setEvents(response.data || []);
          setTimeout(() => {
            setEvents(mockEvents); // mockEvents là một mảng các sự kiện mẫu
            setIsLoading(false);
          }, 500); // Giả lập loading
        } catch (err) {
          setError('Không thể tải danh sách sự kiện.');
          setIsLoading(false);
        }
      };
    
      fetchEvents();
    }, []);
  const handleAttendance = async () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ GPS.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('GPS Coordinates:', { latitude, longitude });

        try {
          // Gửi tọa độ GPS đến backend
          const response = await eventService.markAttendance(selectedEvent.event_id, {
            userId: user.id,
            latitude,
            longitude,
          });

          alert(response.data.message || 'Điểm danh thành công!');
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

  return (
    <PageWrapper>
      <Title>Điểm danh sự kiện</Title>

      {isLoading && <StatusText>Đang tải danh sách sự kiện...</StatusText>}
      {error && <ErrorText>Lỗi: {error}</ErrorText>}
      {!isLoading && !error && (
        <>
          {selectedEvent ? (
            <DetailWrapper>
              <DetailTitle>{selectedEvent.event_name}</DetailTitle>
              <DetailText>{selectedEvent.description}</DetailText>
              <DetailText>
                <strong>Thời gian:</strong> {new Date(selectedEvent.start_date).toLocaleString()} -{' '}
                {new Date(selectedEvent.end_date).toLocaleString()}
              </DetailText>
              <DetailText>
                <strong>Địa điểm:</strong> {selectedEvent.location}
              </DetailText>
              <AttendanceButton onClick={handleAttendance}>Điểm danh</AttendanceButton>
              <AttendanceButton
                style={{ marginLeft: '1rem', backgroundColor: '#6b7280' }}
                onClick={() => setSelectedEvent(null)}
              >
                Quay lại
              </AttendanceButton>
            </DetailWrapper>
          ) : (
            <EventGrid>
              {events.map((event) => (
                <EventCard key={event.event_id} onClick={() => setSelectedEvent(event)}>
                  <EventTitle>{event.event_name}</EventTitle>
                  <EventDescription>{event.description}</EventDescription>
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