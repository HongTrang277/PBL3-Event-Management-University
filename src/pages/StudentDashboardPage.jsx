// src/pages/StudentDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { eventService, registrationService, CategoryService, EventCategoryService } from '../services/api';
import EventSearchBar from '../components/features/Search/EventSearchBar/EventSearchBar';
import EventCard from '../components/features/Events/EventCard/EventCard';
import { ROLES } from '../utils/constants';
import { formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FaFilter, FaSort, FaCalendarAlt, FaFire, FaRegClock, FaCheck } from 'react-icons/fa';

// --- Styled Components (Giữ nguyên các styled cũ) ---
// ...


// --- Styled Components (Giữ nguyên) ---
const DashboardWrapper = styled.div`
  padding: 1.5rem;
  width:100%;
  margin: 0 auto;
`;

const WelcomeMessage = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1f2937;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
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

// Thêm các styled components mới cho bộ lọc và sắp xếp
const FiltersSection = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  font-size: 0.875rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const CategoryFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const CategoryBadge = styled.button`
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${props => props.active ? '#3b82f6' : '#e5e7eb'};
  background-color: ${props => props.active ? '#dbeafe' : 'white'};
  color: ${props => props.active ? '#1e40af' : '#4b5563'};
  
  &:hover {
    border-color: ${props => props.active ? '#3b82f6' : '#9ca3af'};
    background-color: ${props => props.active ? '#bfdbfe' : '#f9fafb'};
  }
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  gap: 0.5rem;
`;

const ResetButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background-color: white;
  color: #4b5563;
  cursor: pointer;
  
  &:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }
`;

const ApplyButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: 1px solid #3b82f6;
  background-color: #3b82f6;
  color: white;
  cursor: pointer;
  
  &:hover {
    background-color: #2563eb;
  }
`;

const ActiveFiltersDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ActiveFilter = styled.div`
  display: flex;
  align-items: center;
  background-color: #dbeafe;
  color: #1e40af;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  
  button {
    margin-left: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #1e40af;
    padding: 0;
    display: flex;
    align-items: center;
  }
`;

const SortingOption = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  background-color: ${props => props.active ? '#dbeafe' : 'white'};
  color: ${props => props.active ? '#1e40af' : '#4b5563'};
  border: 1px solid ${props => props.active ? '#3b82f6' : '#d1d5db'};
  
  &:hover {
    border-color: #3b82f6;
    background-color: ${props => props.active ? '#bfdbfe' : '#f9fafb'};
  }
  
  svg {
    font-size: 1rem;
  }
