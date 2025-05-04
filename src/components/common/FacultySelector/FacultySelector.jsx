// src/components/features/Events/FacultySelector.jsx
import React from 'react';
import styled from 'styled-components';
// Cần đảm bảo đường dẫn này đúng
import { FACULTIES } from '../../../utils/constants';

// --- Styled Components ---
const SelectWrapper = styled.div`
 /* Container nếu cần thêm style */
 margin-bottom: 1rem; /* Thêm margin dưới */
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.25rem;
    font-size: 0.875rem; /* text-sm */
    font-weight: 500; /* font-medium */
    color: #374151; /* text-gray-700 */
`;

const StyledSelect = styled.select`
    margin-top: 0.25rem; /* mt-1 */
    display: block;
    width: 100%;
    padding-left: 0.75rem; /* pl-3 */
    padding-right: 2.5rem; /* pr-10 */
    padding-top: 0.5rem; /* py-2 */
    padding-bottom: 0.5rem; /* py-2 */
    font-size: 1rem; /* text-base */
    line-height: 1.5rem;
    border: 1px solid #d1d5db; /* border-gray-300 */
    border-radius: 0.375rem; /* rounded-md */
    background-color: white;
    color: #111827; /* text-gray-900 */
    appearance: none; /* Gỡ bỏ giao diện mặc định */
    background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z" clip-rule="evenodd"/></svg>');
    background-position: right 0.75rem center;
    background-repeat: no-repeat;
    background-size: 1.25em 1.25em;


    &:focus {
        outline: none;
        border-color: #4f46e5; /* focus:border-indigo-500 */
        box-shadow: 0 0 0 1px #4f46e5; /* focus:ring-indigo-500 - Giả lập ring */
    }

    @media (min-width: 640px) { /* sm */
        font-size: 0.875rem; /* sm:text-sm */
        line-height: 1.25rem;
    }
`;

// --- Component Logic ---
function FacultySelector({ selectedFaculty, onChange, id = "faculty-select", label = "Khoa/Đơn vị tổ chức:" }) {
    return (
        <SelectWrapper>
            {label && <Label htmlFor={id}>{label}</Label>}
            <StyledSelect
                id={id}
                value={selectedFaculty}
                onChange={onChange}
            >
                <option value="">-- Chọn Khoa/Đơn vị --</option>
                {FACULTIES.map((facultyName) => ( // Sử dụng facultyName làm key duy nhất
                    <option key={facultyName} value={facultyName}>
                        {facultyName}
                    </option>
                ))}
            </StyledSelect>
        </SelectWrapper>
    );
}

export default FacultySelector;