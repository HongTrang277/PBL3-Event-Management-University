import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { authService, facultyService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import Button from '../components/common/Button/Button';
import Input from '../components/common/Input/Input';
import PageLoader from '../components/common/PageLoader';

import {
  FaUser, FaEnvelope, FaGraduationCap, FaBuilding, FaIdCard, FaCamera,
  FaCalendarAlt, FaBell, FaCog, FaLock, FaPen, FaCheck, FaTimes,
  FaUndo, FaCheckCircle // Thêm các icon thiếu
} from 'react-icons/fa';
import { MdEvent, MdSchool, MdLocationOn, MdVerifiedUser } from 'react-icons/md';

// Theme definition
const theme = {
  colors: {
    primary: '#4A5568',
    primaryLight: '#718096',
    accent: '#3182CE',
    accentLight: '#63B3ED',
    background: '#F7FAFC',
    surface: '#FFFFFF',
    text: '#2D3748',
    textSecondary: '#4A5568',
    textLight: '#A0AEC0',
    border: '#E2E8F0',
    error: '#C53030',
    errorLight: '#FED7D7',
    success: '#2F855A',
    successLight: '#C6F6D5',
    gradient: {
      start: '#4299E1',
      end: '#3182CE'
    }
  },
  fonts: {
    main: "'DM Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  borderRadius: '0.5rem',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
  inputHeight: '2.75rem',
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.colors.background};
    font-family: ${({ theme }) => theme.fonts.main};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
    margin: 0;
    padding: 0;
  }

  * {
    box-sizing: border-box;
  }
`;

// Styled Components - Enhanced versions
const PageWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    
    h1 {
      font-size: 1.75rem;
    }
  }
`;

const ProfileContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2.5fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ProfileCard = styled.div`
  background: linear-gradient(to bottom, #ffffff, #f9fafb);
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  padding: 2rem;
  height: fit-content;
  border: 1px solid #edf2f7;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(to right, ${({ theme }) => theme.colors.gradient.start}, ${({ theme }) => theme.colors.gradient.end});
  }
`;

const ProfileDetailsCard = styled(ProfileCard)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
`;

const ProfileAvatarWrapper = styled.div`
  position: relative;
  margin: 0 auto 1.5rem;
  width: 160px;
  height: 160px;
`;

const ProfileAvatar = styled.div`
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #ffffff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
`;

const EditAvatarButton = styled.label`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: ${({ theme }) => theme.colors.accent};
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(49, 130, 206, 0.4);
  z-index: 2;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gradient.end};
    transform: translateY(-2px);
  }

  input {
    display: none;
  }
`;

const ProfileName = styled.h1`
  font-size: 1.75rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 0.25rem;
  font-weight: 700;
`;

const ProfileRole = styled.p`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1rem;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  svg {
    font-size: 1.1rem;
  }
`;

const ProfileStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #edf2f7;
    transform: translateY(-2px);
  }
  
  h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.accent};
  }
  
  p {
    margin: 0;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const InfoSection = styled.div`
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    transform: translateX(3px);
  }
`;

const InfoIconWrapper = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${({ theme, color }) => color ? color : `${theme.colors.accent}20`};
  color: ${({ theme, iconColor }) => iconColor ? iconColor : theme.colors.accent};
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`  // Đổi từ p sang div
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const InfoValue = styled.div`  // Đổi từ p sang div
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  font-weight: 500;
  font-size: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin: 0 0 1.25rem;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  padding-bottom: 0.75rem;
  font-weight: 600;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(to right, ${({ theme }) => theme.colors.gradient.start}, ${({ theme }) => theme.colors.gradient.end});
    border-radius: 3px;
  }
  
  svg {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: 1.5rem 0;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 576px) {
    justify-content: stretch;
    
    button {
      flex: 1;
    }
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 1.5rem;
  overflow-x: auto;
  scrollbar-width: none;
  position: relative;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.border};
    z-index: 0;
  }
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  font-size: 1rem;
  font-weight: ${props => props.active ? '600' : '500'};
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.textSecondary};
  cursor: pointer;
  // Sửa dòng này: chuyển boolean thành string
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.accent : 'transparent'};
  transition: all 0.2s ease;
  white-space: nowrap;
  z-index: 1;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    font-size: 1.1rem;
  }
  
  &:hover {
    color: ${props => props.theme.colors.accent};
    background-color: ${props => props.active ? 'transparent' : '#f7fafc'};
  }
  
  &:focus {
    outline: none;
  }
`;


