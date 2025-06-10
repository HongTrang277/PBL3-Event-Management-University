// src/components/features/Achievements/BadgeCollection.js

import React from 'react';
import styled from 'styled-components';
import BadgeIcon from './BadgeIcon';

const BadgesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 2.5rem 1.5rem;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  border: 1px solid #B3E5FC;
`;

const EmptyStateText = styled.p`
  color: #0D47A1;
  padding: 2rem 1rem;
  text-align: center;
  font-style: italic;
  width: 100%;
`;

// [THAY ĐỔI] Component giờ chỉ cần nhận 1 prop `badges`
const BadgeCollection = ({ badges }) => {
  // [THAY ĐỔI] Nếu danh sách rỗng hoặc không có, hiển thị thông báo
  if (!badges || badges.length === 0) {
    return <EmptyStateText>Bạn chưa nhận được huy hiệu nào. Hãy tham gia các sự kiện để sưu tập nhé!</EmptyStateText>;
  }

  // [THAY ĐỔI] Logic được đơn giản hóa tối đa
  return (
    <BadgesGrid>
      {badges.map((badge) => (
        <BadgeIcon
          key={badge.badgeId}
          badgeName={badge.badgeText}
          eventName={badge.eventName} // Tên sự kiện đã được thêm ở component cha
          imageUrl={badge.iconUrl || 'https://via.placeholder.com/80'}
          isEarned={true} // Mọi huy hiệu ở đây đều đã nhận
          earnedDate={badge.dateEarned} // Lấy trực tiếp từ object
        />
      ))}
    </BadgesGrid>
  );
};

export default BadgeCollection;