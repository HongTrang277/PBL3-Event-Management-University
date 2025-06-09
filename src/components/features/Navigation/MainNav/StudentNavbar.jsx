// src/components/features/Navigation/StudentNavbar/StudentNavbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../../../contexts/AuthContext';
import Button from '../../../common/Button/Button';

// --- Styled Components (Đã được cải tiến và bổ sung cho Dropdown) ---
const Nav = styled.nav`
    background-color: #47c1ff;
    padding: 0.75rem 1.5rem;
    color: #003652;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: relative;
    z-index: 1000;
`;

const NavContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1280px;
    margin: 0 auto;
    flex-wrap: wrap;
`;

const NavBrand = styled(Link)`
    font-size: 1.25rem;
    font-weight: 700;
    color: #003652;
    text-decoration: none;
    margin-right: 1.5rem;
`;

const NavLinks = styled.ul`
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 0.5rem;
    align-items: center;
    flex-grow: 1;

    @media (max-width: 992px) { // Thay đổi breakpoint để hợp lý hơn
        order: 3;
        width: 100%;
        margin-top: 1rem;
        flex-direction: column;
        display: ${props => props.$isOpen ? 'flex' : 'none'};
    }
`;

const StyledNavLink = styled(NavLink)`
    color: #003652;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: background-color 0.2s, color 0.2s;
    display: block;
    font-weight: 500;
    white-space: nowrap;

    &:hover {
        background-color: rgba(255, 255, 255, 0.3);
    }

    &.active {
        background-color: #ffffff;
        color: #0c4a6e;
    }

    @media (max-width: 992px) {
        text-align: center;
        width: 90%;
    }
`;

const AuthSection = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;

    @media (max-width: 992px) {
        display: none; // Ẩn phần này trên mobile, sẽ tích hợp vào menu hamburger
    }
`;

const HamburgerButton = styled.button`
    display: none;
    background: none;
    border: none;
    color: #003652;
    font-size: 1.8rem;
    cursor: pointer;
    margin-left: auto;

    @media (max-width: 992px) {
        display: block;
        order: 2;
    }
`;

const DropdownContainer = styled.li`
    position: relative;
    list-style: none;
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    width: 240px;
    padding: 0.5rem;
    z-index: 100;
    opacity: ${props => (props.$isOpen ? '1' : '0')};
    transform: ${props => (props.$isOpen ? 'translateY(0)' : 'translateY(-10px)')};
    visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
    transition: all 0.2s ease-in-out;
`;

const DropdownItem = styled(NavLink)`
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.75rem 1rem;
    color: #374151;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
    box-sizing: border-box;

    &:hover {
        background-color: #f3f4f6;
    }
`;

const Separator = styled.hr`
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 0.5rem 0;
`;

// --- Component ---
const StudentNavbar = () => {
    const { user, isAuthenticated, hasAnyRole, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/login');
    };

    const closeAllMenus = () => {
        setIsMenuOpen(false);
        setDropdownOpen(false);
    };

    // --- Logic kiểm tra quyền được gom lại một chỗ ---
    const isStudent = hasAnyRole(['User', 'student', 'Student']);
    const isOrganizer = hasAnyRole(['Organizer', 'event_creator', 'EventCreator']);
    const isUnionAdmin = hasAnyRole(['union', 'Union', 'Admin']); // Gộp Union và Admin
    const canManage = isOrganizer || isUnionAdmin; // Bất kỳ ai có quyền quản lý
    
    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <Nav>
            <NavContainer>
                <NavBrand to="/" onClick={closeAllMenus}>BK Events</NavBrand>
                <HamburgerButton onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? '✕' : '☰'}</HamburgerButton>

                {/* --- Cấu trúc menu thống nhất --- */}
                <NavLinks $isOpen={isMenuOpen}>
    <li><StyledNavLink to="/" onClick={closeAllMenus} end>Trang chủ</StyledNavLink></li>

    {isStudent && (
        <li><StyledNavLink to="/registered-events" onClick={closeAllMenus}>Sự kiện đã ĐK</StyledNavLink></li>
    )}

    {/* Các liên kết quản lý tách riêng ra */}
    {isOrganizer && (
        <>
            <li><StyledNavLink to="/admin/my-events" onClick={closeAllMenus}>Sự kiện của tôi</StyledNavLink></li>
            <li><StyledNavLink to="/admin/create-event" onClick={closeAllMenus}>Tạo sự kiện</StyledNavLink></li>
        </>
    )}

    {isUnionAdmin && (
        <>
            <li><StyledNavLink to="/admin/events" onClick={closeAllMenus}>Tất cả sự kiện</StyledNavLink></li>
            <li><StyledNavLink to="/admin/statistics" onClick={closeAllMenus}>Thi đua & Thi đua</StyledNavLink></li>
        </>
    )}

    {/* Chung cho Organizer và Union */}
    {canManage && (
        <li><StyledNavLink to="/admin/faculty-statistics" onClick={closeAllMenus}>Thống kê hoạt động</StyledNavLink></li>
    )}

    {isAuthenticated && (
        <li><StyledNavLink to="/profile" onClick={closeAllMenus}>Hồ sơ</StyledNavLink></li>
    )}

    {/* Mobile logout button */}
    {isAuthenticated && (
        <li style={{display: 'none'}} className="mobile-only">
            <Button onClick={handleLogout} variant="danger">Đăng xuất</Button>
        </li>
    )}
</NavLinks>


                {/* Phần Auth cho màn hình desktop */}
                <AuthSection>
                    {isAuthenticated ? (
                        <Button onClick={handleLogout} variant="secondary" size="small">Đăng xuất</Button>
                    ) : (
                        <>
                            <Button onClick={() => navigate('/login')} variant="primary" size="small">Đăng nhập</Button>
                            <Button onClick={() => navigate('/register')} variant="secondary" size="small">Đăng ký</Button>
                        </>
                    )}
                </AuthSection>
            </NavContainer>
        </Nav>
    );
};

export default StudentNavbar;