const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  gap: 0.35rem;
  color: ${props => props.type === 'success' ? '#2F855A' :
    props.type === 'warning' ? '#C05621' :
      props.type === 'info' ? '#3182CE' : '#718096'};
  background-color: ${props => props.type === 'success' ? '#C6F6D5' :
    props.type === 'warning' ? '#FEEBC8' :
      props.type === 'info' ? '#BEE3F8' : '#E2E8F0'};
`;

const NoContent = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f8fafc;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  
  h3 {
    margin: 0 0 0.5rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 500;
  }
  
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textLight};
  }
  
  svg {
    font-size: 3rem;
    color: ${({ theme }) => theme.colors.textLight};
    margin-bottom: 1rem;
  }
`;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EventCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const EventImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const EventContent = styled.div`
  flex: 1;
  
  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }
  
  p {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const EventDate = styled.div`
  flex-shrink: 0;
  text-align: right;
  
  p {
    margin: 0;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
  
  @media (max-width: 576px) {
    text-align: left;
    width: 100%;
    margin-top: 0.5rem;
  }
`;

const StatusBadge = styled(Badge)`
  margin-left: auto;
  
  @media (max-width: 576px) {
    margin-left: 0;
    margin-top: 0.5rem;
  }
`;

const VerificationBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: ${({ verified, theme }) =>
    verified ? theme.colors.successLight : theme.colors.errorLight};
  color: ${({ verified, theme }) =>
    verified ? theme.colors.success : theme.colors.error};
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  gap: 0.35rem;
  margin-left: 0.5rem;
`;

const EditButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: ${({ theme }) => theme.colors.accent};
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  z-index: 10;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gradient.end};
    transform: scale(1.05);
  }
  
  svg {
    font-size: 1rem;
  }
`;
const UpdateSuccessMessage = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.successLight};
  color: ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.borderRadius};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
const SelectDropdown = styled.select`
  width: 100%;
  height: ${({ theme }) => theme.inputHeight};
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme, error }) => error ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.accent}20`};
  }
  
  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textLight};
    pointer-events: none;
  }
`;

