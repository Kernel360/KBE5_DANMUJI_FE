import React, { useState, useEffect } from "react";
import api from "@/api/axios";
import {
  BoardWrapper,
  ColumnBox,
  ColumnHeader,
  StatusDot,
  ColumnTitle,
  ColumnCount,
  CardBox,
  CardTop,
  CardTitle,
  CardMeta,
  StatusBadge,
} from "./ChecklistBoard.styled";
import ChecklistCreateModal from "./ChecklistCreateModal";
import ChecklistDetailModal from "./ChecklistDetailModal";
import ProjectBoardFilters from "../Board/ProjectBoardFilters";
import type { ProjectDetailStep } from "../../services/projectService";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiFlag,
  FiXCircle,
  FiUser,
  FiCalendar,
  FiShield,
} from "react-icons/fi";
import { RiUserSettingsLine } from "react-icons/ri";
import { showErrorToast } from "@/utils/errorHandler";

// 카드 타입 명확화
export type ChecklistCardType = {
  id: number;
  title: string;
  assignee: string;
  username: string;
  createdAt: string;
  status: "waiting" | "approved" | "rejected";
  approvalRequest?: boolean;
  rejectReason?: string;
};

// 상태별 컬럼 정보
const COLUMNS = [
  {
    key: "waiting",
    title: "대기",
    bg: "#fffbea",
    dot: "#fbbf24",
  },
  {
    key: "approved",
    title: "승인",
    bg: "#ecfdf5",
    dot: "#10b981",
  },
  {
    key: "rejected",
    title: "반려",
    bg: "#fef2f2",
    dot: "#ef4444",
  },
];

// 담당자 이니셜 생성
function getInitials(name: string) {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length === 1) return name.slice(0, 2);
  return parts
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
}

// 날짜 포맷팅 함수
const formatDate = (dateString: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const ampm = hours >= 12 ? "오후" : "오전";
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;

  return `${year}.${month}.${day} (${ampm} ${displayHours}:${minutes})`;
};

// 카드 컴포넌트에 클릭 핸들러 추가 (정의 위치 이동)
function ChecklistCard({
  card,
  onClick,
}: {
  card: ChecklistCardType;
  onClick: (id: number) => void;
}) {
  // 상태별 아이콘 매핑
  const getStatusIcon = (status: string) => {
    if (status === "waiting")
      return (
        <FiAlertTriangle
          size={16}
          style={{ color: "#fbbf24", marginRight: 8 }}
        />
      );
    if (status === "approved")
      return (
        <FiCheckCircle size={16} style={{ color: "#10b981", marginRight: 8 }} />
      );
    if (status === "rejected")
      return (
        <FiXCircle size={16} style={{ color: "#ef4444", marginRight: 8 }} />
      );
    return null;
  };
  return (
    <CardBox
      $status={card.status}
      onClick={() => onClick(card.id)}
      style={{ cursor: "pointer" }}
    >
      <CardTop>
        {/* 상태 아이콘 추가 */}
        {getStatusIcon(card.status)}
        <CardTitle>{card.title}</CardTitle>
        <StatusBadge status={card.status}>
          {card.status === "waiting" && "대기"}
          {card.status === "approved" && "승인"}
          {card.status === "rejected" && "반려"}
        </StatusBadge>
      </CardTop>
      <CardMeta>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {card.username === "관리자" ? (
              <RiUserSettingsLine
                size={14}
                style={{ marginRight: 4, color: "#8b5cf6" }}
              />
            ) : (
              <FiUser size={14} style={{ marginRight: 4, color: "#3b82f6" }} />
            )}
            {card.username}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <FiCalendar size={14} style={{ marginRight: 4 }} />
            {card.createdAt}
          </span>
        </div>
      </CardMeta>
      {/* 반려 사유 표시 */}
      {card.status === "rejected" && card.rejectReason && (
        <div style={{ color: "#ef4444", fontSize: "0.95rem", marginTop: 4 }}>
          사유: {card.rejectReason}
        </div>
      )}
    </CardBox>
  );
}

