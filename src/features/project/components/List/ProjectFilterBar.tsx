import React from 'react';
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
} from './ProjectFilterBar.styled';

const STATUS_MAP = {
  '': '전체',
  'IN_PROGRESS': '진행중',
  'COMPLETED': '완료',
  'DELAYED': '지연'
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
  onReset
}) => {
  return (
    <FilterBar>
      <FilterGroup>
        <FilterLabel>프로젝트 상태</FilterLabel>
        <StatusButtonGroup>
          {Object.entries(STATUS_MAP).map(([value, label]) => (
            <StatusButton
              key={value || 'all'}
              $active={filters.status === value}
              onClick={() => onInputChange('status', value)}
            >
              {label}
            </StatusButton>
          ))}
        </StatusButtonGroup>
      </FilterGroup>
      <FilterGroup>
        <FilterLabel>프로젝트 기간</FilterLabel>
        <DateRangeGroup>
          <DateInput
            type="date"
            value={filters.startDate}
            onChange={(e) => onInputChange('startDate', e.target.value)}
          />
          <DateSeparator>~</DateSeparator>
          <DateInput
            type="date"
            value={filters.endDate}
            onChange={(e) => onInputChange('endDate', e.target.value)}
          />
        </DateRangeGroup>
      </FilterGroup>
      <FilterGroup>
        <FilterLabel>고객사</FilterLabel>
        <Select value={filters.client} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onInputChange('client', e.target.value)}>
          <option value="">전체 고객사</option>
          <option value="ABC 주식회사">ABC 주식회사</option>
        </Select>
      </FilterGroup>
      <FilterGroup>
        <FilterLabel>정렬</FilterLabel>
        <Select value={filters.sort} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onInputChange('sort', e.target.value)}>
          <option value="latest">최신순</option>
          <option value="name">이름순</option>
        </Select>
      </FilterGroup>
      <SearchRight>
        <SearchInput
          placeholder="프로젝트명, 고객사, 담당자 검색..."
          value={filters.keyword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange('keyword', e.target.value)}
        />
        <TopActions>
          <ActionButton $primary onClick={onSearch}>검색</ActionButton>
          <ActionButton onClick={onReset}>초기화</ActionButton>
        </TopActions>
      </SearchRight>
    </FilterBar>
  );
};

export default ProjectFilterBar; 