import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { IoMdClose } from "react-icons/io";
import {
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoBusinessOutline,
} from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import * as S from "./MemberRegisterModal.styled";
import Select from "react-select";

interface MemberData {
  username: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  companyId?: number;
}

interface Company {
  id: number;
  name: string;
}

interface MemberRegisterModalProps {
  onClose: () => void;
  onRegister: (memberData: MemberData) => void;
}

const MemberRegisterModal: React.FC<MemberRegisterModalProps> = ({
  onClose,
  onRegister,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    position: "",
    companyId: "",
  });

  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("/api/companies");
        setCompanies(res.data.data.content); // 응답 구조에 따라 조정
      } catch (error) {
        console.error("회사 목록을 불러오는 데 실패했습니다", error);
      }
    };
    fetchCompanies();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "companyId" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 전화번호 숫자만 필터링
    const cleanedPhone = formData.phone.replace(/\D/g, "");

    onRegister({
      username: formData.username,
      name: formData.name,
      email: formData.email,
      phone: cleanedPhone,
      position: formData.position,
      companyId:
        formData.companyId === "" ? undefined : Number(formData.companyId),
    });
  };

  const handleClose = () => {
    setFormData({
      username: "",
      name: "",
      email: "",
      phone: "",
      position: "",
      companyId: "",
    });
    onClose();
  };

  return (
    <S.ModalOverlay onClick={handleClose}>
      <S.ModalContent onClick={(e) => e.stopPropagation()}>
        <S.ModalHeader>
          <S.ModalTitle>
            <FaUserPlus />
            회원 등록
          </S.ModalTitle>
          <S.CloseButton onClick={handleClose}>
            <IoMdClose />
          </S.CloseButton>
        </S.ModalHeader>

        <S.ModalBody>
          <S.Form onSubmit={handleSubmit}>
            <S.FormSection>
              <S.SectionTitle>회원 정보</S.SectionTitle>

              {/* 아이디 (절반, 오른쪽 비움) */}
              <S.FormRow>
                <S.FormGroup>
                  <S.Label>
                    <IoPersonOutline />
                    아이디
                  </S.Label>
                  <S.Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="아이디를 입력하세요"
                    required
                  />
                </S.FormGroup>
                <S.FormGroup />
              </S.FormRow>

              {/* 회사 + 직책 */}
              <S.FormRow>
                <S.FormGroup>
                  <S.Label>
                    <IoBusinessOutline />
                    업체
                  </S.Label>
                  <Select
                    options={companies.map((company) => ({
                      value: company.id,
                      label: company.name,
                    }))}
                    isClearable
                    isSearchable
                    placeholder="업체 선택"
                    value={
                      companies && formData.companyId
                        ? companies
                            .map((company) => ({
                              value: company.id,
                              label: company.name,
                            }))
                            .find(
                              (option) =>
                                option.value === Number(formData.companyId)
                            ) || null
                        : null
                    }
                    onChange={(selected) => {
                      setFormData((prev) => ({
                        ...prev,
                        companyId: selected ? String(selected.value) : "",
                      }));
                    }}
                    styles={{ menu: (base) => ({ ...base, maxHeight: 200 }) }}
                  />
                </S.FormGroup>
                <S.FormGroup>
                  <S.Label>
                    <IoPersonOutline />
                    직책
                  </S.Label>
                  <S.Input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="직책을 입력하세요"
                  />
                </S.FormGroup>
              </S.FormRow>

              {/* 이름 (절반, 오른쪽 비움) */}
              <S.FormRow>
                <S.FormGroup>
                  <S.Label>
                    <IoPersonOutline />
                    이름
                  </S.Label>
                  <S.Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="이름을 입력하세요"
                    required
                  />
                </S.FormGroup>
                <S.FormGroup />
              </S.FormRow>

              {/* 전화번호 + 이메일 */}
              <S.FormRow>
                <S.FormGroup>
                  <S.Label>
                    <IoCallOutline />
                    전화번호
                  </S.Label>
                  <S.Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="전화번호를 입력하세요"
                    required
                  />
                </S.FormGroup>
                <S.FormGroup>
                  <S.Label>
                    <IoMailOutline />
                    이메일
                  </S.Label>
                  <S.Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="이메일을 입력하세요"
                    required
                  />
                </S.FormGroup>
              </S.FormRow>
            </S.FormSection>

            <S.ButtonGroup>
              <S.CancelButton type="button" onClick={handleClose}>
                취소
              </S.CancelButton>
              <S.SubmitButton type="submit">
                <FaUserPlus />
                등록
              </S.SubmitButton>
            </S.ButtonGroup>
          </S.Form>
        </S.ModalBody>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};

export default MemberRegisterModal;
