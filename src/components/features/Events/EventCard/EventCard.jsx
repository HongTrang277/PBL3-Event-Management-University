// src/components/features/Events/EventCard/EventCard.jsx
import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../../../../hooks/useAuth'; // Import useAuth
import { formatDate } from '../../../../utils/helpers';
import { ATTENDANCE_TYPES, ROLES } from '../../../../utils/constants'; // Import ROLES
import Button from '../../../common/Button/Button';

// --- Styled Icons (Giữ nguyên) ---
const IconWrapper = styled.span`
    display: inline-flex; align-items: center; margin-right: 0.25rem; color: #6b7280;
    svg { height: 1rem; width: 1rem; }
`;
const CalendarIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></IconWrapper>;
const LocationIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></IconWrapper>;
const TagIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 8V5a2 2 0 012-2h2zM7 11h.01" /></svg></IconWrapper>;

// --- Styled Components (Giữ nguyên) ---
const CardWrapper = styled.div`
    background-color: #ffffff; border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.3s ease-in-out; overflow: hidden; display: flex;
    flex-direction: column; height: 100%;
    &:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
`;
const ImageContainer = styled.div`
    height: 10rem; background-color: #e5e7eb; position: relative; display: flex;
    align-items: center; justify-content: center; color: #9ca3af;
`;
const Image = styled.img`
    width: 100%; height: 100%; object-fit: ${props => props.fit === 'contain' ? 'contain' : 'cover'};
    padding: ${props => props.fit === 'contain' ? '1rem' : '0'};
`;
const SmallLogoOverlay = styled.img`
    position: absolute; bottom: 0.5rem; left: 0.5rem; height: 3rem; width: 3rem;
    border-radius: 9999px; background-color: #ffffff; padding: 0.25rem;
    border: 1px solid #d1d5db; object-fit: contain; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;
const ContentArea = styled.div`
    padding: 1rem; display: flex; flex-direction: column; flex-grow: 1;
`;
const Title = styled.h3`
    font-size: 1.125rem; line-height: 1.75rem; font-weight: 600; color: #1f2937;
    margin-bottom: 0.25rem; font-family: 'DM Sans', sans-serif; overflow: hidden;
    text-overflow: ellipsis; white-space: nowrap;
`;
const HostInfo = styled.p`
    font-size: 0.75rem; line-height: 1rem; color: #6b7280; margin-bottom: 0.5rem;
    span { font-weight: 500; }
`;
const DetailsSection = styled.div`
    font-size: 0.875rem; line-height: 1.25rem; color: #4b5563; margin-bottom: 0.75rem;
    & > * + * { margin-top: 0.25rem; }
`;
const DetailItem = styled.div` display: flex; align-items: center; `;
const DetailText = styled.span` overflow: hidden; text-overflow: ellipsis; white-space: nowrap; `;
const TagSection = styled.div`
    font-size: 0.875rem; color: #4b5563; margin-bottom: 0.75rem;
    display: flex; align-items: center; flex-wrap: wrap;
`;
const TagBadge = styled.span`
    margin-right: 0.5rem; margin-bottom: 0.25rem; padding: 0.125rem 0.5rem;
    background-color: #dbeafe; color: #1e40af; font-size: 0.75rem;
    font-weight: 500; border-radius: 9999px;
`;
const MoreTagsBadge = styled.span`
    font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;
`;
const ActionsArea = styled.div`
    margin-top: auto; padding-top: 0.75rem; border-top: 1px solid #f3f4f6;
    display: flex; justify-content: space-between; align-items: center;
`;
const SecondaryActionsContainer = styled.div`
    display: flex; gap: 0.5rem;
