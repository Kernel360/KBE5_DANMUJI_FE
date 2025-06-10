import styled from "styled-components";
import { darken } from "polished";

export const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
`;

export const MainContentWrapper = styled.div`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const PostDetailSection = styled.div`
  padding: 30px;
`;

export const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: #666666;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

export const PostActions = styled.div`
  display: flex;
  gap: 10px;
`;

export const ActionButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  background-color: #ffffff;
  color: #333333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f5f5f5;
    border-color: #cccccc;
  }

  &:last-child {
    color: #dc3545;
    border-color: #dc3545;

    &:hover {
      background-color: #dc3545;
      color: #ffffff;
    }
  }
`;

export const PostTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 20px;
`;

export const PostMeta = styled.div`
  display: flex;
  gap: 20px;
  color: #666666;
  font-size: 14px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eeeeee;
`;

export const PostInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

export const PostInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const InfoLabel = styled.span`
  font-size: 14px;
  color: #666666;
`;

export const InfoValue = styled.span`
  font-size: 16px;
  color: #333333;
  font-weight: 500;
`;

export const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  background-color: ${(props) => {
    switch (props.status) {
      case "승인":
        return "#d1fae5";
      case "대기":
        return "#fef9c3";
      case "반려":
        return "#fee2e2";
      default:
        return "#e5e7eb";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "승인":
        return "#059669";
      case "대기":
        return "#a16207";
      case "반려":
        return "#dc2626";
      default:
        return "#4b5563";
    }
  }};
`;

export const PostContent = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: #333333;
  white-space: pre-wrap;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 8px;
  min-height: 200px;
`;

export const CommentSection = styled.div`
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eeeeee;
`;

export const CommentInputContainer = styled.div`
  margin-bottom: 30px;
`;

export const CommentTextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  resize: vertical;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;

  &:focus {
    outline: none;
    border-color: #4f46e5;
  }
`;

export const CommentSubmitButton = styled.button`
  padding: 8px 16px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${darken(0.1, "#4f46e5")};
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;
