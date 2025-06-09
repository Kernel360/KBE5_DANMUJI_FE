// src/api/axios.ts
import axios from "axios";

// 환경에 따른 baseURL 설정
const getBaseURL = () => {
  // 환경 변수가 있으면 사용, 없으면 기본값
  const envBaseURL = import.meta.env.VITE_API_BASE_URL;

  if (envBaseURL) {
    return envBaseURL;
  }

  // 환경 변수가 없으면 호스트명으로 판단
  const currentHost = window.location.hostname;

  if (currentHost === "localhost" || currentHost.includes("localhost")) {
    // 개발 환경: Vite 프록시 사용
    return "";
  } else {
    // 프로덕션 환경: 기본 API 서버 사용
    return "https://api.danmuji.site";
  }
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // 쿠키 포함
});

// 디버깅용 로그
console.log("=== Axios Configuration ===");
console.log(
  "Environment Variable VITE_API_BASE_URL:",
  import.meta.env.VITE_API_BASE_URL
);
console.log("Current hostname:", window.location.hostname);
console.log("Environment:", import.meta.env.MODE);
console.log("Is Dev:", import.meta.env.DEV);
console.log("Final Base URL:", getBaseURL());
console.log("===========================");

export default api;
