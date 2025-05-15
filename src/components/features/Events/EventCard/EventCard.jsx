// src/components/features/Events/EventCard/EventCard.jsx
import React from 'react';
// Bỏ 'useTheme' nếu không còn sử dụng trực tiếp nữa
import styled /* , { useTheme } */ from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { formatDate } from '../../../../utils/helpers';
import { ATTENDANCE_TYPES, ROLES } from '../../../../utils/constants';
import Button from '../../../common/Button/Button';

// --- Styled Icons (Giữ nguyên) ---
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

const CalendarIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></IconWrapper>;
const LocationIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></IconWrapper>;
const TagIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 8V5a2 2 0 012-2h2zM7 11h.01" /></svg></IconWrapper>;

// --- Styled Components (Sử dụng props.theme với fallback) ---
const CardWrapper = styled.div`
    background-color: ${props => props.theme?.colors?.white || '#ffffff'};
    border-radius: ${props => props.theme?.borderRadius?.lg || '0.5rem'};
    box-shadow: ${props => props.theme?.boxShadow?.md || '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'};
    transition: box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;

    &:hover {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        transform: translateY(-2px);
    }
`;

const ImageContainer = styled.div`
    height: 10rem;
    background-color: ${props => props.theme?.colors?.['custom-gray']?.[200] || '#e5e7eb'};
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme?.colors?.['custom-gray']?.[500] || '#9ca3af'};
    overflow: hidden;
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: ${props => props.fit === 'contain' ? 'contain' : 'cover'};
    padding: ${props => props.fit === 'contain' ? '0.5rem' : '0'};
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
    margin-bottom: 0.375rem;
    font-family: ${props => props.theme?.fontFamily?.['dm-sans'] || "'DM Sans', sans-serif"};
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    min-height: calc(1.25rem * 1.4 * 2);
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
    gap: 0.5rem;
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
    const location_from_api = event.location;
    const attendance_type_from_api = event.attendanceType;
    const tags_from_api = Array.isArray(event.tagsList) ? event.tagsList : (Array.isArray(event.tags) ? event.tags : []);

    const displayTags = tags_from_api.slice(0, 2);
    const remainingTagsCount = Math.max(0, tags_from_api.length - 2);

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

    // --- HÀM RENDER ACTION BUTTONS ĐÃ SỬA ---
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
    return (
        <CardWrapper>
            <ImageContainer>
                {cover_url_from_api ? (
                    <Image src={cover_url_from_api} alt={`${event_name_from_api} cover`} onError={handleImageError} />
                ) : logo_url_from_api ? (
                    <Image src={logo_url_from_api} alt={`${event_name_from_api} logo`} fit="contain" onError={handleImageError} />
                ) : (
                    <span>Ảnh sự kiện</span>
                )}
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
                    Tổ chức bởi: <span>{host_id_from_api || "Không rõ"}</span>
                </HostInfo>
                <DetailsSection>
                    {start_date_from_api && (
                        <DetailItem>
                            <CalendarIcon />
                            <DetailText title={formatDate(start_date_from_api)}>{formatDate(start_date_from_api)}</DetailText>
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
                        {displayTags.map((tag, index) => ( // Thêm key cho map
                            <TagBadge key={`${tag}-${index}`}>{tag}</TagBadge>
                        ))}
                        {remainingTagsCount > 0 && (
                            <MoreTagsBadge>+{remainingTagsCount}</MoreTagsBadge>
                        )}
                    </TagSection>
                )}
                {/* Dòng 354 có thể là ở đây, nơi gọi renderActionButtons() */}
                {renderActionButtons()}
            </ContentArea>
        </CardWrapper>
    ); // Kết thúc EventCard return
}; // Kết thúc EventCard component

export default EventCard;