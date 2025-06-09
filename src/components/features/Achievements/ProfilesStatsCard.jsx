import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../../contexts/AuthContext'; // Điều chỉnh đường dẫn nếu cần
import { FaUser } from 'react-icons/fa';

// --- STYLED COMPONENTS ---
const CardWrapper = styled.div`
  background-color: #E9F2FF; /* Nền xanh nhạt */
  color: #212529; /* Chữ đen đậm */
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #CFE2FF; /* Viền xanh nhạt */
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #007BFF;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  img {
    width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
  }
  svg {
    font-size: 1.5rem; color: white;
  }
`;

const UserText = styled.div`
  h3 {
    margin: 0; font-size: 1.1rem; font-weight: 600; color: #212529;
  }
  p {
    margin: 0; font-size: 0.9rem; color: #6C757D;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const StatItem = styled.div`
  background-color: #FFFFFF;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: left;
  border: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
    font-size: 1.25rem;
    color: #007BFF;
`;

const StatContent = styled.div`
    .value {
        font-size: 1.25rem; font-weight: 600; margin: 0; line-height: 1;
    }
    .label {
        margin: 0.25rem 0 0; font-size: 0.8rem; color: #6C757D;
    }
`;

const ProgressSection = styled.div`
  margin-top: auto;
`;

const ProgressLabel = styled.p`
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    font-weight: 500;
    color: #6C757D;
    display: flex;
    justify-content: space-between;
`;

const ProgressBar = styled.div`
    width: 100%; height: 8px; background-color: #dee2e6; border-radius: 4px; overflow: hidden;
`;

const ProgressFill = styled.div`
    width: ${props => props.percentage}%;
    height: 100%;
    background: #007BFF;
    border-radius: 4px;
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
                    <p>Chào mừng trở lại!</p>
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