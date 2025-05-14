// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import EventSearchBar from '../components/features/Search/EventSearchBar/EventSearchBar';
import EventCard from '../components/features/Events/EventCard/EventCard';
import { getRegisteredEventsForStudent, registerForEvent, unregisterForEvent } from '../services/mockData'; // Import các hàm API mock
import { eventService, registrationService } from '../services/api';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants'; // Import ROLES

// --- Theme ---
const theme = {
    colors: {
        primary: '#a8e0fd', 'primary-1': "#47c1ff", 'primary-2': "#ddf4ff",
        'primary-3': "#003652", 'primary-4': "#5ba2dd",
        'custom-gray': { 100: '#f7fafc', 200: '#edf2f7', 300: '#e2e8f0', 400: '#cbd5e0', 500: '#a0aec0', 600: '#718096', 700: '#4a5568', 800: '#2d3748', 900: '#1a202c' },
        white: '#ffffff',
    },
    fontFamily: { 'nutito-sans': ['"Nunito Sans"', 'sans-serif'], 'dm-sans': ['"DM Sans"', 'sans-serif'] }
};

// --- Styled Components ---
const HomePageWrapper = styled.div`
    background-color: ${props => props.theme.colors['primary-2']};
    color: ${props => props.theme.colors['custom-gray'][800]};
    font-family: ${props => props.theme.fontFamily['nutito-sans']};
    min-height: calc(100vh - 120px); display: flex; flex-direction: column;
`;
const HeroSection = styled.section`
    background: linear-gradient(135deg, ${props => props.theme.colors['primary-4']} 0%, ${props => props.theme.colors['primary-1']} 100%);
    padding: 3rem 1.5rem; width: 100%; box-sizing: border-box; display: flex;
    align-items: center; justify-content: space-evenly; gap: 2rem;
    text-align: center; color: ${props => props.theme.colors.white};
    @media (max-width: 992px) { flex-direction: column; } /* Stack columns on smaller screens */
`;
const HeroTextContent = styled.div`
    flex: 1 1 50%; max-width: 600px; display: flex; flex-direction: column;
    justify-content: center; align-items: flex-start;
    @media (max-width: 992px) { align-items: center; max-width: 100%; margin-top: 1.5rem; text-align: center;}
`;
const HeroImageContainer = styled.div`
    flex: 1 1 45%; max-width: 550px; height: 300px; display: flex; justify-content: center; align-items: center;
    img { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25); }
    @media (max-width: 992px) { width: 80%; max-width: 400px; height: 250px; }
    @media (max-width: 640px) { width: 90%; height: 200px; }
`;
const SiteTitle = styled.h1`
    font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; font-family: ${props => props.theme.fontFamily['dm-sans']};
    color: ${props => props.theme.colors['primary-3']}; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    @media (min-width: 768px) { font-size: 3rem; }
`;
const Subtitle = styled.p`
    font-size: 1.125rem; margin-bottom: 2rem; color: ${props => props.theme.colors['primary-2']};
    max-width: 600px; line-height: 1.6;
    /* margin-left/right auto removed for left align on desktop */
    @media (max-width: 992px) { margin-left: auto; margin-right: auto; } /* Center on mobile */
`;
const SearchContainer = styled.div`
    margin-bottom: 1rem; max-width: 700px; width: 100%; /* Ensure search takes width */
    /* margin-left/right auto removed for left align on desktop */
     @media (max-width: 992px) { margin-left: auto; margin-right: auto; padding: 0 1rem; } /* Center on mobile */
`;
const EventsSectionWrapper = styled.section`
    padding: 2rem 0; flex-grow: 1; width: 100%;
`;
const EventsSectionContent = styled.div`
    max-width: 1280px; margin: 0 auto; padding: 0 1.5rem;
    .slick-slide > div { padding: 0 8px; }
    .slick-prev, .slick-next { background-color: rgba(0, 54, 82, 0.5); border-radius: 50%; width: 40px; height: 40px; z-index: 1; }
    .slick-prev:hover, .slick-next:hover { background-color: rgba(0, 54, 82, 0.8); }
    .slick-prev:before, .slick-next:before { color: white; font-size: 20px; }
    .slick-prev { left: -50px; @media (max-width: 640px) { left: -20px; } }
    .slick-next { right: -50px; @media (max-width: 640px) { right: -20px; } }
`;
const SectionTitle = styled.h2`
    font-size: 1.75rem; font-weight: 600; margin-bottom: 1.5rem; font-family: ${props => props.theme.fontFamily['dm-sans']};
    color: ${props => props.theme.colors['primary-3']}; text-align: center;
`;
const EventGrid = styled.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;
`;
const StatusText = styled.p`
    text-align: center; padding: 2rem; font-size: 1rem; color: ${props => props.theme.colors['custom-gray'][600]};
