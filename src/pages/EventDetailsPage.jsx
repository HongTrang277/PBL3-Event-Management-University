import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { getEventById, registerForEvent } from '../services/mockData';
import { useAuth } from '../hooks/useAuth';
import { ROLES, ATTENDANCE_TYPES } from '../utils/constants';
import { formatDateTime } from '../utils/helpers';
import Button from '../components/common/Button/Button'; // Assume Button is styled or accepts className

// --- Styled Components ---

const StatusContainer = styled.div`
  /* text-center py-10 */
  text-align: center;
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
`;
const ErrorStatusContainer = styled(StatusContainer)`
  color: #dc2626; /* text-red-600 */
  p { margin-bottom: 1rem; } /* Add some space before button */
`;

const PageWrapper = styled.div`
  /* bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto my-6 */
  background-color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  border-radius: 0.5rem; /* rounded-lg */
  overflow: hidden;
  max-width: 56rem; /* max-w-4xl */
  margin-left: auto;
  margin-right: auto;
  margin-top: 1.5rem; /* my-6 */
  margin-bottom: 1.5rem; /* my-6 */
`;

const CoverImageContainer = styled.div`
  /* h-48 md:h-64 bg-gray-200 */
  height: 12rem; /* h-48 */
  background-color: #e5e7eb; /* bg-gray-200 */
  @media (min-width: 768px) { /* md */
    height: 16rem; /* md:h-64 */
  }
`;

const CoverImage = styled.img`
  /* w-full h-full object-cover */
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ContentPadding = styled.div`
  /* p-4 md:p-8 */
  padding: 1rem; /* p-4 */
  @media (min-width: 768px) { /* md */
    padding: 2rem; /* md:p-8 */
  }
`;

const HeaderSection = styled.div`
  /* flex flex-col sm:flex-row items-start sm:items-center mb-6 */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1.5rem; /* mb-6 */

  @media (min-width: 640px) { /* sm */
    flex-direction: row;
    align-items: center;
  }
`;

const LogoImageContainer = styled.div`
  /* flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white -mt-12 md:-mt-16 shadow-md bg-white overflow-hidden mb-4 sm:mb-0 sm:mr-6 */
  flex-shrink: 0;
  width: 6rem; /* w-24 */
  height: 6rem; /* h-24 */
  border-radius: 9999px; /* rounded-full */
  border: 4px solid white;
  margin-top: -3rem; /* -mt-12 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
  background-color: white;
  overflow: hidden;
  margin-bottom: 1rem; /* mb-4 */

  @media (min-width: 640px) { /* sm */
     margin-bottom: 0; /* sm:mb-0 */
     margin-right: 1.5rem; /* sm:mr-6 */
  }
  @media (min-width: 768px) { /* md */
     width: 8rem; /* md:w-32 */
     height: 8rem; /* md:h-32 */
     margin-top: -4rem; /* md:-mt-16 */
  }
`;

const LogoImage = styled.img`
  /* w-full h-full object-contain */
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const TitleContainer = styled.div`
  /* flex-grow */
  flex-grow: 1;
`;

const EventTitle = styled.h1`
  /* text-2xl md:text-4xl font-bold text-gray-800 font-dm-sans mb-1 */
  font-size: 1.5rem; /* text-2xl */
  line-height: 2rem;
  font-weight: 700; /* font-bold */
  color: #1f2937; /* text-gray-800 */
  font-family: 'DM Sans', sans-serif; /* font-dm-sans */
  margin-bottom: 0.25rem; /* mb-1 */

  @media (min-width: 768px) { /* md */
    font-size: 2.25rem; /* md:text-4xl */
    line-height: 2.5rem;
  }
`;

const HostInfo = styled.p`
  /* text-md text-gray-600 */
  font-size: 1rem; /* text-md is not standard, assuming 1rem */
  line-height: 1.5rem;
  color: #4b5563; /* text-gray-600 */
  margin: 0;
`;

const SemiBold = styled.span`
    font-weight: 600; /* font-semibold */
`;

const EditButtonContainer = styled.div`
  /* mt-4 sm:mt-0 sm:ml-auto */
  margin-top: 1rem; /* mt-4 */
  @media (min-width: 640px) { /* sm */
    margin-top: 0;
    margin-left: auto;
  }
`;

const DetailsGrid = styled.div`
  /* grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 */
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem; /* gap-6 */
  margin-bottom: 1.5rem; /* mb-6 */

  @media (min-width: 768px) { /* md */
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2rem; /* md:gap-8 */
  }
`;

