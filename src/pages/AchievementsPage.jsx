// src/pages/AchievementsPage.jsx
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { badgeService, attendanceService } from '../services/api';

import BadgeCollection from '../components/features/Achievements/BadgeCollection';
import AttendedEventsList from '../components/features/Achievements/AttendedEventsList';

// Keyframes cho hiệu ứng xuất hiện
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// -- STYLED COMPONENTS --

// Container chính với nền gradient xanh biển
const PageContainer = styled.div`
  padding: 2rem 3rem;
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(180deg, #F0F7FA 0%, #E0F2F1 100%);
  min-height: 100vh;
`;

const Header = styled.header`
    text-align: center;
    margin-bottom: 3rem;
    animation: ${fadeIn} 0.5s ease-out forwards;
`;

const MainTitle = styled.h1`
    font-size: 2.75rem;
    font-weight: 800;
    color: #004D40; // Màu xanh đậm cho tiêu đề chính
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
`;

const Section = styled.section`
  margin-bottom: 4rem;
  animation: ${fadeIn} 0.7s ease-out forwards;
  opacity: 0; // Bắt đầu ẩn đi
  animation-fill-mode: forwards; // Giữ trạng thái cuối của animation

  &:nth-child(2) {
    animation-delay: 0.2s;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #00796B; // Màu xanh trung bình cho tiêu đề section
  padding-bottom: 0.75rem;
  border-bottom: 3px solid #B2DFDB; // Đường kẻ chân trang nhạt hơn
`;

const StatusMessage = styled.p`
    font-size: 1.2rem;
    color: #00796B;
    text-align: center;
    padding: 2rem;
`;


const AchievementsPage = () => {
    const { user } = useAuth();
    const [earnedBadges, setEarnedBadges] = useState([]);
    const [allBadges, setAllBadges] = useState([]);
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
                const [earnedBadgesData, allBadgesData, attendedEventsData] = await Promise.all([
                    badgeService.getBadgesByUserId(user.id),
                    badgeService.getAllBadges(),
                    attendanceService.getEventsUserMarkedAttendanceFor(user.id)
                ]);
                setEarnedBadges(earnedBadgesData || []);
                setAllBadges(allBadgesData || []);
                setAttendedEvents(attendedEventsData || []);
            } catch (err) {
                setError("Không thể tải dữ liệu thành tích. Vui lòng thử lại sau.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) return <PageContainer><StatusMessage>Đang tải thành tích của bạn...</StatusMessage></PageContainer>;
    if (error) return <PageContainer><StatusMessage>{error}</StatusMessage></PageContainer>;

    return (
        <PageContainer>
            <Header>
                <MainTitle>Trang Thành Tích</MainTitle>
            </Header>

            <Section>
                <SectionTitle>Bộ Sưu Tập Huy Hiệu</SectionTitle>
                <BadgeCollection allBadges={allBadges} earnedBadges={earnedBadges} />
            </Section>

            <Section>
                <SectionTitle>Các Sự Kiện Đã Tham Gia</SectionTitle>
                <AttendedEventsList events={attendedEvents} />
            </Section>
        </PageContainer>
    );
};

export default AchievementsPage;