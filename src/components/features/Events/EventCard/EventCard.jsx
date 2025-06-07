// src/components/features/Events/EventCard/EventCard.jsx
// Bỏ 'useTheme' nếu không còn sử dụng trực tiếp nữa
import React, {useState, useEffect, useMemo} from 'react';
import ReactDOM from 'react-dom';
import styled /* , { useTheme } */ from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { formatDate } from '../../../../utils/helpers';
import { ATTENDANCE_TYPES, ROLES } from '../../../../utils/constants';
import Button from '../../../common/Button/Button';
import { authService, uploadService, registrationService, facultyService } from '../../../../services/api';
import { format, differenceInDays, isPast, isFuture, isToday } from 'date-fns';
import { vi } from 'date-fns/locale';
import {FaUsers, FaSearch, FaTimes, FaIdCard, FaEnvelope, FaSchool, FaChalkboard, FaFileExcel} from 'react-icons/fa';
import * as XLSX from 'xlsx';


// --- Styled Icons (Giữ nguyên) ---
//! Thêm constants cho trạng thái sự kiện
const EVENT_STATUS = {
    UPCOMING: 'upcoming',
    ONGOING: 'ongoing',
    PAST: 'past',
};

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
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const ModalContent = styled.div`
  background-color: #f9fafb; // Màu nền nhẹ nhàng hơn
  padding: 0; // Bỏ padding cũ để chia layout header/content/footer
  border-radius: 0.75rem;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-20px)'};
  transition: all 0.3s ease;
  overflow: hidden; // Quan trọng để bo góc hoạt động đúng
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: white;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #9ca3af;
  line-height: 1;
  &:hover { color: #6b7280; }
`;

const SearchAndActions = styled.div`
    padding: 1rem 1.5rem;
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
`;

const SearchBarContainer = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 1px #3b82f6; }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const RegistrantListContainer = styled.div`
  overflow-y: auto;
  flex-grow: 1;
  padding: 1rem 1.5rem;
`;

// Thẻ thông tin người đăng ký
const RegistrantCard = styled.div`
    background-color: white;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    border: 1px solid #e5e7eb;
    transition: all 0.2s ease-in-out;

    &:hover {
        border-color: #3b82f6;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    }
`;

const Avatar = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #dbeafe;
    color: #1e40af;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.25rem;
    flex-shrink: 0; // Không bị co lại
`;

const UserInfo = styled.div`
    flex-grow: 1;
    min-width: 0; // Quan trọng để text-overflow hoạt động
`;

const FullName = styled.p`
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.25rem 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Email = styled.p`
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const UserDetails = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.5rem 1rem;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px dashed #e5e7eb;
    width: 100%;
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: #374151;
    gap: 0.5rem;

    svg {
        color: #9ca3af;
        flex-shrink: 0;
    }
    span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const ModalFooter = styled.div`
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const SummaryText = styled.p`
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
`;

const ExportButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    background-color: #ffffff;
    color: #374151;
    font-weight: 500;
    font-size: 0.875rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: #f9fafb;
        border-color: #9ca3af;
    }

    svg {
        color: #166534; // Màu xanh của Excel
    }
`;

const EmptyStateContainer = styled.div`
    text-align: center;
    padding: 3rem 1rem;
    color: #6b7280;
    
    svg {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #d1d5db;
    }

    p {
        font-size: 1rem;
        margin: 0;
    }
`;

// Thêm styled components cho Status Badge
const StatusBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.375rem;
  
  background-color: ${props => {
        switch (props.status) {
            case EVENT_STATUS.ONGOING:
                return props.theme?.colors?.['success-light'] || 'rgba(52, 211, 153, 0.2)';
            case EVENT_STATUS.UPCOMING:
                return props.theme?.colors?.['primary-light'] || 'rgba(59, 130, 246, 0.2)';
            case EVENT_STATUS.PAST:
                return props.theme?.colors?.['custom-gray']?.[200] || '#e5e7eb';
            default:
                return props.theme?.colors?.['custom-gray']?.[200] || '#e5e7eb';
        }
    }};
  
  color: ${props => {
        switch (props.status) {
            case EVENT_STATUS.ONGOING:
                return props.theme?.colors?.['success'] || '#10b981';
            case EVENT_STATUS.UPCOMING:
                return props.theme?.colors?.['primary'] || '#3b82f6';
            case EVENT_STATUS.PAST:
                return props.theme?.colors?.['custom-gray']?.[700] || '#4b5563';
            default:
                return props.theme?.colors?.['custom-gray']?.[700] || '#4b5563';
        }
    }};
`;
const IconWrapper = styled.span`
    display: inline-flex;
    align-items: center;
    margin-right: 0.35rem;
    color: ${props => props.theme?.colors?.['custom-gray']?.[600] || '#6b7280'};
    svg {
        height: 1rem;
        width: 1rem;
    }
`;
const OngoingIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
);

const UpcomingIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V12L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
);

const PastIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CalendarIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></IconWrapper>;
const LocationIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></IconWrapper>;
const TagIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 8V5a2 2 0 012-2h2zM7 11h.01" /></svg></IconWrapper>;

// --- Styled Components (Sử dụng props.theme với fallback) ---
const CardWrapper = styled.div`
  background-color: ${props => props.theme?.colors?.white || '#ffffff'};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -5px rgba(0, 0, 0, 0.04);
    transform: translateY(-4px);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => {
        switch (props.status) {
            case EVENT_STATUS.ONGOING:
                return 'linear-gradient(90deg, #10b981 0%, #34d399 100%)';
            case EVENT_STATUS.UPCOMING:
                return 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)';
            case EVENT_STATUS.PAST:
                return 'linear-gradient(90deg, #9ca3af 0%, #d1d5db 100%)';
            default:
                return 'linear-gradient(90deg, #9ca3af 0%, #d1d5db 100%)';
        }
    }};
    z-index: 1;
  }
