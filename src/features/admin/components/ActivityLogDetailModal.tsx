import { useState, useEffect } from "react";
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
  FiHome,
  FiFileText,
  FiLayers,
  FiCheckSquare,
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

const HighlightedValue = styled.span`
  font-size: 0.8rem;
  color: #111827;
  font-weight: 500;
  flex: 1;
  background-color: #fefbd0;
  padding: 2px 4px;
  border-radius: 3px;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  text-align: center;
  padding: 16px;
  font-size: 0.875rem;
`;

const ChangesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding-bottom: 12px;
  margin-top: -18px;
`;

const ChangeTitle = styled.h4`
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 4px;
`;

const ChangeColumnBox = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
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

  // ESC 키 이벤트 처리
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

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
        return "업체";
      case "PROJECT":
        return "프로젝트";
      case "PROJECT_STEP":
        return "프로젝트 단계";
      case "STEP":
        return "프로젝트 단계";
      case "POST":
        return "게시글";
      case "QUESTION":
        return "문의";
      case "INQUIRY":
        return "문의";
      case "CHAT":
        return "채팅";
      case "CHECK_LIST":
        return "체크리스트";
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

      // 모든 필드를 표시하되 시스템 필드는 제외
      const displayKeys = Array.from(allKeys).filter((key) => {
        return !(
          key.startsWith("_") ||
          key === "delete" ||
          key === "deletedAt" ||
          key === "updatedAt"
        );
      });

      if (displayKeys.length === 0) {
        return null;
      }

      return (
        <ChangesSection>
          <SectionTitle>
            <FiEdit style={{ color: "#fdb924" }} />
            변경된 내용
          </SectionTitle>
          <ChangesGrid>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <ChangeTitle>변경 전</ChangeTitle>
              <ChangeColumnBox>
                {displayKeys.map((key) => {
                  const beforeValue = beforeData[key];
                  const afterValue = afterData[key];

                  // 변경되지 않는 필드들 (수정 시에도 값이 유지되어야 하는 필드)
                  const unchangedFields = [
                    "authorName",
                    "authorRole",
                    "authorId",
                    "authorIp",
                    "createdAt",
                    "_id",
                    "projectId",
                    "projectStepId",
                  ];

                  // 변경되지 않는 필드는 실제 변경으로 감지하지 않음
                  const isChanged = unchangedFields.includes(key)
                    ? false
                    : beforeValue !== afterValue;

                  return (
                    <DataRow key={`before-${key}`}>
                      <DataLabel>{getFieldDisplayName(key)}</DataLabel>
                      {isChanged ? (
                        <HighlightedValue>
                          {beforeValue !== undefined
                            ? formatFieldValue(key, beforeValue)
                            : "-"}
                        </HighlightedValue>
                      ) : (
                        <DataValue>
                          {beforeValue !== undefined
                            ? formatFieldValue(key, beforeValue)
                            : "-"}
                        </DataValue>
                      )}
                    </DataRow>
                  );
                })}
              </ChangeColumnBox>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <ChangeTitle>변경 후</ChangeTitle>
              <ChangeColumnBox>
                {displayKeys.map((key) => {
                  const beforeValue = beforeData[key];
                  const afterValue = afterData[key];

                  // 변경되지 않는 필드들 (수정 시에도 값이 유지되어야 하는 필드)
                  const unchangedFields = [
                    "authorName",
                    "authorRole",
                    "authorId",
                    "authorIp",
                    "createdAt",
                    "_id",
                    "projectId",
                    "projectStepId",
                  ];

                  // 변경되지 않는 필드이고 afterValue가 없으면 beforeValue 사용
                  const displayValue =
                    unchangedFields.includes(key) &&
                    (afterValue === undefined ||
                      afterValue === null ||
                      afterValue === "")
                      ? beforeValue
                      : afterValue;

                  // 변경되지 않는 필드는 실제 변경으로 감지하지 않음
                  const isChanged = unchangedFields.includes(key)
                    ? false
                    : beforeValue !== afterValue;

                  return (
                    <DataRow key={`after-${key}`}>
                      <DataLabel>{getFieldDisplayName(key)}</DataLabel>
                      {isChanged ? (
                        <HighlightedValue>
                          {displayValue !== undefined
                            ? formatFieldValue(key, displayValue)
                            : "-"}
                        </HighlightedValue>
                      ) : (
                        <DataValue>
                          {displayValue !== undefined
                            ? formatFieldValue(key, displayValue)
                            : "-"}
                        </DataValue>
                      )}
                    </DataRow>
                  );
                })}
              </ChangeColumnBox>
            </div>
          </ChangesGrid>
        </ChangesSection>
      );
    }

    return null;
  };

  // 필드명을 사용자 친화적으로 변환
  const getFieldDisplayName = (fieldName: string) => {
    const fieldMap: Record<string, string> = {
      // 공통 필드
      _id: "ID",
      id: "ID",
      _class: "클래스명",
      history_created_at: "이력 생성일",
      message: "메시지",
      isDelete: "삭제여부",
      deletedAt: "삭제일",
      updatedAt: "수정일",
      createdAt: "생성일",

      // 사용자 관련 필드
      name: "이름",
      username: "사용자명",
      email: "이메일",
      tel: "전화번호",
      role: "역할",
      bio: "소개",

      // 회사 관련 필드
      companyName: "업체명",
      ceoName: "대표자명",
      bizNo: "사업자번호",
      address: "주소",

      // 게시글 관련 필드
      authorName: "작성자",
      authorRole: "작성자 역할",
      authorId: "작성자 ID",
      authorIp: "작성자 IP",
      title: "제목",
      content: "내용",
      type: "타입",
      priority: "우선순위",
      projectId: "프로젝트 ID",
      projectStepId: "프로젝트 단계 ID",
      files: "첨부파일",
      links: "첨부 링크",
      newLinks: "새로 추가된 링크",
      linkIdsToDelete: "삭제된 링크 ID",

      // 프로젝트 관련 필드
      projectName: "프로젝트명",
      description: "설명",
      startDate: "시작일",
      endDate: "종료일",
      projectStatus: "프로젝트 상태",
      progress: "진행률",

      // 프로젝트 단계 관련 필드
      stepName: "단계명",
      stepOrder: "단계 순서",
      projectStepStatus: "단계 상태",
      projectFeedbackStepStatus: "피드백 단계 상태",

      // 질문/답변 관련 필드
      question: "질문",
      answer: "답변",
      questionType: "질문 타입",

      // 채팅 관련 필드
      chatMessage: "채팅 메시지",
      chatType: "채팅 타입",
      roomId: "방 ID",

      // 기타 필드
      status: "상태",
      category: "카테고리",
      tag: "태그",
      note: "메모",
      comment: "댓글",
      attachment: "첨부파일",
      file: "파일",
      image: "이미지",
      document: "문서",
      link: "링크",
      url: "URL",
      password: "비밀번호",
      confirmPassword: "비밀번호 확인",
      oldPassword: "기존 비밀번호",
      newPassword: "새 비밀번호",
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

    // 게시글 타입 한글 변환
    if (fieldName === "type") {
      const typeMap: Record<string, string> = {
        GENERAL: "일반",
        NOTICE: "공지",
        QUESTION: "질문",
        ANSWER: "답변",
      };
      return typeMap[value as string] || value;
    }

    // 우선순위 한글 변환
    if (fieldName === "priority") {
      const priorityMap: Record<string, string> = {
        LOW: "낮음",
        MEDIUM: "보통",
        HIGH: "높음",
        URGENT: "긴급",
      };
      return priorityMap[value as string] || value;
    }

    // 작성자 역할 한글 변환
    if (fieldName === "authorRole") {
      const roleMap: Record<string, string> = {
        ROLE_ADMIN: "관리자",
        ROLE_DEV_EMPLOYEE: "개발사 직원",
        ROLE_CLIENT_EMPLOYEE: "고객사 직원",
        ROLE_CLIENT_MANAGER: "고객사 담당자",
        ROLE_DEV_MANAGER: "개발사 담당자",
        ADMIN: "관리자",
        DEV_EMPLOYEE: "개발사 직원",
        CLIENT_EMPLOYEE: "고객사 직원",
        CLIENT_MANAGER: "고객사 담당자",
        DEV_MANAGER: "개발사 담당자",
      };
      return roleMap[value as string] || value;
    }

    // 역할 한글 변환 (일반적인 role 필드)
    if (fieldName === "role") {
      const roleMap: Record<string, string> = {
        ROLE_ADMIN: "관리자",
        ROLE_DEV_EMPLOYEE: "개발사 직원",
        ROLE_CLIENT_EMPLOYEE: "고객사 직원",
        ROLE_CLIENT_MANAGER: "고객사 담당자",
        ROLE_DEV_MANAGER: "개발사 담당자",
        ADMIN: "관리자",
        DEV_EMPLOYEE: "개발사 직원",
        CLIENT_EMPLOYEE: "고객사 직원",
        CLIENT_MANAGER: "고객사 담당자",
        DEV_MANAGER: "개발사 담당자",
      };
      return roleMap[value as string] || value;
    }

    // 프로젝트 상태 한글 변환
    if (fieldName === "projectStatus") {
      const statusMap: Record<string, string> = {
        IN_PROGRESS: "진행중",
        COMPLETED: "완료",
        DELAY: "지연",
        DUE_SOON: "마감임박",
        NOT_STARTED: "시작전",
        ON_HOLD: "보류",
      };
      return statusMap[value as string] || value;
    }

    // 프로젝트 단계 상태 한글 변환
    if (fieldName === "projectStepStatus") {
      const statusMap: Record<string, string> = {
        IN_PROGRESS: "진행중",
        COMPLETED: "완료",
        NOT_STARTED: "시작전",
        ON_HOLD: "보류",
        REVIEW: "검토중",
        APPROVED: "승인됨",
        REJECTED: "거부됨",
      };
      return statusMap[value as string] || value;
    }

    // 일반 상태 한글 변환
    if (fieldName === "status") {
      const statusMap: Record<string, string> = {
        ACTIVE: "활성",
        INACTIVE: "비활성",
        PENDING: "대기중",
        APPROVED: "승인됨",
        REJECTED: "거부됨",
        SUSPENDED: "정지됨",
        DELETED: "삭제됨",
      };
      return statusMap[value as string] || value;
    }

    // 파일 객체 처리 (fileName 추출)
    if (typeof value === "object" && value !== null) {
      // 파일 배열 처리
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return "-";
        }

        // 링크 배열 처리
        if (fieldName === "links" || fieldName === "newLinks") {
          if (value.length === 0) return "-";

          // 링크 객체 배열인 경우 (기존 링크)
          if (value[0] && typeof value[0] === "object" && "url" in value[0]) {
            return value.map((link: any) => link.url).join(", ");
          }

          // 문자열 배열인 경우 (새 링크)
          if (typeof value[0] === "string") {
            return value.join(", ");
          }

          return value.join(", ");
        }

        // 링크 ID 배열 처리 (삭제된 링크)
        if (fieldName === "linkIdsToDelete") {
          if (value.length === 0) return "-";
          return value.join(", ");
        }

        // 배열의 첫 번째 파일 객체에서 fileName 추출
        const firstFile = value[0];
        if (
          firstFile &&
          typeof firstFile === "object" &&
          "fileName" in firstFile
        ) {
          return firstFile.fileName || "-";
        }
        return "-";
      }

      // 단일 파일 객체 처리
      if ("fileName" in value) {
        return (value as any).fileName || "-";
      }

      // 단일 링크 객체 처리
      if ("url" in value) {
        return (value as any).url || "-";
      }

      // 다른 객체 타입의 경우 JSON 문자열로 변환하지 않고 "-" 반환
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
      case "INQUIRY":
        return <FiMessageSquare size={14} style={{ color: "#06b6d4" }} />;
      case "CHECK_LIST":
        return <FiCheckSquare size={14} style={{ color: "#ec4899" }} />;
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
              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ flex: "1" }}>
                  <SectionTitle>
                    <FiCalendar style={{ color: "#fdb924" }} />
                    시간 정보
                  </SectionTitle>
                  <InfoGrid>
                    <InfoItem>
                      <InfoLabel>변경 발생 시간</InfoLabel>
                      <InfoValue>{formatDate(detail.changedAt)}</InfoValue>
                    </InfoItem>
                  </InfoGrid>
                </div>

                {detail.message && (
                  <div style={{ flex: "1" }}>
                    <SectionTitle>
                      <FiMessageSquare style={{ color: "#fdb924" }} />
                      작업상세
                    </SectionTitle>
                    <div style={{ padding: "8px 0" }}>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          color: "#111827",
                          lineHeight: "1.5",
                        }}
                      >
                        {detail.message}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </ContentSection>

            {renderChanges()}
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}
