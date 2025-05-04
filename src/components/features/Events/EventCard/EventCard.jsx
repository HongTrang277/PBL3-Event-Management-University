// src/components/features/Events/EventCard/EventCard.jsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../../utils/helpers';
import { ATTENDANCE_TYPES } from '../../../../utils/constants';
import Button from '../../../common/Button/Button'; // Giả định Button là styled-component hoặc chấp nhận className

// --- Styled Icons (Có thể tách ra file riêng) ---
const IconWrapper = styled.span`
    display: inline-flex;
    align-items: center;
    margin-right: 0.25rem;
    color: #6b7280; /* text-gray-500 */
    svg {
        height: 1rem; /* h-4 */
        width: 1rem; /* w-4 */
    }
`;

const CalendarIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></IconWrapper>;
const LocationIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></IconWrapper>;
const TagIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 8V5a2 2 0 012-2h2zM7 11h.01" /></svg></IconWrapper>;

// --- Styled Components ---
const CardWrapper = styled.div`
    background-color: #ffffff;
    border-radius: 0.5rem; /* rounded-lg */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
    transition: box-shadow 0.3s ease-in-out;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%; /* h-full */

    &:hover {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* hover:shadow-lg */
    }
`;

const ImageContainer = styled.div`
    height: 10rem; /* h-40 */
    background-color: #e5e7eb; /* bg-gray-200 */
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af; /* text-gray-400 */
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: ${props => props.fit === 'contain' ? 'contain' : 'cover'};
    padding: ${props => props.fit === 'contain' ? '1rem' : '0'}; /* p-4 for contain */
`;

const SmallLogoOverlay = styled.img`
    position: absolute;
    bottom: 0.5rem; /* bottom-2 */
    left: 0.5rem; /* left-2 */
    height: 3rem; /* h-12 */
    width: 3rem; /* w-12 */
    border-radius: 9999px; /* rounded-full */
    background-color: #ffffff;
    padding: 0.25rem; /* p-1 */
    border: 1px solid #d1d5db; /* border-gray-300 */
    object-fit: contain;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
`;

const ContentArea = styled.div`
    padding: 1rem; /* p-4 */
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const Title = styled.h3`
    font-size: 1.125rem; /* text-lg */
    line-height: 1.75rem;
    font-weight: 600; /* font-semibold */
    color: #1f2937; /* text-gray-800 */
    margin-bottom: 0.25rem; /* mb-1 */
    font-family: 'DM Sans', sans-serif; /* font-dm-sans */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; /* truncate */
`;

const HostInfo = styled.p`
    font-size: 0.75rem; /* text-xs */
    line-height: 1rem;
    color: #6b7280; /* text-gray-500 */
    margin-bottom: 0.5rem; /* mb-2 */

    span {
        font-weight: 500; /* font-medium */
    }
`;

const DetailsSection = styled.div`
    font-size: 0.875rem; /* text-sm */
    line-height: 1.25rem;
    color: #4b5563; /* text-gray-600 */
    margin-bottom: 0.75rem; /* mb-3 */
    & > * + * {
        margin-top: 0.25rem; /* space-y-1 */
    }
`;

const DetailItem = styled.div`
    display: flex;
    align-items: center;
`;

const DetailText = styled.span`
     overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; /* truncate */
`;

const TagSection = styled.div`
    font-size: 0.875rem; /* text-sm */
    color: #4b5563; /* text-gray-600 */
    margin-bottom: 0.75rem; /* mb-3 */
    display: flex;
    align-items: center;
    flex-wrap: wrap;
`;

const TagBadge = styled.span`
    margin-right: 0.5rem; /* mr-2 */
    margin-bottom: 0.25rem; /* mb-1 */
    padding: 0.125rem 0.5rem; /* px-2 py-0.5 */
    background-color: #dbeafe; /* bg-blue-100 */
    color: #1e40af; /* text-blue-800 */
    font-size: 0.75rem; /* text-xs */
    font-weight: 500; /* font-medium */
    border-radius: 9999px; /* rounded-full */
`;

const MoreTagsBadge = styled.span`
    font-size: 0.75rem; /* text-xs */
    color: #6b7280; /* text-gray-500 */
    margin-bottom: 0.25rem; /* mb-1 */
`;

const ActionsArea = styled.div`
    margin-top: auto; /* mt-auto */
    padding-top: 0.75rem; /* pt-3 */
    border-top: 1px solid #f3f4f6; /* border-t border-gray-100 */
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const AdminActions = styled.div`
    display: flex;
    gap: 0.5rem; /* space-x-2 */
`;

// Styled Link and Button
const StyledLink = styled(Link)`
    text-decoration: none;
`;

// --- Component ---
const EventCard = ({ event, isAdminView = false }) => {
    if (!event) {
        return null;
    }

    const displayTags = event.tags?.slice(0, 2) || [];
    const remainingTagsCount = Math.max(0, (event.tags?.length || 0) - 2);

    const handleImageError = (e) => {
        e.target.style.display = 'none'; // Keep simple error handling for now
    }

    return (
        <CardWrapper>
            {/* Phần ảnh */}
            <ImageContainer>
                {event.cover_url ? (
                    <Image src={event.cover_url} alt={`${event.event_name} cover`} />
                ) : event.logo_url ? (
                    <Image src={event.logo_url} alt={`${event.event_name} logo`} fit="contain" />
                ) : (
                    "No Image"
                )}
                {event.cover_url && event.logo_url && (
                    <SmallLogoOverlay
                        src={event.logo_url}
                        alt={`${event.event_name} logo`}
                        onError={handleImageError}
                    />
                )}
            </ImageContainer>

            {/* Phần nội dung text */}
            <ContentArea>
                <Title title={event.event_name}>
                    {event.event_name}
                </Title>
                <HostInfo>
                    Tổ chức bởi: <span>{event.host_id}</span>
                </HostInfo>

                {/* Thông tin ngày và địa điểm */}
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

                {/* Tags */}
                {displayTags.length > 0 && (
                    <TagSection>
                        <TagIcon />
                        {displayTags.map(tag => (
                            <TagBadge key={tag}>
                                {tag}
                            </TagBadge>
                        ))}
                        {remainingTagsCount > 0 && (
                            <MoreTagsBadge>+{remainingTagsCount}</MoreTagsBadge>
                        )}
                    </TagSection>
                )}

                {/* Phần Actions */}
                <ActionsArea>
                    <StyledLink to={`/events/${event.event_id}`}>
                        <Button variant="primary" size="small">
                            Xem chi tiết
                        </Button>
                    </StyledLink>

                    {isAdminView && (
                        <AdminActions>
                            <StyledLink to={`/admin/edit-event/${event.event_id}`}>
                                <Button variant="secondary" size="small">Sửa</Button>
                            </StyledLink>
                            {/* <Button variant="danger" size="small">Xóa</Button> */}
                        </AdminActions>
                    )}
                </ActionsArea>
            </ContentArea>
        </CardWrapper>
    );
};

export default EventCard;