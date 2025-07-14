import React, { useState } from "react";
import api from "@/api/axios";
import { useAuth } from "@/hooks/useAuth";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  InfoSection,
  InfoRow,
  InfoLabel,
  InfoValue,
  ApprovalsSection,
  ApprovalCardList,
  ApprovalCard,
  ApprovalCardHeader,
  ApprovalName,
  ApprovalStatusBadge,
  ApprovalCardBody,
  ApprovalMessage,
  ApprovalDate,
  ApprovalActions,
  ApprovalTextarea,
  ApprovalButton,
  ApprovalButtonSecondary,
} from "./ChecklistDetailModal.styled";
import { showErrorToast, showSuccessToast } from "@/utils/errorHandler";
import {
  FiFileText,
  FiAlignLeft,
  FiUser,
  FiCheckCircle,
  FiCalendar,
  FiCheckSquare,
  FiAlertTriangle,
  FiXCircle,
  FiAlertCircle,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { RiUserSettingsLine } from "react-icons/ri";

const statusMap: Record<string, string> = {
  PENDING: "대기",
  APPROVED: "승인",
  REJECTED: "반려",
  waiting: "대기",
  approved: "승인",
  rejected: "반려",
};
const statusColor: Record<string, string> = {
  PENDING: "#fbbf24",
  APPROVED: "#10b981",
  REJECTED: "#ef4444",
  waiting: "#fbbf24",
  approved: "#10b981",
  rejected: "#ef4444",
};
function formatDate(dateStr?: string | null) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  let hour = date.getHours();
  const minute = date.getMinutes().toString().padStart(2, "0");
  const isAM = hour < 12;
  const ampm = isAM ? "오전" : "오후";
  if (!isAM && hour > 12) hour -= 12;
  if (hour === 0) hour = 12;
  return `${year}.${month}.${day} (${ampm} ${hour}:${minute})`;
}

interface ChecklistDetailModalProps {
  open: boolean;
  loading: boolean;
  data: any;
  onClose: () => void;
  onRefresh?: () => void;
}

