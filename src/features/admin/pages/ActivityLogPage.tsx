import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  PageContainer,
  Header,
  Title,
  Description,
  FilterSection,
  FilterGroup,
  FilterLabel,
  SearchInput,
  FilterButton,
  TableContainer,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  StatusBadge,
  PaginationContainer,
  PaginationInfo,
  PaginationNav,
  PaginationButton,
  LoadingSpinner,
  ErrorMessage,
  SearchRight,
  SelectButton,
  SelectDropdown,
  SelectOption,
} from "@/features/admin/pages/ActivityLogPage.styled";
import {
  DateRangeGroup,
  DatePickerWrapper,
  DateButton,
  DateSeparator,
  DatePickerStyles,
} from "@/features/project/components/List/ProjectFilterBar.styled";
import {
  FiSearch,
  FiRotateCcw,
  FiUser,
  FiHome,
  FiFileText,
  FiEdit,
  FiTrash,
  FiPlus,
  FiCalendar,
  FiChevronDown,
  FiMessageCircle,
  FiLayers,
  FiHelpCircle,
  FiGrid,
} from "react-icons/fi";
import { FaProjectDiagram } from "react-icons/fa";
import UserSelectionModal from "../components/UserSelectionModal";
import UserFilterButton from "../components/UserFilterButton";
import {
  getActivityLogs,
  transformHistoryToActivityLog,
} from "../services/activityLogService";

// 타입 정의
interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  targetType: "POST" | "USER" | "PROJECT" | "COMPANY" | "STEP";
  targetName: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

interface User {
  id: number;
  username: string;
  name: string;
  role: string;
}

interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export default function ActivityLogPage() {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    size: 10,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [logTypeFilter, setLogTypeFilter] = useState("ALL");
  const [logTypeDropdownOpen, setLogTypeDropdownOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // 드롭다운 상태
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
  const actionDropdownRef = useRef<HTMLDivElement>(null);
  const logTypeDropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 옵션
  const ACTION_OPTIONS = [
    { value: "ALL", label: "전체", icon: FiGrid, color: "#6b7280" },
    { value: "CREATED", label: "생성", icon: FiPlus, color: "#10b981" },
    { value: "UPDATED", label: "수정", icon: FiEdit, color: "#3b82f6" },
    { value: "DELETED", label: "삭제", icon: FiTrash, color: "#ef4444" },
  ];

  const LOG_TYPE_OPTIONS = [
    { value: "ALL", label: "전체", icon: FiGrid, color: "#6b7280" },
    { value: "USER", label: "회원", icon: FiUser, color: "#8b5cf6" },
    { value: "COMPANY", label: "회사", icon: FiHome, color: "#f59e0b" },
    {
      value: "PROJECT",
      label: "프로젝트",
      icon: FaProjectDiagram,
      color: "#3b82f6",
    },
    {
      value: "STEP",
      label: "단계",
      icon: FiLayers,
      color: "#6366f1",
    },
    { value: "POST", label: "게시글", icon: FiFileText, color: "#10b981" },
  ];

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        logTypeDropdownRef.current &&
        !logTypeDropdownRef.current.contains(event.target as Node)
      ) {
        setLogTypeDropdownOpen(false);
      }
      if (
        actionDropdownRef.current &&
        !actionDropdownRef.current.contains(event.target as Node)
      ) {
        setActionDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 이력 데이터 가져오기
  const fetchActivityLogs = async (page: number = 0) => {
    setLoading(true);
    setError(null);

    try {
      const filters = {
        historyType: actionFilter !== "ALL" ? actionFilter : undefined,
        domainType: logTypeFilter !== "ALL" ? logTypeFilter : undefined,
        changedBy: selectedUser?.id?.toString(),
        changedFrom: startDate || undefined,
        changedTo: endDate || undefined,
      };

      // 디버깅용 로그
      console.log("필터 값들:", {
        actionFilter,
        logTypeFilter,
        selectedUser,
        startDate,
        endDate,
        filters,
      });

      console.log(
        "API 요청 URL:",
        `/api/histories/search?${new URLSearchParams({
          page: page.toString(),
          size: "10",
          ...(filters.historyType && { historyType: filters.historyType }),
          ...(filters.domainType && { domainType: filters.domainType }),
          ...(filters.changedBy && { changedBy: filters.changedBy }),
          ...(filters.changedFrom && { changedFrom: filters.changedFrom }),
          ...(filters.changedTo && { changedTo: filters.changedTo }),
        }).toString()}`
      );

      const response = await getActivityLogs(page, 10, filters);

      // 백엔드 응답을 프론트엔드 형식으로 변환
      const transformedLogs = response.content.map((history) =>
        transformHistoryToActivityLog(history)
      );

      setActivityLogs(transformedLogs);
      setPageInfo(response.page);
    } catch (err) {
      console.error("이력 데이터 가져오기 실패:", err);
      setError("이력 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchActivityLogs(0);
  }, []);

  // 필터 상태 변경 시 자동 검색
  useEffect(() => {
    // 초기 로드 시에는 실행하지 않음 (위의 useEffect에서 처리)
    if (activityLogs.length > 0) {
      setCurrentPage(0);
      fetchActivityLogs(0);
    }
  }, [actionFilter, logTypeFilter, selectedUser, startDate, endDate]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATED":
        return <FiPlus style={{ color: "#10b981" }} />;
      case "UPDATED":
        return <FiEdit style={{ color: "#3b82f6" }} />;
      case "DELETED":
        return <FiTrash style={{ color: "#ef4444" }} />;
      default:
        return <FiFileText style={{ color: "#6b7280" }} />;
    }
  };

  const getTargetTypeIcon = (targetType: string) => {
    switch (targetType) {
      case "USER":
        return <FiUser style={{ color: "#8b5cf6" }} />;
      case "COMPANY":
        return <FiHome style={{ color: "#f59e0b" }} />;
      case "PROJECT":
        return <FaProjectDiagram style={{ color: "#3b82f6" }} />;
      case "STEP":
        return <FiLayers style={{ color: "#6366f1" }} />;
      case "POST":
        return <FiFileText style={{ color: "#10b981" }} />;
      default:
        return <FiFileText style={{ color: "#6b7280" }} />;
    }
  };

  const getActionBadgeStyle = (action: string) => {
    switch (action) {
      case "CREATED":
        return { backgroundColor: "#d1fae5", color: "#065f46" };
      case "UPDATED":
        return { backgroundColor: "#dbeafe", color: "#1e40af" };
      case "DELETED":
        return { backgroundColor: "#fee2e2", color: "#991b1b" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
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
    });
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "선택 안함";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchActivityLogs(0);
  };

  const handleReset = () => {
    setSearchTerm("");
    setActionFilter("ALL");
    setLogTypeFilter("ALL");
    setSelectedUser(null);
    setStartDate("");
    setEndDate("");
    setCurrentPage(0);
    fetchActivityLogs(0);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchActivityLogs(newPage);
  };

  // 드롭다운 토글 함수들
  const handleActionDropdownToggle = () => {
    setActionDropdownOpen(!actionDropdownOpen);
  };

  const handleActionSelect = (value: string) => {
    setActionFilter(value);
    setActionDropdownOpen(false);
  };

  const handleLogTypeDropdownToggle = () => {
    setLogTypeDropdownOpen(!logTypeDropdownOpen);
    setActionDropdownOpen(false);
  };

  const handleLogTypeSelect = (value: string) => {
    setLogTypeFilter(value);
    setLogTypeDropdownOpen(false);
  };

  // 현재 선택된 옵션 가져오기
  const getCurrentActionOption = () => {
    return (
      ACTION_OPTIONS.find((option) => option.value === actionFilter) ||
      ACTION_OPTIONS[0]
    );
  };

  const getCurrentLogTypeOption = () => {
    return (
      LOG_TYPE_OPTIONS.find((option) => option.value === logTypeFilter) ||
      LOG_TYPE_OPTIONS[0]
    );
  };

  // 날짜 관련 핸들러
  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      setStartDate(formattedDate);
    }
    setStartDateOpen(false);
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      setEndDate(formattedDate);
    }
    setEndDateOpen(false);
  };

  const handleStartDateClick = () => {
    setEndDateOpen(false);
    setStartDateOpen(!startDateOpen);
  };

  const handleEndDateClick = () => {
    setStartDateOpen(false);
    setEndDateOpen(!endDateOpen);
  };

  // 사용자 모달 관련 핸들러
  const handleUserModalOpen = () => {
    setUserModalOpen(true);
  };

  const handleUserModalClose = () => {
    setUserModalOpen(false);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setUserModalOpen(false);
  };

  const handleUserClear = () => {
    setSelectedUser(null);
  };

  if (loading && activityLogs.length === 0) return <LoadingSpinner />;
  if (error && activityLogs.length === 0)
    return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <PageContainer>
      <Header>
        <Title>변경 이력</Title>
        <Description>
          사용자들의 사이트 활동 내역을 확인할 수 있습니다
        </Description>
      </Header>

      <FilterSection>
        <FilterGroup>
          <FilterLabel>작업 유형</FilterLabel>
          <div style={{ position: "relative" }} ref={actionDropdownRef}>
            <SelectButton
              type="button"
              onClick={handleActionDropdownToggle}
              $hasValue={actionFilter !== "ALL"}
              $color={getCurrentActionOption().color}
              className={actionDropdownOpen ? "open" : ""}
            >
              {React.createElement(getCurrentActionOption().icon, { size: 16 })}
              <span className="select-value">
                {getCurrentActionOption().label}
              </span>
              <FiChevronDown size={16} />
            </SelectButton>
            <SelectDropdown $isOpen={actionDropdownOpen}>
              {ACTION_OPTIONS.map((option) => (
                <SelectOption
                  key={option.value}
                  $isSelected={actionFilter === option.value}
                  onClick={() => handleActionSelect(option.value)}
                >
                  {React.createElement(option.icon, {
                    size: 16,
                    color: option.color,
                  })}
                  {option.label}
                </SelectOption>
              ))}
            </SelectDropdown>
          </div>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>변경한 사용자</FilterLabel>
          <UserFilterButton
            selectedUser={selectedUser}
            onOpenModal={handleUserModalOpen}
            onClear={handleUserClear}
          />
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>대상</FilterLabel>
          <div style={{ position: "relative" }} ref={logTypeDropdownRef}>
            <SelectButton
              type="button"
              onClick={handleLogTypeDropdownToggle}
              $hasValue={logTypeFilter !== "ALL"}
              $color={getCurrentLogTypeOption().color}
              className={logTypeDropdownOpen ? "open" : ""}
              style={{ width: "160px" }}
            >
              {React.createElement(getCurrentLogTypeOption().icon, {
                size: 16,
              })}
              <span className="select-value">
                {getCurrentLogTypeOption().label}
              </span>
              <FiChevronDown size={16} />
            </SelectButton>
            <SelectDropdown $isOpen={logTypeDropdownOpen}>
              {LOG_TYPE_OPTIONS.map((option) => (
                <SelectOption
                  key={option.value}
                  $isSelected={logTypeFilter === option.value}
                  onClick={() => handleLogTypeSelect(option.value)}
                >
                  {React.createElement(option.icon, {
                    size: 16,
                    color: option.color,
                  })}
                  {option.label}
                </SelectOption>
              ))}
            </SelectDropdown>
          </div>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>변경 기간</FilterLabel>
          <DateRangeGroup>
            <DatePickerWrapper>
              <DateButton
                type="button"
                onClick={handleStartDateClick}
                $hasValue={!!startDate}
              >
                <FiCalendar size={16} />
                <span>시작일</span>
                <span className="date-value">
                  {formatDateForDisplay(startDate)}
                </span>
              </DateButton>
              {startDateOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    zIndex: 1000,
                    marginTop: "4px",
                  }}
                >
                  <DatePicker
                    selected={startDate ? new Date(startDate) : null}
                    onChange={handleStartDateChange}
                    selectsStart
                    startDate={startDate ? new Date(startDate) : null}
                    endDate={endDate ? new Date(endDate) : null}
                    maxDate={endDate ? new Date(endDate) : null}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="시작일 선택"
                    inline
                    onClickOutside={() => setStartDateOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setStartDateOpen(false);
                    }}
                  />
                </div>
              )}
            </DatePickerWrapper>
            <DateSeparator>~</DateSeparator>
            <DatePickerWrapper>
              <DateButton
                type="button"
                onClick={handleEndDateClick}
                $hasValue={!!endDate}
              >
                <FiCalendar size={16} />
                <span>종료일</span>
                <span className="date-value">
                  {formatDateForDisplay(endDate)}
                </span>
              </DateButton>
              {endDateOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    zIndex: 1000,
                    marginTop: "4px",
                  }}
                >
                  <DatePicker
                    selected={endDate ? new Date(endDate) : null}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={startDate ? new Date(startDate) : null}
                    endDate={endDate ? new Date(endDate) : null}
                    minDate={startDate ? new Date(startDate) : null}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="종료일 선택"
                    inline
                    onClickOutside={() => setEndDateOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setEndDateOpen(false);
                    }}
                    popperPlacement="bottom-start"
                  />
                </div>
              )}
            </DatePickerWrapper>
          </DateRangeGroup>
        </FilterGroup>
        <SearchRight>
          <SearchInput
            type="text"
            placeholder="사용자명, 대상명, 상세내용으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterButton onClick={handleSearch}>
            <FiSearch size={16} />
          </FilterButton>
          <FilterButton onClick={handleReset}>
            <FiRotateCcw size={16} />
          </FilterButton>
        </SearchRight>
      </FilterSection>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>작업</TableHeader>
              <TableHeader>사용자</TableHeader>
              <TableHeader>대상</TableHeader>
              <TableHeader>상세내용</TableHeader>
              <TableHeader>변경자 IP</TableHeader>
              <TableHeader>변경 일시</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {activityLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {getActionIcon(log.action)}
                    <StatusBadge style={getActionBadgeStyle(log.action)}>
                      {log.action === "CREATED" && "생성"}
                      {log.action === "UPDATED" && "수정"}
                      {log.action === "DELETED" && "삭제"}
                    </StatusBadge>
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <FiUser size={14} style={{ color: "#6b7280" }} />
                    <span style={{ fontWeight: "500" }}>{log.userName}</span>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      ({log.userRole === "ROLE_ADMIN" ? "관리자" : "사용자"})
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {getTargetTypeIcon(log.targetType)}
                    <span style={{ fontWeight: "500" }}>{log.targetName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span style={{ fontSize: "14px", color: "#374151" }}>
                    {log.details}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      fontFamily: "monospace",
                    }}
                  >
                    {log.ipAddress}
                  </span>
                </TableCell>
                <TableCell>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <FiCalendar size={14} style={{ color: "#6b7280" }} />
                    <span style={{ fontSize: "14px", color: "#374151" }}>
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <PaginationContainer>
        <PaginationNav>
          {/* 첫 페이지가 아니면 이전 버튼 렌더 */}
          {currentPage > 0 && (
            <PaginationButton onClick={() => handlePageChange(currentPage - 1)}>
              이전
            </PaginationButton>
          )}

          {/* 페이지 번호 버튼들을 동적으로 생성 */}
          {Array.from({ length: pageInfo.totalPages }, (_, idx) => (
            <PaginationButton
              key={idx}
              $active={currentPage === idx}
              onClick={() => handlePageChange(idx)}
            >
              {idx + 1}
            </PaginationButton>
          ))}

          {/* 마지막 페이지가 아니면 다음 버튼 렌더 */}
          {currentPage + 1 < pageInfo.totalPages && (
            <PaginationButton onClick={() => handlePageChange(currentPage + 1)}>
              다음
            </PaginationButton>
          )}
        </PaginationNav>
        <PaginationInfo>
          총 {pageInfo.totalElements}개 항목 중{" "}
          {currentPage * pageInfo.size + 1}-
          {Math.min((currentPage + 1) * pageInfo.size, pageInfo.totalElements)}
          개 표시
        </PaginationInfo>
      </PaginationContainer>

      {/* 사용자 선택 모달 */}
      <UserSelectionModal
        isOpen={userModalOpen}
        onClose={handleUserModalClose}
        onSelect={handleUserSelect}
      />
    </PageContainer>
  );
}
