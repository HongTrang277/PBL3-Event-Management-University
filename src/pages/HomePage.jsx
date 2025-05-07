// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import EventSearchBar from '../components/features/Search/EventSearchBar/EventSearchBar';
import EventCard from '../components/features/Events/EventCard/EventCard';
import { getAllEvents } from '../services/mockData';
// Đường dẫn đến ảnh sự kiện (thay thế bằng URL hoặc import nếu cần)


// --- Thêm import cho react-slick ---
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// --- Hết phần thêm import ---

// Định nghĩa theme màu (giữ nguyên như cũ)
const theme = {
  colors: {
    primary: '#a8e0fd',
    'primary-1': "#47c1ff",
    'primary-2': "#ddf4ff", // Nền nhạt
    'primary-3': "#003652", // Chữ đậm, tiêu đề
    'primary-4': "#5ba2dd",
    'custom-gray': {
      100: '#f7fafc',
      200: '#edf2f7',
      300: '#e2e8f0',
      400: '#cbd5e0',
      500: '#a0aec0',
      600: '#718096', // Chữ phụ
      700: '#4a5568',
      800: '#2d3748', // Chữ chính
      900: '#1a202c',
    },
    white: '#ffffff',
  },
  fontFamily: {
    'nutito-sans': ['"Nunito Sans"', 'sans-serif'],
    'dm-sans': ['"DM Sans"', 'sans-serif'],
  }
};

// Styled components (giữ nguyên hoặc điều chỉnh nếu cần cho Slider)
const HomePageWrapper = styled.div`
  background-color: ${props => props.theme.colors['primary-2']};
  color: ${props => props.theme.colors['custom-gray'][800]};
  font-family: ${props => props.theme.fontFamily['nutito-sans']};
  min-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${props => props.theme.colors['primary-4']} 0%, ${props => props.theme.colors['primary-1']} 100%);
  padding: 3rem 1.5rem;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center; /* Căn các item con giữa theo chiều dọc */
  justify-content: space-evenly; /* Phân bố không gian giữa các item */
  gap: 2rem; /* Khoảng cách giữa cột text và cột ảnh */
  text-align: center;
  color: ${props => props.theme.colors.white};
  width: 100%;
  box-sizing: border-box;
`;
const HeroTextContent = styled.div`
  flex: 1 1 50%; /* Cột text chiếm khoảng 50% và có thể co giãn */
  max-width: 600px; /* Giới hạn chiều rộng tối đa của cột text */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Căn giữa nội dung text theo chiều dọc */
  align-items: flex-start; /* Căn nội dung text sang trái */

  @media (max-width: 992px) {
    align-items: center; /* Căn giữa nội dung text khi xếp chồng */
    max-width: 100%;
    margin-top: 1.5rem; /* Khoảng cách với ảnh khi xếp chồng */
  }
`;

const HeroImageContainer = styled.div`
  flex: 1 1 45%; /* Cột ảnh chiếm khoảng 45% và có thể co giãn */
  max-width: 550px; /* Giới hạn chiều rộng tối đa cho container ảnh */
  height: 300px; /* Đặt chiều cao cố định cho container ảnh, bằng với chiều cao mong muốn của ảnh */
  display: flex;
  justify-content: center;
  align-items: center;
  
  img {
    width: 100%;
    height: 100%; /* Ảnh sẽ cố gắng lấp đầy container */
    object-fit: cover; /* Ảnh sẽ che phủ toàn bộ container, có thể bị cắt nếu tỷ lệ khác */
    border-radius: 12px; /* Bo góc cho ảnh */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  }

  @media (max-width: 992px) {
    width: 80%; /* Chiều rộng container ảnh trên mobile */
    max-width: 400px; /* Giới hạn lại trên mobile */
    height: 250px; /* Giảm chiều cao ảnh trên mobile */
  }
   @media (max-width: 640px) {
    width: 90%;
    height: 200px; /* Giảm thêm chiều cao ảnh trên điện thoại */
  }
  `;
const SiteTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  font-family: ${props => props.theme.fontFamily['dm-sans']};
  color: ${props => props.theme.colors['primary-3']};
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors['primary-2']};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const SearchContainer = styled.div`
  margin-bottom: 1rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 1rem;
`;

const EventsSectionWrapper = styled.section`
  padding: 2rem 0;
  flex-grow: 1;
  width: 100%;
`;

const EventsSectionContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;

  /* Tùy chỉnh style cho slick-slider nếu cần */
  .slick-slide > div {
    padding: 0 8px; /* Tạo khoảng cách giữa các EventCard trong slider */
  }

  .slick-prev, .slick-next {
    background-color: rgba(0, 54, 82, 0.5); // Màu nền cho nút, ví dụ primary-3 với opacity
    border-radius: 50%;
    width: 40px;
    height: 40px;
    z-index: 1;
  }
  .slick-prev:hover, .slick-next:hover {
    background-color: rgba(0, 54, 82, 0.8);
  }
  .slick-prev:before, .slick-next:before {
    color: white; // Màu của icon mũi tên
    font-size: 20px; // Kích thước icon mũi tên
  }
  .slick-prev {
    left: -50px; /* Điều chỉnh vị trí nút prev, có thể cần xa hơn nếu có padding của container */
     @media (max-width: 640px) {
        left: -20px;
    }
  }
  .slick-next {
    right: -50px; /* Điều chỉnh vị trí nút next */
    @media (max-width: 640px) {
        right: -20px;
    }
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-family: ${props => props.theme.fontFamily['dm-sans']};
  color: ${props => props.theme.colors['primary-3']};
  text-align: center;
`;

// EventGrid vẫn giữ lại để dùng khi có kết quả tìm kiếm
const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const StatusText = styled.p`
  text-align: center;
  padding: 2rem;
  font-size: 1rem;
  color: ${props => props.theme.colors['custom-gray'][600]};
`;

const HomePage = () => {
  const [allApprovedEvents, setAllApprovedEvents] = useState([]);
  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAndSetEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getAllEvents();
        const approved = (response.data || [])
          .filter(event => event.approval_status === 'approved')
          .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        setAllApprovedEvents(approved);
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách sự kiện.');
        setAllApprovedEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndSetEvents();
  }, []);

  // Cập nhật displayedEvents
  useEffect(() => {
    if (searchTerm === '') {
      // Khi không tìm kiếm, cung cấp tất cả sự kiện đã duyệt cho slider
      setDisplayedEvents(allApprovedEvents);
    } else {
      // Khi tìm kiếm, lọc như cũ
      const filtered = allApprovedEvents.filter(event =>
        event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.tags && event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
      setDisplayedEvents(filtered);
    }
  }, [searchTerm, allApprovedEvents]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Cấu hình cho react-slick
  const sliderSettings = {
    dots: true, // Hiển thị chấm tròn điều hướng
    infinite: displayedEvents.length > 5, // Lướt vô hạn nếu có nhiều hơn 5 sự kiện
    speed: 500, // Tốc độ chuyển slide (ms)
    slidesToShow: 5, // Số sự kiện hiển thị cùng lúc (bạn muốn khoảng 5)
    slidesToScroll: 1, // Số sự kiện trượt mỗi lần click mũi tên
    arrows: true, // Hiển thị mũi tên trái/phải
    responsive: [
      {
        breakpoint: 1280, // Cho màn hình lớn hơn hoặc bằng 1280px
        settings: {
          slidesToShow: 4, // Có thể là 4 hoặc 5 tùy bạn thấy đẹp
        }
      },
      {
        breakpoint: 1024, // Cho màn hình lớn hơn hoặc bằng 1024px
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768, // Cho màn hình lớn hơn hoặc bằng 768px
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640, // Cho màn hình nhỏ hơn 640px
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <ThemeProvider theme={theme}>
      <HomePageWrapper>
        <HeroSection>
        <HeroTextContent>
            <SiteTitle>Khám Phá Sự Kiện DUT</SiteTitle>
            <Subtitle>
              Nơi kết nối, học hỏi và phát triển cùng cộng đồng sinh viên Đại học Bách khoa - ĐH Đà Nẵng.
              Tìm kiếm và tham gia các sự kiện thú vị do Khoa và Đoàn trường tổ chức.
            </Subtitle>
            <SearchContainer>
              <EventSearchBar onSearch={handleSearch} placeholder="Tìm tên sự kiện, mô tả, hoặc tag..." />
            </SearchContainer>
          </HeroTextContent>

          {/* Cột hình ảnh */}
          <HeroImageContainer>
            <img 
              src="https://i.pinimg.com/736x/1c/89/62/1c89623c82775c76242435eb02b5b69b.jpg" // THAY THẾ BẰNG URL ẢNH CỦA BẠN
              alt="Sinh viên Đại học Bách Khoa DUT tham gia sự kiện" 
            />
          </HeroImageContainer>
        </HeroSection>

        <EventsSectionWrapper>
          <EventsSectionContent>
            <SectionTitle>
              {searchTerm ? `Kết quả tìm kiếm cho "${searchTerm}"` : 'Sự kiện Sắp Diễn Ra & Nổi Bật'}
            </SectionTitle>
            {isLoading && <StatusText>Đang tải sự kiện...</StatusText>}
            {error && <StatusText>Lỗi: {error}</StatusText>}
            {!isLoading && !error && (
              displayedEvents.length > 0 ? (
                searchTerm ? (
                  // Nếu đang tìm kiếm, hiển thị dạng lưới như cũ
                  <EventGrid>
                    {displayedEvents.map((event) => (
                      <EventCard key={event.event_id} event={event} />
                    ))}
                  </EventGrid>
                ) : (
                  // Nếu không tìm kiếm, hiển thị dạng Slider
                  // Chỉ render Slider nếu có sự kiện để hiển thị
                  displayedEvents.length > 0 ? (
                    <Slider {...sliderSettings}>
                      {displayedEvents.map((event) => (
                        <div key={event.event_id}> {/* Slider yêu cầu mỗi child là một div riêng */}
                          <EventCard event={event} />
                        </div>
                      ))}
                    </Slider>
                  ) : (
                     <StatusText>Hiện chưa có sự kiện nào.</StatusText>
                  )
                )
              ) : (
                <StatusText>
                  {searchTerm ? 'Không tìm thấy sự kiện nào phù hợp.' : 'Hiện chưa có sự kiện nào.'}
                </StatusText>
              )
            )}
          </EventsSectionContent>
        </EventsSectionWrapper>
      </HomePageWrapper>
    </ThemeProvider>
  );
};

export default HomePage;