`;


const ImageContainer = styled.div`
  height: 12rem;
  background-color: ${props => props.theme?.colors?.['custom-gray']?.[200] || '#e5e7eb'};
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);
    z-index: 1;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: ${props => props.fit === 'contain' ? 'contain' : 'cover'};
  padding: ${props => props.fit === 'contain' ? '0.5rem' : '0'};
  transition: transform 0.5s ease;
  ${CardWrapper}:hover & {
    transform: scale(1.05);
  }
`;
//them date badge o goc anh
const DateBadge = styled.div`
  position: absolute;
  left: 0.75rem;
  bottom: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 4rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  .month {
    font-size: 0.7rem;
    text-transform: uppercase;
    font-weight: 600;
    color: ${props => props.theme?.colors?.['custom-gray']?.[600] || '#4b5563'};
    line-height: 1;
  }
  
  .day {
    font-size: 1.2rem;
    font-weight: 700;
    color: ${props => props.theme?.colors?.['primary-3'] || '#1f2937'};
    line-height: 1.2;
  }
`;
const SmallLogoOverlay = styled.img`
    position: absolute;
    bottom: 0.75rem;
    left: 0.75rem;
    height: 3.5rem;
    width: 3.5rem;
    border-radius: 50%;
    background-color: ${props => props.theme?.colors?.white || '#ffffff'};
    padding: 0.25rem;
    border: 2px solid ${props => props.theme?.colors?.['custom-gray']?.[300] || '#d1d5db'};
    object-fit: contain;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ContentArea = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  line-height: 1.4;
  font-weight: 700;
  color: ${props => props.theme?.colors?.['primary-3'] || '#1f2937'};
  margin-bottom: 0.75rem;
  font-family: ${props => props.theme?.fontFamily?.['dm-sans'] || "'DM Sans', sans-serif"};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: calc(1.25rem * 1.4 * 2);
  position: relative;
  padding-bottom: 0.375rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 2rem;
    height: 3px;
    background-color: ${props => props.theme?.colors?.['primary'] || '#3b82f6'};
    border-radius: 3px;
  }
