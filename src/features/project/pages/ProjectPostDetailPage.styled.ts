import styled from "styled-components";
import { darken } from "polished";

export const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const PostContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  padding: 8px 0;
  cursor: pointer;
  margin-bottom: 16px;

  &:hover {
    color: #333;
    text-decoration: underline;
  }
`;

export const PostHeader = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
`;

export const PostTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
`;

export const PostMeta = styled.div`
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 14px;
`;

export const PostInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

export const PostInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PostInfoLabel = styled.span`
  font-size: 12px;
  color: #666;
`;

export const PostInfoValue = styled.span`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

export const PostContent = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 32px;
  white-space: pre-wrap;
`;

export const CommentSection = styled.div`
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #eee;
`;

export const CommentInputContainer = styled.div`
  margin-bottom: 20px;
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
