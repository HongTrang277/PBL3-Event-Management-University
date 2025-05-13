// src/components/features/Events/FacultySelector.jsx
import React from 'react';
import styled from 'styled-components';
import { FACULTIES } from '../../utils/constants';

// --- Styled Components ---
const SelectWrapper = styled.div``; // Container nếu cần thêm style

const Label = styled.label`
  /* Có thể thêm style cho label nếu muốn */
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
  &:focus {
    outline: none;
    border-color: #4f46e5; /* focus:border-indigo-500 */
    box-shadow: 0 0 0 1px #4f46e5; /* focus:ring-indigo-500 - Giả lập ring bằng box-shadow */
  }
  /* Tùy chỉnh mũi tên select nếu cần */

  @media (min-width: 640px) { /* sm */
    font-size: 0.875rem; /* sm:text-sm */
    line-height: 1.25rem;
  }
`;

// --- Component Logic ---
function FacultySelector({ selectedFaculty, onChange }) {
  return (
    <SelectWrapper>
      <Label htmlFor="faculty-select">Khoa/Đơn vị tổ chức:</Label>
      <StyledSelect
        id="faculty-select"
        value={selectedFaculty}
        onChange={onChange}
      >
        <option value="">-- Chọn Khoa --</option>
        {FACULTIES.map((facultyName) => ( // Sử dụng facultyName làm key
          <option key={facultyName} value={facultyName}>
            {facultyName}
          </option>
        ))}
      </StyledSelect>
    </SelectWrapper>
  );
}

export default FacultySelector;

// Cách sử dụng component này trong trang CreateEventPage hoặc EventFilterBar:
// const [selectedFaculty, setSelectedFaculty] = useState('');
// const handleFacultyChange = (event) => {
//   setSelectedFaculty(event.target.value);
// };
// <FacultySelector selectedFaculty={selectedFaculty} onChange={handleFacultyChange} />