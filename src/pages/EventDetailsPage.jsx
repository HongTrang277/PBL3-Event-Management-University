// src/pages/EventDetailsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import styled, { keyframes, ThemeProvider } from 'styled-components';
import { eventService, registrationService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { ROLES, ATTENDANCE_TYPES } from '../utils/constants';
import { formatDateTime } from '../utils/helpers';
import Button from '../components/common/Button/Button';
import EventCard from '../components/features/Events/EventCard/EventCard';

// --- Theme (giữ nguyên) ---
const themeColors = {
  colors: {
    primary: '#005A9C', primaryLight: '#E6F3FF', primaryDarkText: '#003D6B',
    textPrimary: '#1A202C', textSecondary: '#4A5568', textMuted: '#718096',
    border: '#CBD5E0', backgroundLight: '#F7FAFC', white: '#FFFFFF',
    error: '#E53E3E', success: '#38A169', coverPlaceholderBg: '#D6E4F0',
    'primary-3': '#003652',
    'custom-gray': {
        100: '#f7fafc', 200: '#edf2f7', 300: '#e2e8f0', 400: '#cbd5e0',
        500: '#a0aec0', 600: '#718096', 700: '#4a5568', 800: '#2d3748', 900: '#1a202c'
    },
  },
  fontFamily: {
    'dm-sans': "'DM Sans', sans-serif", 'nutito-sans': "'Nunito Sans', sans-serif",
  },
  borderRadius: { lg: '0.5rem', md: '0.375rem', full: '9999px' },
  boxShadow: { md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }
};

// --- Keyframes (giữ nguyên) ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;
const scrollVertical = keyframes`
  0% { transform: translateY(0%); }
  100% { transform: translateY(-50%); }
`;

// --- Styled Components cho Layout (CẬP NHẬT) ---
const OverallPageContainer = styled.div` /* ... giữ nguyên từ lần sửa lỗi khung giữa ... */ 
  display: flex; width: 100%; padding: 1.5rem; gap: 2rem;
  background-color: ${props => props.theme.colors.backgroundLight || '#F7FAFC'};
  min-height: calc(100vh - 70px); box-sizing: border-box;
  @media (max-width: 1280px) { flex-direction: column; align-items: center; padding: 1rem; gap: 1.5rem; }
`;
const SidebarEventsColumn = styled.aside` /* ... giữ nguyên ... */ 
  flex: 0 0 280px; max-height: calc(100vh - 70px - 3rem); overflow: hidden;
  background-color: ${props => props.theme.colors.white || '#FFFFFF'};
  border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); position: relative;
  h3 { font-size: 1.25rem; font-weight: 600; color: ${props => props.theme.colors.primary || '#005A9C'};
    margin: 0; padding: 1rem 1rem 0.75rem 1rem; border-bottom: 1px solid ${props => props.theme.colors.border || '#CBD5E0'};
    font-family: ${props => props.theme.fontFamily?.['dm-sans'] || 'sans-serif'};
    background-color: inherit; position: sticky; top: 0; z-index: 10;
  }
  p.no-events-text { color: ${props => props.theme.colors.textMuted || '#718096'}; font-size: 0.9rem; text-align: center; padding: 2rem 1rem; }
  @media (max-width: 1280px) { display: none; }
`;
const MarqueeContainer = styled.div` /* ... giữ nguyên ... */ 
  height: calc(100% - 5rem); overflow: hidden; position: relative;
`;
const MarqueeContent = styled.div` /* ... giữ nguyên ... */ 
  display: flex; flex-direction: column; animation: ${scrollVertical} linear infinite;
  animation-duration: ${props => props.$duration || '60s'};
  &:hover { animation-play-state: paused; }
`;
const SidebarEventItem = styled.div` /* ... giữ nguyên ... */ 
  opacity: 0.65; transition: opacity 0.3s ease-in-out; padding: 0.75rem 1rem;
  &:hover { opacity: 1; }
`;
const MainEventContent = styled.main` /* ... giữ nguyên ... */ 
  flex: 1; min-width: 0; display: flex; justify-content: center;
  @media (max-width: 1280px) { width: 100%; }
`;

// --- Styled Components cho chi tiết sự kiện (PageWrapper VÀ CÁC COMPONENT CON) ---
const PageWrapper = styled.div` /* ... giữ nguyên từ lần sửa lỗi khung giữa ... */ 
  width: 100%; max-width: 75rem;
  background-color: ${props => props.theme.colors.white}; border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.07);
  overflow: hidden; border: 1px solid ${props => props.theme.colors.border};
  animation: ${fadeIn} 0.3s ease-out;
`;

// BỔ SUNG LẠI CÁC ĐỊNH NGHĨA STYLED-COMPONENT NÀY
const StatusContainer = styled.div`
  text-align: center; padding: 4rem 1.5rem; font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary}; animation: ${fadeIn} 0.5s ease-out; width: 100%;
`;
const ErrorStatusContainer = styled(StatusContainer)`
  color: ${props => props.theme.colors.error};
  p { margin-bottom: 1.5rem; font-weight: 500; }
`;
const CoverImageContainer = styled.div`
  height: 16rem;
  background-color: ${props => props.theme.colors.coverPlaceholderBg};
  display: flex; align-items: center; justify-content: center;
  color: ${props => props.theme.colors.textMuted}; font-size: 1.25rem; position: relative;
  &::before {
    content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.25) 100%);
    z-index: 1;
  }
  @media (min-width: 768px) { height: 22rem; }
`;
const CoverImage = styled.img`
  width: 100%; height: 100%; object-fit: cover; position: relative; z-index: 2;
`;
const ContentPadding = styled.div`
  padding: 2rem;
  @media (min-width: 768px) { padding: 3rem; }
`;
const HeaderSection = styled.div`
  display: flex; flex-direction: column; align-items: flex-start;
  margin-bottom: 2.5rem; position: relative;
  @media (min-width: 640px) { flex-direction: row; align-items: flex-end; }
`;
const LogoImageContainer = styled.div`
  flex-shrink: 0; width: 8rem; height: 8rem; border-radius: 50%;
  border: 6px solid ${props => props.theme.colors.white}; margin-top: -5rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0,0,0,0.08);
  background-color: ${props => props.theme.colors.white};
  overflow: hidden; margin-bottom: 1rem; z-index: 3;
  @media (min-width: 640px) { margin-bottom: 0; margin-right: 2rem; }
  @media (min-width: 768px) { width: 9rem; height: 9rem; margin-top: -6rem; }
`;
const LogoImage = styled.img`
  width: 100%; height: 100%; object-fit: contain;
`;
const TitleContainer = styled.div`
  flex-grow: 1;
  @media (min-width: 640px) { padding-bottom: 0.5rem; }
`;
const EventTitle = styled.h1`
  font-size: 2rem; line-height: 1.25; font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
  font-family: ${props => props.theme.fontFamily?.['dm-sans'] || 'sans-serif'};
  margin-bottom: 0.625rem;
  @media (min-width: 768px) { font-size: 2.75rem; }
`;
const HostInfo = styled.p`
  font-size: 1.125rem; line-height: 1.6;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem; font-style: italic;
`;
const SemiBold = styled.span`
  font-weight: 600; color: ${props => props.theme.colors.primary}; font-style: normal;
`;
const EditButtonContainer = styled.div`
  margin-top: 1rem; width: 100%;
  @media (min-width: 640px) { margin-top: 0; margin-left: auto; width: auto; align-self: center; }
`;
const DetailsGrid = styled.div`
  display: grid; grid-template-columns: 1fr; gap: 2.5rem; margin-bottom: 2.5rem;
  @media (min-width: 1024px) { grid-template-columns: minmax(0, 2.5fr) minmax(0, 1.5fr); gap: 3rem; }
`;
const DescriptionColumn = styled.div`
  animation: ${fadeIn} 0.5s ease-out 0.2s backwards;
`;
const InfoColumn = styled.div`
  background-color: ${props => props.theme.colors.backgroundLight}; padding: 1.5rem; border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border}; box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  animation: ${fadeIn} 0.5s ease-out 0.3s backwards;
  @media (min-width: 1024px) { padding: 2rem; }
`;
const SectionTitle = styled.h2`
  font-size: 1.5rem; line-height: 1.4; font-weight: 600;
  color: ${props => props.theme.colors.primary}; margin-bottom: 1.25rem;
  font-family: ${props => props.theme.fontFamily?.['dm-sans'] || 'sans-serif'};
  padding-bottom: 0.625rem; border-bottom: 2px solid ${props => props.theme.colors.primaryLight};
  display: flex; align-items: center;
  svg { margin-right: 0.75rem; width: 1.25em; height: 1.25em; opacity: 0.8; }
`;
const DescriptionText = styled.p`
  color: ${props => props.theme.colors.textSecondary}; white-space: pre-wrap;
  line-height: 1.75; font-size: 1rem; margin: 0;
  a { color: ${props => props.theme.colors.primary}; text-decoration: underline; font-weight: 500;
    &:hover { color: ${props => props.theme.colors.primaryDarkText}; }
  }
`;
const InfoBlock = styled.div`
  margin-bottom: 1.75rem;
  &:last-child { margin-bottom: 0; }
`;
const InfoLabel = styled.h3`
  font-size: 0.8rem; line-height: 1.25rem; font-weight: 600;
  color: ${props => props.theme.colors.textMuted}; margin-bottom: 0.5rem;
  text-transform: uppercase; letter-spacing: 0.075em;
`;
const InfoText = styled.p`
  color: ${props => props.theme.colors.textPrimary}; font-size: 1rem;
  line-height: 1.6; margin: 0;
  ${SemiBold} { color: ${props => props.theme.colors.textPrimary}; font-weight: 600; }
`;
const TagContainer = styled.div`
  display: flex; flex-wrap: wrap; gap: 0.75rem;
`;
const TagBadge = styled.span`
  padding: 0.5rem 1rem; background-color: ${props => props.theme.colors.primaryLight};
  color: ${props => props.theme.colors.primaryDarkText}; font-size: 0.875rem;
  font-weight: 500; border-radius: 20px; line-height: 1;
  transition: all 0.2s ease-in-out; cursor: default;
  &:hover {
    background-color: ${props => props.theme.colors.primary}; color: ${props => props.theme.colors.white};
    transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0, 90, 156, 0.2);
  }
`;
const RegistrationSection = styled.div`
  margin-top: 3rem; padding-top: 2.5rem;
  border-top: 1px solid ${props => props.theme.colors.border}; text-align: center;
`;
const StatusMessage = styled.p`
  font-weight: 500; margin-bottom: 1.25rem; font-size: 1.05rem;
  color: ${props => props.theme.colors.success}; animation: ${fadeIn} 0.3s ease-out;
`;
const ErrorRegMessage = styled(StatusMessage)`
  color: ${props => props.theme.colors.error};
`;
const BackButtonContainer = styled.div`
  margin-top: 3rem; text-align: center;
`;


// --- Component EventDetailsPage (Logic JavaScript giữ nguyên) ---
const EventDetailsPage = () => {
    // ... (Toàn bộ state, useEffect, handlers, và logic render như ở lượt trước) ...
    // Đảm bảo không có thay đổi nào ở đây so với phiên bản hoạt động gần nhất của bạn (ngoại trừ việc thêm styled-components)
    const { eventId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();

    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [registrationMessage, setRegistrationMessage] = useState('');
    const [registrationError, setRegistrationError] = useState('');
    const [isCurrentlyRegistered, setIsCurrentlyRegistered] = useState(false);

    const [otherEvents, setOtherEvents] = useState([]);
    const [loadingOtherEvents, setLoadingOtherEvents] = useState(true);

    useEffect(() => {
        const fetchEventDetailsAndOthers = async () => {
            if (!eventId) {
                setIsLoading(false); setLoadingOtherEvents(false); setError("Không tìm thấy ID sự kiện."); return;
            }
            setIsLoading(true); setLoadingOtherEvents(true); setError(null); setEvent(null);
            setOtherEvents([]); setRegistrationMessage(''); setRegistrationError(''); setIsCurrentlyRegistered(false);
            try {
                const response = await eventService.getEvent(eventId);
                const eventData = response.data;
                setEvent(eventData);
                if (isAuthenticated && user?.role === ROLES.STUDENT && user?.id && eventData?.eventId) {
                    const registeredEvents = await registrationService.getEventsUserRegisteredFor(user.id);
                    if (Array.isArray(registeredEvents) && registeredEvents.some(reg => (reg.event?.eventId || reg.eventId) === eventData.eventId)) {
                        setIsCurrentlyRegistered(true);
                    }
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Không thể tải thông tin sự kiện.');
            } finally {
                setIsLoading(false);
            }
            try {
                const allEventsResponse = await eventService.getAllEvents();
                const allEventsData = Array.isArray(allEventsResponse) ? allEventsResponse : [];
                if (allEventsData.length > 0) {
                    const filteredOtherEvents = allEventsData
                        .filter(e => String(e.eventId) !== String(eventId))
                        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                        .slice(0, 10);
                    setOtherEvents(filteredOtherEvents);
                }
            } catch (err) {
                console.error("Error fetching other events:", err);
            } finally {
                setLoadingOtherEvents(false);
            }
        };
        fetchEventDetailsAndOthers();
    if (location.state?.autoRegistrationSuccess && location.state?.eventId === eventId) {
            setRegistrationMessage("Sự kiện đã được tự động đăng ký thành công!");
            setIsCurrentlyRegistered(true); // Cập nhật UI ngay
            // Xóa state khỏi location để không hiển thị lại khi refresh/navigate
            navigate(location.pathname, { replace: true, state: {} });
        } else if (location.state?.autoRegistrationError && location.state?.eventId === eventId) {
            setRegistrationError("Tự động đăng ký sự kiện thất bại. Vui lòng thử đăng ký lại.");
            // Xóa state khỏi location
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [eventId, isAuthenticated, user?.id, user?.role, location.state, navigate]); // Thêm location.state và navigate

    const handleRegister = async () => {
        if (!isAuthenticated) { navigate('/login', { state: { from: location.pathname } }); return; }
        if (!user || !user.id || user.role !== ROLES.STUDENT) { setRegistrationError("Chỉ sinh viên mới có thể đăng ký sự kiện."); return; }
        setIsRegistering(true); setRegistrationMessage(''); setRegistrationError('');
        try {
            const responseData = await registrationService.registerUserForEvent(user.id, eventId);
            if (responseData && responseData.registrationId) {
                setRegistrationMessage("Đăng ký thành công!"); setIsCurrentlyRegistered(true);
            } else {
                setRegistrationError(responseData?.message || "Đăng ký thành công nhưng phản hồi không như mong đợi.");
            }
        } catch (err) {
            setRegistrationError(err.response?.data?.message || err.message || "Đăng ký thất bại. Vui lòng thử lại.");
        } finally { setIsRegistering(false); }
    };
    const eventTags = useMemo(() => {
        if (!event) return [];
        return Array.isArray(event.tagsList) ? event.tagsList : (Array.isArray(event.tags) ? event.tags : []);
    }, [event]);
    const isHost = useMemo(() => isAuthenticated && user?.id && event?.hostId && (user.role === ROLES.EVENT_CREATOR || user.role === ROLES.UNION) && String(user.id) === String(event.hostId), [isAuthenticated, user, event]);

    const midPoint = Math.ceil(otherEvents.length / 2);
    const leftSidebarEvents = otherEvents.slice(0, midPoint);
    const rightSidebarEvents = otherEvents.slice(midPoint);

    const calculateMarqueeDuration = (eventsList) => {
        const baseSpeedPerCard = 20; // giây
        if (!eventsList || eventsList.length === 0) return '60s';
        const duration = eventsList.length * baseSpeedPerCard;
        return `${Math.max(duration, 30)}s`;
    };

    const renderSidebarContent = (eventsList, listKey) => {
        if (loadingOtherEvents) return <p className="no-events-text">Đang tải...</p>;
        if (!eventsList || eventsList.length === 0) return <p className="no-events-text">Không có sự kiện nào.</p>;
        const duplicatedEvents = [...eventsList, ...eventsList];
        return (
            <MarqueeContainer>
                <MarqueeContent $duration={calculateMarqueeDuration(eventsList)}>
                    {duplicatedEvents.map((otherEvt, index) => (
                        <SidebarEventItem key={`${otherEvt.eventId}-${index}-${listKey}`}>
                            <EventCard event={otherEvt} />
                        </SidebarEventItem>
                    ))}
                </MarqueeContent>
            </MarqueeContainer>
        );
    };

    // JSX trả về
    return (
        <ThemeProvider theme={themeColors}>
            <OverallPageContainer>
                <SidebarEventsColumn>
                    <h3>Sự kiện khác</h3>
                    {renderSidebarContent(leftSidebarEvents, 'left')}
                </SidebarEventsColumn>

                <MainEventContent>
                    {isLoading && ( <StatusContainer>Đang tải thông tin sự kiện...</StatusContainer> )}
                    {!isLoading && error && !event && ( <ErrorStatusContainer><p>Lỗi: {error}</p><Button onClick={() => navigate(-1)} variant="secondary" size="large">Quay lại</Button></ErrorStatusContainer> )}
                    {!isLoading && !event && !error && (  <StatusContainer>Không tìm thấy thông tin sự kiện.</StatusContainer> )}
                    
                    {/* Phần hiển thị chi tiết sự kiện, đảm bảo CoverImageContainer và các component khác được sử dụng ở đây đã được định nghĩa ở trên */}
                    {event && (
                        <PageWrapper>
                            <CoverImageContainer> {/* Dòng 270 của bạn có thể nằm gần đây */}
                                {event.coverUrl ? ( <CoverImage src={event.coverUrl} alt={`${event.eventName || 'Sự kiện'} cover`} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span>Ảnh bìa sự kiện</span>'; }} /> ) : ( <span>Ảnh bìa sự kiện</span> )}
                            </CoverImageContainer>
                            <ContentPadding>
                                <HeaderSection>
                                    {event.logoUrl && ( <LogoImageContainer><LogoImage src={event.logoUrl} alt={`${event.eventName || 'Sự kiện'} logo`} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span>Logo</span>'; }} /></LogoImageContainer> )}
                                    <TitleContainer>
                                        <EventTitle>{event.eventName}</EventTitle>
                                        <HostInfo>Tổ chức bởi: <SemiBold>{event.hostName || event.hostId}</SemiBold></HostInfo>
                                    </TitleContainer>
                                    {isHost && ( <EditButtonContainer><RouterLink to={`/admin/edit-event/${event.eventId || eventId}`}><Button variant="outline" size="medium">Chỉnh sửa</Button></RouterLink></EditButtonContainer> )}
                                </HeaderSection>
                                <DetailsGrid>
                                    <DescriptionColumn><SectionTitle>Mô tả sự kiện</SectionTitle><DescriptionText>{event.description || "Không có mô tả."}</DescriptionText></DescriptionColumn>
                                    <InfoColumn>
                                        <InfoBlock><InfoLabel>Thời gian</InfoLabel><InfoText><SemiBold>Bắt đầu:</SemiBold> {formatDateTime(event.startDate)}</InfoText><InfoText><SemiBold>Kết thúc:</SemiBold> {formatDateTime(event.endDate)}</InfoText></InfoBlock>
                                        <InfoBlock><InfoLabel>Hình thức & Địa điểm</InfoLabel><InfoText>{event.attendanceType === ATTENDANCE_TYPES.ONLINE ? 'Trực tuyến (Online)' : 'Trực tiếp (Offline)'}</InfoText>{event.location && ( <InfoText>{event.attendanceType === ATTENDANCE_TYPES.ONLINE ? 'Nền tảng: ' : 'Địa điểm: '}<SemiBold>{event.location}</SemiBold></InfoText> )}</InfoBlock>
                                        <InfoBlock><InfoLabel>Số lượng</InfoLabel><InfoText>Tối đa: <SemiBold>{event.capacity} người</SemiBold></InfoText></InfoBlock>
                                        {eventTags && eventTags.length > 0 && ( <InfoBlock><InfoLabel>Thể loại</InfoLabel><TagContainer>{eventTags.map((tag, index) => ( <TagBadge key={`${tag}-${index}`}>{tag}</TagBadge> ))}</TagContainer></InfoBlock> )}
                                    </InfoColumn>
                                </DetailsGrid>
                                {isAuthenticated && user?.role === ROLES.STUDENT && ( <RegistrationSection>{registrationMessage ? (<StatusMessage>{registrationMessage}</StatusMessage>) : ( <>{registrationError && <ErrorRegMessage>{registrationError}</ErrorRegMessage>}<Button onClick={handleRegister} isLoading={isRegistering} disabled={isRegistering || isCurrentlyRegistered || !!registrationMessage} variant={isCurrentlyRegistered || !!registrationMessage ? "success" : "primary"} size="large">{isRegistering ? 'Đang xử lý...' : (isCurrentlyRegistered || !!registrationMessage) ? 'Đã đăng ký' : 'Đăng ký tham gia'}</Button></> )}</RegistrationSection> )}
                                <BackButtonContainer><Button onClick={() => navigate(-1)} variant="secondary" size="medium">&larr; Quay lại</Button></BackButtonContainer>
                            </ContentPadding>
                        </PageWrapper>
                    )}
                </MainEventContent>

                <SidebarEventsColumn>
                    <h3>Có thể bạn quan tâm</h3>
                    {renderSidebarContent(rightSidebarEvents, 'right')}
                </SidebarEventsColumn>
            </OverallPageContainer>
        </ThemeProvider>
    );
};

export default EventDetailsPage;