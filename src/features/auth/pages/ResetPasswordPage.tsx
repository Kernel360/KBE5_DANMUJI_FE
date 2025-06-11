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
  MailIconImage,
  Subtitle,
} from "../components/UserPage.styled";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "@/api/axios";
import { AxiosError } from "axios";
import { CheckCircle, Circle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  // URL에서 토큰 추출
  useEffect(() => {
    const t = searchParams.get("token");
    if (t) setToken(t);
  }, [searchParams]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    const error = validatePassword(value);
    setPasswordError(error);
    setPasswordMismatch(newPasswordConfirm !== value);
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmValue = e.target.value;
    setNewPasswordConfirm(confirmValue);
    setPasswordMismatch(confirmValue !== newPassword);
  };

  const validatePassword = (value: string) => {
    if (value.length < 8) return "8자 이상 입력해주세요.";
    if (!/[A-Z]/.test(value)) return "대문자를 포함해야 합니다.";
    if (!/[0-9]/.test(value)) return "숫자를 포함해야 합니다.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const passwordError = validatePassword(newPassword);
    const mismatch = newPassword !== newPasswordConfirm;

    if (passwordError || mismatch) {
      if (passwordError) setPasswordError(passwordError);
      if (mismatch) setPasswordMismatch(true);
      alert(passwordError || "비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await api.post("/api/users/password/reset-mail/confirm", {
        token,
        newPassword,
      });

      setSubmitted(true); 
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
        <LeftPanel />
        <ComponentRight>
          <DanmujiLogo />
          <ComponentCard>
            {submitted ? (
              <div>
                <MailIconImage src="/Success-Icon.png" alt="Check Icon" />
                <Title>비밀번호 재설정 완료</Title>
                <Subtitle>로그인하여 Danmuji를 이용해 주세요.</Subtitle>
                <Button onClick={() => navigate("/login")}>
                  로그인 하러 가기
                </Button>
              </div>
            ) : (
              <div>
                <Form onSubmit={handleSubmit}>
                  <Title>비밀번호 재설정</Title>
                  <div>
                    <div style={{ marginBottom: "0.5rem" }}>
                      <label htmlFor="password">비밀번호</label>
                    </div>
                    <Input
                      type="password"
                      id="newPassword"
                      placeholder="비밀번호"
                      value={newPassword}
                      onChange={handlePasswordChange}
                      required
                      style={{
                        borderColor: passwordError ? "red" : undefined,
                      }}
                    />
                    <div style={{ marginBottom: "0.3rem" }}></div>

                    <Input
                      type="password"
                      id="passwordConfirm"
                      placeholder="비밀번호 확인"
                      value={newPasswordConfirm}
                      onChange={handleConfirmChange}
                      required
                      style={{
                        borderColor:
                          passwordMismatch && newPasswordConfirm.length > 0
                            ? "red"
                            : undefined,
                      }}
                    />
                    {passwordMismatch && newPasswordConfirm.length > 0 && (
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
                    <PasswordRequirements password={newPassword} />
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
              </div>
            )}
          </ComponentCard>
        </ComponentRight>
      </ComponentWrapper>
    </ComponentContainer>
  );
}

const PasswordRequirements = ({ password }: { password: string }) => {
  const requirements = [
    {
      label: "최소 8자 이상",
      valid: password.length >= 8,
    },
    {
      label: "최소 1자의 대문자 사용",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "최소 1자의 숫자 사용",
      valid: /[0-9]/.test(password),
    },
  ];

  return (
    <div>
      {requirements.map((req, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            // marginBottom: "0.5rem",
            color: req.valid ? "#111827" : "#9ca3af",
            fontSize: "0.8rem",
          }}
        >
          <span style={{ marginRight: "0.5rem", marginTop: "0.5rem" }}>
            {req.valid ? (
              <CheckCircle size={16} color="#10b981" />
            ) : (
              <Circle size={16} color="#d1d5db" />
            )}
          </span>
          {req.label}
        </div>
      ))}
    </div>
  );
};
