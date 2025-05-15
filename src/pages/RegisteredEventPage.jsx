// src/pages/RegisteredEventsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import EventCard from '../components/features/Events/EventCard/EventCard';
import { registrationService, eventService } from '../services/api'; // Sử dụng API thật
import { formatDateTime } from '../utils/helpers'; // Giả sử bạn có hàm này
import { ATTENDANCE_TYPES, ROLES } from '../utils/constants'; // Giả sử bạn có các hằng số này
import Button from '../components/common/Button/Button';


// --- Styled Components Mới cho Layout ---
const PageWrapper = styled.div`
  padding: 1.5rem;
  /* Bỏ max-width hoặc đặt giá trị lớn hơn nếu muốn có một giới hạn nhỏ */
  /* max-width: 1280px; */
  width: 100%; /* Đảm bảo nó chiếm toàn bộ chiều rộng có thể */
  margin: 0 auto;
  box-sizing: border-box; /* Đảm bảo padding không làm tăng kích thước tổng thể vượt quá 100% */
`;

const MainTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1f2937;
  font-family: 'DM Sans', sans-serif;
`;

const TwoColumnLayout = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem; // Khoảng cách giữa hai cột
  margin-top: 1.5rem;

  @media (max-width: 992px) { // Stack cột trên màn hình nhỏ hơn
    flex-direction: column;
  }
`;

const EventListColumn = styled.div`
  flex: 1; 
  min-width: 280px; 
  max-height: calc(100vh - 150px); // Đảm bảo có chiều cao cố định để thanh cuộn xuất hiện
  overflow-y: auto; // Quan trọng: cho phép cuộn theo chiều dọc
  padding-right: 1rem; // Giữ lại hoặc điều chỉnh padding này

  // ... các style khác của EventListColumn ...

  /* Tùy chỉnh thanh cuộn cho các trình duyệt WebKit (Chrome, Safari, Edge mới) */
  &::-webkit-scrollbar {
    width: 8px; /* Độ rộng của thanh cuộn dọc */
    height: 8px; /* Độ cao của thanh cuộn ngang (nếu có overflow-x) */
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1; /* Màu của rãnh cuộn (track) */
    border-radius: 10px; /* Bo tròn rãnh cuộn */
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1; /* Màu của con trượt (thumb) */
    border-radius: 10px; /* Bo tròn con trượt */
    border: 2px solid #f1f1f1; /* Tạo khoảng cách nhỏ giữa thumb và track, giống trong hình */
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8; /* Màu của con trượt khi hover */
  }

  /* Tùy chỉnh thanh cuộn cho Firefox */
  /* Firefox hỗ trợ ít hơn cho việc tùy chỉnh chi tiết như WebKit */
  scrollbar-width: thin; /* 'auto', 'thin', 'none' */
  scrollbar-color: #c1c1c1 #f1f1f1; /* 'thumb-color track-color' */

  /* Điều chỉnh padding-right để không bị thanh cuộn mới che mất nội dung */
  /* Nếu thanh cuộn mới chiếm không gian bên trong padding */
  /* Nếu bạn muốn thanh cuộn nằm đè lên nội dung một chút (overlay scrollbar), 
     có thể cần các kỹ thuật phức tạp hơn hoặc thư viện. 
     Tuy nhiên, cách trên là cách phổ biến để style thanh cuộn chiếm không gian riêng. */
  /* Trong trường hợp này, padding-right: 1rem; đã có vẻ ổn. */
`;

const EventDetailColumn = styled.div`
  flex: 4; // Chiếm 2/3 không gian
  min-width: 0; // Cho phép flex item co lại nếu cần
`;

const StatusText = styled.p` text-align: center; padding: 2rem; color: #6b7280; `;
const ErrorText = styled(StatusText)` color: #dc2626; `;

const NoDetailSelectedText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  font-size: 1.125rem;
  color: #6b7280;
  background-color: #f9fafb;
  border: 1px dashed #e5e7eb;
  border-radius: 0.5rem;
  text-align: center;
  padding: 2rem;
`;


// --- Component con để hiển thị chi tiết sự kiện (Lấy cảm hứng từ EventDetailsPage.jsx) ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const DetailWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease-out;
`;

const DetailCoverImageContainer = styled.div`
  height: 250px;
  background-color: #e5e7eb; // Placeholder color
  display: flex; align-items: center; justify-content: center; color: #9ca3af;
  position: relative;
`;

const DetailCoverImage = styled.img`
  width: 100%; height: 100%; object-fit: cover;
`;

const DetailContentPadding = styled.div`
  padding: 1.5rem 2rem;
`;

