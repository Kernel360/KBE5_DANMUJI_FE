import React, { useState } from "react";
import {
  LoginContainer,
  LoginWrapper,
  LoginLeft,
  LoginRight,
  LoginCard,
  Logo,
  LogoImage,
  Title,
  Subtitle,
  Form,
  Input,
  Button,
  SecureConnection,
  LockIconImage,
  LockText,
  LockTitle,
  LockContainer,
  DescIconImage,
  DescIconText,
  DescIconContainer,
  LeftTitle,
  LeftDesc,
  MailIconImage,
} from "./LoginPage.styled";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // try {
    //   const res = await fetch("/api/users/password/reset-mail/request", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ username, email }),
    //   });

    //   if (res.ok) {
    //     setSubmitted(true);
    //   } else {
    //     const data = await res.json().catch(() => null);
    //     alert(data?.message || "오류가 발생했습니다.");
    //   }
    // } catch (err) {
    //   alert("네트워크 오류입니다. 다시 시도해주세요.");
    // }
  };

  return (
    <LoginContainer>
      <LoginWrapper>
        <LoginLeft>
          {/* <Logo>
            <LogoImage src="/src/assets/danmuji_logo.png" alt="Logo" />
          </Logo> */}
          <LeftTitle>단계 별 무리 없는 지원 시스템</LeftTitle>
          <LeftDesc>Project Management System</LeftDesc>
          <DescIconContainer>
            <DescIconImage
              src="/src/assets/Check-Icon.png"
              alt="Description Icon"
            />
            <DescIconText>효율적인 프로젝트 관리 시스템</DescIconText>
          </DescIconContainer>
          <DescIconContainer>
            <DescIconImage
              src="/src/assets/Team-Icon.png"
              alt="Description Icon"
            />
            <DescIconText>팀 협업 및 커뮤니케이션 향상</DescIconText>
          </DescIconContainer>
          <DescIconContainer>
            <DescIconImage
              src="/src/assets/Chart-Icon.png"
              alt="Description Icon"
            />
            <DescIconText>실시간 데이터 분석 및 보고서</DescIconText>
          </DescIconContainer>
          {submitted && (
            <>
              <LockContainer>
                <LockIconImage
                  src="/src/assets/lock-icon.png"
                  alt="Lock Icon"
                />
                <LockTitle>보안 정보</LockTitle>
              </LockContainer>
              <LockText>
                <br /> 이메일로 전송된 링크는 30분 동안 유효합니다.
                <br />
                개인정보 보호를 위해 링크를 공유하지 마세요.
              </LockText>
            </>
          )}
        </LoginLeft>

        <LoginRight>
          <LoginCard>
            <Logo>
              <LogoImage src="/src/assets/danmuji_logo.png" alt="Logo" />
            </Logo>
            {submitted ? (
              <div>
                <MailIconImage
                  src="/src/assets/Success-icon.png"
                  alt="Check Icon"
                />
                <Title>이메일 전송 완료</Title>
                <Subtitle>
                  비밀번호 재설정 링크가 전송되었습니다.
                  <br /> 이메일을 확인해주세요.
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
                </Subtitle>

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
                <Button type="submit">재설정 링크 보내기</Button>
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
          </LoginCard>
        </LoginRight>
      </LoginWrapper>
    </LoginContainer>
  );
}
