import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components'; // Thêm keyframes nếu cần animation
import { eventService, registrationService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { ROLES, ATTENDANCE_TYPES } from '../utils/constants';
import { formatDateTime } from '../utils/helpers';
import Button from '../components/common/Button/Button'; // Giả định Button đã được style đẹp

// --- Định nghĩa màu sắc và theme cơ bản ---
const themeColors = {
  primary: '#005A9C', // Xanh dương đậm cho điểm nhấn chính (lấy cảm hứng từ header "BK Events")
  primaryLight: '#E6F3FF', // Xanh dương rất nhạt cho nền tag, highlight nhẹ
  primaryDarkText: '#003D6B', // Chữ xanh đậm trên nền xanh nhạt
  textPrimary: '#1A202C',    // Gần đen cho nội dung chính
  textSecondary: '#4A5568',  // Xám đậm cho thông tin phụ
  textMuted: '#718096',      // Xám nhạt hơn cho label hoặc thông tin ít quan trọng
  border: '#CBD5E0',          // Xám rất nhạt cho đường viền
  backgroundLight: '#F7FAFC', // Nền xám cực nhạt cho page (nếu muốn page wrapper nổi bật)
  white: '#FFFFFF',
  error: '#E53E3E',          // Đỏ cho lỗi
  success: '#38A169',        // Xanh lá cho thành công
  coverPlaceholderBg: '#D6E4F0', // Màu nền nhẹ nhàng cho ảnh bìa khi chưa tải
};

// --- Styled Components đã được làm mới ---

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StatusContainer = styled.div`
  text-align: center;
  padding: 4rem 1.5rem;
  font-size: 1.125rem;
  color: ${themeColors.textSecondary};
  animation: ${fadeIn} 0.5s ease-out;
`;

const ErrorStatusContainer = styled(StatusContainer)`
  color: ${themeColors.error};
  p { margin-bottom: 1.5rem; font-weight: 500; }
`;

const PageWrapper = styled.div`
  background-color: ${themeColors.white};
  border-radius: 16px; // Bo góc lớn hơn, mềm mại hơn
  box-shadow: 0 20px 40px -15px rgba(0, 70, 128, 0.15); // Đổ bóng xanh dương nhẹ, tinh tế hơn
  overflow: hidden;
  max-width: 64rem; // Tăng nhẹ max-width
  margin: 2.5rem auto; // Tăng khoảng cách với viewport
  border: 1px solid ${themeColors.border};
  animation: ${fadeIn} 0.3s ease-out;
`;

const CoverImageContainer = styled.div`
  height: 16rem; // Tăng chiều cao
  background-color: ${themeColors.coverPlaceholderBg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${themeColors.textMuted};
  font-size: 1.25rem;
  position: relative;

  &::before { // Lớp phủ gradient nhẹ nhàng
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.25) 100%);
    z-index: 1; // Đảm bảo gradient nằm trên ảnh nền nhưng dưới ảnh chính
  }

  @media (min-width: 768px) {
    height: 22rem; // Tăng đáng kể cho desktop
  }
`;

const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
  z-index: 2; // Ảnh chính nằm trên gradient
`;

const ContentPadding = styled.div`
  padding: 2rem; // Tăng padding cơ bản
  @media (min-width: 768px) {
    padding: 3rem; // Tăng padding cho desktop
  }
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 2.5rem; // Tăng khoảng cách
  position: relative;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-end; // Canh logo và text theo baseline dưới
  }
`;

const LogoImageContainer = styled.div`
  flex-shrink: 0;
  width: 8rem; // Tăng kích thước logo
  height: 8rem;
  border-radius: 50%;
  border: 6px solid ${themeColors.white}; // Border dày hơn
  margin-top: -5rem; // Điều chỉnh để logo chồng lên ảnh bìa nhiều hơn
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0,0,0,0.08); // Bóng rõ hơn
  background-color: ${themeColors.white};
  overflow: hidden;
  margin-bottom: 1rem;
  z-index: 3; // Logo luôn ở trên cùng

  @media (min-width: 640px) {
    margin-bottom: 0;
    margin-right: 2rem; // Tăng khoảng cách với title
  }
  @media (min-width: 768px) {
    width: 9rem;
    height: 9rem;
    margin-top: -6rem;
  }
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const TitleContainer = styled.div`
  flex-grow: 1;
  @media (min-width: 640px) {
     padding-bottom: 0.5rem; // Nâng text lên một chút so với logo
  }
`;

