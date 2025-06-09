import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
   server: {
    port: 3000,
    strictPort: true,
    host: '0.0.0.0'
  }
})
