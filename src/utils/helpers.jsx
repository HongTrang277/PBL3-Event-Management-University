// src/utils/helpers.js

/**
 * Định dạng chuỗi ngày ISO hoặc đối tượng Date thành dạng dễ đọc
 * Ví dụ: 'Thứ Hai, 15 tháng 6 năm 2025, 09:00'
 * @param {string | Date} dateInput Chuỗi ISO hoặc đối tượng Date
 * @returns {string} Chuỗi ngày đã định dạng hoặc chuỗi rỗng nếu input không hợp lệ
 */
export const formatDateTime = (dateInput) => {
  console.log("[formatDateTime] Nhận đầu vào:", dateInput);

  if (!dateInput) {
    console.log("[formatDateTime] Đầu vào rỗng, trả về ''");
    return '';
  }
  try {
    const date = new Date(dateInput);
    console.log("[formatDateTime] Đối tượng Date sau khi parse:", date.toString()); // Xem giờ local của trình duyệt
    console.log("[formatDateTime] Đối tượng Date (UTC):", date.toUTCString());    // Xem giờ UTC

    if (isNaN(date.getTime())) {
      console.warn("[formatDateTime] Ngày không hợp lệ cho đầu vào:", dateInput);
      return '';
    }

    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Ho_Chi_Minh' // Quan trọng!
    };
    console.log("[formatDateTime] Sử dụng options:", JSON.stringify(options));

    const formattedDate = new Intl.DateTimeFormat('vi-VN', options).format(date);
    console.log("[formatDateTime] Kết quả định dạng (cho Asia/Ho_Chi_Minh):", formattedDate); // Đây phải là "8 giờ 8 phút"
    console.log("[formatDateTime] Kết quả định dạng (cho Asia/Ho_Chi_Minh):", formattedDate); // DÒNG LOG QUAN TRỌNG
    return formattedDate;
  } catch (error) {
    console.error("[formatDateTime] Lỗi định dạng ngày:", dateInput, error);
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