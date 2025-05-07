/** @type {import('tailwindcss').Config} */
export default {
    // 1. Content: Chỉ định những file nào Tailwind cần quét để tìm class sử dụng
    //    Điều này quan trọng để loại bỏ các class không dùng khi build production.
    content: [
      "./index.html", // File HTML gốc
      "./src/**/*.{js,ts,jsx,tsx}", // Tất cả các file JS/TS/JSX/TSX trong thư mục src và các thư mục con của nó
      // Thêm các đường dẫn khác nếu cần (ví dụ: component library bên ngoài)
    ],
  
    // 2. Theme: Tùy chỉnh hoặc mở rộng hệ thống thiết kế mặc định của Tailwind
    theme: {
      extend: {
        fontFamily: {
         'nutito-sans': ['"Nunito Sans"', 'sans-serif'],
         'dm-sans': ['"DM Sans"', 'sans-serif'],
      },
        colors: {
          'primary': '#a8e0fd', // Màu chính
          'primary-1': "#47c1ff",
            'primary-2': "#ddf4ff",
            'primary-3': "#003652",
            'primary-4': "#5ba2dd",
            'primary-5': "#b1dcff",
            'primary-6': "#ceeeff",
            'primary-7': "#003652",
            'primary-8': "#02a533",
          'secondary': '#ffd3ec', // Màu phụ
            'secondary-1': "#eb7ebc",
            'secondary-2': "#ffabda",
            'secondary-3': "#ffc3e5",
            'secondary-4': "#a75e87",
            'secondary-5': "#ff8ccd",
            'secondary-6': "#692c4f",
            'secondary-7': "#d286b1",
            'secondary-8': "#39182b",
          'custom-gray': {
            100: '#f7fafc',
            // ...
            900: '#1a202c',
          },
        },
  
        
        // Ví dụ: Thêm breakpoint màn hình tùy chỉnh
        screens: {
          'xs': '480px',
          // 'sm': '640px', // Mặc định đã có, có thể ghi đè nếu muốn
          '3xl': '1600px', // Thêm breakpoint lớn hơn
        },
  
        // Ví dụ: Thêm giá trị spacing tùy chỉnh
        spacing: {
          '128': '32rem', // Thêm một giá trị spacing mới
        }
  
        // Bạn có thể mở rộng nhiều thứ khác: fontSize, borderRadius, boxShadow, etc.
      },
  
      // Nếu bạn muốn *hoàn toàn thay thế* một mục nào đó thay vì mở rộng,
      // hãy định nghĩa nó trực tiếp trong `theme`, bên ngoài `extend`.
      // Ví dụ: Thay thế toàn bộ bảng màu mặc định (ít phổ biến hơn)
      // colors: {
      //   'blue': '#0000ff',
      //   'white': '#ffffff',
      // }
    },
  
    // 3. Plugins: Thêm các plugin để mở rộng chức năng của Tailwind
    plugins: [
      // Ví dụ: Thêm plugin cho form styles (cần cài đặt: npm install -D @tailwindcss/forms)
      // require('@tailwindcss/forms'),
  
      // Ví dụ: Thêm plugin cho typography defaults (cần cài đặt: npm install -D @tailwindcss/typography)
      // require('@tailwindcss/typography'),
  
      // Ví dụ: Thêm plugin cho aspect ratio (cần cài đặt: npm install -D @tailwindcss/aspect-ratio)
      // require('@tailwindcss/aspect-ratio'),
    ],
  
    // 4. Các tùy chọn khác (ít dùng hơn)
    // darkMode: 'media', // hoặc 'class' - để bật chế độ dark mode
    // prefix: 'tw-', // Thêm tiền tố cho tất cả class của Tailwind (ví dụ: tw-text-blue-500)
    // important: false, // Hoặc true, hoặc một selector (ví dụ: '#app') để tăng độ ưu tiên cho class Tailwind
  }