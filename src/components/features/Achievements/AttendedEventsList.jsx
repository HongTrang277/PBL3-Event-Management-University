import React from 'react';
import styled from 'styled-components';
import AchievementCard from './AchievementCard';

const EventsGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyStateText = styled.p`
  /* [CHỈNH SỬA] Thay đổi màu chữ sang xanh dương sẫm */
  color: #0D47A1;
  padding: 2rem 1rem;
  text-align: center;
  font-style: italic;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
`;

const AttendedEventsList = ({ events }) => {
    if (!events || events.length === 0) {
        return <EmptyStateText>Bạn chưa tham gia sự kiện nào. Hãy khám phá và đăng ký ngay!</EmptyStateText>;
    }
    return (
        <EventsGridContainer>
            {events.map((event) => (
                <AchievementCard
                    key={event.eventId}
                    type="event"
                    title={event.eventName}
                    date={event.startTime}
                    link={`/events/${event.eventId}`}
                />
            ))}
        </EventsGridContainer>
    );
};

export default AttendedEventsList;