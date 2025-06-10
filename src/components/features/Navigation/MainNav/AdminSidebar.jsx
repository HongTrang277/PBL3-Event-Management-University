// src/components/features/Navigation/AdminSidebar/AdminSidebar.jsx
import React from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import Button from '../../../common/Button/Button';
// Thêm icon để giao diện đẹp hơn
import { FaChartBar, FaTachometerAlt, FaCalendarCheck, FaPlusSquare, FaUsers, FaQrcode, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

// --- Styled Components (Cải tiến với màu sắc và bố cục tốt hơn) ---

const SidebarWrapper = styled.div`
    width: 260px; /* Tăng nhẹ chiều rộng cho thoải mái */
    background-color: #111827; /* bg-gray-900 - Một màu tối sang trọng */
    color: #e5e7eb; /* text-gray-200 */
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const BrandTitle = styled.div`
    font-size: 1.6rem;
    font-weight: 800;
    margin-bottom: 2rem;
    padding: 0 0.5rem;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
    letter-spacing: -0.5px;
`;

const NavList = styled.nav`
    flex-grow: 1;
`;

const NavGroupTitle = styled.h3`
    padding: 0.5rem 1rem;
    margin-top: 1.25rem;
    font-size: 0.7rem;
    font-weight: 600;
    color: #6b7280; /* text-gray-500 */
    text-transform: uppercase;
    letter-spacing: 0.05em;
`;

// Sử dụng &.active để style NavLink khi active
const StyledNavLink = styled(NavLink)`
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.75rem 1rem;
    margin: 0.25rem 0;
    border-radius: 6px;
    transition: background-color 0.2s, color 0.2s;
    color: #d1d5db; /* text-gray-300 */
    text-decoration: none;
    font-weight: 500;

    &:hover {
        background-color: #374151; /* hover:bg-gray-700 */
        color: #ffffff;
    }

    &.active {
        background: linear-gradient(90deg, #4f46e5, #7c3aed);
        color: #ffffff;
        font-weight: 600;
        box-shadow: 0 2px 6px rgba(79, 70, 229, 0.3);
    }

    svg {
        font-size: 1.1rem;
        min-width: 20px;
        opacity: 0.8;
    }
`;

const UserInfoSection = styled.div`
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid #374151; /* border-gray-700 */
`;

const UserDetails = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding: 0.5rem;
`;

const UserInfoText = styled.div`
    line-height: 1.3;
`;

const UserName = styled.p`
    font-weight: 600;
    color: #fff;
    margin: 0;
`;

const UserEmail = styled.p`
    font-size: 0.75rem;
    color: #9ca3af; /* text-gray-400 */
    margin: 0;
    word-break: break-all;
`;

const LogoutButton = styled(Button)`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
`;


// --- Component ---
const AdminSidebar = () => {
    const { user, logout, hasAnyRole } = useAuth(); // Sử dụng hasAnyRole từ hook
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };
    
    // Định nghĩa các quyền truy cập để code JSX sạch sẽ hơn
    // Logic này khớp với file App.jsx của bạn
    const isEventEditor = hasAnyRole(['Organizer', 'event_creator', 'EventCreator', 'union', 'Union', 'Admin']);
    const canViewGeneralStats = hasAnyRole(['union', 'Union', 'Admin','Organizer', 'event_creator', 'EventCreator']);
    const canViewFacultyStats = hasAnyRole(['union', 'Organizer', 'Union', 'Admin']);

    return (
        <SidebarWrapper>
            <BrandTitle>Bảng điều khiển</BrandTitle>
            <NavList>
                {/* NHÓM QUẢN LÝ SỰ KIỆN */}
                {isEventEditor && (
                    <>
                        <NavGroupTitle>Quản lý sự kiện</NavGroupTitle>
                        <ul>
                            <li><StyledNavLink to="/admin/my-events"><FaCalendarCheck /> Sự kiện của tôi</StyledNavLink></li>
                            <li><StyledNavLink to="/admin/events"><FaUsers /> Tất cả Sự kiện</StyledNavLink></li>
                            <li><StyledNavLink to="/admin/create-event"><FaPlusSquare /> Tạo sự kiện mới</StyledNavLink></li>
                            <li><StyledNavLink to="/admin/qr-scan"><FaQrcode /> Quét QR Điểm danh</StyledNavLink></li>
                        </ul>
                    </>
                )}

                {/* NHÓM PHÂN TÍCH & BÁO CÁO */}
                {/* Chỉ hiển thị tiêu đề nhóm nếu có ít nhất 1 quyền xem thống kê */}
                {(canViewGeneralStats || canViewFacultyStats) && (
                    <>
                        <NavGroupTitle>Phân tích & Báo cáo</NavGroupTitle>
                        <ul>
                            {/* Link đến trang thống kê tổng quát */}
                            {canViewGeneralStats && (
                                <li>
                                    <StyledNavLink to="/admin/statistics">
                                        <FaChartBar /> Thi đua & Thống kê
                                    </StyledNavLink>
                                </li>
                            )}
                            {/* Link đến trang thống kê theo khoa */}
                            {canViewFacultyStats && (
                                <li>
                                    <StyledNavLink to="/admin/faculty-statistics">
                                        <FaTachometerAlt /> Thống kê theo Khoa
                                    </StyledNavLink>
                                </li>
                            )}
                        </ul>
                    </>
                )}
            </NavList>

            {/* Thông tin người dùng và nút Đăng xuất */}
            {user && (
                 <UserInfoSection>
                    <UserDetails>
                        <FaUserCircle size={36} style={{flexShrink: 0, color: '#9ca3af'}}/>
                        <UserInfoText>
                           <UserName>{user.fullName || user.name || 'User'}</UserName>
                           <UserEmail>{user.email}</UserEmail>
                        </UserInfoText>
                    </UserDetails>
                    <LogoutButton onClick={handleLogout} variant="danger">
                        <FaSignOutAlt /> Đăng xuất
                    </LogoutButton>
                </UserInfoSection>
            )}
        </SidebarWrapper>
    );
};

export default AdminSidebar;