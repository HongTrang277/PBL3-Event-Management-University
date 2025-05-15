// src/pages/MyEventPage.jsx
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { eventService } from '../services/api'; // Import service API thật
import { useAuth } from '../hooks/useAuth';
import EventCard from '../components/features/Events/EventCard/EventCard';
import Button from '../components/common/Button/Button';
import { ROLES } from '../utils/constants';

// --- Styled Components (Giữ nguyên như trong file của bạn) ---
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
    const { user } = useAuth();
    const [myEvents, setMyEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false); // State cho việc đang xóa

    const fetchMyEvents = async () => { // Tách hàm fetch để có thể gọi lại
        if (!user?.id) {
            setIsLoading(false);
            setMyEvents([]);
            if (user && (user.role === ROLES.EVENT_CREATOR || user.role === ROLES.UNION)) {
                setError("Không thể xác định người dùng để tải sự kiện.");
            }
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const allEventsData = await eventService.getAllEvents();
            if (!Array.isArray(allEventsData)) {
                console.error("API did not return an array of events:", allEventsData);
                setError("Dữ liệu sự kiện trả về không hợp lệ.");
                setMyEvents([]);
                setIsLoading(false);
                return;
            }
            const filtered = allEventsData.filter(event => {
                const hostIdFromEvent = event.hostId;
                return String(hostIdFromEvent) === String(user.id);
            });
            filtered.sort((a, b) => {
                const dateA = a.createAt || a.startDate;
                const dateB = b.createAt || b.startDate;
                return new Date(dateB) - new Date(dateA);
            });
            setMyEvents(filtered);
        } catch (err) {
            console.error("Error fetching events:", err);
            setError(err.response?.data?.message || err.message || 'Không thể tải danh sách sự kiện của bạn.');
            setMyEvents([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMyEvents();
        } else {
            setIsLoading(false);
            setMyEvents([]);
        }
    }, [user]);

    const handleDeleteEvent = async (eventId) => {
        if (!eventId) {
            console.error("Event ID is missing for delete operation.");
            alert("Lỗi: Không có ID sự kiện để xóa.");
            return;
        }

        const eventToDelete = myEvents.find(event => event.eventId === eventId);
        const eventName = eventToDelete ? eventToDelete.eventName : "sự kiện này";

        if (window.confirm(`Bạn có chắc chắn muốn xóa sự kiện "${eventName}" không? Thao tác này không thể hoàn tác.`)) {
            setIsDeleting(true); // Bắt đầu trạng thái đang xóa
            try {
                await eventService.deleteEvent(eventId);
                // Cập nhật UI bằng cách lọc ra sự kiện đã xóa
                setMyEvents(prevEvents => prevEvents.filter(event => event.eventId !== eventId));
                alert(`Sự kiện "${eventName}" đã được xóa thành công.`);
            } catch (err) {
                console.error("Error deleting event:", err);
                alert(`Xóa sự kiện thất bại: ${err.response?.data?.message || err.message}`);
            } finally {
                setIsDeleting(false); // Kết thúc trạng thái đang xóa
            }
        }
    };


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
                { (user?.role === ROLES.EVENT_CREATOR || user?.role === ROLES.UNION) && (
                    <RouterLink to="/admin/create-event">
                        <Button variant="primary" disabled={isDeleting}> {/* Vô hiệu hóa nút khi đang xóa */}
                            + Tạo sự kiện mới
                        </Button>
                    </RouterLink>
                )}
            </HeaderContainer>

            {isDeleting && <StatusContainer>Đang xóa sự kiện...</StatusContainer>}

            {myEvents.length > 0 ? (
                <EventGrid>
                    {myEvents.map((event) => {
                        const eventKey = event.eventId || `event-fallback-${Math.random()}`; // Cung cấp fallback key nếu eventId không có
                        if (!event || !event.eventId) { 
                            console.error("Event object is invalid or missing an eventId:", event);
                            return <div key={eventKey}>Sự kiện không hợp lệ</div>; // Hiển thị lỗi hoặc bỏ qua
                        }
                        return (
                            <EventCard
                                key={eventKey}
                                event={event}
                                isAdminView={true}
                                onDeleteRequest={handleDeleteEvent} // Truyền hàm xử lý xóa
                            />
                        );
                    })}
                </EventGrid>
            ) : (
                <EmptyStateContainer>
                    <EmptyStateIcon xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </EmptyStateIcon>
                    <EmptyStateTitle>Chưa có sự kiện nào được tạo</EmptyStateTitle>
                    <EmptyStateText>Hãy tạo sự kiện đầu tiên cho đơn vị của bạn!</EmptyStateText>
                    {(user?.role === ROLES.EVENT_CREATOR || user?.role === ROLES.UNION) && (
                        <EmptyStateLinkContainer>
                            <RouterLink to="/admin/create-event">
                                <Button variant="primary" disabled={isDeleting}>
                                    + Tạo sự kiện mới
                                </Button>
                            </RouterLink>
                        </EmptyStateLinkContainer>
                    )}
                </EmptyStateContainer>
            )}
        </PageWrapper>
    );
};

export default MyEventsPage;