`;

// --- Component Logic ---
const HomePage = () => {
    const { user, isAuthenticated } = useAuth();
    const [allApprovedEvents, setAllApprovedEvents] = useState([]);
    const [displayedEvents, setDisplayedEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [registeredEventIds, setRegisteredEventIds] = useState(new Set());

    // Fetch initial events and registered status
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            setError(null);
            setRegisteredEventIds(new Set()); // Reset registered IDs on re-fetch
            try {
                // Fetch all events first
                const eventsResponse = await eventService.getAllEvents();
                const eventsData = Array.isArray(eventsResponse.data) ? eventsResponse.data : (eventsResponse.data?.data || []);
                const eventsToDisplay = eventsData
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        setAllApprovedEvents(eventsToDisplay);
                // If user is logged in as student, fetch their registered events
                if (isAuthenticated && user?.role === ROLES.STUDENT && user?.id) {
                    const registeredResponse = await getRegisteredEventsForStudent(user.id);
                    const ids = new Set((registeredResponse.data || []).map(e => e.eventId || e.event_id));
                    setRegisteredEventIds(ids);
                }
            } catch (err) {
                console.error("HomePage - Error fetching initial data:", err);
                setError(err.message || 'Không thể tải dữ liệu sự kiện.');
                setAllApprovedEvents([]); // Clear events on error
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [user, isAuthenticated]); // Re-run when user or auth state changes

    // Update displayed events based on search term or all approved events
    useEffect(() => {
        if (searchTerm === '') {
            setDisplayedEvents(allApprovedEvents);
        } else {
            const lowerSearchTerm = searchTerm.toLowerCase();
            const filtered = allApprovedEvents.filter(event =>
                event.eventName.toLowerCase().includes(lowerSearchTerm) ||
                event.description.toLowerCase().includes(lowerSearchTerm) ||
                (event.tags && event.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm)))
            );
            setDisplayedEvents(filtered);
        }
    }, [searchTerm, allApprovedEvents]);

    // Handler for search input
    const handleSearch = (term) => setSearchTerm(term);

    // Handler for registering an event
    const handleRegister = async (eventId, studentId) => {
        // Basic guard, though EventCard already checks isAuthenticated
        if (!isAuthenticated || user?.role !== ROLES.STUDENT) return;
        try {
            await registerForEvent(eventId, studentId);
            // Update the set of registered event IDs to reflect the change immediately
            setRegisteredEventIds(prev => new Set(prev).add(eventId));
            alert("Đăng ký thành công!");
        } catch (err) {
            // Display specific error messages if available
            alert(`Đăng ký thất bại: ${err.message}`);
        }
    };

    // Handler for unregistering an event
    const handleUnregister = async (eventId, studentId) => {
        // Basic guard
        if (!isAuthenticated || user?.role !== ROLES.STUDENT) return;
        try {
            await unregisterForEvent(eventId, studentId);
            // Update the set of registered event IDs
            setRegisteredEventIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(eventId);
                return newSet;
            });
            alert("Hủy đăng ký thành công!");
        } catch (err) {
            alert(`Hủy đăng ký thất bại: ${err.message}`);
        }
    };

    // Slick slider settings
    const sliderSettings = {
        dots: true,
        infinite: displayedEvents.length > 5, // Enable infinite loop only if enough items
        speed: 500,
        slidesToShow: 5, // Adjust based on preference and screen size
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 4 } },
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } }
        ]
    };

    // --- JSX Rendering ---
    return (
        <ThemeProvider theme={theme}>
            <HomePageWrapper>
                <HeroSection>
                    <HeroTextContent>
                        <SiteTitle>Khám Phá Sự Kiện DUT</SiteTitle>
                        <Subtitle>
                            Nơi kết nối, học hỏi và phát triển cùng cộng đồng sinh viên Đại học Bách khoa - ĐH Đà Nẵng.
                            Tìm kiếm và tham gia các sự kiện thú vị do Khoa và Đoàn trường tổ chức.
                        </Subtitle>
                        <SearchContainer>
                            <EventSearchBar onSearch={handleSearch} placeholder="Tìm tên sự kiện, mô tả, tag..." />
                        </SearchContainer>
                    </HeroTextContent>
                    <HeroImageContainer>
                        <img
                            src="https://i.pinimg.com/736x/1c/89/62/1c89623c82775c76242435eb02b5b69b.jpg" // Replace with your actual image URL
                            alt="Sinh viên Đại học Bách Khoa DUT tham gia sự kiện"
                        />
                    </HeroImageContainer>
                </HeroSection>

                <EventsSectionWrapper>
                    <EventsSectionContent>
                        <SectionTitle>
                            {searchTerm ? `Kết quả tìm kiếm cho "${searchTerm}"` : 'Sự kiện Sắp Diễn Ra & Nổi Bật'}
                        </SectionTitle>

                        {/* Loading and Error States */}
                        {isLoading && <StatusText>Đang tải sự kiện...</StatusText>}
                        {error && <StatusText style={{ color: 'red' }}>Lỗi: {error}</StatusText>}

                        {/* Event Display Logic */}
                        {!isLoading && !error && (
                            displayedEvents.length > 0 ? (
                                searchTerm ? (
                                    // Display as Grid when searching
                                    <EventGrid>
                                        {displayedEvents.map((event) => (
                                            <EventCard
                                                key={event.eventId || event.id}
                                                event={event}
                                                isAlreadyRegistered={isAuthenticated && user?.role === ROLES.STUDENT ? registeredEventIds.has(event.eventId) : false}
                                                onRegister={() => handleRegister(event.eventId || event.event_id)}
                                                onUnregister={() => handleUnregister(event.eventId || event.event_id)}
                                            />
                                        ))}
                                    </EventGrid>
                                ) : (
                                    // Display as Slider when not searching (and events exist)
                                    <Slider {...sliderSettings}>
                                        {displayedEvents.map((event) => (
                                            // Slider requires a wrapper div for each slide
                                            <div key={event.eventId}>
                                                <EventCard
                                                    event={event}
                                                    isAlreadyRegistered={isAuthenticated && user?.role === ROLES.STUDENT ? registeredEventIds.has(event.eventId || event.event_id) : false}
                                                    onRegister={handleRegister}
                                                    onUnregister={handleUnregister}
                                                />
                                            </div>
                                        ))}
                                    </Slider>
                                )
                            ) : (
                                // No events found message
                                <StatusText>
                                    {searchTerm ? 'Không tìm thấy sự kiện nào phù hợp.' : 'Hiện chưa có sự kiện nào được phê duyệt.'}
                                </StatusText>
                            )
                        )}
                    </EventsSectionContent>
                </EventsSectionWrapper>
            </HomePageWrapper>
        </ThemeProvider>
    );
};

export default HomePage;