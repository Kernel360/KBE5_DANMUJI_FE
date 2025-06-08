import styled from "styled-components";

export const CommentContainer = styled.div<{ $level: number }>`
  margin-bottom: 16px;
  padding: ${(props) => (props.$level > 0 ? "12px 0 12px 24px" : "16px")};
  border-bottom: ${(props) => (props.$level === 0 ? "1px solid #eee" : "none")};
  position: relative;

  ${(props) =>
    props.$level > 0 &&
    `
    &::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 0;
      bottom: 0;
      width: 2px;
      background-color: #eee;
    }
  `}
`;

export const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const AuthorName = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

export const CommentDate = styled.span`
  color: #999;
  font-size: 12px;
`;

export const CommentContent = styled.p`
  margin: 0;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
`;

export const ReplyButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 12px;
  padding: 4px 8px;
  margin-top: 8px;
  cursor: pointer;

  &:hover {
    color: #333;
    text-decoration: underline;
  }
`;

export const ReplyFormContainer = styled.div`
  margin-top: 12px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
`;

export const ReplyForm = styled.form`
  display: flex;
  gap: 8px;
`;

export const ReplyInput = styled.textarea`
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 60px;

  &:focus {
    outline: none;
    border-color: #666;
  }
`;

export const SubmitButton = styled.button`
  padding: 8px 16px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  align-self: flex-end;

  &:hover {
    background-color: #34495e;
  }
`;

export const NestedReplyList = styled.div`
  margin-top: 12px;
`;

export const ReplyList = styled.div`
  margin-left: 24px;
  padding-left: 16px;
  border-left: 2px solid #eee;
`;

export const ReplyItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
`;

export const ReplyAuthorName = styled(AuthorName)`
  font-size: 13px;
`;

export const ReplyContent = styled(CommentContent)`
  font-size: 13px;
`;

export const ReplyDate = styled(CommentDate)`
  font-size: 11px;
`;
