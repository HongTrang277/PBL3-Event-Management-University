import React, { useEffect, useState } from 'react';
import { registrationService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaQrcode } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';

const UserQRPage = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRegistrations = async () => {
      if (!user || !user.id) {
        setError('Bạn cần đăng nhập để xem mã QR.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await registrationService.getEventsUserRegisteredFor(user.id);
        const responseRegistrationId = await registrationService.getUserRegistrations(user.id);
        
        if (!Array.isArray(response)) {
          throw new Error('Invalid response format');
        }

        const mergedResponse = response.map(event => {
          const registration = Array.isArray(responseRegistrationId) ? 
            responseRegistrationId.find(reg => reg.eventId === event.eventId) : null;
            
          return {
            ...event,
            registrationId: registration ? registration.registrationId : `reg-${event.eventId}-${user.id}`
          };
        });

        if (mergedResponse && Array.isArray(mergedResponse) && mergedResponse.length > 0) {
          const registrationsData = mergedResponse.map(event => ({
            registrationId: event.registrationId || `reg-${event.eventId}-${user.id}`,
            eventId: event.eventId,
            eventName: event.eventName || event.name,
            eventDate: event.startDate || event.start_date,
            location: event.location || "Không có thông tin",
          }));
          
          setRegistrations(registrationsData);
          setSelectedEvent(registrationsData[0]);
        } else {
          setError('Bạn chưa đăng ký sự kiện nào.');
        }
      } catch (err) {
        console.error('Error fetching registrations:', err);
        setError('Không thể tải thông tin đăng ký. Vui lòng thử lại sau.');
        
        if (process.env.NODE_ENV !== 'production') {
          const sampleData = [
            {
              registrationId: "sample-reg-123",
              eventId: "event1",
              eventName: "Hội thảo Công nghệ Blockchain",
              eventDate: new Date().toISOString(),
              location: "Hội trường A - Đại học ABC",
            },
            {
              registrationId: "sample-reg-456",
              eventId: "event2",
              eventName: "Workshop Trí tuệ Nhân tạo",
              eventDate: new Date(Date.now() + 86400000).toISOString(),
              location: "Phòng Lab B - Tòa nhà Innovation",
            }
          ];
          setRegistrations(sampleData);
          setSelectedEvent(sampleData[0]);
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserRegistrations();
  }, [user]);

  // Format date to display in Vietnamese format
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Ngày không hợp lệ";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-lg border border-red-200 p-4 text-center">
            <div className="text-red-500 text-lg mb-2">
              <FaQrcode className="inline-block mr-2" />
              <span className="font-medium">Không thể hiển thị QR code</span>
            </div>
            <p className="text-red-600">{error}</p>
            <a href="/events" className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              Khám phá sự kiện
            </a>
          </div>
        ) : (
          <motion.div 
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {registrations.length > 0 && (
              <div className="p-4 border-b">
                <select 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                  onChange={(e) => {
                    const event = registrations.find(r => r.registrationId === e.target.value);
                    setSelectedEvent(event);
                  }}
                  value={selectedEvent?.registrationId || ''}
                >
                  {registrations.map(reg => (
                    <option key={reg.registrationId} value={reg.registrationId}>
                      {reg.eventName} - {new Date(reg.eventDate).toLocaleDateString('vi-VN')}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {selectedEvent && (
              <div className="p-6 flex flex-col items-center">
                {/* Tiêu đề sự kiện */}
                <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
                  {selectedEvent.eventName}
                </h2>
                
                {/* Thông tin cơ bản */}
                <div className="w-full flex flex-col gap-1 mb-6">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <FaCalendarAlt className="mr-1 text-blue-500" />
                    <span>{formatDate(selectedEvent.eventDate)}</span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <FaMapMarkerAlt className="mr-1 text-blue-500" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
                
                {/* Mã QR ở chính giữa */}
                <div className="w-full flex justify-center">
                  <div className="border-4 border-blue-500 rounded-xl p-4 mb-4">
                    <QRCodeCanvas 
                      value={selectedEvent.registrationId || ''}
                      size={Math.min(250, window.innerWidth * 0.6)} // Responsive size
                      level="H"
                      includeMargin={true}
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                    />
                  </div>
                </div>
                
                {/* ID đăng ký */}
                <div className="bg-blue-50 rounded-full py-1 px-4 mb-3">
                  <p className="text-center text-xs font-mono text-gray-700">
                    {selectedEvent.registrationId || 'N/A'}
                  </p>
                </div>
                
                <p className="text-center text-xs text-gray-500 max-w-xs">
                  Xuất trình mã QR này với ban tổ chức để điểm danh tham gia sự kiện
                </p>
              </div>
            )}
            
            <div className="bg-gray-50 p-3 text-center text-xs text-gray-500 border-t">
              © {new Date().getFullYear()} Hệ thống Quản lý Sự kiện
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserQRPage;