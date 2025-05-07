// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components'; // Import ThemeProvider
import { FaEye, FaEyeSlash, FaApple } from 'react-icons/fa'; // Icon cho password
import { FcGoogle } from 'react-icons/fc'; // Icon Google

import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button/Button';
import Input from '../components/common/Input/Input';
import { ROLES } from '../utils/constants';

// Lấy theme từ tailwind.config.js (giả định bạn có cách import hoặc định nghĩa lại)
// Ví dụ định nghĩa lại theme dựa trên config:
const theme = {
    colors: {
        primary: '#a8e0fd',
        'primary-1': "#47c1ff",
        'primary-2': "#ddf4ff",
        'primary-3': "#003652",
        'primary-4': "#5ba2dd",
        'primary-5': "#b1dcff",
        'primary-6': "#ceeeff",
        'primary-7': "#003652", // Trùng primary-3, có thể là typo
        'primary-8': "#02a533",
        secondary: '#ffd3ec',
        'secondary-1': "#eb7ebc",
        // ... các màu secondary khác
        'custom-gray': {
            100: '#f7fafc',
            200: '#edf2f7',
            300: '#e2e8f0',
            400: '#cbd5e0',
            500: '#a0aec0',
            600: '#718096',
            700: '#4a5568',
            800: '#2d3748',
            900: '#1a202c',
        },
        white: '#ffffff',
        // Thêm màu focus nếu cần, ví dụ:
        focusBorder: '#5ba2dd', // primary-4
        inputBorder: '#cbd5e0', // custom-gray-400
        placeholderText: '#a0aec0', // custom-gray-500
    },
    fontFamily: {
        'nutito-sans': ['"Nunito Sans"', 'sans-serif'],
        'dm-sans': ['"DM Sans"', 'sans-serif'],
    },
    borderRadius: {
        'lg': '0.5rem', // rounded-lg
        'xl': '0.75rem', // Gần giống ảnh hơn
        'md': '0.375rem', // rounded-md cho input/button nhỏ
        'full': '9999px',
    },
    boxShadow: {
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
};


// --- Styled Components ---

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Gradient nền dựa trên theme primary */
  background: linear-gradient(135deg, ${props => props.theme.colors['primary-6']} 0%, ${props => props.theme.colors.white} 100%);
  padding: 2rem 1rem;
`;

const LoginContainer = styled.div`
  width: 100%;
  max-width: 60rem; /* ~ max-w-6xl để chứa 2 cột */
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius['xl']};
  box-shadow: ${props => props.theme.boxShadow['lg']};
  display: flex;
  overflow: hidden; /* Đảm bảo ảnh không tràn ra ngoài */

  @media (max-width: 768px) { /* Stack columns on smaller screens */
      flex-direction: column;
      max-width: 28rem; /* max-w-md cho màn hình nhỏ */
  }
`;

const LeftColumn = styled.div`
  flex: 1 1 50%; /* Chiếm 50% không gian */
  padding: 2.5rem 3rem; /* Tăng padding */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Căn giữa nội dung form */

  @media (max-width: 768px) {
      order: 2; /* Form ở dưới ảnh trên mobile */
      padding: 2rem 1.5rem;
  }
