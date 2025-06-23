import React, { useState, useEffect } from "react";
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
} from "./ActivityLogPage.styled";
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
} from "react-icons/fi";

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

export default function ActivityLogPage() {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [userFilter, setUserFilter] = useState("ALL");

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
        return <FiFileText style={{ color: "#3b82f6" }} />;
      case "POST":
        return <FiFileText style={{ color: "#10b981" }} />;
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
    setUserFilter("ALL");
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <PageContainer>
      <Header>
        <Title>활동 이력</Title>
        <Description>
          사용자들의 사이트 활동 내역을 확인할 수 있습니다
        </Description>
      </Header>

      <FilterSection>
        <FilterGroup>
          <FilterLabel>검색</FilterLabel>
          <SearchInput
            type="text"
            placeholder="사용자명, 대상명, 상세내용으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>작업 유형</FilterLabel>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            <option value="ALL">전체</option>
            <option value="CREATE">생성</option>
            <option value="UPDATE">수정</option>
            <option value="DELETE">삭제</option>
          </select>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>사용자 유형</FilterLabel>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            <option value="ALL">전체</option>
            <option value="ROLE_ADMIN">관리자</option>
            <option value="ROLE_USER">일반 사용자</option>
          </select>
        </FilterGroup>
        <FilterButton onClick={handleSearch}>
          <FiSearch size={16} />
          검색
        </FilterButton>
        <FilterButton onClick={handleReset}>
          <FiRotateCcw size={16} />
          초기화
        </FilterButton>
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
        <PaginationInfo>
          총 {totalElements}개 항목 중 {currentPage * 10 + 1}-
          {Math.min((currentPage + 1) * 10, totalElements)}개 표시
        </PaginationInfo>
        <PaginationNav>
          <PaginationButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            이전
          </PaginationButton>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationButton
              key={i}
              onClick={() => handlePageChange(i)}
              style={{
                backgroundColor: currentPage === i ? "#fdb924" : "transparent",
                color: currentPage === i ? "#ffffff" : "#374151",
              }}
            >
              {i + 1}
            </PaginationButton>
          ))}
          <PaginationButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            다음
          </PaginationButton>
        </PaginationNav>
      </PaginationContainer>
    </PageContainer>
  );
}
