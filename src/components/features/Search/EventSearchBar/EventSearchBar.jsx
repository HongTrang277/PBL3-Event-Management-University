// src/components/features/Search/EventSearchBar/EventSearchBar.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

// --- Styled Icon ---
const StyledSearchIcon = styled.svg`
    height: 1.25rem; /* h-5 */
    width: 1.25rem; /* w-5 */
    color: #6b7280; /* text-gray-500 implicit */
`;
const SearchIcon = () => (
    <StyledSearchIcon
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
    </StyledSearchIcon>
);

const StyledClearIcon = styled.svg`
    height: 1rem; /* h-4 */
    width: 1rem; /* w-4 */
`;
const ClearIcon = () => (
    <StyledClearIcon xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </StyledClearIcon>
);


// --- Styled Components ---
const SearchForm = styled.form`
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 42rem; /* max-w-xl */
    margin-left: auto;
    margin-right: auto;
`;

const InputWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: stretch;
    flex-grow: 1;
    border: 1px solid #d1d5db; /* border-gray-300 */
    border-radius: 0.375rem; /* rounded-md */
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
    transition: border-color 0.2s, box-shadow 0.2s;
    z-index: 1; /* Default */

    &:focus-within {
        z-index: 10; /* focus-within:z-10 */
        border-color: #4f46e5; /* focus-within:border-indigo-500 */
        box-shadow: 0 0 0 1px #4f46e5; /* focus-within:ring-1 focus-within:ring-indigo-500 */
    }
`;

const StyledInput = styled.input`
    display: block;
    width: 100%;
    border-radius: 0.375rem 0 0 0.375rem; /* rounded-none rounded-l-md */
    padding-left: 1rem; /* pl-4 */
    padding-right: 2.5rem; /* pr-10 (space for clear button) */
    padding-top: 0.5rem; /* py-2 */
    padding-bottom: 0.5rem; /* py-2 */
    border: 0; /* border-0 */
    font-size: 0.875rem; /* sm:text-sm */
    color: #111827; /* text-gray-900 */
    background-color: #ffffff; /* Ensure background */

    &::placeholder {
        color: #6b7280; /* placeholder-gray-500 */
        opacity: 1;
    }

    &:focus {
        outline: none; /* focus:ring-0 */
        box-shadow: none;
    }

     /* Hide browser's clear button */
    &::-webkit-search-decoration,
    &::-webkit-search-cancel-button,
    &::-webkit-search-results-button,
    &::-webkit-search-results-decoration {
        -webkit-appearance:none;
    }
`;

const ClearButton = styled.button`
    position: absolute;
    inset-block-start: 0;
    inset-block-end: 0;
    inset-inline-end: 0; /* right-0 */
    padding-inline-end: 0.75rem; /* pr-3 */
    display: flex;
    align-items: center;
    cursor: pointer;
    background: none;
    border: none;
    color: #9ca3af; /* text-gray-400 */
    transition: color 0.2s;

    &:hover {
        color: #4b5563; /* hover:text-gray-600 */
    }
    &:focus {
        outline: none;
    }
`;

const SubmitButton = styled.button`
    margin-left: -1px; /* ml-[-1px] */
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem; /* px-4 py-2 */
    border: 1px solid #d1d5db; /* border-gray-300 */
    font-size: 0.875rem; /* text-sm */
    line-height: 1.25rem;
    font-weight: 500; /* font-medium */
    border-radius: 0 0.375rem 0.375rem 0; /* rounded-r-md */
    color: #374151; /* text-gray-700 */
    background-color: #f9fafb; /* bg-gray-50 */
    transition: background-color 0.2s;
    cursor: pointer;

    &:hover {
        background-color: #f3f4f6; /* hover:bg-gray-100 */
    }

    &:focus {
        outline: none;
        z-index: 10;
        border-color: #4f46e5; /* focus:border-indigo-500 */
        box-shadow: 0 0 0 1px #4f46e5; /* focus:ring-1 focus:ring-indigo-500 */
    }

    span {
        margin-left: 0.5rem; /* ml-2 */
        @media (max-width: 640px) { /* sm */
            display: none; /* hidden sm:inline */
        }
    }
`;


// --- Component ---
const EventSearchBar = ({ onSearch, placeholder = "Tìm kiếm sự kiện theo tên, mô tả..." }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (onSearch && typeof onSearch === 'function') {
            onSearch(searchTerm.trim());
        }
        // Optional: Don't clear search term on submit to keep context
        // setSearchTerm('');
    };

     const handleClear = () => {
        setSearchTerm('');
         if (onSearch && typeof onSearch === 'function') {
            onSearch(''); // Trigger search with empty term
        }
     };

    return (
        <SearchForm onSubmit={handleSubmit}>
            <InputWrapper>
                <StyledInput
                    type="search"
                    name="search"
                    id="search"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleChange}
                />
                {searchTerm && (
                    <ClearButton
                        type="button"
                        onClick={handleClear}
                        aria-label="Clear search"
                    >
                       <ClearIcon />
                    </ClearButton>
                )}
            </InputWrapper>
            <SubmitButton type="submit">
                <SearchIcon />
                <span>Tìm kiếm</span>
            </SubmitButton>
        </SearchForm>
    );
};

export default EventSearchBar;