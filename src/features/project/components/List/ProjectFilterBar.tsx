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
  FiSearch,
  FiCheck,
  FiAlertCircle,
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
  ModalOverlay,
  ClientModal,
  ModalHeader,
  ModalTitle,
  ModalSubtitle,
  ModalBody,
  SearchInputWrapper,
  ModalSearchInput,
  SearchIcon,
  ClientList,
  ClientItem,
  ClientInfo,
  ClientName,
  ClientDescription,
  CheckIcon,
  ModalFooter,
  ModalButton,
  NoResults,
  EmptyState,
  StatusDropdownContainer,
  StatusDropdownButton,
  StatusDropdownMenu,
  StatusDropdownItem,
} from "./ProjectFilterBar.styled";

const STATUS_MAP = {
  "": { label: "전체", icon: FiGrid, color: "#6b7280" },
  IN_PROGRESS: { label: "진행중", icon: FiClock, color: "#3b82f6" },
  COMPLETED: { label: "완료", icon: FiCheckCircle, color: "#10b981" },
  DELAYED: { label: "지연", icon: FiAlertTriangle, color: "#ef4444" },
  DUE_SOON: { label: "마감임박", icon: FiAlertCircle, color: "#f59e42" },
} as const;

const CLIENT_OPTIONS = [
  { value: "", label: "전체 고객사", description: "모든 고객사" },
  {
    value: "ABC 주식회사",
    label: "ABC 주식회사",
    description: "IT 솔루션 전문 기업",
  },
  { value: "XYZ 기업", label: "XYZ 기업", description: "제조업 전문 기업" },
  { value: "DEF 그룹", label: "DEF 그룹", description: "금융 서비스 기업" },
  { value: "GHI 테크", label: "GHI 테크", description: "스타트업 기술 기업" },
  { value: "JKL 시스템", label: "JKL 시스템", description: "시스템 통합 전문" },
  {
    value: "MNO 솔루션",
    label: "MNO 솔루션",
    description: "클라우드 솔루션 기업",
  },
  {
    value: "PQR 인더스트리",
    label: "PQR 인더스트리",
    description: "중공업 전문 기업",
  },
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
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState(filters.client);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  const sortDropdownRef = useRef<HTMLDivElement>(null);

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

  const handleSortDropdownToggle = () => {
    setSortDropdownOpen(!sortDropdownOpen);
  };

  const handleSortSelect = (value: string) => {
    onInputChange("sort", value);
    setSortDropdownOpen(false);
  };

  const handleClientModalOpen = () => {
    setSelectedClient(filters.client);
    setClientSearchTerm("");
    setClientModalOpen(true);
  };

  const handleClientModalClose = () => {
    setClientModalOpen(false);
    setClientSearchTerm("");
  };

  const handleClientSelect = (value: string) => {
    setSelectedClient(value);
  };

  const handleClientConfirm = () => {
    onInputChange("client", selectedClient);
    setClientModalOpen(false);
  };

  const getSortLabel = (value: string) => {
    const option = SORT_OPTIONS.find((opt) => opt.value === value);
    return option ? option.label : "최신순";
  };

  const getClientLabel = (value: string) => {
    const option = CLIENT_OPTIONS.find((opt) => opt.value === value);
    return option ? option.label : "전체 고객사";
  };

  // 고객사 검색 필터링
  const filteredClients = CLIENT_OPTIONS.filter(
    (client) =>
      client.label.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
      client.description.toLowerCase().includes(clientSearchTerm.toLowerCase())
  );

  const handleStatusDropdownToggle = () => {
    setStatusDropdownOpen((prev) => !prev);
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

  return (
    <DatePickerStyles>
      <FilterBar style={{ flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 20, width: "100%" }}>
          <FilterGroup>
            <FilterLabel>프로젝트 상태</FilterLabel>
            <StatusDropdownContainer ref={statusDropdownRef}>
              <StatusDropdownButton
                type="button"
                $active={!!filters.status}
                $color={STATUS_MAP[filters.status || ""].color}
                $isOpen={statusDropdownOpen}
                onClick={handleStatusDropdownToggle}
              >
                {STATUS_MAP[filters.status || ""].icon &&
                  React.createElement(STATUS_MAP[filters.status || ""].icon, {
                    size: 16,
                    color: STATUS_MAP[filters.status || ""].color,
                    style: { marginRight: 4 },
                  })}
                <span>{STATUS_MAP[filters.status || ""].label}</span>
                <FiChevronDown size={16} />
              </StatusDropdownButton>
              <StatusDropdownMenu $isOpen={statusDropdownOpen}>
                {Object.entries(STATUS_MAP).map(
                  ([value, { label, icon: Icon, color }]) => (
                    <StatusDropdownItem
                      key={value}
                      $active={filters.status === value}
                      $color={color}
                      onClick={() => {
                        onInputChange("status", value);
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
            {/* DatePicker 팝업은 기존대로 유지 */}
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
                  minDate={
                    filters.startDate ? new Date(filters.startDate) : null
                  }
                  dateFormat="yyyy-MM-dd"
                  placeholderText="종료일 선택"
                  inline
                />
              </div>
            )}
          </FilterGroup>
        </div>
        <div style={{ display: "flex", gap: 20, width: "100%", marginTop: 12 }}>
          <FilterGroup>
            <FilterLabel>고객사</FilterLabel>
            <SelectButton
              type="button"
              onClick={handleClientModalOpen}
              $hasValue={!!filters.client}
              style={{ paddingLeft: 10, paddingRight: 10, minWidth: 90 }}
            >
              <FiHome size={16} />
              <span className="select-value">
                {getClientLabel(filters.client)}
              </span>
              <FiChevronDown size={16} />
            </SelectButton>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>정렬</FilterLabel>
            <div style={{ position: "relative" }} ref={sortDropdownRef}>
              <SelectButton
                type="button"
                onClick={handleSortDropdownToggle}
                $hasValue={!!filters.sort}
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
        </div>
      </FilterBar>

      {/* 고객사 선택 모달 */}
      <ModalOverlay $isOpen={clientModalOpen} onClick={handleClientModalClose}>
        <ClientModal
          $isOpen={clientModalOpen}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader>
            <ModalTitle>고객사 선택</ModalTitle>
            <ModalSubtitle>
              프로젝트를 진행할 고객사를 선택해주세요
            </ModalSubtitle>
          </ModalHeader>
          <ModalBody>
            <SearchInputWrapper>
              <SearchIcon>
                <FiSearch size={16} />
              </SearchIcon>
              <ModalSearchInput
                placeholder="고객사명 또는 설명으로 검색..."
                value={clientSearchTerm}
                onChange={(e) => setClientSearchTerm(e.target.value)}
                autoFocus
              />
            </SearchInputWrapper>
            <ClientList>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <ClientItem
                    key={client.value}
                    $isSelected={selectedClient === client.value}
                    onClick={() => handleClientSelect(client.value)}
                  >
                    <ClientInfo>
                      <ClientName $isSelected={selectedClient === client.value}>
                        {client.label}
                      </ClientName>
                      <ClientDescription>
                        {client.description}
                      </ClientDescription>
                    </ClientInfo>
                    <CheckIcon $isSelected={selectedClient === client.value}>
                      <FiCheck size={16} />
                    </CheckIcon>
                  </ClientItem>
                ))
              ) : clientSearchTerm ? (
                <NoResults>
                  검색 결과가 없습니다.
                  <br />
                  다른 검색어를 입력해보세요.
                </NoResults>
              ) : (
                <EmptyState>고객사 목록을 불러오는 중...</EmptyState>
              )}
            </ClientList>
          </ModalBody>
          <ModalFooter>
            <ModalButton onClick={handleClientModalClose}>취소</ModalButton>
            <ModalButton $primary onClick={handleClientConfirm}>
              선택 완료
            </ModalButton>
          </ModalFooter>
        </ClientModal>
      </ModalOverlay>
    </DatePickerStyles>
  );
};

export default ProjectFilterBar;
