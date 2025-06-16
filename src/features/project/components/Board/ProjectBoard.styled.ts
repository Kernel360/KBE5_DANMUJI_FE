// ProjectBoard.styled.ts
import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 24px;
  background-color: #ffffff;
`;

export const Filters = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

export const Select = styled.select`
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

export const NewButton = styled.button`
  padding: 8px 16px;
  background-color: #4f46e5;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

export const PostCard = styled.div`
  background-color: #FEF3C7;
  border: 1px solid #FACC15;
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