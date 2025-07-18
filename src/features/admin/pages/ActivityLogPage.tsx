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
} from "@/features/project/components/List/ProjectFilterBar.styled";
import {
  FiSearch,
  FiRotateCcw,
  FiUser,
  FiHome,
  FiFileText,
  FiEdit,
  FiTrash,
  FiPlusCircle,
  FiCalendar,
  FiChevronDown,
  FiLayers,
  FiGrid,
  FiMessageSquare,
  FiCheckSquare,
  FiRefreshCw,
} from "react-icons/fi";
import { FiPackage } from "react-icons/fi";
import { LuUserRoundCog } from "react-icons/lu";
import ActivityLogDetailModal from "../components/ActivityLogDetailModal";
import { formatDateOnly, formatTimeOnly } from "@/utils/dateUtils";
import {
  getActivityLogs,
  transformHistoryToActivityLog,
} from "../services/activityLogService";
import { RiUserSettingsLine } from "react-icons/ri";

// 타입 정의
interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  targetType: string;
  targetName: string;
  details: string;
  ipAddress: string;
  createdAt: string;
  changerUsername: string;
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
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [logTypeDropdownOpen, setLogTypeDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // 상세조회 모달 상태
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>("");

  // 드롭다운 상태
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
  const actionDropdownRef = useRef<HTMLDivElement>(null);
  const logTypeDropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 옵션
  const ACTION_OPTIONS = [
    { value: "ALL", label: "전체", icon: FiGrid, color: "#6b7280" },
    { value: "CREATED", label: "생성", icon: FiPlusCircle, color: "#10b981" },
    { value: "UPDATED", label: "수정", icon: FiEdit, color: "#3b82f6" },
    { value: "DELETED", label: "삭제", icon: FiTrash, color: "#ef4444" },
    { value: "RESTORED", label: "복구", icon: FiRefreshCw, color: "#8b5cf6" },
  ];

  const LOG_TYPE_OPTIONS = [
    { value: "ALL", label: "전체", icon: FiGrid, color: "#6b7280" },
    { value: "POST", label: "게시글", icon: FiFileText, color: "#3b82f6" },
    { value: "USER", label: "사용자", icon: FiUser, color: "#10b981" },
    {
      value: "PROJECT",
      label: "프로젝트",
      icon: FiPackage,
      color: "#8b5cf6",
    },
    { value: "COMPANY", label: "회사", icon: FiHome, color: "#f59e0b" },
    { value: "STEP", label: "단계", icon: FiLayers, color: "#ef4444" },
    {
      value: "CHECKLIST",
      label: "체크리스트",
      icon: FiCheckSquare,
      color: "#84cc16",
    },
    {
      value: "INQUIRY",
      label: "관리자 문의",
      icon: FiMessageSquare,
      color: "#06b6d4",
    },
  ];

  const ROLE_OPTIONS = [
    { value: "ALL", label: "전체", icon: FiUser, color: "#6b7280" },
    {
      value: "ROLE_ADMIN",
      label: "관리자",
      icon: RiUserSettingsLine,
      color: "#8b5cf6",
    },
    { value: "ROLE_USER", label: "사용자", icon: FiUser, color: "#6b7280" },
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
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target as Node)
      ) {
        setRoleDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 이력 데이터 가져오기
  const fetchActivityLogs = async (
    page: number = 0,
    customFilters?: {
      historyType?: string;
      domainType?: string;
      changedBy?: string;
      changedFrom?: string;
      changedTo?: string;
      changerRole?: string;
    }
  ) => {
    // 첫 페이지가 아니거나 초기 로드가 아닌 경우에만 로딩 표시
    if (page === 0 && activityLogs.length > 0) {
      setLoading(true);
    }
    setError(null);

    try {
      const filters = customFilters || {
        historyType: actionFilter !== "ALL" ? actionFilter : undefined,
        domainType: logTypeFilter !== "ALL" ? logTypeFilter : undefined,
        changedBy: searchTerm.trim() || undefined,
        changerRole:
          roleFilter !== "ALL" ? roleFilter.replace("ROLE_", "") : undefined,
        changedFrom: startDate || undefined,
        changedTo: endDate || undefined,
      };

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

  const getTargetTypeIcon = (targetType: string) => {
    switch (targetType) {
      case "USER":
        return <FiUser style={{ color: "#6366f1" }} />;
      case "COMPANY":
        return <FiHome style={{ color: "#8b5cf6" }} />;
      case "PROJECT":
        return <FiPackage style={{ color: "#3b82f6" }} />;
      case "STEP":
        return <FiLayers style={{ color: "#6366f1" }} />;
      case "POST":
        return <FiFileText style={{ color: "#10b981" }} />;
      case "INQUIRY":
        return <FiMessageSquare style={{ color: "#f59e0b" }} />;
      case "CHECKLIST":
        return <FiCheckSquare style={{ color: "#ec4899" }} />;
      default:
        return <FiGrid style={{ color: "#6b7280" }} />;
    }
  };

  const getActionBadgeStyle = (action: string) => {
    switch (action) {
      case "CREATED":
        return {
          backgroundColor: "#dcfce7",
          color: "#166534",
          fontWeight: "600",
          padding: "2px 8px",
          borderRadius: "12px",
          fontSize: "0.7rem",
        };
      case "UPDATED":
        return {
          backgroundColor: "#dbeafe",
          color: "#1e40af",
          fontWeight: "600",
          padding: "2px 8px",
          borderRadius: "12px",
          fontSize: "0.7rem",
        };
      case "DELETED":
        return {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          fontWeight: "600",
          padding: "2px 8px",
          borderRadius: "12px",
          fontSize: "0.7rem",
        };
      case "RESTORED":
        return {
          backgroundColor: "#f3e8ff",
          color: "#7c3aed",
          fontWeight: "600",
          padding: "2px 8px",
          borderRadius: "12px",
          fontSize: "0.7rem",
        };
      default:
        return {
          backgroundColor: "#f3f4f6",
          color: "#374151",
          fontWeight: "600",
          padding: "2px 8px",
          borderRadius: "12px",
          fontSize: "0.7rem",
        };
    }
  };

  const formatDateOnlyLocal = (dateString: string) => {
    return formatDateOnly(dateString);
  };

  const formatTimeOnlyLocal = (dateString: string) => {
    return formatTimeOnly(dateString);
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "선택";
    return formatDateOnly(dateString);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchActivityLogs(0);
  };

  const handleReset = () => {
    setActionFilter("ALL");
    setLogTypeFilter("ALL");
    setRoleFilter("ALL");
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setCurrentPage(0);
    fetchActivityLogs(0);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchActivityLogs(newPage);
  };

  // 10개씩 앞뒤로 가는 함수
  const handleJumpForward = () => {
    const newPage = Math.min(currentPage + 10, pageInfo.totalPages - 1);
    handlePageChange(newPage);
  };

  const handleJumpBackward = () => {
    const newPage = Math.max(currentPage - 10, 0);
    handlePageChange(newPage);
  };

  // 검색어 입력 시 실시간 검색 (엔터키 또는 검색 버튼 클릭 시)
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 드롭다운 토글 함수들
  const handleActionDropdownToggle = () => {
    setActionDropdownOpen(!actionDropdownOpen);
  };

  const handleActionSelect = (value: string) => {
    setActionFilter(value);
    setActionDropdownOpen(false);
    setCurrentPage(0);
    const filters = {
      historyType: value !== "ALL" ? value : undefined,
      domainType: logTypeFilter !== "ALL" ? logTypeFilter : undefined,
      changedBy: searchTerm.trim() || undefined,
      changerRole:
        roleFilter !== "ALL" ? roleFilter.replace("ROLE_", "") : undefined,
      changedFrom: startDate || undefined,
      changedTo: endDate || undefined,
    };
    fetchActivityLogs(0, filters);
  };

  const handleLogTypeDropdownToggle = () => {
    setLogTypeDropdownOpen(!logTypeDropdownOpen);
  };

  const handleLogTypeSelect = (value: string) => {
    setLogTypeFilter(value);
    setLogTypeDropdownOpen(false);
    setCurrentPage(0);
    const filters = {
      historyType: actionFilter !== "ALL" ? actionFilter : undefined,
      domainType: value !== "ALL" ? value : undefined,
      changedBy: searchTerm.trim() || undefined,
      changerRole:
        roleFilter !== "ALL" ? roleFilter.replace("ROLE_", "") : undefined,
      changedFrom: startDate || undefined,
      changedTo: endDate || undefined,
    };
    fetchActivityLogs(0, filters);
  };

  const handleRoleDropdownToggle = () => {
    setRoleDropdownOpen(!roleDropdownOpen);
  };

  const handleRoleSelect = (value: string) => {
    setRoleFilter(value);
    setRoleDropdownOpen(false);
    setCurrentPage(0);
    const filters = {
      historyType: actionFilter !== "ALL" ? actionFilter : undefined,
      domainType: logTypeFilter !== "ALL" ? logTypeFilter : undefined,
      changedBy: searchTerm.trim() || undefined,
      changerRole: value !== "ALL" ? value.replace("ROLE_", "") : undefined,
      changedFrom: startDate || undefined,
      changedTo: endDate || undefined,
    };
    fetchActivityLogs(0, filters);
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

  const getCurrentRoleOption = () => {
    return (
      ROLE_OPTIONS.find((option) => option.value === roleFilter) ||
      ROLE_OPTIONS[0]
    );
  };

  // 날짜 관련 핸들러
  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().slice(0, 19); // YYYY-MM-DDTHH:mm:ss
      setStartDate(formattedDate);
      setStartDateOpen(false);
      setCurrentPage(0);
      const filters = {
        historyType: actionFilter !== "ALL" ? actionFilter : undefined,
        domainType: logTypeFilter !== "ALL" ? logTypeFilter : undefined,
        changedBy: searchTerm.trim() || undefined,
        changerRole:
          roleFilter !== "ALL" ? roleFilter.replace("ROLE_", "") : undefined,
        changedFrom: formattedDate,
        changedTo: endDate || undefined,
      };
      fetchActivityLogs(0, filters);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().slice(0, 19); // YYYY-MM-DDTHH:mm:ss
      setEndDate(formattedDate);
      setEndDateOpen(false);
      setCurrentPage(0);
      const filters = {
        historyType: actionFilter !== "ALL" ? actionFilter : undefined,
        domainType: logTypeFilter !== "ALL" ? logTypeFilter : undefined,
        changedBy: searchTerm.trim() || undefined,
        changerRole:
          roleFilter !== "ALL" ? roleFilter.replace("ROLE_", "") : undefined,
        changedFrom: startDate || undefined,
        changedTo: formattedDate,
      };
      fetchActivityLogs(0, filters);
    }
  };

  const handleStartDateClick = () => {
    setStartDateOpen(!startDateOpen);
    setEndDateOpen(false);
  };

  const handleEndDateClick = () => {
    setEndDateOpen(!endDateOpen);
    setStartDateOpen(false);
  };

  // 상세조회 모달 핸들러
  const handleDetailModalOpen = (historyId: string) => {
    setSelectedHistoryId(historyId);
    setDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setDetailModalOpen(false);
    setSelectedHistoryId("");
  };

  if (loading && activityLogs.length === 0) return <LoadingSpinner />;
  if (error && activityLogs.length === 0)
    return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <PageContainer>
      <Header>
        <Title>이력 관리</Title>
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
          <FilterLabel>변경자 역할</FilterLabel>
          <div style={{ position: "relative" }} ref={roleDropdownRef}>
            <SelectButton
              type="button"
              onClick={handleRoleDropdownToggle}
              $hasValue={roleFilter !== "ALL"}
              $color={getCurrentRoleOption().color}
              className={roleDropdownOpen ? "open" : ""}
            >
              {React.createElement(getCurrentRoleOption().icon, { size: 16 })}
              <span className="select-value">
                {getCurrentRoleOption().label}
              </span>
              <FiChevronDown size={16} />
            </SelectButton>
            <SelectDropdown $isOpen={roleDropdownOpen}>
              {ROLE_OPTIONS.map((option) => (
                <SelectOption
                  key={option.value}
                  $isSelected={roleFilter === option.value}
                  onClick={() => handleRoleSelect(option.value)}
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
                    maxDate={endDate ? new Date(endDate) : undefined}
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
                    minDate={startDate ? new Date(startDate) : undefined}
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
            onKeyDown={handleSearchKeyPress}
          />
          <FilterButton onClick={handleSearch}>
            <FiSearch size={16} />
          </FilterButton>
          <FilterButton onClick={handleReset}>
            <FiRotateCcw size={16} />
          </FilterButton>
        </SearchRight>
      </FilterSection>

      {loading && activityLogs.length > 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "8px",
            color: "#6b7280",
            fontSize: "14px",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          데이터를 불러오는 중...
        </div>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader style={{ width: "120px" }}>작업</TableHeader>
              <TableHeader style={{ width: "200px" }}>변경자 권한</TableHeader>
              <TableHeader style={{ width: "180px" }}>대상</TableHeader>
              <TableHeader style={{ width: "300px" }}>상세내용</TableHeader>
              <TableHeader style={{ width: "200px" }}>
                변경 발생 일시
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {activityLogs.map((log) => (
              <TableRow
                key={log.id}
                onClick={() => handleDetailModalOpen(log.id)}
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#fefdf4";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <TableCell style={{ width: "120px" }}>
                  <StatusBadge style={getActionBadgeStyle(log.action)}>
                    {log.action === "CREATED" && "생성"}
                    {log.action === "UPDATED" && "수정"}
                    {log.action === "DELETED" && "삭제"}
                    {log.action === "RESTORED" && "복구"}
                  </StatusBadge>
                </TableCell>
                <TableCell style={{ width: "200px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {log.userRole === "ROLE_ADMIN" ? (
                      <LuUserRoundCog size={14} style={{ color: "#8b5cf6" }} />
                    ) : (
                      <FiUser size={14} style={{ color: "#6b7280" }} />
                    )}
                    <span style={{ fontWeight: "500" }}>{log.userName}</span>
                    {log.changerUsername && (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#6b7280",
                          marginLeft: "-7px",
                        }}
                      >
                        ({log.changerUsername})
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell style={{ width: "180px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {getTargetTypeIcon(log.targetType)}
                    <span style={{ fontWeight: "500" }}>{log.targetName}</span>
                  </div>
                </TableCell>
                <TableCell style={{ width: "300px" }}>
                  <span style={{ fontSize: "14px", color: "#374151" }}>
                    {log.details}
                  </span>
                </TableCell>
                <TableCell style={{ width: "200px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <FiCalendar size={14} style={{ color: "#8b5cf6" }} />
                    <span style={{ fontSize: "14px", color: "#374151" }}>
                      {formatDateOnlyLocal(log.createdAt)}
                    </span>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      {formatTimeOnlyLocal(log.createdAt)}
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
          {/* 첫 페이지로 이동 버튼 */}
          {currentPage > 0 && (
            <PaginationButton onClick={() => handlePageChange(0)}>
              맨 처음
            </PaginationButton>
          )}

          {/* 10개씩 뒤로 가기 버튼 */}
          {currentPage >= 10 && (
            <PaginationButton onClick={handleJumpBackward}>
              -10
            </PaginationButton>
          )}

          {/* 이전 버튼 */}
          {currentPage > 0 && (
            <PaginationButton onClick={() => handlePageChange(currentPage - 1)}>
              이전
            </PaginationButton>
          )}

          {/* 페이지 번호 버튼들을 스마트하게 생성 */}
          {(() => {
            const totalPages = pageInfo.totalPages;
            const current = currentPage;
            const pages: (number | string)[] = [];

            if (totalPages <= 7) {
              // 총 페이지가 7개 이하면 모든 페이지 표시
              for (let i = 0; i < totalPages; i++) {
                pages.push(i);
              }
            } else {
              // 총 페이지가 8개 이상이면 스마트 페이지네이션
              if (current <= 3) {
                // 현재 페이지가 앞쪽에 있는 경우
                for (let i = 0; i <= 4; i++) {
                  pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages - 1);
              } else if (current >= totalPages - 4) {
                // 현재 페이지가 뒤쪽에 있는 경우
                pages.push(0);
                pages.push("...");
                for (let i = totalPages - 5; i < totalPages; i++) {
                  pages.push(i);
                }
              } else {
                // 현재 페이지가 중간에 있는 경우
                pages.push(0);
                pages.push("...");
                for (let i = current - 1; i <= current + 1; i++) {
                  pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages - 1);
              }
            }

            return pages.map((page, idx) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    style={{
                      padding: "8px 12px",
                      color: "#6b7280",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              return (
                <PaginationButton
                  key={pageNum}
                  $active={currentPage === pageNum}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum + 1}
                </PaginationButton>
              );
            });
          })()}

          {/* 다음 버튼 */}
          {currentPage + 1 < pageInfo.totalPages && (
            <PaginationButton onClick={() => handlePageChange(currentPage + 1)}>
              다음
            </PaginationButton>
          )}

          {/* 10개씩 앞으로 가기 버튼 */}
          {currentPage + 10 < pageInfo.totalPages && (
            <PaginationButton onClick={handleJumpForward}>+10</PaginationButton>
          )}

          {/* 마지막 페이지로 이동 버튼 */}
          {currentPage + 1 < pageInfo.totalPages && (
            <PaginationButton
              onClick={() => handlePageChange(pageInfo.totalPages - 1)}
            >
              맨 마지막
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

      {/* 이력 상세조회 모달 */}
      <ActivityLogDetailModal
        isOpen={detailModalOpen}
        onClose={handleDetailModalClose}
        historyId={selectedHistoryId}
        onRestoreSuccess={fetchActivityLogs}
      />
    </PageContainer>
  );
}
