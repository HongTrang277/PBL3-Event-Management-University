// src/pages/AllEventPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
// Bỏ ThemeProvider nếu không sử dụng cục bộ nữa
import styled /*, { ThemeProvider } */ from 'styled-components';
import { eventService } from '../services/api';
import EventSearchBar from '../components/features/Search/EventSearchBar/EventSearchBar';
import EventCard from '../components/features/Events/EventCard/EventCard'; // Giả sử EventCard đã được sửa để không crash khi thiếu theme
import { FACULTIES } from '../utils/constants';

// --- XÓA BỎ ĐỊNH NGHĨA THEME CỤC BỘ ---
// const theme = { ... };

// --- Styled Components (Cập nhật với fallback) ---
const PageWrapper = styled.div`
  padding: 1.5rem;
  font-family: ${props => props.theme?.fontFamily?.['nutito-sans'] || '"Nunito Sans", sans-serif'};
`;

const Header = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${props => props.theme?.colors?.['primary-3'] || '#003652'};
  font-family: ${props => props.theme?.fontFamily?.['dm-sans'] || '"DM Sans", sans-serif'};
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.25rem;
  background-color: ${props => props.theme?.colors?.white || '#ffffff'};
  border-radius: ${props => props.theme?.borderRadius?.lg || '0.5rem'};
  border: 1px solid ${props => props.theme?.colors?.['custom-gray']?.[200] || '#edf2f7'};
  box-shadow: ${props => props.theme?.boxShadow?.md || '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'};
`;

const FilterGroup = styled.div`
  flex: 1 1 200px;
  min-width: 180px;
