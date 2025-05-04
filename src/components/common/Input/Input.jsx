// src/components/common/Input.jsx
import React from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
    margin-bottom: 1rem; /* mb-4 */
    /* Allow className override */
    ${({ className }) => className}
`;

const StyledLabel = styled.label`
    display: block;
    font-size: 0.875rem; /* text-sm */
    line-height: 1.25rem;
    font-weight: 500; /* font-medium */
    color: #374151; /* text-gray-700 */
    margin-bottom: 0.25rem; /* mb-1 */
    /* Allow labelClassName override */
    ${({ labelClassName }) => labelClassName}
`;

const RequiredAsterisk = styled.span`
    color: #ef4444; /* text-red-500 */
`;

const StyledInput = styled.input`
    margin-top: 0.25rem; /* mt-1 */
    display: block;
    width: 100%;
    padding: 0.5rem 0.75rem; /* px-3 py-2 */
    border-radius: 0.375rem; /* rounded-md */
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
    border: 1px solid ${props => props.error ? '#f87171' : '#d1d5db'}; /* border-red-500 or border-gray-300 */
    appearance: none; /* Remove default appearance */
    background-color: #ffffff; /* Ensure background */
    color: #111827; /* Ensure text color */
    font-size: 1rem; /* text-base */
    line-height: 1.5rem;

    &::placeholder {
        color: #6b7280; /* placeholder-gray-500 */
        opacity: 1;
    }

    &:focus {
        outline: none;
        border-color: #4f46e5; /* focus:border-indigo-500 */
        box-shadow: 0 0 0 1px #4f46e5; /* focus:ring-indigo-500 */
    }

    @media (min-width: 640px) { /* sm */
        font-size: 0.875rem; /* sm:text-sm */
        line-height: 1.25rem;
    }

    /* Allow inputClassName override */
    ${({ inputClassName }) => inputClassName}

    /* Specific styles for file input */
    &[type="file"] {
        padding: 0.375rem 0.75rem; /* Adjust padding for file input */
    }

    /* Styling for file input button (pseudo-element) */
    &[type="file"]::file-selector-button {
        margin-right: 0.5rem; /* Example spacing */
        border: none;
        background-color: #e0e7ff; /* Example bg */
        color: #3730a3; /* Example text */
        padding: 0.375rem 0.75rem;
        border-radius: 0.25rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;

        &:hover {
            background-color: #c7d2fe; /* Example hover bg */
        }
    }
`;

const ErrorMessage = styled.p`
    margin-top: 0.25rem; /* mt-1 */
    font-size: 0.75rem; /* text-xs */
    color: #dc2626; /* text-red-600 */
`;

const Input = React.forwardRef(({
    label,
    id,
    type = 'text',
    value,
    onChange,
    placeholder,
    error, // Prop to display error
    className = '', // Wrapper class
    labelClassName = '', // Label class
    inputClassName = '', // Input class
    required = false,
    ...props
}, ref) => {
    return (
        <InputWrapper className={className}>
            {label && (
                <StyledLabel htmlFor={id} labelClassName={labelClassName}>
                    {label} {required && <RequiredAsterisk>*</RequiredAsterisk>}
                </StyledLabel>
            )}
            <StyledInput
                ref={ref}
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                error={!!error} // Pass boolean error state for styling
                inputClassName={inputClassName}
                {...props}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </InputWrapper>
    );
});

Input.displayName = 'Input'; // Important for React DevTools

export default Input;