const DetailHeaderSection = styled.div`
  display: flex;
  align-items: flex-end; // Canh logo và text theo baseline dưới
  margin-bottom: 1.5rem;
  margin-top: -4rem; // Kéo lên để logo chồng lên ảnh bìa
  position: relative;
  z-index: 1;
`;

const DetailLogoImageContainer = styled.div`
  flex-shrink: 0;
  width: 7rem; height: 7rem;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  background-color: #fff;
  overflow: hidden;
  margin-right: 1.5rem;
`;

const DetailLogoImage = styled.img`
  width: 100%; height: 100%; object-fit: contain;
`;

const DetailTitleContainer = styled.div`
  flex-grow: 1;
  padding-bottom: 0.5rem; // Nâng text lên một chút
`;

const DetailEventTitle = styled.h1`
  font-size: 1.75rem; line-height: 1.3; font-weight: 700;
  color: #1f2937; font-family: 'DM Sans', sans-serif; margin-bottom: 0.25rem;
`;

const DetailHostInfo = styled.p`
  font-size: 1rem; color: #4b5563;
  span { font-weight: 600; color: #005A9C; }
`;

const DetailSection = styled.div`
  margin-bottom: 1.5rem;
`;

const DetailSectionTitle = styled.h2`
  font-size: 1.25rem; font-weight: 600; color: #005A9C;
  margin-bottom: 0.75rem; padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const DetailText = styled.p`
  color: #374151; white-space: pre-wrap; line-height: 1.6; font-size: 0.95rem;
`;

const DetailInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const DetailInfoBlock = styled.div``;

const DetailInfoLabel = styled.h3`
  font-size: 0.8rem; font-weight: 600; color: #6b7280;
  margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.05em;
`;

const DetailInfoValue = styled.p`
  color: #1f2937; font-size: 0.95rem;
  span { font-weight: 500; }
`;

const DetailTagContainer = styled.div`
  display: flex; flex-wrap: wrap; gap: 0.5rem;
`;

const DetailTagBadge = styled.span`
  padding: 0.25rem 0.75rem; background-color: #E6F3FF; color: #003D6B;
  font-size: 0.8rem; font-weight: 500; border-radius: 1rem;
`;
const DetailActions = styled.div`
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
    text-align: right;
