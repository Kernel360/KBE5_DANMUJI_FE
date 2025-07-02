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
import CompanyRegisterModal from "@/features/company/components/CompanyRegisterModal";

export interface MemberData {
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
  initialCompanyId?: number;
}

const MemberRegisterModal: React.FC<MemberRegisterModalProps> = ({
  onClose,
  onRegister,
  initialCompanyId,
}) => {
  const [formData, setFormData] = useState<{
    username: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    companyId: number | "";
  }>({
    username: "",
    name: "",
    email: "",
    phone: "",
    position: "",
    companyId: initialCompanyId || "",
  });

  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/api/companies/all");
      setCompanies(res.data.data);
    } catch (error) {
      console.error("업체 목록을 불러오는 데 실패했습니다", error);
      setCompanies([]);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "companyId" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 아이디 유효성 검사: 영문자, 숫자, 밑줄(_), 4~20자
    const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
    if (!usernameRegex.test(formData.username)) {
      alert("아이디는 영문자, 숫자, 밑줄(_)만 사용하며 4~20자여야 합니다.");
      return;
    }

    // 전화번호 유효성 검사: 010-0000-0000
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("전화번호는 010-0000-0000 형식으로 입력해야 합니다.");
      return;
    }

    // 전화번호 숫자만 필터링 (서버 전송용)
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
    <S.ModalOverlay>
      <S.ModalContent>
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

              {/* 업체 + 직책 */}
              <S.FormRow>
                <S.FormGroup>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <S.Label style={{ marginBottom: 0 }}>
                      <IoBusinessOutline />
                      업체
                    </S.Label>
                    <button
                      type="button"
                      style={{
                        fontSize: 11,
                        background: "#fbbf24",
                        color: "#fff",
                        border: "none",
                        borderRadius: 5,
                        padding: "2px 8px",
                        cursor: "pointer",
                        height: 22,
                        lineHeight: 1,
                      }}
                      onClick={() => setCompanyModalOpen(true)}
                    >
                      업체 등록
                    </button>
                  </div>
                  <Select
                    options={companies.map((company) => ({
                      value: company.id,
                      label: company.name,
                    }))}
                    isClearable
                    isSearchable
                    placeholder="업체 선택"
                    value={
                      companies && formData.companyId !== ""
                        ? companies
                            .map((company) => ({
                              value: company.id,
                              label: company.name,
                            }))
                            .find(
                              (option) =>
                                option.value === formData.companyId
                            ) || null
                        : null
                    }
                    onChange={(selected) => {
                      setFormData((prev) => ({
                        ...prev,
                        companyId: selected ? selected.value : "",
                      }));
                    }}
                    styles={{
                      menu: (base) => ({
                        ...base,
                        maxHeight: 220,
                        minWidth: '100%',
                        width: '100%',
                        zIndex: 9999,
                      }),
                      option: (base, state) => ({
                        ...base,
                        minHeight: 40,
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: state.isSelected
                          ? '#fdb924'
                          : state.isFocused
                          ? '#fef3c7'
                          : '#fff',
                        color: state.isSelected ? '#fff' : '#222',
                        fontWeight: state.isSelected ? 700 : 500,
                        cursor: 'pointer',
                      }),
                      control: (base) => ({
                        ...base,
                        minHeight: 40,
                        borderRadius: 8,
                        borderColor: '#e5e7eb',
                        boxShadow: 'none',
                        '&:hover': { borderColor: '#fdb924' },
                      }),
                      menuList: (base) => ({
                        ...base,
                        maxHeight: 220,
                        paddingTop: 0,
                        paddingBottom: 0,
                      }),
                    }}
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
        {companyModalOpen && (
          <CompanyRegisterModal
            open={companyModalOpen}
            onClose={() => setCompanyModalOpen(false)}
            onRegisterSuccess={() => {
              setCompanyModalOpen(false);
              fetchCompanies();
            }}
          />
        )}
      </S.ModalContent>
    </S.ModalOverlay>
  );
};

export default MemberRegisterModal;
