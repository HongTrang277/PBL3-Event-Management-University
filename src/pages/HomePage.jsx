// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import EventSearchBar from '../components/features/Search/EventSearchBar/EventSearchBar';
import EventCard from '../components/features/Events/EventCard/EventCard';
import { eventService, registrationService } from '../services/api';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

// --- Theme (Giữ nguyên) ---
const theme = {
    colors: {
        primary: '#a8e0fd', 'primary-1': "#47c1ff", 'primary-2': "#ddf4ff",
        'primary-3': "#003652", 'primary-4': "#5ba2dd",
        'custom-gray': { 100: '#f7fafc', 200: '#edf2f7', 300: '#e2e8f0', 400: '#cbd5e0', 500: '#a0aec0', 600: '#718096', 700: '#4a5568', 800: '#2d3748', 900: '#1a202c' },
        white: '#ffffff',
    },
    fontFamily: { 'nutito-sans': ['"Nunito Sans"', 'sans-serif'], 'dm-sans': ['"DM Sans"', 'sans-serif'] }
};

// --- Styled Components (Giữ nguyên) ---
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
    @media (max-width: 992px) { flex-direction: column; }
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
    @media (max-width: 992px) { margin-left: auto; margin-right: auto; }
`;
const SearchContainer = styled.div`
    margin-bottom: 1rem; max-width: 700px; width: 100%;
    @media (max-width: 992px) { margin-left: auto; margin-right: auto; padding: 0 1rem; }
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
    const navigate = useNavigate(); // <<< KHỞI TẠO NAVIGATE
    const [allApprovedEvents, setAllApprovedEvents] = useState([]);
    const [displayedEvents, setDisplayedEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [registeredEventMap, setRegisteredEventMap] = useState(new Map());

    // Fetch initial events and registered status
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            setError(null);
            setRegisteredEventMap(new Map());
            try {
                const eventsFromApi = await eventService.getAllEvents();
                const approved = (eventsFromApi || [])
                    // .filter(event => event.approvalStatus === 'approved') // Tạm thời bỏ filter theo yêu cầu trước
                    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                setAllApprovedEvents(approved);

                if (isAuthenticated && user?.role === ROLES.STUDENT && user?.id) {
                    const registeredResponse = await registrationService.getEventsUserRegisteredFor(user.id);
                    const newMap = new Map();
                    if (Array.isArray(registeredResponse)) {
                        registeredResponse.forEach(reg => {
                            const eventIdToUse = reg.event?.eventId || reg.eventId;
                            if (eventIdToUse && reg.registrationId) {
                                newMap.set(eventIdToUse, reg.registrationId);
                            }
                        });
                    }
                    setRegisteredEventMap(newMap);
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Không thể tải dữ liệu sự kiện.');
                setAllApprovedEvents([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [user, isAuthenticated, navigate]); // Thêm navigate vào dependency array nếu navigate được dùng trong useEffect (hiện tại không)

    // Update displayed events
    useEffect(() => {
        if (searchTerm === '') {
            setDisplayedEvents(allApprovedEvents);
        } else {
            const lowerSearchTerm = searchTerm.toLowerCase();
            const filtered = allApprovedEvents.filter(event => {
                const eventName = event.eventName || "";
                const eventDescription = event.description || "";
                const eventTagsArray = Array.isArray(event.tagsList) ? event.tagsList : (Array.isArray(event.tags) ? event.tags : []);
                return eventName.toLowerCase().includes(lowerSearchTerm) ||
                       eventDescription.toLowerCase().includes(lowerSearchTerm) ||
                       (eventTagsArray.some(tag => String(tag).toLowerCase().includes(lowerSearchTerm)));
            });
            setDisplayedEvents(filtered);
        }
    }, [searchTerm, allApprovedEvents]);

    const handleSearch = (term) => setSearchTerm(term);

    // --- Handler for registering an event - ĐÃ SỬA ---
    const handleRegister = async (eventId) => {
        if (!isAuthenticated) { // Bước 1: Kiểm tra đã đăng nhập chưa
            alert("Vui lòng đăng nhập để đăng ký sự kiện.");
            navigate('/login', { state: { from: `/events/${eventId}` } }); // Chuyển hướng tới trang login
            return;
        }

        // Bước 2: Nếu đã đăng nhập, kiểm tra vai trò và user.id
        if (user?.role !== ROLES.STUDENT || !user?.id) {
            alert("Chỉ có sinh viên mới có thể đăng ký sự kiện.");
            return;
        }

        // Bước 3: Tiến hành đăng ký
        try {
            const responseData = await registrationService.registerUserForEvent(user.id, eventId);
            if (responseData && responseData.registrationId) {
                const eventIdToMap = responseData.eventId || eventId;
                setRegisteredEventMap(prevMap => new Map(prevMap).set(eventIdToMap, responseData.registrationId));
                alert("Đăng ký thành công!");
            } else {
                alert("Đăng ký thành công, nhưng có lỗi khi cập nhật trạng thái. Vui lòng làm mới trang.");
                console.warn("Registration successful but API response missing registrationId or eventId:", responseData);
            }
        } catch (err) {
            alert(`Đăng ký thất bại: ${err.response?.data?.message || err.message}`);
        }
    };

    // --- Handler for unregistering an event - ĐÃ SỬA ---
    const handleUnregister = async (eventId) => {
        if (!isAuthenticated) { // Bước 1: Kiểm tra đã đăng nhập chưa
            alert("Vui lòng đăng nhập để hủy đăng ký sự kiện.");
            navigate('/login', { state: { from: `/events/${eventId}` } }); // Chuyển hướng tới trang login
            return;
        }

        // Bước 2: Nếu đã đăng nhập, kiểm tra vai trò và user.id
        if (user?.role !== ROLES.STUDENT || !user?.id) {
            alert("Chỉ có sinh viên mới có thể hủy đăng ký sự kiện.");
            return;
        }

        // Bước 3: Lấy registrationId và tiến hành hủy đăng ký
        const registrationId = registeredEventMap.get(eventId); // <<< LẤY REGISTRATION ID TỪ MAP
        if (!registrationId) {
            alert("Hủy đăng ký thất bại: Không tìm thấy thông tin đăng ký cho sự kiện này.");
            console.error("Cannot unregister: RegistrationId not found for eventId:", eventId);
            return;
        }

        try {
            await registrationService.removeRegistration(registrationId); // Sử dụng registrationId đã lấy
            setRegisteredEventMap(prevMap => {
                const newMap = new Map(prevMap);
                newMap.delete(eventId);
                return newMap;
            });
            alert("Hủy đăng ký thành công!");
        } catch (err) {
            alert(`Hủy đăng ký thất bại: ${err.response?.data?.message || err.message}`);
        }
    };

    // Slick slider settings
    const sliderSettings = {
        dots: true,
        infinite: displayedEvents.length > 5,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 4 } },
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } }
        ]
    };

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
                            src="https://i.pinimg.com/736x/1c/89/62/1c89623c82775c76242435eb02b5b69b.jpg"
                            alt="Sinh viên Đại học Bách Khoa DUT tham gia sự kiện"
                        />
                    </HeroImageContainer>
                </HeroSection>

                <EventsSectionWrapper>
                    <EventsSectionContent>
                        <SectionTitle>
                            {searchTerm ? `Kết quả tìm kiếm cho "${searchTerm}"` : 'Sự kiện Sắp Diễn Ra & Nổi Bật'}
                        </SectionTitle>

                        {isLoading && <StatusText>Đang tải sự kiện...</StatusText>}
                        {error && <StatusText style={{ color: 'red' }}>Lỗi: {error}</StatusText>}

                        {!isLoading && !error && (
                            displayedEvents.length > 0 ? (
                                searchTerm ? (
                                    <EventGrid>
                                        {displayedEvents.map((event) => (
                                            <EventCard
                                                key={event.eventId}
                                                event={event}
                                                isAlreadyRegistered={isAuthenticated && user?.role === ROLES.STUDENT ? registeredEventMap.has(event.eventId) : false}
                                                onRegister={() => handleRegister(event.eventId)}
                                                onUnregister={() => handleUnregister(event.eventId)}
                                            />
                                        ))}
                                    </EventGrid>
                                ) : (
                                    <Slider {...sliderSettings}>
                                        {displayedEvents.map((event) => (
                                            <div key={event.eventId}>
                                                <EventCard
                                                    event={event}
                                                    isAlreadyRegistered={isAuthenticated && user?.role === ROLES.STUDENT ? registeredEventMap.has(event.eventId) : false}
                                                    onRegister={() => handleRegister(event.eventId)}
                                                    onUnregister={() => handleUnregister(event.eventId)}
                                                />
                                            </div>
                                        ))}
                                    </Slider>
                                )
                            ) : (
                                <StatusText>
                                    {searchTerm ? 'Không tìm thấy sự kiện nào phù hợp.' : (allApprovedEvents.length === 0 && !isLoading ? 'Hiện chưa có sự kiện nào.' : 'Hiện chưa có sự kiện nào được phê duyệt.')}
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