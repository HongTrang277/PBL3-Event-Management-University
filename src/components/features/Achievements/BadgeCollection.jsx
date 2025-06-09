// src/components/features/Achievements/BadgeCollection.jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Tooltip } from 'react-tooltip';

// -- KEYFRAMES --
const cardFadeIn = keyframes`
  from { opacity: 0; transform: scale(0.98) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

// -- STYLED COMPONENTS --
const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1.5rem;
`;

const BadgeCard = styled.div`
  background-color: #FFFFFF;
  border-radius: 12px;
  border: 2px solid ${props => (props.$isEarned ? '#00ACC1' : '#B2EBF2')};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  opacity: 0;
  animation: ${cardFadeIn} 0.5s ease-out forwards;
  animation-delay: ${props => props.$delay || '0s'};
  
  filter: ${props => (props.$isEarned ? 'none' : 'grayscale(80%)')};
  opacity: ${props => (props.$isEarned ? 1 : 0.8)};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 121, 107, 0.15);
    border-color: #00796B;
    filter: none;
    opacity: 1;
  }
`;

const BadgeIcon = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 0.75rem;
`;

const BadgeText = styled.p`
  font-size: 0.875rem;
  color: #37474F;
  font-weight: 500;
  line-height: 1.3;
`;

const EmptyStateText = styled.p`
  color: #00796B;
  padding: 1rem;
  text-align: center;
`;

const BadgeCollection = ({ allBadges, earnedBadges }) => {
    const earnedBadgeIds = new Set(earnedBadges.map(b => b.badgeId));

    if (!allBadges || allBadges.length === 0) {
        return <EmptyStateText>Chưa có huy hiệu nào trong hệ thống.</EmptyStateText>;
    }

    return (
        <>
            <BadgeGrid>
                {allBadges.map((badge, index) => {
                    const isEarned = earnedBadgeIds.has(badge.badgeId);
                    const tooltipId = `badge-tooltip-${badge.badgeId}`;

                    return (
                        <BadgeCard
                            key={badge.badgeId}
                            data-tooltip-id={tooltipId}
                            data-tooltip-content={badge.badgeText}
                            data-tooltip-place="top"
                            $isEarned={isEarned}
                            $delay={`${index * 0.05}s`}
                        >
                            <BadgeIcon src={badge.iconUrl} alt={badge.badgeText} />
                            <BadgeText>{badge.badgeText}</BadgeText>
                        </BadgeCard>
                    );
                })}
            </BadgeGrid>
            
            <Tooltip
                id={allBadges.map(b => `badge-tooltip-${b.badgeId}`).join(' ')}
                style={{
                  backgroundColor: "#004D40",
                  color: "#FFFFFF",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  padding: "0.5rem 1rem",
                }}
            />
        </>
    );
};

export default BadgeCollection;