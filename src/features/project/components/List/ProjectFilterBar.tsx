import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FiGrid,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiCalendar,
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
} from "./ProjectFilterBar.styled";

const STATUS_MAP = {
  "": { label: "전체", icon: FiGrid, color: "#6b7280" },
  IN_PROGRESS: { label: "진행중", icon: FiClock, color: "#3b82f6" },
  COMPLETED: { label: "완료", icon: FiCheckCircle, color: "#10b981" },
  DELAYED: { label: "지연", icon: FiAlertTriangle, color: "#ef4444" },
} as const;

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
          <Select
            value={filters.client}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onInputChange("client", e.target.value)
            }
          >
            <option value="">전체 고객사</option>
            <option value="ABC 주식회사">ABC 주식회사</option>
          </Select>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>정렬</FilterLabel>
          <Select
            value={filters.sort}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onInputChange("sort", e.target.value)
            }
          >
            <option value="latest">최신순</option>
            <option value="name">이름순</option>
          </Select>
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
