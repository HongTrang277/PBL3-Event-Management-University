// src/components/features/Navigation/StudentNavbar/StudentNavbar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../../../hooks/useAuth'; // Điều chỉnh đường dẫn
import Button from '../../../common/Button/Button'; // Điều chỉnh đường dẫn

// --- Styled Components --- (Giữ nguyên như trong mã gốc)
const Nav = styled.nav`
    background-color: #4f46e5; /* bg-indigo-600 */
    padding: 0.75rem 1.5rem; /* py-3 px-6 */
    color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const NavContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1280px; /* Example max-width */
    margin: 0 auto;
    flex-wrap: wrap; /* Allow wrapping on small screens */
`;

const NavBrand = styled(Link)`
    font-size: 1.25rem; /* text-xl */
    font-weight: 700; /* font-bold */
    color: white;
    text-decoration: none;
    margin-right: 1.5rem; /* Add some space */
`;

const NavLinks = styled.ul`
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 1rem; /* space-x-4 */
    align-items: center;
    flex-wrap: wrap; /* Allow links to wrap */

    @media (max-width: 768px) { /* Example breakpoint for mobile */
        width: 100%;
        margin-top: 0.5rem;
        justify-content: center; /* Center links on mobile wrap */
        display: ${props => props.isOpen ? 'flex' : 'none'}; /* Toggle visibility */
        flex-direction: column; /* Stack links vertically */
        gap: 0.5rem;
        order: 3; /* Ensure links appear below brand and toggle */
    }
`;

const StyledNavLink = styled(NavLink)`
    color: #e0e7ff; /* indigo-100 */
    text-decoration: none;
    padding: 0.5rem 0.75rem;
    border-radius: 0.25rem;
    transition: background-color 0.2s, color 0.2s;
    display: block; /* Ensure full clickable area */

    &:hover {
        background-color: #4338ca; /* indigo-700 */
        color: white;
    }

    &.active {
        background-color: #ffffff; /* bg-white */
        color: #4f46e5; /* text-indigo-600 */
        font-weight: 500; /* font-medium */
    }
     @media (max-width: 768px) {
         text-align: center;
         width: 100%;
     }
`;

const AuthSection = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem; /* space-x-3 */

     @media (max-width: 768px) { /* Example breakpoint for mobile */
        width: 100%;
        margin-top: 0.5rem;
        justify-content: center; /* Center auth on mobile wrap */
        display: ${props => props.isOpen ? 'flex' : 'none'}; /* Toggle visibility */
        order: 4; /* Ensure auth appears last when open */
    }
`;

const UserInfo = styled.span`
    font-weight: 500;
    margin-right: 0.5rem;
`;

const HamburgerButton = styled.button`
    display: none; /* Hidden by default */
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    margin-left: auto; /* Push to the right on mobile */
    order: 2; /* Position between brand and links/auth */

    @media (max-width: 768px) { /* Show only on mobile */
        display: block;
    }
`;

// --- Component ---
const StudentNavbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const getHomeLink = () => {
        if (!isAuthenticated) return "/";
        if (user?.role === 'student') return "/dashboard";
        // Add other roles if needed, otherwise default to home
        return "/";
    };

    return (
        <Nav>
            <NavContainer>
                <NavBrand to={getHomeLink()} onClick={closeMenu}>
                    BK Events
                </NavBrand>

                <HamburgerButton onClick={toggleMenu}>
                    {isMenuOpen ? '✕' : '☰'}
                </HamburgerButton>

                {/* Các link điều hướng */}
                <NavLinks $isOpen={isMenuOpen}>
                    <li><StyledNavLink to={getHomeLink()} onClick={closeMenu} end>Sự kiện</StyledNavLink></li>
                    {isAuthenticated && user?.role === 'student' && (
                        <>
                            <li><StyledNavLink to="/registered-events" onClick={closeMenu}>Đã đăng ký</StyledNavLink></li>
                            <li><StyledNavLink to="/achievements" onClick={closeMenu}>Thành tích</StyledNavLink></li>
                            <li><StyledNavLink to="/attendance" onClick={closeMenu}>Điểm danh</StyledNavLink></li>
                            {/* <li><StyledNavLink to="/profile" onClick={closeMenu}>Hồ sơ</StyledNavLink></li> */}
                        </>
                    )}
                     {/* Có thể thêm link khác cho guest hoặc admin ở đây nếu cần */}
                </NavLinks>

                {/* Phần xác thực */}
                <AuthSection isOpen={isMenuOpen}>
                    {isAuthenticated ? (
                        <>
                            <UserInfo>{user?.name || user?.email}</UserInfo>
                            <Button onClick={handleLogout} variant="secondary" size="small">
                                Đăng xuất
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => { navigate('/login'); closeMenu(); }} variant="primary" size="small">
                                Đăng nhập
                            </Button>
                            <Button onClick={() => { navigate('/register'); closeMenu(); }} variant="secondary" size="small">
                                Đăng ký
                            </Button>
                        </>
                    )}
                </AuthSection>

            </NavContainer>
        </Nav>
    );
};

export default StudentNavbar;