import React, { useState } from "react";
import { LeftPanel } from "@/features/auth/components/LeftPanel";
import { DanmujiLogo } from "@/features/auth/components/DanmujiLogo";
import {
  ComponentContainer,
  ComponentWrapper,
  ComponentRight,
  ComponentCard,
  Title,
  Subtitle,
  Form,
  Input,
  Button,
  MailIconImage,
} from "../components/UserPage.styled";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { AxiosError } from "axios";

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true); // 로딩 시작
      await api.post("/api/users/password/reset-mail/request", {
        username,
        email,
      });

      setSubmitted(true); // 2xx 응답이면 성공 처리
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ code: string }>;
      const code = axiosError.response?.data?.code;
      if (code === "U001") {
        alert(
          "입력하신 아이디로 등록된 사용자를 찾을 수 없습니다.\n아이디를 다시 확인해주세요."
        );
      } else {
        alert("비밀번호 재설정 메일 전송에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ComponentContainer>
      <ComponentWrapper>
        <LeftPanel showLockInfo={submitted} />
        <ComponentRight>
          <DanmujiLogo />
          <ComponentCard>
            {submitted ? (
              <div>
                <MailIconImage src="/Success-Icon.png" alt="Check Icon" />
                <Title>이메일 전송 완료</Title>
                <Subtitle>
                  비밀번호 재설정 링크가 전송되었습니다.
                  <br /> 이메일을 확인해주세요.
                </Subtitle>
                <div
                  style={{
                    padding: "0.75rem",
                    fontSize: "0.75rem",
                    textAlign: "center",
                  }}
                >
                  입력하신 이메일:
                  <strong> {email}</strong>
                </div>

                <div
                  style={{
                    marginTop: "1.5rem",
                    background: "#f9fafb",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    textAlign: "center",
                  }}
                >
                  이메일을 받지 못하셨나요?
                  <br />
                  스팸함을 확인하거나 관리자에게 문의하세요.
                </div>
              </div>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Title>비밀번호 찾기</Title>
                <div
                  style={{
                    padding: "0.75rem",
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    textAlign: "center",
                  }}
                >
                  가입한 아이디와 이메일 주소를 입력하면 <br />
                  비밀번호 재설정 링크가 전송됩니다.
                </div>
                <div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <label htmlFor="username">아이디</label>
                  </div>
                  <Input
                    type="text"
                    id="username"
                    placeholder="아이디를 입력하세요"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <div style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
                    <label htmlFor="email">이메일 주소</label>
                  </div>
                  <Input
                    type="email"
                    id="email"
                    placeholder="danmuji@danmuji.site"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "메일 전송 중..." : "재설정 링크 보내기"}
                </Button>
              </Form>
            )}
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
