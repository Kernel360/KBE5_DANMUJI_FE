import React, { useState } from "react";
import axios from "axios";
import { LeftPanel } from "@/features/auth/components/LeftPanel";
import { DanmujiLogo } from "@/features/auth/components/DanmujiLogo";

import {
  ComponentContainer,
  ComponentWrapper,
  ComponentRight,
  ComponentCard,
  Title,
  Form,
  Input,
  Button,
  SecureConnection,
} from "../components/UserPage.styled";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleForgotPassword = () => {
    window.location.href = "/forgot-password";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/api/auth/login",
        { username: id, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // 쿠키 포함
        }
      );

      // accessToken을 헤더에서 추출
      const accessToken = res.headers["authorization"]?.replace("Bearer ", "");
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        alert("로그인 되었습니다.");
        window.location.href = "/dashboard";
      } else {
        alert("로그인에 실패했습니다.");
      }
    } catch (err: any) {
      if (err.response?.data?.code === "C005") {
        alert(err.response.data.message);
      } else if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      }
      console.error("Login error:", err);
    }
  };

  return (
    <>
      <ComponentContainer>
        <ComponentWrapper>
          <LeftPanel />
          <ComponentRight>
            <DanmujiLogo />
            <ComponentCard>
              <Title>로그인</Title>
              <Form onSubmit={handleSubmit}>
                <label htmlFor="username">아이디</label>
                <Input
                  type="text"
                  id="username"
                  placeholder="아이디"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
                <label htmlFor="password">비밀번호</label>
                <Input
                  type="password"
                  id="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    fontSize: 12,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{ color: "#fdb924", cursor: "pointer" }}
                    onClick={handleForgotPassword}
                  >
                    비밀번호를 잊으셨나요?
                  </span>
                </div>
                <Button type="submit">로그인</Button>
              </Form>
              <SecureConnection>
                <span role="img" aria-label="lock">
                  🔒
                </span>
                Secure, encrypted connection
              </SecureConnection>
            </ComponentCard>
          </ComponentRight>
        </ComponentWrapper>
      </ComponentContainer>
    </>
  );
}