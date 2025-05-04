// src/layouts/AuthLayout.jsx
import React from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
// Optional: Import Logo component nếu bạn có
// import Logo from '../components/common/Logo/Logo';

// --- Styled Components --- (Giữ nguyên)
const AuthWrapper = styled.div`
    min-height: 100vh;
    background: linear-gradient(to bottom right, #eff6ff, #ffffff, #eef2ff);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3rem 1rem; /* Adjusted padding */

    @media (min-width: 640px) {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
    }
    @media (min-width: 1024px) {
        padding-left: 2rem;
        padding-right: 2rem;
    }
`;

// LogoContainer is removed as it wasn't used in the component's return block
// Add it back if you intend to use a Logo

const ContentWrapper = styled.div`
    width: 100%;
    margin-left: auto;
    margin-right: auto;

    @media (min-width: 640px) {
        max-width: 28rem; /* max-w-md */
    }
    /* Add default padding/margin for smaller screens if needed */
     padding-left: 0; /* Remove default padding, handled by AuthWrapper or child */
     padding-right: 0;
`;

const FooterWrapper = styled.div`
    margin-top: 2rem; /* mt-8 */
    text-align: center;
    font-size: 0.875rem; /* text-sm */
    color: #6b7280; /* text-gray-500 */
`;

const FooterText = styled.p`
    margin: 0;
`;

const FooterLinkParagraph = styled.p`
    margin: 0;
    margin-top: 0.25rem; /* mt-1 */
`;

const FooterLink = styled(RouterLink)`
    font-weight: 500;
    color: #4f46e5;
    text-decoration: none;
    &:hover {
        color: #6366f1;
        text-decoration: underline;
    }
`;

// --- Component --- (Giữ nguyên)
const AuthLayout = () => {
    return (
        <AuthWrapper>
            {/* Optional Logo here */}
            <ContentWrapper>
                <Outlet />
            </ContentWrapper>
            <FooterWrapper>
                <FooterText>&copy; {new Date().getFullYear()} Trường Đại học Bách khoa, ĐHĐN.</FooterText>
                <FooterLinkParagraph>
                    <FooterLink to="/">
                        Quay lại trang chủ
                    </FooterLink>
                </FooterLinkParagraph>
            </FooterWrapper>
        </AuthWrapper>
    );
};

export default AuthLayout;