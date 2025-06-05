// src/components/features/Events/EventCard/EventCard.jsx
import React from 'react';
// Bỏ 'useTheme' nếu không còn sử dụng trực tiếp nữa
import styled /* , { useTheme } */ from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { formatDate } from '../../../../utils/helpers';
import { ATTENDANCE_TYPES, ROLES } from '../../../../utils/constants';
import Button from '../../../common/Button/Button';
import { useEffect, useState } from 'react';
import { authService } from '../../../../services/api';
import { format, differenceInDays, isPast, isFuture, isToday } from 'date-fns';
import { vi } from 'date-fns/locale';

// --- Styled Icons (Giữ nguyên) ---
//! Thêm constants cho trạng thái sự kiện
const EVENT_STATUS = {
    UPCOMING: 'upcoming',
    ONGOING: 'ongoing',
    PAST: 'past',
};

// Thêm styled components cho Status Badge
const StatusBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.375rem;
  
  background-color: ${props => {
        switch (props.status) {
            case EVENT_STATUS.ONGOING:
                return props.theme?.colors?.['success-light'] || 'rgba(52, 211, 153, 0.2)';
            case EVENT_STATUS.UPCOMING:
                return props.theme?.colors?.['primary-light'] || 'rgba(59, 130, 246, 0.2)';
            case EVENT_STATUS.PAST:
                return props.theme?.colors?.['custom-gray']?.[200] || '#e5e7eb';
            default:
                return props.theme?.colors?.['custom-gray']?.[200] || '#e5e7eb';
        }
    }};
  
  color: ${props => {
        switch (props.status) {
            case EVENT_STATUS.ONGOING:
                return props.theme?.colors?.['success'] || '#10b981';
            case EVENT_STATUS.UPCOMING:
                return props.theme?.colors?.['primary'] || '#3b82f6';
            case EVENT_STATUS.PAST:
                return props.theme?.colors?.['custom-gray']?.[700] || '#4b5563';
            default:
                return props.theme?.colors?.['custom-gray']?.[700] || '#4b5563';
        }
    }};
`;
const IconWrapper = styled.span`
    display: inline-flex;
    align-items: center;
    margin-right: 0.35rem;
    color: ${props => props.theme?.colors?.['custom-gray']?.[600] || '#6b7280'};
    svg {
        height: 1rem;
        width: 1rem;
    }
`;
const OngoingIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
);

const UpcomingIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V12L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
);

const PastIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CalendarIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></IconWrapper>;
const LocationIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></IconWrapper>;
const TagIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 8V5a2 2 0 012-2h2zM7 11h.01" /></svg></IconWrapper>;

// --- Styled Components (Sử dụng props.theme với fallback) ---
const CardWrapper = styled.div`
  background-color: ${props => props.theme?.colors?.white || '#ffffff'};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -5px rgba(0, 0, 0, 0.04);
    transform: translateY(-4px);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => {
        switch (props.status) {
            case EVENT_STATUS.ONGOING:
                return 'linear-gradient(90deg, #10b981 0%, #34d399 100%)';
            case EVENT_STATUS.UPCOMING:
                return 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)';
            case EVENT_STATUS.PAST:
                return 'linear-gradient(90deg, #9ca3af 0%, #d1d5db 100%)';
            default:
                return 'linear-gradient(90deg, #9ca3af 0%, #d1d5db 100%)';
        }
    }};
    z-index: 1;
  }
`;


const ImageContainer = styled.div`
  height: 12rem;
  background-color: ${props => props.theme?.colors?.['custom-gray']?.[200] || '#e5e7eb'};
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);
    z-index: 1;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: ${props => props.fit === 'contain' ? 'contain' : 'cover'};
  padding: ${props => props.fit === 'contain' ? '0.5rem' : '0'};
  transition: transform 0.5s ease;
  ${CardWrapper}:hover & {
    transform: scale(1.05);
  }
`;
//them date badge o goc anh
const DateBadge = styled.div`
  position: absolute;
  left: 0.75rem;
  bottom: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 4rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  .month {
    font-size: 0.7rem;
    text-transform: uppercase;
    font-weight: 600;
    color: ${props => props.theme?.colors?.['custom-gray']?.[600] || '#4b5563'};
    line-height: 1;
  }
  
  .day {
    font-size: 1.2rem;
    font-weight: 700;
    color: ${props => props.theme?.colors?.['primary-3'] || '#1f2937'};
    line-height: 1.2;
  }
