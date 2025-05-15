import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/common/Button/Button'; // Assume Button is styled or accepts className
import { eventService } from '../services/api'; // Import your API service
import { ATTENDANCE_TYPES, TAGS } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input/Input'; // Assume Input is styled or accepts className

// --- Styled Components ---

const PageWrapper = styled.div`
  /* container mx-auto p-4 md:p-6 bg-white rounded-lg shadow */
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 1rem; /* p-4 */
  background-color: #ffffff;
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow */

  @media (min-width: 640px) { /* container breakpoints */
    max-width: 640px;
  }
  @media (min-width: 768px) { /* md */
    max-width: 768px;
    padding: 1.5rem; /* md:p-6 */
  }
  @media (min-width: 1024px) {
    max-width: 1024px;
  }
   @media (min-width: 1280px) {
    max-width: 1280px;
  }
   @media (min-width: 1536px) {
    max-width: 1536px;
  }
`;

const Title = styled.h1`
  /* text-2xl md:text-3xl font-bold mb-6 font-dm-sans text-gray-800 */
  font-size: 1.5rem; /* text-2xl */
  line-height: 2rem;
  font-weight: 700; /* font-bold */
  margin-bottom: 1.5rem; /* mb-6 */
  font-family: 'DM Sans', sans-serif; /* font-dm-sans */
  color: #1f2937; /* text-gray-800 */

  @media (min-width: 768px) { /* md */
    font-size: 1.875rem; /* md:text-3xl */
    line-height: 2.25rem;
  }
`;

const StyledForm = styled.form`
  /* space-y-6 */
  & > * + * {
    margin-top: 1.5rem;
  }
`;

const ErrorMessage = styled.div`
  /* bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 */
  background-color: #fee2e2; /* bg-red-100 */
  border-left-width: 4px;
  border-color: #ef4444; /* border-red-500 */
  color: #b91c1c; /* text-red-700 */
  padding: 1rem; /* p-4 */
  margin-bottom: 1.5rem; /* mb-6 */
  border-radius: 0.25rem; /* Added for consistency */

  p {
    margin: 0;
  }
  p:first-child {
     font-weight: 700; /* font-bold */
  }
`;

const FormGroup = styled.div``; // Wrapper for label + input/textarea

const StyledLabel = styled.label`
  /* block text-sm font-medium text-gray-700 mb-1 */
  display: block;
  font-size: 0.875rem; /* text-sm */
  line-height: 1.25rem;
  font-weight: 500; /* font-medium */
  color: #374151; /* text-gray-700 */
  margin-bottom: 0.25rem; /* mb-1 */
`;

const RequiredAsterisk = styled.span`
  color: #ef4444; /* text-red-500 */
`;

const StyledTextarea = styled.textarea`
  /* mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm */
  margin-top: 0.25rem; /* mt-1 */
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem; /* px-3 py-2 */
  border: 1px solid #d1d5db; /* border-gray-300 */
  border-radius: 0.375rem; /* rounded-md */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
  font-size: 0.875rem; /* sm:text-sm */
  line-height: 1.25rem;
  &:focus {
    outline: none;
    border-color: #6366f1; /* focus:border-indigo-500 */
    box-shadow: 0 0 0 1px #6366f1; /* focus:ring-indigo-500 */
  }
`;

const GridContainer = styled.div`
  /* grid grid-cols-1 md:grid-cols-2 gap-6 */
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem; /* gap-6 */

  @media (min-width: 768px) { /* md */
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const PreviewContainer = styled.div`
  /* flex space-x-4 */
  display: flex;
  gap: 1rem; /* space-x-4 */
`;

const PreviewImage = styled.img`
  /* h-20 w-20 object-contain border rounded */
  height: 5rem; /* h-20 */
  width: 5rem; /* w-20 */
  object-fit: contain;
  border: 1px solid #d1d5db; /* border */
  border-radius: 0.25rem; /* rounded */
`;
const PreviewImageCover = styled(PreviewImage)`
  /* h-20 w-auto object-contain border rounded */
  width: auto;
`

const RadioGroup = styled.div`
  /* flex items-center space-x-4 */
  display: flex;
  align-items: center;
  gap: 1rem; /* space-x-4 */
