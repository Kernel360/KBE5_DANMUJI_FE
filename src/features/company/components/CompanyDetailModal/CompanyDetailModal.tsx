import React from "react";
import {
  FiX,
  FiHome,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHash,
  FiFileText,
} from "react-icons/fi";
import {
  ModalOverlay,
  ModalPanel,
  CloseButton,
  ModalTitle,
  Section,
  SectionTitle,
  DetailItem,
  DetailLabel,
  DetailValue,
  DetailIcon,
} from "./CompanyDetailModal.styled";
import type { Company } from "../../pages/CompanyPage";
import { formatBizNo } from "../../pages/CompanyPage";
import MemberRegisterModal from "@/features/user/components/MemberRegisterModal/MemberRegisterModal";
import { useState } from "react";

interface CompanyDetailModalProps {
  open: boolean;
  onClose: () => void;
  company: Company | null;
}

const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  open,
  onClose,
  company,
}) => {
  const [registerOpen, setRegisterOpen] = useState(false);
  const dummyMembers = [
    { id: 1, name: "홍길동", position: "팀장" },
    { id: 2, name: "김철수", position: "매니저" },
    { id: 3, name: "이영희", position: "사원" },
  ];

  if (!open || !company) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalPanel onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FiX size={20} />
        </CloseButton>
        <ModalTitle>{company.name}</ModalTitle>

        <Section>
          <SectionTitle>
            <FiHome size={16} />
            정보
          </SectionTitle>
          <DetailItem>
            <DetailIcon>
              <FiHash size={14} />
            </DetailIcon>
            <DetailLabel>사업자등록번호:</DetailLabel>
            <DetailValue>{formatBizNo(company.bizNo.toString())}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailIcon>
              <FiUser size={14} />
            </DetailIcon>
            <DetailLabel>대표자명:</DetailLabel>
            <DetailValue>{company.ceoName}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailIcon>
              <FiMapPin size={14} />
            </DetailIcon>
            <DetailLabel>주소:</DetailLabel>
            <DetailValue>{company.address}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailIcon>
              <FiMail size={14} />
            </DetailIcon>
            <DetailLabel>이메일:</DetailLabel>
            <DetailValue>{company.email}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailIcon>
              <FiPhone size={14} style={{ color: "#10b981" }} />
            </DetailIcon>
            <DetailLabel>연락처:</DetailLabel>
            <DetailValue>{company.tel}</DetailValue>
          </DetailItem>
        </Section>

        <Section>
          <SectionTitle>
            <FiFileText size={16} />
            업체 소개
          </SectionTitle>
          <DetailItem>
            <DetailValue>{company.bio || "N/A"}</DetailValue>
          </DetailItem>
        </Section>

        <Section>
          <SectionTitle>
            <FiUser size={16} />
            회사 구성원
            <button
              style={{
                marginLeft: "auto",
                fontSize: 13,
                background: "#fbbf24",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "4px 12px",
                cursor: "pointer",
              }}
              onClick={() => setRegisterOpen(true)}
              type="button"
            >
              회원 등록
            </button>
          </SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {dummyMembers.map((member) => (
              <div key={member.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 0" }}>
                <span style={{ fontWeight: 500, color: "#1f2937" }}>{member.name}</span>
                <span style={{ fontSize: 12, color: "#6b7280", background: "#f3f4f6", borderRadius: 12, padding: "2px 8px" }}>{member.position}</span>
              </div>
            ))}
          </div>
        </Section>

        {registerOpen && (
          <MemberRegisterModal
            onClose={() => setRegisterOpen(false)}
            onRegister={() => setRegisterOpen(false)}
          />
        )}
      </ModalPanel>
    </ModalOverlay>
  );
};

export default CompanyDetailModal;
