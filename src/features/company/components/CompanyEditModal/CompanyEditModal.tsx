import React, { useRef, useEffect, useState } from "react";
import styled from 'styled-components';
import {
  ModalOverlay,
  ModalContent,
  CloseButton,
  Title,
  Form,
  FormGroup,
  Label,
  Input,
  ButtonGroup,
  Button,
} from "./CompanyEditModal.styled";
import type { CompanyFormData } from '../../pages/CompanyPage';
import type { Company } from '../../pages/CompanyPage';

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
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>회사 정보 수정</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>회사명</Label>
            <Input
              name="name"
              required
              placeholder="회사명을 입력하세요"
              value={formData.name || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>사업자등록번호</Label>
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
            <Label>주소</Label>
            <Input
              name="address"
              required
              placeholder="주소를 입력하세요"
              value={formData.address || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>사업자 명</Label>
            <Input
              name="ceoName"
              required
              placeholder="사업자 명을 입력하세요"
              value={formData.ceoName || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>이메일</Label>
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
            <Label>연락처</Label>
            <Input
              name="tel"
              required
              placeholder="010-0000-0000"
              value={formData.tel || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <ButtonGroup>
            <Button type="button" onClick={onClose} $variant="secondary">
              취소
            </Button>
            <Button type="submit" $variant="primary">
              저장
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}
