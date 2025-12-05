import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://testmarkdb.azurewebsites.net", // 🌐 backend URL thật
        changeOrigin: true, // giả origin để backend tưởng là cùng domain
        secure: false, // bỏ check SSL (cần nếu dùng HTTPS tự ký)
        rewrite: (path) => path.replace(/^\/api/, "/api"), // giữ nguyên đường dẫn
      },
    },
  },

})