`;

const RightColumn = styled.div`
  flex: 1 1 50%;
  display: block; /* Hiển thị cột ảnh */
  background-color: ${props => props.theme.colors['custom-gray'][100]}; /* Nền fallback */

  @media (max-width: 768px) {
      order: 1; /* Ảnh lên trên trên mobile */
      min-height: 250px; /* Chiều cao tối thiểu cho ảnh */
      flex-basis: auto; /* Reset basis */
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;


const FormHeader = styled.div`
  margin-bottom: 1.5rem;
  /* Thêm logo nếu cần */
  /* display: flex; justify-content: space-between; align-items: center; */
`;

const Title = styled.h2`
  font-family: ${props => props.theme.fontFamily['dm-sans']};
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700;
  color: ${props => props.theme.colors['primary-3']};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-family: ${props => props.theme.fontFamily['nutito-sans']};
  font-size: 0.875rem; /* text-sm */
  color: ${props => props.theme.colors['custom-gray'][600]};
  margin-bottom: 2rem;
`;

const StyledForm = styled.form`
  width: 100%;
  & > * + * {
    margin-top: 1rem; /* Giảm khoảng cách giữa các input */
  }
`;

// Sử dụng lại component Input đã có, chỉ cần đảm bảo nó nhận theme
// Nếu Input chưa nhận theme, bạn cần chỉnh sửa nó hoặc dùng StyledInput trực tiếp
// Ví dụ custom lại Input nếu cần:
const StyledInputGroup = styled.div`
  position: relative;
  margin-bottom: 1.25rem; /* Thêm khoảng cách dưới mỗi group */

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: ${props => props.theme.colors['custom-gray'][700]};
    margin-bottom: 0.3rem; /* Khoảng cách label và input */
  }

  input {
      display: block;
      width: 100%;
      padding: 0.75rem 1rem; /* Tăng padding */
      font-size: 0.875rem;
      font-family: ${props => props.theme.fontFamily['nutito-sans']};
      color: ${props => props.theme.colors['custom-gray'][900]};
      background-color: ${props => props.theme.colors.white};
      border: 1px solid ${props => props.error ? props.theme.colors.secondary : props.theme.colors.inputBorder};
      border-radius: ${props => props.theme.borderRadius.md};
      box-shadow: none; /* Bỏ shadow mặc định của Input component nếu có */
      transition: border-color 0.2s;

      &::placeholder {
          color: ${props => props.theme.colors.placeholderText};
          opacity: 1;
      }

      &:focus {
          outline: none;
          border-color: ${props => props.theme.colors.focusBorder};
          /* box-shadow: 0 0 0 1px ${props => props.theme.colors.focusBorder}; */ /* Tùy chọn ring focus */
      }
  }
`;


const PasswordWrapper = styled.div`
  position: relative;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.colors['custom-gray'][500]};
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;

  &:focus {
    outline: none;
  }
`;

// Styled Button (sử dụng lại hoặc custom nếu cần)
const SubmitButton = styled(Button)`
  width: 100%;
  padding: 0.75rem 1rem; /* Điều chỉnh padding */
  font-size: 1rem;
  font-weight: 600;
  background-color: ${props => props.theme.colors['primary-4']};
  border-color: ${props => props.theme.colors['primary-4']};
  color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-top: 1.5rem; /* Khoảng cách trên nút submit */

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors['primary-3']}; /* Darker blue on hover */
    border-color: ${props => props.theme.colors['primary-3']};
  }

   &:focus {
      /* Giữ lại focus style từ Button gốc hoặc định nghĩa lại */
       box-shadow: 0 0 0 2px ${props => props.theme.colors.white}, 0 0 0 4px ${props => props.theme.colors['primary-4']};
    }

`;

const AlternativeLogins = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem; /* Khoảng cách trên nút alt */
`;

const AltButton = styled.button`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${props => props.theme.colors['custom-gray'][100]};
  color: ${props => props.theme.colors['custom-gray'][700]};
  border: 1px solid ${props => props.theme.colors.inputBorder};
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;

  svg {
    margin-right: 0.5rem;
    font-size: 1.1rem; /* Tăng kích thước icon */
  }

  &:hover {
    background-color: ${props => props.theme.colors['custom-gray'][200]};
  }
   &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.focusBorder};
      box-shadow: 0 0 0 1px ${props => props.theme.colors.focusBorder};
    }
`;

const FooterText = styled.p`
  margin-top: 2rem; /* Khoảng cách trên footer */
  text-align: center;
  font-size: 0.875rem;
  color: ${props => props.theme.colors['custom-gray'][600]};
`;

const SignUpLink = styled(RouterLink)`
  font-weight: 600;
  color: ${props => props.theme.colors['primary-4']};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    color: ${props => props.theme.colors['primary-3']};
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2; /* bg-red-100 */
  border: 1px solid #fca5a5; /* border-red-400 */
  color: #b91c1c; /* text-red-700 */
  padding: 0.75rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.875rem;
  margin-bottom: 1rem; /* Thêm margin nếu có lỗi */
