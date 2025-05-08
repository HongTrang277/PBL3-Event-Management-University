// src/components/features/Navigation/AdminSidebar/AdminSidebar.jsx
import React from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth'; // Điều chỉnh đường dẫn nếu cần
import { ROLES } from '../../../../utils/constants'; // Điều chỉnh đường dẫn nếu cần
import Button from '../../../common/Button/Button'; // Giả định Button là styled-component

// --- Styled Components ---
const SidebarWrapper = styled.div`
    width: 16rem; /* w-64 */
    background-color: #003652; /* bg-blue-800 */
    color: #ffffff;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 1rem; /* p-4 */
`;

const BrandTitle = styled.div`
    font-size: 1.5rem; /* text-2xl */
    line-height: 2rem;
    font-weight: 700; /* font-bold */
    margin-bottom: 2rem; /* mb-8 */
    font-family: 'DM Sans', sans-serif; /* font-dm-sans */
`;

const NavList = styled.nav`
    flex-grow: 1;

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
`;

const NavItem = styled.li`
    margin-bottom: 0.75rem; /* mb-3 */
`;

// Sử dụng &.active để style NavLink khi active
const StyledNavLink = styled(NavLink)`
    display: block;
    padding: 0.5rem 1rem; /* py-2 px-4 */
    border-radius: 0.25rem; /* rounded */
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
    color: #dbeafe; /* text-gray-100 */
    text-decoration: none;

    &:hover {
        background-color: #1d4ed8; /* hover:bg-blue-500 */
        color: #ffffff; /* hover:text-white */
    }

    &.active {
        background-color: #81ADC4; /* bg-blue-600 */
        color: #ffffff; /* text-white */
        font-weight: 500;
    }
`;

const UserInfoSection = styled.div`
    margin-top: auto; /* mt-auto */
`;

const UserDetails = styled.div`
    margin-bottom: 1rem; /* mb-4 */
    padding: 0.5rem; /* p-2 */
    border-top: 1px solid #1e3a8a; /* border-blue-700 */
`;

const UserName = styled.p`
    font-size: 0.875rem; /* text-sm */
    font-weight: 600; /* font-semibold */
    margin: 0;
`;

const UserDetail = styled.p`
    font-size: 0.75rem; /* text-xs */
    color: #bfdbfe; /* text-blue-200 */
    margin: 0;
    text-transform: capitalize;
`;

const LogoutButton = styled(Button)` // Style component Button đã import
    width: 100%;
`;

// --- Component ---
const AdminSidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <SidebarWrapper>
            <BrandTitle>Trang Quản Lý</BrandTitle>
            <NavList>
                <ul>
                    <NavItem>
                        <StyledNavLink to="/admin/events">
                            Sự kiện (All)
                        </StyledNavLink>
                    </NavItem>
                    <NavItem>
                        <StyledNavLink to="/admin/my-events">
                            Sự kiện của tôi
                        </StyledNavLink>
                    </NavItem>
                    <NavItem>
                        <StyledNavLink to="/admin/create-event">
                            Tạo sự kiện mới
                        </StyledNavLink>
                    </NavItem>
                    {(user?.role === ROLES.FACULTY_UNION || user?.role === ROLES.EVENT_CREATOR) && (
                        <NavItem>
                            <StyledNavLink to="/admin/creator-dashboard">
                                Thống kê
                            </StyledNavLink>
                        </NavItem>
                    )}
                    {user?.role === ROLES.UNION && (
                        <NavItem>
                            <StyledNavLink to="/admin/statistics">
                                Thống kê & Thi đua
                            </StyledNavLink>
                        </NavItem>
                    )}
                </ul>
            </NavList>
            <UserInfoSection>
                <UserDetails>
                    <UserName>{user?.name}</UserName>
                    <UserDetail>{user?.email}</UserDetail>
                    <UserDetail>{user?.role?.replace('_', ' ')}</UserDetail>
                </UserDetails>
                <LogoutButton onClick={handleLogout} variant="secondary">
                    Đăng xuất
                </LogoutButton>
            </UserInfoSection>
        </SidebarWrapper>
    );
};

export default AdminSidebar;