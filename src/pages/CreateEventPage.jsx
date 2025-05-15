import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'; // Thêm ThemeProvider và createGlobalStyle
import Button from '../components/common/Button/Button';
import { eventService, uploadService } from '../services/api';
import { ATTENDANCE_TYPES, TAGS } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input/Input'; // Giả định Input đã được style hoặc chấp nhận className/style props

// --- Định nghĩa Theme (Màu sắc, Font, etc.) ---
const theme = {
  colors: {
    primary: '#4A5568', // Xám đậm (Cool Gray 700)
    primaryLight: '#718096', // Xám nhạt hơn (Cool Gray 500)
    accent: '#3182CE', // Xanh dương (Blue 600) - Có thể đổi thành màu bạn thích
    accentLight: '#63B3ED', // Xanh dương nhạt hơn (Blue 400)
    background: '#F7FAFC', // Xám rất nhạt (Cool Gray 50)
    surface: '#FFFFFF', // Trắng
    text: '#2D3748', // Xám rất đậm (Cool Gray 800)
    textSecondary: '#4A5568', // Xám đậm (Cool Gray 700)
    textLight: '#A0AEC0', // Xám nhạt (Cool Gray 400)
    border: '#E2E8F0', // Viền xám nhạt (Cool Gray 300)
    error: '#C53030', // Đỏ (Red 700)
    errorLight: '#FED7D7', // Đỏ rất nhạt (Red 100)
    success: '#2F855A', // Xanh lá (Green 700)
    successLight: '#C6F6D5', // Xanh lá rất nhạt (Green 100)
  },
  fonts: {
    main: "'DM Sans', sans-serif",
  },
  borderRadius: '0.5rem', // 8px
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)', // Shadow nhẹ nhàng hơn
  inputHeight: '2.75rem', // 44px
};

// --- Global Styles ---
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.colors.background};
    font-family: ${({ theme }) => theme.fonts.main};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
  }
  /* Có thể thêm các reset hoặc base styles khác ở đây */
`;

// --- Styled Components (Cập nhật với Theme) ---
const PageWrapper = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 1.5rem; /* Giảm padding tổng thể một chút, sẽ thêm padding cho FormCard */
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Để form bắt đầu từ trên */
  min-height: 100vh;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const FormCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  padding: 2rem;
  width: 100%;
  max-width: 800px; /* Giới hạn chiều rộng của card form */

  @media (min-width: 768px) {
    padding: 2.5rem;
  }
  @media (min-width: 1024px) {
    padding: 3rem;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem; /* 28px */
  font-weight: 700;
  margin-bottom: 2.5rem; /* Tăng khoảng cách dưới tiêu đề */
  font-family: ${({ theme }) => theme.fonts.main};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;

  @media (min-width: 768px) {
    font-size: 2rem; /* 32px */
  }
`;

const StyledForm = styled.form`
  & > *:not(:last-child) { /* Áp dụng margin cho tất cả trừ cái cuối */
    margin-bottom: 1.75rem; /* Khoảng cách nhất quán giữa các group */
  }
`;

const ErrorMessage = styled.div`
  background-color: ${props => props.success ? props.theme.colors.successLight : props.theme.colors.errorLight};
  border-left: 4px solid ${props => props.success ? props.theme.colors.success : props.theme.colors.error};
  color: ${props => props.success ? props.theme.colors.success : props.theme.colors.error};
  padding: 1rem;
  margin-bottom: 1.75rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.9rem;

  p {
    margin: 0;
    line-height: 1.5;
  }
  p:first-child {
    font-weight: 600;
  }
`;

const FormGroup = styled.div`
  /* FormGroup sẽ được cách nhau bởi margin-bottom trong StyledForm */
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 0.875rem; /* 14px */
  font-weight: 600; /* Đậm hơn một chút */
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.625rem; /* 10px */
`;

const RequiredAsterisk = styled.span`
  color: ${({ theme }) => theme.colors.error};
  margin-left: 0.25rem;
`;

