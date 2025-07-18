import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FiGrid,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiCalendar,
  FiChevronDown,
  FiArrowUp,
  FiSearch,
  FiAlertCircle,
  FiRotateCcw,
  FiFileText,
  FiUsers,
} from "react-icons/fi";
import {
  FilterBar,
  FilterGroup,
  FilterLabel,
  SearchInput,
  DateRangeGroup,
  DateSeparator,
  DateButton,
  DatePickerWrapper,
  DatePickerStyles,
  SelectButton,
  SelectDropdown,
  SelectOption,
  StatusDropdownContainer,
  StatusDropdownButton,
  StatusDropdownMenu,
  StatusDropdownItem,
  NewButton,
} from "./ProjectFilterBar.styled";

const STATUS_MAP = {
  "": { label: "전체", icon: FiGrid, color: "#6b7280" },
  IN_PROGRESS: { label: "진행중", icon: FiClock, color: "#3b82f6" },
  COMPLETED: { label: "완료", icon: FiCheckCircle, color: "#10b981" },
  DELAY: { label: "지연", icon: FiAlertTriangle, color: "#ef4444" },
  DUE_SOON: { label: "기한임박", icon: FiAlertCircle, color: "#f59e42" },
} as const;

const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
];

const SEARCH_CATEGORY_OPTIONS = [
  {
    value: "projectName",
    label: "제목",
    icon: (color: string) => (
      <FiFileText size={16} style={{ marginRight: 8, color, flexShrink: 0 }} />
    ),
    color: "#f59e0b",
    gray: "#6b7280",
  },
  {
    value: "companyName",
    label: "업체",
    icon: (color: string) => (
      <FiUsers size={16} style={{ marginRight: 8, color, flexShrink: 0 }} />
    ),
    color: "#2563eb",
    gray: "#6b7280",
  },
];

interface ProjectFilterBarProps {
  filters: {
    projectStatus: string;
    sort: string;
    startDate: string;
    endDate: string;
    keyword: string;
    category: string;
  };
  onInputChange: (field: string, value: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

const ProjectFilterBar: React.FC<ProjectFilterBarProps> = ({
  filters,
  onInputChange,
  onSearch,
  onReset,
}) => {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    onSearch();
  };

  const handleResetFilters = () => {
    onInputChange("keyword", "");
    onReset();
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setClientModalOpen(false);
      }
    };

    if (clientModalOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [clientModalOpen]);

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (clientModalOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [clientModalOpen]);

