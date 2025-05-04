// src/pages/HomePage.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import EventSearchBar from '../components/features/Search/EventSearchBar/EventSearchBar';

// --- Styled Components ---
const PageWrapper = styled.div`
    padding: 1.5rem 1rem; /* Basic padding */
    max-width: 1024px; /* Example max width */
    margin: 0 auto; /* Center content */
`;

const Title = styled.h1`
    font-size: 1.875rem; /* text-3xl */
    line-height: 2.25rem;
    font-weight: 700; /* font-bold */
    margin-bottom: 1.5rem; /* mb-6 */
    font-family: 'DM Sans', sans-serif; /* font-dm-sans */
    color: #1f2937; /* text-gray-800 */
`;

const Paragraph = styled.p`
    margin-bottom: 1rem; /* mb-4 */
    color: #4b5563; /* text-gray-600 */
    line-height: 1.625; /* leading-relaxed */
`;

const SearchContainer = styled.div`
    margin-bottom: 2rem; /* mb-8 */
`;

const LinkContainer = styled.div`
    margin-top: 1.5rem; /* mt-6 */
`;

const StyledLink = styled(RouterLink)`
    color: #4f46e5; /* text-indigo-600 */
    font-weight: 600; /* font-semibold */
    text-decoration: none;
    transition: color 0.2s ease-in-out;

    &:hover {
        color: #3730a3; /* hover:text-indigo-800 */
        text-decoration: underline;
    }
`;

// --- Component ---
const HomePage = () => {
    // Mock search handler (replace with actual logic if needed)
    const handleSearch = (term) => {
        console.log("Searching for:", term);
        // Navigate to search results page or filter events here
    };

    return (
        <PageWrapper>
            <Title>Chào mừng đến với Hệ thống Quản lý Sự kiện</Title>
            <Paragraph>Tìm kiếm và tham gia các sự kiện thú vị do các Khoa và Đoàn trường tổ chức.</Paragraph>

            <SearchContainer>
                <EventSearchBar onSearch={handleSearch} />
            </SearchContainer>

            {/* EventSection would go here if implemented */}
            {/* <SectionTitle>Sự kiện sắp diễn ra</SectionTitle> */}
            {/* <EventGrid>...</EventGrid> */}

            <LinkContainer>
                <StyledLink to="/dashboard"> {/* Link to dashboard or event list */}
                    Xem tất cả sự kiện &rarr;
                </StyledLink>
            </LinkContainer>
        </PageWrapper>
    );
};

export default HomePage;