// Giả sử component Input của bạn có thể được style như sau,
// hoặc bạn sẽ cần tạo một component Input mới với styled-components.
// Nếu Input của bạn nhận className, bạn có thể truyền style từ đây.
// Ví dụ này giả định bạn sẽ điều chỉnh component Input hoặc dùng một `StyledInputBase`
const StyledInputBase = `
  width: 100%;
  height: ${({ theme }) => theme.inputHeight};
  padding: 0 0.875rem; /* 14px */
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow}; /* Shadow nhẹ cho input */
  font-size: 0.9375rem; /* 15px */
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.surface};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accent}33; /* Ring mờ màu accent */
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
    opacity: 1;
  }

  &[type="file"] {
    padding-top: 0.625rem; /* Điều chỉnh padding cho input file */
  }
  /* Style cho nút của input file - có thể cần ::file-selector-button */
  &::file-selector-button {
    margin-right: 0.75rem;
    padding: 0.375rem 0.75rem;
    border-radius: calc(${({ theme }) => theme.borderRadius} - 2px);
    border: 1px solid ${({ theme }) => theme.colors.border};
    font-size: 0.8125rem; /* 13px */
    font-weight: 500;
    color: ${({ theme }) => theme.colors.accent};
    background-color: ${({ theme }) => theme.colors.surface};
    cursor: pointer;
    transition: background-color 0.2s ease;
    &:hover {
      background-color: ${({ theme }) => theme.colors.background};
      border-color: ${({ theme }) => theme.colors.accentLight};
    }
  }
`;

// Áp dụng StyledInputBase cho Textarea
const StyledTextarea = styled.textarea`
  ${StyledInputBase} // Kế thừa style cơ bản
  min-height: 120px; // Chiều cao tối thiểu cho textarea
  padding-top: 0.75rem; // Điều chỉnh padding cho textarea
  padding-bottom: 0.75rem;
  line-height: 1.5;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const PreviewImageBase = styled.img`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => `calc(${theme.borderRadius} / 2)`}; // Bo góc nhẹ hơn cho ảnh
  padding: 0.25rem;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const PreviewImage = styled(PreviewImageBase)`
  height: 5.5rem; /* 88px */
  width: 5.5rem;
  object-fit: contain;
`;
const PreviewImageCover = styled(PreviewImageBase)`
  height: 7rem; /* 112px */
  width: auto;
  max-width: 14rem; /* 224px */
  object-fit: cover;
`;

const RadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 0.5rem; /* Khoảng cách với label */
`;

const RadioLabel = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9375rem; /* 15px */
  color: ${({ theme }) => theme.colors.textSecondary};

  input[type="radio"] {
    appearance: none;
    border-radius: 50%;
    width: 1.125em; /* 18px */
    height: 1.125em;
    border: 2px solid ${({ theme }) => theme.colors.border};
    transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
    position: relative;
    margin-right: 0.625rem; /* 10px */

    &:checked {
      border-color: ${({ theme }) => theme.colors.accent};
      background-color: ${({ theme }) => theme.colors.accent};
    }
    &:checked::after {
      content: '';
      display: block;
      width: 0.5em; /* 8px */
      height: 0.5em;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.surface};
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accent}33;
    }
  }
`;

const TagGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); /* Responsive hơn */
  gap: 0.75rem; /* 12px */

  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
