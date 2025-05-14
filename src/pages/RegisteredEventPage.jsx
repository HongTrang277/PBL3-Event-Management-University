// src/pages/RegisteredEventsPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
// Import thêm hàm unregisterForEvent
// import { getRegisteredEventsForStudent, unregisterForEvent } from '../services/mockData';
import EventCard from '../components/features/Events/EventCard/EventCard';
import {registrationService} from '../services/api';

// --- Styled Components (Giữ nguyên) ---
const PageWrapper = styled.div` padding: 1.5rem; max-width: 1280px; margin: 0 auto; `;
const Title = styled.h1` font-size: 1.875rem; font-weight: 700; margin-bottom: 1.5rem; color: #1f2937; font-family: 'DM Sans', sans-serif; `;
const EventGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; `;
const StatusText = styled.p` text-align: center; padding: 2rem; color: #6b7280; `;
const ErrorText = styled(StatusText)` color: #dc2626; `;

// --- Component ---
const RegisteredEventsPage = () => {
    const { user } = useAuth();
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRegisteredEvents = async () => {
            if (!user?.id) {
                setError("Vui lòng đăng nhập để xem sự kiện đã đăng ký.");
                setIsLoading(false);
                setRegisteredEvents([]); // Đảm bảo danh sách trống
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const response = await registrationService.getEventsUserRegisteredFor(user.id);
                setRegisteredEvents(response.data || []);
            } catch (err) {
                setError(err.message || 'Không thể tải danh sách sự kiện đã đăng ký.');
                setRegisteredEvents([]);
            } finally {
                setIsLoading(false);
            }
        };

        // Chỉ fetch khi có user.id
        if (user?.id) {
            fetchRegisteredEvents();
        } else {
             // Nếu user chưa load xong hoặc không có id, không fetch và dừng loading
            setIsLoading(false);
        }
    }, [user]); // Chạy lại khi user thay đổi

    // Hàm xử lý hủy đăng ký (truyền xuống EventCard)
    const handleUnregister = async (eventId, studentId) => {
        try {
            await registrationService.removeRegistration(studentId);
            // Cập nhật UI bằng cách loại bỏ event khỏi danh sách
            setRegisteredEvents(prev => prev.filter(event => event.event_id !== eventId));
            alert("Hủy đăng ký thành công!");
        } catch (err) {
            alert(`Hủy đăng ký thất bại: ${err.message}`);
        }
    };

    return (
        <PageWrapper>
            <Title>Sự kiện đã đăng ký ({registeredEvents.length})</Title>

            {isLoading && <StatusText>Đang tải danh sách...</StatusText>}
            {error && <ErrorText>Lỗi: {error}</ErrorText>}
            {!isLoading && !error && (
                <>
                    {registeredEvents.length > 0 ? (
                        <EventGrid>
                            {registeredEvents.map((event) => (
                                <EventCard
                                    key={event.event_id}
                                    event={event}
                                    // Đánh dấu là đang xem ở trang "Đã đăng ký"
                                    isRegisteredView={true}
                                    // Truyền hàm xử lý hủy đăng ký
                                    onUnregister={handleUnregister}
                                />
                            ))}
                        </EventGrid>
                    ) : (
                        // Hiển thị thông báo nếu chưa đăng nhập hoặc chưa đăng ký event nào
                        <StatusText>
                            {user?.id ? "Bạn chưa đăng ký tham gia sự kiện nào." : "Vui lòng đăng nhập để xem."}
                         </StatusText>
                    )}
                </>
            )}
        </PageWrapper>
    );
};

export default RegisteredEventsPage;