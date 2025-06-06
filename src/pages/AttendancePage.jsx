import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { attendanceService, registrationService } from '../services/api';
import { FaMapMarkerAlt, FaClock, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Styled Components ---
const PageWrapper = styled.div`
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f0f9ff;
`;

const Title = styled.h1`
  font-size: 2.3rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: #0284c7;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: -1px;
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
`;

const EventCard = styled.div`
  background: #fff;
  border-radius: 1.25rem;
  box-shadow: 0 4px 24px 0 #bae6fd55;
  padding: 2rem 1.5rem;
  cursor: pointer;
  border: 2px solid #e0f2fe;
  transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;

  &:hover {
    transform: translateY(-6px) scale(1.04);
    box-shadow: 0 8px 32px 0 #38bdf855;
    border-color: #38bdf8;
    background: #e0f2fe;
  }
`;

const EventTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0284c7;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EventDescription = styled.p`
  font-size: 1rem;
  color: #0369a1;
  margin-bottom: 0.5rem;
`;

const DetailWrapper = styled.div`
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px 0 #bae6fd77;
  padding: 2.5rem 2rem;
  margin-top: 2rem;
  border: 2px solid #38bdf8;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: flex-start;
`;

const DetailTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #0369a1;
  margin-bottom: 1.2rem;
  letter-spacing: -1px;
  background: #e0f2fe;
  border-radius: 0.7rem;
  padding: 0.7rem 1.2rem;
  display: inline-block;
`;

const HighlightField = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  background: #e0f2fe;
  color: #0284c7;
  border-left: 6px solid #38bdf8;
  border-radius: 0.75rem;
  padding: 0.7rem 1.2rem;
  font-weight: 600;
  font-size: 1.08rem;
  margin-bottom: 0.3rem;
`;

const AttendanceButton = styled.button`
  background: linear-gradient(90deg, #0284c7 0%, #38bdf8 100%);
  color: #fff;
  padding: 0.85rem 2.2rem;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  margin-top: 1.2rem;
  margin-right: 1rem;
  box-shadow: 0 4px 16px 0 #38bdf833;
  transition: background 0.18s, transform 0.18s;

  &:hover {
    background: linear-gradient(90deg, #38bdf8 0%, #0284c7 100%);
    transform: scale(1.04);
  }
`;

const BackButton = styled(AttendanceButton)`
  background: linear-gradient(90deg, #0e7490 0%, #bae6fd 100%);
  color: #fff;
  margin-top: 1.2rem;
  margin-right: 0;
  &:hover {
    background: linear-gradient(90deg, #bae6fd 0%, #0e7490 100%);
    color: #0369a1;
  }
`;

const StatusText = styled.p`
  text-align: center;
  padding: 2.5rem;
  color: #0284c7;
  font-size: 1.2rem;
  font-weight: 500;
`;

const ErrorText = styled(StatusText)`
  color: #dc2626;
  background: #fee2e2;
  border-radius: 1rem;
`;

const CurrentTime = styled.div`
  font-size: 1.08rem;
  color: #0e7490;
  background: #e0f2fe;
  border-radius: 0.7rem;
  padding: 0.5rem 1.1rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.7rem;
`;

// --- Component ---

const AttendancePage = () => {
  const { user} = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAttended, setIsAttended] = useState(false);
  // Cập nhật thời gian hiện tại mỗi giây khi đang ở trang chi tiết
  const parseAssumingUtc = (apiDateString) => {
  if (!apiDateString) {
    return null; // Trả về null nếu chuỗi rỗng/không có
  }
  // Kiểm tra xem chuỗi đã có 'Z' hoặc offset (+HH:MM, -HH:MM) chưa
  if (apiDateString.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(apiDateString)) {
    // Nếu đã có, dùng luôn
    return new Date(apiDateString);
  } else {
    // Nếu không có, thêm 'Z' để new Date() hiểu là UTC
    return new Date(apiDateString + 'Z');
  }
};
  
  const parseApiUtcDateString = (dateString) => {
  if (!dateString) {
    // Nếu chuỗi rỗng hoặc null, trả về null để báo hiệu ngày không hợp lệ
    // Hoặc bạn có thể trả về new Date(NaN) tùy cách bạn muốn xử lý lỗi
    return null;
  }

  // Kiểm tra xem chuỗi đã có thông tin múi giờ chưa
  // Regex này kiểm tra chữ 'Z' ở cuối hoặc offset dạng +HH:MM hoặc -HH:MM
  if (/Z|[+-]\d{2}:\d{2}$/.test(dateString)) {
    // Nếu đã có, dùng luôn chuỗi đó
    return new Date(dateString);
  } else {
    // Nếu không có, giả định là UTC và thêm 'Z' vào cuối
    return new Date(dateString + 'Z');
  }
};
useEffect(() => {
  // Check if user has already marked attendance when event changes
  const checkAttendanceStatus = async () => {
    if (!selectedEvent || !user?.id) return;
    
    try {
      // Lấy registrationId
      const registrations = await registrationService.getAllRegistrations();
      const registration = registrations.find(r => 
        String(r.eventId) === String(selectedEvent.eventId) && 
        String(r.userId) === String(user.id)
      );
      
      if (!registration?.registrationId) return;
      console.log('Đã tìm thấy thông tin đăng ký:', registration);
      // Kiểm tra attendance
      const attendance = await attendanceService.getAttendanceByRegistrationId(registration.registrationId);
      console.log('Trạng thái điểm danh:', attendance);
      setIsAttended(!!attendance);
    } catch (err) {
      console.error("Lỗi khi kiểm tra trạng thái điểm danh:", err);
      // Nếu lỗi 404, có nghĩa là chưa điểm danh
      if (err.response?.status === 500 || err.response?.status === 404) {
        setIsAttended(false);
      }
    }
  };
  
  checkAttendanceStatus();
}, [selectedEvent, user]);

  useEffect(() => {
    if (!selectedEvent) return;
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [selectedEvent]);

  const mapEventData = (eventItem) => {
    if (!eventItem) return null;
    let correctedEndDate = eventItem.endDate;
    if (typeof eventItem.endDate === 'string' && eventItem.endDate.includes("-25T")) {
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
          const mappedEvents = eventDataFromApi.map(mapEventData).filter(Boolean);
          const currentDate = new Date();
          const filteredEvents = mappedEvents.filter(event => {
  const rawApiStartDate = event.startDate || event.start_date;
  const rawApiEndDate = event.endDate || event.end_date;

  // Sử dụng hàm mới để tạo đối tượng Date, giả định là UTC
  const startDate = parseAssumingUtc(rawApiStartDate);
  const endDate = parseAssumingUtc(rawApiEndDate);

  // Kiểm tra ngày có hợp lệ không (rất quan trọng)
  if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.warn(`Sự kiện "${event.eventName}" có ngày giờ không hợp lệ từ API:`, { rawApiStartDate, rawApiEndDate });
    return false; // Bỏ qua sự kiện này
  }

  const currentDate = new Date(); // Thời gian hiện tại của client

  // Phần còn lại của logic so sánh và console.log giữ nguyên hoặc tùy chỉnh nếu cần
   console.log(`--- Filtering Event: ${event.eventName} ---`);
   console.log(`Raw API: start='<span class="math-inline">\{rawApiStartDate\}', end\='</span>{rawApiEndDate}' (FE diễn giải là UTC)`);
   console.log(`Current Time (Client Local): ${currentDate.toString()}`);
   console.log(`Current Time (Client UTC): ${currentDate.toISOString()}`);
   console.log(`Event Start (Interpreted UTC): ${startDate.toISOString()}`);
   console.log(`Event End (Interpreted UTC): ${endDate.toISOString()}`);

  const isHappening = currentDate >= startDate && currentDate <= endDate;
  console.log(`Is Happening? ${isHappening}`);

  return isHappening;
});
          setRegisteredEvents(filteredEvents);

          if (mappedEvents.length > 0) {
            if (!selectedEvent || !mappedEvents.find(e => e.eventId === selectedEvent.eventId)) {
              setSelectedEvent(mappedEvents[0]);
            }
          } else {
            setSelectedEvent(null);
            setError(null);
          }
        } else {
          setError("Dữ liệu sự kiện đã đăng ký trả về không hợp lệ.");
          setRegisteredEvents([]);
          setSelectedEvent(null);
        }
      } catch (err) {
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
    } else if (user === null) {
      setError("Vui lòng đăng nhập để xem sự kiện đã đăng ký.");
      setIsLoading(false);
      setRegisteredEvents([]);
      setSelectedEvent(null);
    } else {
      setIsLoading(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAttendance = async () => {
  if (!user?.id) {
    toast.error('Bạn cần đăng nhập để điểm danh.');
    return;
  }
  
  if (!selectedEvent?.eventId) {
    toast.error('Không có thông tin sự kiện để điểm danh.');
    return;
  }
  
  if (!navigator.geolocation) {
    toast.error('Trình duyệt của bạn không hỗ trợ GPS.');
    return;
  }
  
  try {
    // Hiện thông báo đang lấy vị trí
    const loadingToast = toast.loading('Đang xác định vị trí của bạn...');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Lấy tọa độ thực tế từ GPS
         const latitude = parseFloat(position.coords.latitude);
         const longitude = parseFloat(position.coords.longitude);
        //convert latitude and longitude to double;
        

        try {
          // Tìm registrationId theo eventId và userId
          console.log('Đang tìm thông tin đăng ký cho:', { 
            userId: user.id, 
            eventId: selectedEvent.eventId 
          });
          
          const registrations = await registrationService.getAllRegistrations();
          console.log('Danh sách đăng ký:', registrations);
          
          const registration = registrations.find(r => 
            String(r.eventId) === String(selectedEvent.eventId) && 
            String(r.userId) === String(user.id)
          );
          
          const registrationId = registration?.registrationId;
          console.log('Đăng ký tìm thấy:', registration);
          
          if (!registrationId) {
            // Đóng toast loading
            toast.dismiss(loadingToast);
            toast.error('Bạn chưa đăng ký sự kiện này hoặc không tìm thấy thông tin đăng ký.');
            return;
          }
          
          // Gọi API điểm danh với registrationId và tọa độ
          console.log('Gửi yêu cầu điểm danh với:', {
            registrationId,
            latitude,
            longitude
          });
          
          const result = await attendanceService.markAttendance({
            registrationId,
            latitude,
            longitude
          });
          
          console.log('Kết quả điểm danh:', result);
          
          // Đóng toast loading và hiển thị thông báo thành công
          toast.dismiss(loadingToast);
          toast.success('Điểm danh thành công!');
          setIsAttended(true);
        } catch (err) {
          console.error('Lỗi khi điểm danh:', err);
          
          // Đóng toast loading
          toast.dismiss(loadingToast);
          
          // Hiển thị thông báo lỗi
          let errorMessage = 'Điểm danh thất bại.';
          if (err.message && err.message.includes("không ở trong khu vực")) {
            errorMessage = err.message;
          } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err.message) {
            errorMessage = err.message;
          }
          toast.error(errorMessage);
        }
      },
      (geoError) => {
        console.error('Lỗi GPS:', geoError);
        
        // Đóng toast loading
        toast.dismiss(loadingToast);
        
        // Hiển thị lỗi phù hợp với từng trường hợp
        switch(geoError.code) {
          case geoError.PERMISSION_DENIED:
            toast.error('Bạn đã từ chối quyền truy cập vị trí. Vui lòng cho phép trình duyệt sử dụng GPS để điểm danh.');
            break;
          case geoError.POSITION_UNAVAILABLE:
            toast.error('Không thể xác định vị trí của bạn. Vui lòng kiểm tra kết nối GPS và thử lại.');
            break;
          case geoError.TIMEOUT:
            toast.error('Quá thời gian chờ lấy vị trí GPS. Vui lòng thử lại.');
            break;
          default:
            toast.error('Không thể lấy tọa độ GPS. Vui lòng thử lại.');
        }
      },
      // Cấu hình bổ sung cho navigator.geolocation
      {
        enableHighAccuracy: true, // Độ chính xác cao
        timeout: 15000, // Tăng thời gian lên 15 giây để đảm bảo lấy được vị trí
        maximumAge: 0 // Không sử dụng dữ liệu cache
      }
    );
  } catch (err) {
    console.error('Lỗi khi xử lý điểm danh:', err);
    toast.error('Có lỗi xảy ra khi thực hiện điểm danh. Vui lòng thử lại.');
  }
};

  // --- UI ---
  return (
    <PageWrapper>
      <Title>
        <FaCheckCircle style={{ color: "#0284c7", marginRight: "0.5rem" }} />
        Sự kiện đã đăng ký
      </Title>

      {isLoading && <StatusText>Đang tải danh sách sự kiện...</StatusText>}
      {error && <ErrorText>Lỗi: {error}</ErrorText>}
      {!isLoading && !error && (
        <>
          {registeredEvents.length === 0 ? (
            <StatusText>Bạn chưa đăng ký sự kiện nào.</StatusText>
          ) : selectedEvent ? (
            <DetailWrapper>
              <CurrentTime>
                <FaClock style={{ marginRight: 8 }} />
                Thời gian hiện tại: {currentTime.toLocaleString()}
              </CurrentTime>
              <DetailTitle>{selectedEvent.eventName}</DetailTitle>
              <HighlightField>
                <FaCheckCircle style={{ color: "#38bdf8" }} />
                {selectedEvent.description}
              </HighlightField>
              <HighlightField>
                <FaClock style={{ color: "#0284c7" }} />
                <strong>Thời gian:</strong> {new Date(selectedEvent.startDate || selectedEvent.start_date).toLocaleString()}
                {selectedEvent.endDate && ` - ${new Date(selectedEvent.endDate).toLocaleString()}`}
              </HighlightField>
              <HighlightField>
                <FaMapMarkerAlt style={{ color: "#0ea5e9" }} />
                <strong>Địa điểm:</strong> {selectedEvent.location}
              </HighlightField>
              <HighlightField>
                <strong>Trạng thái:</strong> {selectedEvent.status || "Đã đăng ký"}
              </HighlightField>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <AttendanceButton 
  onClick={handleAttendance}
  disabled={isAttended}
  style={isAttended ? { 
    background: '#22c55e', 
    cursor: 'default',
    opacity: 0.9 
  } : {}}
>
  <FaCheckCircle style={{ marginRight: "0.5rem" }} />
  {isAttended ? 'Đã điểm danh' : 'Điểm danh'}
</AttendanceButton>
                <BackButton onClick={() => setSelectedEvent(null)}>
                  <FaArrowLeft style={{ marginRight: "0.5rem" }} />
                  Quay lại danh sách
                </BackButton>
              </div>
            </DetailWrapper>
          ) : (
            <EventGrid>
              {registeredEvents.map((event) => (
                <EventCard key={event.eventId} onClick={() => setSelectedEvent(event)}>
                  <EventTitle>
                    <FaCheckCircle style={{ color: "#0284c7" }} />
                    {event.eventName}
                  </EventTitle>
                  <EventDescription>
                    <FaClock style={{ color: "#0ea5e9" }} /> {new Date(event.startDate || event.start_date).toLocaleDateString()}
                  </EventDescription>
                  <EventDescription>
                    <FaCheckCircle style={{ color: "#22c55e" }} /> Trạng thái: {event.status || "Đã đăng ký"}
                  </EventDescription>
                </EventCard>
              ))}
            </EventGrid>
          )}
        </>
      )}
    </PageWrapper>
  );
};

export default AttendancePage;