// src/utils/helpers.js

/**
 * Định dạng chuỗi ngày ISO hoặc đối tượng Date thành dạng dễ đọc
 * Ví dụ: 'Thứ Hai, 15 tháng 6 năm 2025, 09:00'
 * @param {string | Date} dateInput Chuỗi ISO hoặc đối tượng Date
 * @returns {string} Chuỗi ngày đã định dạng hoặc chuỗi rỗng nếu input không hợp lệ
 */
export const formatDateTime = (dateInput) => {
  if (!dateInput) {
    console.log("[formatDateTime] Input rỗng, trả về ''.");
    return '';
  }

  let processedDateInput = dateInput;

  // Bước 1: Xử lý dateInput nếu nó là chuỗi và thiếu 'Z'
  // Giả định rằng nếu 'Z' bị thiếu, chuỗi đó vẫn đại diện cho thời gian UTC.
  if (typeof dateInput === 'string' && 
      dateInput.length >= 19 && // YYYY-MM-DDTHH:MM:SS có độ dài ít nhất 19
      dateInput.charAt(10) === 'T' && // Kiểm tra có chữ 'T' ở giữa
      !dateInput.endsWith('Z')) {
    processedDateInput = dateInput + 'Z';
    console.log("[formatDateTime] Đã tự động thêm 'Z'. Input mới:", processedDateInput);
  }

  try {
    // Bước 2: Parse chuỗi đã được xử lý (giờ đây nó sẽ được hiểu là UTC)
    const date = new Date(processedDateInput);

    if (isNaN(date.getTime())) {
      console.warn("[formatDateTime] Ngày không hợp lệ sau khi xử lý input:", processedDateInput);
      return '';
    }
    console.log("[formatDateTime] Đối tượng Date (UTC sau khi parse):", date.toUTCString());


    // Bước 3: Định dạng sang giờ Việt Nam
    // RẤT QUAN TRỌNG: Đảm bảo có timeZone: 'Asia/Ho_Chi_Minh'
    const options = {
      weekday: 'long',    // "Thứ Hai"
      year: 'numeric',    // "2025"
      month: 'long',     // "tháng 6"
      day: 'numeric',     // "15"
      hour: '2-digit',    // "09"
      minute: '2-digit',  // "00"
      hour12: false,      // Sử dụng định dạng 24h
      timeZone: 'Asia/Ho_Chi_Minh' // *** BẮT BUỘC PHẢI CÓ DÒNG NÀY ***
    };
    // console.log("[formatDateTime] Sử dụng options:", JSON.stringify(options));

    const formattedDate = new Intl.DateTimeFormat('vi-VN', options).format(date);
    console.log("[formatDateTime] Kết quả định dạng (cho Asia/Ho_Chi_Minh):", formattedDate);
    
    return formattedDate;

  } catch (error) {
    console.error("[formatDateTime] Lỗi định dạng ngày:", processedDateInput, error);
    return '';
  }
};
  
  /**
   * Định dạng chuỗi ngày ISO hoặc đối tượng Date thành dạng Ngày/Tháng/Năm
   * Ví dụ: '15/06/2025'
   * @param {string | Date} dateInput Chuỗi ISO hoặc đối tượng Date
   * @returns {string} Chuỗi ngày đã định dạng hoặc chuỗi rỗng nếu input không hợp lệ
   */
  export const formatDate = (dateInput) => {
       if (!dateInput) return '';
       try {
         const date = new Date(dateInput);
          if (isNaN(date.getTime())) {
              return '';
          }
         const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
         return new Intl.DateTimeFormat('vi-VN', options).format(date);
       } catch (error) {
         console.error("Error formatting date:", error);
         return '';
       }
     };

