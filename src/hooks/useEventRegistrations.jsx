// src/hooks/useEventRegistration.js
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { registrationService } from '../services/api';
import { useAuth } from './useAuth';
import { ROLES } from '../utils/constants';
// Giả sử bạn có một hệ thống toast notification
// import { toast } from 'react-toastify'; 

export const useEventRegistration = (eventId, onRegistrationSuccess) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [registrationMessage, setRegistrationMessage] = useState('');
    const [registrationError, setRegistrationError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, userRoles } = useAuth();
    
    const handleRegister = async () => {
        if (!isAuthenticated) {
            // toast.info("Vui lòng đăng nhập để đăng ký sự kiện.");
            alert("Vui lòng đăng nhập để đăng ký sự kiện.");
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        if (!userRoles.includes(ROLES.STUDENT)) {
            setRegistrationError("Chỉ sinh viên mới có thể đăng ký sự kiện.");
            // toast.error("Chỉ tài khoản sinh viên mới có thể đăng ký.");
            alert("Chỉ tài khoản sinh viên mới có thể đăng ký.");
            return;
        }
        
        // ... (thêm các validation khác như kiểm tra profile)

        setIsRegistering(true);
        setRegistrationMessage('');
        setRegistrationError('');

        try {
            const responseData = await registrationService.registerUserForEvent(user.id, eventId);
            if (responseData && responseData.registrationId) {
                setRegistrationMessage("Đăng ký thành công! Bạn đã được thêm vào danh sách tham gia.");
                onRegistrationSuccess(); // Gọi callback để cập nhật state ở component cha
            } else {
                setRegistrationError(responseData?.message || "Đăng ký không thành công.");
            }
        } catch (err) {
            setRegistrationError(err.response?.data?.message || err.message || "Đăng ký thất bại.");
        } finally {
            setIsRegistering(false);
        }
    };

    return { 
        handleRegister, 
        isRegistering, 
        registrationMessage, 
        registrationError,
        setRegistrationMessage, // Thêm các setter để xử lý state từ location
        setRegistrationError
    };
};