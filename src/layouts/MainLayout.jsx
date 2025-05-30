// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StudentNavbar from '../components/features/Navigation/MainNav/StudentNavbar';
import Footer from '../components/common/Footer/Footer';
import styled from 'styled-components';
// --- Styled Components ---
const LayoutWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f9fafb; /* Optional: Add a light background */
`;

// ContentContainer sẽ không giới hạn chiều rộng nữa, để các section con tự quyết định
const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 100%; /* Cho phép chiếm toàn bộ chiều rộng */
`;

// MainContent sẽ không còn được sử dụng để bọc toàn bộ HomePage nữa
// thay vào đó, các section bên trong HomePage sẽ tự quản lý max-width của mình nếu cần
// HOẶC bạn có thể giữ lại MainContent và chỉ dùng nó cho phần EventsSection
const MainContentLimited = styled.main`
    flex-grow: 1;
    width: 100%;
    max-width: 1280px; 
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
  const { isAuthenticated, userRoles, hasAnyRole } = useAuth();

  // Debug
  console.log("MainLayout rendering with:", { isAuthenticated, userRoles });

  return (
    <div className="flex flex-col min-h-screen">
      <StudentNavbar /> {/* Sử dụng StudentNavbar thay vì Navbar thông thường */}
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;