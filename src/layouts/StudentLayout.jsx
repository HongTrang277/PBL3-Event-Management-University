// src/layouts/StudentLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Footer from '../components/common/Footer/Footer'; // Đảm bảo đường dẫn đúng
import StudentNavbar from '../components/features/Navigation/MainNav/StudentNavbar';
// --- Styled Components --- (Giữ nguyên)
const LayoutWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const MainContent = styled.main`
    flex-grow: 1;
    /* Optional container styling */
    max-width: 1280px;
    margin: 0 auto;
    padding: 1.5rem; /* Add some padding */
    width: 100%; /* Ensure it takes width */
`;

// --- Component --- (Giữ nguyên)
const StudentLayout = () => {
    return (
        <LayoutWrapper>
            <StudentNavbar />
            <MainContent>
                <Outlet />
            </MainContent>
            <Footer />
        </LayoutWrapper>
    );
};

export default StudentLayout;