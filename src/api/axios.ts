// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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

export default api;
