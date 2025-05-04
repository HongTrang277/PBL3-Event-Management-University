import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button/Button'; // Assume styled or accepts className
import { ROLES } from '../utils/constants';
import Input from '../components/common/Input/Input'; // Assume styled or accepts className

// --- Styled Components ---

const PageWrapper = styled.div`
  /* min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb; /* bg-gray-50 */
  padding: 3rem 1rem; /* py-12 px-4 */

  @media (min-width: 640px) { /* sm */
    padding-left: 1.5rem; /* sm:px-6 */
    padding-right: 1.5rem;
  }
  @media (min-width: 1024px) { /* lg */
    padding-left: 2rem; /* lg:px-8 */
    padding-right: 2rem;
  }
`;

const LoginBox = styled.div`
  /* max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md */
  max-width: 28rem; /* max-w-md */
  width: 100%;
  background-color: #ffffff;
  padding: 2.5rem; /* p-10 */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */

  /* Direct children spacing for space-y-8 */
   & > * + * {
    margin-top: 2rem;
  }
`;

const HeaderContainer = styled.div``;

const LoginTitle = styled.h2`
  /* mt-6 text-center text-3xl font-extrabold text-gray-900 font-dm-sans */
  margin-top: 1.5rem; /* mt-6 */
  text-align: center;
  font-size: 1.875rem; /* text-3xl */
  line-height: 2.25rem;
  font-weight: 800; /* font-extrabold */
  color: #111827; /* text-gray-900 */
  font-family: 'DM Sans', sans-serif; /* font-dm-sans */
`;

const LoginSubtitle = styled.p`
  /* mt-2 text-center text-sm text-gray-600 */
  margin-top: 0.5rem; /* mt-2 */
  text-align: center;
  font-size: 0.875rem; /* text-sm */
  line-height: 1.25rem;
  color: #4b5563; /* text-gray-600 */
`;

const StyledForm = styled.form`
  /* mt-8 space-y-6 */
  margin-top: 2rem; /* mt-8 */
  & > * + * {
    margin-top: 1.5rem; /* space-y-6 */
  }
`;

const ErrorMessage = styled.div`
  /* bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative */
  background-color: #fee2e2; /* bg-red-100 */
  border: 1px solid #fca5a5; /* border-red-400 */
  color: #b91c1c; /* text-red-700 */
  padding: 0.75rem 1rem; /* px-4 py-3 */
  border-radius: 0.25rem; /* rounded */
  position: relative;
`;

const RegisterLinkContainer = styled.div`
  /* text-sm text-center mt-4 */
  font-size: 0.875rem; /* text-sm */
  line-height: 1.25rem;
  text-align: center;
  margin-top: 1rem; /* mt-4 */
`;

const MutedText = styled.span`
  /* text-gray-600 */
  color: #4b5563;
`;

const LinkButton = styled.button`
  /* font-medium text-indigo-600 hover:text-indigo-500 */
  font-weight: 500; /* font-medium */
  color: #4f46e5; /* text-indigo-600 */
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: #6366f1; /* hover:text-indigo-500 */
    text-decoration: underline;
  }
`;

// --- Component ---

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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

            if (userData.role === ROLES.STUDENT) {
              // *** SỬA ĐỔI ĐIỀU HƯỚNG ***
              console.log("Redirecting STUDENT to /dashboard");
              navigate('/dashboard', { replace: true }); // Chuyển đến trang dashboard sinh viên
          } else if (userData.role === ROLES.EVENT_CREATOR || userData.role === ROLES.UNION) {
              console.log("Redirecting CREATOR/UNION to /admin/my-events");
              navigate('/admin/my-events', { replace: true });
          } else {
               console.log("Redirecting UNKNOWN role to /");
               navigate('/', { replace: true }); // Về trang chủ công khai
          }


        } catch (err) {
            setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
            setIsLoading(false);
        }
    };

  return (
    <PageWrapper>
       <LoginBox>
         <HeaderContainer>
           <LoginTitle>
             Đăng nhập hệ thống
           </LoginTitle>
           <LoginSubtitle>
             Sử dụng tài khoản Khoa/Đoàn trường hoặc Gmail sinh viên
           </LoginSubtitle>
         </HeaderContainer>
         <StyledForm onSubmit={handleSubmit}>
           {error && (
             <ErrorMessage role="alert">
               <span>{error}</span> {/* Removed block sm:inline */}
             </ErrorMessage>
           )}
           <Input
             id="username"
             label="Tên đăng nhập / Email"
             type="text"
             value={username}
             onChange={(e) => setUsername(e.target.value)}
             placeholder="Tên Khoa / Đoàn trường / abc@gmail.com"
             required
             autoComplete="username"
           />
           <Input
             id="password"
             label="Mật khẩu"
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             placeholder="Nhập mật khẩu"
             required
             autoComplete="current-password"
           />

           {/* Add remember me / forgot password links if needed */}

           <div>
             <Button
               type="submit"
               // className="w-full" // Button component might handle width or use styled(Button)
               style={{ width: '100%' }} // Inline style or styled(Button) is better
               isLoading={isLoading}
               disabled={isLoading}
             >
               {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
             </Button>
           </div>
            <RegisterLinkContainer>
               <MutedText>Chưa có tài khoản sinh viên? </MutedText>
               <LinkButton
                   type="button"
                   onClick={() => navigate('/register')}
                >
                   Đăng ký ngay
                </LinkButton>
             </RegisterLinkContainer>
         </StyledForm>
       </LoginBox>
     </PageWrapper>
  );
};

export default LoginPage;