`;

const StyledSelect = styled.select`
    width: 100%;
    padding: 0.65rem 1rem;
    font-size: 0.875rem;
    font-family: ${props => props.theme?.fontFamily?.['nutito-sans'] || '"Nunito Sans", sans-serif'};
    color: ${props => props.theme?.colors?.['custom-gray']?.[900] || '#1a202c'};
    background-color: ${props => props.theme?.colors?.white || '#ffffff'};
    border: 1px solid ${props => props.theme?.colors?.inputBorder || '#cbd5e0'};
    border-radius: ${props => props.theme?.borderRadius?.md || '0.375rem'};
    appearance: none;
    background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z" clip-rule="evenodd" fill="${props => (props.theme?.colors?.['custom-gray']?.[500] || '#a0aec0').replace('#', '%23')}"/></svg>');
    background-position: right 0.75rem center;
    background-repeat: no-repeat;
    background-size: 1.25em 1.25em;
    padding-right: 2.5rem;
    transition: border-color 0.2s;

    &:focus {
        outline: none;
        border-color: ${props => props.theme?.colors?.focusBorder || '#5ba2dd'};
        box-shadow: 0 0 0 1px ${props => props.theme?.colors?.focusBorder || '#5ba2dd'};
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
  color: ${props => props.theme?.colors?.['custom-gray']?.[600] || '#718096'};
  font-size: 1rem;
  background-color: ${props => props.theme?.colors?.['custom-gray']?.[100] || '#f7fafc'};
  border-radius: ${props => props.theme?.borderRadius?.md || '0.375rem'};
  margin-top: 1rem;
`;

const ErrorText = styled(StatusText)`
  color: ${props => props.theme?.colors?.danger || '#ef4444'};
  background-color: ${props => props.theme?.colors?.dangerBg || '#fee2e2'};
  border: 1px solid ${props => props.theme?.colors?.dangerBorder || '#fca5a5'};
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
                console.log("AdminAllEventsPage: Fetching all events from API...");
                const response = await eventService.getAllEvents();
                console.log("AdminAllEventsPage: Response from API:", response);

                // Giả sử API trả về dữ liệu sự kiện trong response.data (nếu service trả về toàn bộ response)
                // Hoặc response trực tiếp nếu service đã trả về response.data
                const eventsFromApi = response.data || response; // Điều chỉnh tùy theo eventService trả về gì
                console.log("AdminAllEventsPage: Events data extracted:", eventsFromApi);

                if (!Array.isArray(eventsFromApi)) {
                    console.error("AdminAllEventsPage: API did not return an array of events.", eventsFromApi);
                    setError("Dữ liệu sự kiện trả về không hợp lệ.");
                    setAllEvents([]);
                    setIsLoading(false);
                    return;
                }

                const sortedEvents = eventsFromApi.sort((a, b) => {
                    // API mẫu trả về eventId, eventName, hostId, startDate (camelCase)
                    const dateA = new Date(a.startDate || 0);
                    const dateB = new Date(b.startDate || 0);
                    return dateB - dateA;
                });
                setAllEvents(sortedEvents);
            } catch (err) {
                console.error("AdminAllEventsPage: Error fetching events:", err);
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

            // API mẫu trả về eventName, description, hostId (camelCase)
            // EventCard cũng sử dụng event.tagsList hoặc event.tags
            const eventName = event.eventName || "";
            const eventDescription = event.description || "";
            const eventTagsArray = Array.isArray(event.tagsList) ? event.tagsList : (Array.isArray(event.tags) ? event.tags : []);

            const matchesSearch = searchTerm === '' ||
                eventName.toLowerCase().includes(lowerSearchTerm) ||
                eventDescription.toLowerCase().includes(lowerSearchTerm) ||
                (eventTagsArray.some(tag => String(tag).toLowerCase().includes(lowerSearchTerm)));

            // Giả sử API có trường approvalStatus (hoặc tương tự)
            const approvalStatus = event.approvalStatus;
            const matchesStatus = selectedStatus === '' || approvalStatus === selectedStatus;

            const hostId = event.hostId;
            const matchesFaculty = selectedFaculty === '' || String(hostId) === String(selectedFaculty);

            return matchesSearch && matchesStatus && matchesFaculty;
        });
    }, [allEvents, searchTerm, selectedStatus, selectedFaculty]);

    const handleSearch = (term) => setSearchTerm(term);
    const handleStatusChange = (e) => setSelectedStatus(e.target.value);
    const handleFacultyChange = (e) => setSelectedFaculty(e.target.value);

    // Giả định FACULTIES là một mảng các object { value: 'id', label: 'Tên Khoa' }
    // hoặc mảng các string (email/id của khoa). Cần điều chỉnh cho phù hợp.
    // Ví dụ nếu FACULTIES là [{ value: "doanthanhnien@dut.udn.vn", label: "Đoàn Thanh niên DUT" }, ...]
    const uniqueFacultiesOptions = useMemo(() => {
        const options = FACULTIES.map(faculty => {
            if (typeof faculty === 'object' && faculty.value && faculty.label) {
                return { value: faculty.value, label: faculty.label };
            }
            // Nếu FACULTIES là mảng chuỗi (ví dụ: email), sử dụng chuỗi đó làm cả value và label
            return { value: String(faculty), label: String(faculty) };
        }).sort((a, b) => a.label.localeCompare(b.label));
        return [{ value: '', label: 'Tất cả đơn vị' }, ...options];
    }, []);


    // --- XÓA THẺ ThemeProvider ---
    return (
        // <ThemeProvider theme={theme}> Bỏ thẻ này
            <PageWrapper>
                <Header>Quản lý Sự kiện (Tất cả)</Header>

                <FilterBar>
                    <FilterGroup style={{ flexGrow: 2 }}>
                        <EventSearchBar onSearch={handleSearch} placeholder="Tìm tên, mô tả, tag..." />
                    </FilterGroup>

                    <FilterGroup>
                        <StyledSelect id="status-select" value={selectedStatus} onChange={handleStatusChange}>
                            <option value="">Tất cả trạng thái</option>
                            <option value="pending">Chờ duyệt</option>
                            <option value="approved">Đã duyệt</option>
                            <option value="rejected">Đã từ chối</option>
                        </StyledSelect>
                    </FilterGroup>

                    <FilterGroup>
                        <StyledSelect id="faculty-select" value={selectedFaculty} onChange={handleFacultyChange}>
                            {uniqueFacultiesOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </StyledSelect>
                    </FilterGroup>
                </FilterBar>

                <section>
                    {isLoading && <StatusText>Đang tải danh sách sự kiện...</StatusText>}
                    {error && <ErrorText>Lỗi: {error}</ErrorText>}
                    {!isLoading && !error && (
                        filteredEvents.length > 0 ? (
                            <EventGrid>
                                {filteredEvents.map((event, index) => {
                                    // API mẫu trả về eventId (camelCase)
                                    const eventKey = event.eventId || `event-${index}-${Date.now()}`;
                                    return (
                                        <EventCard
                                            key={eventKey}
                                            event={event}
                                            isAdminView={true}
                                        />
                                    );
                                })}
                            </EventGrid>
                        ) : (
                            <StatusText>Không tìm thấy sự kiện nào phù hợp.</StatusText>
                        )
                    )}
                </section>
            </PageWrapper>
        // </ThemeProvider> Bỏ thẻ này
    );
};

export default AdminAllEventsPage;