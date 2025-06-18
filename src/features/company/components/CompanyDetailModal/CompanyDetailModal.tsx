import React from "react";
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
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalTitle>회사 상세 정보</ModalTitle>

        <Section>
          <SectionTitle>기본 정보</SectionTitle>
          <DetailItem>
            <DetailLabel>회사명:</DetailLabel>
            <DetailValue>{company.name}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>사업자등록번호:</DetailLabel>
            <DetailValue>{formatBizNo(company.bizNo.toString())}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>주소:</DetailLabel>
            <DetailValue>{company.address}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>사업자 명:</DetailLabel>
            <DetailValue>{company.ceoName}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>이메일:</DetailLabel>
            <DetailValue>{company.email}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>연락처:</DetailLabel>
            <DetailValue>{company.tel}</DetailValue>
          </DetailItem>
        </Section>

        <Section>
          <SectionTitle>회사 소개</SectionTitle>
          <DetailItem>
            <DetailValue>{company.bio || "N/A"}</DetailValue>
          </DetailItem>
        </Section>
      </ModalPanel>
    </ModalOverlay>
  );
};

export default CompanyDetailModal;
