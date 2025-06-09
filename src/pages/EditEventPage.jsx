// src/pages/EditEventPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import Button from '../components/common/Button/Button';
import { eventService, uploadService, badgeService } from '../services/api';
import { ATTENDANCE_TYPES, TAGS, ROLES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input/Input';
import { convertApiDateTimeToDaNangInputString } from '../utils/helpers';
import LocationPicker from '../components/common/Input/LocationPicker';
// SỬ DỤNG HELPER MỚI


// --- Theme, GlobalStyle, Styled Components (GIỮ NGUYÊN NHƯ FILE CỦA BẠN) ---
const theme = {
  colors: {
    primary: '#4A5568', primaryLight: '#718096', accent: '#3182CE',
    accentLight: '#63B3ED', background: '#F7FAFC', surface: '#FFFFFF',
    text: '#2D3748', textSecondary: '#4A5568', textLight: '#A0AEC0',
    border: '#E2E8F0', error: '#C53030', errorLight: '#FED7D7',
    success: '#2F855A', successLight: '#C6F6D5',
  },
  fonts: { main: "'DM Sans', sans-serif" },
  borderRadius: '0.5rem',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
  inputHeight: '2.75rem',
};
const GlobalStyle = createGlobalStyle` body { background-color: ${({ theme }) => theme.colors.background}; font-family: ${({ theme }) => theme.fonts.main}; color: ${({ theme }) => theme.colors.text}; line-height: 1.6; } `;
const PageWrapper = styled.div` width: 100%; margin-left: auto; margin-right: auto; padding: 1.5rem; display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; @media (min-width: 768px) { padding: 2rem; } `;
const FormCard = styled.div` background-color: ${({ theme }) => theme.colors.surface}; border-radius: ${({ theme }) => theme.borderRadius}; box-shadow: ${({ theme }) => theme.boxShadow}; padding: 2rem; width: 100%; max-width: 800px; @media (min-width: 768px) { padding: 2.5rem; } @media (min-width: 1024px) { padding: 3rem; } `;
const Title = styled.h1` font-size: 1.75rem; font-weight: 700; margin-bottom: 2.5rem; font-family: ${({ theme }) => theme.fonts.main}; color: ${({ theme }) => theme.colors.text}; text-align: center; @media (min-width: 768px) { font-size: 2rem; } `;
const StyledForm = styled.form` & > *:not(:last-child) { margin-bottom: 1.75rem; } `;
const ErrorMessage = styled.div` background-color: ${props => props.success ? props.theme.colors.successLight : props.theme.colors.errorLight}; border-left: 4px solid ${props => props.success ? props.theme.colors.success : props.theme.colors.error}; color: ${props => props.success ? props.theme.colors.success : props.theme.colors.error}; padding: 1rem; margin-bottom: 1.75rem; border-radius: ${({ theme }) => theme.borderRadius}; font-size: 0.9rem; p { margin: 0; line-height: 1.5; } p:first-child { font-weight: 600; } `;
const FormGroup = styled.div``;
const StyledLabel = styled.label` display: block; font-size: 0.875rem; font-weight: 600; color: ${({ theme }) => theme.colors.textSecondary}; margin-bottom: 0.625rem; `;
const RequiredAsterisk = styled.span` color: ${({ theme }) => theme.colors.error}; margin-left: 0.25rem; `;
const StyledTextarea = styled.textarea` width: 100%; padding: 0.75rem 0.875rem; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.borderRadius}; box-shadow: ${({ theme }) => theme.boxShadow}; font-size: 0.9375rem; color: ${({ theme }) => theme.colors.text}; background-color: ${({ theme }) => theme.colors.surface}; transition: border-color 0.2s ease, box-shadow 0.2s ease; &:focus { outline: none; border-color: ${({ theme }) => theme.colors.accent}; box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accent}33; } &::placeholder { color: ${({ theme }) => theme.colors.textLight}; opacity: 1; } min-height: 120px; line-height: 1.5; `;
const GridContainer = styled.div` display: grid; grid-template-columns: 1fr; gap: 1.75rem; @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); } `;
const PreviewContainer = styled.div` display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1rem; padding: 1rem; background-color: ${({ theme }) => theme.colors.background}; border-radius: ${({ theme }) => theme.borderRadius}; `;
const ImagePreviewWrapper = styled.div` display: flex; flex-direction: column; align-items: center; gap: 0.5rem; `;
const PreviewImageBase = styled.img` border: 2px dashed ${({ theme }) => theme.colors.border}; border-radius: calc(${({ theme }) => theme.borderRadius} / 2); padding: 0.25rem; background-color: ${({ theme }) => theme.colors.surface}; `;
const PreviewImage = styled(PreviewImageBase)` height: 5.5rem; width: 5.5rem; object-fit: contain; `;
const PreviewImageCover = styled(PreviewImageBase)` height: 7rem; width: auto; max-width: 14rem; object-fit: cover; `;
const ImagePlaceholderText = styled.span` font-size: 0.8rem; color: ${({ theme }) => theme.colors.textLight}; `;
const RadioGroup = styled.div` display: flex; align-items: center; gap: 1.5rem; margin-top: 0.5rem; `;
const RadioLabel = styled.label` display: inline-flex; align-items: center; cursor: pointer; font-size: 0.9375rem; color: ${({ theme }) => theme.colors.textSecondary}; input[type="radio"] { appearance: none; border-radius: 50%; width: 1.125em; height: 1.125em; border: 2px solid ${({ theme }) => theme.colors.border}; transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out; position: relative; margin-right: 0.625rem; &:checked { border-color: ${({ theme }) => theme.colors.accent}; background-color: ${({ theme }) => theme.colors.accent}; } &:checked::after { content: ''; display: block; width: 0.5em; height: 0.5em; border-radius: 50%; background: ${({ theme }) => theme.colors.surface}; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); } &:focus { outline: none; box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accent}33; } } `;
const TagGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.75rem; @media (min-width: 640px) { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); } `;
const TagLabel = styled.label` display: inline-flex; align-items: center; background-color: ${({ theme }) => theme.colors.surface}; padding: 0.5rem 0.875rem; border-radius: 1.25rem; font-size: 0.8125rem; font-weight: 500; color: ${({ theme }) => theme.colors.textSecondary}; cursor: pointer; transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; border: 1px solid ${({ theme }) => theme.colors.border}; box-shadow: 0 1px 2px rgba(0,0,0,0.03); &:hover { border-color: ${({ theme }) => theme.colors.accentLight}; color: ${({ theme }) => theme.colors.accent}; } input[type="checkbox"] { appearance: none; border-radius: 0.25rem; width: 1em; height: 1em; border: 1.5px solid ${({ theme }) => theme.colors.textLight}; margin-right: 0.625rem; position: relative; cursor: pointer; background-color: ${({ theme }) => theme.colors.surface}; transition: all 0.2s ease; &:checked { border-color: ${({ theme }) => theme.colors.accent}; background-color: ${({ theme }) => theme.colors.accent}; } &:checked::after { content: ''; display: block; width: 0.25em; height: 0.5em; border: solid ${({ theme }) => theme.colors.surface}; border-width: 0 2px 2px 0; transform: rotate(45deg) translate(-10%, -20%); position: absolute; left: 0.28em; top: 0.1em; } &:focus { outline: none; box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accent}33; } } &.tag-checked { background-color: ${({ theme }) => theme.colors.accentLight}33; border-color: ${({ theme }) => theme.colors.accent}; color: ${({ theme }) => theme.colors.accent}; font-weight: 600; } `;
const ActionContainer = styled.div` display: flex; justify-content: flex-end; gap: 1rem; padding-top: 2rem; margin-top: 1.5rem; border-top: 1px solid ${({ theme }) => theme.colors.border}; `;
const LoadingOverlay = styled.div` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.7); display: flex; justify-content: center; align-items: center; font-size: 1.2rem; color: ${({ theme }) => theme.colors.primary}; z-index: 1000; `;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  margin-left: 15px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.colors.textLight};
    transition: .4s;
    border-radius: 26px;
  }
  
  span:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + span {
    background-color: ${({ theme }) => theme.colors.success};
  }

  input:checked + span.cancel-switch {
      background-color: ${({ theme }) => theme.colors.error};
  }
  
  input:focus + span {
    box-shadow: 0 0 1px ${({ theme }) => theme.colors.accent};
  }
  
  input:checked + span:before {
    transform: translateX(24px);
  }
`;
const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  margin-top: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const BadgePreview = styled.img`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  padding: 0.25rem;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [eventData, setEventData] = useState(null);
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(''); // Sẽ lưu "YYYY-MM-DDTHH:MM" (giờ Đà Nẵng)
  const [endDate, setEndDate] = useState('');   // Sẽ lưu "YYYY-MM-DDTHH:MM" (giờ Đà Nẵng)
  const [capacity, setCapacity] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [initialLogoUrl, setInitialLogoUrl] = useState('');
  const [initialCoverUrl, setInitialCoverUrl] = useState('');
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(null);
  const [attendanceType, setAttendanceType] = useState(ATTENDANCE_TYPES.OFFLINE);
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

   const [isOpenedForRegistration, setIsOpenedForRegistration] = useState(true);
    const [isCancelled, setIsCancelled] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fileErrors, setFileErrors] = useState({});

   const [badgeData, setBadgeData] = useState(null); // Lưu trữ object huy hiệu từ API
    const [badgeText, setBadgeText] = useState('');
    const [badgeIconFile, setBadgeIconFile] = useState(null);
    const [badgeIconPreviewUrl, setBadgeIconPreviewUrl] = useState(null);

  const handleLocationChange = useCallback((lat, lng) => {
        setLatitude(lat);
        setLongitude(lng);
        console.log(`Tọa độ mới được chọn: Lat=${lat}, Lng=${lng}`);
    }, []); // useCallback để tránh re-render không cần thiết

  const fetchEventDetails = useCallback(async () => {
    if (!eventId) {
      setError("Không tìm thấy ID sự kiện.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await eventService.getEvent(eventId);
      const fetchedEvent = response.data;

      if (!fetchedEvent) {
        setError("Không tìm thấy sự kiện.");
        setIsLoading(false);
        return;
      }

      if (user && fetchedEvent.hostId !== user.id && user.role !== ROLES.UNION) {
        setError("Bạn không có quyền chỉnh sửa sự kiện này.");
        setEventData(null); 
        setIsLoading(false);
        return;
      }
      
      setEventData(fetchedEvent);
      setEventName(fetchedEvent.eventName || '');
      setDescription(fetchedEvent.description || '');
      setLatitude(fetchedEvent.latitude || null);
        setLongitude(fetchedEvent.longitude || null);
      
      // API trả về chuỗi giờ Đà Nẵng (ví dụ: "2025-05-27T09:00:00")
      // Chuyển đổi sang "YYYY-MM-DDTHH:MM" cho input
      console.log("EDIT PAGE - API raw startDate (từ DB):", fetchedEvent.startDate);
      console.log("EDIT PAGE - API raw endDate (từ DB):", fetchedEvent.endDate);

      
      
      const inputStartDate = convertApiDateTimeToDaNangInputString(fetchedEvent.startDate);
const inputEndDate = convertApiDateTimeToDaNangInputString(fetchedEvent.endDate);
      
      console.log("EDIT PAGE - Input StartDate string (Đà Nẵng time cho input):", inputStartDate);
      console.log("EDIT PAGE - Input EndDate string (Đà Nẵng time cho input):", inputEndDate);
      setStartDate(inputStartDate);
      setEndDate(inputEndDate);
      
      setCapacity(fetchedEvent.capacity?.toString() || '');
      setAttendanceType(fetchedEvent.attendanceType || ATTENDANCE_TYPES.OFFLINE);
      setLocation(fetchedEvent.location || '');
      setSelectedTags(Array.isArray(fetchedEvent.tagsList) ? fetchedEvent.tagsList : (Array.isArray(fetchedEvent.tags) ? fetchedEvent.tags : []));
      setInitialLogoUrl(fetchedEvent.logoUrl || '');
      setInitialCoverUrl(fetchedEvent.coverUrl || '');
      setLogoPreviewUrl(fetchedEvent.logoUrl || null);
      setCoverPreviewUrl(fetchedEvent.coverUrl || null);

      setIsOpenedForRegistration(fetchedEvent.isOpenedForRegistration ?? true);
            setIsCancelled(fetchedEvent.isCancelled ?? false);
            try {
                const badges = await badgeService.getBadgesByEventId(eventId);
                if (badges && badges.length > 0) {
                    const currentBadge = badges[0]; // Logic backend chỉ trả về 1 huy hiệu cho mỗi event
                    setBadgeData(currentBadge);
                    setBadgeText(currentBadge.badgeText || '');
                    setBadgeIconPreviewUrl(currentBadge.iconUrl || null);
                }
            } catch (badgeError) {
                console.warn("Không thể tải huy hiệu cho sự kiện này:", badgeError);
                // Không phải lỗi nghiêm trọng, vẫn tiếp tục
            }

    } catch (err) {
      console.error("Error fetching event details:", err);
      setError(err.response?.data?.message || err.message || 'Không thể tải thông tin sự kiện.');
    } finally {
      setIsLoading(false);
    }
  }, [eventId, user]);

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        fetchEventDetails();
      } else {
        setError("Vui lòng đăng nhập để chỉnh sửa sự kiện.");
        setIsLoading(false);
      }
    }
  }, [eventId, authLoading, isAuthenticated, fetchEventDetails]);

   useEffect(() => {
        if (!badgeIconFile) {
            // Nếu không có file mới, hiển thị ảnh cũ (nếu có)
            setBadgeIconPreviewUrl(badgeData?.iconUrl || null);
            return;
        }
        const objectUrl = URL.createObjectURL(badgeIconFile);
        setBadgeIconPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [badgeIconFile, badgeData]);

  useEffect(() => {
    if (!logoFile) {
      setLogoPreviewUrl(initialLogoUrl || null);
      return;
    }
    const objectUrl = URL.createObjectURL(logoFile);
    setLogoPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [logoFile, initialLogoUrl]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreviewUrl(initialCoverUrl || null);
      return;
    }
    const objectUrl = URL.createObjectURL(coverFile);
    setCoverPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [coverFile, initialCoverUrl]);

  const handleFileChange = (fieldName, fileSetter) => (event) => {
    const file = event.target.files[0];
    const newErrors = { ...fileErrors };
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      fileSetter(file);
      delete newErrors[fieldName];
    } else {
      fileSetter(null);
      if (file) { newErrors[fieldName] = 'Chỉ chấp nhận file JPG hoặc PNG.'; } 
      else { delete newErrors[fieldName]; }
    }
    setFileErrors(newErrors);
    setError(null);
  };

  const handleTagChange = (event) => {
    const { value, checked } = event.target;
    setSelectedTags(prevTags =>
      checked ? [...prevTags, value] : prevTags.filter(tag => tag !== value)
    );
  };

  const validateForm = () => {
    if (!eventName.trim()) return "Tên sự kiện không được để trống.";
    if (!description.trim()) return "Mô tả sự kiện không được để trống.";
    if (!startDate) return "Ngày giờ bắt đầu không được để trống.";
    if (!endDate) return "Ngày giờ kết thúc không được để trống.";
    
    // startDate và endDate là "YYYY-MM-DDTHH:MM" (giờ Đà Nẵng)
    // Thêm giây và offset GMT+7 để so sánh chính xác
    const daNangTimeZoneOffset = "+07:00";
    // Quan trọng: new Date() có thể hiểu sai nếu không có phần giây.
    // Input datetime-local không có giây, nên ta thêm :00
    const startTime = new Date(startDate + ":00" + daNangTimeZoneOffset); 
    const endTime = new Date(endDate + ":00" + daNangTimeZoneOffset);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        return "Ngày giờ không hợp lệ. Vui lòng kiểm tra lại.";
    }
    if (endTime <= startTime) return "Ngày giờ kết thúc phải sau ngày giờ bắt đầu.";

    if (!capacity || parseInt(capacity, 10) <= 0) return "Số lượng tham gia phải là số dương.";
    if (attendanceType === ATTENDANCE_TYPES.OFFLINE && !location.trim()) return "Địa điểm không được để trống khi tổ chức offline.";
    if (attendanceType === ATTENDANCE_TYPES.ONLINE && !location.trim()) return "Nền tảng Online/Link không được để trống khi tổ chức online.";
    if (logoFile && !['image/jpeg', 'image/png'].includes(logoFile.type)) return "Logo phải là file JPG hoặc PNG.";
    if (coverFile && !['image/jpeg', 'image/png'].includes(coverFile.type)) return "Ảnh bìa phải là file JPG hoặc PNG.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.clear(); // Xóa console cũ để dễ nhìn
    console.log("--- BẮT ĐẦU DEBUG HANDLE SUBMIT ---");
    console.log("Giá trị eventId:", eventId);
    console.log("Dữ liệu badge hiện tại (từ server):", badgeData);
    console.log("Text huy hiệu người dùng nhập:", badgeText);
    console.log("File icon người dùng chọn:", badgeIconFile);
    setError(null);
    setSuccess(null);
    const validationError = validateForm();
    const currentFileErrors = { ...fileErrors };
    const hasFileErrors = Object.values(currentFileErrors).some(err => err);

    if (validationError || hasFileErrors) {
      let combinedError = validationError || "";
      if (hasFileErrors) {
        const specificFileErrors = Object.entries(currentFileErrors)
          .filter(([, value]) => value)
          .map(([key, value]) => `${key === 'logoFile' ? 'Logo' : 'Ảnh bìa'}: ${value}`)
          .join(' ');
        combinedError = combinedError ? `${combinedError} ${specificFileErrors}` : specificFileErrors;
      }
      setError(combinedError || "Vui lòng kiểm tra lại thông tin đã nhập.");
      return;
    }

    setIsLoading(true);
    try {
      let uploadedLogoUrl = initialLogoUrl;
      let uploadedCoverUrl = initialCoverUrl;

      if (logoFile) { /* ... (logic upload giữ nguyên) ... */ 
        const logoUploadResponse = await uploadService.uploadFile(logoFile);
        if (logoUploadResponse?.saveUrl) {
          let correctSaveUrl = logoUploadResponse.saveUrl;
          if (correctSaveUrl.startsWith("//")) correctSaveUrl = correctSaveUrl.substring(1);
          const apiUrl = import.meta.env.VITE_API_BASE_URL;
          if (!apiUrl) throw new Error("LỖI CẤU HÌNH: VITE_API_BASE_URL không định nghĩa!");
          const domainApi = apiUrl.replace('/api', '');
          uploadedLogoUrl = domainApi + correctSaveUrl;
        } else if (logoUploadResponse?.url) {
           uploadedLogoUrl = logoUploadResponse.url;
        } else {
          throw new Error("Không nhận được URL file logo sau khi upload.");
        }
      }
      if (coverFile) { /* ... (logic upload giữ nguyên) ... */
        const coverUploadResponse = await uploadService.uploadFile(coverFile);
         if (coverUploadResponse?.saveUrl) {
          let correctSaveUrl = coverUploadResponse.saveUrl;
          if (correctSaveUrl.startsWith("//")) correctSaveUrl = correctSaveUrl.substring(1);
          const apiUrl = import.meta.env.VITE_API_BASE_URL;
          if (!apiUrl) throw new Error("LỖI CẤU HÌNH: VITE_API_BASE_URL không định nghĩa!");
          const domainApi = apiUrl.replace('/api', '');
          uploadedCoverUrl = domainApi + correctSaveUrl;
        } else if (coverUploadResponse?.url) {
          uploadedCoverUrl = coverUploadResponse.url;
        } else {
          throw new Error("Không nhận được URL file ảnh bìa sau khi upload.");
        }
      }
      
      // startDate và endDate đang là "YYYY-MM-DDTHH:MM" (giờ Đà Nẵng)
      // Chuyển đổi sang UTC ISO string để gửi cho API (nếu API yêu cầu UTC)
      // Hoặc gửi trực tiếp nếu API muốn chuỗi giờ địa phương (thêm :00 cho giây)
      const daNangTimeZoneOffset = "+07:00";
      const startDateForAPI = new Date(startDate + ":00" + daNangTimeZoneOffset);
      const endDateForAPI = new Date(endDate + ":00" + daNangTimeZoneOffset);
      
      // Nếu API muốn nhận lại chuỗi giờ Đà Nẵng như lúc nó gửi ra:
      // const startDateForAPI = startDate + ":00"; 
      // const endDateForAPI = endDate + ":00";

      const updatedEventPayload = {
        EventId: eventId, 
        EventName: eventName.trim(),
        Description: description.trim(),
        AttendanceType: attendanceType,
        Location: attendanceType === ATTENDANCE_TYPES.ONLINE ? (location.trim() || 'Online Platform') : location.trim(),
        StartDate: startDate, 
        EndDate: endDate,     
        Capacity: parseInt(capacity, 10),
        HostId: eventData.hostId, 
        LogoUrl: uploadedLogoUrl,
        CoverUrl: uploadedCoverUrl,
         Latitude: latitude,
            Longitude: longitude,
        //Tags: selectedTags, 
        IsOpenedForRegistration: isOpenedForRegistration,
                IsCancelled: isCancelled,
                Scope: eventData.scope, // Giữ lại scope gốc của sự kiện
      };
      
      console.log('EDIT PAGE - Sending event update data to API:', updatedEventPayload);
      await eventService.updateEvent(eventId, updatedEventPayload);

      console.log("--- Bắt đầu xử lý logic Huy hiệu ---");
      let uploadedBadgeIconUrl = badgeData?.iconUrl; // Giữ URL cũ mặc định
            if (badgeIconFile) { // Nếu có file mới thì upload
                const badgeUploadResponse = await uploadService.uploadFile(badgeIconFile);
                console.log("Kết quả upload icon:", badgeUploadResponse);
                const saveUrl = badgeUploadResponse?.saveUrl;
                if (saveUrl) {
                    const fileName = saveUrl.split('/').pop();
                    uploadedBadgeIconUrl = uploadService.getFileUrl(fileName);
                } else {
                    throw new Error("API upload không trả về saveUrl cho icon huy hiệu.");
                }
            }

            const hasBadgeInfo = badgeText.trim() && uploadedBadgeIconUrl;
            
            if (badgeData && hasBadgeInfo) {
                // --- CẬP NHẬT huy hiệu đã có ---
                const badgePayload = {
                    ...badgeData, // Giữ lại badgeId và eventId
                    badgeText: badgeText.trim(),
                    iconUrl: uploadedBadgeIconUrl,
                };
                console.log("CHUẨN BỊ GỬI PAYLOAD CẬP NHẬT:", badgePayload); // KIỂM TRA CÁI NÀY
                await badgeService.updateBadge(badgeData.badgeId, badgePayload);
            } else if (!badgeData && hasBadgeInfo) {
                // --- TẠO MỚI huy hiệu cho sự kiện này ---
                console.log("CHUẨN BỊ GỌI API TẠO/CẬP NHẬT HUY HIỆU"); // Log 1
                const badgePayload = {
                    eventId: eventId,
                    badgeText: badgeText.trim(),
                    iconUrl: uploadedBadgeIconUrl,
                };
                console.log("Dữ liệu (payload) sẽ gửi đi:", badgePayload); // Log 2: Rất quan trọng!
                await badgeService.createBadge(badgePayload);
            }
      
      setSuccess('Sự kiện đã được cập nhật thành công!');
      // Không fetchEventDetails() ngay lập tức nếu có setTimeout chuyển trang
      setTimeout(() => {
        navigate(`/events/${eventId}`);
      }, 1500); // Giảm thời gian chờ một chút

    } catch (err) {
      console.error('Error during event update process:', err);
      setError(err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi cập nhật sự kiện.');
    } finally {
      setIsLoading(false); // Đảm bảo setIsLoading(false) được gọi sau khi success/error được set
    }
  };

  // --- Phần JSX trả về (GIỮ NGUYÊN NHƯ TRƯỚC, đã có các điều kiện render) ---
    if (authLoading || (isLoading && !eventData && !error && !success)) {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <LoadingOverlay>Đang tải...</LoadingOverlay>
        </ThemeProvider>
   );
  }

  if (!isAuthenticated && !authLoading) { 
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <PageWrapper>
          <FormCard>
            <Title>Truy cập bị từ chối</Title>
            <ErrorMessage>
              <p>Lỗi</p>
              <p>Vui lòng đăng nhập để chỉnh sửa sự kiện.</p>
            </ErrorMessage>
            <ActionContainer style={{ justifyContent: 'center' }}>
                <Button onClick={() => navigate('/login', { state: { from: window.location.pathname }})}>Đăng nhập</Button>
            </ActionContainer>
          </FormCard>
        </PageWrapper>
      </ThemeProvider>
    );
  }
  
  if (error && !eventData && !success) { 
     return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <PageWrapper>
          <FormCard>
            <Title>Lỗi</Title>
            <ErrorMessage>
              <p>Lỗi</p>
              <p>{error}</p> 
            </ErrorMessage>
             <ActionContainer style={{ justifyContent: 'center' }}>
                <Button onClick={() => fetchEventDetails()}>Thử lại</Button> 
                <Button onClick={() => navigate(-1)} variant="secondary">Quay lại</Button>
            </ActionContainer>
          </FormCard>
        </PageWrapper>
      </ThemeProvider>
    );
  }
  
  if (!eventData && !isLoading && !error && !success) { 
    return (
         <ThemeProvider theme={theme}>
            <GlobalStyle />
            <PageWrapper>
                <FormCard>
                    <Title>Không tìm thấy sự kiện</Title>
                     <ActionContainer style={{ justifyContent: 'center' }}>
                        <Button onClick={() => navigate("/admin/my-events")}>Về danh sách sự kiện</Button>
                    </ActionContainer>
                </FormCard>
            </PageWrapper>
         </ThemeProvider>
    );
  }

return (
    <ThemeProvider theme={theme}>
        <GlobalStyle />
        {/* Chỉ hiển thị loading overlay khi đang submit và chưa có success/error */}
        {isLoading && success === null && error === null && <LoadingOverlay>Đang xử lý...</LoadingOverlay>}
        <PageWrapper>
            <FormCard>
                <Title>Chỉnh sửa sự kiện</Title>

                {success && (
                    <ErrorMessage success role="alert">
                        <p>Thành công!</p>
                        <p>{success}</p>
                    </ErrorMessage>
                )}
                {error && !success && (
                    <ErrorMessage role="alert">
                        <p>Lỗi</p>
                        <p>{error}</p>
                    </ErrorMessage>
                )}
                {Object.values(fileErrors).some(e => e) && !error?.includes("Logo:") && !error?.includes("Ảnh bìa:") && (
                    <ErrorMessage role="alert" style={{ marginTop: '1rem'}}>
                        {fileErrors.logoFile && <p>Logo: {fileErrors.logoFile}</p>}
                        {fileErrors.coverFile && <p>Ảnh bìa: {fileErrors.coverFile}</p>}
                    </ErrorMessage>
                )}

                <StyledForm onSubmit={handleSubmit}>
                    {eventData ? (
                        <>
                            <FormGroup>
                                <Input
                                    id="eventName" label="Tên sự kiện" value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    placeholder="Nhập tên sự kiện" required
                                />
                            </FormGroup>

                            <FormGroup>
                                <StyledLabel htmlFor="description">Mô tả sự kiện <RequiredAsterisk>*</RequiredAsterisk></StyledLabel>
                                <StyledTextarea id="description" rows="5" value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Nhập mô tả chi tiết về sự kiện" required
                                />
                            </FormGroup>

                            <GridContainer>
                                <FormGroup>
                                    <Input
                                        id="startDate"
                                        label="Ngày giờ bắt đầu (Giờ Đà Nẵng)"
                                        type="datetime-local"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                        // Hiển thị đúng định dạng input, không tự động chuyển múi giờ
                                        inputProps={{ step: 60 }}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                        id="endDate"
                                        label="Ngày giờ kết thúc (Giờ Đà Nẵng)"
                                        type="datetime-local"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                        min={startDate || ''}
                                        inputProps={{ step: 60 }}
                                    />
                                </FormGroup>
                            </GridContainer>

                            <FormGroup>
                                <Input id="capacity" label="Số lượng tham gia tối đa" type="number"
                                    value={capacity} onChange={(e) => setCapacity(e.target.value)}
                                    placeholder="Nhập số lượng" required min="1"
                                />
                            </FormGroup>

                            <GridContainer>
                                <FormGroup>
                                    <Input id="logoFile" label="Ảnh Logo mới (.jpg, .png)" type="file"
                                        accept="image/jpeg, image/png"
                                        onChange={handleFileChange('logoFile', setLogoFile)}
                                    />
                                    {fileErrors.logoFile && <ErrorMessage style={{padding: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem', borderLeftWidth: '2px'}}><p style={{margin:0}}>{fileErrors.logoFile}</p></ErrorMessage>}
                                </FormGroup>
                                <FormGroup>
                                    <Input id="coverFile" label="Ảnh Bìa mới (.jpg, .png)" type="file"
                                        accept="image/jpeg, image/png"
                                        onChange={handleFileChange('coverFile', setCoverFile)}
                                    />
                                    {fileErrors.coverFile && <ErrorMessage style={{padding: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem', borderLeftWidth: '2px'}}><p style={{margin:0}}>{fileErrors.coverFile}</p></ErrorMessage>}
                                </FormGroup>
                            </GridContainer>

                            {(logoPreviewUrl || coverPreviewUrl) && (
                                <PreviewContainer>
                                    {logoPreviewUrl && (
                                        <ImagePreviewWrapper>
                                            <PreviewImage src={logoPreviewUrl} alt="Xem trước Logo" />
                                            <ImagePlaceholderText>Xem trước Logo hiện tại/mới</ImagePlaceholderText>
                                        </ImagePreviewWrapper>
                                    )}
                                    {coverPreviewUrl && (
                                        <ImagePreviewWrapper>
                                            <PreviewImageCover src={coverPreviewUrl} alt="Xem trước Ảnh bìa" />
                                            <ImagePlaceholderText>Xem trước Ảnh bìa hiện tại/mới</ImagePlaceholderText>
                                        </ImagePreviewWrapper>
                                    )}
                                </PreviewContainer>
                            )}

                            <FormGroup>
                                <StyledLabel>Hình thức tham gia <RequiredAsterisk>*</RequiredAsterisk></StyledLabel>
                                <RadioGroup>
                                    <RadioLabel>
                                        <input type="radio" name="attendanceType" value={ATTENDANCE_TYPES.OFFLINE} checked={attendanceType === ATTENDANCE_TYPES.OFFLINE} onChange={(e) => setAttendanceType(e.target.value)} />
                                        <span>Offline</span>
                                    </RadioLabel>
                                    <RadioLabel>
                                        <input type="radio" name="attendanceType" value={ATTENDANCE_TYPES.ONLINE} checked={attendanceType === ATTENDANCE_TYPES.ONLINE} onChange={(e) => setAttendanceType(e.target.value)} />
                                        <span>Online</span>
                                    </RadioLabel>
                                </RadioGroup>
                            </FormGroup>

                            <FormGroup>
                                <Input id="location"
                                    label={attendanceType === ATTENDANCE_TYPES.ONLINE ? "Nền tảng Online / Link tham gia" : "Địa điểm tổ chức"}
                                    value={location} onChange={(e) => setLocation(e.target.value)}
                                    placeholder={attendanceType === ATTENDANCE_TYPES.ONLINE ? "Ví dụ: Link Google Meet, Zoom,..." : "Ví dụ: Hội trường F, ĐH Bách Khoa"}
                                    required
                                />
                            </FormGroup>
                            {attendanceType === ATTENDANCE_TYPES.OFFLINE && (
    <FormGroup>
        <StyledLabel>Chọn Vị trí trên Bản đồ</StyledLabel>
        <LocationPicker
            latitude={latitude}
            longitude={longitude}
            onLocationChange={handleLocationChange}
            locationName={location} // Truyền tên địa điểm để LocationPicker có thể tìm kiếm
        />
    </FormGroup>
)}

                            <FormGroup>
                                <StyledLabel>Thể loại (Tags)</StyledLabel>
                                <TagGrid>
                                    {TAGS.map(tag => (
                                        <TagLabel key={tag} className={selectedTags.includes(tag) ? 'tag-checked' : ''}>
                                            <input type="checkbox" value={tag} checked={selectedTags.includes(tag)} onChange={handleTagChange} />
                                            <span>{tag}</span>
                                        </TagLabel>
                                    ))}
                                </TagGrid>
                            </FormGroup>

                            <SectionTitle>Huy hiệu tham gia</SectionTitle>
                                <FormGroup>
                                    <Input
                                        id="badgeText"
                                        label="Tên/Mô tả huy hiệu"
                                        value={badgeText}
                                        onChange={(e) => setBadgeText(e.target.value)}
                                        placeholder="Để trống nếu không có huy hiệu"
                                    />
                                </FormGroup>
                                <GridContainer>
                                    <FormGroup>
                                        <Input
                                            id="badgeIconFile"
                                            label="Ảnh Icon Huy hiệu mới (.jpg, .png, .svg)"
                                            type="file"
                                            accept="image/jpeg, image/png, image/svg+xml"
                                            onChange={handleFileChange('badgeIconFile', setBadgeIconFile)}
                                        />
                                         {fileErrors.badgeIconFile && <ErrorMessage style={{padding: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem', borderLeftWidth: '2px'}}><p style={{margin:0}}>{fileErrors.badgeIconFile}</p></ErrorMessage>}
                                    </FormGroup>
                                    {badgeIconPreviewUrl && (
                                        <PreviewContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
                                             <ImagePreviewWrapper>
                                                <BadgePreview src={badgeIconPreviewUrl} alt="Badge Icon Preview" />
                                                <ImagePlaceholderText>Xem trước Icon Huy hiệu</ImagePlaceholderText>
                                            </ImagePreviewWrapper>
                                        </PreviewContainer>
                                    )}
                                </GridContainer>

                            <ActionContainer>
                                <Button type="button" variant="secondary" onClick={() => navigate(-1)} disabled={isLoading && success === null}>
                                    Hủy bỏ
                                </Button>
                                <Button type="submit" variant="primary" isLoading={isLoading && success === null} disabled={isLoading && success === null}>
                                    {isLoading && success === null ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </Button>
                            </ActionContainer>
                        </>
                    ) : (
                        !error && <p>Không có dữ liệu sự kiện để chỉnh sửa hoặc đang chờ tải.</p>
                    )}
                </StyledForm>
            </FormCard>
        </PageWrapper>
    </ThemeProvider>
);
};

export default EditEventPage;