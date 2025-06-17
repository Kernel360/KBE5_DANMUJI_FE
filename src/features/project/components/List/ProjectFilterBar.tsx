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
  FiHome,
  FiArrowUp,
} from "react-icons/fi";
import {
  FilterBar,
  FilterGroup,
  FilterLabel,
  Select,
  DateInput,
  SearchInput,
  SearchRight,
  TopActions,
  ActionButton,
  StatusButtonGroup,
  StatusButton,
  DateRangeGroup,
  DateSeparator,
  DateButton,
  DatePickerWrapper,
  DatePickerStyles,
  SelectButton,
  SelectDropdown,
  SelectOption,
} from "./ProjectFilterBar.styled";

const STATUS_MAP = {
  "": { label: "전체", icon: FiGrid, color: "#6b7280" },
  IN_PROGRESS: { label: "진행중", icon: FiClock, color: "#3b82f6" },
  COMPLETED: { label: "완료", icon: FiCheckCircle, color: "#10b981" },
  DELAYED: { label: "지연", icon: FiAlertTriangle, color: "#ef4444" },
} as const;

const CLIENT_OPTIONS = [
  { value: "", label: "전체 고객사" },
  { value: "ABC 주식회사", label: "ABC 주식회사" },
  { value: "XYZ 기업", label: "XYZ 기업" },
  { value: "DEF 그룹", label: "DEF 그룹" },
];

const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "name", label: "이름순" },
  { value: "status", label: "상태순" },
  { value: "client", label: "고객사순" },
];

interface ProjectFilterBarProps {
  filters: {
    status: string;
    client: string;
    sort: string;
    startDate: string;
    endDate: string;
    keyword: string;
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
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const clientDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        clientDropdownRef.current &&
        !clientDropdownRef.current.contains(event.target as Node)
      ) {
        setClientDropdownOpen(false);
      }
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "선택 안함";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      onInputChange("startDate", formattedDate);
    }
    setStartDateOpen(false);
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      onInputChange("endDate", formattedDate);
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

  const handleClientDropdownToggle = () => {
    setSortDropdownOpen(false); // 정렬 드롭다운 닫기
    setClientDropdownOpen(!clientDropdownOpen);
  };

  const handleSortDropdownToggle = () => {
    setClientDropdownOpen(false); // 고객사 드롭다운 닫기
    setSortDropdownOpen(!sortDropdownOpen);
  };

  const handleClientSelect = (value: string) => {
    onInputChange("client", value);
    setClientDropdownOpen(false);
  };

  const handleSortSelect = (value: string) => {
    onInputChange("sort", value);
    setSortDropdownOpen(false);
  };

  const getClientLabel = (value: string) => {
    const option = CLIENT_OPTIONS.find((opt) => opt.value === value);
    return option ? option.label : "전체 고객사";
  };

  const getSortLabel = (value: string) => {
    const option = SORT_OPTIONS.find((opt) => opt.value === value);
    return option ? option.label : "최신순";
  };

  return (
    <DatePickerStyles>
      <FilterBar>
        <FilterGroup>
          <FilterLabel>프로젝트 상태</FilterLabel>
          <StatusButtonGroup>
            {Object.entries(STATUS_MAP).map(
              ([value, { label, icon: Icon, color }]) => (
                <StatusButton
                  key={value || "all"}
                  $active={filters.status === value}
                  $color={color}
                  onClick={() => onInputChange("status", value)}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </StatusButton>
              )
            )}
          </StatusButtonGroup>
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
            </DatePickerWrapper>
          </DateRangeGroup>

          {/* 시작일 DatePicker */}
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
                  filters.startDate ? new Date(filters.startDate) : null
                }
                onChange={handleStartDateChange}
                selectsStart
                startDate={
                  filters.startDate ? new Date(filters.startDate) : null
                }
                endDate={filters.endDate ? new Date(filters.endDate) : null}
                maxDate={filters.endDate ? new Date(filters.endDate) : null}
                dateFormat="yyyy-MM-dd"
                placeholderText="시작일 선택"
                inline
              />
            </div>
          )}

          {/* 종료일 DatePicker */}
          {endDateOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                zIndex: 1000,
                marginTop: "4px",
              }}
            >
              <DatePicker
                selected={filters.endDate ? new Date(filters.endDate) : null}
                onChange={handleEndDateChange}
                selectsEnd
                startDate={
                  filters.startDate ? new Date(filters.startDate) : null
                }
                endDate={filters.endDate ? new Date(filters.endDate) : null}
                minDate={filters.startDate ? new Date(filters.startDate) : null}
                dateFormat="yyyy-MM-dd"
                placeholderText="종료일 선택"
                inline
              />
            </div>
          )}
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>고객사</FilterLabel>
          <div style={{ position: "relative" }} ref={clientDropdownRef}>
            <SelectButton
              type="button"
              onClick={handleClientDropdownToggle}
              $hasValue={!!filters.client}
              className={clientDropdownOpen ? "open" : ""}
            >
              <FiHome size={16} />
              <span className="select-value">
                {getClientLabel(filters.client)}
              </span>
              <FiChevronDown size={16} />
            </SelectButton>
            <SelectDropdown $isOpen={clientDropdownOpen}>
              {CLIENT_OPTIONS.map((option) => (
                <SelectOption
                  key={option.value}
                  $isSelected={filters.client === option.value}
                  onClick={() => handleClientSelect(option.value)}
                >
                  {option.label}
                </SelectOption>
              ))}
            </SelectDropdown>
          </div>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>정렬</FilterLabel>
          <div style={{ position: "relative" }} ref={sortDropdownRef}>
            <SelectButton
              type="button"
              onClick={handleSortDropdownToggle}
              $hasValue={!!filters.sort}
              className={sortDropdownOpen ? "open" : ""}
            >
              <FiArrowUp size={16} />
              <span className="select-value">{getSortLabel(filters.sort)}</span>
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
        <SearchRight>
          <SearchInput
            placeholder="프로젝트명, 고객사, 담당자 검색..."
            value={filters.keyword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onInputChange("keyword", e.target.value)
            }
          />
          <TopActions>
            <ActionButton $primary onClick={onSearch}>
              검색
            </ActionButton>
            <ActionButton onClick={onReset}>초기화</ActionButton>
          </TopActions>
        </SearchRight>
      </FilterBar>
    </DatePickerStyles>
  );
};

export default ProjectFilterBar;
