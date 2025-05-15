import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/common/Button/Button'; // Assume Button is styled or accepts className
import { eventService, uploadService } from '../services/api'; // Import eventService VÀ uploadService
import { ATTENDANCE_TYPES, TAGS } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input/Input'; // Assume Input is styled or accepts className

// --- Styled Components (Giữ nguyên như trong mã gốc của bạn) ---
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
  flex-wrap: wrap; // Allow wrapping if many previews
  gap: 1rem; /* space-x-4 */
  margin-top: 1rem; // Add some space above previews
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
  height: 6rem; /* Tăng chiều cao một chút cho cover */
  width: auto; /* Cho phép chiều rộng tự điều chỉnh */
  max-width: 12rem; /* Giới hạn chiều rộng tối đa */
  object-fit: cover; /* Thay đổi object-fit để ảnh bìa đẹp hơn */
`;

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


const CreateEventPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [success, setSuccess] = useState(null);
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
    const [error, setError] = useState(null);
    // Sử dụng tên state rõ ràng hơn cho URL preview
    const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);
    const [coverPreviewUrl, setCoverPreviewUrl] = useState(null);
    const [fileErrors, setFileErrors] = useState({});

    useEffect(() => {
        if (!logo) {
            setLogoPreviewUrl(null);
            return;
        }
        const objectUrl = URL.createObjectURL(logo);
        setLogoPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [logo]);

    useEffect(() => {
        if (!cover) {
            setCoverPreviewUrl(null);
            return;
        }
        const objectUrl = URL.createObjectURL(cover);
        setCoverPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [cover]);


    const handleFileChange = (fieldName, setter) => (event) => {
        const file = event.target.files[0];
        const newErrors = { ...fileErrors };
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setter(file);
            delete newErrors[fieldName]; // Xóa lỗi nếu file hợp lệ
        } else {
            setter(null); // Xóa file nếu không hợp lệ
            if (file) { // Chỉ báo lỗi nếu người dùng đã chọn file (nhưng sai loại)
                newErrors[fieldName] = 'Vui lòng chọn file ảnh định dạng JPG hoặc PNG.';
            } else { // Người dùng hủy chọn file
                delete newErrors[fieldName];
            }
        }
        setFileErrors(newErrors);
        setError(null); // Xóa lỗi chung khi người dùng tương tác với input file
    };

    const handleTagChange = (event) => {
        const { value, checked } = event.target;
        setSelectedTags(prevTags =>
            checked ? [...prevTags, value] : prevTags.filter(tag => tag !== value)
        );
    };

    const validateForm = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Để so sánh chỉ ngày, không tính giờ

        if (!eventName.trim()) return "Tên sự kiện không được để trống.";
        if (!description.trim()) return "Mô tả sự kiện không được để trống.";
        if (!startDate) return "Ngày giờ bắt đầu không được để trống.";
        
        const startTime = new Date(startDate);
        // if (startTime < today) return "Ngày bắt đầu không được là một ngày trong quá khứ."; // Bỏ comment nếu muốn kiểm tra

        if (!endDate) return "Ngày giờ kết thúc không được để trống.";
        const endTime = new Date(endDate);
        if (endTime <= startTime) return "Ngày giờ kết thúc phải sau ngày giờ bắt đầu.";

        if (!capacity || parseInt(capacity, 10) <= 0) return "Số lượng tham gia phải là số dương.";
        if (attendanceType === ATTENDANCE_TYPES.OFFLINE && !location.trim()) return "Địa điểm không được để trống khi tổ chức offline.";
        if (attendanceType === ATTENDANCE_TYPES.ONLINE && !location.trim()) return "Nền tảng Online/Link không được để trống khi tổ chức online.";
        if (!logo) return "Vui lòng tải lên ảnh logo.";
        if (!cover) return "Vui lòng tải lên ảnh bìa.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset lỗi chung
        // fileErrors được cập nhật bởi handleFileChange

        const validationError = validateForm();
        // Kiểm tra xem có lỗi file nào không
        const currentFileErrors = { ...fileErrors }; // Tạo bản sao để kiểm tra
        if (!logo && !currentFileErrors.logo) currentFileErrors.logo = "Vui lòng tải lên ảnh logo.";
        if (!cover && !currentFileErrors.cover) currentFileErrors.cover = "Vui lòng tải lên ảnh bìa.";
        setFileErrors(currentFileErrors); // Cập nhật state fileErrors để hiển thị nếu cần

        const hasFileErrors = Object.values(currentFileErrors).some(err => err);


        if (validationError || hasFileErrors) {
            let combinedError = validationError || "";
            if (hasFileErrors) {
                const specificFileErrors = Object.entries(currentFileErrors)
                    .filter(([, value]) => value)
                    .map(([key, value]) => `${key === 'logo' ? 'Logo' : 'Ảnh bìa'}: ${value}`)
                    .join(' ');
                combinedError = combinedError ? `${combinedError} ${specificFileErrors}` : specificFileErrors;
            }
            setError(combinedError || "Vui lòng kiểm tra lại thông tin đã nhập.");
            return;
        }

        setIsLoading(true);

        try {
            let uploadedLogoUrl = '';
            let uploadedCoverUrl = '';

            // Bước 1: Upload Logo
            if (logo) {
    try {
        const logoUploadResponse = await uploadService.uploadFile(logo);
        console.log('Dữ liệu trả về từ uploadService.uploadFile (logo):', logoUploadResponse);

        // Sửa đổi ở đây để kiểm tra 'saveUrl'
        if (logoUploadResponse?.saveUrl) {
    let correctSaveUrl = logoUploadResponse.saveUrl;
    if (correctSaveUrl.startsWith("//")) {
        correctSaveUrl = correctSaveUrl.substring(1);
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    console.log('Giá trị VITE_API_BASE_URL (logo):', apiUrl);

    if (!apiUrl) {
        console.error("LỖI CẤU HÌNH: Biến môi trường VITE_API_BASE_URL không được định nghĩa!");
        setError("Lỗi cấu hình hệ thống. Vui lòng liên hệ quản trị viên để được hỗ trợ ( mã lỗi: ENV_API_URL_MISSING).");
        setIsLoading(false); // Dừng trạng thái loading nếu có
        return; // Ngừng thực thi hàm handleSubmit hoặc phần này
    }

    // Nếu apiUrl tồn tại, thì mới thực hiện .replace()
    const domainApi = apiUrl.replace('/api', '');
    uploadedLogoUrl = domainApi + correctSaveUrl;

} else if (logoUploadResponse?.fileName) { // Giữ lại các kiểm tra khác
    uploadedLogoUrl = uploadService.getFileUrl(logoUploadResponse.fileName);
} else if (logoUploadResponse?.url) {
    uploadedLogoUrl = logoUploadResponse.url;
}
else {
    // Cập nhật thông báo lỗi này nếu cần
    throw new Error("Không nhận được thông tin file (saveUrl, fileName, hoặc url) sau khi upload.");
}

        // Làm tương tự cho cover image
        // ...

    } catch (uploadError) {
        console.error('Lỗi trong quá trình upload logo:', uploadError);
        setError(`Lỗi upload logo: ${uploadError.response?.data?.message || uploadError.message || 'Không thể tải lên logo.'}`);
        setIsLoading(false);
        return;
    }
}

            // Bước 2: Upload Cover
            if (cover) { // Kiểm tra xem có file cover không
    try {
        const coverUploadResponse = await uploadService.uploadFile(cover);
        // DÒNG LOG QUAN TRỌNG CHO ẢNH BÌA
        console.log('Dữ liệu trả về từ uploadService.uploadFile (cover):', coverUploadResponse);

        if (coverUploadResponse?.saveUrl) {
            let correctSaveUrl = coverUploadResponse.saveUrl;
            if (correctSaveUrl.startsWith("//")) {
                correctSaveUrl = correctSaveUrl.substring(1);
            }
            const apiUrl = import.meta.env.VITE_API_BASE_URL;
            if (!apiUrl) {
                console.error("LỖI CẤU HÌNH: Biến môi trường VITE_API_BASE_URL không được định nghĩa!");
                setError("Lỗi cấu hình hệ thống (mã lỗi: ENV_API_URL_MISSING_COVER).");
                setIsLoading(false);
                return;
            }
            const domainApi = apiUrl.replace('/api', '');
            uploadedCoverUrl = domainApi + correctSaveUrl;

        } else if (coverUploadResponse?.fileName) {
            uploadedCoverUrl = uploadService.getFileUrl(coverUploadResponse.fileName);
        } else if (coverUploadResponse?.url) {
            uploadedCoverUrl = coverUploadResponse.url;
        }
         else {
            // Dòng 455 (hoặc tương tự) gây ra lỗi là dòng throw new Error này
            throw new Error("Không nhận được thông tin file ảnh bìa sau khi upload.");
        }
    } catch (uploadError) {
        console.error('Lỗi trong quá trình upload ảnh bìa:', uploadError);
        setError(`Lỗi upload ảnh bìa: ${uploadError.response?.data?.message || uploadError.message || 'Không thể tải lên ảnh bìa.'}`);
        setIsLoading(false);
        return;
    }
}

            // Bước 3: Chuẩn bị dữ liệu sự kiện
            const eventData = {
                EventName: eventName.trim(),
                Description: description.trim(),
                AttendanceType: attendanceType,
                Location: attendanceType === ATTENDANCE_TYPES.ONLINE ? (location.trim() || 'Online Platform') : location.trim(),
                StartDate: new Date(startDate).toISOString(),
                EndDate: new Date(endDate).toISOString(),
                Capacity: parseInt(capacity, 10),
                HostId: user?.id, // Đảm bảo user và user.id tồn tại
                LogoUrl: uploadedLogoUrl,
                CoverUrl: uploadedCoverUrl,
                // PlanLink: 'some-link', // Bỏ nếu không dùng hoặc lấy từ input
                // CreateAt, longitude, latitude: API nên tự xử lý nếu cần
                Tags: selectedTags, // Thêm tags
            };

            console.log('Sending event data:', eventData);

            // Bước 4: Gọi API tạo sự kiện
            const response = await eventService.createEvent(eventData);
            console.log('Event created successfully:', response.data);
            setSuccess('Sự kiện đã được tạo thành công!');

            // Reset form sau khi thành công
            setEventName('');
            setDescription('');
            setStartDate('');
            setEndDate('');
            setCapacity('');
            setLogo(null);
            setCover(null);
            setAttendanceType(ATTENDANCE_TYPES.OFFLINE);
            setLocation('');
            setSelectedTags([]);
            setFileErrors({});
            setError(null); // Clear any final errors

            setTimeout(() => {
                navigate('/admin/my-events'); // Hoặc trang bạn muốn chuyển hướng tới
            }, 2000);

        } catch (err) {
            // Lỗi này có thể từ createEvent hoặc lỗi logic khác không được bắt ở trên
            console.error('Error during event creation process:', err);
             if (!error && !success) { // Chỉ set lỗi nếu chưa có lỗi nào được hiển thị và chưa thành công
                const errorMessage = err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi tạo sự kiện.';
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageWrapper>
            <Title>Tạo sự kiện mới</Title>

            {success && (
                <ErrorMessage role="alert" style={{ borderColor: '#34d399', backgroundColor: '#d1fae5', color: '#065f46' }}>
                    <p>Thành công!</p>
                    <p>{success}</p>
                </ErrorMessage>
            )}

            {/* Hiển thị lỗi chung hoặc lỗi validation */}
            {error && (
                 <ErrorMessage role="alert">
                    <p>Lỗi</p>
                    <p>{error}</p> {/* Hiển thị lỗi kết hợp */}
                </ErrorMessage>
            )}

            {/* Hiển thị lỗi file riêng nếu chưa nằm trong error message chính */}
            {Object.values(fileErrors).some(e => e) && !error?.includes("Logo:") && !error?.includes("Ảnh bìa:") && (
                <ErrorMessage role="alert" style={{ marginTop: '1rem'}}>
                    {fileErrors.logo && <p>Logo: {fileErrors.logo}</p>}
                    {fileErrors.cover && <p>Ảnh bìa: {fileErrors.cover}</p>}
                </ErrorMessage>
            )}


            <StyledForm onSubmit={handleSubmit}>
                <Input
                    id="eventName"
                    label="Tên sự kiện"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Nhập tên sự kiện"
                    required
                />

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

                <GridContainer>
                    <FormGroup>
                        <Input
                            id="logo"
                            label="Ảnh Logo (.jpg, .png)"
                            type="file"
                            accept="image/jpeg, image/png"
                            onChange={handleFileChange('logo', setLogo)}
                            // required attribute được xử lý trong validateForm
                            inputClassName="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {fileErrors.logo && <ErrorMessage style={{padding: '0.5rem', marginTop: '0.25rem', borderLeftWidth: '2px'}}><p style={{margin:0}}>{fileErrors.logo}</p></ErrorMessage>}
                    </FormGroup>
                     <FormGroup>
                        <Input
                            id="cover"
                            label="Ảnh Bìa (Background) (.jpg, .png)"
                            type="file"
                            accept="image/jpeg, image/png"
                            onChange={handleFileChange('cover', setCover)}
                            inputClassName="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                        />
                        {fileErrors.cover && <ErrorMessage style={{padding: '0.5rem', marginTop: '0.25rem', borderLeftWidth: '2px'}}><p style={{margin:0}}>{fileErrors.cover}</p></ErrorMessage>}
                    </FormGroup>
                </GridContainer>

                <PreviewContainer>
                    {logoPreviewUrl && <PreviewImage src={logoPreviewUrl} alt="Logo Preview" />}
                    {coverPreviewUrl && <PreviewImageCover src={coverPreviewUrl} alt="Cover Preview" />}
                </PreviewContainer>

                <FormGroup>
                    <StyledLabel>Hình thức tham gia <RequiredAsterisk>*</RequiredAsterisk></StyledLabel>
                    <RadioGroup>
                        <RadioLabel>
                            <input type="radio" name="attendanceType" value={ATTENDANCE_TYPES.OFFLINE} checked={attendanceType === ATTENDANCE_TYPES.OFFLINE} onChange={(e) => setAttendanceType(e.target.value)} />
                            <span>Offline</span>
                        </RadioLabel>
                        <RadioLabel>
                            <input type="radio" name="attendanceType" value={ATTENDANCE_TYPES.ONLINE} checked={attendanceType === ATTENDANCE_TYPES.ONLINE} onChange={(e) => setAttendanceType(e.target.value)} />
                            <span>Online</span>
                        </RadioLabel>
                    </RadioGroup>
                </FormGroup>

                {attendanceType === ATTENDANCE_TYPES.OFFLINE && (
                    <Input id="location" label="Địa điểm tổ chức" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ví dụ: Hội trường F, Khu F, ĐH Bách Khoa" required={attendanceType === ATTENDANCE_TYPES.OFFLINE} />
                )}
                {attendanceType === ATTENDANCE_TYPES.ONLINE && (
                    <Input id="location" label="Nền tảng Online / Link tham gia" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ví dụ: Link Google Meet, Zoom, MS Teams,..." required={attendanceType === ATTENDANCE_TYPES.ONLINE} />
                )}

                <FormGroup>
                    <StyledLabel>Thể loại (Tags)</StyledLabel>
                    <TagGrid>
                        {TAGS.map(tag => (
                            <TagLabel key={tag}>
                                <input type="checkbox" value={tag} checked={selectedTags.includes(tag)} onChange={handleTagChange} />
                                {tag}
                            </TagLabel>
                        ))}
                    </TagGrid>
                </FormGroup>

                <ActionContainer>
                    <Button type="button" variant="secondary" onClick={() => navigate(-1)} disabled={isLoading}>
                        Hủy bỏ
                    </Button>
                    <Button type="submit" isLoading={isLoading} disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'Tạo sự kiện'}
                    </Button>
                </ActionContainer>
            </StyledForm>
        </PageWrapper>
    );
};

export default CreateEventPage;