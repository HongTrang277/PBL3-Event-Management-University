import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
// [CHỈNH SỬA] Giữ lại các service cần thiết
import { badgeService, eventService, attendanceService } from '../services/api';
import { FaTrophy } from "react-icons/fa";

// --- IMPORT CÁC COMPONENT GIAO DIỆN ---
import BadgeCollection from '../components/features/Achievements/BadgeCollection';
import AttendedEventsList from '../components/features/Achievements/AttendedEventsList';

// -- KEYFRAMES --
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

// -- STYLED COMPONENTS --
const PageContainer = styled.div`
  background-color: #E3F2FD; 
  min-height: 100vh;
  padding: 2rem 3rem; 

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Header = styled.header`
  margin-bottom: 2.5rem;
  animation: ${fadeIn} 0.5s ease-out forwards;
`;

const MainTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: #1976D2; 
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TitleIcon = styled.div`
  width: 48px;
  height: 48px;
  background-color: #1976D2; 
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
`;

const Subtitle = styled.p`
    font-size: 1.1rem;
    color: #0D47A1; 
    margin-top: 0;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem; 
`;

const SectionCard = styled.div`
  animation: ${fadeIn} 0.6s ease-out forwards;
`;

const SectionTitle = styled.h2`
  font-size: 1.7rem;
  font-weight: 600;
  color: #1976D2; 
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #42A5F5; 
`;

const StatusMessage = styled.p`
  font-size: 1.2rem;
  color: #0D47A1;
  text-align: center;
  padding: 3rem;
  font-weight: 500;
`;

const AchievementsPage = () => {
    const { user } = useAuth();
    // [THAY ĐỔI] Chỉ cần state cho huy hiệu đã nhận
    const [earnedBadges, setEarnedBadges] = useState([]);
    const [attendedEvents, setAttendedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user?.id) { 
            setLoading(false); 
            return; 
        }
        
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // [THAY ĐỔI] Xóa bỏ việc gọi allBadges, chỉ gọi những gì cần thiết
                const [
                    earnedBadgesData, 
                    attendedEventsData,
                    allEventsData 
                ] = await Promise.all([
                    badgeService.getBadgesByUserId(user.id), // <-- Chỉ lấy huy hiệu của user
                    attendanceService.getEventsUserMarkedAttendanceFor(user.id),
                    eventService.getAllEvents() // <-- Vẫn cần để lấy tên sự kiện
                ]);

                // Tạo bản đồ để tra cứu tên sự kiện (giữ nguyên)
                const eventNameMap = new Map(
                    (allEventsData || []).map(event => [event.eventId, event.eventName])
                );

                // [THAY ĐỔI] "Làm giàu" dữ liệu cho danh sách huy hiệu *đã nhận*
                const enrichedEarnedBadges = (earnedBadgesData || []).map(badge => ({
                    ...badge,
                    eventName: eventNameMap.get(badge.eventId) || 'Sự kiện không xác định'
                }));

                // Cập nhật state
                setEarnedBadges(enrichedEarnedBadges); // <-- Sử dụng danh sách đã được làm giàu
                setAttendedEvents(attendedEventsData || []);

            } catch (err) {
                console.error("Lỗi khi tải dữ liệu thành tích:", err);
                setError("Không thể tải dữ liệu thành tích.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) {
        return (
            <PageContainer>
                <StatusMessage>Đang tải...</StatusMessage>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <StatusMessage>{error}</StatusMessage>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <Header>
                <MainTitle>
                    <TitleIcon><FaTrophy /></TitleIcon>
                    Bảng Thành Tích
                </MainTitle>
                <Subtitle>Theo dõi tiến trình và các thành tựu bạn đã đạt được.</Subtitle>
            </Header>

            <MainContent>
                <SectionCard>
                    <SectionTitle>Bộ sưu tập Huy hiệu</SectionTitle>
                    {/* [THAY ĐỔI] Chỉ truyền xuống danh sách huy hiệu đã nhận */}
                    <BadgeCollection badges={earnedBadges} />
                </SectionCard>

                <SectionCard>
                    <SectionTitle>Sự kiện đã tham gia</SectionTitle>
                    <AttendedEventsList events={attendedEvents} />
                </SectionCard>
            </MainContent>
        </PageContainer>
    );
};

export default AchievementsPage;