// 컬럼 컴포넌트
function Column({
  column,
  cards,
  onCardClick,
}: {
  column: (typeof COLUMNS)[number];
  cards: ChecklistCardType[];
  onCardClick: (id: number) => void;
}) {
  // 상태별 컬럼 아이콘 매핑
  const getColumnIcon = (key: string) => {
    if (key === "waiting")
      return <FiAlertTriangle size={16} style={{ color: "#fbbf24" }} />;
    if (key === "approved")
      return <FiCheckCircle size={16} style={{ color: "#10b981" }} />;
    if (key === "rejected")
      return <FiXCircle size={16} style={{ color: "#ef4444" }} />;
    return null;
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignSelf: "stretch",
        flex: 1,
      }}
    >
      <ColumnHeader>
        {/* <StatusDot color={column.dot} /> */}
        {getColumnIcon(column.key)}
        <ColumnTitle>{column.title}</ColumnTitle>
        <ColumnCount>{cards.length}</ColumnCount>
      </ColumnHeader>
      <ColumnBox $bg={column.bg}>
        <div
          style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}
        >
          {cards.map((card) => (
            <ChecklistCard
              key={card.id}
              card={card}
              onClick={(id: number) => onCardClick(id)}
            />
          ))}
        </div>
      </ColumnBox>
    </div>
  );
}

// 메인 보드
interface KanbanBoardProps {
  projectId: number;
  selectedStepId: number;
  canEditStep?: boolean;
  projectSteps?: ProjectDetailStep[]; // 단계 목록 추가
  openChecklistId?: number;
}

