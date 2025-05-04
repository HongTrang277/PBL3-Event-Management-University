// src/components/common/Button/StyledButton.js
import styled, { css, keyframes } from 'styled-components';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const getVariantStyles = (variant) => {
    switch (variant) {
        case 'secondary':
            return css`
                background-color: #e5e7eb; /* bg-gray-200 */
                color: #1f2937; /* text-gray-800 */
                border: 1px solid #d1d5db; /* border-gray-300 */
                &:hover:not(:disabled) {
                    background-color: #d1d5db; /* hover:bg-gray-300 */
                }
                &:focus {
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #4f46e5; /* focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 */
                }
            `;
        case 'danger':
            return css`
                background-color: #ef4444; /* bg-red-500 */
                color: white;
                border: 1px solid transparent;
                &:hover:not(:disabled) {
                    background-color: #dc2626; /* hover:bg-red-600 */
                }
                &:focus {
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #ef4444; /* focus:ring-2 focus:ring-offset-2 focus:ring-red-500 */
                }
            `;
        case 'primary':
        default:
            return css`
                background-color: #4f46e5; /* bg-indigo-600 */
                color: white;
                border: 1px solid transparent;
                &:hover:not(:disabled) {
                    background-color: #4338ca; /* hover:bg-indigo-700 */
                }
                &:focus {
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #4f46e5; /* focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 */
                }
            `;
    }
};

const getSizeStyles = (size) => {
    switch (size) {
        case 'small':
            return css`
                padding: 0.25rem 0.75rem; /* py-1 px-3 */
                font-size: 0.875rem; /* text-sm */
            `;
        case 'large':
             return css`
                padding: 0.75rem 1.5rem; /* py-3 px-6 */
                font-size: 1.125rem; /* text-lg */
            `;
        case 'medium':
        default:
            return css`
                padding: 0.5rem 1rem; /* py-2 px-4 */
                font-size: 1rem; /* text-base */
            `;
    }
}

const StyledButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem; /* rounded-md */
    font-weight: 500; /* font-medium */
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
    transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out;
    cursor: pointer;
    position: relative; /* Needed for loader positioning */

    /* Apply variant styles */
    ${({ variant }) => getVariantStyles(variant)}

    /* Apply size styles */
    ${({ size }) => getSizeStyles(size)}

    /* Disabled state */
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    /* Loading state */
    ${({ $isLoading }) =>
        $isLoading &&
        css`
            color: transparent !important; /* Hide text */
            pointer-events: none; /* Prevent clicks while loading */
            &::after {
                content: '';
                position: absolute;
                width: 1rem; /* w-4 */
                height: 1rem; /* h-4 */
                top: 50%;
                left: 50%;
                margin-top: -0.5rem; /* -(h-4 / 2) */
                margin-left: -0.5rem; /* -(w-4 / 2) */
                border: 2px solid currentColor;
                border-top-color: transparent;
                border-radius: 50%;
                animation: ${spin} 0.6s linear infinite;
                 /* Use foreground color based on variant for the spinner */
                border-color: ${({ variant }) => (variant === 'secondary' ? '#1f2937' : 'white')};
                border-top-color: transparent;
            }
    `}
`;

export default StyledButton;