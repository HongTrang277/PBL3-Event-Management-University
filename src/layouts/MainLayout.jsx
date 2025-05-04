// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Footer from '../components/common/Footer/Footer'; // Đảm bảo đường dẫn đúng
import StudentNavbar from '../components/features/Navigation/MainNav/StudentNavbar';

// --- Styled Components ---
const LayoutWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f9fafb; /* Optional: Add a light background */
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const MainContent = styled.main`
    flex-grow: 1;
    width: 100%;
    max-width: 1280px; /* max-w-screen-xl equivalent */
    margin-left: auto;
    margin-right: auto;
    padding: 1.5rem; /* p-6 */

    /* Responsive padding similar to Tailwind container */
    @media (min-width: 640px) {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
    }
    @media (min-width: 1024px) {
        padding-left: 2rem;
        padding-right: 2rem;
    }
`;

// --- Component ---
const MainLayout = () => {
    return (
        <LayoutWrapper>
            <StudentNavbar /> {/* SỬA: Sử dụng Navbar phù hợp */}
            <ContentContainer>
                <MainContent>
                    <Outlet /> {/* Nội dung trang con */}
                </MainContent>
            </ContentContainer>
            <Footer />
        </LayoutWrapper>
    );
};

export default MainLayout;