const DescriptionColumn = styled.div`
  /* md:col-span-2 */
  @media (min-width: 768px) { /* md */
     grid-column: span 2 / span 2;
  }
`;

const InfoColumn = styled.div`
  /* md:col-span-1 space-y-4 */
  & > * + * { margin-top: 1rem; } /* space-y-4 */

  @media (min-width: 768px) { /* md */
     grid-column: span 1 / span 1;
  }
`;

const SectionTitle = styled.h2`
  /* text-xl font-semibold text-gray-700 mb-3 font-dm-sans */
  font-size: 1.25rem; /* text-xl */
  line-height: 1.75rem;
  font-weight: 600; /* font-semibold */
  color: #374151; /* text-gray-700 */
  margin-bottom: 0.75rem; /* mb-3 */
  font-family: 'DM Sans', sans-serif; /* font-dm-sans */
`;

const DescriptionText = styled.p`
  /* text-gray-700 whitespace-pre-wrap leading-relaxed */
  color: #374151; /* text-gray-700 */
  white-space: pre-wrap;
  line-height: 1.625; /* leading-relaxed */
  margin: 0;
`;

const InfoLabel = styled.h3`
  /* text-sm font-medium text-gray-500 */
  font-size: 0.875rem; /* text-sm */
  line-height: 1.25rem;
  font-weight: 500; /* font-medium */
  color: #6b7280; /* text-gray-500 */
  margin-bottom: 0.25rem; /* mb-1 implicit in some cases */
`;

const InfoText = styled.p`
  /* text-gray-900 */
  color: #111827; /* text-gray-900 */
  margin: 0;
  text-transform: capitalize; /* capitalize class */
`;

const TagContainer = styled.div`
  /* flex flex-wrap gap-2 */
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem; /* gap-2 */
`;

const TagBadge = styled.span`
  /* px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full */
  padding: 0.25rem 0.75rem; /* px-3 py-1 */
  background-color: #dbeafe; /* bg-blue-100 */
  color: #1e40af; /* text-blue-800 */
  font-size: 0.75rem; /* text-xs */
  line-height: 1rem;
  font-weight: 500; /* font-medium */
  border-radius: 9999px; /* rounded-full */
`;

const RegistrationSection = styled.div`
  /* mt-8 pt-6 border-t border-gray-200 text-center */
  margin-top: 2rem; /* mt-8 */
  padding-top: 1.5rem; /* pt-6 */
  border-top: 1px solid #e5e7eb; /* border-t border-gray-200 */
  text-align: center;
`;

const StatusMessage = styled.p`
  /* text-green-600 font-semibold */
  color: #16a34a; /* text-green-600 */
  font-weight: 600; /* font-semibold */
  margin: 0;
  margin-bottom: 0.5rem; /* Implicit spacing */
`;
const ErrorRegMessage = styled(StatusMessage)`
   color: #dc2626; /* text-red-600 */
   margin-bottom: 0.5rem; /* mb-2 */
`;


const BackButtonContainer = styled.div`
  /* mt-6 text-center */
  margin-top: 1.5rem; /* mt-6 */
  text-align: center;
`;

// --- Component ---

