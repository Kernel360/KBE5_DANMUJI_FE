import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // 코드 스플리팅 설정
        manualChunks: {
          // React와 React-DOM을 별도 청크로 분리
          vendor: ["react", "react-dom"],
        },
      },
    },
    // 청크 크기 경고를 1000KB로 조정
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