`;
const SmallLogoOverlay = styled.img`
    position: absolute;
    bottom: 0.75rem;
    left: 0.75rem;
    height: 3.5rem;
    width: 3.5rem;
    border-radius: 50%;
    background-color: ${props => props.theme?.colors?.white || '#ffffff'};
    padding: 0.25rem;
    border: 2px solid ${props => props.theme?.colors?.['custom-gray']?.[300] || '#d1d5db'};
    object-fit: contain;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ContentArea = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  line-height: 1.4;
  font-weight: 700;
  color: ${props => props.theme?.colors?.['primary-3'] || '#1f2937'};
  margin-bottom: 0.75rem;
  font-family: ${props => props.theme?.fontFamily?.['dm-sans'] || "'DM Sans', sans-serif"};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: calc(1.25rem * 1.4 * 2);
  position: relative;
  padding-bottom: 0.375rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 2rem;
    height: 3px;
    background-color: ${props => props.theme?.colors?.['primary'] || '#3b82f6'};
    border-radius: 3px;
  }
`;

const HostInfo = styled.p`
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: ${props => props.theme?.colors?.['custom-gray']?.[700] || '#4b5563'};
    margin-bottom: 0.75rem;
    span {
        font-weight: 600;
    }
`;

const DetailsSection = styled.div`
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: ${props => props.theme?.colors?.['custom-gray']?.[700] || '#4b5563'};
    margin-bottom: 0.75rem;
    & > * + * {
        margin-top: 0.375rem;
    }
`;

const DetailItem = styled.div`
    display: flex;
    align-items: center;
`;

const DetailText = styled.span`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const TagSection = styled.div`
    font-size: 0.875rem;
    color: ${props => props.theme?.colors?.['custom-gray']?.[700] || '#4b5563'};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.375rem;
`;

const TagBadge = styled.span`
    padding: 0.25rem 0.625rem;
    background-color: ${props => props.theme?.colors?.['primary-2'] || '#dbeafe'};
    color: ${props => props.theme?.colors?.['primary-3'] || '#1e40af'};
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: ${props => props.theme?.borderRadius?.full || '9999px'};
    line-height: 1;
`;

const MoreTagsBadge = styled(TagBadge)`
    background-color: ${props => props.theme?.colors?.['custom-gray']?.[200] || '#e5e7eb'};
    color: ${props => props.theme?.colors?.['custom-gray']?.[700] || '#4b5563'};
`;

const ActionsArea = styled.div`
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme?.colors?.['custom-gray']?.[200] || '#f3f4f6'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
`;

