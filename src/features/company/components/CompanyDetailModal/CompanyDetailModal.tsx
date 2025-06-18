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
  if (!open || !company) return null;

  return (
    <ModalOverlay>
      <ModalPanel>
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
              <FiPhone size={14} />
            </DetailIcon>
            <DetailLabel>연락처:</DetailLabel>
            <DetailValue>{company.tel}</DetailValue>
          </DetailItem>
        </Section>

        <Section>
          <SectionTitle>
            <FiFileText size={16} />
            회사 소개
          </SectionTitle>
          <DetailItem>
            <DetailValue>{company.bio || "N/A"}</DetailValue>
          </DetailItem>
        </Section>
      </ModalPanel>
    </ModalOverlay>
  );
};

export default CompanyDetailModal;
