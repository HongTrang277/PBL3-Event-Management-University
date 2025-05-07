// src/pages/RegisteredEventsPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
// Giả sử bạn sẽ tạo hàm này trong mockData.jsx để lấy sự kiện đã đăng ký
import { getRegisteredEventsForStudent } from '../services/mockData';
import EventCard from '../components/features/Events/EventCard/EventCard'; // Tái sử dụng EventCard

// --- Styled Components (Tương tự các trang khác) ---
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

const StatusText = styled.p`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

const ErrorText = styled(StatusText)`
  color: #dc2626; /* text-red-600 */
`;

// --- Component ---
const RegisteredEventsPage = () => {
  const { user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      if (!user?.id) {
        setError("Không tìm thấy thông tin sinh viên.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        // Gọi hàm mock để lấy danh sách sự kiện đã đăng ký theo userId
        const response = await getRegisteredEventsForStudent(user.id);
        setRegisteredEvents(response.data || []);
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách sự kiện đã đăng ký.');
        setRegisteredEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, [user]); // Chạy lại khi user thay đổi

  return (
    <PageWrapper>
      <Title>Sự kiện đã đăng ký</Title>

      {isLoading && <StatusText>Đang tải danh sách...</StatusText>}
      {error && <ErrorText>Lỗi: {error}</ErrorText>}
      {!isLoading && !error && (
        <>
          {registeredEvents.length > 0 ? (
            <EventGrid>
              {registeredEvents.map((event) => (
                <EventCard key={event.event_id} event={event} />
              ))}
            </EventGrid>
          ) : (
            <StatusText>Bạn chưa đăng ký tham gia sự kiện nào.</StatusText>
          )}
        </>
      )}
    </PageWrapper>
  );
};

export default RegisteredEventsPage;