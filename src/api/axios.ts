// src/api/axios.ts
import axios from "axios";

// 환경에 따른 baseURL 설정
const getBaseURL = () => {
  // 환경변수에서 API URL 가져오기
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  
  // 현재 호스트명 확인
  const currentHost = window.location.hostname;

  if (currentHost === "localhost" || currentHost.includes("localhost")) {
    // 개발 환경: 환경변수가 있으면 사용, 없으면 API 서버 사용
    return envApiUrl && envApiUrl !== "undefined" ? envApiUrl : "https://api.danmuji.site";
  } else {
    // 프로덕션 환경: API 서버 사용
    return "https://api.danmuji.site";
  }
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // 쿠키 포함
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰 가져오기
    const token = localStorage.getItem("accessToken");

    // 토큰이 있으면 Authorization 헤더에 추가
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401 에러(인증 실패) 처리
    if (error.response?.status === 401) {
      // 토큰 제거
      localStorage.removeItem("accessToken");
      // 로그인 페이지로 리다이렉트
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

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