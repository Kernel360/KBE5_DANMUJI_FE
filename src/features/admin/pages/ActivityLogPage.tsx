import React, { useState, useEffect, useRef } from "react";
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

interface ActivityLog {
  id: number;
  userId: number;
  userName: string;
  userRole: string;
  action: string;
  targetType: string;
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

export default function ActivityLogPage() {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [logTypeFilter, setLogTypeFilter] = useState("ALL");
  const [logTypeDropdownOpen, setLogTypeDropdownOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);

  // 드롭다운 상태
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
  const actionDropdownRef = useRef<HTMLDivElement>(null);
  const logTypeDropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 옵션
  const ACTION_OPTIONS = [
    { value: "ALL", label: "전체", icon: FiGrid, color: "#6b7280" },
    { value: "CREATE", label: "생성", icon: FiPlus, color: "#10b981" },
    { value: "UPDATE", label: "수정", icon: FiEdit, color: "#3b82f6" },
    { value: "DELETE", label: "삭제", icon: FiTrash, color: "#ef4444" },
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
      value: "PROJECT_STEP",
      label: "프로젝트 단계",
      icon: FiLayers,
      color: "#6366f1",
    },
    { value: "POST", label: "게시글", icon: FiFileText, color: "#10b981" },
    { value: "QUESTION", label: "문의", icon: FiHelpCircle, color: "#f97316" },
    { value: "CHAT", label: "채팅", icon: FiMessageCircle, color: "#f472b6" },
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

  // 임시 데이터
  const mockActivityLogs: ActivityLog[] = [
    {
      id: 1,
      userId: 1,
      userName: "관리자",
      userRole: "ROLE_ADMIN",
      action: "CREATE",
      targetType: "USER",
      targetName: "홍길동",
      details: "새 회원 등록",
      ipAddress: "192.168.1.100",
      createdAt: "2024-01-15 14:30:00",
    },
    {
      id: 2,
      userId: 2,
      userName: "김개발",
      userRole: "ROLE_USER",
      action: "CREATE",
      targetType: "POST",
      targetName: "프로젝트 진행상황 보고",
      details: "새 게시글 작성",
      ipAddress: "192.168.1.101",
      createdAt: "2024-01-15 13:45:00",
    },
    {
      id: 3,
      userId: 1,
      userName: "관리자",
      userRole: "ROLE_ADMIN",
      action: "UPDATE",
      targetType: "COMPANY",
      targetName: "ABC기업",
      details: "회사 정보 수정",
      ipAddress: "192.168.1.100",
      createdAt: "2024-01-15 12:20:00",
    },
    {
      id: 4,
      userId: 3,
      userName: "박고객",
      userRole: "ROLE_USER",
      action: "DELETE",
      targetType: "POST",
      targetName: "삭제된 게시글",
      details: "게시글 삭제",
      ipAddress: "192.168.1.102",
      createdAt: "2024-01-15 11:15:00",
    },
    {
      id: 5,
      userId: 1,
      userName: "관리자",
      userRole: "ROLE_ADMIN",
      action: "CREATE",
      targetType: "PROJECT",
      targetName: "웹사이트 리뉴얼 프로젝트",
      details: "새 프로젝트 생성",
      ipAddress: "192.168.1.100",
      createdAt: "2024-01-15 10:00:00",
    },
  ];

  useEffect(() => {
    // 임시로 mock 데이터 사용
    setActivityLogs(mockActivityLogs);
    setTotalElements(mockActivityLogs.length);
    setTotalPages(Math.ceil(mockActivityLogs.length / 10));
  }, []);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATE":
        return <FiPlus style={{ color: "#10b981" }} />;
      case "UPDATE":
        return <FiEdit style={{ color: "#3b82f6" }} />;
      case "DELETE":
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
      case "PROJECT_STEP":
        return <FiLayers style={{ color: "#6366f1" }} />;
      case "POST":
        return <FiFileText style={{ color: "#10b981" }} />;
      case "QUESTION":
        return <FiHelpCircle style={{ color: "#f97316" }} />;
      case "CHAT":
        return <FiMessageCircle style={{ color: "#f472b6" }} />;
      default:
        return <FiFileText style={{ color: "#6b7280" }} />;
    }
  };

  const getActionBadgeStyle = (action: string) => {
    switch (action) {
      case "CREATE":
        return { backgroundColor: "#d1fae5", color: "#065f46" };
      case "UPDATE":
        return { backgroundColor: "#dbeafe", color: "#1e40af" };
      case "DELETE":
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

  const handleSearch = () => {
    // 검색 로직 구현
    console.log("Search:", searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
    setActionFilter("ALL");
    setLogTypeFilter("ALL");
    setSelectedUser(null);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

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
          <FilterLabel>이력 유형</FilterLabel>
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
              <TableHeader>IP 주소</TableHeader>
              <TableHeader>작업일시</TableHeader>
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
                      gap: "8px",
                    }}
                  >
                    {getActionIcon(log.action)}
                    <StatusBadge style={getActionBadgeStyle(log.action)}>
                      {log.action === "CREATE" && "생성"}
                      {log.action === "UPDATE" && "수정"}
                      {log.action === "DELETE" && "삭제"}
                    </StatusBadge>
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
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
                      gap: "8px",
                    }}
                  >
                    {getTargetTypeIcon(log.targetType)}
                    <span style={{ fontWeight: "500" }}>{log.targetName}</span>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      ({log.targetType})
                    </span>
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
          {Array.from({ length: totalPages }, (_, idx) => (
            <PaginationButton
              key={idx}
              $active={currentPage === idx}
              onClick={() => handlePageChange(idx)}
            >
              {idx + 1}
            </PaginationButton>
          ))}

          {/* 마지막 페이지가 아니면 다음 버튼 렌더 */}
          {currentPage + 1 < totalPages && (
            <PaginationButton onClick={() => handlePageChange(currentPage + 1)}>
              다음
            </PaginationButton>
          )}
        </PaginationNav>
        <PaginationInfo>
          총 {totalElements}개 항목 중 {currentPage * 10 + 1}-
          {Math.min((currentPage + 1) * 10, totalElements)}개 표시
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
