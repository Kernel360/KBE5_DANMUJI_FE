import styled from 'styled-components';

export const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
  align-items: flex-end;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 160px;
`;

export const FilterLabel = styled.label`
  font-size: 0.92rem;
  color: #374151;
  font-weight: 500;
`;

export const Select = styled.select`
  padding: 8px 12px;
  font-size: 0.95rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #111827;
`;

export const DateInput = styled.input`
  padding: 8px 12px;
  font-size: 0.95rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  color: #111827;
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  font-size: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
`;

export const SearchRight = styled.div`
  display: flex;
  gap: 12px;
  flex: 1;
  align-items: center;
`;

export const TopActions = styled.div`
  display: flex;
  gap: 10px;
`;

export const ActionButton = styled.button<{ $primary?: boolean }>`
  background: ${({ $primary }) => ($primary ? '#4f46e5' : '#ffffff')};
  color: ${({ $primary }) => ($primary ? '#fff' : '#374151')};
  border: 1px solid #d1d5db;
  padding: 8px 14px;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: ${({ $primary }) => ($primary ? '#4338ca' : '#f3f4f6')};
  }
`;

export const StatusButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const StatusButton = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? '#2563eb' : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#374151')};
  border: 1px solid #d1d5db;
  padding: 6px 12px;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: ${({ $active }) => ($active ? '#1d4ed8' : '#f3f4f6')};
  }
`;

export const DateRangeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DateSeparator = styled.span`
  color: #6b7280;
`;
