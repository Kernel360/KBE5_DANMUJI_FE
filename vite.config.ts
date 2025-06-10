import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // 상대 경로 설정 추가
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
    // 정적 자산 처리 설정
    assetsDir: "assets",
    // 정적 자산 인라인 제한 (4KB 미만은 base64로 인라인)
    assetsInlineLimit: 4096,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 정적 자산 처리를 위한 publicDir 명시적 설정
  publicDir: "public",
  // 개발 서버 설정 (선택사항)
  server: {
    fs: {
      // 정적 파일 서빙 허용
      allow: [".."],
    },
  },
});