// src/components/features/Achievements/BadgeIcon.js

import React from 'react';
import styled from 'styled-components';

// [FINAL] Tooltip để hiển thị tên huy hiệu khi hover
const BadgeTooltip = styled.div`
  position: absolute;
  bottom: 105%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #0D47A1;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #0D47A1 transparent transparent transparent;
  }
`;

const BadgeWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  text-align: center;
  width: 120px;

  &:hover ${BadgeTooltip} {
    opacity: 1;
    visibility: visible;
  }
`;

const BadgeCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #E3F2FD;
  border: 3px solid white;
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  overflow: hidden;
  filter: ${props => (props.$isEarned ? 'none' : 'grayscale(90%) opacity(0.6)')};

  ${BadgeWrapper}:hover & {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(25, 118, 210, 0.3);
  }
`;

const BadgeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// [FINAL] Component này sẽ hiển thị TÊN SỰ KIỆN
const EventNameText = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
  color: #0D47A1;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.6em;
`;

// [FINAL] Component này hiển thị NGÀY NHẬN
const BadgeDate = styled.p`
  font-size: 0.8rem;
  color: #546E7A;
  margin: -0.5rem 0 0 0;
`;

const BadgeIcon = ({ badgeName, eventName, imageUrl, isEarned, earnedDate }) => {
  const formattedDate = earnedDate ? new Date(earnedDate).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }) : '';

  return (
    <BadgeWrapper>
      <BadgeCircle $isEarned={isEarned}>
        <BadgeTooltip>{badgeName}</BadgeTooltip>
        <BadgeImage src={imageUrl} alt={badgeName} />
      </BadgeCircle>
      
      {eventName && <EventNameText>{eventName}</EventNameText>}

      {isEarned && earnedDate && (
        <BadgeDate>{formattedDate}</BadgeDate>
      )}
    </BadgeWrapper>
  );
};

export default BadgeIcon;