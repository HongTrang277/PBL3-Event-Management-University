// src/components/features/Achievements/AchievementCard.js

import React from 'react';
import styled from 'styled-components';
import { FaCalendarCheck } from 'react-icons/fa';

const CardContainer = styled.div`
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1.25rem;
  align-items: center;
  border-top: 4px solid #1976D2;
  box-shadow: 0 4px 20px rgba(25, 118, 210, 0.12);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(25, 118, 210, 0.18);
  }
`;

// [MỚI] Wrapper cho logo sự kiện (dạng chữ nhật bo góc)
const EventLogoWrapper = styled.div`
  flex-shrink: 0;
  width: 80px;
  height: 60px;
  border-radius: 8px;
  background-color: #f0f4f8;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// Wrapper cho icon (khi không có logo)
const IconWrapper = styled.div`
  flex-shrink: 0;
  color: #1976D2;
  font-size: 2rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
`;

const Title = styled.h3`
  font-size: 1.15rem;
  font-weight: 600;
  color: #0D47A1;
  margin: 0;
  line-height: 1.4;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #546E7A;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionLink = styled.a`
  margin-top: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1976D2;
  text-decoration: none;
  border: 1px solid #90CAF9;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  align-self: flex-start;
  transition: all 0.2s ease;

  &:hover {
    background-color: #E3F2FD;
    border-color: #1976D2;
  }
`;

const AchievementCard = ({ type = 'event', title, date, link, imageUrl }) => {
  const formattedDate = date ? new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }) : '';

  return (
    <CardContainer>
      {/* [FINAL] Logic hiển thị logo sự kiện hoặc icon mặc định */}
      {imageUrl && type === 'event' ? (
        <EventLogoWrapper>
          <CardImage src={imageUrl} alt={title} />
        </EventLogoWrapper>
      ) : (
        <IconWrapper>
          <FaCalendarCheck />
        </IconWrapper>
      )}

      <ContentWrapper>
        <Title>{title}</Title>
        {date && (
          <Subtitle>
            <FaCalendarCheck style={{ fontSize: '0.85rem', flexShrink: 0 }} />
            <span>Ngày tham gia: {formattedDate}</span>
          </Subtitle>
        )}
        {link && (
          <ActionLink href={link} target="_blank" rel="noopener noreferrer">
            Xem sự kiện
          </ActionLink>
        )}
      </ContentWrapper>
    </CardContainer>
  );
};

export default AchievementCard;