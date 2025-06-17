import styled from "styled-components";

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
  background: ${({ $primary }) => ($primary ? "#fbbf24" : "#ffffff")};
  color: ${({ $primary }) => ($primary ? "#fff" : "#374151")};
  border: 1px solid #d1d5db;
  padding: 8px 14px;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: ${({ $primary }) => ($primary ? "#f59e0b" : "#f3f4f6")};
  }
`;

export const StatusButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const StatusButton = styled.button<{ $active: boolean; $color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${({ $active, $color }) => ($active ? `${$color}15` : "#ffffff")};
  color: ${({ $active, $color }) => ($active ? $color : "#374151")};
  border: 2px solid ${({ $active, $color }) => ($active ? $color : "#e5e7eb")};
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: fit-content;
  white-space: nowrap;

  svg {
    flex-shrink: 0;
  }

  span {
    font-weight: 500;
  }

  &:hover {
    background: ${({ $active, $color }) =>
      $active ? `${$color}25` : "#f9fafb"};
    border-color: ${({ $active, $color }) => ($active ? $color : "#d1d5db")};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ $color }) => `${$color}20`};
  }
`;

export const DateRangeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const DatePickerWrapper = styled.div`
  position: relative;
  flex: 1;
`;

export const DateButton = styled.button<{ $hasValue: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 14px;
  background: ${({ $hasValue }) => ($hasValue ? "#f0f9ff" : "#ffffff")};
  border: 2px solid ${({ $hasValue }) => ($hasValue ? "#3b82f6" : "#e5e7eb")};
  border-radius: 8px;
  color: ${({ $hasValue }) => ($hasValue ? "#1e40af" : "#374151")};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  svg {
    flex-shrink: 0;
    color: ${({ $hasValue }) => ($hasValue ? "#3b82f6" : "#6b7280")};
  }

  span:first-of-type {
    font-weight: 600;
    min-width: 50px;
  }

  .date-value {
    margin-left: auto;
    font-size: 0.8rem;
    color: ${({ $hasValue }) => ($hasValue ? "#1e40af" : "#9ca3af")};
    font-weight: 400;
  }

  &:hover {
    background: ${({ $hasValue }) => ($hasValue ? "#dbeafe" : "#f9fafb")};
    border-color: ${({ $hasValue }) => ($hasValue ? "#2563eb" : "#d1d5db")};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const DateSeparator = styled.span`
  color: #6b7280;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0 4px;
  flex-shrink: 0;
`;

// DatePicker 커스터마이징을 위한 글로벌 스타일
export const DatePickerStyles = styled.div`
  .react-datepicker {
    font-family: inherit;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .react-datepicker__header {
    background-color: #f8fafc;
    border-bottom: 1px solid #e5e7eb;
    border-radius: 8px 8px 0 0;
  }

  .react-datepicker__current-month {
    color: #111827;
    font-weight: 600;
  }

  .react-datepicker__day-name {
    color: #6b7280;
    font-weight: 500;
  }

  .react-datepicker__day {
    color: #374151;
    border-radius: 4px;
    margin: 2px;

    &:hover {
      background-color: #f3f4f6;
    }
  }

  .react-datepicker__day--selected {
    background-color: #3b82f6;
    color: white;

    &:hover {
      background-color: #2563eb;
    }
  }

  .react-datepicker__day--in-range {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .react-datepicker__day--keyboard-selected {
    background-color: #3b82f6;
    color: white;
  }

  .react-datepicker__navigation {
    top: 8px;
  }

  .react-datepicker__navigation-icon::before {
    border-color: #6b7280;
  }
`;