const EventTitle = styled.h1`
  font-size: 2rem; // Tăng size chữ
  line-height: 1.25;
  font-weight: 700;
  color: ${themeColors.textPrimary};
  font-family: 'DM Sans', sans-serif; // Giữ font DM Sans
  margin-bottom: 0.625rem;

  @media (min-width: 768px) {
    font-size: 2.75rem; // Size lớn hơn cho desktop
  }
`;

const HostInfo = styled.p`
  font-size: 1.125rem; // Tăng size
  line-height: 1.6;
  color: ${themeColors.textSecondary};
  margin-bottom: 1rem;
  font-style: italic;
`;

const SemiBold = styled.span`
  font-weight: 600;
  color: ${themeColors.primary}; // Nhấn mạnh tên Host bằng màu primary
  font-style: normal; // Bỏ italic nếu chỉ muốn SemiBold
`;

const EditButtonContainer = styled.div`
  margin-top: 1rem;
  width: 100%; // Cho mobile
  @media (min-width: 640px) {
    margin-top: 0;
    margin-left: auto;
    width: auto; // Reset width cho desktop
    align-self: center; // Canh giữa với TitleContainer trên desktop
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem; // Tăng gap
  margin-bottom: 2.5rem;

  @media (min-width: 1024px) { // Chuyển sang 2 cột ở màn hình lớn hơn
    grid-template-columns: minmax(0, 2.5fr) minmax(0, 1.5fr); // Tỉ lệ cho description và info
    gap: 3rem;
  }
`;

const DescriptionColumn = styled.div`
  animation: ${fadeIn} 0.5s ease-out 0.2s backwards; // Animation trễ nhẹ
`;

const InfoColumn = styled.div`
  background-color: ${themeColors.backgroundLight}; // Nền nhẹ cho cột thông tin
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${themeColors.border};
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  animation: ${fadeIn} 0.5s ease-out 0.3s backwards;

  @media (min-width: 1024px) {
    padding: 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem; // Tăng size
  line-height: 1.4;
  font-weight: 600;
  color: ${themeColors.primary};
  margin-bottom: 1.25rem;
  font-family: 'DM Sans', sans-serif;
  padding-bottom: 0.625rem;
  border-bottom: 2px solid ${themeColors.primaryLight};
  display: flex;
  align-items: center;

  svg { // Style cho icon nếu có (ví dụ)
    margin-right: 0.75rem;
    width: 1.25em;
    height: 1.25em;
    opacity: 0.8;
  }
`;

const DescriptionText = styled.p`
  color: ${themeColors.textSecondary};
  white-space: pre-wrap;
  line-height: 1.75; // Tăng line-height
  font-size: 1rem;
  margin: 0;

  a { // Style cho link trong mô tả (nếu có)
    color: ${themeColors.primary};
    text-decoration: underline;
    font-weight: 500;
    &:hover {
      color: ${themeColors.primaryDarkText};
    }
  }
`;

// Component mới để nhóm InfoLabel và InfoText, tạo khoảng cách đều
const InfoBlock = styled.div`
  margin-bottom: 1.75rem; // Tăng khoảng cách giữa các khối thông tin
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.h3`
  font-size: 0.8rem; // Chữ nhỏ hơn cho label
  line-height: 1.25rem;
  font-weight: 600; // Đậm hơn
  color: ${themeColors.textMuted};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.075em; // Tăng letter spacing
`;

const InfoText = styled.p`
  color: ${themeColors.textPrimary};
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  
  ${SemiBold} { // SemiBold trong InfoText giữ màu text chính
    color: ${themeColors.textPrimary}; 
    font-weight: 600; // Đảm bảo độ đậm
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem; // Tăng gap
`;

const TagBadge = styled.span`
  padding: 0.5rem 1rem; // Tăng padding
  background-color: ${themeColors.primaryLight};
  color: ${themeColors.primaryDarkText};
  font-size: 0.875rem; // Tăng nhẹ size chữ
  font-weight: 500;
  border-radius: 20px; // Bo tròn hơn
  line-height: 1;
  transition: all 0.2s ease-in-out;
  cursor: default; // Hoặc cursor: pointer nếu tag có thể click

  &:hover {
    background-color: ${themeColors.primary};
    color: ${themeColors.white};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 90, 156, 0.2);
  }
