import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiRotateCcw,
  FiPlus,
  FiList,
  FiCheckCircle,
  FiClock,
  FiCalendar,
} from "react-icons/fi";
import {
  SelectButton,
  SelectDropdown,
  SelectOption,
  NewButton,
} from "../company/components/CompanyFilterBar.styled";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  DateButton,
  DateRangeGroup,
  DatePickerStyles,
} from "../project/components/List/ProjectFilterBar.styled";
import api from "../../api/axios";
import InquiryRegisterModal from "./components/InquiryRegisterModal/InquiryRegisterModal";

const Container = styled.div`
  padding: 32px 32px;
  background-color: #f9fafb;
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: -7px;
  padding-left: 16px;
  position: relative;
  color: #111827;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 1.4rem;
    background: #fdb924;
    border-radius: 2px;
  }
`;

const Subtitle = styled.p`
  color: #bdbdbd;
  font-size: 0.9rem;
  margin-bottom: 18px;
`;

const TableContainer = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  min-height: 540px;
  border-bottom: 1px solid #f3f4f6;
  position: relative;
`;

const Table = styled.table`
  width: 100%;
  font-size: 14px;
  border-collapse: collapse;
  table-layout: fixed;
  background: #fff;
  position: relative;
  z-index: 1;
`;

const TableHead = styled.thead`
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const TableHeader = styled.th`
  height: 48px;
  padding: 12px 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  font-size: 13px;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  height: 48px;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9fafb;
  }
`;

const TableCell = styled.td`
  padding: 10px 12px;
  text-align: left;
  color: #374151;
  vertical-align: middle;
  font-size: 14px;
`;

const InquiryTitleCell = styled(TableCell)`
  color: #374151;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: #3b82f6;
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ $status }: { $status: string }) =>
    $status === "답변완료"
      ? "#16a34a"
      : $status === "답변대기"
      ? "#d97706"
      : "#4b5565"};
  background-color: ${({ $status }: { $status: string }) =>
    $status === "답변완료"
      ? "#dcfce7"
      : $status === "답변대기"
      ? "#fef3c7"
      : "#fff"};
`;

const FilterBar = styled.div`
  display: flex;
  gap: 20px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  align-items: flex-end;
  position: relative;
  overflow: visible;
  justify-content: flex-start;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 90px;
`;

const FilterLabel = styled.label`
  font-size: 0.92rem;
  color: #374151;
  font-weight: 500;
`;

const SearchInput = styled.input`
  min-width: 180px;
  max-width: 300px;
  padding: 10px 16px;
  font-size: 14px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background-color: #ffffff;
  color: #374151;
  transition: all 0.1s ease;
  outline: none;
  &::placeholder {
    color: #9ca3af;
  }
  &:focus {
    border-color: #fdb924;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
  }
  &:hover {
    border-color: #d1d5db;
  }
`;

const STATUS_OPTIONS = [
  { value: "", label: "전체" },
  { value: "답변대기", label: "답변대기" },
  { value: "답변완료", label: "답변완료" },
];

const STATUS_OPTION_META: Record<string, { color: string; bg: string; icon: React.ReactElement }> = {
  "": {
    color: "#6b7280",
    bg: "#f3f4f6",
    icon: (
      <FiList
        size={16}
        style={{ marginRight: 8, color: "#6b7280", flexShrink: 0 }}
      />
    ),
  },
  답변완료: {
    color: "#10b981",
    bg: "#ecfdf5",
    icon: (
      <FiCheckCircle
        size={16}
        style={{ marginRight: 8, color: "#10b981", flexShrink: 0 }}
      />
    ),
  },
  답변대기: {
    color: "#f59e0b",
    bg: "#fffbe8",
    icon: (
      <FiClock
        size={16}
        style={{ marginRight: 8, color: "#f59e0b", flexShrink: 0 }}
      />
    ),
  },
};

const ActionButtons = styled.div`
  margin-left: auto;
`;

interface Inquiry {
  id: number;
  authorName: string;
  title: string;
  inquiryStatus: string;
  createdAt: string;
}

