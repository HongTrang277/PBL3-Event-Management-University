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