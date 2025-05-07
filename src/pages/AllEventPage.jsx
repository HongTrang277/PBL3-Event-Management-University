// src/pages/AllEventPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import styled, { ThemeProvider } from 'styled-components'; // Thêm ThemeProvider nếu cần ở đây
import { getAllEvents } from '../services/mockData';
import EventSearchBar from '../components/features/Search/EventSearchBar/EventSearchBar';
import EventCard from '../components/features/Events/EventCard/EventCard';
// import { ROLES } from '../utils/constants'; // Bỏ comment nếu dùng
import { FACULTIES } from '../utils/constants'; // Import FACULTIES

// --- Theme (Copy từ LoginPage hoặc import từ file chung) ---
const theme = {
    colors: {
        primary: '#a8e0fd',
        'primary-1': "#47c1ff",
        'primary-2': "#ddf4ff", // Dùng cho nền phụ, hover
        'primary-3': "#003652", // Dùng cho text đậm, tiêu đề, nút chính
        'primary-4': "#5ba2dd", // Dùng cho focus, link, nút chính hover?
        'primary-5': "#b1dcff", // Dùng cho nền nhạt hơn
        'primary-6': "#ceeeff", // Dùng cho tag background
        'custom-gray': {
             100: '#f7fafc', 200: '#edf2f7', 300: '#e2e8f0',
             400: '#cbd5e0', 500: '#a0aec0', 600: '#718096',
             700: '#4a5568', 800: '#2d3748', 900: '#1a202c',
        },
        white: '#ffffff',
        focusBorder: '#5ba2dd', // primary-4
        inputBorder: '#cbd5e0', // custom-gray-400
        placeholderText: '#a0aec0', // custom-gray-500
        danger: '#ef4444', // Màu đỏ cho lỗi
        dangerBg: '#fee2e2',
        dangerBorder: '#fca5a5',
    },
    fontFamily: {
       'nutito-sans': ['"Nunito Sans"', 'sans-serif'],
       'dm-sans': ['"DM Sans"', 'sans-serif'],
    },
     borderRadius: {
        'lg': '0.5rem',
        'md': '0.375rem',
     },
      boxShadow: {
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
     },
};

// --- Styled Components ---
const PageWrapper = styled.div`
  padding: 1.5rem; /* Giữ padding gốc của trang */
  font-family: ${props => props.theme.fontFamily['nutito-sans']};
`;

const Header = styled.h1`
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors['primary-3']}; /* Màu chữ đậm chính */
  font-family: ${props => props.theme.fontFamily['dm-sans']};
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem; /* Tăng khoảng cách dưới */
  padding: 1.25rem; /* Tăng padding */
  background-color: ${props => props.theme.colors.white}; /* Nền trắng */
  border-radius: ${props => props.theme.borderRadius.lg}; /* Bo góc lớn hơn */
  border: 1px solid ${props => props.theme.colors['custom-gray'][200]}; /* Viền xám nhạt */
  box-shadow: ${props => props.theme.boxShadow.md}; /* Thêm bóng đổ nhẹ */
`;

const FilterGroup = styled.div`
  flex: 1 1 200px; /* Cho phép các group co giãn, min-width 200px */
  min-width: 180px; /* Đảm bảo select không quá nhỏ */
`;

// Style lại Select để giống Input hơn
const StyledSelect = styled.select`
    width: 100%;
    padding: 0.65rem 1rem; /* Điều chỉnh padding cho giống Input hơn */
    font-size: 0.875rem; /* text-sm */
    font-family: ${props => props.theme.fontFamily['nutito-sans']};
    color: ${props => props.theme.colors['custom-gray'][900]};
    background-color: ${props => props.theme.colors.white};
    border: 1px solid ${props => props.theme.colors.inputBorder};
    border-radius: ${props => props.theme.borderRadius.md};
    appearance: none; /* Gỡ bỏ giao diện mặc định */
    background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z" clip-rule="evenodd" fill="${props => props.theme.colors['custom-gray'][500].replace('#', '%23')}"/></svg>'); /* Dùng màu xám cho mũi tên */
    background-position: right 0.75rem center;
    background-repeat: no-repeat;
    background-size: 1.25em 1.25em;
    padding-right: 2.5rem; /* Đảm bảo đủ chỗ cho mũi tên */
    transition: border-color 0.2s;

    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.focusBorder}; /* Màu focus primary */
        box-shadow: 0 0 0 1px ${props => props.theme.colors.focusBorder}; /* Ring focus primary */
    }
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const StatusText = styled.p`
  text-align: center;
  padding: 3rem 1rem;
  color: ${props => props.theme.colors['custom-gray'][600]};
  font-size: 1rem;
  background-color: ${props => props.theme.colors['custom-gray'][100]};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-top: 1rem;