interface InquiryFilterBarProps {
  filters: {
    searchField: string;
    searchValue: string;
    startDate: string;
    endDate: string;
    status: string;
  };
  onChange: (field: string, value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRegisterClick: () => void;
}

function InquiryFilterBar({
  filters,
  onChange,
  onSearch,
  onReset,
  onKeyDown,
  onRegisterClick,
}: InquiryFilterBarProps) {
  const [searchFieldDropdownOpen, setSearchFieldDropdownOpen] =
    React.useState(false);
  const searchFieldDropdownRef = React.useRef<HTMLDivElement>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = React.useState(false);
  const statusDropdownRef = React.useRef<HTMLDivElement>(null);
  const [startDateOpen, setStartDateOpen] = React.useState(false);
  const [endDateOpen, setEndDateOpen] = React.useState(false);

  React.useEffect(() => {
    if (!searchFieldDropdownOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchFieldDropdownOpen(false);
    };
    const handleClick = (e: MouseEvent) => {
      if (
        searchFieldDropdownRef.current &&
        !searchFieldDropdownRef.current.contains(e.target as Node)
      ) {
        setSearchFieldDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [searchFieldDropdownOpen]);

  React.useEffect(() => {
    if (!statusDropdownOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setStatusDropdownOpen(false);
    };
    const handleClick = (e: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(e.target as Node)
      ) {
        setStatusDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [statusDropdownOpen]);

  const getStatusLabel = (value: string) => {
    const option = STATUS_OPTIONS.find((opt) => opt.value === value);
    return option ? option.label : "전체";
  };

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      onChange("startDate", formattedDate);
    }
    setStartDateOpen(false);
  };
  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      onChange("endDate", formattedDate);
    }
    setEndDateOpen(false);
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return "선택 안함";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <DatePickerStyles>
      <FilterBar>
        <FilterGroup
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 6,
            minWidth: 220,
          }}
        >
          <FilterLabel>검색</FilterLabel>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              gap: 8,
            }}
          >
            {/* 검색필드 드롭다운 제거, 제목만 사용 */}
            <SearchInput
              type="text"
              placeholder="제목을 입력하세요"
              value={filters.searchValue}
              onChange={(e) => onChange("searchValue", e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>답변 상태</FilterLabel>
          <div style={{ position: "relative" }} ref={statusDropdownRef}>
            <SelectButton
              type="button"
              onClick={() => setStatusDropdownOpen((prev) => !prev)}
              className={statusDropdownOpen ? "open" : ""}
              style={{
                padding: "0 12px",
                width: 150,
                height: 36,
                minHeight: 36,
                display: "flex",
                alignItems: "center",
                gap: 0,
                background: STATUS_OPTION_META[filters.status as keyof typeof STATUS_OPTION_META]?.bg,
                color: STATUS_OPTION_META[filters.status as keyof typeof STATUS_OPTION_META]?.color,
                border: `2px solid ${STATUS_OPTION_META[filters.status as keyof typeof STATUS_OPTION_META]?.color || "#e5e7eb"}`,
                fontWeight: filters.status ? 700 : 500,
                transition: "all 0.18s",
              }}
              $hasValue={!!filters.status}
            >
              {STATUS_OPTION_META[filters.status as keyof typeof STATUS_OPTION_META]?.icon}
              <span
                className="select-value"
                style={{
                  marginRight: 8,
                  minWidth: 36,
                  textAlign: "left",
                  display: "inline-block",
                }}
              >
                {getStatusLabel(filters.status)}
              </span>
            </SelectButton>
            <SelectDropdown
              $isOpen={statusDropdownOpen}
              style={{ minWidth: 150 }}
            >
              {STATUS_OPTIONS.map((option) => (
                <SelectOption
                  key={option.value}
                  $isSelected={filters.status === option.value}
                  onClick={() => {
                    onChange("status", option.value);
                    setStatusDropdownOpen(false);
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      marginRight: 6,
                      color: STATUS_OPTION_META[option.value as keyof typeof STATUS_OPTION_META]?.color,
                    }}
                  >
                    {STATUS_OPTION_META[option.value as keyof typeof STATUS_OPTION_META]?.icon}
                  </span>
                  {option.label}
                </SelectOption>
              ))}
            </SelectDropdown>
          </div>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>작성일</FilterLabel>
          <DateRangeGroup>
            <div style={{ position: "relative" }}>
              <DateButton
                type="button"
                onClick={() => {
                  setEndDateOpen(false);
                  setStartDateOpen((prev) => !prev);
                }}
                $hasValue={!!filters.startDate}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <FiCalendar
                  size={16}
                  style={{ color: "#fdb924", marginRight: 4 }}
                />
                <span>시작일</span>
                <span className="date-value">
                  {formatDate(filters.startDate)}
                </span>
              </DateButton>
              {startDateOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    zIndex: 1000,
                    marginTop: 4,
                  }}
                >
                  <DatePicker
                    selected={
                      filters.startDate ? new Date(filters.startDate) : null
                    }
                    onChange={handleStartDateChange}
                    selectsStart
                    startDate={
                      filters.startDate ? new Date(filters.startDate) : null
                    }
                    endDate={filters.endDate ? new Date(filters.endDate) : null}
                    maxDate={
                      filters.endDate ? new Date(filters.endDate) : undefined
                    }
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
            </div>
            <span
              style={{
                color: "#6b7280",
                fontWeight: 600,
                fontSize: "0.9rem",
                padding: "0 4px",
              }}
            >
              ~
            </span>
            <div style={{ position: "relative" }}>
              <DateButton
                type="button"
                onClick={() => {
                  setStartDateOpen(false);
                  setEndDateOpen((prev) => !prev);
                }}
                $hasValue={!!filters.endDate}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <FiCalendar
                  size={16}
                  style={{ color: "#fdb924", marginRight: 4 }}
                />
                <span>종료일</span>
                <span className="date-value">
                  {formatDate(filters.endDate)}
                </span>
              </DateButton>
              {endDateOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    zIndex: 1000,
                    marginTop: 4,
                  }}
                >
                  <DatePicker
                    selected={
                      filters.endDate ? new Date(filters.endDate) : null
                    }
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={
                      filters.startDate ? new Date(filters.startDate) : null
                    }
                    endDate={filters.endDate ? new Date(filters.endDate) : null}
                    minDate={
                      filters.startDate
                        ? new Date(filters.startDate)
                        : undefined
                    }
                    dateFormat="yyyy-MM-dd"
                    placeholderText="종료일 선택"
                    inline
                    onClickOutside={() => setEndDateOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setEndDateOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
          </DateRangeGroup>
        </FilterGroup>
        <div style={{ display: "flex", gap: 8 }}>
          <NewButton
            style={{
              minWidth: "auto",
              padding: "10px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={onSearch}
          >
            <FiSearch size={16} />
          </NewButton>
          <NewButton
            style={{
              minWidth: "auto",
              padding: "10px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={onReset}
            title="초기화"
          >
            <FiRotateCcw size={16} />
          </NewButton>
        </div>
        <ActionButtons>
          <NewButton
            style={{
              height: "45px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "0 16px",
            }}
            onClick={onRegisterClick}
          >
            <FiPlus size={16} />
            <span>문의하기</span>
          </NewButton>
        </ActionButtons>
      </FilterBar>
    </DatePickerStyles>
  );
}

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
  gap: 0.7rem;
`;

const PaginationInfo = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 0.825rem;
  margin-top: 0.75rem;
  margin-bottom: 0.1rem;
`;

const PaginationNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 0.32rem 0.6rem;
  border: none;
  background: transparent;
  color: ${({ $active }) => ($active ? "#fff" : "#111827")};
  border-radius: 1.2rem;
  font-size: 0.75rem;
  font-weight: 500;
  box-shadow: none;
  cursor: pointer;
  outline: none;
  min-width: 28px;
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ $active }) =>
    $active &&
    `
      background: #fdb924;
      color: #fff;
    `}
