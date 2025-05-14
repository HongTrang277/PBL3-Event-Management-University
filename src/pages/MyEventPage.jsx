// src/pages/MyEventPage.jsx
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { getAllEvents } from '../services/mockData';
import { eventService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import EventCard from '../components/features/Events/EventCard/EventCard';
import Button from '../components/common/Button/Button';

// --- Styled Components (Giữ nguyên) ---
const PageWrapper = styled.div` width: 100%; max-width: 1280px; margin-left: auto; margin-right: auto; padding: 1.5rem; `;
const HeaderContainer = styled.div` display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; gap: 1rem; @media (min-width: 640px) { flex-direction: row; align-items: center; } `;
const Title = styled.h1` font-size: 1.5rem; line-height: 2rem; font-weight: 700; font-family: 'DM Sans', sans-serif; color: #1f2937; @media (min-width: 768px) { font-size: 1.875rem; line-height: 2.25rem; } `;
const EventGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; `;
const EmptyStateContainer = styled.div` text-align: center; padding: 2.5rem 1.5rem; background-color: #ffffff; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); `;
const EmptyStateIcon = styled.svg` margin-left: auto; margin-right: auto; height: 3rem; width: 3rem; color: #9ca3af; `;
const EmptyStateTitle = styled.h3` margin-top: 0.5rem; font-size: 0.875rem; line-height: 1.25rem; font-weight: 500; color: #111827; `;
const EmptyStateText = styled.p` margin-top: 0.25rem; font-size: 0.875rem; line-height: 1.25rem; color: #6b7280; `;
const EmptyStateLinkContainer = styled.div` margin-top: 1.5rem; `;
const StatusContainer = styled.div` text-align: center; padding: 2.5rem 0; `;
const ErrorStatusContainer = styled(StatusContainer)` color: #dc2626; `;


// --- Component ---
const MyEventsPage = () => {
    const { user } = useAuth(); // Lấy thông tin user để lọc sự kiện
    const [myEvents, setMyEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAndFilterEvents = async () => {
            // Chỉ fetch nếu user đã load và có faculty (định danh host)
            if (!user?.faculty) {
                setIsLoading(false);
                setMyEvents([]); // Không có sự kiện nào nếu không xác định được host
                // Có thể đặt lỗi nếu user role đúng nhưng thiếu faculty
                if (user && (user.role === ROLES.EVENT_CREATOR || user.role === ROLES.UNION)) {
                    setError("Không thể xác định đơn vị tổ chức của bạn.");
                }
                return;
            }

            setIsLoading(true);
            setError(null);
            console.log('Fetching events for faculty:', user.faculty);
            try {

                const response = await eventService.getAllEvents();
                const allEventsMockData = await getAllEvents();
                console.log('Mock data:', allEventsMockData);
                const allEvts = response.data || [];
                console.log('Fetched events:', allEvts);
                // Lọc sự kiện: host_id của sự kiện phải khớp với faculty của user
                const filtered = allEvts.filter(event => event.host_id === user.faculty);
                // Sắp xếp theo ngày tạo mới nhất hoặc ngày diễn ra gần nhất (tùy chọn)
                filtered.sort((a, b) => new Date(b.create_on) - new Date(a.create_on));
                setMyEvents(filtered);
            } catch (err) {
                setError(err.message || 'Không thể tải danh sách sự kiện.');
                setMyEvents([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndFilterEvents();
    }, [user]); // Chạy lại khi user thay đổi


    if (isLoading) {
        return <StatusContainer>Đang tải sự kiện của bạn...</StatusContainer>;
    }
    if (error) {
        return <ErrorStatusContainer>Lỗi: {error}</ErrorStatusContainer>;
    }

    return (
        <PageWrapper>
            <HeaderContainer>
                <Title>
                    Sự kiện của tôi ({myEvents.length})
                </Title>
                <RouterLink to="/admin/create-event">
                    <Button variant="primary">
                        + Tạo sự kiện mới
                    </Button>
                </RouterLink>
            </HeaderContainer>

            {myEvents.length > 0 ? (
                <EventGrid>
                    {myEvents.map((event) => (
                        // Chỉ cần truyền event, EventCard sẽ tự xử lý nút "Sửa"
                        <EventCard key={event.event_id} event={event} />
                    ))}
                </EventGrid>
            ) : (
                <EmptyStateContainer>
                    <EmptyStateIcon xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        {/* Icon khác hoặc giữ nguyên */}
                    </EmptyStateIcon>
                    <EmptyStateTitle>Chưa có sự kiện nào được tạo</EmptyStateTitle>
                    <EmptyStateText>Hãy tạo sự kiện đầu tiên cho đơn vị của bạn!</EmptyStateText>
                    <EmptyStateLinkContainer>
                        <RouterLink to="/admin/create-event">
                            <Button variant="primary">
                                + Tạo sự kiện mới
                            </Button>
                        </RouterLink>
                    </EmptyStateLinkContainer>
                </EmptyStateContainer>
            )}
        </PageWrapper>
    );
};

export default MyEventsPage;