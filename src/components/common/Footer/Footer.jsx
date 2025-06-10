// src/components/common/Footer/Footer.jsx
import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
    background-color: #1f2937; /* bg-gray-800 */
    color: #d1d5db; /* text-gray-300 */
    padding-top: 1.5rem; /* py-6 */
    padding-bottom: 1.5rem; /* py-6 */
    margin-top: auto; /* mt-auto để đẩy footer xuống cuối nếu nội dung trang ngắn */
`;

const Container = styled.div`
    max-width: 1280px; /* Ví dụ: max-w-screen-xl */
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem; /* px-4 */
    padding-right: 1rem; /* px-4 */
    text-align: center;

    @media (min-width: 640px) {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
    }
    @media (min-width: 1024px) {
        padding-left: 2rem;
        padding-right: 2rem;
    }
`;

const InfoSection = styled.div`
    margin-bottom: 0.75rem; /* mb-3 */
`;

const SchoolName = styled.p`
    font-size: 1.125rem; /* text-lg */
    font-weight: 600; /* font-semibold */
    color: #ffffff; /* text-white */
    margin: 0;
`;

const Address = styled.p`
    font-size: 0.875rem; /* text-sm */
    margin: 0;
    margin-top: 0.25rem; /* Add some space */
`;

const CopyrightSection = styled.div`
    border-top: 1px solid #374151; /* border-t border-gray-700 */
    padding-top: 1rem; /* pt-4 */
    display: flex;
    flex-direction: column; /* Default stack */
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem; /* text-sm */

    @media (min-width: 768px) { /* md */
        flex-direction: row; /* Row layout on medium screens */
    }
`;

const CopyrightText = styled.p`
    margin-bottom: 0.5rem; /* mb-2 */
    margin-top: 0;

    @media (min-width: 768px) { /* md */
        margin-bottom: 0; /* md:mb-0 */
    }
`;

const LinksContainer = styled.div`
    display: flex;
    gap: 1rem; /* space-x-4 equivalent */
`;

const FooterLink = styled.a`
    color: #d1d5db; /* Inherit color */
    text-decoration: none;
    transition: color 0.2s ease-in-out;

    &:hover {
        color: #ffffff; /* hover:text-white */
    }
`;

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <FooterWrapper>
            <Container>
                {/* Hàng 1: Tên trường và thông tin cơ bản */}
                <InfoSection>
                    <SchoolName>
                        Trường Đại học Bách khoa - Đại học Đà Nẵng
                    </SchoolName>
                    <Address>
                        Địa chỉ: 54 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng
                    </Address>
                    {/* <Address>Điện thoại: (0236) 3842 308</Address> */}
                </InfoSection>

                {/* Hàng 2: Copyright và liên kết */}
                <CopyrightSection>
                    <CopyrightText>
                        &copy; {currentYear} Bản quyền thuộc về Trường Đại học Bách khoa, ĐHĐN.
                    </CopyrightText>
                    <LinksContainer>
                        <FooterLink href="#">Chính sách bảo mật</FooterLink>
                        <FooterLink href="#">Liên hệ</FooterLink>
                        <FooterLink href="#">Sơ đồ trang</FooterLink>
                    </LinksContainer>
                </CopyrightSection>
            </Container>
        </FooterWrapper>
    );
};

export default Footer;