`;

const HostInfo = styled.p`
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: ${props => props.theme?.colors?.['custom-gray']?.[700] || '#4b5563'};
    margin-bottom: 0.75rem;
    span {
        font-weight: 600;
    }
`;

const DetailsSection = styled.div`
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: ${props => props.theme?.colors?.['custom-gray']?.[700] || '#4b5563'};
    margin-bottom: 0.75rem;
    & > * + * {
        margin-top: 0.375rem;
    }
`;

const DetailItem = styled.div`
    display: flex;
    align-items: center;
`;

const DetailText = styled.span`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const TagSection = styled.div`
    font-size: 0.875rem;
    color: ${props => props.theme?.colors?.['custom-gray']?.[700] || '#4b5563'};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.375rem;
`;

const TagBadge = styled.span`
    padding: 0.25rem 0.625rem;
    background-color: ${props => props.theme?.colors?.['primary-2'] || '#dbeafe'};
    color: ${props => props.theme?.colors?.['primary-3'] || '#1e40af'};
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: ${props => props.theme?.borderRadius?.full || '9999px'};
    line-height: 1;
`;

const MoreTagsBadge = styled(TagBadge)`
    background-color: ${props => props.theme?.colors?.['custom-gray']?.[200] || '#e5e7eb'};
    color: ${props => props.theme?.colors?.['custom-gray']?.[700] || '#4b5563'};
`;

const ActionsArea = styled.div`
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme?.colors?.['custom-gray']?.[200] || '#f3f4f6'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
`;

