import React, { useEffect, useState } from "react";
import api from "@/api/axios";
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
  Select,
} from "./MemberEditModal.styled";
import type { MemberFormData } from '../../pages/MemberPage';
import type { Member } from '../../pages/MemberPage';

interface Company {
  id: number;
  name: string;
}

interface Props {
  onClose: () => void;
  onEdit: (data: MemberFormData) => Promise<void>;
  initialData: Member | null;
}

export default function MemberEditModal({
  onClose,
  onEdit,
  initialData,
}: Props) {
  const [formData, setFormData] = useState<MemberFormData>({
    username: "",
    name: "",
    companyId: 0, // companyId를 0으로 초기화 (number 타입)
    role: "Member",
    position: "",
    phone: "", // tel에서 phone으로 변경
    email: "",
  });
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    if (initialData) {
      const mappedData: MemberFormData = {
        username: initialData.username,
        name: initialData.name,
        companyId: Number(initialData.companyId), // companyId를 숫자로 명시적 변환
        role: initialData.role,
        position: initialData.position,
        phone: initialData.phone,
        email: initialData.email,
      };
      setFormData(mappedData);
    }
  }, [initialData]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/api/companies'); // 모든 회사를 가져오기 위해 size를 충분히 크게 설정
        setCompanies(response.data.data.content);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
        alert('회사 목록을 불러오는 데 실패했습니다.');
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "companyId" ? Number(value) : value, // companyId인 경우 숫자로 변환
      role: name === "role" ? (value as 'Manager' | 'Member') : prev.role,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // 이미 formData.company에 companyId (문자열) 가 들어있기 때문에 검증만 하면 됩니다
    const isValidCompany = companies.some(c => c.id === formData.companyId); // 숫자 대 숫자 비교
    if (!isValidCompany && formData.companyId !== 0) { // companyId가 0이 아닐 때만 유효성 검사
      alert('선택된 회사가 유효하지 않습니다.');
      return;
    }
  
    onEdit(formData);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>회원 정보 수정</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>아이디</Label>
            <Input
              name="username"
              required
              placeholder="아이디를 입력하세요"
              value={formData.username || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>이름</Label>
            <Input
              name="name"
              required
              placeholder="이름을 입력하세요"
              value={formData.name || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>회사</Label>
            <Select
              name="companyId"
              required
              value={formData.companyId.toString() || ""}
              onChange={handleChange}
            >
              <option value="">회사 선택</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id.toString()}>
                  {company.name}
                </option>
              ))}
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>권한</Label>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Manager">Manager</option>
              <option value="Member">Member</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>직책</Label>
            <Input
              name="position"
              required
              placeholder="직책을 입력하세요"
              value={formData.position || ""}
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
            <Label>전화번호</Label>
            <Input
              name="phone"
              required
              placeholder="전화번호를 입력하세요"
              value={formData.phone || ""}
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