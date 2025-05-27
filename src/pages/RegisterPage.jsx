import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/common/Button/Button'; // Assume styled or accepts className
import Input from '../components/common/Input/Input'; // Assume styled or accepts className
import { authService } from '../services/api';
// --- Styled Components ---

const RegisterBox = styled.div`
  /* AuthLayout provides centering */
  /* bg-white py-8 px-4 shadow-md rounded-lg sm:px-10 */
  background-color: #ffffff;
  padding: 2rem 1rem; /* py-8 px-4 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
  border-radius: 0.5rem; /* rounded-lg */

  @media (min-width: 640px) { /* sm */
    padding-left: 2.5rem; /* sm:px-10 */
    padding-right: 2.5rem;
  }
`;

const HeaderContainer = styled.div`
  /* mb-6 text-center */
  margin-bottom: 1.5rem; /* mb-6 */
  text-align: center;
`;

const RegisterTitle = styled.h2`
  /* text-2xl md:text-3xl font-bold text-gray-900 font-dm-sans */
  font-size: 1.5rem; /* text-2xl */
  line-height: 2rem;
  font-weight: 700; /* font-bold */
  color: #111827; /* text-gray-900 */
  font-family: 'DM Sans', sans-serif; /* font-dm-sans */

  @media (min-width: 768px) { /* md */
    font-size: 1.875rem; /* md:text-3xl */
    line-height: 2.25rem;
  }
`;

const RegisterSubtitle = styled.p`
  /* mt-2 text-sm text-gray-600 */
  margin-top: 0.5rem; /* mt-2 */
  font-size: 0.875rem; /* text-sm */
  line-height: 1.25rem;
  color: #4b5563; /* text-gray-600 */
`;

const StyledForm = styled.form`
  /* space-y-5 */
   & > * + * {
    margin-top: 1.25rem; /* space-y-5 */
  }
`;

// Reusable Alert Message for Error and Success
const AlertMessage = styled.div`
  padding: 0.75rem 1rem; /* px-4 py-3 */
  border-radius: 0.25rem; /* rounded */
  position: relative;
  border-width: 1px;
  margin-bottom: 1rem; /* Implicit spacing */

  /* Error Variant */
  ${props => props.type === 'error' && `
    background-color: #fee2e2; /* bg-red-100 */
    border-color: #fca5a5; /* border-red-400 */
    color: #b91c1c; /* text-red-700 */
  `}

  /* Success Variant */
  ${props => props.type === 'success' && `
    background-color: #dcfce7; /* bg-green-100 */
    border-color: #86efac; /* border-green-400 */
    color: #15803d; /* text-green-700 */
  `}
`;


const LoginLinkContainer = styled.div`
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

const StyledRouterLink = styled(RouterLink)`
  /* font-medium text-indigo-600 hover:text-indigo-500 */
  font-weight: 500; /* font-medium */
  color: #4f46e5; /* text-indigo-600 */
  text-decoration: none;

  &:hover {
    color: #6366f1; /* hover:text-indigo-500 */
    text-decoration: underline;
  }
`;


// --- Component ---

const RegisterPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
        if (validationErrors[id]) {
            setValidationErrors((prev) => ({ ...prev, [id]: null }));
        }
        setError(null);
        setSuccessMessage('');
    };

    const validateForm = () => {
       const errors = {};
       const emailRegex = /^[^\s@]+@gmail\.com$/i;

       if (!formData.name.trim()) errors.name = "Tên không được để trống.";
       if (!formData.email.trim()) errors.email = "Email không được để trống.";
       else if (!emailRegex.test(formData.email)) errors.email = "Vui lòng nhập địa chỉ Gmail hợp lệ (@gmail.com).";
       if (!formData.password) errors.password = "Mật khẩu không được để trống.";
       else if (formData.password.length < 6) errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
       if (!formData.confirmPassword) errors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
       else if (formData.password && formData.confirmPassword !== formData.password) errors.confirmPassword = "Mật khẩu xác nhận không khớp.";

       setValidationErrors(errors);
       return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await authService.register({
              userName: formData.name,
              email: formData.email,
              password: formData.password,
            })
            setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập.');
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
            });
            setTimeout(() => {
                navigate('/login'); // Redirect to login after success
            }, 2000); // Redirect after 2 seconds


        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            }
        } finally {
            setIsLoading(false);
        }
    };

  return (
     <RegisterBox>
       <HeaderContainer>
         <RegisterTitle>
           Đăng ký tài khoản Sinh viên
         </RegisterTitle>
         <RegisterSubtitle>
           Sử dụng email Gmail cá nhân của bạn.
         </RegisterSubtitle>
       </HeaderContainer>

       <StyledForm onSubmit={handleSubmit}>
         {/* Display API error */}
         {error && (
           <AlertMessage type="error" role="alert">
             <span>{error}</span>
           </AlertMessage>
         )}
         {/* Display success message */}
         {successMessage && (
            <AlertMessage type="success" role="alert">
             <span>{successMessage}</span>
           </AlertMessage>
         )}

         <Input
           id="name"
           label="Họ và Tên"
           type="text"
           value={formData.name}
           onChange={handleChange}
           placeholder="Nguyễn Văn A"
           required
           error={validationErrors.name} // Pass validation error to Input
         />

         <Input
           id="email"
           label="Địa chỉ Gmail"
           type="email"
           value={formData.email}
           onChange={handleChange}
           placeholder="vidu@gmail.com"
           required
           error={validationErrors.email}
           autoComplete="email"
         />

         <Input
           id="password"
           label="Mật khẩu"
           type="password"
           value={formData.password}
           onChange={handleChange}
           placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
           required
           error={validationErrors.password}
           autoComplete="new-password"
         />

         <Input
           id="confirmPassword"
           label="Xác nhận Mật khẩu"
           type="password"
           value={formData.confirmPassword}
           onChange={handleChange}
           placeholder="Nhập lại mật khẩu"
           required
           error={validationErrors.confirmPassword}
           autoComplete="new-password"
         />

         <div>
           <Button
             type="submit"
             // className="w-full flex justify-center" // Handle width/centering in Button or here
             style={{ width: '100%', display: 'flex', justifyContent: 'center'}}
             isLoading={isLoading}
             disabled={isLoading || !!successMessage}
           >
             {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
           </Button>
         </div>

         <LoginLinkContainer>
             <MutedText>Đã có tài khoản? </MutedText>
             <StyledRouterLink to="/login">
                Đăng nhập ngay
             </StyledRouterLink>
         </LoginLinkContainer>
       </StyledForm>
     </RegisterBox>
  );
};

export default RegisterPage;