const SelectWithIcon = styled(SelectDropdown)`
  padding-left: ${props => props.hasIcon ? '2.5rem' : '1rem'};
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

// Faculty Profile Page Component
const MyProfile = () => {
  const { user, isAuthenticated, isLoading: authLoading, updateUserInfo } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const navigate = useNavigate();
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [faculties, setFaculties] = useState([]);
  const [isLoadingFaculties, setIsLoadingFaculties] = useState(false);


  // Dummy data for events (replace with actual API data)
  const [registeredEvents, setRegisteredEvents] = useState([
    {
      id: 1,
      name: 'Workshop: Hướng dẫn tìm việc cho sinh viên IT',
      date: '04/06/2023',
      image: 'https://via.placeholder.com/150',
      location: 'Hội trường F',
      status: 'completed'
    },
    {
      id: 2,
      name: 'Seminar về Trí tuệ nhân tạo và Machine Learning',
      date: '10/07/2023',
      image: 'https://via.placeholder.com/150',
      location: 'Phòng A1-103',
      status: 'registered'
    }
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated && !authLoading) {
        navigate('/login');
        return;
      }

      if (user && user.id) {
        setIsLoading(true);
        try {
          const response = await authService.getUserById(user.id);
          setProfileData(response.data);
          setEditedData(response.data);
        } catch (error) {
          console.error('Error fetching profile data:', error);
          toast.error('Không thể tải thông tin cá nhân. Vui lòng thử lại sau.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
  }, [isAuthenticated, authLoading, user, navigate]);
  useEffect(() => {
    const fetchFaculties = async () => {
      setIsLoadingFaculties(true);
      try {
        const data = await facultyService.getAllFaculties();
        setFaculties(data);
      } catch (error) {
        console.error('Error fetching faculties:', error);
        // Tạo dữ liệu mẫu nếu API không hoạt động

      } finally {
        setIsLoadingFaculties(false);
      }
    };

    if (isEditing) {
      fetchFaculties();
    }
  }, [isEditing]);
  useEffect(() => {
  const fetchFaculties = async () => {
    setIsLoadingFaculties(true);
    try {
      const data = await facultyService.getAllFaculties();
      setFaculties(data);
    } catch (error) {
      console.error('Error fetching faculties:', error);
      // Fallback data nếu API lỗi
      
    } finally {
      setIsLoadingFaculties(false);
    }
  };

  // Chỉ fetch faculties một lần khi component mount
  fetchFaculties();
}, []);
  const handleSaveChanges = async () => {
    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    setIsSaving(true);
    try {
      // Upload avatar if changed
      let avatarUrl = profileData.userImageUrl;
      if (avatar) {
        try {
          // Implement file upload - sẽ cập nhật sau khi có API upload
          const formData = new FormData();
          formData.append('file', avatar);

          // Giả sử bạn có API upload ảnh
          // const response = await fetch('/api/upload', {
          //   method: 'POST',
          //   body: formData,
          // });
          // const data = await response.json();
          // avatarUrl = data.url;

          // Tạm thời dùng data URI
          const reader = new FileReader();
          reader.readAsDataURL(avatar);
          reader.onloadend = async () => {
            avatarUrl = reader.result;

            // Sau khi có URL ảnh, cập nhật profile
            await saveProfileData(avatarUrl);
          }
        } catch (error) {
          console.error('Error uploading avatar:', error);
          // Tiếp tục cập nhật thông tin mà không thay đổi avatar
          await saveProfileData(avatarUrl);
        }
      } else {
        // Không có thay đổi avatar, cập nhật thông tin khác
        await saveProfileData(avatarUrl);
      }
    } catch (error) {
      console.error('Error saving profile changes:', error);
      toast.error('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
      setIsSaving(false);
    }
  };
  const hasChanges = () => {
    if (avatar) return true;

    // So sánh các trường dữ liệu
    const fieldsToCompare = ['fullName', 'studentId', 'class', 'facultyId'];
    return fieldsToCompare.some(field => editedData[field] !== profileData[field]);
  };

  const handleEditToggle = () => {
    if (isEditing && hasChanges()) {
      // Hiển thị xác nhận nếu có thay đổi
      if (window.confirm('Bạn có các thay đổi chưa được lưu. Bạn có chắc muốn hủy không?')) {
        cancelEditing();
      }
    } else {
      // Không có thay đổi hoặc đang chuyển sang chế độ chỉnh sửa
      if (isEditing) {
        cancelEditing();
      } else {
        setIsEditing(true);
      }
    }
  };
  const cancelEditing = () => {
    setEditedData({ ...profileData });
    setAvatarPreview(null);
    setAvatar(null);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const validateForm = () => {
    const errors = {};

    // Kiểm tra fullName
    if (!editedData.fullName?.trim()) {
      errors.fullName = 'Họ và tên không được để trống';
    }

    // Kiểm tra MSSV (nếu là sinh viên)
    if (editedData.studentId === '') {
      errors.studentId = 'Mã số sinh viên không được để trống';
    }

    // Đặt state errors
    setFieldErrors(errors);

    // Form hợp lệ nếu không có lỗi
    return Object.keys(errors).length === 0;
  };
  const getFacultyName = (facultyId) => {
    if (!facultyId) return 'Chưa cập nhật';
    const faculty = faculties.find(f => f.facultyId === facultyId);
    return faculty ? faculty.facultyName : facultyId;
  };
  const handleResetForm = () => {
    setEditedData({ ...profileData });
    setAvatarPreview(null);
    setAvatar(null);
    toast.info('Đã đặt lại form về giá trị ban đầu.');
  };
  const saveProfileData = async (avatarUrl) => {
    try {
    // Chuẩn bị dữ liệu cập nhật
    const updatedProfile = {
      ...editedData,
      userImageUrl: avatarUrl
    };

    // Đảm bảo facultyId là giá trị hợp lệ
    updatedProfile.facultyId = updatedProfile.facultyId || null;

    // Gọi API cập nhật
    const response = await authService.updateUserProfile(user.id, updatedProfile);

    if (response) {
      // Cập nhật state hiện tại
      setProfileData(updatedProfile);

      // Cập nhật thông tin người dùng trong context
      if (typeof updateUserInfo === 'function') {
        updateUserInfo({
          ...user,
          fullName: updatedProfile.fullName,
          userImageUrl: avatarUrl,
          studentId: updatedProfile.studentId,
          class: updatedProfile.class,
          facultyId: updatedProfile.facultyId
        });
      }

      toast.success('Cập nhật thông tin thành công!');
      setIsEditing(false);

      // Hiển thị hiệu ứng xác nhận
      setShowUpdateSuccess(true);
      setTimeout(() => {
        setShowUpdateSuccess(false);
      }, 300);
    } else {
      toast.error('Không nhận được phản hồi từ server.');
    }
  } catch (error) {
    console.error('Error in saveProfileData:', error);
    toast.error('Lỗi khi lưu thông tin cá nhân.');
  } finally {
    setIsSaving(false);
  }
  };



  if (isLoading || authLoading) {
    return <PageLoader message="Đang tải thông tin cá nhân..." />;
  }

  if (!profileData) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <PageWrapper>
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <h2>Không thể tải thông tin cá nhân.</h2>
            <p>Vui lòng thử lại sau hoặc liên hệ hỗ trợ.</p>
            <Button
              onClick={() => window.location.reload()}
              variant="primary"
              style={{ marginTop: '1rem' }}
            >
              Tải lại trang
            </Button>
          </div>
        </PageWrapper>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <PageWrapper>
        <PageHeader>
          <h1><FaUser /> Hồ sơ cá nhân</h1>
          <Button
            onClick={handleEditToggle}
            variant="primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {isEditing ? <><FaTimes /> Hủy</> : <><FaPen /> Chỉnh sửa</>}
          </Button>
        </PageHeader>

        <ProfileContainer>
          <ProfileCard>
            {isEditing && (
              <div style={{
                backgroundColor: '#FFFAF0',
                padding: '1rem',
                borderRadius: theme.borderRadius,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <FaBell style={{ color: '#C05621', flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#C05621' }}>
                  Bạn đang ở chế độ chỉnh sửa. Nhập thông tin và nhấn "Lưu thay đổi" khi hoàn tất.
                </p>
              </div>
            )}
            {!isEditing && (
              <EditButton onClick={handleEditToggle} title="Chỉnh sửa thông tin">
                <FaPen />
              </EditButton>
            )}

            <ProfileHeader>
              <ProfileAvatarWrapper>
                <ProfileAvatar>
                  <AvatarImage
                    src={avatarPreview || profileData.userImageUrl || 'https://via.placeholder.com/150?text=DUT'}
                    alt={profileData.fullName || profileData.username}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=DUT' }}
                  />
                </ProfileAvatar>
                {isEditing && (
                  <EditAvatarButton>
                    <FaCamera />
                    <input type="file" accept="image/*" onChange={handleAvatarChange} />
                  </EditAvatarButton>
                )}
              </ProfileAvatarWrapper>

              <ProfileName>
                {profileData.fullName || profileData.username}
                {profileData.emailConfirmed && (
                  <VerificationBadge verified>
                    <MdVerifiedUser /> Đã xác thực
                  </VerificationBadge>
                )}
              </ProfileName>
              <ProfileRole>
                <MdSchool />
                {profileData.class ? `Sinh viên ${profileData.class}` : 'Thành viên Đại học Bách Khoa'}
              </ProfileRole>
            </ProfileHeader>

            <ProfileStats>
              <StatItem>
                <h3>{registeredEvents.length || 0}</h3>
                <p>Sự kiện tham gia</p>
              </StatItem>
              <StatItem>
                <h3>{profileData.facultyName ? '1' : '0'}</h3>
                <p>Khoa</p>
              </StatItem>
            </ProfileStats>

            <InfoSection>
              <SectionTitle>
                <FaIdCard /> Thông tin liên hệ
              </SectionTitle>

              <InfoItem>
                <InfoIconWrapper>
                  <FaEnvelope />
                </InfoIconWrapper>
                <InfoContent>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>{profileData.email || 'Chưa cập nhật'}</InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <InfoIconWrapper color="#EBF4FF" iconColor="#3182CE">
                  <FaIdCard />
                </InfoIconWrapper>
                <InfoContent>
                  <InfoLabel>Mã số sinh viên</InfoLabel>
                  <InfoValue>{profileData.studentId || 'Chưa cập nhật'}</InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <InfoIconWrapper color="#F0FFF4" iconColor="#2F855A">
                  <FaGraduationCap />
                </InfoIconWrapper>
                <InfoContent>
                  <InfoLabel>Lớp</InfoLabel>
                  <InfoValue>{profileData.class || 'Chưa cập nhật'}</InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <InfoIconWrapper color="#F7FAFC" iconColor="#4A5568">
                  <FaBuilding />
                </InfoIconWrapper>
                <InfoContent>
                  <InfoLabel>Khoa</InfoLabel>
                  <InfoValue>{getFacultyName(profileData.facultyId) || 'Chưa cập nhật'}</InfoValue>
                </InfoContent>
              </InfoItem>
            </InfoSection>

            <Divider />
            {isEditing && (
              <ButtonGroup>
                <Button
                  onClick={handleResetForm}
                  variant="secondary"
                  style={{ flex: '0 0 auto' }}
                  disabled={isSaving}
                >
                  <FaUndo /> Đặt lại
                </Button>
                <Button
                  onClick={handleEditToggle}
                  variant="secondary"
                  style={{ flex: 1 }}
                  disabled={isSaving}
                >
                  <FaTimes /> Hủy
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  variant="primary"
                  isLoading={isSaving}
                  disabled={isSaving}
                  style={{ flex: 2 }}
                >
                  {isSaving ? <span>Đang lưu...</span> : <><FaCheck /> Lưu thay đổi</>}
                </Button>
              </ButtonGroup>
            )}
          </ProfileCard>

          <ProfileDetailsCard>
            <TabsContainer>
              <Tab
                active={activeTab === 'info' ? "true" : undefined}
                onClick={() => setActiveTab('info')}
              >
                <FaUser /> Thông tin chi tiết
              </Tab>
              <Tab
                active={activeTab === 'events' ? "true" : undefined}
                onClick={() => setActiveTab('events')}
              >
                <MdEvent /> Sự kiện đã tham gia
              </Tab>
              <Tab
                active={activeTab === 'settings' ? "true" : undefined}
                onClick={() => setActiveTab('settings')}
              >
                <FaCog /> Cài đặt tài khoản
              </Tab>
            </TabsContainer>

            {activeTab === 'info' && (
              <>
                <SectionTitle>
                  <FaUser /> Thông tin cá nhân
                </SectionTitle>

                {isEditing ? (
                  // Edit mode
                  <>
                    <FormGroup>
                      <Input
                        id="fullName"
                        name="fullName"
                        label="Họ và tên"
                        value={editedData.fullName || ''}
                        onChange={handleInputChange}
                        placeholder="Nhập họ và tên của bạn"
                        error={fieldErrors.fullName}
                        required
                      />
                      {fieldErrors.fullName && (
                        <div style={{ color: theme.colors.error, fontSize: '0.8rem', marginTop: '0.25rem' }}>
                          {fieldErrors.fullName}
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Input
                        id="email"
                        name="email"
                        label="Email"
                        value={editedData.email || ''}
                        onChange={handleInputChange}
                        placeholder="Nhập địa chỉ email của bạn"
                        disabled
                        icon={<FaEnvelope />}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Input
                        id="studentId"
                        name="studentId"
                        label="Mã số sinh viên"
                        value={editedData.studentId || ''}
                        onChange={handleInputChange}
                        placeholder="Nhập MSSV của bạn"
                        icon={<FaIdCard />}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Input
                        id="class"
                        name="class"
                        label="Lớp"
                        value={editedData.class || ''}
                        onChange={handleInputChange}
                        placeholder="Nhập lớp của bạn"
                        icon={<FaGraduationCap />}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel htmlFor="facultyId">Khoa</FormLabel>
                      <SelectWrapper>
                        <FaBuilding style={{ left: '1rem', top: '50%', position: 'absolute', transform: 'translateY(-50%)', color: '#A0AEC0', pointerEvents: 'none' }} />
                        <SelectWithIcon
                          id="facultyId"
                          name="facultyId"
                          value={editedData.facultyId || ''}
                          onChange={handleInputChange}
                          hasIcon={true}
                          disabled={isLoadingFaculties}
                        >
                          <option value="">-- Chọn khoa --</option>
                          {faculties.map(faculty => (
                            <option key={faculty.facultyId} value={faculty.facultyId}>
                              {faculty.facultyName}
                            </option>
                          ))}
                        </SelectWithIcon>
                      </SelectWrapper>
                      {isLoadingFaculties && <div style={{ fontSize: '0.8rem', color: theme.colors.textLight, marginTop: '0.25rem' }}>Đang tải danh sách khoa...</div>}
                    </FormGroup>
                  </>
                ) : (
                  // View mode
                  <>
                    <DetailGrid>
                      <InfoItem>
                        <InfoIconWrapper color="#EBF8FF" iconColor="#3182CE">
                          <FaUser />
                        </InfoIconWrapper>
                        <InfoContent>
                          <InfoLabel>Họ và tên</InfoLabel>
                          <InfoValue>{profileData.fullName || 'Chưa cập nhật'}</InfoValue>
                        </InfoContent>
                      </InfoItem>

                      <InfoItem>
                        <InfoIconWrapper color="#EBF4FF" iconColor="#3182CE">
                          <FaEnvelope />
                        </InfoIconWrapper>
                        <InfoContent>
                          <InfoLabel>Email</InfoLabel>
                          <InfoValue>{profileData.email || 'Chưa cập nhật'}</InfoValue>
                        </InfoContent>
                      </InfoItem>

                      <InfoItem>
                        <InfoIconWrapper color="#FEF5F5" iconColor="#E53E3E">
                          <FaIdCard />
                        </InfoIconWrapper>
                        <InfoContent>
                          <InfoLabel>Mã số sinh viên</InfoLabel>
                          <InfoValue>{profileData.studentId || 'Chưa cập nhật'}</InfoValue>
                        </InfoContent>
                      </InfoItem>

                      <InfoItem>
                        <InfoIconWrapper color="#F0FFF4" iconColor="#2F855A">
                          <FaGraduationCap />
                        </InfoIconWrapper>
                        <InfoContent>
                          <InfoLabel>Lớp</InfoLabel>
                          <InfoValue>{profileData.class || 'Chưa cập nhật'}</InfoValue>
                        </InfoContent>
                      </InfoItem>

                      <InfoItem>
                        <InfoIconWrapper color="#F0F5FF" iconColor="#5A67D8">
                          <FaBuilding />
                        </InfoIconWrapper>
                        <InfoContent>
                          <InfoLabel>Khoa</InfoLabel>
                          <InfoValue>{getFacultyName(profileData.facultyId)  || 'Chưa cập nhật'}</InfoValue>
                        </InfoContent>
                      </InfoItem>

                      <InfoItem>
                        <InfoIconWrapper color="#F7FAFC" iconColor="#4A5568">
                          <FaUser />
                        </InfoIconWrapper>
                        <InfoContent>
                          <InfoLabel>Tên đăng nhập</InfoLabel>
                          <InfoValue>{profileData.userName || profileData.username || 'Chưa cập nhật'}</InfoValue>
                        </InfoContent>
                      </InfoItem>
                    </DetailGrid>

                    <Divider />

                    <div>
                      <SectionTitle>
                        <FaIdCard /> Vai trò và quyền hạn
                      </SectionTitle>
                      <DetailGrid>
                        <InfoItem>
                          <InfoIconWrapper color="#EBF8FF" iconColor="#3182CE">
                            <FaUser />
                          </InfoIconWrapper>
                          <InfoContent>
                            <InfoLabel>Vai trò</InfoLabel>
                            <InfoValue>Sinh viên</InfoValue>
                          </InfoContent>
                        </InfoItem>

                        <InfoItem>
                          <InfoIconWrapper color={profileData.emailConfirmed ? "#F0FFF4" : "#FFF5F5"}
                            iconColor={profileData.emailConfirmed ? "#2F855A" : "#E53E3E"}>
                            {profileData.emailConfirmed ? <FaCheck /> : <FaTimes />}
                          </InfoIconWrapper>
                          <InfoContent>
                            <InfoLabel>Trạng thái xác thực</InfoLabel>
                            <InfoValue>
                              {profileData.emailConfirmed ? 'Đã xác thực' : 'Chưa xác thực'}
                            </InfoValue>
                            <BadgeContainer>
                              <Badge type={profileData.emailConfirmed ? 'success' : 'warning'}>
                                {profileData.emailConfirmed ? <FaCheck /> : <FaBell />}
                                {profileData.emailConfirmed ? 'Đã xác thực' : 'Cần xác thực'}
                              </Badge>
                            </BadgeContainer>
                          </InfoContent>
                        </InfoItem>
                      </DetailGrid>
                    </div>
                  </>
                )}
              </>
            )}

            {activeTab === 'events' && (
              <>
                <SectionTitle>
                  <MdEvent /> Sự kiện đã tham gia
                </SectionTitle>

                {registeredEvents && registeredEvents.length > 0 ? (
                  <EventsList>
                    {registeredEvents.map(event => (
                      <EventCard key={event.id}>
                        <EventImage>
                          <img src={event.image} alt={event.name} />
                        </EventImage>
                        <EventContent>
                          <h3>{event.name}</h3>
                          <p>
                            <MdLocationOn style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                            {event.location}
                          </p>
                        </EventContent>
                        <EventDate>
                          <p>
                            <FaCalendarAlt style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                            {event.date}
                          </p>
                          <StatusBadge
                            type={event.status === 'completed' ? 'success' : 'info'}
                          >
                            {event.status === 'completed' ? <FaCheck /> : <FaCalendarAlt />}
                            {event.status === 'completed' ? 'Đã tham gia' : 'Đã đăng ký'}
                          </StatusBadge>
                        </EventDate>
                      </EventCard>
                    ))}
                  </EventsList>
                ) : (
                  <NoContent>
                    <MdEvent />
                    <h3>Chưa tham gia sự kiện nào</h3>
                    <p>Bạn chưa đăng ký hoặc tham gia sự kiện nào</p>
                    <Button
                      onClick={() => navigate('/events')}
                      variant="primary"
                      style={{ marginTop: '1rem' }}
                    >
                      Khám phá sự kiện
                    </Button>
                  </NoContent>
                )}
              </>
            )}

            {activeTab === 'settings' && (
              <>
                <SectionTitle>
                  <FaCog /> Cài đặt tài khoản
                </SectionTitle>

                <NoContent>
                  <FaCog />
                  <h3>Tính năng đang phát triển</h3>
                  <p>Chức năng cài đặt tài khoản sẽ sớm được cập nhật</p>
                </NoContent>
              </>
            )}
            {showUpdateSuccess && (
              <UpdateSuccessMessage>
                <FaCheckCircle /> Cập nhật thông tin thành công!
              </UpdateSuccessMessage>
            )}
          </ProfileDetailsCard>
        </ProfileContainer>
      </PageWrapper>
    </ThemeProvider>

  );
};

export default MyProfile;