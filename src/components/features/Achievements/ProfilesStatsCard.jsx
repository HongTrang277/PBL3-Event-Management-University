// src/components/features/Achievements/ProfileStatsCard.jsx
import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../../contexts/AuthContext'; // Điều chỉnh đường dẫn nếu cần
import { FaUser, FaCheckSquare, FaStar } from 'react-icons/fa';

const CardWrapper = styled.div`
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  color: white;
  padding: 2rem 1.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px -10px rgba(30, 58, 138, 0.5);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
  svg {
    font-size: 1.75rem;
    color: white;
  }
`;

const UserText = styled.div`
  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
  }
  p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const StatItem = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 1rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);

  .value {
    font-size: 1.75rem;
    font-weight: 800;
    margin: 0;
    line-height: 1;
  }
  .label {
    margin: 0.25rem 0 0;
    font-size: 0.8rem;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const ProgressSection = styled.div`
  margin-top: auto; // Đẩy xuống cuối card
`;

const ProgressLabel = styled.p`
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
`;

const ProgressBar = styled.div`
    width: 100%;
    height: 10px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    overflow: hidden;
`;

const ProgressFill = styled.div`
    width: ${props => props.percentage}%;
    height: 100%;
    background: #60a5fa; // Màu xanh sáng hơn
    border-radius: 5px;
    transition: width 0.5s ease-in-out;
`;


const ProfileStatsCard = ({ earnedBadgesCount, totalBadgesCount, attendedEventsCount }) => {
    const { user } = useAuth();
    const progressPercentage = totalBadgesCount > 0 ? (earnedBadgesCount / totalBadgesCount) * 100 : 0;

    return (
        <CardWrapper>
            <UserInfo>
                <Avatar>
                    {user?.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" /> : <FaUser />}
                </Avatar>
                <UserText>
                    <h3>{user?.fullName || 'Chào bạn'}</h3>
                    <p>Chào mừng đến với trang thành tích</p>
                </UserText>
            </UserInfo>

            <StatsGrid>
                <StatItem>
                    <p className="value">{earnedBadgesCount}</p>
                    <p className="label">Huy hiệu</p>
                </StatItem>
                <StatItem>
                    <p className="value">{attendedEventsCount}</p>
                    <p className="label">Sự kiện</p>
                </StatItem>
            </StatsGrid>
            
            <ProgressSection>
                <ProgressLabel>
                    <span>Tiến trình huy hiệu</span>
                    <span>{earnedBadgesCount}/{totalBadgesCount}</span>
                </ProgressLabel>
                <ProgressBar>
                    <ProgressFill percentage={progressPercentage} />
                </ProgressBar>
            </ProgressSection>
        </CardWrapper>
    );
};

export default ProfileStatsCard;