`;

const ErrorText = styled(StatusText)`
  color: ${props => props.theme.colors.danger};
  background-color: ${props => props.theme.colors.dangerBg};
  border: 1px solid ${props => props.theme.colors.dangerBorder};
`;


// --- Component Logic ---
const AdminAllEventsPage = () => {
    const [allEvents, setAllEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState('');

    useEffect(() => {
      const fetchAllEvents = async () => {
          setIsLoading(true);
          setError(null);
          try {
              const response = await getAllEvents();
              // Sắp xếp theo ngày bắt đầu gần nhất trước
              const sortedEvents = (response.data || []).sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
              setAllEvents(sortedEvents);
          } catch (err) {
              setError(err.message || 'Không thể tải danh sách sự kiện.');
              setAllEvents([]);
          } finally {
              setIsLoading(false);
          }
      };
      fetchAllEvents();
    }, []);

    const filteredEvents = useMemo(() => {
        return allEvents.filter(event => {
            const lowerSearchTerm = searchTerm.toLowerCase();
            const matchesSearch = searchTerm === '' ||
                event.event_name.toLowerCase().includes(lowerSearchTerm) ||
                event.description.toLowerCase().includes(lowerSearchTerm) ||
                (event.tags && event.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm)));

            const matchesStatus = selectedStatus === '' || event.approval_status === selectedStatus;
            const matchesFaculty = selectedFaculty === '' || event.host_id === selectedFaculty;

            return matchesSearch && matchesStatus && matchesFaculty;
        });
    }, [allEvents, searchTerm, selectedStatus, selectedFaculty]);

    const handleSearch = (term) => setSearchTerm(term);
    const handleStatusChange = (e) => setSelectedStatus(e.target.value);
    const handleFacultyChange = (e) => setSelectedFaculty(e.target.value);

    // Tạo danh sách Khoa/Đơn vị duy nhất từ ALL faculties/constants (để đảm bảo đủ)
    const uniqueFaculties = useMemo(() => {
        // Lấy từ constants để đảm bảo đủ, thay vì chỉ dựa vào event đã có
         return ['', ...FACULTIES.sort()]; // Thêm option "Tất cả" và sắp xếp
    }, []);

    return (
         // Cung cấp theme cho toàn bộ page và các component con của nó
        <ThemeProvider theme={theme}>
            <PageWrapper>
                <Header>Quản lý Sự kiện (Tất cả)</Header>

                <FilterBar>
                    {/* Search Input - chiếm nhiều không gian hơn */}
                    <FilterGroup style={{ flexGrow: 2 }}>
                        <EventSearchBar onSearch={handleSearch} placeholder="Tìm tên, mô tả, tag..." />
                    </FilterGroup>

                    {/* Filter theo Trạng thái */}
                    <FilterGroup>
                         {/* <label htmlFor="status-select">Trạng thái</label>  Optional label */}
                        <StyledSelect id="status-select" value={selectedStatus} onChange={handleStatusChange}>
                            <option value="">Tất cả trạng thái</option>
                            <option value="pending">Chờ duyệt</option>
                            <option value="approved">Đã duyệt</option>
                            <option value="rejected">Đã từ chối</option>
                        </StyledSelect>
                    </FilterGroup>

                    {/* Filter theo Khoa/Đơn vị */}
                    <FilterGroup>
                         {/* <label htmlFor="faculty-select">Đơn vị tổ chức</label> Optional label */}
                        <StyledSelect id="faculty-select" value={selectedFaculty} onChange={handleFacultyChange}>
                           {uniqueFaculties.map(faculty => (
                                <option key={faculty || 'all'} value={faculty}>
                                    {faculty === '' ? 'Tất cả đơn vị' : faculty}
                                </option>
                            ))}
                        </StyledSelect>
                    </FilterGroup>
                </FilterBar>

                {/* Event Grid Section */}
                <section>
                    {isLoading && <StatusText>Đang tải danh sách sự kiện...</StatusText>}
                    {error && <ErrorText>Lỗi: {error}</ErrorText>}
                    {!isLoading && !error && (
                        filteredEvents.length > 0 ? (
                            <EventGrid>
                                {filteredEvents.map((event) => (
                                     // Truyền isAdminView để hiện nút Sửa
                                     // EventCard giờ sẽ nhận theme từ ThemeProvider cha
                                    <EventCard key={event.event_id} event={event} isAdminView={true} />
                                ))}
                            </EventGrid>
                        ) : (
                            <StatusText>Không tìm thấy sự kiện nào phù hợp.</StatusText>
                        )
                    )}
                </section>
            </PageWrapper>
        </ThemeProvider>
    );
};

export default AdminAllEventsPage;