export default function KanbanBoard({
  projectId,
  selectedStepId,
  canEditStep,
  projectSteps = [],
  openChecklistId,
}: KanbanBoardProps) {
  // 필터 상태 추가
  const [typeFilter, setTypeFilter] = useState<"ALL" | string>("ALL");
  // 상태 필터: ALL | waiting | approved | rejected
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "waiting" | "approved" | "rejected"
  >("ALL");
  const [stepFilter, setStepFilter] = useState<number | "ALL">(
    selectedStepId || (projectSteps.length > 0 ? projectSteps[0].id : "ALL")
  );
  const [keywordType, setKeywordType] = useState<"title" | "writer">("title");
  const [keyword, setKeyword] = useState("");

  const [cards, setCards] = useState<ChecklistCardType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 상세 모달 상태
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 카드 목록을 불러오는 함수 분리
  const fetchCards = async () => {
    if (!selectedStepId) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/checklists/${selectedStepId}`);
      const apiCards = Array.isArray(res.data.data) ? res.data.data : [];
      setCards(
        apiCards.map((item: any) => ({
          id: String(item.id),
          title: item.title || "",
          userId: item.userId,
          username: item.username || "",
          createdAt: item.createdAt ? formatDate(item.createdAt) : "",
          status:
            item.status === "PENDING"
              ? "waiting"
              : item.status === "APPROVED"
              ? "approved"
              : "rejected",
        }))
      );
    } catch {
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStepId]);

  // selectedStepId가 바뀌면 stepFilter도 동기화
  useEffect(() => {
    if (selectedStepId && stepFilter !== selectedStepId) {
      setStepFilter(selectedStepId);
    }
  }, [selectedStepId]);

  // 카드 클릭 핸들러
  const handleCardClick = async (checklistId: number) => {
    setDetailLoading(true);
    setDetailModalOpen(true);
    try {
      const res = await api.get(`/api/checklists/${checklistId}/info`);
      setDetailData(res.data.data);
    } catch (e) {
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDetailModalClose = () => {
    setDetailModalOpen(false);
    setDetailData(null);
  };

  const handleCreateChecklist = async (data: {
    title: string;
    content: string;
    approvalIds: number[];
  }) => {
    try {
      await api.post(`/api/checklists/${selectedStepId}`, {
        title: data.title,
        content: data.content,
        approvalIds: data.approvalIds,
      });
      // 체크리스트 생성 성공 시 카드 목록 새로고침
      await fetchCards();
      setIsModalOpen(false);
    } catch (e: any) {
      // 에러 응답에서 errors.reason 추출하여 토스트로 노출
      let message = "체크리스트 생성에 실패했습니다.";
      let shouldShowToast = true;
      if (e?.response?.data?.data?.errors) {
        const errors = e.response.data.data.errors;
        message = errors.map((err: any) => err.reason).join("\n");
      } else if (
        e?.response?.data?.message &&
        e.response.data.message !== "Invalid input type"
      ) {
        message = e.response.data.message;
      } else if (e?.response?.data?.message === "Invalid input type") {
        shouldShowToast = false;
      }
      // 토스트 알림
      if (shouldShowToast) showErrorToast(message);
      console.error("체크리스트 생성 실패", e);
    }
  };

  // 필터 핸들러 (실제 카드 필터링은 추후 구현 가능)
  const handleSearch = () => {
    // TODO: 필터 적용하여 카드 목록 새로고침
    // 현재는 전체 카드만 불러옴
    fetchCards();
  };
  const handleResetFilters = () => {
    setTypeFilter("ALL");
    setStatusFilter("ALL");
    setStepFilter("ALL");
    setKeywordType("title");
    setKeyword("");
    fetchCards();
  };

  // 단계 필터 변경 시 selectedStepId도 변경(상위에서 prop으로 내려줄 수도 있음)
  useEffect(() => {
    if (stepFilter !== "ALL" && typeof stepFilter === "number") {
      // stepFilter가 바뀌면 항상 해당 단계의 체크리스트 목록을 조회
      fetchCardsByStepFilter(stepFilter);
    }
  }, [stepFilter]);

  // stepFilter로 체크리스트 목록을 불러오는 함수
  const fetchCardsByStepFilter = async (stepId: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/checklists/${stepId}`);
      const apiCards = Array.isArray(res.data.data) ? res.data.data : [];
      setCards(
        apiCards.map((item: any) => ({
          id: String(item.id),
          title: item.title || "",
          userId: item.userId,
          username: item.username || "",
          createdAt: item.createdAt ? formatDate(item.createdAt) : "",
          status:
            item.status === "PENDING"
              ? "waiting"
              : item.status === "APPROVED"
              ? "approved"
              : "rejected",
        }))
      );
    } catch {
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  // 기존 fetchCards는 selectedStepId 기준이므로, stepFilter가 바뀌면 fetchCardsByStepFilter를 사용

  // openChecklistId가 있으면 모달 자동 오픈
  useEffect(() => {
    if (openChecklistId) {
      handleCardClick(openChecklistId);
    }
  }, [openChecklistId]);

  return (
    <div style={{ width: "100%" }}>
      {/* 필터/버튼 UI 상단에 추가 */}
      <div
        style={{
          padding: "0 24px",
          maxWidth: 1200,
          margin: "24px auto 0 auto",
        }}
      >
        <ProjectBoardFilters
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          // 상태 필터를 priorityFilter prop에 맞춰 전달
          priorityFilter={statusFilter}
          setPriorityFilter={setStatusFilter}
          stepFilter={stepFilter}
          setStepFilter={setStepFilter}
          keywordType={keywordType}
          setKeywordType={setKeywordType}
          keyword={keyword}
          setKeyword={setKeyword}
          projectSteps={projectSteps}
          onSearch={handleSearch}
          onResetFilters={handleResetFilters}
          onCreatePost={() => {}}
          onCreateChecklist={() => setIsModalOpen(true)}
          showChecklistButton={true}
          showTypeFilter={false}
          showCreatePost={false}
          showKeywordFilter={false}
          showSearchButton={false}
          showPriorityFilter={false}
          checklistMode={true}
        />
      </div>
      {/* 기존 체크리스트 작성 버튼 영역 삭제 */}
      <BoardWrapper>
        {loading ? (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              padding: "48px 0",
              color: "#bbb",
              fontSize: "1.1rem",
            }}
          >
            로딩 중...
          </div>
        ) : (
          COLUMNS.map((col) => (
            <Column
              key={col.key}
              column={col}
              cards={cards.filter((c) => c.status === col.key)}
              onCardClick={(id: number) => handleCardClick(id)}
            />
          ))
        )}
      </BoardWrapper>
      <ChecklistCreateModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateChecklist}
        projectId={projectId}
        stepId={selectedStepId}
      />
      {/* 상세 모달 */}
      <ChecklistDetailModal
        open={detailModalOpen}
        loading={detailLoading}
        data={detailData}
        onClose={handleDetailModalClose}
        onRefresh={fetchCards}
      />
    </div>
  );
}
