// src/api/axios.ts
import axios from "axios";

// 환경에 따른 baseURL 설정
const getBaseURL = () => {
  // 개발 환경 확인
  const isDev = import.meta.env.DEV || import.meta.env.MODE === "development";

  if (isDev) {
    // 개발 환경: Vite 프록시 사용
    return "";
  } else {
    // 프로덕션 환경: 강제로 API 서버 사용
    return "https://api.danmuji.site";
  }
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // 쿠키 포함
});

// 디버깅용 로그
console.log("=== Axios Configuration ===");
console.log("Environment:", import.meta.env.MODE);
console.log("Is Dev:", import.meta.env.DEV);
console.log("Base URL:", getBaseURL());
console.log("===========================");

export default api;
