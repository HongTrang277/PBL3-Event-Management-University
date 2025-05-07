// src/pages/StudentDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { getAllEvents } from '../services/mockData'; // Import hàm lấy event
import EventSearchBar from '../components/features/Search/EventSearchBar/EventSearchBar';
import EventCard from '../components/features/Events/EventCard/EventCard'; // Import EventCard

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
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State cho tìm kiếm

  // Fetch events khi component mount
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getAllEvents(); // Sử dụng hàm mock
        setEvents(response.data || []);
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách sự kiện.');
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Lọc sự kiện dựa trên searchTerm
  const filteredEvents = events.filter(event =>
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
        <SectionTitle>Sự kiện nổi bật</SectionTitle>
        {isLoading && <LoadingText>Đang tải sự kiện...</LoadingText>}
        {error && <ErrorText>Lỗi: {error}</ErrorText>}
        {!isLoading && !error && (
          <EventGrid>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                // Sử dụng EventCard để hiển thị từng sự kiện
                <EventCard key={event.event_id} event={event} />
              ))
            ) : (
              <p>Không tìm thấy sự kiện nào.</p>
            )}
          </EventGrid>
        )}
      </Section>

    </DashboardWrapper>
  );
};

export default StudentDashboardPage;