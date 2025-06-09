// src/api/axios.ts
import axios from "axios";

// 환경에 따른 baseURL 설정
const getBaseURL = () => {
  // 현재 호스트명 확인
  const currentHost = window.location.hostname;

  if (currentHost === "localhost" || currentHost.includes("localhost")) {
    // 개발 환경: Vite 프록시 사용
    return "";
  } else {
    // 프로덕션 환경: 강제로 API 서버 사용 (하드코딩)
    return "https://api.danmuji.site";
  }
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // 쿠키 포함
});

// 디버깅용 로그
console.log("=== Axios Configuration ===");
console.log("Current hostname:", window.location.hostname);
console.log(
  "Environment Variable VITE_API_BASE_URL:",
  import.meta.env.VITE_API_BASE_URL
);
console.log("Environment:", import.meta.env.MODE);
console.log("Is Dev:", import.meta.env.DEV);
console.log("Final Base URL:", getBaseURL());
console.log("===========================");

export default api;
