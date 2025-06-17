import api from "@/api/axios";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useNotification } from "@/features/Notification/NotificationContext";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: 420px;
  padding: 2rem;
  position: relative;
`;

const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #9ca3af;
  font-size: 1.25rem;
  cursor: pointer;

  &:hover {
    color: #4b5563;
  }
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
  }
`;

const RegNumberRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const RegInput = styled(Input)`
  width: 3.5rem;
  text-align: center;
  padding-left: 0;
  padding-right: 0;
`;

const MessageBox = styled.div<{ success?: boolean }>`
  margin-bottom: 1rem;
  color: ${({ success }) => (success ? "green" : "red")};
  font-weight: 600;
  font-size: 0.9rem;
`;

interface FieldError {
  field: string;
  value: string;
  reason: string;
}

interface ErrorResponse {
  status: string;
  code: string;
  message: string;
  data?: {
    errors: FieldError[];
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  onRegisterSuccess?: () => void;
}

export default function CompanyRegisterModal({
  open,
  onClose,
  onRegisterSuccess,
}: Props) {
  const reg1 = useRef<HTMLInputElement>(null);
  const reg2 = useRef<HTMLInputElement>(null);
  const reg3 = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { notify } = useNotification();

  if (!open) return null;

  const handleRegInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    len: number,
    nextRef?: React.RefObject<HTMLInputElement | null>
  ) => {
    const target = e.target as HTMLInputElement;
    let value = target.value.replace(/[^0-9]/g, "");
    if (value.length > len) value = value.slice(0, len);
    target.value = value;
    if (value.length === len && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  const handleClose = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors([]);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors([]);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as { [key: string]: string };

    const bizNo = `${data.reg1}${data.reg2}${data.reg3}`;

    const requestBody = {
      name: data.name,
      bizNo,
      address: data.address,
      ceoName: data.ceoName,
      email: data.email,
      tel: data.tel,
      bio: data.bio,
    };

    try {
      await api.post("/api/companies", requestBody);
      notify("회사 등록이 완료되었습니다!");
      onRegisterSuccess?.();
      handleClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data as ErrorResponse | undefined;
        if (errorData?.data?.errors) {
          setFieldErrors(errorData.data.errors);
          notify("회사 등록이 실패했습니다!", false);
        } else {
          setErrorMessage(errorData?.message || "회사 등록 중 알 수 없는 오류가 발생했습니다.");
        }
      } else {
        setErrorMessage("회사 등록 중 알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={handleClose}>×</CloseButton>
        <Title>회사 등록</Title>

        {/* 성공 / 에러 메시지 표시 */}
        {successMessage && <MessageBox success>{successMessage}</MessageBox>}
        {errorMessage && <MessageBox>{errorMessage}</MessageBox>}

        <Form ref={formRef} onSubmit={handleSubmit}>
          <FormGroup>
            <Label>회사명</Label>
            <Input name="name" required placeholder="회사명을 입력하세요" />
            {fieldErrors.find((e) => e.field === "name") && (
              <p style={{ color: "red", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                {fieldErrors.find((e) => e.field === "name")?.reason}
              </p>
            )}
          </FormGroup>
          <FormGroup>
            <Label>사업자등록번호</Label>
            <RegNumberRow>
              <RegInput
                name="reg1"
                required
                ref={reg1}
                maxLength={3}
                placeholder="000"
                onChange={(e) => handleRegInput(e, 3, reg2)}
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <span>-</span>
              <RegInput
                name="reg2"
                required
                ref={reg2}
                maxLength={2}
                placeholder="00"
                onChange={(e) => handleRegInput(e, 2, reg3)}
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <span>-</span>
              <RegInput
                name="reg3"
                required
                ref={reg3}
                maxLength={5}
                placeholder="00000"
                onChange={(e) => handleRegInput(e, 5)}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </RegNumberRow>
            {fieldErrors.find((e) => e.field === "bizNo") && (
              <p style={{ color: "red", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                {fieldErrors.find((e) => e.field === "bizNo")?.reason}
              </p>
            )}
          </FormGroup>
          <FormGroup>
            <Label>주소</Label>
            <Input name="address" required placeholder="주소를 입력하세요" />
            {fieldErrors.find((e) => e.field === "address") && (
              <p style={{ color: "red", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                {fieldErrors.find((e) => e.field === "address")?.reason}
              </p>
            )}
          </FormGroup>
          <FormGroup>
            <Label>대표자명</Label>
            <Input name="ceoName" required placeholder="대표자명을 입력하세요" />
            {fieldErrors.find((e) => e.field === "ceoName") && (
              <p style={{ color: "red", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                {fieldErrors.find((e) => e.field === "ceoName")?.reason}
              </p>
            )}
          </FormGroup>
          <FormGroup>
            <Label>이메일</Label>
            <Input
              name="email"
              type="email"
              required
              placeholder="이메일을 입력하세요"
            />
            {fieldErrors.find((e) => e.field === "email") && (
              <p style={{ color: "red", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                {fieldErrors.find((e) => e.field === "email")?.reason}
              </p>
            )}
          </FormGroup>
          <FormGroup>
            <Label>전화번호</Label>
            <Input
              name="tel"
              type="tel"
              required
              placeholder="전화번호를 입력하세요"
            />
            {fieldErrors.find((e) => e.field === "tel") && (
              <p style={{ color: "red", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                {fieldErrors.find((e) => e.field === "tel")?.reason}
              </p>
            )}
          </FormGroup>
          <FormGroup>
            <Label>한줄소개</Label>
            <TextArea
              name="bio"
              rows={3}
              placeholder="한 줄 소개를 입력하세요"
            />
            {fieldErrors.find((e) => e.field === "bio") && (
              <p style={{ color: "red", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                {fieldErrors.find((e) => e.field === "bio")?.reason}
              </p>
            )}
          </FormGroup>
          <button
            type="submit"
            style={{
              marginTop: 12,
              cursor: "pointer",
              backgroundColor: "#fdb924",
              color: "white",
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              fontWeight: "bold",
            }}
          >
            등록하기
          </button>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}
