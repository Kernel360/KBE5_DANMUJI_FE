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

interface ProjectFilterBarProps {
  filters: {
    status: string;
    client: string;
    priority: string;
    sort: string;
    startDate: string;
    endDate: string;
    keyword: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const ProjectFilterBar: React.FC<ProjectFilterBarProps> = ({ filters, onInputChange }) => {
  return (
    <FilterBar>
<FilterGroup>
  <FilterLabel>프로젝트 상태</FilterLabel>
  <StatusButtonGroup>
    {['', '진행중', '완료', '지연'].map((status) => (
      <StatusButton
        key={status || '전체'}
        $active={filters.status === status}
        onClick={() => onInputChange('status', status)}
      >
        {status || '전체'}
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
        <FilterLabel>우선순위</FilterLabel>
        <Select value={filters.priority} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onInputChange('priority', e.target.value)}>
          <option value="">전체</option>
          <option value="긴급">긴급</option>
          <option value="높음">높음</option>
          <option value="보통">보통</option>
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
          <ActionButton>초기화</ActionButton>
          <ActionButton $primary>저장</ActionButton>
        </TopActions>
      </SearchRight>
    </FilterBar>
  );
};

export default ProjectFilterBar; 