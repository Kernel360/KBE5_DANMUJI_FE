import React, { useState } from "react";
import {
  LoginContainer,
  LoginContent,
  LoginCard,
  Logo,
  LogoImage,
  Title,
  Subtitle,
  Form,
  Input,
  Button,
  SecureConnection,
  Footer,
} from "./LoginPage.styled";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 로직
  };

  const handleForgotPassword = () => {
    // 비밀번호 찾기 페이지 이동
    window.location.href = "/forgot-password";
  };

  return (
    <LoginContainer>
      <LoginContent>
        <LoginCard>
          <Logo>
            <LogoImage src="/logo.png" alt="Logo" />
          </Logo>
          <Title>Welcome back</Title>
          <Subtitle>Please sign in to your account</Subtitle>
          <Form onSubmit={handleSubmit}>
            <Input
                type="text"
              placeholder="아이디"
                value={id}
              onChange={(e) => setId(e.target.value)}
              />
            <Input
                type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
            <Button type="submit">로그인</Button>
          </Form>
          <SecureConnection>
            <span>🔒</span>
            Secure, encrypted connection
          </SecureConnection>
        </LoginCard>
      </LoginContent>
      <Footer>© 2025 Back2Basics. All rights reserved.</Footer>
    </LoginContainer>
  );
}