`;


const EventDetailDisplay = ({ event, onUnregisterRequest, currentUser }) => {
    if (!event || !event.eventId) {
        return <NoDetailSelectedText>Chọn một sự kiện từ danh sách bên trái để xem chi tiết.</NoDetailSelectedText>;
    }

    const {
        eventName,
        coverUrl,
        logoUrl,
        hostId, // Sẽ cần map sang tên thật nếu có
        startDate,
        endDate,
        location,
        attendanceType,
        capacity,
        description,
        tagsList, // Hoặc tags
    } = event;

    const displayTags = useMemo(() => {
        return Array.isArray(tagsList) ? tagsList : (Array.isArray(event.tags) ? event.tags : []);
    }, [tagsList, event.tags]);

    // Logic kiểm tra user có phải là host của sự kiện này không (nếu cần nút sửa)
    // const isHost = currentUser?.id && hostId && String(currentUser.id) === String(hostId) &&
    //                (currentUser.role === ROLES.EVENT_CREATOR || currentUser.role === ROLES.UNION);

    return (
        <DetailWrapper>
            <DetailCoverImageContainer>
                {coverUrl ? (
                    <DetailCoverImage src={coverUrl} alt={`${eventName} cover`} onError={(e) => e.target.style.display = 'none'} />
                ) : (
                    <span>Ảnh bìa sự kiện</span>
                )}
            </DetailCoverImageContainer>

            <DetailContentPadding>
                <DetailHeaderSection>
                    {logoUrl && (
                        <DetailLogoImageContainer>
                            <DetailLogoImage src={logoUrl} alt={`${eventName} logo`} onError={(e) => e.target.style.display = 'none'} />
                        </DetailLogoImageContainer>
                    )}
                    <DetailTitleContainer>
                        <DetailEventTitle>{eventName || "Tên sự kiện không xác định"}</DetailEventTitle>
                        <DetailHostInfo>Tổ chức bởi: <span>{hostId || "Không rõ"}</span></DetailHostInfo>
                    </DetailTitleContainer>
                </DetailHeaderSection>

                <DetailSection>
                    <DetailSectionTitle>Mô tả sự kiện</DetailSectionTitle>
                    <DetailText>{description || "Không có mô tả."}</DetailText>
                </DetailSection>

                <DetailSection>
                    <DetailSectionTitle>Thông tin chi tiết</DetailSectionTitle>
                    <DetailInfoGrid>
                        <DetailInfoBlock>
                            <DetailInfoLabel>Thời gian</DetailInfoLabel>
                            <DetailInfoValue><span>Bắt đầu:</span> {formatDateTime(startDate)}</DetailInfoValue>
                            {endDate && <DetailInfoValue><span>Kết thúc:</span> {formatDateTime(endDate)}</DetailInfoValue>}
                        </DetailInfoBlock>
                        <DetailInfoBlock>
                            <DetailInfoLabel>Hình thức & Địa điểm</DetailInfoLabel>
                            <DetailInfoValue>
                                {attendanceType === ATTENDANCE_TYPES.ONLINE ? 'Trực tuyến (Online)' : 'Trực tiếp (Offline)'}
                            </DetailInfoValue>
                            {location && (
                                <DetailInfoValue>
                                    <span>{attendanceType === ATTENDANCE_TYPES.ONLINE ? 'Nền tảng: ' : 'Địa điểm: '}</span>
                                    {location}
                                </DetailInfoValue>
                            )}
                        </DetailInfoBlock>
                        <DetailInfoBlock>
                            <DetailInfoLabel>Số lượng</DetailInfoLabel>
                            <DetailInfoValue>Tối đa: <span>{capacity || "Không giới hạn"} người</span></DetailInfoValue>
                        </DetailInfoBlock>
                    </DetailInfoGrid>
                </DetailSection>

                {displayTags.length > 0 && (
                    <DetailSection>
                        <DetailSectionTitle>Thể loại</DetailSectionTitle>
                        <DetailTagContainer>
                            {displayTags.map((tag, index) => (
                                <DetailTagBadge key={`${tag}-${index}`}>{tag}</DetailTagBadge>
                            ))}
                        </DetailTagContainer>
                    </DetailSection>
                )}
                 {/* Nút hủy đăng ký chỉ hiển thị cho student và nếu sự kiện này đang được xem */}
                {currentUser?.role === ROLES.STUDENT && (
                    <DetailActions>
                        <Button
                            variant="danger"
                            onClick={() => onUnregisterRequest(event.eventId)}
                            // disabled={isCurrentlyUnregistering} // Thêm state nếu cần
                        >
                            {/* {isCurrentlyUnregistering ? 'Đang hủy...' : 'Hủy đăng ký'} */}
                            Hủy đăng ký
                        </Button>
                    </DetailActions>
                )}
            </DetailContentPadding>
        </DetailWrapper>
    );
};


// --- Component chính RegisteredEventsPage ---
const RegisteredEventsPage = () => {
    const { user } = useAuth();
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hàm ánh xạ dữ liệu sự kiện (giống như trước)
    const mapEventData = (eventItem) => {
        if (!eventItem) return null;
        let correctedEndDate = eventItem.endDate;
        if (typeof eventItem.endDate === 'string' && eventItem.endDate.includes("-25T")) {
            console.warn(`Ngày kết thúc không hợp lệ: ${eventItem.endDate} cho sự kiện ${eventItem.eventName}. Sửa thành null.`);
            correctedEndDate = null;
        }
        return {
            ...eventItem,
            coverUrl: eventItem.coverUrl1 || eventItem.coverUrl,
            logoUrl: eventItem.logoUrl1 || eventItem.logoUrl,
            hostId: eventItem.hostID || eventItem.hostId,
            endDate: correctedEndDate,
        };
    };


    useEffect(() => {
        const fetchRegisteredEvents = async () => {
            if (!user?.id) {
                setError("Vui lòng đăng nhập để xem sự kiện đã đăng ký.");
                setIsLoading(false);
                setRegisteredEvents([]);
                setSelectedEvent(null);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const eventDataFromApi = await registrationService.getEventsUserRegisteredFor(user.id);
                
                if (Array.isArray(eventDataFromApi)) {
                    const mappedEvents = eventDataFromApi.map(mapEventData).filter(Boolean); // Lọc bỏ null nếu mapEventData trả về null
                    setRegisteredEvents(mappedEvents);

                    if (mappedEvents.length > 0) {
                        // Nếu chưa có sự kiện nào được chọn, hoặc sự kiện đang được chọn không còn trong danh sách mới
                        if (!selectedEvent || !mappedEvents.find(e => e.eventId === selectedEvent.eventId)) {
                           setSelectedEvent(mappedEvents[0]); // Chọn sự kiện đầu tiên
                        }
                    } else {
                        setSelectedEvent(null); // Không có sự kiện nào, không chọn gì cả
                        setError(null);
                    }
                } else {
                    console.error("API không trả về một mảng:", eventDataFromApi);
                    setError("Dữ liệu sự kiện đã đăng ký trả về không hợp lệ.");
                    setRegisteredEvents([]);
                    setSelectedEvent(null);
                }
            } catch (err) {
                console.error("Lỗi khi tải sự kiện đã đăng ký:", err);
                let errorMessage = 'Không thể tải danh sách sự kiện đã đăng ký.';
                if (err.response) {
                    if (err.response.status === 404) {
                        setError(null); 
                    } else if (err.response.data?.message) {
                        errorMessage = err.response.data.message;
                        setError(errorMessage);
                    } else {
                        setError(errorMessage);
                    }
                } else {
                    setError(err.message || errorMessage);
                }
                setRegisteredEvents([]);
                setSelectedEvent(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (user && user.id) {
            fetchRegisteredEvents();
        } else if (user === null) { // User đã load xong, nhưng không đăng nhập
            setError("Vui lòng đăng nhập để xem sự kiện đã đăng ký.");
            setIsLoading(false);
            setRegisteredEvents([]);
            setSelectedEvent(null);
        } else { // user là undefined (đang trong quá trình useAuth xác thực)
            setIsLoading(true); // Tiếp tục loading
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]); // Chỉ fetch lại khi user thay đổi

    const handleUnregister = async (eventIdToUnregister) => {
        alert("Chức năng hủy đăng ký cần được cập nhật ở backend để cung cấp registrationId, hoặc cho phép hủy bằng userId và eventId.");
        console.error("Không thể hủy đăng ký: registrationId không được cung cấp bởi API getEventsUserRegisteredFor cho eventId:", eventIdToUnregister);
        
        // Nếu chức năng hủy đăng ký hoạt động và thành công:
        // 1. Gọi API hủy đăng ký
        // 2. Cập nhật lại state `registeredEvents`
        // const updatedEvents = registeredEvents.filter(event => event.eventId !== eventIdToUnregister);
        // setRegisteredEvents(updatedEvents);
        // 3. Cập nhật `selectedEvent`:
        // if (selectedEvent?.eventId === eventIdToUnregister) {
        //     setSelectedEvent(updatedEvents.length > 0 ? updatedEvents[0] : null);
        // }
    };

    const handleCardClick = (eventItem) => {
        setSelectedEvent(eventItem); // eventItem đã được map khi setRegisteredEvents
    };

    return (
        <PageWrapper>
            <MainTitle>Sự kiện đã đăng ký ({registeredEvents.length})</MainTitle>

            {isLoading && <StatusText>Đang tải danh sách...</StatusText>}
            {error && !isLoading && registeredEvents.length === 0 && <ErrorText>{error}</ErrorText>}

            {!isLoading && !error && registeredEvents.length === 0 && (
                 <StatusText>
                    {user?.id ? "Bạn chưa đăng ký tham gia sự kiện nào." : "Vui lòng đăng nhập để xem."}
                </StatusText>
            )}

            {!isLoading && (registeredEvents.length > 0 || error) && ( // Hiển thị layout nếu có sự kiện hoặc có lỗi nhưng vẫn muốn giữ layout
                <TwoColumnLayout>
                    <EventListColumn>
                        {registeredEvents.length > 0 ? registeredEvents.map((eventItem) => (
                            <div
                                key={eventItem.eventId}
                                className={`event-list-item ${selectedEvent?.eventId === eventItem.eventId ? 'selected-event-card' : ''}`}
                                onClick={() => handleCardClick(eventItem)}
                            >
                                <EventCard
                                    event={eventItem}
                                    isRegisteredView={true} // EventCard có thể tự xử lý nút hủy dựa trên prop này
                                                            // nhưng onUnregister của nó sẽ gọi handleUnregister của trang này
                                    onUnregister={handleUnregister} // Vẫn truyền xuống, EventCard sẽ gọi với eventId
                                />
                            </div>
                        )) : (
                            !error && <StatusText>Không có sự kiện nào để hiển thị trong danh sách.</StatusText>
                        )}
                         {error && registeredEvents.length === 0 && <ErrorText>{error}</ErrorText>}
                    </EventListColumn>

                    <EventDetailColumn>
                        {selectedEvent ? (
                            <EventDetailDisplay
                                event={selectedEvent}
                                onUnregisterRequest={handleUnregister} // Truyền hàm chính xuống
                                currentUser={user}
                            />
                        ) : (
                            !error && registeredEvents.length > 0 && <NoDetailSelectedText>Chọn một sự kiện từ danh sách bên trái để xem chi tiết.</NoDetailSelectedText>
                        )}
                    </EventDetailColumn>
                </TwoColumnLayout>
            )}
        </PageWrapper>
    );
};

export default RegisteredEventsPage;