`;

export default function UserInquiryPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [page, setPage] = useState(0); // 0-based
  const [pageInfo, setPageInfo] = useState({
    size: 10,
    number: 0,
    totalElements: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    searchField: "title",
    searchValue: "",
    startDate: "",
    endDate: "",
    status: "",
  });
  const navigate = useNavigate();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // debounce용 ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const prevSearchValue = useRef(filters.searchValue);

  const fetchInquiries = async (pageNumber = 0) => {
    try {
      const response = await api.get(
        `/api/inquiries/my?page=${pageNumber}&size=10&sort=createdAt,desc`
      );
      const data = response.data.data;
      setInquiries(data.content);
      setPageInfo(data.page);
      setPage(data.page.number);
    } catch (error) {
      console.error("문의사항 목록을 불러오는데 실패했습니다.", error);
    }
  };

  const fetchFilteredInquiries = async (pageNumber = 0) => {
    try {
      const params = new URLSearchParams();
      params.append("page", String(pageNumber));
      params.append("size", "10");
      params.append("sort", "createdAt,desc");
      if (filters.searchValue) {
        params.append("title", filters.searchValue);
      }
      let statusParam = filters.status;
      if (statusParam === "답변완료") statusParam = "ANSWERED";
      if (statusParam === "답변대기") statusParam = "WAITING";
      if (statusParam) {
        params.append("status", statusParam);
      }
      if (filters.startDate) {
        params.append("startDate", filters.startDate);
      }
      if (filters.endDate) {
        params.append("endDate", filters.endDate);
      }
      const response = await api.get(
        `/api/inquiries/my/filtering?${params.toString()}`
      );
      const data = response.data.data;
      setInquiries(data.content);
      setPageInfo(data.page);
      setPage(data.page.number);
    } catch (error) {
      console.error("필터링된 문의사항 목록을 불러오는데 실패했습니다.", error);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // 필터 변경 시 자동 요청 (searchValue는 debounce)
  useEffect(() => {
    if (prevSearchValue.current !== filters.searchValue) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        fetchFilteredInquiries(0);
      }, 300);
      prevSearchValue.current = filters.searchValue;
    } else {
      fetchFilteredInquiries(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.startDate, filters.endDate, filters.searchField]);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchFilteredInquiries(0);
    }, 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.searchValue]);

  const handleTitleClick = (id: number) => {
    navigate(`/inquiry/${id}`);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const getPaginationInfo = () => {
    if (pageInfo.totalElements === 0) return "표시할 문의가 없습니다.";
    const start = pageInfo.number * pageInfo.size + 1;
    const end = Math.min(
      (pageInfo.number + 1) * pageInfo.size,
      pageInfo.totalElements
    );
    return `총 ${pageInfo.totalElements}개의 문의 중 ${start}-${end}개 표시`;
  };

  const pagedData = inquiries;

  return (
    <Container>
      <HeaderSection>
        <Title>내 문의사항</Title>
        <Subtitle>내 문의사항을 한눈에 확인하세요</Subtitle>
      </HeaderSection>
      <InquiryFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onSearch={() => fetchFilteredInquiries(0)} // Reset to first page on search
        onReset={() => {
          setFilters({
            searchField: "title",
            searchValue: "",
            startDate: "",
            endDate: "",
            status: "",
          });
          fetchInquiries(0);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            fetchFilteredInquiries(0);
          }
        }}
        onRegisterClick={() => setIsRegisterModalOpen(true)}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>제목</TableHeader>
              <TableHeader>작성자</TableHeader>
              <TableHeader>작성일</TableHeader>
              <TableHeader>상태</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedData.map((inq) => {
              const statusText =
                inq.inquiryStatus === "WAITING" ? "답변대기" : "답변완료";
              const formattedDate = new Date(inq.createdAt).toLocaleDateString(
                "ko-KR"
              );
              return (
                <TableRow
                  key={inq.id}
                  onClick={() => handleTitleClick(inq.id)}
                  style={{ cursor: "pointer" }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#f9fafb")
                  }
                  onMouseOut={(e) => (e.currentTarget.style.background = "")}
                >
                  <InquiryTitleCell>{inq.title}</InquiryTitleCell>
                  <TableCell>{inq.authorName}</TableCell>
                  <TableCell>{formattedDate}</TableCell>
                  <TableCell>
                    <StatusBadge $status={statusText}>{statusText}</StatusBadge>
                  </TableCell>
                </TableRow>
              );
            })}
            {Array.from({ length: pageInfo.size - pagedData.length }).map(
              (_, idx) => (
                <TableRow key={`empty-${idx}`}>
                  <TableCell
                    colSpan={4}
                    style={{
                      height: 48,
                      background: "#f9fafb",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  />
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {isRegisterModalOpen && (
        <InquiryRegisterModal
          onClose={() => setIsRegisterModalOpen(false)}
          onSuccess={() => {
            setIsRegisterModalOpen(false);
            fetchInquiries();
          }}
        />
      )}

      <PaginationContainer>
        {pageInfo.totalElements > 0 && (
          <PaginationNav>
            {/* 첫 페이지로 이동 버튼 */}
            {page > 0 && (
              <PaginationButton onClick={() => fetchInquiries(0)}>
                맨 처음
              </PaginationButton>
            )}

            {/* 10개씩 뒤로 가기 버튼 */}
            {page > 0 && (
              <PaginationButton onClick={() => fetchInquiries(page - 1)}>
                -10
              </PaginationButton>
            )}

            {page > 0 && (
              <PaginationButton onClick={() => fetchInquiries(page - 1)}>
                이전
              </PaginationButton>
            )}
            {Array.from({ length: pageInfo.totalPages }, (_, idx) =>
              idx === page ? (
                <PaginationButton key={idx + 1} $active>
                  {idx + 1}
                </PaginationButton>
              ) : (
                <PaginationButton
                  key={idx + 1}
                  onClick={() => fetchInquiries(idx)}
                >
                  {idx + 1}
                </PaginationButton>
              )
            )}
            {page < pageInfo.totalPages - 1 && (
              <PaginationButton onClick={() => fetchInquiries(page + 1)}>
                다음
              </PaginationButton>
            )}

            {/* 10개씩 앞으로 가기 버튼 */}
            {page + 1 < pageInfo.totalPages && (
              <PaginationButton onClick={() => fetchInquiries(page + 1)}>
                +10
              </PaginationButton>
            )}

            {/* 마지막 페이지로 이동 버튼 */}
            {page < pageInfo.totalPages - 1 && (
              <PaginationButton
                onClick={() => fetchInquiries(pageInfo.totalPages - 1)}
              >
                맨 마지막
              </PaginationButton>
            )}
          </PaginationNav>
        )}
        <PaginationInfo>{getPaginationInfo()}</PaginationInfo>
      </PaginationContainer>
    </Container>
  );
}
