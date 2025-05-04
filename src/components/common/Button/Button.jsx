// src/components/common/Button/Button.jsx
import React from 'react';
import StyledButton from './StyledButton'; // Import từ file StyledButton vừa tạo

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary', // 'primary', 'secondary', 'danger'
    size = 'medium', // 'small', 'medium', 'large' - Thêm prop size
    disabled = false,
    isLoading = false,
    className = '', // Cho phép truyền class Tailwind/CSS để tùy chỉnh thêm nếu cần
    ...props
}) => {
    return (
        <StyledButton
            type={type}
            onClick={onClick}
            variant={variant}
            size={size} // Truyền prop size
            disabled={disabled || isLoading}
            isLoading={isLoading}
            className={className} // Kết hợp class Tailwind/CSS (nếu có)
            {...props}
        >
            {/* Children sẽ tự ẩn đi do style loading */}
            {children}
        </StyledButton>
    );
};

export default Button;