export const convertApiDateTimeToDaNangInputString = (apiDateTimeString) => {
  if (!apiDateTimeString || typeof apiDateTimeString !== 'string') {
    // console.log("[Converter] Đầu vào rỗng hoặc không phải chuỗi.");
    return '';
  }

  let dateStringToParse = apiDateTimeString;

  if (apiDateTimeString.endsWith('Z')) {
    // console.log("[Converter] Xử lý chuỗi UTC (có 'Z'):", apiDateTimeString);
    // dateStringToParse giữ nguyên vì new Date() sẽ hiểu đúng là UTC
  } else if (apiDateTimeString.length >= 19 && apiDateTimeString.charAt(10) === 'T' && apiDateTimeString.indexOf(':') > 10) {
    // Giả định chuỗi không có 'Z' là giờ Đà Nẵng.
    // Thêm "+07:00" để new Date() parse đúng theo giờ Đà Nẵng, bất kể múi giờ trình duyệt.
    let baseString = apiDateTimeString;
    if (apiDateTimeString.length > 19 && apiDateTimeString.charAt(19) === '.') {
        baseString = apiDateTimeString.substring(0, 19); // Loại bỏ mili giây nếu có
    }
    dateStringToParse = baseString + "+07:00";
    // console.log(`[Converter] Chuỗi không có 'Z', đã thêm +07:00: "${dateStringToParse}"`);
  } else {
    // console.warn(`[Converter] Định dạng chuỗi ngày giờ không nhận dạng được: "${apiDateTimeString}", thử parse trực tiếp.`);
    // Cố gắng parse trực tiếp, có thể không chính xác nếu định dạng lạ
    // và sẽ phụ thuộc múi giờ trình duyệt.
    try {
        const riskyDate = new Date(apiDateTimeString);
        if (isNaN(riskyDate.getTime())) {
            // console.warn(`[Converter] Parse trực tiếp thất bại cho: "${apiDateTimeString}"`);
            return '';
        }
        // Nếu parse được, chuyển về ISO string để xử lý nhất quán hoặc xử lý trực tiếp
        dateStringToParse = riskyDate.toISOString(); 
        // console.log(`[Converter] Đã parse chuỗi không rõ ràng thành ISO: "${dateStringToParse}"`);
    } catch(e) {
        // console.error(`[Converter] Lỗi khi parse chuỗi không rõ ràng: "${apiDateTimeString}"`, e);
        return '';
    }
  }

  try {
    const date = new Date(dateStringToParse);
    if (isNaN(date.getTime())) {
      // console.warn("[Converter] Ngày không hợp lệ sau khi chuẩn bị chuỗi parse:", dateStringToParse);
      return '';
    }

    const year = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' }).format(date);
    const month = new Intl.DateTimeFormat('en', { month: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' }).format(date);
    const day = new Intl.DateTimeFormat('en', { day: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' }).format(date);
    
    let hourValue = new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: false, timeZone: 'Asia/Ho_Chi_Minh' }).format(date);
    if (hourValue === '24') { 
      hourValue = '0'; 
    }
    const hour = String(hourValue).padStart(2, '0');

    const minuteValue = new Intl.DateTimeFormat('en', { minute: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' }).format(date);
    const minute = String(minuteValue).padStart(2, '0');
        
    const result = `${year}-${month}-${day}T${hour}:${minute}`;
    // console.log(`[Converter] Kết quả cuối cùng cho input: "${result}" (từ đầu vào API: "${apiDateTimeString}")`);
    return result;
  } catch (error) {
    // console.error("[Converter] Lỗi trong quá trình chuyển đổi/định dạng ngày:", error);
    return '';
  }
};
// Thêm các hàm mới cho định dạng ngày:
export const extractDateInfo = (dateString) => {
  if (!dateString) return { day: '--', month: '---', year: '----' };
  
  try {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('vi-VN', { day: '2-digit' }),
      month: date.toLocaleDateString('vi-VN', { month: 'short' }).toUpperCase(),
      year: date.getFullYear().toString()
    };
  } catch (error) {
    return { day: '--', month: '---', year: '----' };
  }
};