`;

const RadioLabel = styled.label`
  /* inline-flex items-center */
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  input[type="radio"] {
    /* form-radio text-indigo-600 */
    appearance: none;
    border-radius: 50%;
    width: 1em;
    height: 1em;
    border: 1px solid #d1d5db;
    transition: border-color 0.2s ease-in-out;
    position: relative; /* For the dot */
    &:checked {
      border-color: #4f46e5; /* indigo-600 */
      background-color: #4f46e5;
    }
    &:checked::after { /* The inner dot */
        content: '';
        display: block;
        width: 0.5em;
        height: 0.5em;
        border-radius: 50%;
        background: white;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    &:focus {
       outline: none;
       box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.5); /* Example focus ring */
    }
  }

  span {
    /* ml-2 */
    margin-left: 0.5rem;
  }
`;

const TagGrid = styled.div`
  /* grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 */
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem; /* gap-2 */

  @media (min-width: 640px) { /* sm */
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (min-width: 768px) { /* md */
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const TagLabel = styled.label`
  /* inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-200 cursor-pointer */
  display: inline-flex;
  align-items: center;
  background-color: #f3f4f6; /* bg-gray-100 */
  padding: 0.25rem 0.75rem; /* px-3 py-1 */
  border-radius: 9999px; /* rounded-full */
  font-size: 0.875rem; /* text-sm */
  line-height: 1.25rem;
  color: #374151; /* text-gray-700 */
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #e5e7eb; /* hover:bg-gray-200 */
  }

  input[type="checkbox"] {
    /* form-checkbox rounded text-indigo-600 mr-2 focus:ring-indigo-500 */
     appearance: none;
     border-radius: 0.25rem; /* rounded */
     width: 1em;
     height: 1em;
     border: 1px solid #d1d5db;
     transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
     margin-right: 0.5rem; /* mr-2 */
     position: relative; /* For the checkmark */
     cursor: pointer;

     &:checked {
        border-color: #4f46e5; /* indigo-600 */
        background-color: #4f46e5; /* indigo-600 */
     }
      &:checked::after { /* Simple checkmark */
        content: '';
        display: block;
        width: 0.3em;
        height: 0.6em;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg) translate(-10%, -10%);
        position: absolute;
        left: 0.25em;
        top: 0.05em;
    }
     &:focus {
       outline: none;
       box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.5); /* focus:ring-indigo-500 */
     }
  }
`;

const ActionContainer = styled.div`
  /* flex justify-end space-x-3 pt-4 */
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem; /* space-x-3 */
  padding-top: 1rem; /* pt-4 */
`;

// --- Component ---

// const [logoUrl, setLogoUrl] = useState(null);
// const [coverUrl, setCoverUrl] = useState(null);

// useEffect(() => {
//   if (!logo) {
//     setLogoUrl(null);
//     return;
//   }
//   const objectUrl = URL.createObjectURL(logo);
//   setLogoUrl(objectUrl);

//   // Cleanup function: revoke URL khi logo thay đổi hoặc component unmount
//   return () => URL.revokeObjectURL(objectUrl);
// }, [logo]); // Chỉ chạy lại khi state 'logo' thay đổi

// // Tương tự cho cover preview
// useEffect(() => {
//   if (!cover) {
//     setCoverUrl(null);
//     return;
//   }
//   const objectUrl = URL.createObjectURL(cover);
//   setCoverUrl(objectUrl);
//   return () => URL.revokeObjectURL(objectUrl);
// }, [cover]);

const CreateEventPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // Lấy thông tin người dùng đang đăng nhập
    const [success, setSuccess] = useState(null); // Thông báo thành công
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [capacity, setCapacity] = useState('');
    const [logo, setLogo] = useState(null); // File object
    const [cover, setCover] = useState(null); // File object
    const [attendanceType, setAttendanceType] = useState(ATTENDANCE_TYPES.OFFLINE);
    const [location, setLocation] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null); // String or object for detailed error
    const [logoUrl, setLogoUrl] = useState(null); // Khai báo state cho URL xem trước logo
    const [coverUrl, setCoverUrl] = useState(null); // Khai báo state cho URL xem trước cover
    const [fileErrors, setFileErrors] = useState({}); // <--- DÒNG CẦN THÊM
    useEffect(() => {
      if (!logo) {
        setLogoUrl(null); // Nếu không có file logo, đặt URL là null
        return;
      }
      // Tạo object URL từ file logo
      const objectUrl = URL.createObjectURL(logo);
      setLogoUrl(objectUrl); // Cập nhật state logoUrl

      // Cleanup: Thu hồi object URL khi component unmount hoặc file logo thay đổi
      return () => URL.revokeObjectURL(objectUrl);
    }, [logo]); // Hook này chạy lại mỗi khi state 'logo' thay đổi

    // Tương tự cho ảnh bìa (cover)
    useEffect(() => {
      if (!cover) {
        setCoverUrl(null); // Nếu không có file cover, đặt URL là null
        return;
      }
      // Tạo object URL từ file cover
      const objectUrl = URL.createObjectURL(cover);
      setCoverUrl(objectUrl); // Cập nhật state coverUrl

      // Cleanup: Thu hồi object URL
      return () => URL.revokeObjectURL(objectUrl);
    }, [cover]); // Hook này chạy lại mỗi khi state 'cover' thay đổi


    const handleFileChange = (fieldName, setter) => (event) => {
      const file = event.target.files[0];
      const newErrors = { ...fileErrors }; // Copy lỗi cũ
      if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
          setter(file);
          delete newErrors[fieldName]; // Xóa lỗi cho trường này nếu hợp lệ
          setFileErrors(newErrors);
      } else {
          setter(null);
          if (file) { // Chỉ báo lỗi nếu người dùng đã chọn file sai loại
             newErrors[fieldName] = 'Vui lòng chọn file ảnh định dạng JPG hoặc PNG.';
          } else {
             delete newErrors[fieldName]; // Xóa lỗi nếu người dùng hủy chọn file
          }
          setFileErrors(newErrors);
      }
    };

    const handleTagChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedTags([...selectedTags, value]);
        } else {
            setSelectedTags(selectedTags.filter((tag) => tag !== value));
        }
    };

    const validateForm = () => {
        // Validation logic remains the same
         const today = new Date().toISOString().split('T')[0];
         const startTime = new Date(startDate);
         const endTime = new Date(endDate);

         if (!eventName.trim()) return "Tên sự kiện không được để trống.";
         if (!description.trim()) return "Mô tả sự kiện không được để trống.";
         if (!startDate) return "Ngày bắt đầu không được để trống.";
         //if (startDate < today) return "Ngày bắt đầu phải là một ngày trong tương lai."; // Check might need adjustment for datetime-local
         if (!endDate) return "Ngày kết thúc không được để trống.";
         if (endTime <= startTime) return "Ngày kết thúc phải sau ngày bắt đầu.";
         if (!capacity || parseInt(capacity, 10) <= 0) return "Số lượng tham gia phải là số dương.";
         if (attendanceType === ATTENDANCE_TYPES.OFFLINE && !location.trim()) return "Địa điểm không được để trống khi tổ chức offline.";
         if (!logo) return "Vui lòng tải lên ảnh logo.";
         if (!cover) return "Vui lòng tải lên ảnh bìa (background).";
         return null;
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null); // Reset lỗi chung
      setFileErrors({}); // Reset lỗi file

      // --- Bước 1: Validate Form và File Inputs ---
      const validationError = validateForm();
      // (Giả sử fileErrors được cập nhật đúng trong handleFileChange)
      const hasFileErrors = Object.keys(fileErrors).length > 0;

      if (validationError || hasFileErrors) {
          setError(validationError || "Vui lòng kiểm tra lại thông tin file tải lên.");
          // Có thể hiển thị fileErrors chi tiết hơn ở đây nếu muốn
          return;
      }

      setIsLoading(true);

  try {
    // Chuẩn bị dữ liệu cho API
    const eventData = {
  EventName: eventName.trim(),
  Description: description.trim(),
  AttendanceType: attendanceType,
  Location: attendanceType === ATTENDANCE_TYPES.ONLINE ? location.trim() || 'Online Platform' : location.trim(),
  StartDate: new Date(startDate).toISOString(),
  EndDate: new Date(endDate).toISOString(),
  Capacity: parseInt(capacity, 10),
  HostId: user?.id || '',
  PlanLink: 'some-link', // Thay thế bằng link thực tế nếu cần
  LogoUrl: 'some-link', // Thay thế bằng link thực tế nếu cần
  CoverUrl: 'some-link', // Thay thế bằng link thực tế nếu cần
  CreateAt: new Date().toISOString(),
  longitude: 0,
  latitude: 0,
};
    console.log('Sending event data:', eventData);

    // Gọi API để tạo sự kiện
    const response = await eventService.createEvent(eventData);

    console.log('Event created successfully:', response.data);
    setSuccess('Sự kiện đã được tạo thành công!');

    // Reset form sau khi thành công
    setEventName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setCapacity('');
    setAttendanceType(ATTENDANCE_TYPES.OFFLINE);
    setLocation('');
    setSelectedTags([]);
    setTimeout(() => {
      navigate('/admin/my-events'); // Redirect to events page after success
    }, 2000); // Redirect after 2 seconds
  } catch (err) {
    console.error('Error creating event:', err);
    const errorMessage = err.response?.data?.message || 'Đã xảy ra lỗi khi tạo sự kiện.';
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  return (
    
    <PageWrapper>
      <Title>Tạo sự kiện mới</Title>
      {logoUrl && <PreviewImage src={logoUrl} alt="Logo Preview" />}
{coverUrl && <PreviewImageCover src={coverUrl} alt="Cover Preview" />}
      <StyledForm onSubmit={handleSubmit}>
        {error && (
          <ErrorMessage role="alert">
            <p>Lỗi</p>
            <p>{error}</p>
          </ErrorMessage>
        )}

        {/* Use Input component as before */}
        <Input
          id="eventName"
          label="Tên sự kiện"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Nhập tên sự kiện"
          required
        />

        {/* Description Textarea */}
        <FormGroup>
          <StyledLabel htmlFor="description">
            Mô tả sự kiện <RequiredAsterisk>*</RequiredAsterisk>
          </StyledLabel>
          <StyledTextarea
            id="description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả chi tiết về sự kiện"
            required
          />
        </FormGroup>

        {/* Date Inputs */}
        <GridContainer>
          <Input
            id="startDate"
            label="Ngày giờ bắt đầu"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            id="endDate"
            label="Ngày giờ kết thúc"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            min={startDate || ''}
          />
        </GridContainer>

        {/* Capacity Input */}
        <Input
          id="capacity"
          label="Số lượng tham gia tối đa"
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          placeholder="Nhập số lượng"
          required
          min="1"
        />

        {/* File Inputs */}
        <GridContainer>
            {/* Keep Input component for file uploads, passing styled classNames if needed */}
           <Input
            id="logo"
            label="Ảnh Logo (.jpg, .png)"
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleFileChange('logo',setLogo)}
            required
            // These classNames style the *internal* parts of the file input via Tailwind
            inputClassName="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
           <Input
            id="cover"
            label="Ảnh Bìa (Background) (.jpg, .png)"
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleFileChange('cover',setCover)}
            required
            inputClassName="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </GridContainer>

        {/* Image Previews */}
        <PreviewContainer>
            {logo && <PreviewImage src={URL.createObjectURL(logo)} alt="Logo Preview" />}
            {cover && <PreviewImageCover src={URL.createObjectURL(cover)} alt="Cover Preview" />}
        </PreviewContainer>

        {/* Attendance Type */}
        <FormGroup>
          <StyledLabel>Hình thức tham gia</StyledLabel>
          <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  name="attendanceType"
                  value={ATTENDANCE_TYPES.OFFLINE}
                  checked={attendanceType === ATTENDANCE_TYPES.OFFLINE}
                  onChange={(e) => setAttendanceType(e.target.value)}
                />
                <span>Offline</span>
              </RadioLabel>
              <RadioLabel>
                 <input
                  type="radio"
                  name="attendanceType"
                  value={ATTENDANCE_TYPES.ONLINE}
                  checked={attendanceType === ATTENDANCE_TYPES.ONLINE}
                  onChange={(e) => setAttendanceType(e.target.value)}
                />
                <span>Online</span>
              </RadioLabel>
          </RadioGroup>
        </FormGroup>

        {/* Location Input (Conditional) */}
        {attendanceType === ATTENDANCE_TYPES.OFFLINE && (
            <Input
              id="location"
              label="Địa điểm tổ chức"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ví dụ: Hội trường F, Khu F, ĐH Bách Khoa"
              required={attendanceType === ATTENDANCE_TYPES.OFFLINE}
            />
         )}
         {attendanceType === ATTENDANCE_TYPES.ONLINE && (
             <Input
              id="location"
              label="Nền tảng Online"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ví dụ: Link Google Meet, Zoom, MS Teams,..."
              required={attendanceType === ATTENDANCE_TYPES.ONLINE}
            />
         )}

        {/* Tags */}
        <FormGroup>
             <StyledLabel>Thể loại (Tags)</StyledLabel>
             <TagGrid>
               {TAGS.map(tag => (
                 <TagLabel key={tag}>
                   <input
                      type="checkbox"
                      value={tag}
                      checked={selectedTags.includes(tag)}
                      onChange={handleTagChange}
                    />
                    {tag}
                 </TagLabel>
               ))}
             </TagGrid>
        </FormGroup>

        {/* Action Buttons */}
        <ActionContainer>
             <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Hủy bỏ
             </Button>
             <Button
                type="submit"
                isLoading={isLoading} // Pass prop to Button component
                disabled={isLoading}
              >
                {isLoading ? 'Đang tạo...' : 'Tạo sự kiện'}
             </Button>
        </ActionContainer>
      </StyledForm>
    </PageWrapper>
  );
};

export default CreateEventPage;