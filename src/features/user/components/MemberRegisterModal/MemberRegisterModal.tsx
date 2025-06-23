import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import {
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoBusinessOutline,
  IoKeyOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import * as S from "./MemberRegisterModal.styled";

// 멤버 등록 데이터 타입
interface MemberData {
  name: string;
  email: string;
  phone: string;
  company: string;
  department: string;
  position: string;
  password: string;
  confirmPassword: string;
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
    name: "",
    email: "",
    phone: "",
    company: "",
    department: "",
    position: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(formData);
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      department: "",
      position: "",
      password: "",
      confirmPassword: "",
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
            {/* 기본 정보 섹션 */}
            <S.FormSection>
              <S.SectionTitle>기본 정보</S.SectionTitle>
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

            {/* 연락처 정보 섹션 */}
            <S.FormSection>
              <S.SectionTitle>연락처 정보</S.SectionTitle>
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
                    <IoBusinessOutline />
                    회사명
                  </S.Label>
                  <S.Input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="회사명을 입력하세요"
                    required
                  />
                </S.FormGroup>
              </S.FormRow>
            </S.FormSection>

            {/* 직장 정보 섹션 */}
            <S.FormSection>
              <S.SectionTitle>직장 정보</S.SectionTitle>
              <S.FormRow>
                <S.FormGroup>
                  <S.Label>
                    <IoBusinessOutline />
                    부서
                  </S.Label>
                  <S.Input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="부서를 입력하세요"
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
            </S.FormSection>

            {/* 비밀번호 정보 섹션 */}
            <S.FormSection>
              <S.SectionTitle>비밀번호 설정</S.SectionTitle>
              <S.FormRow>
                <S.FormGroup>
                  <S.Label>
                    <IoKeyOutline />
                    비밀번호
                  </S.Label>
                  <S.PasswordContainer>
                    <S.Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="비밀번호를 입력하세요"
                      required
                    />
                    <S.PasswordToggle
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                    </S.PasswordToggle>
                  </S.PasswordContainer>
                </S.FormGroup>

                <S.FormGroup>
                  <S.Label>
                    <IoKeyOutline />
                    비밀번호 확인
                  </S.Label>
                  <S.PasswordContainer>
                    <S.Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="비밀번호를 다시 입력하세요"
                      required
                    />
                    <S.PasswordToggle
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <IoEyeOffOutline />
                      ) : (
                        <IoEyeOutline />
                      )}
                    </S.PasswordToggle>
                  </S.PasswordContainer>
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
