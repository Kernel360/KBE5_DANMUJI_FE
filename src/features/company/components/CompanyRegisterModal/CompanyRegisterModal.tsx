import api from "@/api/axios";
import axios from "axios";
import React, { useRef, useState } from "react";
import {
  FiX,
  FiHome,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHash,
  FiFileText,
  FiPlus,
} from "react-icons/fi";
import { useNotification } from "@/features/Notification/NotificationContext";
import styled from "styled-components";
import { showSuccessToast } from "@/utils/errorHandler";
import { IoMdClose } from "react-icons/io";
import ReactDOM from "react-dom";

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 11000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
`;

const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 24px;
  animation: modalSlideIn 0.2s ease-out;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  resize: vertical;
  font-size: 14px;
  background-color: #ffffff;
  color: #374151;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: #f8fafc;
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #475569;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1e293b;

  svg {
    color: #fdb924;
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const FormGroup = styled.div`
  &:nth-child(1),
  &:nth-child(2),
  &:nth-child(7),
  &:nth-child(8) {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;

  svg {
    color: #f59e0b;
  }
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  background-color: #ffffff;
  color: #374151;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
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
  margin-bottom: 16px;
  color: ${({ success }) => (success ? "green" : "red")};
  font-weight: 600;
  font-size: 14px;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #fdb924 0%, #f59e0b 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: fit-content;
  margin: 0 auto;
  margin-top: 8px;
  grid-column: 1 / -1;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(253, 185, 36, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
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

    // 전화번호 숫자만 필터링
    const cleanedTel = data.tel.replace(/\D/g, "");

    // 프론트 유효성 검사
    const newFieldErrors: FieldError[] = [];

    if (!data.name.trim()) {
      newFieldErrors.push({
        field: "name",
        value: data.name,
        reason: "업체명은 필수입니다.",
      });
    }
    if (!data.ceoName?.trim()) {
      newFieldErrors.push({
        field: "ceoName",
        value: data.ceoName,
        reason: "대표자명은 필수입니다.",
      });
    }
    if (!data.bio.trim()) {
      newFieldErrors.push({
        field: "bio",
        value: data.bio,
        reason: "업체 소개는 필수입니다.",
      });
    }
    if (
      !/^\d{3}$/.test(data.reg1) ||
      !/^\d{2}$/.test(data.reg2) ||
      !/^\d{5}$/.test(data.reg3)
    ) {
      newFieldErrors.push({
        field: "bizNo",
        value: bizNo,
        reason: "사업자등록번호 형식이 올바르지 않습니다.",
      });
    }
    if (!data.address?.trim()) {
      newFieldErrors.push({
        field: "address",
        value: data.address,
        reason: "주소는 필수입니다.",
      });
    }
    if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newFieldErrors.push({
        field: "email",
        value: data.email,
        reason: "올바른 이메일 형식이 아닙니다.",
      });
    }
    if (!cleanedTel || !/^\d{9,11}$/.test(cleanedTel)) {
      newFieldErrors.push({
        field: "tel",
        value: data.tel,
        reason:
          "전화번호는 9~11자리의 숫자로 입력하세요. 예: 021231234, 01012345678",
      });
    }

    if (newFieldErrors.length > 0) {
      setFieldErrors(newFieldErrors);
      notify("입력값을 확인해주세요.", false);
      return;
    }

    const requestBody = {
      name: data.name,
      bizNo,
      address: data.address,
      ceoName: data.ceoName,
      email: data.email,
      tel: cleanedTel,
      bio: data.bio,
    };

    try {
      await api.post("/api/companies", requestBody);
      showSuccessToast("업체 등록이 완료되었습니다!");
      onRegisterSuccess?.();
      handleClose();
    } catch (err: any) {
      console.error(err);

      if (axios.isAxiosError(err) && err.response?.data) {
        const errorData = err.response.data as ErrorResponse;

        // 🔽 필드 에러가 있으면 세팅
        if (errorData?.data?.errors) {
          setFieldErrors(errorData.data.errors);
        } else {
          setErrorMessage(
            errorData.message || "업체 등록 중 오류가 발생했습니다."
          );
        }
      } else {
        setErrorMessage("업체 등록 중 오류가 발생했습니다.");
      }
    }
  };

  return ReactDOM.createPortal(
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={handleClose}>
          <FiX size={18} />
        </CloseButton>
        <Title>
          <FiPlus size={20} />
          업체 등록
        </Title>
        {/* 성공 / 에러 메시지 표시 */}
        {successMessage && <MessageBox success>{successMessage}</MessageBox>}
        {errorMessage && <MessageBox>{errorMessage}</MessageBox>}
        <Form ref={formRef} onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              <FiHome size={14} />
              업체명
            </Label>
            <Input name="name" placeholder="업체명을 입력하세요" />
            {fieldErrors.find((e) => e.field === "name") && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {fieldErrors.find((e) => e.field === "name")?.reason}
              </p>
            )}
          </FormGroup>
          <FormGroup>
            <Label>
              <FiHash size={14} />
              사업자등록번호
            </Label>
            <RegNumberRow>
              <RegInput
                name="reg1"
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
                ref={reg3}
                maxLength={5}
                placeholder="00000"
                onChange={(e) => handleRegInput(e, 5)}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </RegNumberRow>
            {fieldErrors.find((e) => e.field === "bizNo") && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {fieldErrors.find((e) => e.field === "bizNo")?.reason}
              </p>
            )}
          </FormGroup>
          <FormGroup>
            <Label>
              <FiMapPin size={14} />
              주소
            </Label>
            <Input name="address" placeholder="주소를 입력하세요" />
            {fieldErrors.find((e) => e.field === "address") && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {fieldErrors.find((e) => e.field === "address")?.reason}
              </p>
            )}
          </FormGroup>
          <FormGroup>
            <Label>
              <FiUser size={14} />
              대표자명
            </Label>
            <Input name="ceoName" placeholder="대표자명을 입력하세요" />
            {fieldErrors.find((e) => e.field === "ceoName") && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {fieldErrors.find((e) => e.field === "ceoName")?.reason}
              </p>
            )}
          </FormGroup>
          <FormGroup>
            <Label>
              <FiMail size={14} />
              이메일
            </Label>
            <Input
              name="email"
              type="email"
              placeholder="이메일을 입력하세요"
            />
            {fieldErrors.find((e) => e.field === "email") && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {fieldErrors.find((e) => e.field === "email")?.reason}
              </p>
            )}
          </FormGroup>
          <FormGroup>
            <Label>
              <FiPhone size={14} />
              전화번호
            </Label>
            <Input
              name="tel"
              type="tel"
              placeholder="전화번호를 입력하세요"
              inputMode="numeric"
            />
            {fieldErrors.find((e) => e.field === "tel") && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {fieldErrors.find((e) => e.field === "tel")?.reason}
              </p>
            )}
          </FormGroup>
          <FormGroup>
            <Label>
              <FiFileText size={14} />
              업체 소개
            </Label>
            <TextArea
              name="bio"
              rows={3}
              placeholder="간단한 설명을 입력하세요"
            />
            {fieldErrors.find((e) => e.field === "bio") && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {fieldErrors.find((e) => e.field === "bio")?.reason}
              </p>
            )}
          </FormGroup>
          <SubmitButton type="submit">
            <FiPlus size={16} />
            등록하기
          </SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
}