`;

const RegistrationSection = styled.div`
  margin-top: 3rem;
  padding-top: 2.5rem;
  border-top: 1px solid ${themeColors.border};
  text-align: center;
`;

const StatusMessage = styled.p`
  font-weight: 500; // Giảm độ đậm một chút
  margin-bottom: 1.25rem;
  font-size: 1.05rem; // Tăng nhẹ size
  color: ${themeColors.success};
  animation: ${fadeIn} 0.3s ease-out;
`;

const ErrorRegMessage = styled(StatusMessage)`
  color: ${themeColors.error};
`;

const BackButtonContainer = styled.div`
  margin-top: 3rem;
  text-align: center;
`;


// --- Component EventDetailsPage ---
const EventDetailsPage = () => {
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


    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!eventId) {
                setIsLoading(false);
                setError("Không tìm thấy ID sự kiện.");
                return;
            }
            setIsLoading(true);
            setError(null);
            setRegistrationMessage('');
            setRegistrationError('');
            setIsCurrentlyRegistered(false);

            try {
                const response = await eventService.getEvent(eventId);
                const eventData = response.data;
                setEvent(eventData);

                if (isAuthenticated && user?.role === ROLES.STUDENT && user?.id && eventData?.eventId) {
                    try {
                        const registeredEvents = await registrationService.getEventsUserRegisteredFor(user.id);
                        if (Array.isArray(registeredEvents)) {
                            const currentEventApiId = eventData.eventId;
                            if (registeredEvents.some(reg => (reg.event?.eventId || reg.eventId) === currentEventApiId)) {
                                setIsCurrentlyRegistered(true);
                            }
                        }
                    } catch (regError) {
                        console.error("Lỗi khi kiểm tra trạng thái đăng ký:", regError);
                    }
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Không thể tải thông tin sự kiện.');
                setEvent(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEventDetails();
    }, [eventId, isAuthenticated, user]);

    const handleRegister = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }
        if (!user || !user.id || user.role !== ROLES.STUDENT) {
            setRegistrationError("Chỉ sinh viên mới có thể đăng ký sự kiện.");
            return;
        }
        setIsRegistering(true);
        setRegistrationMessage('');
        setRegistrationError('');
        try {
            const responseData = await registrationService.registerUserForEvent(user.id, eventId);
            if (responseData && responseData.registrationId) {
                setRegistrationMessage("Đăng ký thành công!");
                setIsCurrentlyRegistered(true);
            } else {
                setRegistrationError(responseData?.message || "Đăng ký thành công nhưng phản hồi không như mong đợi.");
            }
        } catch (err) {
            setRegistrationError(err.response?.data?.message || err.message || "Đăng ký thất bại. Vui lòng thử lại.");
        } finally {
            setIsRegistering(false);
        }
    };

    const eventTags = useMemo(() => {
        if (!event) return [];
        return Array.isArray(event.tagsList) ? event.tagsList : (Array.isArray(event.tags) ? event.tags : []);
    }, [event]);

    if (isLoading) {
        return <StatusContainer>Đang tải thông tin sự kiện...</StatusContainer>;
    }

    if (error) {
        return (
            <ErrorStatusContainer>
                <p>Lỗi: {error}</p>
                <Button onClick={() => navigate(-1)} variant="secondary" size="large">
                    Quay lại
                </Button>
            </ErrorStatusContainer>
        );
    }

    if (!event) {
        return <StatusContainer>Không tìm thấy thông tin sự kiện.</StatusContainer>;
    }

    const isHost = isAuthenticated &&
        user?.id &&
        event?.hostId &&
        (user.role === ROLES.EVENT_CREATOR || user.role === ROLES.UNION) &&
        String(user.id) === String(event.hostId);

    return (
        <PageWrapper>
            <CoverImageContainer>
                {event.coverUrl ? (
                    <CoverImage
                        src={event.coverUrl}
                        alt={`${event.eventName || 'Sự kiện'} cover`}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                ) : (
                    <span>Ảnh bìa sự kiện</span>
                )}
            </CoverImageContainer>

            <ContentPadding>
                <HeaderSection>
                    {event.logoUrl && (
                        <LogoImageContainer>
                            <LogoImage
                                src={event.logoUrl}
                                alt={`${event.eventName || 'Sự kiện'} logo`}
                                onError={(e) => { e.target.style.display = 'none';}}
                            />
                        </LogoImageContainer>
                    )}
                    <TitleContainer>
                        <EventTitle>{event.eventName}</EventTitle>
                        <HostInfo>
                            Tổ chức bởi: <SemiBold>{event.hostId /* Cần map sang tên thật */}</SemiBold>
                        </HostInfo>
                    </TitleContainer>
                    {isHost && (
                        <EditButtonContainer>
                             <RouterLink to={`/admin/edit-event/${event.eventId || eventId}`}>
                                <Button variant="outline" size="medium"> {/* Nút chỉnh sửa có thể là outline */}
                                    Chỉnh sửa
                                </Button>
                            </RouterLink>
                        </EditButtonContainer>
                    )}
                </HeaderSection>

                <DetailsGrid>
                    <DescriptionColumn>
                        <SectionTitle>
                            {/* Thêm icon nếu muốn, ví dụ: <SomeIcon /> */}
                            Mô tả sự kiện
                        </SectionTitle>
                        <DescriptionText>
                            {event.description || "Không có mô tả."}
                        </DescriptionText>
                    </DescriptionColumn>

                    <InfoColumn>
                        <InfoBlock>
                            <InfoLabel>Thời gian</InfoLabel>
                            <InfoText>
                                <SemiBold>Bắt đầu:</SemiBold> {formatDateTime(event.startDate)}
                            </InfoText>
                            <InfoText>
                                <SemiBold>Kết thúc:</SemiBold> {formatDateTime(event.endDate)}
                            </InfoText>
                        </InfoBlock>
                        <InfoBlock>
                            <InfoLabel>Hình thức & Địa điểm</InfoLabel>
                            <InfoText>
                                {event.attendanceType === ATTENDANCE_TYPES.ONLINE ? 'Trực tuyến (Online)' : 'Trực tiếp (Offline)'}
                            </InfoText>
                            {event.location && (
                                <InfoText>
                                    {event.attendanceType === ATTENDANCE_TYPES.ONLINE ? 'Nền tảng: ' : 'Địa điểm: '}
                                    <SemiBold>{event.location}</SemiBold>
                                </InfoText>
                            )}
                        </InfoBlock>
                        <InfoBlock>
                            <InfoLabel>Số lượng</InfoLabel>
                            <InfoText>
                                Tối đa: <SemiBold>{event.capacity} người</SemiBold>
                            </InfoText>
                        </InfoBlock>
                        {eventTags && eventTags.length > 0 && (
                            <InfoBlock>
                                <InfoLabel>Thể loại</InfoLabel>
                                <TagContainer>
                                    {eventTags.map((tag, index) => (
                                        <TagBadge key={`${tag}-${index}`}>
                                            {tag}
                                        </TagBadge>
                                    ))}
                                </TagContainer>
                            </InfoBlock>
                        )}
                    </InfoColumn>
                </DetailsGrid>

                {isAuthenticated && user?.role === ROLES.STUDENT && (
                    <RegistrationSection>
                        {registrationMessage ? (
                            <StatusMessage>{registrationMessage}</StatusMessage>
                        ) : (
                            <>
                                {registrationError && <ErrorRegMessage>{registrationError}</ErrorRegMessage>}
                                <Button
                                    onClick={handleRegister}
                                    isLoading={isRegistering}
                                    disabled={isRegistering || isCurrentlyRegistered || !!registrationMessage}
                                    variant={isCurrentlyRegistered || !!registrationMessage ? "success" : "primary"} // Đổi màu nút nếu đã đăng ký
                                    size="large" // Nút đăng ký to, rõ ràng
                                >
                                    {isRegistering ? 'Đang xử lý...' : (isCurrentlyRegistered || !!registrationMessage) ? 'Đã đăng ký' : 'Đăng ký tham gia'}
                                </Button>
                            </>
                        )}
                    </RegistrationSection>
                )}

                <BackButtonContainer>
                    <Button onClick={() => navigate(-1)} variant="secondary" size="medium">
                        &larr; Quay lại danh sách
                    </Button>
                </BackButtonContainer>
            </ContentPadding>
        </PageWrapper>
    );
};

export default EventDetailsPage;