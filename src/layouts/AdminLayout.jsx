// src/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth'; // Đảm bảo đường dẫn đúng
import { ROLES } from '../utils/constants'; // Đảm bảo đường dẫn đúng
import AdminSidebar from '../components/features/Navigation/MainNav/AdminSidebar'; // Đảm bảo đường dẫn đúng
import { useNavigate } from 'react-router-dom'; // Đảm bảo đã import useNavigate


// --- Styled Components --- (Giữ nguyên)
const AdminWrapper = styled.div`
    display: flex;
    min-height: 100vh; /* Sử dụng min-height thay height */
    background-color: #ddf4ff; /* bg-gray-100 */
`;

const AdminContent = styled.main`
    flex: 1 1 0%; /* flex-1 */
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0.5rem; /* p-6 */
`;

const LoadingWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 1.2rem;
`;

const AdminLayout = () => {
  const { isAuthenticated, userRoles, hasAnyRole } = useAuth();
  const navigate = useNavigate();

  // Dùng useEffect để tránh kiểm tra liên tục khi render
  React.useEffect(() => {
    // Kiểm tra xem người dùng có quyền admin không
    const adminRoles = ['Organizer', 'event_creator', 'EventCreator', 'union', 'Union', 'Admin'];
    const hasAdminRole = hasAnyRole(adminRoles);

    if (!isAuthenticated || !hasAdminRole) {
      console.log('AdminLayout: Not authenticated or invalid role. Redirecting to login.');
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, userRoles, hasAnyRole, navigate]);

  // Log debug để kiểm tra
  console.log('AdminLayout rendering with roles:', userRoles);

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        {/* Sidebar content */}
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;