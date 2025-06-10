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
} from "./MemberDetailModal.styled";
import type { Member } from "../../pages/MemberPage";
import { formatTelNo } from "../../pages/MemberPage";

interface MemberDetailModalProps {
  onClose: () => void;
  member: Member | null;
}

const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  onClose,
  member,
}) => {
  if (!member) return null;

  return (
    <ModalOverlay>
      <ModalPanel>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalTitle>회원 상세 정보</ModalTitle>

        <Section>
          <SectionTitle>기본 정보</SectionTitle>
          <DetailItem>
            <DetailLabel>이름:</DetailLabel>
            <DetailValue>{member.name}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>회사:</DetailLabel>
            <DetailValue>{member.company}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>권한:</DetailLabel>
            <DetailValue>{member.role}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>직책:</DetailLabel>
            <DetailValue>{member.position}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>전화번호:</DetailLabel>
            <DetailValue>{formatTelNo(member.tel)}</DetailValue>
          </DetailItem>
        </Section>
      </ModalPanel>
    </ModalOverlay>
  );
};

export default MemberDetailModal; 