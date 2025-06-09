// src/utils/eventDetailsUtils.js

/**
 * Geocode an address string to latitude and longitude coordinates.
 * @param {string} address The address to geocode.
 * @returns {Promise<[number, number]>} A promise that resolves to [lat, lon].
 */
export const geocodeAddress = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    // Default to a known location (e.g., Da Nang) if not found
    return [16.0544, 108.2022];
  } catch (error) {
    console.error('Geocoding error:', error);
    // Return default on error
    return [16.0544, 108.2022];
  }
};

/**
 * Formats an ISO-like date string to "HH:mm - DD/MM/YYYY" format for Da Nang.
 * @param {string} dateString The date string (e.g., "2025-06-10T09:00:00").
 * @returns {string} The formatted date-time string.
 */
export const formatDaNangDateTimeString = (dateString) => {
    if (!dateString || typeof dateString !== 'string') {
        return 'Chưa xác định';
    }
    try {
        const date = new Date(dateString);
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'Asia/Ho_Chi_Minh' // Múi giờ Việt Nam
        };
        const formatted = new Intl.DateTimeFormat('vi-VN', options).format(date);
        // Chuyển đổi từ "dd/MM/yyyy, HH:mm" sang "HH:mm - dd/MM/yyyy"
        const [datePart, timePart] = formatted.split(', ');
        return `${timePart} - ${datePart}`;
    } catch (e) {
        console.error("Lỗi khi định dạng chuỗi thời gian:", dateString, e);
        return dateString;
    }
};

/**
 * Extracts day, month, and year from a date string.
 * @param {string} dateString The date string (e.g., "2025-06-10T09:00:00").
 * @returns {{day: string, month: string, year: string}}
 */
export const getDateInfoFromString = (dateString) => {
    if (!dateString || typeof dateString !== 'string') {
        return { day: '--', month: '---', year: '----' };
    }
    try {
        const date = new Date(dateString);
         const day = date.toLocaleDateString('vi-VN', { day: '2-digit' });
         // "Tháng 6" -> "THG 6"
         const month = date.toLocaleDateString('vi-VN', { month: 'short' }).toUpperCase().replace('.', '');
         const year = date.getFullYear().toString();
        return { day, month, year };
    } catch (error) {
        console.error("Lỗi khi trích xuất thông tin ngày:", dateString, error);
        return { day: '--', month: '---', year: '----' };
    }
};

/**
 * Determines the event's status based on current time.
 * @param {string} startDateString Start date of the event.
 * @param {string} endDateString End date of the event.
 * @returns {'upcoming' | 'ongoing' | 'past'}
 */
export const getEventStatus = (startDateString, endDateString) => {
    const now = new Date();
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'ongoing';
    return 'past';
};