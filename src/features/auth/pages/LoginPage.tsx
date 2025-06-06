import React, { useState } from "react";
import {
  LoginContainer,
  LoginWrapper,
  LoginLeft,
  LoginRight,
  LoginCard,
  Logo,
  LogoImage,
  Form,
  Input,
  Button,
  SecureConnection,
} from "./LoginPage.styled";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleForgotPassword = () => {
    // 비밀번호 찾기 페이지 이동
    window.location.href = "/forgot-password";
  };  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키 포함
        body: JSON.stringify({ username: id, password }),
      });
  
      if (res.ok) {
        // 로그인 성공 처리 (예: 대시보드로 이동)
        window.location.href = "/dashboard";
      } else {
        // 실패 처리
        alert("로그인 실패");
      }
    } catch (err) {
      alert("네트워크 오류");
    }
  };
  // ...existing code...
return (
  <>
    <LoginContainer>
      <LoginWrapper>
        <LoginLeft>
          <div>
            <h2>단계별 무리없는 지원 시스템</h2>
            <div>Project Management System</div>
            <ul>
              <li><span>✔️</span>효율적인 프로젝트 관리 시스템</li>
              <li><span>👥</span>팀 협업 및 커뮤니케이션 향상</li>
              <li><span>📊</span>실시간 데이터 분석 및 보고서</li>
            </ul>
          </div>
        </LoginLeft>
        <LoginRight>
          <LoginCard>
            <Logo>
              <LogoImage src="/logo.png" alt="Logo" />
              <span>Danmuji</span>
            </Logo>
            <div>로그인</div>
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="아이디를 입력하세요"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: "#fdb924", cursor: "pointer" }} onClick={handleForgotPassword}>
                  비밀번호를 잊으셨나요?
                </span>
              </div>
              <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit">로그인</Button>
            </Form>
            <SecureConnection>
              <span role="img" aria-label="lock">🔒</span>
              Secure, encrypted connection
            </SecureConnection>
          </LoginCard>
        </LoginRight>
      </LoginWrapper>
    </LoginContainer>
  </>
);

}
