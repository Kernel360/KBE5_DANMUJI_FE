import React, { useState } from "react";
import api from "@/api/axios";
import { LeftPanel } from "@/features/auth/components/LeftPanel";
import { DanmujiLogo } from "@/features/auth/components/DanmujiLogo";
import { useAuth } from "@/hooks/useAuth";
import {
  showErrorToast,
  showSuccessToast,
  withErrorHandling,
} from "@/utils/errorHandler";

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
  const { refreshUser } = useAuth();

  const handleForgotPassword = () => {
    window.location.href = "/forgot-password";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await withErrorHandling(async () => {
      const res = await api.post(
        "/api/auth/login",
        { username: id, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          validateStatus: () => true,
        }
      );

      if (res.status === 200) {
        const accessToken = res.headers["authorization"].replace("Bearer ", "");
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);

          // 사용자 정보 가져오기
          await refreshUser();

          showSuccessToast("로그인 되었습니다.");
          window.location.href = "/dashboard";
        } else {
          throw new Error("액세스 토큰이 없습니다.");
        }
      } else if (res.data?.code === "C005") {
        throw new Error("비밀번호가 일치하지 않습니다.");
      } else {
        throw new Error("해당 아이디가 존재하지 않습니다.");
      }
      return res;
    }, "로그인에 실패했습니다.");
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