`;

const SortingOptions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

// Định nghĩa các tùy chọn sắp xếp
const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  UPCOMING: 'upcoming',
  POPULAR: 'popular',
  RECENTLY_ADDED: 'recently_added'
};

// Định nghĩa các loại sự kiện
const EVENT_TYPES = {
  ALL: 'all',
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  PAST: 'past'
};

// --- Component chính ---
const StudentDashboardPage = () => {
  const { user, userRoles, isAuthenticated } = useAuth();
  const [allEvents, setAllEvents] = useState([]); // Chứa tất cả sự kiện gốc
  const [displayedEvents, setDisplayedEvents] = useState([]); // Sự kiện sau khi áp dụng sort & filter
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [registeredEventMap, setRegisteredEventMap] = useState(new Map());
  
  // Thêm state cho filters và sorting
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [eventType, setEventType] = useState(EVENT_TYPES.ALL);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch tất cả danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Sử dụng categoryService.getAllCategories()
        const categoriesData = await CategoryService.getAllCategories();
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        console.log("Fetched categories:", categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    
    fetchCategories();
  }, []);

  // Fetch tất cả sự kiện và đăng ký
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user?.id) {
        setIsLoading(false);
        setAllEvents([]);
        setDisplayedEvents([]);
        setRegisteredEventMap(new Map());
        if (!isAuthenticated) {
          setError("Vui lòng đăng nhập để xem trang này.");
        }
        return;
      }

      // Chấp nhận cả 'User' và 'STUDENT'
      const isValidRole = user?.role === ROLES.STUDENT || user?.role === 'User' || 
                        (Array.isArray(userRoles) && userRoles.some(r => 
                          ['student', 'Student', 'User'].includes(r)
                        ));
      
      if (!isValidRole) {
        setError("Trang này chỉ dành cho sinh viên.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch tất cả sự kiện
        const eventsFromApi = await eventService.getAllEvents();

        if (!Array.isArray(eventsFromApi)) {
          console.error("API getAllEvents không trả về một mảng:", eventsFromApi);
          setError("Dữ liệu sự kiện trả về không hợp lệ.");
          setAllEvents([]);
          setDisplayedEvents([]);
          setIsLoading(false);
          return;
        }

        // Fetch các danh mục cho mỗi sự kiện
        const eventsWithCategories = await Promise.all(
          eventsFromApi.map(async (event) => {
            try {
              // Gọi API để lấy danh mục của sự kiện
              const eventCategories = await EventCategoryService.getEventCategoryById(event.eventId);
              return {
                ...event,
                categories: Array.isArray(eventCategories) ? eventCategories : []
              };
            } catch (error) {
              console.warn(`Không thể lấy danh mục cho sự kiện ${event.eventId}:`, error);
              return { ...event, categories: [] };
            }
          })
        );

        setAllEvents(eventsWithCategories);
        // Ban đầu hiển thị tất cả
        applyFiltersAndSort(eventsWithCategories, searchTerm, selectedCategories, eventType, sortBy);

        // Xử lý việc lấy danh sách sự kiện đã đăng ký
        try {
          const registeredResponse = await registrationService.getEventsUserRegisteredFor(user.id);
          const registeredData = Array.isArray(registeredResponse) ? registeredResponse : (registeredResponse?.data || []);
          const newRegisteredMap = new Map();
          if (Array.isArray(registeredData)) {
            registeredData.forEach(reg => {
              const eventIdFromReg = reg.event?.eventId || reg.eventId;
              const registrationIdFromReg = reg.registrationId;
              if (eventIdFromReg && registrationIdFromReg) {
                newRegisteredMap.set(eventIdFromReg, registrationIdFromReg);
              }
            });
          }
          setRegisteredEventMap(newRegisteredMap);
        } catch (regError) {
          if (regError.isAxiosError && regError.response?.status === 404) {
            console.warn(`API /Registrations/Events/${user.id} trả về 404. Coi như người dùng chưa đăng ký sự kiện nào.`, regError.response?.data);
            setRegisteredEventMap(new Map());
          } else {
            console.error("Lỗi khi lấy danh sách sự kiện đã đăng ký:", regError);
            setRegisteredEventMap(new Map());
          }
        }
      } catch (mainError) {
        console.error("Lỗi khi fetch data chính (getAllEvents):", mainError);
        setError(mainError.response?.data?.message || mainError.message || 'Không thể tải dữ liệu trang.');
        setAllEvents([]);
        setDisplayedEvents([]);
        setRegisteredEventMap(new Map());
      } finally {
        setIsLoading(false);
      }
    };

    const isValidRole = user?.role === ROLES.STUDENT || user?.role === 'User' || 
                  (Array.isArray(userRoles) && userRoles.some(r => 
                    ['student', 'Student', 'User'].includes(r)
                  ));
                  
    // Chỉ fetch khi đã xác thực và là sinh viên
    if (isAuthenticated && user?.id && isValidRole) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  // Hàm áp dụng bộ lọc và sắp xếp
  const applyFiltersAndSort = (events, search, categories, type, sort) => {
    if (!Array.isArray(events)) return;
    
    // Bước 1: Lọc theo từ khóa tìm kiếm
    let filtered = events.filter(event => {
      const eventName = event.eventName || "";
      const eventDescription = event.description || "";
      const eventTagsArray = Array.isArray(event.tagsList) ? event.tagsList : 
                            (Array.isArray(event.tags) ? event.tags : []);
      
      const matchesSearch = search === '' ||
        eventName.toLowerCase().includes(search.toLowerCase()) ||
        eventDescription.toLowerCase().includes(search.toLowerCase()) ||
        eventTagsArray.some(tag => String(tag).toLowerCase().includes(search.toLowerCase()));
      
      return matchesSearch;
    });
    
    // Bước 2: Lọc theo danh mục
    if (categories && categories.length > 0) {
      filtered = filtered.filter(event => {
        // Kiểm tra xem sự kiện có thuộc các danh mục đã chọn không
        return event.categories && event.categories.some(cat => 
          categories.includes(cat.categoryName || cat)
        );
      });
    }
    
    // Bước 3: Lọc theo loại sự kiện (upcoming, ongoing, past)
    const now = new Date();
    if (type !== EVENT_TYPES.ALL) {
      filtered = filtered.filter(event => {
        const startDate = new Date(event.startDate);
        const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate);
        // Thêm 23:59:59 vào ngày kết thúc
        endDate.setHours(23, 59, 59);
        
        switch (type) {
          case EVENT_TYPES.UPCOMING:
            return startDate > now;
          case EVENT_TYPES.ONGOING:
            return startDate <= now && endDate >= now;
          case EVENT_TYPES.PAST:
            return endDate < now;
          default:
            return true;
        }
      });
    }
    
    // Bước 4: Sắp xếp sự kiện
    switch (sort) {
      case SORT_OPTIONS.NEWEST:
        filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        break;
      case SORT_OPTIONS.OLDEST:
        filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        break;
      case SORT_OPTIONS.UPCOMING:
        filtered.sort((a, b) => {
          const dateA = new Date(a.startDate);
          const dateB = new Date(b.startDate);
          // Chỉ sắp xếp sự kiện trong tương lai
          if (dateA > now && dateB > now) {
            return dateA - dateB; // Sự kiện gần nhất trước
          }
          return (dateA > now ? -1 : 1) - (dateB > now ? -1 : 1); // Sự kiện trong tương lai trước
        });
        break;
      case SORT_OPTIONS.POPULAR:
        filtered.sort((a, b) => (b.registeredCount || 0) - (a.registeredCount || 0));
        break;
      case SORT_OPTIONS.RECENTLY_ADDED:
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    }
    
    setDisplayedEvents(filtered);
  };

  // Hàm xử lý thay đổi bộ lọc
  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        return prev.filter(cat => cat !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  // Apply filters khi các state filter thay đổi
  useEffect(() => {
    applyFiltersAndSort(allEvents, searchTerm, selectedCategories, eventType, sortBy);
  }, [searchTerm, selectedCategories, eventType, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setEventType(EVENT_TYPES.ALL);
    setSortBy(SORT_OPTIONS.NEWEST);
    setSearchTerm('');
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleRegister = async (eventId) => {
    if (!user?.id) {
      alert("Vui lòng đăng nhập để đăng ký.");
      return;
    }
    if (registeredEventMap.has(eventId)) {
      alert("Bạn đã đăng ký sự kiện này rồi.");
      return;
    }
    try {
      const registrationData = await registrationService.registerUserForEvent(user.id, eventId);
      if (registrationData && registrationData.registrationId) {
        setRegisteredEventMap(prevMap => new Map(prevMap).set(registrationData.eventId || eventId, registrationData.registrationId));
        alert("Đăng ký thành công!");
      } else {
        alert("Đăng ký thành công nhưng không thể cập nhật trạng thái ngay. Vui lòng làm mới trang.");
        console.warn("API registerUserForEvent không trả về registrationId:", registrationData);
      }
    } catch (err) {
      alert(`Đăng ký thất bại: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleUnregister = async (eventId) => {
    if (!user?.id) {
      alert("Vui lòng đăng nhập.");
      return;
    }
    const registrationId = registeredEventMap.get(eventId);
    if (!registrationId) {
      alert("Bạn chưa đăng ký sự kiện này hoặc có lỗi xảy ra.");
      console.error("Không tìm thấy registrationId cho eventId:", eventId);
      return;
    }
    try {
      await registrationService.removeRegistration(registrationId);
      setRegisteredEventMap(prevMap => {
        const newMap = new Map(prevMap);
        newMap.delete(eventId);
        return newMap;
      });
      alert("Hủy đăng ký thành công!");
    } catch (err) {
      alert(`Hủy đăng ký thất bại: ${err.response?.data?.message || err.message}`);
    }
  };

  // Render trang khi chưa đăng nhập
  if (!isAuthenticated && !isLoading) {
    return (
      <DashboardWrapper>
        <ErrorText>{error || "Vui lòng đăng nhập để truy cập trang này."}</ErrorText>
      </DashboardWrapper>
    );
  }

  // JSX chính
  return (
    <DashboardWrapper>
      <WelcomeMessage>
        Chào mừng, {user?.name || 'Sinh viên'}!
      </WelcomeMessage>

      <Section>
        <SectionTitle>Tìm kiếm Sự kiện</SectionTitle>
        <EventSearchBar onSearch={handleSearch} placeholder="Tìm sự kiện theo tên, mô tả, tag..." value={searchTerm} />
      </Section>

      <FiltersSection>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SectionTitle>Bộ lọc & Sắp xếp</SectionTitle>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-blue-600 font-medium text-sm flex items-center"
            style={{ fontSize: '0.875rem', color: '#3b82f6', fontWeight: 500, display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <FaFilter style={{ marginRight: '0.5rem' }} />
            {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </button>
        </div>

        {showFilters && (
          <FilterContainer>
            <FilterGroup>
              <FilterLabel>
                <FaCalendarAlt /> Loại sự kiện
              </FilterLabel>
              <Select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                <option value={EVENT_TYPES.ALL}>Tất cả</option>
                <option value={EVENT_TYPES.UPCOMING}>Sắp diễn ra</option>
                <option value={EVENT_TYPES.ONGOING}>Đang diễn ra</option>
                <option value={EVENT_TYPES.PAST}>Đã kết thúc</option>
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>
                <FaSort /> Sắp xếp theo
              </FilterLabel>
              <SortingOptions>
                <SortingOption 
                  active={sortBy === SORT_OPTIONS.NEWEST} 
                  onClick={() => setSortBy(SORT_OPTIONS.NEWEST)}
                >
                  <FaCalendarAlt /> Mới nhất
                </SortingOption>
                <SortingOption 
                  active={sortBy === SORT_OPTIONS.UPCOMING} 
                  onClick={() => setSortBy(SORT_OPTIONS.UPCOMING)}
                >
                  <FaRegClock /> Sắp diễn ra
                </SortingOption>
                <SortingOption 
                  active={sortBy === SORT_OPTIONS.POPULAR} 
                  onClick={() => setSortBy(SORT_OPTIONS.POPULAR)}
                >
                  <FaFire /> Phổ biến
                </SortingOption>
              </SortingOptions>
            </FilterGroup>

            <FilterGroup style={{ width: '100%' }}>
              <FilterLabel>Danh mục</FilterLabel>
              <CategoryFilters>
                {categories.map((category) => (
                  <CategoryBadge
                    key={category.categoryId || category.categoryName}
                    active={selectedCategories.includes(category.categoryName)}
                    onClick={() => handleCategoryToggle(category.categoryName)}
                  >
                    {category.categoryName}
                  </CategoryBadge>
                ))}
              </CategoryFilters>
            </FilterGroup>

            <FilterActions style={{ width: '100%' }}>
              <ResetButton onClick={handleResetFilters}>
                Đặt lại
              </ResetButton>
            </FilterActions>
          </FilterContainer>
        )}

        {/* Hiển thị các bộ lọc đang áp dụng */}
        {(selectedCategories.length > 0 || eventType !== EVENT_TYPES.ALL || sortBy !== SORT_OPTIONS.NEWEST) && (
          <ActiveFiltersDisplay>
            {eventType !== EVENT_TYPES.ALL && (
              <ActiveFilter>
                Loại: {eventType === EVENT_TYPES.UPCOMING ? 'Sắp diễn ra' : 
                      eventType === EVENT_TYPES.ONGOING ? 'Đang diễn ra' : 'Đã kết thúc'}
                <button onClick={() => setEventType(EVENT_TYPES.ALL)}>×</button>
              </ActiveFilter>
            )}
            
            {sortBy !== SORT_OPTIONS.NEWEST && (
              <ActiveFilter>
                Sắp xếp: {
                  sortBy === SORT_OPTIONS.UPCOMING ? 'Sắp diễn ra' :
                  sortBy === SORT_OPTIONS.POPULAR ? 'Phổ biến' :
                  sortBy === SORT_OPTIONS.OLDEST ? 'Cũ nhất' :
                  sortBy === SORT_OPTIONS.RECENTLY_ADDED ? 'Mới thêm' : 'Mới nhất'
                }
                <button onClick={() => setSortBy(SORT_OPTIONS.NEWEST)}>×</button>
              </ActiveFilter>
            )}
            
            {selectedCategories.map(cat => (
              <ActiveFilter key={cat}>
                {cat}
                <button onClick={() => handleCategoryToggle(cat)}>×</button>
              </ActiveFilter>
            ))}
            
            {(selectedCategories.length > 0 || eventType !== EVENT_TYPES.ALL || sortBy !== SORT_OPTIONS.NEWEST) && (
              <ResetButton onClick={handleResetFilters} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                Xóa tất cả
              </ResetButton>
            )}
          </ActiveFiltersDisplay>
        )}
      </FiltersSection>

      <Section>
        <SectionTitle>
          {/* Hiển thị số lượng sự kiện sau khi lọc */}
          {searchTerm || selectedCategories.length > 0 || eventType !== EVENT_TYPES.ALL 
            ? `Kết quả (${displayedEvents.length})` 
            : `Tất cả sự kiện (${allEvents.length})`}
        </SectionTitle>
        {isLoading && <LoadingText>Đang tải sự kiện...</LoadingText>}
        {error && !isLoading && <ErrorText>Lỗi: {error}</ErrorText>}
        {!isLoading && !error && (
          <EventGrid>
            {displayedEvents.length > 0 ? (
              displayedEvents.map((event) => (
                <EventCard
                  key={event.eventId}
                  event={event}
                  isAlreadyRegistered={registeredEventMap.has(event.eventId)}
                  onRegister={() => handleRegister(event.eventId)}
                  onUnregister={() => handleUnregister(event.eventId)}
                />
              ))
            ) : (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem 0', color: '#6b7280' }}>
                {searchTerm || selectedCategories.length > 0 || eventType !== EVENT_TYPES.ALL 
                  ? "Không tìm thấy sự kiện phù hợp với bộ lọc." 
                  : "Hiện chưa có sự kiện nào."}
              </p>
            )}
          </EventGrid>
        )}
      </Section>
    </DashboardWrapper>
  );
};

export default StudentDashboardPage;