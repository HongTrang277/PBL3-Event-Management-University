// src/utils/helpers.js

/**
 * Định dạng chuỗi ngày ISO hoặc đối tượng Date thành dạng dễ đọc
 * Ví dụ: 'Thứ Hai, 15 tháng 6 năm 2025, 09:00'
 * @param {string | Date} dateInput Chuỗi ISO hoặc đối tượng Date
 * @returns {string} Chuỗi ngày đã định dạng hoặc chuỗi rỗng nếu input không hợp lệ
 */
export const formatDateTime = (dateInput) => {
    if (!dateInput) return '';
    try {
      const date = new Date(dateInput);
      // Kiểm tra xem date có hợp lệ không
      if (isNaN(date.getTime())) {
          return '';
      }
  
      const options = {
        weekday: 'long', // "Thứ Hai"
        year: 'numeric', // "2025"
        month: 'long', // "tháng 6"
        day: 'numeric', // "15"
        hour: '2-digit', // "09"
        minute: '2-digit', // "00"
        hour12: false // Sử dụng định dạng 24h
      };
      // Sử dụng locale 'vi-VN' để có định dạng tiếng Việt
      return new Intl.DateTimeFormat('vi-VN', options).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return ''; // Trả về chuỗi rỗng nếu có lỗi
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