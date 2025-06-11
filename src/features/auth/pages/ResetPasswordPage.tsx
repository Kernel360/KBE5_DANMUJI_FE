import React, { useState, useEffect } from "react";
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
} from "../components/UserPage.styled";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "@/api/axios";
import { AxiosError } from "axios";

export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // URL에서 토큰 추출

  useEffect(() => {
    const t = searchParams.get("token");
    if (t) setToken(t);
  }, [searchParams]);
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordMismatch(newPasswordConfirm !== value); // 실시간 비교
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmValue = e.target.value;
    setNewPasswordConfirm(confirmValue);
    setPasswordMismatch(confirmValue !== newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/api/users/password/reset-mail/confirm", {
        token,
        newPassword,
      });

      setSubmitted(true); // 2xx 응답이면 성공 처리
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ code: string; message: string }>;
      const code = axiosError.response?.data?.code;
      const message = axiosError.response?.data?.message;
      if (code === "U004") {
        alert(message || "인증에 실패했습니다.");
      } else {
        alert("비밀번호 재설정에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <ComponentContainer>
      <ComponentWrapper>
        <LeftPanel showLockInfo={submitted} />
        <ComponentRight>
          <DanmujiLogo />
          <ComponentCard>
            <Form onSubmit={handleSubmit}>
              <Title>비밀번호 재설정</Title>
              <div
                style={{
                  padding: "0.75rem",
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                새로운 비밀번호를 입력하세요.
              </div>
              <div>
                <div style={{ marginBottom: "0.5rem" }}>
                  <label htmlFor="username">비밀번호</label>
                </div>
                <Input
                  type="password"
                  id="newPassword"
                  placeholder="비밀번호"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  required
                  hasError={passwordMismatch}
                />
                <div style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
                  <label htmlFor="email">비밀번호 확인</label>
                </div>
                <Input
                  type="password"
                  id="passwordConfirm"
                  placeholder="비밀번호 확인"
                  value={newPasswordConfirm}
                  onChange={handleConfirmChange}
                  required
                  hasError={passwordMismatch}
                />
                {passwordMismatch && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "0.75rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    비밀번호가 일치하지 않습니다.
                  </p>
                )}
              </div>
              <Button type="submit">비밀번호 재설정</Button>
            </Form>
            <div
              style={{
                marginTop: "1rem",
                fontSize: "0.875rem",
                textAlign: "center",
                color: "#fdb924",
                cursor: "pointer",
              }}
              onClick={() => navigate("/login")}
            >
              로그인 화면으로
            </div>
          </ComponentCard>
        </ComponentRight>
      </ComponentWrapper>
    </ComponentContainer>
  );
}