  // ✅ parseDate 함수 추가 (UTC 파싱 이슈 해결)
  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "선택";
    // 기존: 2024.05.01 → '선택'으로, 선택 시 yyyy-MM-dd로
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "선택";
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 날짜 변환
  const formatDateToYyyyMmDd = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      const newStartDate = formatDateToYyyyMmDd(date);
      if (filters.endDate && date > parseDate(filters.endDate)!) {
        onInputChange("startDate", newStartDate);
        onInputChange("endDate", "");
      } else {
        onInputChange("startDate", newStartDate);
      }
      // 종료일이 있고, 시작일이 종료일보다 뒤라면 종료일 초기화
    }
    setStartDateOpen(false);
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      const newEndDate = formatDateToYyyyMmDd(date);
      onInputChange("endDate", newEndDate);
    }
    setEndDateOpen(false);
  };

  const handleStartDateClick = () => {
    setEndDateOpen(false); // 종료일 달력 닫기
    setStartDateOpen(!startDateOpen);
  };

  const handleEndDateClick = () => {
    setStartDateOpen(false); // 시작일 달력 닫기
    setEndDateOpen(!endDateOpen);
  };

  const handleSortDropdownToggle = () => {
    setSortDropdownOpen((prev) => {
      if (!prev) {
        setStatusDropdownOpen(false);
        setClientModalOpen(false);
      }
      return !prev;
    });
  };

  const handleSortSelect = (value: string) => {
    onInputChange("sort", value);
    setSortDropdownOpen(false);
  };

  const handleClientModalClose = () => {
    setClientModalOpen(false);
    setClientSearchTerm("");
  };

  const handleClientConfirm = () => {
    onInputChange("client", clientSearchTerm);
    setClientModalOpen(false);
  };

  const getSortLabel = (value: string) => {
    const option = SORT_OPTIONS.find((opt) => opt.value === value);
    return option ? option.label : "최신순";
  };

  const getSortColor = (value: string) => {
    switch (value) {
      case "latest":
        return "#f59e0b"; // 주황
      case "oldest":
        return "#3b82f6"; // 파랑
      default:
        return "#6b7280"; // 회색
    }
  };

  const handleStatusDropdownToggle = () => {
    setStatusDropdownOpen((prev) => {
      if (!prev) {
        setSortDropdownOpen(false);
        setClientModalOpen(false);
      }
      return !prev;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getStatusMap = (status: string) =>
    STATUS_MAP[status as keyof typeof STATUS_MAP] || STATUS_MAP[""];

  // 드롭다운 외부 클릭 시 닫기 (카테고리)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <DatePickerStyles>
      <FilterBar
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", gap: 10, flexGrow: 1 }}>
          <FilterGroup>
            <FilterLabel>정렬</FilterLabel>
            <div style={{ position: "relative" }} ref={sortDropdownRef}>
              <SelectButton
                type="button"
                onClick={handleSortDropdownToggle}
                $hasValue={!!filters.sort}
                $color={getSortColor(filters.sort)}
                className={sortDropdownOpen ? "open" : ""}
                style={{ paddingLeft: 10, paddingRight: 10, minWidth: 90 }}
              >
                <FiArrowUp size={16} />
                <span className="select-value">
                  {getSortLabel(filters.sort)}
                </span>
                <FiChevronDown size={16} />
              </SelectButton>
              <SelectDropdown $isOpen={sortDropdownOpen}>
                {SORT_OPTIONS.map((option) => (
                  <SelectOption
                    key={option.value}
                    $isSelected={filters.sort === option.value}
                    onClick={() => handleSortSelect(option.value)}
                  >
                    {option.label}
                  </SelectOption>
                ))}
              </SelectDropdown>
            </div>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>프로젝트 상태</FilterLabel>
            <StatusDropdownContainer ref={statusDropdownRef}>
              <StatusDropdownButton
                type="button"
                $active={!!filters.projectStatus}
                $color={getStatusMap(filters.projectStatus).color}
                $isOpen={statusDropdownOpen}
                onClick={handleStatusDropdownToggle}
              >
                {getStatusMap(filters.projectStatus).icon &&
                  React.createElement(
                    getStatusMap(filters.projectStatus).icon,
                    {
                      size: 16,
                      color: getStatusMap(filters.projectStatus).color,
                      style: { marginRight: 4 },
                    }
                  )}
                <span>{getStatusMap(filters.projectStatus).label}</span>
                <FiChevronDown size={16} />
              </StatusDropdownButton>
              <StatusDropdownMenu $isOpen={statusDropdownOpen}>
                {Object.entries(STATUS_MAP).map(
                  ([value, { label, icon: Icon, color }]) => (
                    <StatusDropdownItem
                      key={value}
                      $active={filters.projectStatus === value}
                      $color={color}
                      onClick={() => {
                        onInputChange("projectStatus", value);
                        setStatusDropdownOpen(false);
                      }}
                    >
                      <Icon
                        size={16}
                        color={color}
                        style={{ marginRight: 4 }}
                      />
                      <span>{label}</span>
                    </StatusDropdownItem>
                  )
                )}
              </StatusDropdownMenu>
            </StatusDropdownContainer>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>프로젝트 기간</FilterLabel>
            <DateRangeGroup>
              <DatePickerWrapper>
                <DateButton
                  type="button"
                  onClick={handleStartDateClick}
                  $hasValue={!!filters.startDate}
                >
                  <FiCalendar size={16} />
                  <span>시작일</span>
                  <span className="date-value">
                    {formatDate(filters.startDate)}
                  </span>
                </DateButton>
                {/* 시작일 DatePicker 팝업 */}
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
                      selected={
                        filters.startDate ? parseDate(filters.startDate) : null
                      } // ✅ new Date → parseDate로 교체
                      onChange={handleStartDateChange}
                      selectsStart
                      startDate={
                        filters.startDate ? parseDate(filters.startDate) : null
                      } // ✅ 교체
                      endDate={
                        filters.endDate ? parseDate(filters.endDate) : null
                      } // ✅ 교체
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
                  $hasValue={!!filters.endDate}
                >
                  <FiCalendar size={16} />
                  <span>종료일</span>
                  <span className="date-value">
                    {formatDate(filters.endDate)}
                  </span>
                </DateButton>
                {/* 종료일 DatePicker 팝업 */}
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
                      selected={
                        filters.endDate ? parseDate(filters.endDate) : null
                      } // ✅ 교체
                      onChange={handleEndDateChange}
                      selectsEnd
                      startDate={
                        filters.startDate ? parseDate(filters.startDate) : null
                      } // ✅ 교체
                      endDate={
                        filters.endDate ? parseDate(filters.endDate) : null
                      } // ✅ 교체
                      minDate={
                        filters.startDate
                          ? parseDate(filters.startDate)
                          : undefined
                      } // ✅ 교체
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
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FilterGroup style={{ marginBottom: 0 }}>
            <div
              style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}
            >
              <div style={{ position: "relative" }} ref={categoryDropdownRef}>
                <SelectButton
                  type="button"
                  onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                  $hasValue={!!filters.category}
                  $color={(() => {
                    const selected = SEARCH_CATEGORY_OPTIONS.find(
                      (opt) => opt.value === filters.category
                    );
                    if (selected && filters.category) {
                      return selected.color;
                    }
                    // 기본값(제목)일 때 노란색
                    return "#f59e0b";
                  })()}
                  className={categoryDropdownOpen ? "open" : ""}
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    minWidth: 90,
                    background:
                      filters.category &&
                      SEARCH_CATEGORY_OPTIONS.find(
                        (opt) => opt.value === filters.category
                      )
                        ? `${
                            SEARCH_CATEGORY_OPTIONS.find(
                              (opt) => opt.value === filters.category
                            )?.color
                          }15`
                        : "#fefbe8",
                    color:
                      filters.category &&
                      SEARCH_CATEGORY_OPTIONS.find(
                        (opt) => opt.value === filters.category
                      )
                        ? SEARCH_CATEGORY_OPTIONS.find(
                            (opt) => opt.value === filters.category
                          )?.color
                        : "#f59e0b",
                    border:
                      filters.category &&
                      SEARCH_CATEGORY_OPTIONS.find(
                        (opt) => opt.value === filters.category
                      )
                        ? `2px solid ${
                            SEARCH_CATEGORY_OPTIONS.find(
                              (opt) => opt.value === filters.category
                            )?.color
                          }`
                        : "2px solid #f59e0b",
                  }}
                >
                  {(() => {
                    const selected = SEARCH_CATEGORY_OPTIONS.find(
                      (opt) => opt.value === filters.category
                    );
                    if (selected) {
                      return selected.icon(
                        filters.category ? selected.color : selected.gray
                      );
                    }
                    // 기본값(제목)
                    return SEARCH_CATEGORY_OPTIONS[0].icon("#f59e0b");
                  })()}
                  <span className="select-value">
                    {SEARCH_CATEGORY_OPTIONS.find(
                      (opt) => opt.value === filters.category
                    )?.label || "제목"}
                  </span>
                  <FiChevronDown
                    size={16}
                    style={{
                      color:
                        filters.category &&
                        SEARCH_CATEGORY_OPTIONS.find(
                          (opt) => opt.value === filters.category
                        )
                          ? SEARCH_CATEGORY_OPTIONS.find(
                              (opt) => opt.value === filters.category
                            )?.color
                          : "#f59e0b",
                    }}
                  />
                </SelectButton>
                <SelectDropdown $isOpen={categoryDropdownOpen}>
                  {SEARCH_CATEGORY_OPTIONS.map((option) => (
                    <SelectOption
                      key={option.value}
                      $isSelected={filters.category === option.value}
                      onClick={() => {
                        onInputChange("category", option.value);
                        setCategoryDropdownOpen(false);
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          marginRight: 6,
                          color:
                            filters.category === option.value
                              ? option.color
                              : option.gray,
                        }}
                      >
                        {option.icon(
                          filters.category === option.value
                            ? option.color
                            : option.gray
                        )}
                      </span>
                      {option.label}
                    </SelectOption>
                  ))}
                </SelectDropdown>
              </div>
              <SearchInput
                placeholder={"검색어를 입력하세요"}
                value={filters.keyword}
                onChange={(e) => onInputChange("keyword", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <NewButton onClick={handleSearch}>
                <FiSearch size={16} />
              </NewButton>
              <NewButton onClick={handleResetFilters}>
                <FiRotateCcw size={16} />
              </NewButton>
            </div>
          </FilterGroup>
        </div>
      </FilterBar>
    </DatePickerStyles>
  );
};

export default ProjectFilterBar;
