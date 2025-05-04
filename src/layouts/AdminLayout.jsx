// src/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth'; // Đảm bảo đường dẫn đúng
import { ROLES } from '../utils/constants'; // Đảm bảo đường dẫn đúng
import AdminSidebar from '../components/features/Navigation/MainNav/AdminSidebar'; // Đảm bảo đường dẫn đúng

// --- Styled Components --- (Giữ nguyên)
const AdminWrapper = styled.div`
    display: flex;
    min-height: 100vh; /* Sử dụng min-height thay height */
    background-color: #f3f4f6; /* bg-gray-100 */
`;

const AdminContent = styled.main`
    flex: 1 1 0%; /* flex-1 */
    overflow-x: hidden;
    overflow-y: auto;
    padding: 1.5rem; /* p-6 */
`;

const LoadingWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 1.2rem;
`;

// --- Component --- (Giữ nguyên logic, chỉ tách file)
const AdminLayout = () => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <LoadingWrapper>Loading...</LoadingWrapper>;
    }

    if (!isAuthenticated || (user?.role !== ROLES.EVENT_CREATOR && user?.role !== ROLES.UNION)) {
         console.log("AdminLayout: Not authenticated or invalid role. Redirecting to login.");
        return <Navigate to="/login" state={{ from: window.location }} replace />;
    }

    console.log("AdminLayout: Rendering Admin Sidebar and Outlet.");
    return (
        <AdminWrapper>
            <AdminSidebar />
            <AdminContent>
                <Outlet />
            </AdminContent>
        </AdminWrapper>
    );
};

export default AdminLayout;