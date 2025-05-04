import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { getAllEvents } from '../services/mockData'; // Sử dụng hàm lấy TẤT CẢ event
import EventSearchBar from '../components/features/Search/EventSearchBar/EventSearchBar';
import EventCard from '../components/features/Events/EventCard/EventCard';
import { ROLES } from '../utils/constants'; // Giả sử bạn có constants cho status
// Giả sử bạn có component Select hoặc dùng thẻ select thông thường
// import Select from '../components/common/Select/Select';

// --- Styled Components (Có thể tái sử dụng hoặc tạo mới nếu cần) ---
const PageWrapper = styled.div`
  padding: 1.5rem;
  /* Thêm style nếu cần để phối hợp với AdminLayout */
`;

const Header = styled.h1`
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700; /* font-bold */
  margin-bottom: 1.5rem;
  color: #1f2937; /* text-gray-800 */
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap; /* Cho phép xuống dòng trên màn hình nhỏ */
  gap: 1rem; /* Khoảng cách giữa các filter */
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9fafb; /* bg-gray-50 */
  border-radius: 0.5rem; /* rounded-lg */
`;

// Style cơ bản cho select (nếu dùng thẻ select thường)
const StyledSelect = styled.select`
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db; /* border-gray-300 */
    border-radius: 0.375rem; /* rounded-md */
    background-color: #ffffff;
    flex-grow: 1; /* Cho phép select co giãn */
    min-width: 150px; /* Đặt chiều rộng tối thiểu */

    &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
        border-color: #2563eb; /* focus:border-blue-500 */
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); /* focus:ring-blue-500 focus:ring-opacity-50 */
    }
`;


const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const LoadingText = styled.p`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

const ErrorText = styled.p`
  text-align: center;
  padding: 2rem;
  color: #dc2626;
`;

const NoEventsText = styled.p`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

// --- Component ---
const AdminAllEventsPage = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // --- Filter States ---
  const [selectedStatus, setSelectedStatus] = useState(''); // '', 'pending', 'approved', 'rejected'
  const [selectedFaculty, setSelectedFaculty] = useState(''); // '', 'Khoa CNTT', 'Khoa Cơ khí', ...
  // Thêm các state filter khác nếu cần (ví dụ: date range, tags)

  // Fetch all events khi component mount
  useEffect(() => {
    const fetchAllEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Đảm bảo getAllEvents trả về TẤT CẢ sự kiện cho admin
        const response = await getAllEvents();
        setAllEvents(response.data || []);
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách sự kiện.');
        setAllEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllEvents();
  }, []);

  // --- Filtering Logic ---
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      // 1. Lọc theo Search Term (tên, mô tả)
      const matchesSearch = searchTerm === '' ||
        event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Lọc theo Status
      const matchesStatus = selectedStatus === '' || event.approval_status === selectedStatus;

      // 3. Lọc theo Khoa/Đơn vị tổ chức (host_id)
      const matchesFaculty = selectedFaculty === '' || event.host_id === selectedFaculty;

      // 4. Kết hợp các điều kiện lọc
      // Thêm các điều kiện lọc khác ở đây (&& matchesDate && matchesTags)
      return matchesSearch && matchesStatus && matchesFaculty;
    });
  }, [allEvents, searchTerm, selectedStatus, selectedFaculty]); // Dependencies cho useMemo

  // --- Event Handlers ---
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

   const handleFacultyChange = (e) => {
    setSelectedFaculty(e.target.value);
  };


  // Lấy danh sách các khoa/đơn vị tổ chức duy nhất từ sự kiện để làm options cho filter
  const uniqueFaculties = useMemo(() => {
    const faculties = new Set(allEvents.map(event => event.host_id).filter(Boolean)); // Lọc bỏ giá trị null/undefined
    return ['', ...Array.from(faculties).sort()]; // Thêm option "Tất cả" và sắp xếp
  }, [allEvents]);


  return (
    <PageWrapper>
      <Header>Quản lý Sự kiện (Tất cả)</Header>

      {/* Filter Bar */}
      <FilterBar>
        {/* Search Input */}
        <div style={{ flexGrow: 2 }}> {/* Cho phép search bar rộng hơn */}
            <EventSearchBar onSearch={handleSearch} placeholder="Tìm kiếm sự kiện theo tên, mô tả..." />
        </div>

        {/* Filter theo Trạng thái */}
        <StyledSelect value={selectedStatus} onChange={handleStatusChange}>
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Đã từ chối</option>
          {/* Thêm các trạng thái khác nếu có */}
        </StyledSelect>

         {/* Filter theo Khoa/Đơn vị tổ chức */}
        <StyledSelect value={selectedFaculty} onChange={handleFacultyChange}>
           {uniqueFaculties.map(faculty => (
                <option key={faculty || 'all'} value={faculty}>
                    {faculty === '' ? 'Tất cả đơn vị' : faculty}
                </option>
           ))}
        </StyledSelect>

        {/* Thêm các filter khác ở đây (ví dụ: Date Range Picker, Tag Select) */}

      </FilterBar>

      {/* Event Grid Section */}
      <section>
        {isLoading && <LoadingText>Đang tải danh sách sự kiện...</LoadingText>}
        {error && <ErrorText>Lỗi: {error}</ErrorText>}
        {!isLoading && !error && (
          <EventGrid>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                // Truyền isAdminView={true} để EventCard có thể hiển thị các nút action cho admin
                <EventCard key={event.event_id} event={event} isAdminView={true} />
              ))
            ) : (
              <NoEventsText>Không tìm thấy sự kiện nào phù hợp với bộ lọc.</NoEventsText>
            )}
          </EventGrid>
        )}
      </section>

    </PageWrapper>
  );
};

export default AdminAllEventsPage;