// --- Component chính EventCard ---
const EventCard = ({
    event,
    isAdminView = false,
    isRegisteredView = false,
    isAlreadyRegistered = false,
    onRegister,
    onUnregister,
    onDeleteRequest, // Prop cho chức năng xóa
}) => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [hostInfo, setHostInfo] = useState(null);
    const [isLoadingHost, setIsLoadingHost] = useState(false);
    const [eventStatus, setEventStatus] = useState(null);

    if (!event) {
        console.warn("EventCard: event prop is null or undefined.");
        return null;
    }

    const event_id_from_api = event.eventId;
    const event_name_from_api = event.eventName || "Tên sự kiện không xác định";
    const cover_url_from_api = event.coverUrl;
    const logo_url_from_api = event.logoUrl;
    const host_id_from_api = event.hostId;
    const start_date_from_api = event.startDate;
    const end_date_from_api = event.endDate || null; // Có thể không có ngày kết thúc
    const location_from_api = event.location;
    const attendance_type_from_api = event.attendanceType;
    const tags_from_api = Array.isArray(event.tagsList) ? event.tagsList : (Array.isArray(event.tags) ? event.tags : []);

    const displayTags = tags_from_api.slice(0, 2);
    const remainingTagsCount = Math.max(0, tags_from_api.length - 2);
    // Thêm useEffect để xác định trạng thái sự kiện
    useEffect(() => {
        const determineEventStatus = () => {
            if (!start_date_from_api) {
                return EVENT_STATUS.UPCOMING;
            }

            const startDate = new Date(start_date_from_api);
            const endDate = end_date_from_api ? new Date(end_date_from_api) : null;
            const now = new Date();

            // Nếu có ngày kết thúc
            if (endDate) {
                if (now > endDate) {
                    return EVENT_STATUS.PAST;  // Đã kết thúc
                } else if (now >= startDate && now <= endDate) {
                    return EVENT_STATUS.ONGOING;  // Đang diễn ra
                } else {
                    return EVENT_STATUS.UPCOMING;  // Sắp diễn ra
                }
            } else {
                // Nếu chỉ có ngày bắt đầu
                // Giả định sự kiện diễn ra trong 1 ngày
                if (isPast(new Date(startDate.setHours(23, 59, 59)))) {
                    return EVENT_STATUS.PAST;  // Đã qua ngày sự kiện
                } else if (isToday(startDate)) {
                    return EVENT_STATUS.ONGOING;  // Ngay hôm nay
                } else if (isFuture(startDate)) {
                    return EVENT_STATUS.UPCOMING;  // Trong tương lai
                }
            }

            return EVENT_STATUS.UPCOMING; // Mặc định
        };

        setEventStatus(determineEventStatus());
    }, [start_date_from_api, end_date_from_api]);
    // Thêm useEffect để fetch thông tin người tổ chức
    useEffect(() => {
        const fetchHostInfo = async () => {
            if (host_id_from_api) {
                setIsLoadingHost(true);
                try {
                    // Add debug logging to see the API call
                    console.log("Fetching host info for ID:", host_id_from_api);

                    const response = await authService.getUserById(host_id_from_api);
                    console.log("Raw API response:", response);

                    if (response) {
                        console.log("Setting host info:", response.data);
                        setHostInfo(response.data);
                    } else {
                        console.warn("No data returned for host ID:", host_id_from_api);
                        // Set fallback so it's not null
                        setHostInfo({ username: "Không xác định" });
                    }
                } catch (error) {
                    console.error("Error fetching host info:", error);
                    // Set fallback on error
                    setHostInfo({ username: "Không xác định" });
                } finally {
                    setIsLoadingHost(false);
                }
            }
        };

        fetchHostInfo();
    }, [host_id_from_api]); // Don't add hostInfo as dependency or it will cause infinite renders

    // 3. Add a separate useEffect for logging the state update
    useEffect(() => {
        if (hostInfo) {
            console.log("Updated hostInfo state:", hostInfo);
        }
    }, [hostInfo]);
    const handleImageError = (e) => {
        e.target.style.display = 'none';
        const parent = e.target.parentNode;
        if (parent && !parent.querySelector('.placeholder-text')) {
            const placeholder = document.createElement('span');
            placeholder.className = 'placeholder-text';
            placeholder.style.color = '#9ca3af';
            placeholder.textContent = 'Lỗi ảnh';
            parent.appendChild(placeholder);
        }
    };

    // Hàm format ngày tháng cho DateBadge
  const formatEventDate = (dateString) => {
    if (!dateString) return { day: "--", month: "---" };
    const date = new Date(dateString);
    return {
      day: format(date, 'dd'),
      month: format(date, 'MMM', { locale: vi }).toUpperCase()
    };
  };
  
  const eventDate = formatEventDate(start_date_from_api);
    const renderActionButtons = () => {
        if (!event_id_from_api) return null;

        const detailButton = (
            <StyledLink to={`/events/${event_id_from_api}`}>
                <Button variant="primary" size="small">
                    Xem chi tiết
                </Button>
            </StyledLink>
        );

        let studentFlowButton = null;
        let adminFlowButtons = null;

        // Logic cho các nút của sinh viên (Đăng ký, Hủy đăng ký) hoặc người dùng chưa đăng nhập
        if (!isAuthenticated) {
            // Nếu người dùng chưa đăng nhập, nút "Đăng ký" sẽ điều hướng đến trang login
            // Hoặc nếu có onRegister (ví dụ từ HomePage), nó sẽ gọi onRegister
            // onRegister từ HomePage đã xử lý việc điều hướng nếu chưa login
            if (onRegister) { // onRegister được truyền từ HomePage
                studentFlowButton = (
                    <Button variant="secondary" size="small" onClick={() => onRegister(event_id_from_api, user?.id)}>
                        Đăng ký
                    </Button>
                );
            } else { // Trường hợp chung, ví dụ từ EventDetailPage nếu không có onRegister cụ thể
                studentFlowButton = (
                    <Button variant="secondary" size="small" onClick={() => navigate('/login', { state: { from: `/events/${event_id_from_api}` } })}>
                        Đăng ký
                    </Button>
                );
            }
        } else if (user.role === ROLES.STUDENT) {
            if (isRegisteredView || isAlreadyRegistered) { // isRegisteredView: xem trang "SK đã ĐK", isAlreadyRegistered: check từ HomePage
                if (onUnregister) { // onUnregister được truyền từ HomePage hoặc trang SK đã ĐK
                    studentFlowButton = (
                        <Button variant="danger" size="small" onClick={() => onUnregister(event_id_from_api, user.id)}>
                            Hủy đăng ký
                        </Button>
                    );
                }
            } else {
                if (onRegister) { // onRegister được truyền từ HomePage
                    studentFlowButton = (
                        <Button variant="secondary" size="small" onClick={() => onRegister(event_id_from_api, user.id)}>
                            Đăng ký
                        </Button>
                    );
                }
            }
        }

        // Logic cho các nút quản trị (Sửa, Xóa) - chỉ hiển thị nếu isAdminView và là chủ sự kiện
        if (isAdminView && (user?.role === ROLES.EVENT_CREATOR || user?.role === ROLES.UNION)) {
            if (host_id_from_api && user?.id && String(host_id_from_api) === String(user.id)) {
                adminFlowButtons = (
                    <>
                        <StyledLink to={`/admin/edit-event/${event_id_from_api}`} style={{ textDecoration: 'none' }}>
                            <Button variant="secondary" size="small" style={{ marginRight: '8px' }}>
                                Sửa
                            </Button>
                        </StyledLink>
                        {onDeleteRequest && ( // Chỉ render nút Xóa nếu prop onDeleteRequest được truyền vào
                            <Button
                                variant="danger"
                                size="small"
                                onClick={() => onDeleteRequest(event_id_from_api)}
                            >
                                Xóa
                            </Button>
                        )}
                    </>
                );
            }
        }

        // DÒNG 299 CÓ THỂ LÀ CHỖ NÀY TRONG CODE CŨ CỦA BẠN
        // Đảm bảo rằng bạn trả về cấu trúc JSX mới này
        return (
            <ActionsArea>
                {detailButton}
                {/* Gom các nút action (student hoặc admin) vào một div để chúng căn phải cùng nhau */}
                <div>
                    {studentFlowButton}
                    {adminFlowButtons}
                </div>
            </ActionsArea>
        );
    }; // Kết thúc renderActionButtons

    // --- PHẦN JSX CHÍNH CỦA EVENTCARD ---
    // Thay đổi JSX return
    return (
        <CardWrapper status={eventStatus}>
            <ImageContainer>
                {cover_url_from_api ? (
                    <Image
                        src={cover_url_from_api}
                        alt={`${event_name_from_api} cover`}
                        onError={handleImageError}
                    />
                ) : logo_url_from_api ? (
                    <Image
                        src={logo_url_from_api}
                        alt={`${event_name_from_api} logo`}
                        fit="contain"
                        onError={handleImageError}
                    />
                ) : (
                    <span>Ảnh sự kiện</span>
                )}

                {/* Thêm DateBadge */}
                <DateBadge>
                    <span className="month">{eventDate.month}</span>
                    <span className="day">{eventDate.day}</span>
                </DateBadge>

                {/* Thêm StatusBadge */}
                <StatusBadge status={eventStatus}>
                    {eventStatus === EVENT_STATUS.ONGOING && (
                        <>
                            <OngoingIcon />
                            Đang diễn ra
                        </>
                    )}
                    {eventStatus === EVENT_STATUS.UPCOMING && (
                        <>
                            <UpcomingIcon />
                            Sắp diễn ra
                        </>
                    )}
                    {eventStatus === EVENT_STATUS.PAST && (
                        <>
                            <PastIcon />
                            Đã kết thúc
                        </>
                    )}
                </StatusBadge>

                {/* Logo overlay vẫn giữ nguyên */}
                {cover_url_from_api && logo_url_from_api && (
                    <SmallLogoOverlay
                        src={logo_url_from_api}
                        alt={`${event_name_from_api} logo overlay`}
                        onError={handleImageError}
                    />
                )}
            </ImageContainer>

            <ContentArea>
                <Title title={event_name_from_api}>
                    {event_name_from_api}
                </Title>

                <HostInfo>
                    Tổ chức bởi: <span>
                        {isLoadingHost ? "Đang tải..." :
                            hostInfo ? (hostInfo.fullName || hostInfo.username || hostInfo.email) :
                                "Không xác định"}
                    </span>
                </HostInfo>

                <DetailsSection>
                    {start_date_from_api && (
                        <DetailItem>
                            <CalendarIcon />
                            <DetailText title={formatDate(start_date_from_api)}>
                                {formatDate(start_date_from_api)}
                            </DetailText>
                        </DetailItem>
                    )}
                    <DetailItem>
                        <LocationIcon />
                        <DetailText title={attendance_type_from_api === ATTENDANCE_TYPES.ONLINE ? 'Online' : (location_from_api || 'Chưa cập nhật')}>
                            {attendance_type_from_api === ATTENDANCE_TYPES.ONLINE ? 'Online' : (location_from_api || 'Chưa cập nhật')}
                        </DetailText>
                    </DetailItem>
                </DetailsSection>

                {tags_from_api.length > 0 && (
                    <TagSection>
                        <TagIcon />
                        {displayTags.map((tag, index) => (
                            <TagBadge key={`${tag}-${index}`}>{tag}</TagBadge>
                        ))}
                        {remainingTagsCount > 0 && (
                            <MoreTagsBadge>+{remainingTagsCount}</MoreTagsBadge>
                        )}
                    </TagSection>
                )}

                {renderActionButtons()}
            </ContentArea>
        </CardWrapper>
    );
}; // Kết thúc EventCard component

export default EventCard;