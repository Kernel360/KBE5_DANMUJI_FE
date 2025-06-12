import styled from "styled-components";

interface AnswerItemContainerProps {
  $depth: number;
}

export const AnswerItemContainer = styled.div<AnswerItemContainerProps>`
  margin-top: 0.25rem;
  border-radius: 0.375rem;
  padding: 0.5rem;
  background-color: ${(props) => (props.$depth > 0 ? "#f9fafb" : "#ffffff")};
  border: ${(props) => (props.$depth > 0 ? "1px solid #e5e7eb" : "none")};
  margin-left: ${(props) =>
    props.$depth > 0 ? `${props.$depth * 1.5}rem` : "0"};
`;

export const AnswerMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const AnswerAuthor = styled.div`
  display: flex;
  align-items: center;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
`;

export const AnswerAuthorName = styled.span`
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
`;

export const AnswerAuthorIp = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  margin-left: 0.5rem;
  font-weight: 400;
`;

export const AnswerDate = styled.span`
  color: #6b7280;
  font-size: 0.75rem;
`;

export const AnswerContent = styled.div`
  color: #374151;
  line-height: 1.5;
  font-size: 0.875rem;
`;

export const AnswerText = styled.div`
  color: #374151;
  line-height: 1.5;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

export const ReplyBadge = styled.span`
  display: inline-block;
  background: #f3f4f6;
  color: #888;
  font-size: 0.75em;
  border-radius: 4px;
  padding: 2px 6px;
  margin-left: 6px;
  vertical-align: middle;
`;

export const BestAnswerBadge = styled.span`
  display: inline-block;
  background: #fdb924;
  color: white;
  font-size: 0.75em;
  border-radius: 4px;
  padding: 2px 6px;
  margin-left: 6px;
  vertical-align: middle;
  font-weight: 600;
`;