`;

const TagLabel = styled.label`
  display: inline-flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 0.5rem 0.875rem; /* 8px 14px */
  border-radius: 1.25rem; /* 20px - Bo tròn hơn */
  font-size: 0.8125rem; /* 13px */
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);

  &:hover {
    border-color: ${({ theme }) => theme.colors.accentLight};
    color: ${({ theme }) => theme.colors.accent};
  }

  input[type="checkbox"] {
    appearance: none;
    border-radius: 0.25rem; /* 4px */
    width: 1em; /* 13px */
    height: 1em;
    border: 1.5px solid ${({ theme }) => theme.colors.textLight};
    margin-right: 0.625rem; /* 10px */
    position: relative;
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.surface};
    transition: all 0.2s ease;

    &:checked {
      border-color: ${({ theme }) => theme.colors.accent};
      background-color: ${({ theme }) => theme.colors.accent};
    }
    &:checked::after {
      content: '';
      display: block;
      width: 0.25em; /* 3.25px */
      height: 0.5em; /* 6.5px */
      border: solid ${({ theme }) => theme.colors.surface};
      border-width: 0 2px 2px 0;
      transform: rotate(45deg) translate(-10%, -20%);
      position: absolute;
      left: 0.28em; /* 3.64px */
      top: 0.1em; /* 1.3px */
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accent}33;
    }
  }

  /* Khi checkbox được chọn, thay đổi style của TagLabel */
  input[type="checkbox"]:checked + span { /* Giả sử text nằm trong span */
    /* color: ${({ theme }) => theme.colors.accent}; */
  }
  /* Hoặc cách tốt hơn là làm động, hoặc dùng :has nếu trình duyệt hỗ trợ */
  &.tag-checked { /* Bạn sẽ cần thêm class này bằng JS */
    background-color: ${({ theme }) => theme.colors.accentLight}33; /* Nền accent rất nhạt */
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    font-weight: 600;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 2rem;
  margin-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

// --- Component Chính ---
const CreateEventPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [success, setSuccess] = useState(null);
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [capacity, setCapacity] = useState('');
  const [logo, setLogo] = useState(null);
  const [cover, setCover] = useState(null);
  const [attendanceType, setAttendanceType] = useState(ATTENDANCE_TYPES.OFFLINE);
  const [location, setLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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
            delete newErrors[fieldName];
        } else {
            setter(null);
            if (file) {
                newErrors[fieldName] = 'Vui lòng chọn file ảnh định dạng JPG hoặc PNG.';
            } else {
                delete newErrors[fieldName];
            }
        }
        setFileErrors(newErrors);
        setError(null);
    };

    const handleTagChange = (event) => {
        const { value, checked } = event.target;
        setSelectedTags(prevTags =>
            checked ? [...prevTags, value] : prevTags.filter(tag => tag !== value)
        );
    };

    const validateForm = () => {
        // ... (Giữ nguyên logic validate của bạn)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!eventName.trim()) return "Tên sự kiện không được để trống.";
        if (!description.trim()) return "Mô tả sự kiện không được để trống.";
        if (!startDate) return "Ngày giờ bắt đầu không được để trống.";
       
//         const startTime = new Date(startDate);
//         if (startTime < today) return "Ngày bắt đầu không được là một ngày trong quá khứ.";

        if (!endDate) return "Ngày giờ kết thúc không được để trống.";
        const endTime = new Date(endDate);
        const startTime = new Date(startDate); // Cần startTime ở đây để so sánh
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
        setError(null);
        const validationError = validateForm();
        const currentFileErrors = { ...fileErrors };
        if (!logo && !currentFileErrors.logo) currentFileErrors.logo = "Vui lòng tải lên ảnh logo.";
        if (!cover && !currentFileErrors.cover) currentFileErrors.cover = "Vui lòng tải lên ảnh bìa.";
        setFileErrors(currentFileErrors);
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

            if (logo) {
                try {
                    const logoUploadResponse = await uploadService.uploadFile(logo);
                    if (logoUploadResponse?.saveUrl) {
                        let correctSaveUrl = logoUploadResponse.saveUrl;
                        if (correctSaveUrl.startsWith("//")) correctSaveUrl = correctSaveUrl.substring(1);
                        const apiUrl = import.meta.env.VITE_API_BASE_URL;
                        if (!apiUrl) {
                            console.error("LỖI CẤU HÌNH: Biến môi trường VITE_API_BASE_URL không được định nghĩa!");
                            setError("Lỗi cấu hình hệ thống. (ENV_API_URL_MISSING)");
                            setIsLoading(false); return;
                        }
                        const domainApi = apiUrl.replace('/api', '');
                        uploadedLogoUrl = domainApi + correctSaveUrl;
                    } else if (logoUploadResponse?.fileName) {
                        uploadedLogoUrl = uploadService.getFileUrl(logoUploadResponse.fileName);
                    } else if (logoUploadResponse?.url) {
                        uploadedLogoUrl = logoUploadResponse.url;
                    } else {
                        throw new Error("Không nhận được thông tin file logo sau khi upload.");
                    }
                } catch (uploadError) {
                    console.error('Lỗi upload logo:', uploadError);
                    setError(`Lỗi upload logo: ${uploadError.response?.data?.message || uploadError.message || 'Không thể tải lên logo.'}`);
                    setIsLoading(false); return;
                }
            }
            if (cover) {
                try {
                    const coverUploadResponse = await uploadService.uploadFile(cover);
                    if (coverUploadResponse?.saveUrl) {
                        let correctSaveUrl = coverUploadResponse.saveUrl;
                        if (correctSaveUrl.startsWith("//")) correctSaveUrl = correctSaveUrl.substring(1);
                        const apiUrl = import.meta.env.VITE_API_BASE_URL;
                        if (!apiUrl) {
                            console.error("LỖI CẤU HÌNH: VITE_API_BASE_URL không định nghĩa!");
                            setError("Lỗi cấu hình hệ thống (ENV_API_URL_MISSING_COVER).");
                            setIsLoading(false); return;
                        }
                        const domainApi = apiUrl.replace('/api', '');
                        uploadedCoverUrl = domainApi + correctSaveUrl;
                    } else if (coverUploadResponse?.fileName) {
                        uploadedCoverUrl = uploadService.getFileUrl(coverUploadResponse.fileName);
                    } else if (coverUploadResponse?.url) {
                        uploadedCoverUrl = coverUploadResponse.url;
                    } else {
                        throw new Error("Không nhận được thông tin file ảnh bìa sau khi upload.");
                    }
                } catch (uploadError) {
                    console.error('Lỗi upload ảnh bìa:', uploadError);
                    setError(`Lỗi upload ảnh bìa: ${uploadError.response?.data?.message || uploadError.message || 'Không thể tải lên ảnh bìa.'}`);
                    setIsLoading(false); return;
                }
            }

            const eventData = {
                EventName: eventName.trim(),
                Description: description.trim(),
                AttendanceType: attendanceType,
                Location: attendanceType === ATTENDANCE_TYPES.ONLINE ? (location.trim() || 'Online Platform') : location.trim(),
                StartDate: new Date(startDate).toISOString(),
                EndDate: new Date(endDate).toISOString(),
                Capacity: parseInt(capacity, 10),
                HostId: user?.id,
                LogoUrl: uploadedLogoUrl,
                CoverUrl: uploadedCoverUrl,
                Tags: selectedTags,
            };

            console.log('Sending event data:', eventData);
            const response = await eventService.createEvent(eventData);
            console.log('Event created successfully:', response.data);
            setSuccess('Sự kiện đã được tạo thành công!');
            // Reset form
            setEventName(''); setDescription(''); setStartDate(''); setEndDate('');
            setCapacity(''); setLogo(null); setCover(null);
            setAttendanceType(ATTENDANCE_TYPES.OFFLINE); setLocation('');
            setSelectedTags([]); setFileErrors({}); setError(null);

            setTimeout(() => {
                navigate('/admin/my-events');
            }, 2000);

        } catch (err) {
            console.error('Error during event creation process:', err);
            if (!error && !success) {
                const errorMessage = err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi tạo sự kiện.';
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };



  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <PageWrapper>
        <FormCard> {/* Sử dụng FormCard thay vì PageWrapper trực tiếp cho nội dung form */}
          <Title>Tạo sự kiện mới</Title>

          {success && (
            <ErrorMessage success role="alert">
              <p>Thành công!</p>
              <p>{success}</p>
            </ErrorMessage>
          )}

          {error && (
            <ErrorMessage role="alert">
              <p>Lỗi</p>
              <p>{error}</p>
            </ErrorMessage>
          )}

          {Object.values(fileErrors).some(e => e) && !error?.includes("Logo:") && !error?.includes("Ảnh bìa:") && (
            <ErrorMessage role="alert" style={{ marginTop: '1rem'}}>
              {fileErrors.logo && <p>Logo: {fileErrors.logo}</p>}
              {fileErrors.cover && <p>Ảnh bìa: {fileErrors.cover}</p>}
            </ErrorMessage>
          )}

          <StyledForm onSubmit={handleSubmit}>
            {/*
              QUAN TRỌNG:
              Component <Input /> của bạn cần được điều chỉnh để phù hợp với styled-components
              hoặc bạn cần tạo một component <StyledInputField type="..." /> mới sử dụng StyledInputBase.
              Ví dụ dưới đây giả định <Input /> chấp nhận `label`, `id`, `value`, `onChange`, `placeholder`, `required`, `type`, `min`, `accept`, `inputClassName`.
              Bạn cần đảm bảo `inputClassName` hoặc style nội bộ của `Input` áp dụng các style từ `StyledInputBase`.
            */}
            <FormGroup>
              <Input
                id="eventName"
                label="Tên sự kiện" // Prop label cho component Input
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Nhập tên sự kiện"
                required
                // className={StyledInputBase} // Hoặc style nội bộ của Input
              />
            </FormGroup>

            <FormGroup>
              <StyledLabel htmlFor="description">
                Mô tả sự kiện <RequiredAsterisk>*</RequiredAsterisk>
              </StyledLabel>
              <StyledTextarea
                id="description"
                rows="5" // Tăng số dòng một chút cho dễ nhìn
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả chi tiết về sự kiện"
                required
              />
            </FormGroup>

            <GridContainer>
              <FormGroup>
                <Input
                  id="startDate"
                  label="Ngày giờ bắt đầu"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Input
                  id="endDate"
                  label="Ngày giờ kết thúc"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  min={startDate || ''}
                />
              </FormGroup>
            </GridContainer>

            <FormGroup>
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
            </FormGroup>

            <GridContainer>
              <FormGroup>
                <Input
                  id="logo"
                  label="Ảnh Logo (.jpg, .png)"
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={handleFileChange('logo', setLogo)}
                  // inputClassName="file:..." đã được xử lý trong StyledInputBase
                />
                {fileErrors.logo && <ErrorMessage style={{padding: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem', borderLeftWidth: '2px'}}><p style={{margin:0}}>{fileErrors.logo}</p></ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Input
                  id="cover"
                  label="Ảnh Bìa (Background) (.jpg, .png)"
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={handleFileChange('cover', setCover)}
                />
                {fileErrors.cover && <ErrorMessage style={{padding: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem', borderLeftWidth: '2px'}}><p style={{margin:0}}>{fileErrors.cover}</p></ErrorMessage>}
              </FormGroup>
            </GridContainer>

            {(logoPreviewUrl || coverPreviewUrl) && (
                <PreviewContainer>
                    {logoPreviewUrl && <PreviewImage src={logoPreviewUrl} alt="Logo Preview" />}
                    {coverPreviewUrl && <PreviewImageCover src={coverPreviewUrl} alt="Cover Preview" />}
                </PreviewContainer>
            )}


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
              <FormGroup>
                <Input id="location" label="Địa điểm tổ chức" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ví dụ: Hội trường F, Khu F, ĐH Bách Khoa" required={attendanceType === ATTENDANCE_TYPES.OFFLINE} />
              </FormGroup>
            )}
            {attendanceType === ATTENDANCE_TYPES.ONLINE && (
              <FormGroup>
                <Input id="location" label="Nền tảng Online / Link tham gia" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ví dụ: Link Google Meet, Zoom, MS Teams,..." required={attendanceType === ATTENDANCE_TYPES.ONLINE} />
              </FormGroup>
            )}

            <FormGroup>
              <StyledLabel>Thể loại (Tags)</StyledLabel>
              <TagGrid>
                {TAGS.map(tag => (
                  <TagLabel key={tag} className={selectedTags.includes(tag) ? 'tag-checked' : ''}>
                    <input type="checkbox" value={tag} checked={selectedTags.includes(tag)} onChange={handleTagChange} />
                    <span>{tag}</span> {/* Bọc text trong span để style dễ hơn nếu cần */}
                  </TagLabel>
                ))}
              </TagGrid>
            </FormGroup>

            <ActionContainer>
              <Button type="button" variant="secondary" onClick={() => navigate(-1)} disabled={isLoading}>
                Hủy bỏ
              </Button>
              <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Tạo sự kiện'}
              </Button>
            </ActionContainer>
          </StyledForm>
        </FormCard>
      </PageWrapper>
    </ThemeProvider>
  );
};


export default CreateEventPage;