const RegisteredUsersModal = ({ isOpen, onClose, eventId, eventName }) => {
    const [registrants, setRegistrants] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const facultyData = await facultyService.getAllFaculties();
                setFaculties(facultyData || []);
            } catch (err) { console.error("Could not fetch faculties", err); }
        };
        fetchFaculties();
    }, []);

    useEffect(() => {
        if (isOpen && eventId) {
            const fetchRegistrants = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const data = await registrationService.getUsersRegisteredForEvent(eventId);
                    setRegistrants(Array.isArray(data) ? data : []);
                } catch (err) {
                    setError("Không thể tải danh sách người đăng ký.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchRegistrants();
        }
    }, [isOpen, eventId]);

    const getFacultyName = (facultyId) => {
        if (!facultyId || faculties.length === 0) return 'N/A';
        const faculty = faculties.find(f => f.facultyId === facultyId);
        return faculty ? faculty.facultyName : 'Không rõ';
    };

    const filteredRegistrants = useMemo(() => {
        if (!searchTerm) return registrants;
        const lowercasedFilter = searchTerm.toLowerCase();
        return registrants.filter(user => 
            (user.fullName && user.fullName.toLowerCase().includes(lowercasedFilter)) ||
            (user.studentId && user.studentId.toLowerCase().includes(lowercasedFilter)) ||
            (user.email && user.email.toLowerCase().includes(lowercasedFilter)) ||
            (user.class && user.class.toLowerCase().includes(lowercasedFilter)) ||
            getFacultyName(user.facultyId).toLowerCase().includes(lowercasedFilter)
        );
    }, [searchTerm, registrants, faculties]);
        // Hàm xuất Excel
    const handleExport = () => {
        const dataToExport = filteredRegistrants.map(user => ({
            'Họ và Tên': user.fullName || 'N/A',
            'MSSV': user.studentId || 'N/A',
            'Email': user.email,
            'Lớp': user.class || 'N/A',
            'Khoa': getFacultyName(user.facultyId)
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachDangKy");

        // Đặt tên file
        const safeEventName = eventName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        XLSX.writeFile(workbook, `DSDK_${safeEventName}.xlsx`);
    };
    
    // Hàm lấy chữ cái đầu
    const getInitials = (name) => {
      if (!name) return '?';
      const nameParts = name.split(' ');
      const initials = nameParts.length > 1
          ? nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
          : nameParts[0].charAt(0);
      return initials.toUpperCase();
    }

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <ModalOverlay $isOpen={isOpen} onClick={onClose}>
            <ModalContent isOpen={isOpen} onClick={e => e.stopPropagation()}>
                <ModalHeader>
                    {/* Hiển thị tổng số người đăng ký */}
                    <h2>DS Đăng ký ({registrants.length} người): {eventName}</h2>
                    <CloseButton onClick={onClose}><FaTimes /></CloseButton>
                </ModalHeader>

                <SearchAndActions>
                    <SearchBarContainer>
                        <SearchIcon />
                        <SearchInput type="text" placeholder="Tìm theo tên, MSSV, lớp, khoa..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </SearchBarContainer>
                </SearchAndActions>

                {/* Render danh sách thẻ */}
                <RegistrantListContainer>
                    {isLoading && <p style={{textAlign: 'center'}}>Đang tải...</p>}
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    {!isLoading && !error && (
                        <>
                            {filteredRegistrants.length > 0 ? (
                                filteredRegistrants.map((user) => (
                                    <RegistrantCard key={user.id}>
                                        <Avatar>{getInitials(user.fullName)}</Avatar>
                                        <div style={{ flexGrow: 1, minWidth: 0 }}>
                                            <UserInfo>
                                                <FullName title={user.fullName}>{user.fullName || 'N/A'}</FullName>
                                                <Email title={user.email}>
                                                    <FaEnvelope />
                                                    {user.email}
                                                </Email>
                                            </UserInfo>
                                            <UserDetails>
                                                <InfoItem title={user.studentId}>
                                                    <FaIdCard />
                                                    <span>{user.studentId || 'N/A'}</span>
                                                </InfoItem>
                                                <InfoItem title={user.class}>
                                                    {/* Sử dụng FaChalkboard đã import */}
                                                    <FaChalkboard />
                                                    <span>{user.class || 'N/A'}</span>
                                                </InfoItem>
                                                <InfoItem title={getFacultyName(user.facultyId)}>
                                                    <FaSchool />
                                                    <span>{getFacultyName(user.facultyId)}</span>
                                                </InfoItem>
                                            </UserDetails>
                                        </div>
                                    </RegistrantCard>
                                ))
                            ) : (
                                // Giao diện khi không có dữ liệu
                                <EmptyStateContainer>
                                    <FaUsers />
                                    <p>{searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có ai đăng ký sự kiện này.'}</p>
                                </EmptyStateContainer>
                            )}
                        </>
                    )}
                </RegistrantListContainer>
                
                {/* Footer với nút export */}
                <ModalFooter>
                    <SummaryText>
                        {filteredRegistrants.length > 0
                          ? `Hiển thị ${filteredRegistrants.length} / ${registrants.length} người đăng ký.`
                          : 'Không có dữ liệu.'
                        }
                    </SummaryText>
                    {filteredRegistrants.length > 0 && (
                        <ExportButton onClick={handleExport}>
                            <FaFileExcel />
                            Xuất Excel
                        </ExportButton>
                    )}
                </ModalFooter>

            </ModalContent>
        </ModalOverlay>,
        document.body
    );
};


// --- Component chính EventCard ---
const EventCard = ({
    event,
    isAdminView = false,
    isRegisteredView = false,
    isAlreadyRegistered = false,
    onRegister,
    onUnregister,
    onDeleteRequest, // Prop cho chức năng xóa
}) => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [hostInfo, setHostInfo] = useState(null);
    const [isLoadingHost, setIsLoadingHost] = useState(false);
    const [eventStatus, setEventStatus] = useState(null);
    const [isRegisteredModalOpen, setRegisteredModalOpen] = useState(false);

    console.log(`Event: "${event?.eventName}" - isRegisteredModalOpen:`, isRegisteredModalOpen);

    if (!event) {
        console.warn("EventCard: event prop is null or undefined.");
        return null;
    }

    const event_id_from_api = event.eventId;
    const event_name_from_api = event.eventName || "Tên sự kiện không xác định";
    const cover_url_from_api = event.coverUrl;
    const logo_url_from_api = event.logoUrl;
    const host_id_from_api = event.hostId;
    const start_date_from_api = event.startDate;
    const end_date_from_api = event.endDate || null; // Có thể không có ngày kết thúc
    const location_from_api = event.location;
    const attendance_type_from_api = event.attendanceType;
    const tags_from_api = Array.isArray(event.tagsList) ? event.tagsList : (Array.isArray(event.tags) ? event.tags : []);

    const displayTags = tags_from_api.slice(0, 2);
    const remainingTagsCount = Math.max(0, tags_from_api.length - 2);
    // Thêm useEffect để xác định trạng thái sự kiện
    useEffect(() => {
        const determineEventStatus = () => {
            if (!start_date_from_api) {
                return EVENT_STATUS.UPCOMING;
            }

            const startDate = new Date(start_date_from_api);
            const endDate = end_date_from_api ? new Date(end_date_from_api) : null;
            const now = new Date();

            // Nếu có ngày kết thúc
            if (endDate) {
                if (now > endDate) {
                    return EVENT_STATUS.PAST;  // Đã kết thúc
                } else if (now >= startDate && now <= endDate) {
                    return EVENT_STATUS.ONGOING;  // Đang diễn ra
                } else {
                    return EVENT_STATUS.UPCOMING;  // Sắp diễn ra
                }
            } else {
                // Nếu chỉ có ngày bắt đầu
                // Giả định sự kiện diễn ra trong 1 ngày
                if (isPast(new Date(startDate.setHours(23, 59, 59)))) {
                    return EVENT_STATUS.PAST;  // Đã qua ngày sự kiện
                } else if (isToday(startDate)) {
                    return EVENT_STATUS.ONGOING;  // Ngay hôm nay
                } else if (isFuture(startDate)) {
                    return EVENT_STATUS.UPCOMING;  // Trong tương lai
                }
            }

            return EVENT_STATUS.UPCOMING; // Mặc định
        };

        setEventStatus(determineEventStatus());
    }, [start_date_from_api, end_date_from_api]);
    // Thêm useEffect để fetch thông tin người tổ chức
    useEffect(() => {
        const fetchHostInfo = async () => {
            if (host_id_from_api) {
                setIsLoadingHost(true);
                try {
                    // Add debug logging to see the API call
                    console.log("Fetching host info for ID:", host_id_from_api);

                    const response = await authService.getUserById(host_id_from_api);
                    console.log("Raw API response:", response);

                    if (response) {
                        console.log("Setting host info:", response.data);
                        setHostInfo(response.data);
                    } else {
                        console.warn("No data returned for host ID:", host_id_from_api);
                        // Set fallback so it's not null
                        setHostInfo({ username: "Không xác định" });
                    }
                } catch (error) {
                    console.error("Error fetching host info:", error);
                    // Set fallback on error
                    setHostInfo({ username: "Không xác định" });
                } finally {
                    setIsLoadingHost(false);
                }
            }
        };

        fetchHostInfo();
    }, [host_id_from_api]); // Don't add hostInfo as dependency or it will cause infinite renders

    // 3. Add a separate useEffect for logging the state update
    useEffect(() => {
        if (hostInfo) {
            console.log("Updated hostInfo state:", hostInfo);
        }
    }, [hostInfo]);
    const handleImageError = (e) => {
        e.target.style.display = 'none';
        const parent = e.target.parentNode;
        if (parent && !parent.querySelector('.placeholder-text')) {
            const placeholder = document.createElement('span');
            placeholder.className = 'placeholder-text';
            placeholder.style.color = '#9ca3af';
            placeholder.textContent = 'Lỗi ảnh';
            parent.appendChild(placeholder);
        }
    };

    // Hàm format ngày tháng cho DateBadge
  const formatEventDate = (dateString) => {
    if (!dateString) return { day: "--", month: "---" };
    const date = new Date(dateString);
    return {
      day: format(date, 'dd'),
      month: format(date, 'MMM', { locale: vi }).toUpperCase()
    };
  };
  
  const eventDate = formatEventDate(start_date_from_api);
    const renderActionButtons = () => {
        if (!event_id_from_api) return null;

        const detailButton = (
            <StyledLink to={`/events/${event_id_from_api}`}>
                <Button variant="primary" size="small">
                    Xem chi tiết
                </Button>
            </StyledLink>
        );

        let studentFlowButton = null;
        let adminFlowButtons = null;

        // Logic cho các nút của sinh viên (Đăng ký, Hủy đăng ký) hoặc người dùng chưa đăng nhập
        if (!isAuthenticated) {
            // Nếu người dùng chưa đăng nhập, nút "Đăng ký" sẽ điều hướng đến trang login
            // Hoặc nếu có onRegister (ví dụ từ HomePage), nó sẽ gọi onRegister
            // onRegister từ HomePage đã xử lý việc điều hướng nếu chưa login
            if (onRegister) { // onRegister được truyền từ HomePage
                studentFlowButton = (
                    <Button variant="secondary" size="small" onClick={() => onRegister(event_id_from_api, user?.id)}>
                        Đăng ký
                    </Button>
                );
            } else { // Trường hợp chung, ví dụ từ EventDetailPage nếu không có onRegister cụ thể
                studentFlowButton = (
                    <Button variant="secondary" size="small" onClick={() => navigate('/login', { state: { from: `/events/${event_id_from_api}` } })}>
                        Đăng ký
                    </Button>
                );
            }
        } else if (user.role === ROLES.STUDENT) {
            if (isRegisteredView || isAlreadyRegistered) { // isRegisteredView: xem trang "SK đã ĐK", isAlreadyRegistered: check từ HomePage
                if (onUnregister) { // onUnregister được truyền từ HomePage hoặc trang SK đã ĐK
                    studentFlowButton = (
                        <Button variant="danger" size="small" onClick={() => onUnregister(event_id_from_api, user.id)}>
                            Hủy đăng ký
                        </Button>
                    );
                }
            } else {
                if (onRegister) { // onRegister được truyền từ HomePage
                    studentFlowButton = (
                        <Button variant="secondary" size="small" onClick={() => onRegister(event_id_from_api, user.id)}>
                            Đăng ký
                        </Button>
                    );
                }
            }
        }

        // Logic cho các nút quản trị (Sửa, Xóa) - chỉ hiển thị nếu isAdminView và là chủ sự kiện
        if (isAdminView && user) { // Đảm bảo user tồn tại
            const isOwner = host_id_from_api && String(host_id_from_api) === String(user.id);
            
            // Chuẩn hóa vai trò của người dùng về chữ thường để so sánh cho chính xác
            const userRoleNormalized = String(user.role || '').toLowerCase();

            // Định nghĩa các vai trò có quyền tạo/quản lý sự kiện (bằng chữ thường)
            const creatorRoles = ['organizer', 'event_creator', 'eventcreator', 'union'];
            
            const isCreatorRole = creatorRoles.includes(userRoleNormalized);

            // Người dùng có vai trò creator (Organizer hoặc Union) chỉ có thể quản lý sự kiện nếu họ là chủ sở hữu.
            if (isCreatorRole && isOwner) {
                adminFlowButtons = (
                    <>
                        
                        <Button
                        variant="outline"
                        size="small"
                        onClick={() => setRegisteredModalOpen(true)}
                        title="Xem danh sách đăng ký"
                        style={{ marginRight: '8px' }}
                    >
                        <FaUsers />
                    </Button>

                        <StyledLink to={`/admin/edit-event/${event_id_from_api}`} style={{ textDecoration: 'none' }}>
                            <Button variant="secondary" size="small" style={{ marginRight: '8px' }}>
                                Sửa
                            </Button>
                        </StyledLink>
                        {onDeleteRequest && (
                            <Button
                                variant="danger"
                                size="small"
                                onClick={() => onDeleteRequest(event_id_from_api)}
                            >
                                Hủy sự kiện
                            </Button>
                        )}
                    </>
                );
            }
        }
        // DÒNG 299 CÓ THỂ LÀ CHỖ NÀY TRONG CODE CŨ CỦA BẠN
        // Đảm bảo rằng bạn trả về cấu trúc JSX mới này
        return (
            <ActionsArea>
                {detailButton}
                {/* Gom các nút action (student hoặc admin) vào một div để chúng căn phải cùng nhau */}
                <div>
                    {studentFlowButton}
                    {adminFlowButtons}
                </div>
            </ActionsArea>
        );
    }; // Kết thúc renderActionButtons

    // --- PHẦN JSX CHÍNH CỦA EVENTCARD ---
    // Thay đổi JSX return
    return (
        <>
        <CardWrapper status={eventStatus}>
            <ImageContainer>
                {cover_url_from_api ? (
                    <Image
                        src={cover_url_from_api}
                        alt={`${event_name_from_api} cover`}
                        onError={handleImageError}
                    />
                ) : logo_url_from_api ? (
                    <Image
                        src={logo_url_from_api}
                        alt={`${event_name_from_api} logo`}
                        fit="contain"
                        onError={handleImageError}
                    />
                ) : (
                    <span>Ảnh sự kiện</span>
                )}

                {/* Thêm DateBadge */}
                <DateBadge>
                    <span className="month">{eventDate.month}</span>
                    <span className="day">{eventDate.day}</span>
                </DateBadge>

                {/* Thêm StatusBadge */}
                <StatusBadge status={eventStatus}>
                    {eventStatus === EVENT_STATUS.ONGOING && (
                        <>
                            <OngoingIcon />
                            Đang diễn ra
                        </>
                    )}
                    {eventStatus === EVENT_STATUS.UPCOMING && (
                        <>
                            <UpcomingIcon />
                            Sắp diễn ra
                        </>
                    )}
                    {eventStatus === EVENT_STATUS.PAST && (
                        <>
                            <PastIcon />
                            Đã kết thúc
                        </>
                    )}
                </StatusBadge>

                {/* Logo overlay vẫn giữ nguyên */}
                {cover_url_from_api && logo_url_from_api && (
                    <SmallLogoOverlay
                        src={logo_url_from_api}
                        alt={`${event_name_from_api} logo overlay`}
                        onError={handleImageError}
                    />
                )}
            </ImageContainer>

            <ContentArea>
                <Title title={event_name_from_api}>
                    {event_name_from_api}
                </Title>

                <HostInfo>
                    Tổ chức bởi: <span>
                        {isLoadingHost ? "Đang tải..." :
                            hostInfo ? (hostInfo.fullName || hostInfo.username || hostInfo.email) :
                                "Không xác định"}
                    </span>
                </HostInfo>

                <DetailsSection>
                    {start_date_from_api && (
                        <DetailItem>
                            <CalendarIcon />
                            <DetailText title={formatDate(start_date_from_api)}>
                                {formatDate(start_date_from_api)}
                            </DetailText>
                        </DetailItem>
                    )}
                    <DetailItem>
                        <LocationIcon />
                        <DetailText title={attendance_type_from_api === ATTENDANCE_TYPES.ONLINE ? 'Online' : (location_from_api || 'Chưa cập nhật')}>
                            {attendance_type_from_api === ATTENDANCE_TYPES.ONLINE ? 'Online' : (location_from_api || 'Chưa cập nhật')}
                        </DetailText>
                    </DetailItem>
                </DetailsSection>

                {tags_from_api.length > 0 && (
                    <TagSection>
                        <TagIcon />
                        {displayTags.map((tag, index) => (
                            <TagBadge key={`${tag}-${index}`}>{tag}</TagBadge>
                        ))}
                        {remainingTagsCount > 0 && (
                            <MoreTagsBadge>+{remainingTagsCount}</MoreTagsBadge>
                        )}
                    </TagSection>
                )}

                {renderActionButtons()}
            </ContentArea>
        </CardWrapper>
        <RegisteredUsersModal
                isOpen={isRegisteredModalOpen}
                onClose={() => setRegisteredModalOpen(false)}
                eventId={event_id_from_api}
                eventName={event_name_from_api}
            />
        </>
    );
}; // Kết thúc EventCard component

export default EventCard;