const ChecklistDetailModal = ({
  open,
  loading,
  data,
  onClose,
  onRefresh,
}: ChecklistDetailModalProps) => {
  const { user, role } = useAuth();
  // 승인/반려 UI 상태를 approval별로 관리
  const [rejectStates, setRejectStates] = useState<{
    [approvalId: number]: boolean;
  }>({});
  const [rejectReasons, setRejectReasons] = useState<{
    [approvalId: number]: string;
  }>({});
  const [actionLoading, setActionLoading] = useState<{
    [approvalId: number]: boolean;
  }>({});
  const [localApprovals, setLocalApprovals] = useState<any[] | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // ESC 키로 모달 닫기
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  React.useEffect(() => {
    // 모달 열릴 때마다 approval 상태 초기화
    if (data && Array.isArray(data.approvals)) {
      setLocalApprovals(data.approvals);
      setRejectStates({});
      setRejectReasons({});
      setActionLoading({});
    }
  }, [data, open]);

  const handleShowReject = (approvalId: number) => {
    setRejectStates((prev) => ({ ...prev, [approvalId]: true }));
  };
  const handleHideReject = (approvalId: number) => {
    setRejectStates((prev) => ({ ...prev, [approvalId]: false }));
    setRejectReasons((prev) => ({ ...prev, [approvalId]: "" }));
  };
  const handleRejectReasonChange = (approvalId: number, value: string) => {
    setRejectReasons((prev) => ({ ...prev, [approvalId]: value }));
  };

  // 승인 처리
  const handleApprove = async (approvalId: number) => {
    setActionLoading((prev) => ({ ...prev, [approvalId]: true }));
    try {
      await api.put(`/api/checklists/approvals/${approvalId}`, {
        status: "APPROVED",
        message: "",
      });
      // UI 갱신: localApprovals 상태 변경
      setLocalApprovals((prev) =>
        prev
          ? prev.map((a) =>
              a.id === approvalId
                ? {
                    ...a,
                    status: "APPROVED",
                    message: "",
                    respondedAt: new Date().toISOString(),
                  }
                : a
            )
          : prev
      );
      setRejectStates((prev) => ({ ...prev, [approvalId]: false }));
      setRejectReasons((prev) => ({ ...prev, [approvalId]: "" }));
      // 체크리스트 목록 새로고침
      if (onRefresh) {
        onRefresh();
      }
      if (onClose) onClose(); // 승인 성공 시 모달 닫기
    } catch (e) {
      let msg = "승인 처리에 실패했습니다.";
      if (e && typeof e === "object") {
        const err = e as any;
        if (
          "response" in err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          msg = err.response.data.message;
        } else if ("data" in err && err.data && err.data.message) {
          msg = err.data.message;
        } else if ("message" in err) {
          msg = err.message as string;
        }
      }
      alert(msg);
    } finally {
      setActionLoading((prev) => ({ ...prev, [approvalId]: false }));
    }
  };

  // 반려 처리
  const handleReject = async (approvalId: number) => {
    if (!rejectReasons[approvalId] || rejectReasons[approvalId].trim() === "")
      return;
    setActionLoading((prev) => ({ ...prev, [approvalId]: true }));
    try {
      await api.put(`/api/checklists/approvals/${approvalId}`, {
        status: "REJECTED",
        message: rejectReasons[approvalId],
      });
      setLocalApprovals((prev) =>
        prev
          ? prev.map((a) =>
              a.id === approvalId
                ? {
                    ...a,
                    status: "REJECTED",
                    message: rejectReasons[approvalId],
                    respondedAt: new Date().toISOString(),
                  }
                : a
            )
          : prev
      );
      setRejectStates((prev) => ({ ...prev, [approvalId]: false }));
      setRejectReasons((prev) => ({ ...prev, [approvalId]: "" }));
      // 체크리스트 목록 새로고침
      if (onRefresh) {
        onRefresh();
      }
      if (onClose) onClose(); // 반려 성공 시 모달 닫기
    } catch (e: any) {
      // errors.reason 추출
      let msg = "반려 처리에 실패했습니다.";
      if (e?.response?.data?.data?.errors) {
        const errors = e.response.data.data.errors;
        msg = errors.map((err: any) => err.reason).join("\n");
      } else if (e && typeof e === "object") {
        const err = e as any;
        if (
          "response" in err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          msg = err.response.data.message;
        } else if ("data" in err && err.data && err.data.message) {
          msg = err.data.message;
        } else if ("message" in err) {
          msg = err.message as string;
        }
      }
      showErrorToast(msg);
    } finally {
      setActionLoading((prev) => ({ ...prev, [approvalId]: false }));
    }
  };

  // 체크리스트 삭제 함수
  const handleDeleteChecklist = async () => {
    if (!data?.id) return;
    if (!window.confirm("정말로 이 체크리스트를 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/checklists/${data.id}`);
      showSuccessToast("체크리스트가 성공적으로 삭제되었습니다.");
      if (onClose) onClose();
      if (onRefresh) onRefresh();
    } catch (e: any) {
      let msg = "체크리스트 삭제에 실패했습니다.";
      if (e?.response?.data?.data?.errors) {
        const errors = e.response.data.data.errors;
        msg = errors.map((err: any) => err.reason).join("\n");
      } else if (e?.response?.data?.message) {
        msg = e.response.data.message;
      }
      showErrorToast(msg);
    }
  };

  // 수정 버튼 클릭 시 폼에 값 세팅
  const handleEditClick = () => {
    setEditTitle(data?.title || "");
    setEditContent(data?.content || "");
    setEditMode(true);
  };

  // 수정 취소
  const handleEditCancel = () => {
    setEditMode(false);
    setEditTitle("");
    setEditContent("");
  };

  // 체크리스트 수정 함수
  const handleUpdateChecklist = async () => {
    if (!data?.id) return;
    setEditLoading(true);
    try {
      await api.put(`/api/checklists/${data.id}`, {
        title: editTitle,
        content: editContent,
      });
      showSuccessToast("체크리스트가 성공적으로 수정되었습니다.");
      setEditMode(false);
      if (onClose) onClose();
      if (onRefresh) onRefresh();
    } catch (e: any) {
      let msg = "체크리스트 수정에 실패했습니다.";
      if (e?.response?.data?.data?.errors) {
        const errors = e.response.data.data.errors;
        msg = errors.map((err: any) => err.reason).join("\n");
      } else if (e?.response?.data?.message) {
        msg = e.response.data.message;
      }
      showErrorToast(msg);
      // onClose 호출하지 않음
    } finally {
      setEditLoading(false);
    }
  };

  // 버튼 노출 조건
  const isAdmin =
    (role && role.toUpperCase() === "ADMIN") ||
    (role && role.toLowerCase().includes("admin"));
  const canEditOrDelete =
    (user?.id && data?.userId && user?.id === data.userId) || isAdmin;

  if (!open) return null;
  const approvals =
    localApprovals ??
    (data && Array.isArray(data.approvals) ? data.approvals : []);
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>체크리스트 상세</ModalTitle>
          <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          {loading ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              로딩 중...
            </div>
          ) : !data ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: "#ef4444",
              }}
            >
              데이터를 불러올 수 없습니다.
            </div>
          ) : (
            <ModalContent>
              {/* 왼쪽: 체크리스트 정보 */}
              <InfoSection>
                {editMode ? (
                  <>
                    <InfoRow>
                      <InfoLabel>제목</InfoLabel>
                      <InfoValue>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          maxLength={30}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1.5px solid #e5e7eb",
                            borderRadius: 8,
                            fontSize: "1.05rem",
                            color: "#22223b",
                            background: "#fafbfc",
                          }}
                        />
                      </InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>내용</InfoLabel>
                      <InfoValue>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          maxLength={500}
                          rows={5}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1.5px solid #e5e7eb",
                            borderRadius: 8,
                            fontSize: "1.01rem",
                            color: "#22223b",
                            background: "#fafbfc",
                            resize: "vertical",
                          }}
                        />
                      </InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel />
                      <InfoValue style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={handleUpdateChecklist}
                          disabled={editLoading}
                          style={{
                            background: "#10b981",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            padding: "7px 18px",
                            fontWeight: 600,
                            fontSize: "1rem",
                            cursor: "pointer",
                          }}
                        >
                          {editLoading ? "저장 중..." : "저장"}
                        </button>
                        <button
                          onClick={handleEditCancel}
                          disabled={editLoading}
                          style={{
                            background: "#f3f4f6",
                            color: "#374151",
                            border: "none",
                            borderRadius: 8,
                            padding: "7px 18px",
                            fontWeight: 600,
                            fontSize: "1rem",
                            cursor: "pointer",
                          }}
                        >
                          취소
                        </button>
                      </InfoValue>
                    </InfoRow>
                  </>
                ) : (
                  <>
                    <InfoRow>
                      <InfoLabel
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <FiFileText style={{ color: "#fdb924" }} /> 제목
                      </InfoLabel>
                      <InfoValue>{data.title}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <FiAlignLeft style={{ color: "#fdb924" }} /> 내용
                      </InfoLabel>
                      <InfoValue>{data.content}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <FiUser style={{ color: "#fdb924" }} /> 작성자
                      </InfoLabel>
                      <InfoValue
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        {data.username === "관리자" ? (
                          <RiUserSettingsLine
                            size={16}
                            style={{ color: "#8b5cf6" }}
                          />
                        ) : (
                          <FiUser size={16} style={{ color: "#3b82f6" }} />
                        )}
                        {data.name}
                        {data.username && (
                          <span
                            style={{
                              color: "#888",
                              fontWeight: 400,
                              marginLeft: -3,
                              fontSize: 13,
                            }}
                          >
                            ({data.username})
                          </span>
                        )}
                      </InfoValue>
                    </InfoRow>
                    {/* 상태 InfoRow의 아이콘을 FiAlertCircle(노란색)로 변경 */}
                    <InfoRow>
                      <InfoLabel
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <FiAlertCircle style={{ color: "#fdb924" }} /> 상태
                      </InfoLabel>
                      <InfoValue>
                        <ApprovalStatusBadge
                          color={statusColor[data.status] || "#bbb"}
                        >
                          {statusMap[data.status] || data.status}
                        </ApprovalStatusBadge>
                      </InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <FiCalendar style={{ color: "#fdb924" }} /> 생성일
                      </InfoLabel>
                      <InfoValue>{formatDate(data.createdAt)}</InfoValue>
                    </InfoRow>
                    {/* 완료일 InfoRow의 아이콘을 FiCheckCircle(노란색)로 변경 */}
                    <InfoRow>
                      <InfoLabel
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <FiCheckCircle style={{ color: "#fdb924" }} /> 완료일
                      </InfoLabel>
                      <InfoValue>{formatDate(data.completedAt)}</InfoValue>
                    </InfoRow>
                    {/* 수정/삭제 버튼에 아이콘 추가 및 스타일 변경 (더 작게) */}
                    {canEditOrDelete &&
                      (isAdmin ||
                        (user?.id &&
                          data?.userId &&
                          user?.id === data.userId)) && (
                        <InfoRow>
                          <InfoLabel />
                          <InfoValue style={{ display: "flex", gap: 5 }}>
                            {/* 작성자 본인: 수정/삭제, 관리자: 삭제만 */}
                            {user?.id &&
                              data?.userId &&
                              user?.id === data.userId && (
                                <button
                                  style={{
                                    background: "#fff",
                                    color: "#3b82f6",
                                    border: "1.2px solid #d1d5db",
                                    borderRadius: 7,
                                    padding: "3px 8px",
                                    fontWeight: 600,
                                    fontSize: "0.93rem",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 3,
                                    transition: "all 0.15s",
                                  }}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.background =
                                      "#f3f4f6";
                                    e.currentTarget.style.borderColor =
                                      "#3b82f6";
                                    e.currentTarget.style.color = "#2563eb";
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.background = "#fff";
                                    e.currentTarget.style.borderColor =
                                      "#d1d5db";
                                    e.currentTarget.style.color = "#3b82f6";
                                  }}
                                  onClick={handleEditClick}
                                >
                                  <FiEdit
                                    style={{ marginRight: 2, fontSize: 15 }}
                                  />{" "}
                                  수정
                                </button>
                              )}
                            <button
                              style={{
                                background: "#fff",
                                color: "#ef4444",
                                border: "1.2px solid #d1d5db",
                                borderRadius: 7,
                                padding: "3px 8px",
                                fontWeight: 600,
                                fontSize: "0.93rem",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 3,
                                transition: "all 0.15s",
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = "#fee2e2";
                                e.currentTarget.style.borderColor = "#ef4444";
                                e.currentTarget.style.color = "#b91c1c";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = "#fff";
                                e.currentTarget.style.borderColor = "#d1d5db";
                                e.currentTarget.style.color = "#ef4444";
                              }}
                              onClick={handleDeleteChecklist}
                            >
                              <FiTrash2
                                style={{ marginRight: 2, fontSize: 15 }}
                              />{" "}
                              삭제
                            </button>
                          </InfoValue>
                        </InfoRow>
                      )}
                  </>
                )}
              </InfoSection>
              {/* 오른쪽: 승인자 카드 목록 */}
              <ApprovalsSection>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "1.08rem",
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <FiUser style={{ color: "#fdb924" }} /> 승인자 목록
                </div>
                <ApprovalCardList>
                  {Array.isArray(approvals) && approvals.length > 0 ? (
                    approvals.map((appr: any) => (
                      <ApprovalCard key={appr.id}>
                        <ApprovalCardHeader>
                          {/* 승인자 이름 왼쪽에 아이콘 추가 */}
                          <ApprovalName
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            {appr.username === "관리자" ? (
                              <RiUserSettingsLine
                                size={16}
                                style={{ color: "#8b5cf6" }}
                              />
                            ) : (
                              <FiUser size={16} style={{ color: "#3b82f6" }} />
                            )}
                            {appr.name}
                            {appr.username && (
                              <span
                                style={{
                                  color: "#888",
                                  fontWeight: 400,
                                  marginLeft: -3,
                                  fontSize: 13,
                                }}
                              >
                                ({appr.username})
                              </span>
                            )}
                          </ApprovalName>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              fontWeight: 600,
                              fontSize: "0.98rem",
                            }}
                          >
                            {/* 승인자목록 상태 텍스트 색상도 아이콘 색상과 일치하게 변경 */}
                            {(appr.status === "waiting" ||
                              appr.status === "PENDING") && (
                              <>
                                <FiAlertTriangle
                                  size={16}
                                  style={{ color: "#fbbf24" }}
                                />
                                <span
                                  style={{ marginLeft: 2, color: "#fbbf24" }}
                                >
                                  대기
                                </span>
                              </>
                            )}
                            {(appr.status === "approved" ||
                              appr.status === "APPROVED") && (
                              <>
                                <FiCheckCircle
                                  size={16}
                                  style={{ color: "#10b981" }}
                                />
                                <span
                                  style={{ marginLeft: 2, color: "#10b981" }}
                                >
                                  승인
                                </span>
                              </>
                            )}
                            {(appr.status === "rejected" ||
                              appr.status === "REJECTED") && (
                              <>
                                <FiXCircle
                                  size={16}
                                  style={{ color: "#ef4444" }}
                                />
                                <span
                                  style={{ marginLeft: 2, color: "#ef4444" }}
                                >
                                  반려
                                </span>
                              </>
                            )}
                          </div>
                        </ApprovalCardHeader>
                        <ApprovalCardBody>
                          {appr.message && (
                            <ApprovalMessage>
                              메시지: {appr.message}
                            </ApprovalMessage>
                          )}
                          <ApprovalDate>
                            {appr.respondedAt
                              ? `응답일: ${formatDate(appr.respondedAt)}`
                              : "승인 대기"}
                          </ApprovalDate>
                          {/* 승인/반려 UI: 대기 상태이고 본인이 할당된 승인자일 때만 노출 */}
                          {appr.status === "PENDING" &&
                            appr.userId === user?.id && (
                              <ApprovalActions>
                                {!rejectStates[appr.id] ? (
                                  <>
                                    <ApprovalButton
                                      disabled={!!actionLoading[appr.id]}
                                      onClick={() => handleApprove(appr.id)}
                                    >
                                      {actionLoading[appr.id]
                                        ? "처리 중..."
                                        : "승인"}
                                    </ApprovalButton>
                                    <ApprovalButtonSecondary
                                      disabled={!!actionLoading[appr.id]}
                                      onClick={() => handleShowReject(appr.id)}
                                    >
                                      반려
                                    </ApprovalButtonSecondary>
                                  </>
                                ) : (
                                  <>
                                    <ApprovalTextarea
                                      value={rejectReasons[appr.id] || ""}
                                      onChange={(e) =>
                                        handleRejectReasonChange(
                                          appr.id,
                                          e.target.value
                                        )
                                      }
                                      placeholder="반려 사유 입력"
                                      disabled={!!actionLoading[appr.id]}
                                    />
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: 8,
                                        marginTop: 6,
                                      }}
                                    >
                                      <ApprovalButtonSecondary
                                        disabled={!!actionLoading[appr.id]}
                                        onClick={() =>
                                          handleHideReject(appr.id)
                                        }
                                      >
                                        취소
                                      </ApprovalButtonSecondary>
                                      <ApprovalButton
                                        disabled={
                                          !!actionLoading[appr.id] ||
                                          !rejectReasons[appr.id] ||
                                          rejectReasons[appr.id].trim() === ""
                                        }
                                        onClick={() => handleReject(appr.id)}
                                      >
                                        {actionLoading[appr.id]
                                          ? "처리 중..."
                                          : "반려 제출"}
                                      </ApprovalButton>
                                    </div>
                                  </>
                                )}
                              </ApprovalActions>
                            )}
                        </ApprovalCardBody>
                      </ApprovalCard>
                    ))
                  ) : (
                    <div style={{ color: "#bbb", fontSize: "0.98rem" }}>
                      승인자가 없습니다.
                    </div>
                  )}
                </ApprovalCardList>
              </ApprovalsSection>
            </ModalContent>
          )}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ChecklistDetailModal;
