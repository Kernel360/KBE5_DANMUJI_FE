import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FiX,
  FiUser,
  FiCalendar,
  FiEdit,
  FiTrash,
  FiPlus,
  FiInfo,
  FiMessageSquare,
  FiTrash2,
  FiShield,
  FiUsers,
  FiHome,
  FiFileText,
  FiLayers,
} from "react-icons/fi";
import { RiUserSettingsLine } from "react-icons/ri";
import { FaProjectDiagram } from "react-icons/fa";
import { getActivityLogDetail } from "../services/activityLogService";
import type { ActivityLogDetail } from "../types/activityLog";
import { LoadingSpinner } from "../../../styles/common/LoadingSpinner.styled";

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
  padding: 20px;
  width: 90%;
  max-width: 700px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  padding-left: 16px;
  position: relative;
  color: #111827;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 1.2rem;
    background: #fdb924;
    border-radius: 1.5px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
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
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const InfoLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  color: #111827;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StatusBadge = styled.span<{ type: string }>`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 10px;
  border-radius: 16px;
  font-size: 0.75rem;
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
  margin-top: 12px;
`;

const DataContainer = styled.div`
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
`;

const DataDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const DataRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
`;

const DataLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  min-width: 80px;
  flex-shrink: 0;
`;

const DataValue = styled.span`
  font-size: 0.8rem;
  color: #111827;
  font-weight: 500;
  flex: 1;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  text-align: center;
  padding: 16px;
  font-size: 0.875rem;
`;

const MessageSection = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  padding: 12px;
  margin-top: 12px;
`;

const MessageText = styled.p`
  margin: 0;
  color: #0c4a6e;
  font-size: 0.8rem;
  line-height: 1.4;
`;

const ChangesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const ChangeColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ChangeTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
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
    if (!detail) {
      return null;
    }

    // MongoDB 데이터 구조에 맞게 before/after 데이터 추출
    const getActualData = (
      data: Record<string, string | number | boolean | null> | null
    ) => {
      if (typeof data === "object" && data !== null) {
        // before/after가 객체이고 실제 데이터가 그 안에 있는 경우
        if (data.before && typeof data.before === "object") {
          return data.before as Record<
            string,
            string | number | boolean | null
          >;
        }
        if (data.after && typeof data.after === "object") {
          return data.after as Record<string, string | number | boolean | null>;
        }
        // 직접 데이터가 있는 경우
        return data;
      }
      return data;
    };

    const beforeData = getActualData(detail.before);
    const afterData = getActualData(detail.after);

    // 생성 작업인 경우 after 데이터만 표시
    if (detail.historyType === "CREATED") {
      if (!afterData || Object.keys(afterData).length === 0) {
        return null;
      }

      return (
        <ChangesSection>
          <SectionTitle>
            <FiPlus style={{ color: "#fdb924" }} />
            생성된 데이터
          </SectionTitle>
          <DataContainer>
            <DataDisplay>
              {Object.entries(afterData)
                .filter(
                  ([key]) =>
                    !key.startsWith("_") &&
                    key !== "delete" &&
                    key !== "deletedAt" &&
                    key !== "updatedAt"
                )
                .map(([key, value]) => (
                  <DataRow key={key}>
                    <DataLabel>{getFieldDisplayName(key)}</DataLabel>
                    <DataValue>{formatFieldValue(key, value)}</DataValue>
                  </DataRow>
                ))}
            </DataDisplay>
          </DataContainer>
        </ChangesSection>
      );
    }

    // 삭제 작업인 경우 after 데이터만 표시 (before 텍스트로 표시)
    if (detail.historyType === "DELETED") {
      if (!afterData || Object.keys(afterData).length === 0) {
        return null;
      }

      return (
        <ChangesSection>
          <SectionTitle>
            <FiTrash2 style={{ color: "#fdb924" }} />
            삭제된 데이터
          </SectionTitle>
          <DataContainer>
            <DataDisplay>
              {Object.entries(afterData)
                .filter(
                  ([key]) =>
                    !key.startsWith("_") &&
                    key !== "delete" &&
                    key !== "deletedAt" &&
                    key !== "updatedAt"
                )
                .map(([key, value]) => (
                  <DataRow key={key}>
                    <DataLabel>{getFieldDisplayName(key)}</DataLabel>
                    <DataValue>{formatFieldValue(key, value)}</DataValue>
                  </DataRow>
                ))}
            </DataDisplay>
          </DataContainer>
        </ChangesSection>
      );
    }

    // 수정 작업인 경우 before/after 비교 표시
    if (detail.historyType === "UPDATED") {
      if (!beforeData || !afterData) {
        return null;
      }

      const allKeys = new Set([
        ...Object.keys(beforeData),
        ...Object.keys(afterData),
      ]);

      // 변경된 필드만 필터링 (시스템 필드 제외)
      const changedKeys = Array.from(allKeys).filter((key) => {
        if (
          key.startsWith("_") ||
          key === "delete" ||
          key === "deletedAt" ||
          key === "updatedAt"
        ) {
          return false;
        }
        const beforeValue = beforeData[key];
        const afterValue = afterData[key];
        return beforeValue !== afterValue;
      });

      if (changedKeys.length === 0) {
        return null;
      }

      return (
        <ChangesSection>
          <SectionTitle>
            <FiEdit style={{ color: "#fdb924" }} />
            변경된 내용
          </SectionTitle>
          <DataContainer>
            <ChangesGrid>
              <ChangeColumn>
                <ChangeTitle>변경 전</ChangeTitle>
                {changedKeys.map((key) => (
                  <DataRow key={`before-${key}`}>
                    <DataLabel>{getFieldDisplayName(key)}</DataLabel>
                    <DataValue>
                      {beforeData[key] !== undefined
                        ? formatFieldValue(key, beforeData[key])
                        : "-"}
                    </DataValue>
                  </DataRow>
                ))}
              </ChangeColumn>
              <ChangeColumn>
                <ChangeTitle>변경 후</ChangeTitle>
                {changedKeys.map((key) => (
                  <DataRow key={`after-${key}`}>
                    <DataLabel>{getFieldDisplayName(key)}</DataLabel>
                    <DataValue>
                      {afterData[key] !== undefined
                        ? formatFieldValue(key, afterData[key])
                        : "-"}
                    </DataValue>
                  </DataRow>
                ))}
              </ChangeColumn>
            </ChangesGrid>
          </DataContainer>
        </ChangesSection>
      );
    }

    return null;
  };

  // 필드명을 사용자 친화적으로 변환
  const getFieldDisplayName = (fieldName: string) => {
    const fieldMap: Record<string, string> = {
      _id: "ID",
      id: "ID",
      name: "이름",
      ceoName: "대표자명",
      bio: "소개",
      bizNo: "사업자번호",
      address: "주소",
      email: "이메일",
      tel: "전화번호",
      createdAt: "생성일",
      isDelete: "삭제여부",
      _class: "클래스명",
      history_created_at: "이력 생성일",
      message: "메시지",
      // 다른 도메인 타입에 대한 필드들도 추가 가능
    };

    return fieldMap[fieldName] || fieldName;
  };

  // 필드값을 적절한 형식으로 변환
  const formatFieldValue = (
    fieldName: string,
    value: string | number | boolean | null
  ) => {
    if (value === null || value === undefined) {
      return "-";
    }

    // 문자열 "empty" 처리
    if (value === "empty") {
      return "-";
    }

    // 날짜 필드 처리
    if (
      fieldName.includes("createdAt") ||
      fieldName.includes("changedAt") ||
      fieldName.includes("updatedAt") ||
      fieldName.includes("deletedAt")
    ) {
      try {
        const date = new Date(value as string);
        return date.toLocaleString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      } catch {
        return String(value);
      }
    }

    // 불린 값 처리
    if (typeof value === "boolean") {
      return value ? "예" : "아니오";
    }

    // 숫자 필드 처리 (사업자번호 등)
    if (typeof value === "number") {
      return value.toLocaleString();
    }

    // 문자열 그대로 반환
    return String(value);
  };

  // 역할을 한글로 변환하는 함수
  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      ROLE_ADMIN: "관리자",
      ROLE_DEV_EMPLOYEE: "개발사 직원",
      ROLE_CLIENT_EMPLOYEE: "고객사 직원",
      ROLE_CLIENT_MANAGER: "고객사 담당자",
      ROLE_DEV_MANAGER: "개발사 담당자",
    };
    return roleMap[role] || role;
  };

  // 역할에 따른 아이콘 반환
  const getRoleIcon = (role: string) => {
    if (role === "ROLE_ADMIN") {
      return <RiUserSettingsLine size={14} style={{ color: "#8b5cf6" }} />;
    } else {
      return <FiUser size={14} style={{ color: "#6b7280" }} />;
    }
  };

  // 대상 유형에 따른 아이콘 반환
  const getDomainTypeIcon = (domainType: string) => {
    switch (domainType) {
      case "USER":
        return <FiUser size={14} style={{ color: "#8b5cf6" }} />;
      case "COMPANY":
        return <FiHome size={14} style={{ color: "#f59e0b" }} />;
      case "PROJECT":
        return <FaProjectDiagram size={14} style={{ color: "#3b82f6" }} />;
      case "STEP":
        return <FiLayers size={14} style={{ color: "#6366f1" }} />;
      case "POST":
        return <FiFileText size={14} style={{ color: "#10b981" }} />;
      default:
        return <FiUser size={14} style={{ color: "#6b7280" }} />;
    }
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
              <SectionTitle>
                <FiInfo style={{ color: "#fdb924" }} />
                기본 정보
              </SectionTitle>
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
                    {getDomainTypeIcon(detail.domainType)}
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
                <FiUser style={{ color: "#fdb924" }} />
                변경자 정보
              </SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>변경자 ID</InfoLabel>
                  <InfoValue>{detail.changerId}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>변경자 이름</InfoLabel>
                  <InfoValue>
                    {detail.changerName} ({detail.changerUsername})
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>변경자 역할</InfoLabel>
                  <InfoValue>
                    {getRoleIcon(detail.changerRole)}
                    {getRoleDisplayName(detail.changerRole)}
                  </InfoValue>
                </InfoItem>
              </InfoGrid>
            </ContentSection>

            <ContentSection>
              <SectionTitle>
                <FiCalendar style={{ color: "#fdb924" }} />
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
                <SectionTitle>
                  <FiMessageSquare style={{ color: "#fdb924" }} />
                  메시지
                </SectionTitle>
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
