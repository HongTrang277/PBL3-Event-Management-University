import React from 'react';
import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';

const SidebarWrapper = styled.div`
    width: 16rem;
    background-color: #003652;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 1rem;
`;

const BrandTitle = styled.div`
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
    margin-bottom: 2rem;
    font-family: 'DM Sans', sans-serif;
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
    margin-bottom: 0.75rem;
`;

const StyledNavLink = styled(NavLink)`
    display: block;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
    color: #dbeafe;
    text-decoration: none;

    &:hover {
        background-color: #1d4ed8;
        color: #ffffff;
    }

    &.active {
        background-color: #81ADC4;
        color: #ffffff;
        font-weight: 500;
    }
`;

const UserInfoSection = styled.div`
    margin-top: auto;
`;

const UserDetails = styled.div`
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-top: 1px solid #1e3a8a;
`;

const UserName = styled.p`
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0;
`;

const UserDetail = styled.p`
    font-size: 0.75rem;
    color: #bfdbfe;
    margin: 0;
    text-transform: capitalize;
`;

const StatisticsSidebar = ({ type }) => {
    const { user } = useAuth();
    const location = useLocation();
    const basePath = type === 'faculty' ? '/admin/creator-dashboard' : '/admin/statistics';

    const getTitle = () => {
        return type === 'faculty' ? 'Thống Kê Liên Chi Đoàn' : 'Thống Kê Đoàn Trường';
    };

    return (
        <SidebarWrapper>
            <BrandTitle>{getTitle()}</BrandTitle>
            <NavList>
                <ul>
                    <NavItem>
                        <StyledNavLink to={basePath}>
                            Tổng Quan
                        </StyledNavLink>
                    </NavItem>
                    <NavItem>
                        <StyledNavLink to={`${basePath}/events`}>
                            Sự Kiện
                        </StyledNavLink>
                    </NavItem>
                    <NavItem>
                        <StyledNavLink to={`${basePath}/participation`}>
                            Tham Gia
                        </StyledNavLink>
                    </NavItem>
                    <NavItem>
                        <StyledNavLink to={`${basePath}/performance`}>
                            Hiệu Quả
                        </StyledNavLink>
                    </NavItem>
                    <NavItem>
                        <StyledNavLink to={`${basePath}/comparison`}>
                            So Sánh
                        </StyledNavLink>
                    </NavItem>
                </ul>
            </NavList>
            <UserInfoSection>
                <UserDetails>
                    <UserName>{user?.name}</UserName>
                    <UserDetail>{user?.email}</UserDetail>
                    <UserDetail>{user?.role?.replace('_', ' ')}</UserDetail>
                </UserDetails>
            </UserInfoSection>
        </SidebarWrapper>
    );
};

export default StatisticsSidebar; 