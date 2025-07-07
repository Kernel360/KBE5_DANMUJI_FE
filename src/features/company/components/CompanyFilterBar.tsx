import React, { useState, useEffect, useRef } from "react";
import { FiPlus, FiChevronDown, FiArrowUp } from "react-icons/fi";
import {
  FilterBar,
  FilterGroup,
  FilterLabel,
  NewButton,
  SelectButton,
  SelectDropdown,
  SelectOption,
  SearchInput,
} from "./CompanyFilterBar.styled";

const SORT_OPTIONS = [
  { value: "latest", label: "최근 등록 순" },
  { value: "name", label: "이름 순" },
];

interface CompanyFilterBarProps {
  filters: {
    sort: string;
    keyword: string;
    client: string;
    companyId: number | null;
  };
  onInputChange: (field: string, value: string) => void;
  onReset: () => void;
  onRegisterClick?: () => void;
  onKeywordSearch?: () => void;
}

const CompanyFilterBar: React.FC<CompanyFilterBarProps> = ({
  filters,
  onInputChange,
  onRegisterClick,
  onKeywordSearch,
}) => {
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!addressModalOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAddressModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [addressModalOpen]);

  // 바깥 클릭 시 모달 닫기
  useEffect(() => {
    if (!addressModalOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setAddressModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [addressModalOpen]);

  const handleSortDropdownToggle = () => {
    setSortDropdownOpen((prev) => !prev);
  };

  const handleSortSelect = (value: string) => {
    onInputChange("sort", value);
    setSortDropdownOpen(false);
  };

  const getSortLabel = (value: string) => {
    const option = SORT_OPTIONS.find((opt) => opt.value === value);
    return option ? option.label : "최근 등록 순";
  };

  const getSortColor = (value: string) => {
    switch (value) {
      case "latest":
        return "#f59e0b"; // 주황
      case "name":
        return "#3b82f6"; // 파랑
      default:
        return "#6b7280"; // 회색
    }
  };

  // 정렬 드롭다운 ESC/바깥 클릭 닫기
  useEffect(() => {
    if (!sortDropdownOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSortDropdownOpen(false);
    };
    const handleClick = (e: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target as Node)
      ) {
        setSortDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [sortDropdownOpen]);

  return (
    <FilterBar>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
        <FilterGroup style={{ marginBottom: 0 }}>
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
        <FilterGroup style={{ marginBottom: 0 }}>
          <FilterLabel>업체명 검색</FilterLabel>
          <SearchInput
            type="text"
            placeholder="업체명을 입력하세요"
            value={filters.keyword}
            onChange={(e) => onInputChange("keyword", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && typeof onKeywordSearch === "function") {
                onKeywordSearch();
              }
            }}
          />
        </FilterGroup>
      </div>
      <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
        {onRegisterClick && (
          <NewButton onClick={onRegisterClick}>
            <FiPlus />
            업체 등록
          </NewButton>
        )}
      </div>
    </FilterBar>
  );
};

export default CompanyFilterBar;