`;


// --- Component ---

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const userData = await login({ username, password });
            setIsLoading(false);

             // Điều hướng dựa trên role
            if (userData.role === ROLES.STUDENT) {
                 console.log("Redirecting STUDENT to /dashboard");
                 navigate('/dashboard', { replace: true });
            } else if (userData.role === ROLES.EVENT_CREATOR || userData.role === ROLES.UNION) {
                 console.log("Redirecting CREATOR/UNION to /admin/my-events");
                 navigate('/admin/my-events', { replace: true });
            } else {
                 console.log(`Redirecting ${userData.role} to home`);
                 navigate(from, { replace: true }); // Hoặc navigate('/', { replace: true });
            }

        } catch (err) {
            setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
            setIsLoading(false);
        }
    };

    return (
        // Wrap component với ThemeProvider để các styled components có thể truy cập theme
        <ThemeProvider theme={theme}>
            <PageWrapper>
                <LoginContainer>
                    {/* Cột trái - Form */}
                    <LeftColumn>
                        <FormHeader>
                             {/* <img src="/path/to/crextra-logo.png" alt="Crextra Logo" style={{ height: '30px' }} /> */}
                             {/* Nếu bạn có logo thì thêm vào đây */}
                        </FormHeader>

                        <Title>Đăng nhập hệ thống</Title>
                        <Subtitle>Sử dụng tài khoản Khoa/Đoàn trường hoặc Gmail sinh viên của bạn.</Subtitle>

                        {error && (
                            <ErrorMessage role="alert">
                                <span>{error}</span>
                            </ErrorMessage>
                        )}

                        <StyledForm onSubmit={handleSubmit}>
                            {/* Input Username */}
                            <StyledInputGroup>
                                <label htmlFor="username">Tên đăng nhập / Email</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Tên Khoa / Đoàn trường / abc@gmail.com"
                                    required
                                    autoComplete="username"
                                />
                             </StyledInputGroup>

                             {/* Input Password */}
                             <StyledInputGroup>
                                 <label htmlFor="password">Mật khẩu</label>
                                 <PasswordWrapper>
                                     <input
                                         id="password"
                                         type={showPassword ? 'text' : 'password'}
                                         value={password}
                                         onChange={(e) => setPassword(e.target.value)}
                                         placeholder="Nhập mật khẩu"
                                         required
                                         autoComplete="current-password"
                                     />
                                     <ToggleButton
                                         type="button"
                                         onClick={() => setShowPassword(!showPassword)}
                                         aria-label={showPassword ? "Hide password" : "Show password"}
                                     >
                                         {showPassword ? <FaEyeSlash /> : <FaEye />}
                                     </ToggleButton>
                                 </PasswordWrapper>
                             </StyledInputGroup>


                            {/* Submit Button */}
                            <SubmitButton
                                type="submit"
                                variant="primary" // Sử dụng variant từ component Button nếu có logic màu ở đó
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                            </SubmitButton>

                            {/* Alternative Logins */}
                            <AlternativeLogins>
                                <AltButton type="button" onClick={() => alert('Login with Apple clicked!')}>
                                    <FaApple /> Apple
                                </AltButton>
                                <AltButton type="button" onClick={() => alert('Login with Google clicked!')}>
                                    <FcGoogle /> Google
                                </AltButton>
                            </AlternativeLogins>

                            {/* Footer Links */}
                            <FooterText>
                                Chưa có tài khoản sinh viên?{' '}
                                <SignUpLink to="/register">Đăng ký ngay</SignUpLink>
                            </FooterText>
                             <FooterText>
                                <SignUpLink to="/terms">Điều khoản & Điều kiện</SignUpLink>
                            </FooterText>
                        </StyledForm>
                    </LeftColumn>

                    {/* Cột phải - Hình ảnh */}
                    <RightColumn>
                         {/* Thay thế src bằng URL ảnh thực tế của bạn */}
                        <StyledImage
                            src="https://i.pinimg.com/736x/1c/89/62/1c89623c82775c76242435eb02b5b69b.jpg"
                            alt="Team collaborating on project"
                        />
                    </RightColumn>
                </LoginContainer>
            </PageWrapper>
        </ThemeProvider>
    );
};

export default LoginPage;