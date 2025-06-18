import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import {
  FiX,
  FiHome,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHash,
  FiFileText,
  FiEdit3,
} from "react-icons/fi";
import type { CompanyFormData } from "../../pages/CompanyPage";
import type { Company } from "../../pages/CompanyPage";

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(253, 185, 36, 0.1);
  width: 600px;
  padding: 24px;
  position: relative;
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

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: CompanyFormData) => void;
  initialData: Company | null;
}

export default function CompanyEditModal({
  open,
  onClose,
  onSave,
  initialData,
}: Props) {
  const reg1Ref = useRef<HTMLInputElement>(null);
  const reg2Ref = useRef<HTMLInputElement>(null);
  const reg3Ref = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    reg1: "",
    reg2: "",
    reg3: "",
    address: "",
    ceoName: "",
    email: "",
    bio: "",
    tel: "",
  });
  const [reg1, setReg1] = useState("");
  const [reg2, setReg2] = useState("");
  const [reg3, setReg3] = useState("");

  useEffect(() => {
    if (open && initialData) {
      const mappedData: CompanyFormData = {
        name: initialData.name,
        reg1: String(initialData.bizNo).padStart(10, "0").slice(0, 3),
        reg2: String(initialData.bizNo).padStart(10, "0").slice(3, 5),
        reg3: String(initialData.bizNo).padStart(10, "0").slice(5),
        address: initialData.address,
        ceoName: initialData.ceoName,
        email: initialData.email,
        bio: initialData.bio,
        tel: initialData.tel,
      };
      setFormData(mappedData);
      setReg1(mappedData.reg1);
      setReg2(mappedData.reg2);
      setReg3(mappedData.reg3);
    } else if (!open) {
      setFormData({
        name: "",
        reg1: "",
        reg2: "",
        reg3: "",
        address: "",
        ceoName: "",
        email: "",
        bio: "",
        tel: "",
      });
      setReg1("");
      setReg2("");
      setReg3("");
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleRegInput = (
    e: React.FormEvent<HTMLInputElement>,
    len: number,
    setReg: React.Dispatch<React.SetStateAction<string>>,
    nextRef?: React.RefObject<HTMLInputElement | null>
  ) => {
    let value = e.currentTarget.value.replace(/[^0-9]/g, "");
    if (value.length > len) value = value.slice(0, len);
    setReg(value);
    if (value.length === len && nextRef && nextRef.current) {
      nextRef.current.focus();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalData: CompanyFormData = {
      ...formData,
      reg1: reg1,
      reg2: reg2,
      reg3: reg3,
    };
    onSave(finalData);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>
          <FiX size={18} />
        </CloseButton>
        <Title>
          <FiEdit3 size={20} />
          회사 정보 수정
        </Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              <FiHome size={14} />
              회사명
            </Label>
            <Input
              name="name"
              required
              placeholder="회사명을 입력하세요"
              value={formData.name || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>
              <FiHash size={14} />
              사업자등록번호
            </Label>
            <RegNumberRow>
              <RegInput
                ref={reg1Ref}
                maxLength={3}
                placeholder="000"
                inputMode="numeric"
                value={reg1}
                onInput={(e) => handleRegInput(e, 3, setReg1, reg2Ref)}
              />
              <span>-</span>
              <RegInput
                ref={reg2Ref}
                maxLength={2}
                placeholder="00"
                inputMode="numeric"
                value={reg2}
                onInput={(e) => handleRegInput(e, 2, setReg2, reg3Ref)}
              />
              <span>-</span>
              <RegInput
                ref={reg3Ref}
                maxLength={5}
                placeholder="00000"
                inputMode="numeric"
                value={reg3}
                onInput={(e) => handleRegInput(e, 5, setReg3)}
              />
            </RegNumberRow>
          </FormGroup>
          <FormGroup>
            <Label>
              <FiMapPin size={14} />
              주소
            </Label>
            <Input
              name="address"
              required
              placeholder="주소를 입력하세요"
              value={formData.address || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>
              <FiUser size={14} />
              대표자명
            </Label>
            <Input
              name="ceoName"
              required
              placeholder="대표자명을 입력하세요"
              value={formData.ceoName || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>
              <FiMail size={14} />
              이메일
            </Label>
            <Input
              name="email"
              type="email"
              required
              placeholder="이메일을 입력하세요"
              value={formData.email || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>
              <FiPhone size={14} />
              전화번호
            </Label>
            <Input
              name="tel"
              type="tel"
              required
              placeholder="전화번호를 입력하세요"
              value={formData.tel || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>
              <FiFileText size={14} />
              회사소개
            </Label>
            <TextArea
              name="bio"
              rows={3}
              placeholder="간단한 설명을 입력하세요"
              value={formData.bio || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <SubmitButton type="submit">
            <FiEdit3 size={16} />
            수정하기
          </SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}