const EventDetailsPage = () => {
    const { eventId } = useParams(); // Lấy eventId từ URL
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [registrationMessage, setRegistrationMessage] = useState('');
    const [registrationError, setRegistrationError] = useState(null); // Separate error for registration


    useEffect(() => {
        const fetchEvent = async () => {
            setIsLoading(true);
            setError(null);
            setRegistrationMessage('');
            setRegistrationError(null); // Clear errors on load
            try {
                const response = await getEventById(eventId);
                setEvent(response.data);
            } catch (err) {
                setError(err.message || 'Không thể tải thông tin sự kiện.');
                setEvent(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    const handleRegister = async () => {
        if (!isAuthenticated || !user || user.role !== ROLES.STUDENT) {
            navigate('/login', { state: { from: window.location } });
            return;
        }

        setIsRegistering(true);
        setRegistrationMessage('');
        setRegistrationError(null);

        try {
            const result = await registerForEvent(eventId, user.id);
            setRegistrationMessage(result.message || "Đăng ký thành công!");
            // setEvent(prev => ({ ...prev, isRegistered: true })); // Optional update
        } catch (err) {
            setRegistrationError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
        } finally {
            setIsRegistering(false);
        }
    }

    if (isLoading) {
        return <StatusContainer>Đang tải thông tin sự kiện...</StatusContainer>;
    }

    if (error) {
        return (
            <ErrorStatusContainer>
                <p>Lỗi: {error}</p>
                {/* Assuming Button accepts variant and onClick */}
                <Button onClick={() => navigate(-1)} variant="secondary">
                    Quay lại
                </Button>
            </ErrorStatusContainer>
        );
    }

    if (!event) {
        return <StatusContainer>Không tìm thấy thông tin sự kiện.</StatusContainer>;
    }

    const isHost = isAuthenticated &&
        (user?.role === ROLES.EVENT_CREATOR || user?.role === ROLES.UNION) &&
        (user?.faculty === event.host_id || user?.name === event.host_id);


  return (
    <PageWrapper>
      <CoverImageContainer>
        {event.cover_url && (
          <CoverImage
            src={event.cover_url}
            alt={`${event.event_name} cover`}
            onError={(e) => e.target.style.display='none'}
          />
        )}
       </CoverImageContainer>

       <ContentPadding>
           <HeaderSection>
              {event.logo_url && (
                <LogoImageContainer>
                  <LogoImage
                    src={event.logo_url}
                    alt={`${event.event_name} logo`}
                    onError={(e) => e.target.style.display='none'}
                  />
                </LogoImageContainer>
              )}
              <TitleContainer>
                <EventTitle>
                    {event.event_name}
                </EventTitle>
                <HostInfo>
                    Tổ chức bởi: <SemiBold>{event.host_id}</SemiBold>
                </HostInfo>
              </TitleContainer>
              {isHost && (
                <EditButtonContainer>
                    {/* Assuming Button can be used as a Link or wraps a Link */}
                     <RouterLink to={`/admin/edit-event/${eventId}`}>
                       <Button variant="secondary" size="small">
                          Chỉnh sửa
                       </Button>
                     </RouterLink>
                </EditButtonContainer>
              )}
           </HeaderSection>

           <DetailsGrid>
               <DescriptionColumn>
                   <SectionTitle>Mô tả sự kiện</SectionTitle>
                   <DescriptionText>
                        {event.description || "Không có mô tả."}
                   </DescriptionText>
               </DescriptionColumn>

               <InfoColumn>
                   <div>
                        <InfoLabel>Thời gian</InfoLabel>
                        <InfoText>
                            <SemiBold>Bắt đầu:</SemiBold> {formatDateTime(event.start_date)}
                        </InfoText>
                        <InfoText>
                            <SemiBold>Kết thúc:</SemiBold> {formatDateTime(event.end_date)}
                        </InfoText>
                   </div>
                   <div>
                        <InfoLabel>Hình thức & Địa điểm</InfoLabel>
                        <InfoText>
                            {event.attendance_type === ATTENDANCE_TYPES.ONLINE ? 'Trực tuyến (Online)' : 'Trực tiếp (Offline)'}
                        </InfoText>
                        {event.location && (
                             <InfoText>
                                {event.attendance_type === ATTENDANCE_TYPES.ONLINE ? 'Nền tảng: ' : 'Địa điểm: '}
                                <SemiBold>{event.location}</SemiBold>
                             </InfoText>
                        )}
                   </div>
                   <div>
                        <InfoLabel>Số lượng</InfoLabel>
                        <InfoText>
                            Tối đa: <SemiBold>{event.capacity} người</SemiBold>
                        </InfoText>
                        {/* Optional: Display registered count */}
                        {/* <InfoText>Đã đăng ký: X / {event.capacity}</InfoText> */}
                   </div>
                   {event.tags && event.tags.length > 0 && (
                        <div>
                            <InfoLabel>Thể loại</InfoLabel>
                            <TagContainer>
                               {event.tags.map(tag => (
                                    <TagBadge key={tag}>
                                       {tag}
                                    </TagBadge>
                               ))}
                            </TagContainer>
                        </div>
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
                     isLoading={isRegistering} // Pass prop
                     // disabled={isRegistering /* || event.isRegistered */}
                     // className="w-full sm:w-auto" // Pass className if Button supports it for sizing
                   >
                     {isRegistering ? 'Đang xử lý...' : 'Đăng ký tham gia'}
                     {/* {event.isRegistered ? 'Đã đăng ký' : 'Đăng ký tham gia'} */}
                   </Button>
                 </>
               )}
             </RegistrationSection>
           )}

           <BackButtonContainer>
               <Button onClick={() => navigate(-1)} variant="secondary">
                   &larr; Quay lại danh sách
               </Button>
           </BackButtonContainer>

       </ContentPadding>
    </PageWrapper>
  );
};

export default EventDetailsPage;