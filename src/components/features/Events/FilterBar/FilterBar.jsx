import React from 'react';
// Import mảng FACULTIES từ file constants
import { FACULTIES } from '../../utils/constants';

function FacultySelector({ selectedFaculty, onChange }) {
  return (
    <div>
      <label htmlFor="faculty-select">Khoa/Đơn vị tổ chức:</label>
      <select
        id="faculty-select"
        value={selectedFaculty} // Giá trị hiện tại được chọn
        onChange={onChange} // Hàm xử lý khi lựa chọn thay đổi
        // Áp dụng class Tailwind hoặc styled-components ở đây nếu cần
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="">-- Chọn Khoa --</option> {/* Option mặc định */}
        {/* Dùng hàm map để lặp qua mảng FACULTIES và tạo ra các <option> */}
        {FACULTIES.map((facultyName, index) => (
          <option key={index} value={facultyName}>
            {facultyName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FacultySelector;

// Cách sử dụng component này trong trang CreateEventPage hoặc EventFilterBar:
// const [selectedFaculty, setSelectedFaculty] = useState('');
// const handleFacultyChange = (event) => {
//   setSelectedFaculty(event.target.value);
// };
// <FacultySelector selectedFaculty={selectedFaculty} onChange={handleFacultyChange} />