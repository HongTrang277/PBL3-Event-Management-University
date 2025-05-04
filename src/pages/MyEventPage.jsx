import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { getAllEvents } from '../services/mockData';
import { useAuth } from '../hooks/useAuth';
import EventCard from '../components/features/Events/EventCard/EventCard'; // Assume styled or accepts props
import Button from '../components/common/Button/Button'; // Assume styled or accepts className

// --- Styled Components ---

const PageWrapper = styled.div`
  /* container mx-auto p-4 md:p-6 */
   width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 1rem; /* p-4 */

  @media (min-width: 640px) { /* container breakpoints */
    max-width: 640px;
  }
  @media (min-width: 768px) { /* md */
    max-width: 768px;
    padding: 1.5rem; /* md:p-6 */
  }
  @media (min-width: 1024px) {
    max-width: 1024px;
  }
   @media (min-width: 1280px) {
    max-width: 1280px;
  }
   @media (min-width: 1536px) {
    max-width: 1536px;
  }
`;

const HeaderContainer = styled.div`
  /* flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem; /* mb-6 */
  gap: 1rem; /* gap-4 */

  @media (min-width: 640px) { /* sm */
    flex-direction: row;
    align-items: center;
  }
`;

const Title = styled.h1`
  /* text-2xl md:text-3xl font-bold font-dm-sans text-gray-800 */
  font-size: 1.5rem; /* text-2xl */
  line-height: 2rem;
  font-weight: 700; /* font-bold */
  font-family: 'DM Sans', sans-serif; /* font-dm-sans */
  color: #1f2937; /* text-gray-800 */

  @media (min-width: 768px) { /* md */
    font-size: 1.875rem; /* md:text-3xl */
    line-height: 2.25rem;
  }
`;

const EventGrid = styled.div`
  /* grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 */
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem; /* gap-6 */

  @media (min-width: 640px) { /* sm */
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
   @media (min-width: 1024px) { /* lg */
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
    @media (min-width: 1280px) { /* xl */
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const EmptyStateContainer = styled.div`
  /* text-center py-10 px-6 bg-white rounded-lg shadow */
  text-align: center;
  padding: 2.5rem 1.5rem; /* py-10 px-6 */
  background-color: #ffffff;
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow */
`;

const EmptyStateIcon = styled.svg`
  /* mx-auto h-12 w-12 text-gray-400 */
  margin-left: auto;
  margin-right: auto;
  height: 3rem; /* h-12 */
  width: 3rem; /* w-12 */
  color: #9ca3af; /* text-gray-400 */
`;

const EmptyStateTitle = styled.h3`
  /* mt-2 text-sm font-medium text-gray-900 */
  margin-top: 0.5rem; /* mt-2 */
  font-size: 0.875rem; /* text-sm */
  line-height: 1.25rem;
  font-weight: 500; /* font-medium */
  color: #111827; /* text-gray-900 */
`;

const EmptyStateText = styled.p`
  /* mt-1 text-sm text-gray-500 */
  margin-top: 0.25rem; /* mt-1 */
  font-size: 0.875rem; /* text-sm */
  line-height: 1.25rem;
  color: #6b7280; /* text-gray-500 */
`;

const EmptyStateLinkContainer = styled.div`
  /* mt-6 */
  margin-top: 1.5rem; /* mt-6 */
`;

const StatusContainer = styled.div`
  text-align: center;
  padding: 2.5rem 0; /* py-10 */
`;
const ErrorStatusContainer = styled(StatusContainer)`
  color: #dc2626; /* text-red-600 */
`;


// --- Component ---

const MyEventsPage = () => {
    const { user } = useAuth();
    const [allEvents, setAllEvents] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentUserIdentifier = user?.faculty || user?.name;

    useEffect(() => {
        const fetchEvents = async () => {
            // Keep isLoading true until filtering is also done
            // setIsLoading(true); // Already true initially
            setError(null);
            try {
                const response = await getAllEvents();
                setAllEvents(response.data || []);
            } catch (err) {
                setError(err.message || 'Không thể tải danh sách sự kiện.');
                setAllEvents([]);
                setIsLoading(false); // Set loading false if fetch fails
            }
            // Don't set loading false here, wait for the filter effect
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        // Only filter if allEvents is populated and user identifier is known
        if (allEvents.length > 0 && currentUserIdentifier) {
             const filtered = allEvents.filter(event => event.host_id === currentUserIdentifier);
             setMyEvents(filtered);
             setIsLoading(false); // Set loading false after filtering
        } else if (allEvents.length > 0 && !currentUserIdentifier) {
             // Handle case where user is loaded but doesn't have identifier?
             setMyEvents([]); // Show no events if no identifier
             setIsLoading(false);
        } else if (allEvents.length === 0 && !isLoading) {
            // If fetch finished (isLoading became potentially false from error)
            // and allEvents is still empty, stop loading.
             setIsLoading(false);
        }
         // This effect depends on allEvents, currentUserIdentifier
         // Avoid depending on isLoading directly here to prevent potential loops

    }, [allEvents, currentUserIdentifier]);


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
          {/* Assuming Button can be used inside Link or vice-versa */}
          <RouterLink to="/admin/create-event">
            <Button variant="primary">
               + Tạo sự kiện mới
            </Button>
          </RouterLink>
      </HeaderContainer>

      {myEvents.length > 0 ? (
        <EventGrid>
          {myEvents.map((event) => (
             // Assuming EventCard component takes props
             <EventCard key={event.event_id} event={event} isAdminView={true} />
          ))}
        </EventGrid>
      ) : (
         <EmptyStateContainer>
           <EmptyStateIcon xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M12 14h.01M12 10h.01M12 6h.01" />
           </EmptyStateIcon>
           <EmptyStateTitle>Chưa có sự kiện nào</EmptyStateTitle>
           <EmptyStateText>Bắt đầu tạo sự kiện đầu tiên của bạn!</EmptyStateText>
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