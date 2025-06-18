import React, { useState } from "react";
import { FiSearch, FiRotateCcw, FiPlus } from "react-icons/fi";
import {
  FilterBar,
  FilterGroup,
  FilterLabel,
  Select,
  SearchInput,
  SearchRight,
  ActionButton,
  NewButton,
} from "./CompanyFilterBar.styled";

const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "name", label: "이름순" },
  { value: "ceo", label: "대표자순" },
];

interface CompanyFilterBarProps {
  filters: {
    sort: string;
    keyword: string;
  };
  onInputChange: (field: string, value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onRegisterClick?: () => void;
}

const CompanyFilterBar: React.FC<CompanyFilterBarProps> = ({
  filters,
  onInputChange,
  onSearch,
  onReset,
  onRegisterClick,
}) => {
  const [keyword, setKeyword] = useState(filters.keyword);

  const handleSearch = () => {
    onInputChange("keyword", keyword);
    onSearch();
  };

  const handleResetFilters = () => {
    setKeyword("");
    onReset();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <FilterBar>
      <FilterGroup>
        <FilterLabel>정렬</FilterLabel>
        <Select
          value={filters.sort}
          onChange={(e) => onInputChange("sort", e.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FilterGroup>

      <FilterGroup style={{ flex: 1, maxWidth: 320 }}>
        <FilterLabel>검색</FilterLabel>
        <SearchInput
          type="text"
          placeholder="회사명, 대표자명, 이메일로 검색..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ minWidth: 120, maxWidth: 320 }}
        />
      </FilterGroup>

      <SearchRight>
        <ActionButton onClick={handleSearch}>
          <FiSearch size={16} />
          검색
        </ActionButton>
        <ActionButton onClick={handleResetFilters}>
          <FiRotateCcw size={16} />
          초기화
        </ActionButton>
        {onRegisterClick && (
          <NewButton type="button" onClick={onRegisterClick}>
            <FiPlus size={18} />
            회사 등록
          </NewButton>
        )}
      </SearchRight>
    </FilterBar>
  );
};

export default CompanyFilterBar;
