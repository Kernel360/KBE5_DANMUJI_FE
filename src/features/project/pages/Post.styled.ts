// styled.ts
import styled from 'styled-components';

export const PageWrapper = styled.div``;

export const FlexLayout = styled.div`
  display: flex;
  gap: 24px;
`;

export const LeftColumn = styled.div`
  flex: 2;
`;

export const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// Header
export const HeaderWrapper = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
`;

export const InfoList = styled.div`
  margin-top: 16px;
  font-size: 14px;
  line-height: 1.6;
`;

// Progress
export const ProgressWrapper = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

export const StepList = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
  color: #374151;
`;

export const ProgressBar = styled.div`
  background: #e5e7eb;
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
`;

export const ProgressValue = styled.div`
  background: #3b82f6;
  width: 65%;
  height: 100%;
`;

export const Percentage = styled.div`
  margin-top: 4px;
  font-size: 13px;
  color: #6b7280;
`;

// Board
export const BoardWrapper = styled.div`
  padding: 24px;
  background-color: #ffffff;
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

export const FilterSelect = styled.select`
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 6px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
`;

export const NewPostButton = styled.button`
  padding: 8px 16px;
  background-color: #4f46e5;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

export const PostCard = styled.div<{ variant?: 'default' | 'notice' }>`
  background-color: ${(props) => (props.variant === 'notice' ? '#FEF3C7' : '#F9FAFB')};
  border: 1px solid ${(props) => (props.variant === 'notice' ? '#FACC15' : '#E5E7EB')};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
`;

export const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 15px;
`;

export const PostBody = styled.p`
  font-size: 14px;
  color: #374151;
  margin-top: 8px;
  line-height: 1.6;
`;

export const PostFooter = styled.div`
  font-size: 13px;
  color: #6B7280;
  margin-top: 10px;
`;

export const Tag = styled.span`
  font-size: 12px;
  background-color: #e0f2fe;
  color: #0284c7;
  border-radius: 4px;
  padding: 2px 6px;
  margin-right: 6px;
  font-weight: 500;
`;

export const NewBadge = styled.span`
  font-size: 11px;
  background-color: #facc15;
  color: #fff;
  border-radius: 8px;
  padding: 2px 6px;
  margin-left: 6px;
  font-weight: 600;
`;