`;
const StyledLink = styled(Link)` text-decoration: none; `;

// --- Component ---
const EventCard = ({
    event,
    isRegisteredView = false,       // True nếu card đang ở trang "Registered Events"
    isAlreadyRegistered = false,    // True nếu student hiện tại đã đăng ký event này (cho homepage, dashboard)
    onRegister,                     // Callback khi bấm "Đăng ký" (student)
    onUnregister,                   // Callback khi bấm "Hủy đăng ký" (student)
}) => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!event) {
        return null;
    }

    const displayTags = event.tags?.slice(0, 2) || [];
    const remainingTagsCount = Math.max(0, (event.tags?.length || 0) - 2);

    const handleImageError = (e) => {
        e.target.style.display = 'none';
    }

    // Hàm xử lý khi bấm nút action chính (Đăng ký / Hủy đăng ký)
    const handleMainActionClick = () => {
        if (!isAuthenticated) {
            // Nếu chưa đăng nhập, chuyển đến trang login và lưu lại trang sự kiện để quay lại sau
            navigate('/login', { state: { from: `/events/${event.event_id}` } });
            return;
        }

        // Nếu đã đăng nhập và là student
        if (user?.role === ROLES.STUDENT) {
            // Kiểm tra xem đang ở trang "Đã đăng ký" hoặc đã đăng ký sự kiện này rồi
            if (isRegisteredView || isAlreadyRegistered) {
                // Nếu có hàm onUnregister được truyền vào -> gọi nó
                if (onUnregister) {
                    onUnregister(event.event_id, user.id);
                } else {
                    console.warn("EventCard: onUnregister callback is missing for event:", event.event_name);
                }
            } else { // Nếu chưa đăng ký
                // Nếu có hàm onRegister được truyền vào -> gọi nó
                if (onRegister) {
                    onRegister(event.event_id, user.id);
                } else {
                    console.warn("EventCard: onRegister callback is missing for event:", event.event_name);
                }
            }
        } else if (user?.role !== ROLES.STUDENT) {
            // Nếu là role khác (admin/creator) bấm vào nút này (trường hợp hy hữu)
            alert("Chức năng này chỉ dành cho sinh viên.");
        }
    };

    // Hàm render các nút action dựa trên trạng thái
    const renderActionButtons = () => {
        // Nút Xem chi tiết luôn hiển thị
        const detailButton = (
            <StyledLink to={`/events/${event.event_id}`}>
                <Button variant="primary" size="small">
                    Xem chi tiết
                </Button>
            </StyledLink>
        );

        let actionButton = null; // Nút thứ 2 (Đăng ký/Hủy/Sửa)

        // Kịch bản 1: Chưa đăng nhập
        if (!isAuthenticated) {
            // Hiển thị nút "Đăng ký", khi bấm sẽ chuyển hướng login
            actionButton = (
                <Button variant="secondary" size="small" onClick={handleMainActionClick}>
                    Đăng ký
                </Button>
            );
        }
        // Kịch bản 2, 3: Đã đăng nhập và là STUDENT
        else if (user.role === ROLES.STUDENT) {
            // Nếu đang ở trang "Đã đăng ký" hoặc đã đăng ký rồi
            if (isRegisteredView || isAlreadyRegistered) {
                actionButton = (
                    <Button variant="danger" size="small" onClick={handleMainActionClick}>
                        Hủy đăng ký
                    </Button>
                );
            } else { // Nếu chưa đăng ký
                actionButton = (
                    <Button variant="secondary" size="small" onClick={handleMainActionClick}>
                        Đăng ký
                    </Button>
                );
            }
        }
        // Kịch bản 4, 5: Đã đăng nhập và là EVENT_CREATOR hoặc UNION
        else if (user.role === ROLES.EVENT_CREATOR || user.role === ROLES.UNION) {
            // Kiểm tra xem đây có phải sự kiện do user này tạo không
            // Dựa vào việc so sánh event.host_id với user.faculty (chứa tên khoa/đoàn trường)
            let isMyEvent = false;
            if (event.host_id === user.faculty) {
                isMyEvent = true;
            }

            // Nếu là sự kiện của tôi -> hiển thị nút "Sửa"
            if (isMyEvent) {
                actionButton = (
                    <StyledLink to={`/admin/edit-event/${event.event_id}`}>
                        <Button variant="secondary" size="small">Sửa</Button>
                    </StyledLink>
                );
            }
            // Nếu không phải sự kiện của tôi, không hiển thị nút action thứ 2
        }

        // Trả về JSX cho khu vực actions
        return (
            <ActionsArea>
                {detailButton}
                {/* Chỉ render container cho nút thứ 2 nếu actionButton tồn tại */}
                {actionButton && <SecondaryActionsContainer>{actionButton}</SecondaryActionsContainer>}
            </ActionsArea>
        );
    };

    // --- Phần JSX trả về của component ---
    return (
        <CardWrapper>
            <ImageContainer>
                {event.cover_url ? (
                    <Image src={event.cover_url} alt={`${event.event_name} cover`} />
                ) : event.logo_url ? (
                    <Image src={event.logo_url} alt={`${event.event_name} logo`} fit="contain" />
                ) : (
                    "No Image Available" // Hoặc một ảnh placeholder
                )}
                {event.cover_url && event.logo_url && (
                    <SmallLogoOverlay
                        src={event.logo_url}
                        alt={`${event.event_name} logo`}
                        onError={handleImageError}
                    />
                )}
            </ImageContainer>
            <ContentArea>
                <Title title={event.event_name}>
                    {event.event_name}
                </Title>
                <HostInfo>
                    Tổ chức bởi: <span>{event.host_id}</span>
                </HostInfo>
                <DetailsSection>
                    <DetailItem>
                        <CalendarIcon />
                        <span>{formatDate(event.start_date)}</span>
                    </DetailItem>
                    <DetailItem>
                        <LocationIcon />
                        <DetailText title={event.location}>
                            {event.attendance_type === ATTENDANCE_TYPES.ONLINE ? 'Online' : (event.location || 'Chưa xác định')}
                        </DetailText>
                    </DetailItem>
                </DetailsSection>
                {displayTags.length > 0 && (
                    <TagSection>
                        <TagIcon />
                        {displayTags.map(tag => (
                            <TagBadge key={tag}>{tag}</TagBadge>
                        ))}
                        {remainingTagsCount > 0 && (
                            <MoreTagsBadge>+{remainingTagsCount}</MoreTagsBadge>
                        )}
                    </TagSection>
                )}
                {/* Render các nút action */}
                {renderActionButtons()}
            </ContentArea>
        </CardWrapper>
    );
};

export default EventCard;