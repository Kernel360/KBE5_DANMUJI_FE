import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080', // todo: 실제 API 서버 주소로 변경
      changeOrigin: true,
      secure: false, // todo: SSL 설정 후 true로 변경
    },
  },
},
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
