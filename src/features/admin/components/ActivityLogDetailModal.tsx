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
  FiRotateCcw,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { RiUserSettingsLine } from "react-icons/ri";
import { FiPackage } from "react-icons/fi";
import {
  getActivityLogDetail,
  restoreCompany,
} from "../services/activityLogService";
import { restorePost } from "@/features/project-d/services/postService";
import { formatFullDateTime } from "@/utils/dateUtils";
import type { ActivityLogDetail } from "../types/activityLog";
import { LoadingSpinner } from "../../../styles/common/LoadingSpinner.styled";
import { showSuccessToast, showErrorToast } from "@/utils/errorHandler";

interface ActivityLogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyId: string;
  onRestoreSuccess?: () => void;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
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

const ModalSubtitle = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 4px;
  padding-left: 16px;
  font-weight: 500;
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
  justify-content: space-between;
`;

const SectionTitleContent = styled.div`
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

const StatusBadge = styled.span<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 10px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
  width: 50px;
  background-color: ${({ $type }) => {
    switch ($type) {
      case "CREATED":
        return "#dcfce7";
      case "UPDATED":
        return "#dbeafe";
      case "DELETED":
        return "#fee2e2";
      case "RESTORED":
        return "#f3e8ff";
      default:
        return "#f3f4f6";
    }
  }};
  color: ${({ $type }) => {
    switch ($type) {
      case "CREATED":
        return "#166534";
      case "UPDATED":
        return "#1e40af";
      case "DELETED":
        return "#991b1b";
      case "RESTORED":
        return "#7c3aed";
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

const RestoreButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #4b5563;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
    transform: none;
  }
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

const CopyButton = styled.button<{ $copied: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: ${({ $copied }) => ($copied ? "#10b981" : "#6b7280")};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background-color: #f3f4f6;
    color: ${({ $copied }) => ($copied ? "#10b981" : "#374151")};
  }
`;

export default function ActivityLogDetailModal({
  isOpen,
  onClose,
  historyId,
  onRestoreSuccess,
}: ActivityLogDetailModalProps) {
  const [detail, setDetail] = useState<ActivityLogDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    if (isOpen && historyId) {
      fetchDetail();
      setIsRestored(false);
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

  const handleRestore = async () => {
    if (!detail) return;

    // 프로젝트는 아직 API 연동이 안 되어있으므로 토스트 메시지로 안내
    if (detail.domainType === "PROJECT") {
      showErrorToast("아직 프로젝트 복구는 연동을 못했습니다 죄송ㅎㅎ");
      return;
    }

    // 디버깅을 위해 domainId 출력
    console.log(
      "복구 시도 - domainType:",
      detail.domainType,
      "domainId:",
      detail.domainId
    );

    setRestoring(true);

    try {
      let response;

      // 도메인 타입에 따라 다른 복구 API 호출
      switch (detail.domainType) {
        case "POST":
          response = await restorePost(detail.domainId);
          break;
        case "COMPANY":
          console.log("회사 복구 API 호출 - companyId:", detail.domainId);
          response = await restoreCompany(detail.domainId);
          console.log("회사 복구 API 응답:", response);
          break;
        case "PROJECT":
          // 프로젝트는 아직 연동 안됨
          showErrorToast("아직 프로젝트 복구는 연동을 못했습니다 죄송ㅎㅎ");
          return;
        default:
          throw new Error("복구할 수 없는 도메인 타입입니다.");
      }

      if (
        response.success ||
        response.code === "P210" ||
        response.code === "COMP208"
      ) {
        const domainTypeName = getDomainTypeDisplayName(detail.domainType);
        showSuccessToast(`${domainTypeName} 복구가 완료되었습니다.`);
        setIsRestored(true);
        // 복구 성공 시 콜백 함수 호출하여 이력목록 새로고침
        onRestoreSuccess?.();
      } else {
        // 에러 메시지가 있으면 해당 메시지를 표시
        if (response.message) {
          showErrorToast(response.message);
        } else {
          showErrorToast("복구 중 오류가 발생했습니다.");
        }
      }
    } catch (err: any) {
      console.error("데이터 복구 실패:", err);
      // catch 블록에서는 네트워크 에러나 예상치 못한 에러만 처리
      // 백엔드에서 반환하는 에러 메시지는 위의 else 블록에서 처리됨
      if (!err.response) {
        showErrorToast("복구 중 오류가 발생했습니다.");
      }
    } finally {
      setRestoring(false);
    }
  };

  const handleCopyId = async () => {
    if (!detail) return;

    try {
      await navigator.clipboard.writeText(detail.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
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
      case "RESTORED":
        return <FiRotateCcw />;
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
      case "RESTORED":
        return "복구";
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
    return formatFullDateTime(dateString);
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
        // 중첩된 after 구조 처리 (after.after 형태)
        if (data.after && typeof data.after === "object" && data.after.after) {
          return data.after.after as Record<
            string,
            string | number | boolean | null
          >;
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
            <SectionTitleContent>
              <FiPlus style={{ color: "#fdb924" }} />
              생성된 데이터
            </SectionTitleContent>
          </SectionTitle>
          <DataContainer>
            <DataDisplay>
              {Object.entries(afterData)
                .filter(
                  ([key]) =>
                    !key.startsWith("_") &&
                    key !== "delete" &&
                    key !== "deletedAt" &&
                    key !== "updatedAt" &&
                    key !== "password" &&
                    key !== "confirmPassword" &&
                    key !== "oldPassword" &&
                    key !== "newPassword"
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

    // 복구 작업인 경우 after 데이터만 표시
    if (detail.historyType === "RESTORED") {
      if (!afterData || Object.keys(afterData).length === 0) {
        return null;
      }

      return (
        <ChangesSection>
          <SectionTitle>
            <SectionTitleContent>
              <FiRotateCcw style={{ color: "#fdb924" }} />
              복구된 데이터
            </SectionTitleContent>
          </SectionTitle>
          <DataContainer>
            <DataDisplay>
              {Object.entries(afterData)
                .filter(
                  ([key]) =>
                    !key.startsWith("_") &&
                    key !== "delete" &&
                    key !== "deletedAt" &&
                    key !== "updatedAt" &&
                    key !== "password" &&
                    key !== "confirmPassword" &&
                    key !== "oldPassword" &&
                    key !== "newPassword"
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

      // 복구 가능한 도메인 타입인지 확인
      const isRestorableType = ["PROJECT", "POST", "COMPANY"].includes(
        detail.domainType
      );

      return (
        <ChangesSection>
          <SectionTitle>
            <SectionTitleContent>
              <FiTrash2 style={{ color: "#fdb924" }} />
              삭제된 데이터
            </SectionTitleContent>
            {isRestorableType && (
              <RestoreButton
                onClick={handleRestore}
                disabled={restoring || isRestored}
                style={
                  isRestored
                    ? {
                        backgroundColor: "#10b981",
                        cursor: "default",
                        color: "white",
                        opacity: 0.8,
                      }
                    : {}
                }
              >
                <FiRotateCcw style={isRestored ? { opacity: 0.7 } : {}} />
                {restoring ? "복구 중..." : isRestored ? "복구됨" : "복구"}
              </RestoreButton>
            )}
          </SectionTitle>
          <DataContainer>
            <DataDisplay>
              {Object.entries(afterData)
                .filter(
                  ([key]) =>
                    !key.startsWith("_") &&
                    key !== "delete" &&
                    key !== "deletedAt" &&
                    key !== "updatedAt" &&
                    key !== "password" &&
                    key !== "confirmPassword" &&
                    key !== "oldPassword" &&
                    key !== "newPassword"
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
          key === "updatedAt" ||
          key === "password" ||
          key === "confirmPassword" ||
          key === "oldPassword" ||
          key === "newPassword"
        );
      });

      if (displayKeys.length === 0) {
        return null;
      }

      return (
        <ChangesSection>
          <SectionTitle>
            <SectionTitleContent>
              <FiEdit style={{ color: "#fdb924" }} />
              변경된 내용
            </SectionTitleContent>
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
      if (fieldName === "files" && Array.isArray(value)) {
        if (value.length === 0) {
          return "첨부파일 없음";
        }
        return `${value.length}개 파일`;
      }

      // 링크 배열 처리
      if (fieldName === "links" && Array.isArray(value)) {
        if (value.length === 0) {
          return "첨부 링크 없음";
        }
        return `${value.length}개 링크`;
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
    if (typeof value === "object" && value !== null && "fileName" in value) {
      return (value as any).fileName || "-";
    }

    // 단일 링크 객체 처리
    if (typeof value === "object" && value !== null && "url" in value) {
      return (value as any).url || "-";
    }

    // 날짜 형식 처리
    if (
      fieldName === "createdAt" ||
      fieldName === "updatedAt" ||
      fieldName === "deletedAt" ||
      fieldName === "changedAt" ||
      fieldName === "startDate" ||
      fieldName === "endDate"
    ) {
      if (typeof value === "string") {
        try {
          return formatDate(value);
        } catch {
          return value;
        }
      }
    }

    // 부모 ID 처리
    if (fieldName === "parentId") {
      if (value === null || value === undefined) {
        return "없음";
      }
      return value.toString();
    }

    // 삭제 여부 처리
    if (fieldName === "delete") {
      return value ? "삭제됨" : "활성";
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
      ROLE_USER: "사용자",
      ROLE_DEV_EMPLOYEE: "개발사 직원",
      ROLE_CLIENT_EMPLOYEE: "고객사 직원",
      ROLE_CLIENT_MANAGER: "고객사 담당자",
      ROLE_DEV_MANAGER: "개발사 담당자",
      ROLE_SYSTEM_ADMIN: "시스템 관리자",
      ROLE_TEAM_LEADER: "팀장",
    };
    return roleMap[role] || role;
  };

  // 역할에 따른 아이콘 반환
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ROLE_ADMIN":
      case "ROLE_SYSTEM_ADMIN":
        return <RiUserSettingsLine size={14} style={{ color: "#8b5cf6" }} />;
      case "ROLE_TEAM_LEADER":
        return <FiUser size={14} style={{ color: "#3b82f6" }} />;
      case "ROLE_USER":
      case "ROLE_DEV_EMPLOYEE":
      case "ROLE_CLIENT_EMPLOYEE":
      case "ROLE_CLIENT_MANAGER":
      case "ROLE_DEV_MANAGER":
      default:
        return <FiUser size={14} style={{ color: "#6b7280" }} />;
    }
  };

  // 대상 유형에 따른 아이콘 반환
  const getDomainTypeIcon = (domainType: string) => {
    switch (domainType) {
      case "USER":
        return <FiUser size={14} style={{ color: "#8b5cf6" }} />;
      case "COMPANY":
        return <FiHome size={14} style={{ color: "#8b5cf6" }} />;
      case "PROJECT":
        return <FiPackage size={14} style={{ color: "#3b82f6" }} />;
      case "STEP":
        return <FiLayers size={14} style={{ color: "#6366f1" }} />;
      case "POST":
        return <FiFileText size={14} style={{ color: "#10b981" }} />;
      case "INQUIRY":
        return <FiMessageSquare size={14} style={{ color: "#f59e0b" }} />;
      case "CHECK_LIST":
        return <FiCheckSquare size={14} style={{ color: "#ec4899" }} />;
      default:
        return <FiUser size={14} style={{ color: "#6b7280" }} />;
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ModalTitle>이력 상세 정보</ModalTitle>
            {detail && (
              <CopyButton $copied={copied} onClick={handleCopyId}>
                ID: {detail.id}
                {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
              </CopyButton>
            )}
          </div>
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
                <SectionTitleContent>
                  <FiInfo style={{ color: "#fdb924" }} />
                  작업 정보
                </SectionTitleContent>
              </SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>작업 유형</InfoLabel>
                  <StatusBadge $type={detail.historyType}>
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
                <SectionTitleContent>
                  <FiUser style={{ color: "#fdb924" }} />
                  변경자 정보
                </SectionTitleContent>
              </SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>변경자 이름</InfoLabel>
                  <InfoValue>
                    {detail.changerName} ({detail.changerUsername})
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>변경자 권한</InfoLabel>
                  <InfoValue>
                    {getRoleIcon(detail.changerRole)}
                    {getRoleDisplayName(detail.changerRole)}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>변경자 ID</InfoLabel>
                  <InfoValue>{detail.changerId}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </ContentSection>

            <ContentSection>
              <SectionTitle>
                <SectionTitleContent>
                  <FiCalendar style={{ color: "#fdb924" }} />
                  시간 정보
                </SectionTitleContent>
              </SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>변경 발생 시간</InfoLabel>
                  <InfoValue>{formatDate(detail.changedAt)}</InfoValue>
                </InfoItem>
                {detail.message && (
                  <InfoItem style={{ marginLeft: "115px" }}>
                    <InfoLabel>작업상세</InfoLabel>
                    <InfoValue
                      style={{ fontSize: "0.8rem", lineHeight: "1.4" }}
                    >
                      {detail.message}
                    </InfoValue>
                  </InfoItem>
                )}
              </InfoGrid>
            </ContentSection>

            {renderChanges()}

            {/* 수정/삭제 작업에만 복구 버튼 표시 */}
            {/* 에러 메시지는 토스트로 처리하므로 제거 */}
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}
