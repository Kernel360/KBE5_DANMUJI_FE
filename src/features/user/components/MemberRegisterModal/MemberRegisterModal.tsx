import React, { useRef, useState } from "react";
import {
  ModalOverlay,
  ModalContent,
  CloseButton,
  Title,
  Form,
  FormGroup,
  Label,
  Input,
  Select,
} from "./MemberRegisterModal.styled";
import type { MemberFormData } from "../../pages/MemberPage";

interface Props {
  onClose: () => void;
  onRegister: (data: MemberFormData) => Promise<void>;
}

export default function MemberRegisterModal({
  onClose,
  onRegister,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [role, setRole] = useState<'Manager' | 'Member'>('Member');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as { [key: string]: string };

    const requestBody: MemberFormData = {
      name: data.name,
      company: data.company,
      role: role,
      position: data.position,
      tel: data.tel,
    };

    try {
      await onRegister(requestBody);
      alert("회원 등록이 완료되었습니다!");
      onClose();
    } catch (error) {
      console.error(error);
      alert("회원 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>회원 등록</Title>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <FormGroup>
            <Label>이름</Label>
            <Input name="name" required placeholder="이름을 입력하세요" />
          </FormGroup>
          <FormGroup>
            <Label>회사</Label>
            <Input name="company" required placeholder="회사를 입력하세요" />
          </FormGroup>
          <FormGroup>
            <Label>권한</Label>
            <Select name="role" value={role} onChange={(e) => setRole(e.target.value as 'Manager' | 'Member')}>
              <option value="Manager">Manager</option>
              <option value="Member">Member</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>직책</Label>
            <Input name="position" required placeholder="직책을 입력하세요" />
          </FormGroup>
          <FormGroup>
            <Label>전화번호</Label>
            <Input name="tel" required placeholder="전화번호를 입력하세요" />
          </FormGroup>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200">
            등록
          </button>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
} 