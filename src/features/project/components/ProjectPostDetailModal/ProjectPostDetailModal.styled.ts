import styled from "styled-components";

export const ModalOverlay = styled.div`
  display: contents;
`;

export const ModalPanel = styled.div`
  background-color: white;
  width: 100%;
  height: 100%;
  box-shadow: none;
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  gap: 8px;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;

  ${(props) => {
    if (props.$status === "승인")
      return `
        background-color: #d1fae5;
        color: #059669;
      `;
    if (props.$status === "대기")
      return `
        background-color: #fef9c3;
        color: #a16207;
      `;
    if (props.$status === "반려")
      return `
        background-color: #fee2e2;
        color: #dc2626;
      `;
    return `
      background-color: #e5e7eb;
      color: #4b5563;
    `;
  }}
`;

export const PanelTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

export const PostPanelTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-top: 4px;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const IconWrapper = styled.div`
  color: #6b7280;
  font-size: 1.25rem;
  cursor: pointer;

  &:hover {
    color: #1f2937;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #6b7280;
  line-height: 1;

  &:hover {
    color: #1f2937;
  }
`;

export const PostDetailMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
  font-size: 0.875rem;
  color: #4b5563;
  width: 100%;
`;

export const MetaItem = styled.div`
  display: flex;
  justify-content: space-between;
  span:first-child {
    font-weight: 600;
    color: #374151;
  }
  span:last-child {
    color: #4b5563;
  }
`;

export const ModalBody = styled.div`
  flex: 1;
  padding: 1.5rem;
`;

export const Section = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
`;

export const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
`;

export const PostContent = styled.div`
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
  white-space: pre-wrap;
`;

export const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const FileItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

export const FileName = styled.div`
  font-size: 0.875rem;
  color: #3b82f6;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const FileSize = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const CommentsSection = styled(Section)`
  margin-top: 1.5rem;
`;

export const CommentsList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding-right: 0.5rem;
`;

export const CommentItem = styled.div`
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
`;

export const CommentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

export const CommentAuthor = styled.span`
  font-weight: 600;
  color: #374151;
`;

export const CommentActions = styled.div`
  font-size: 0.75rem;
  a {
    color: #6b7280;
    margin-left: 0.5rem;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const CommentText = styled.div`
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.4;
`;

export const CommentInputContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
`;

export const CommentTextArea = styled.textarea`
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  min-height: 60px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

export const CommentSubmitButton = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-top: 1rem;
`;

export const TabButton = styled.button<{ $active?: boolean }>`
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  color: ${(props) => (props.$active ? "#4f46e5" : "#6b7280")};
  border-color: ${(props) => (props.$active ? "#4f46e5" : "transparent")};
  transition: color 0.2s ease-in-out, border-color 0.2s ease-in-out;

  &:hover {
    color: #4f46e5;
    border-color: #4f46e5;
  }
`;

export const TabContent = styled.div`
  padding-top: 1rem;
`;
