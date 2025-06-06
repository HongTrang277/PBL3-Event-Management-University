import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { attendanceService, registrationService } from '../services/api';
import { FaMapMarkerAlt, FaClock, FaCheckCircle, FaArrowLeft, FaTimes } from "react-icons/fa";
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
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 1.5rem;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  text-align: center;
  position: relative;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const SuccessModal = styled(ModalContent)`
  border-top: 6px solid #22c55e;
`;

const ErrorModal = styled(ModalContent)`
  border-top: 6px solid #ef4444;
`;

const ModalTitle = styled.h3`
  font-size: 1.7rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${props => props.$isSuccess ? '#22c55e' : '#ef4444'};
`;

const ModalText = styled.p`
  font-size: 1.1rem;
  line-height: 1.5;
  color: #4b5563;
  margin-bottom: 1.5rem;
`;

const ModalIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: ${props => props.$isSuccess ? '#22c55e' : '#ef4444'};
  display: flex;
  justify-content: center;
`;

const ModalButton = styled.button`
  background: ${props => props.$isSuccess ? 
    'linear-gradient(90deg, #15803d 0%, #22c55e 100%)' : 
    'linear-gradient(90deg, #b91c1c 0%, #ef4444 100%)'};
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
  
  &:hover {
    color: #4b5563;
  }
`;// Thêm các state này vào component AttendancePage


// --- Component ---
const AttendancePage = () => {
  const { user} = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAttended, setIsAttended] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  // Cập nhật thời gian hiện tại mỗi giây khi đang ở trang chi tiết
  
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
            const startDate = new Date(event.startDate || event.start_date);
            const endDate = new Date(event.endDate || event.end_date);
            return currentDate >= startDate && currentDate <= endDate;
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

  // Cập nhật hàm handleAttendance để hiển thị modal
const handleAttendance = async () => {
  if (!user?.id) {
    setModalMessage('Bạn cần đăng nhập để điểm danh.');
    setShowErrorModal(true);
    return;
  }
  
  if (!selectedEvent?.eventId) {
    setModalMessage('Không có thông tin sự kiện để điểm danh.');
    setShowErrorModal(true);
    return;
  }
  
  if (!navigator.geolocation) {
    setModalMessage('Trình duyệt của bạn không hỗ trợ GPS. Vui lòng sử dụng trình duyệt khác.');
    setShowErrorModal(true);
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
            setModalMessage('Bạn chưa đăng ký sự kiện này hoặc không tìm thấy thông tin đăng ký.');
            setShowErrorModal(true);
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
          
          // Hiển thị modal thành công thay vì toast
          setModalMessage(`Điểm danh thành công cho sự kiện "${selectedEvent.eventName}"!`);
          setShowSuccessModal(true);
          setIsAttended(true);
        } catch (err) {
          console.error('Lỗi khi điểm danh:', err);
          
          // Đóng toast loading
          toast.dismiss(loadingToast);
          
          // Chuẩn bị thông báo lỗi
          let errorMessage = 'Điểm danh thất bại.';
          if (err.message && err.message.includes("không ở trong khu vực")) {
            errorMessage = `Bạn không ở trong khu vực tổ chức sự kiện. Vui lòng đến đúng địa điểm sự kiện để điểm danh.`;
          } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err.message) {
            errorMessage = err.message;
          }
          
          // Hiển thị modal lỗi
          setModalMessage(errorMessage);
          setShowErrorModal(true);
        }
      },
      (geoError) => {
        console.error('Lỗi GPS:', geoError);
        
        // Đóng toast loading
        toast.dismiss(loadingToast);
        
        // Chuẩn bị thông báo lỗi GPS
        let errorMessage = 'Không thể lấy tọa độ GPS. Vui lòng thử lại.';
        switch(geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage = 'Bạn đã từ chối quyền truy cập vị trí. Vui lòng cho phép trình duyệt sử dụng GPS để điểm danh.';
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorMessage = 'Không thể xác định vị trí của bạn. Vui lòng kiểm tra kết nối GPS và thử lại.';
            break;
          case geoError.TIMEOUT:
            errorMessage = 'Quá thời gian chờ lấy vị trí GPS. Vui lòng thử lại.';
            break;
        }
        
        // Hiển thị modal lỗi
        setModalMessage(errorMessage);
        setShowErrorModal(true);
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
    setModalMessage('Có lỗi xảy ra khi thực hiện điểm danh. Vui lòng thử lại.');
    setShowErrorModal(true);
  }
};
  // Add the missing modal components
  const AttendanceSuccessModal = () => {
    if (!showSuccessModal) return null;
    
    return (
      <ModalOverlay>
        <SuccessModal>
          <ModalCloseButton onClick={() => setShowSuccessModal(false)}>
            <FaTimes />
          </ModalCloseButton>
          
          <ModalIcon $isSuccess>
            <FaCheckCircle />
          </ModalIcon>
          
          <ModalTitle $isSuccess>Thành công!</ModalTitle>
          <ModalText>{modalMessage}</ModalText>
          
          <ModalButton 
            $isSuccess 
            onClick={() => setShowSuccessModal(false)}
          >
            Đã hiểu
          </ModalButton>
        </SuccessModal>
      </ModalOverlay>
    );
  };
  
  const AttendanceErrorModal = () => {
    if (!showErrorModal) return null;
    
    return (
      <ModalOverlay>
        <ErrorModal>
          <ModalCloseButton onClick={() => setShowErrorModal(false)}>
            <FaTimes />
          </ModalCloseButton>
          
          <ModalIcon>
            <FaTimes />
          </ModalIcon>
          
          <ModalTitle>Lỗi</ModalTitle>
          <ModalText>{modalMessage}</ModalText>
          
          <ModalButton 
            onClick={() => setShowErrorModal(false)}
          >
            Đóng
          </ModalButton>
        </ErrorModal>
      </ModalOverlay>
    );
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
       <AttendanceSuccessModal />
    <AttendanceErrorModal />
    <ToastContainer position="top-right" autoClose={5000} />
    </PageWrapper>
  );
};

export default AttendancePage;