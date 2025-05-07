// src/layouts/AuthLayout.jsx
import React from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components'; // Import ThemeProvider nếu cần

// Giả định theme object giống như trong LoginPage.jsx
const theme = {
    colors: {
        primary: '#a8e0fd',
        'primary-1': "#47c1ff",
        'primary-2': "#ddf4ff",
        'primary-3': "#003652",
        'primary-4': "#5ba2dd",
        'primary-5': "#b1dcff",
        'primary-6': "#ceeeff",
        'primary-7': "#003652",
        'primary-8': "#02a533",
        // ... các màu khác
        white: '#ffffff',
        'custom-gray': { /* ...các màu xám... */
            600: '#718096',
        },
    },
     borderRadius: {
        'xl': '0.75rem',
     },
     // ... font chữ, shadow ...
};

const AuthWrapper = styled.div`
    min-height: 100vh;
    /* Đặt background gradient full trang ở đây */
    background: linear-gradient(135deg, ${props => props.theme.colors['primary-6']} 0%, ${props => props.theme.colors.white} 100%);
    display: flex;
    flex-direction: column;
    justify-content: center; /* Căn giữa theo chiều dọc */
    align-items: center; /* Căn giữa theo chiều ngang */
    padding: 2rem 1rem; /* Padding cho toàn trang */
`;

const ContentWrapper = styled.div`
    width: 100%;
    /* Đặt max-width cho khung nội dung (LoginContainer) */
    max-width: 60rem; /* Khớp với max-width của LoginContainer */
    margin-left: auto;
    margin-right: auto;
    /* Không cần padding ở đây vì LoginContainer sẽ tự có padding */
`;

const FooterWrapper = styled.div`
    margin-top: 2rem;
    text-align: center;
    font-size: 0.875rem;
    color: ${props => props.theme.colors['custom-gray'][600]}; // Sử dụng theme
`;

const FooterText = styled.p`
    margin: 0;
`;

const FooterLinkParagraph = styled.p`
    margin: 0;
    margin-top: 0.25rem;
`;

const FooterLink = styled(RouterLink)`
    font-weight: 500;
    color: ${props => props.theme.colors['primary-4']}; // Sử dụng theme
    text-decoration: none;
    &:hover {
        color: ${props => props.theme.colors['primary-3']}; // Sử dụng theme
        text-decoration: underline;
    }
`;

const AuthLayout = () => {
    return (
        // Cung cấp theme cho các component con nếu cần
        <ThemeProvider theme={theme}>
            <AuthWrapper>
                <ContentWrapper>
                    <Outlet /> {/* LoginPage sẽ được render ở đây */}
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
        </ThemeProvider>
    );
};

export default AuthLayout;