import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FiX,
  FiUser,
  FiCalendar,
  FiEdit,
  FiTrash,
  FiPlus,
} from "react-icons/fi";
import { getActivityLogDetail } from "../services/activityLogService";
import type { ActivityLogDetail } from "../types/activityLog";

interface ActivityLogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyId: string;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s;

  &:hover {
    color: #374151;
  }
`;

const ContentSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: #111827;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ type: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ type }) => {
    switch (type) {
      case "CREATED":
        return "#dcfce7";
      case "UPDATED":
        return "#dbeafe";
      case "DELETED":
        return "#fee2e2";
      default:
        return "#f3f4f6";
    }
  }};
  color: ${({ type }) => {
    switch (type) {
      case "CREATED":
        return "#166534";
      case "UPDATED":
        return "#1e40af";
      case "DELETED":
        return "#991b1b";
      default:
        return "#374151";
    }
  }};
`;

const ChangesSection = styled.div`
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
`;

const ChangesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const ChangeColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ChangeTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  padding: 8px 12px;
  background: ${({ children }) =>
    children === "변경 전" ? "#fee2e2" : "#dcfce7"};
  color: ${({ children }) => (children === "변경 전" ? "#991b1b" : "#166534")};
  border-radius: 6px;
  text-align: center;
`;

const ChangeItem = styled.div`
  background: white;
  border-radius: 6px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
`;

const ChangeKey = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  display: block;
  margin-bottom: 2px;
`;

const ChangeValue = styled.span`
  font-size: 0.875rem;
  color: #111827;
  word-break: break-word;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: #6b7280;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  text-align: center;
  padding: 20px;
`;

const MessageSection = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
`;

const MessageText = styled.p`
  margin: 0;
  color: #0c4a6e;
  font-size: 0.875rem;
  line-height: 1.5;
`;

export default function ActivityLogDetailModal({
  isOpen,
  onClose,
  historyId,
}: ActivityLogDetailModalProps) {
  const [detail, setDetail] = useState<ActivityLogDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && historyId) {
      fetchDetail();
    }
  }, [isOpen, historyId]);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getActivityLogDetail(historyId);
      setDetail(data);
    } catch (err) {
      console.error("이력 상세 조회 실패:", err);
      setError("이력 상세 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (historyType: string) => {
    switch (historyType) {
      case "CREATED":
        return <FiPlus />;
      case "UPDATED":
        return <FiEdit />;
      case "DELETED":
        return <FiTrash />;
      default:
        return <FiEdit />;
    }
  };

  const getActionDisplayName = (historyType: string) => {
    switch (historyType) {
      case "CREATED":
        return "생성";
      case "UPDATED":
        return "수정";
      case "DELETED":
        return "삭제";
      default:
        return historyType;
    }
  };

  const getDomainTypeDisplayName = (domainType: string) => {
    switch (domainType) {
      case "USER":
        return "회원";
      case "COMPANY":
        return "회사";
      case "PROJECT":
        return "프로젝트";
      case "PROJECT_STEP":
        return "프로젝트 단계";
      case "POST":
        return "게시글";
      case "QUESTION":
        return "질문";
      case "CHAT":
        return "채팅";
      default:
        return domainType;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const renderChanges = () => {
    if (!detail || !detail.before || !detail.after) {
      return null;
    }

    const allKeys = new Set([
      ...Object.keys(detail.before),
      ...Object.keys(detail.after),
    ]);

    return (
      <ChangesSection>
        <SectionTitle>변경 내용</SectionTitle>
        <ChangesGrid>
          <ChangeColumn>
            <ChangeTitle>변경 전</ChangeTitle>
            {Array.from(allKeys).map((key) => (
              <ChangeItem key={`before-${key}`}>
                <ChangeKey>{key}</ChangeKey>
                <ChangeValue>
                  {detail.before[key] !== undefined
                    ? String(detail.before[key])
                    : "-"}
                </ChangeValue>
              </ChangeItem>
            ))}
          </ChangeColumn>
          <ChangeColumn>
            <ChangeTitle>변경 후</ChangeTitle>
            {Array.from(allKeys).map((key) => (
              <ChangeItem key={`after-${key}`}>
                <ChangeKey>{key}</ChangeKey>
                <ChangeValue>
                  {detail.after[key] !== undefined
                    ? String(detail.after[key])
                    : "-"}
                </ChangeValue>
              </ChangeItem>
            ))}
          </ChangeColumn>
        </ChangesGrid>
      </ChangesSection>
    );
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>이력 상세 정보</ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        {loading && <LoadingSpinner>로딩 중...</LoadingSpinner>}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {detail && (
          <>
            <ContentSection>
              <SectionTitle>기본 정보</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>이력 ID</InfoLabel>
                  <InfoValue>{detail.id}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>작업 유형</InfoLabel>
                  <StatusBadge type={detail.historyType}>
                    {getActionIcon(detail.historyType)}
                    {getActionDisplayName(detail.historyType)}
                  </StatusBadge>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>대상 유형</InfoLabel>
                  <InfoValue>
                    {getDomainTypeDisplayName(detail.domainType)}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>대상 ID</InfoLabel>
                  <InfoValue>{detail.domainId}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </ContentSection>

            <ContentSection>
              <SectionTitle>
                <FiUser />
                작업자 정보
              </SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>작업자 ID</InfoLabel>
                  <InfoValue>{detail.changerId}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>작업자 이름</InfoLabel>
                  <InfoValue>{detail.changerName}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>작업자 역할</InfoLabel>
                  <InfoValue>{detail.changerRole}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </ContentSection>

            <ContentSection>
              <SectionTitle>
                <FiCalendar />
                시간 정보
              </SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>변경 시간</InfoLabel>
                  <InfoValue>{formatDate(detail.changedAt)}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>생성 시간</InfoLabel>
                  <InfoValue>{formatDate(detail.createdAt)}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </ContentSection>

            {detail.message && (
              <ContentSection>
                <SectionTitle>메시지</SectionTitle>
                <MessageSection>
                  <MessageText>{detail.message}</MessageText>
                </MessageSection>
              </ContentSection>
            )}

            {renderChanges()}
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}
