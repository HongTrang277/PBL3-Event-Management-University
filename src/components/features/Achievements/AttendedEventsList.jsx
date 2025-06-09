// src/components/features/Achievements/AttendedEventsList.jsx
import React from 'react';
import styled from 'styled-components';
import EventCard from '../Events/EventCard/EventCard'; // Đảm bảo component này tồn tại và được style

// -- STYLED COMPONENTS --
const HorizontalScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1.5rem;
  padding: 0.5rem; // Thêm padding để bóng không bị cắt
  margin: 0 -0.5rem; 

  /* Style thanh cuộn hiện đại */
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #e2e8f0;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #94a3b8;
    border-radius: 10px;
    border: 2px solid #e2e8f0;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #64748b;
  }
`;

const CardWrapper = styled.div`
  flex: 0 0 340px; /* Tăng kích thước card một chút */
  min-width: 340px;
  transition: transform 0.3s ease;
  
  /* Đảm bảo EventCard của bạn có style card (nền, bo góc, bóng) */
  &:hover {
    transform: translateY(-5px);
  }
`;

const EmptyStateText = styled.p`
  color: #475569;
  padding: 2rem 1rem;
  text-align: center;
  font-style: italic;
`;

const AttendedEventsList = ({ events }) => {
    if (!events || events.length === 0) {
        return <EmptyStateText>Bạn chưa tham gia sự kiện nào. Hãy khám phá và tham gia ngay!</EmptyStateText>;
    }

    return (
        <HorizontalScrollContainer>
            {events.map((event) => (
                <CardWrapper key={event.eventId}>
                    {/* Lưu ý quan trọng: 
                      Component EventCard của bạn cần được cập nhật style (nếu cần)
                      để có nền trắng, bo góc (khoảng 1rem), và đổ bóng
                      để khớp hoàn toàn với thiết kế dashboard mới.
                    */}
                    <EventCard event={event} />
                </CardWrapper>
            ))}
        </HorizontalScrollContainer>
    );
};

export default AttendedEventsList;