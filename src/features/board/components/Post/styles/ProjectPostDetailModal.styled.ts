import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
`;

export const ModalPanel = styled.div<{
  $closing?: boolean;
}>`
  background-color: white;
  width: 100%;
  max-width: 600px;
  height: 100%;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  border-radius: 12px 0 0 12px;
  transform: translateX(100%);
  animation: ${({ $closing }) => ($closing ? "slideOut" : "slideIn")} 0.32s
    cubic-bezier(0.4, 0, 0.2, 1) forwards;

  @keyframes slideIn {
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  @media (min-width: 768px) {
    width: 60%;
  }
  @media (min-width: 1024px) {
    width: 40%;
  }
`;

export const ModalHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
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
        background-color: #d1fae5; /* green-100 */
        color: #059669; /* green-600 */
      `;
    if (props.$status === "대기")
      return `
        background-color: #fef9c3; /* yellow-100 */
        color: #a16207; /* yellow-700 */
      `;
    // Add more status colors as needed
    return `
      background-color: #e5e7eb; /* gray-200 */
      color: #4b5563; /* gray-600 */
    `;
  }}
`;

export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #6b7280;

  &:hover {
    color: #1f2937;
  }
`;

export const QuestionAnswerStyledButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #fff7e6;
  color: #f59e0b;
  border: none;
  border-radius: 1.5rem;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 8px 0 rgba(253, 185, 36, 0.08);
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;

  &:hover {
    background-color: #fdb924;
    color: white;
    box-shadow: 0 4px 12px 0 rgba(253, 185, 36, 0.18);
  }
`;

export const CloseButton = styled(ActionButton)``;

export const ModalBody = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
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
  display: flex;
  align-items: center;
  gap: 0.1rem;

  a {
    color: #6b7280;
    margin-left: 0.5rem;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const CommentActionButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
    color: #374151;
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
  resize: both;
  background: white;
  position: relative;
  padding-bottom: 2.2em;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &::-webkit-resizer {
    display: none;
  }
  &::-moz-resizer {
    display: none;
  }
  &::-ms-resizer {
    display: none;
  }
  &::resizer {
    display: none;
  }
  &:hover {
    cursor: se-resize;
    box-shadow: 0 0 0 2px #fdb92433;
  }
`;

export const CommentSubmitButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #fdb924;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #e6a720;
  }

  &:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.125rem;
  color: #6b7280;
`;

export const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.125rem;
  color: #ef4444;
  text-align: center;
  padding: 2rem;
`;

export const ModalHeaderActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  color: #888;
  border: none;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  height: 28px;
  min-width: 0;
  box-shadow: none;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #f3f4f6;
    color: #fdb924;
  }

  &.delete {
    color: #ef4444;
  }
`;

export const ModalHeaderButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const ModalHeaderCloseButton = styled.button`
  background: none;
  border: none;
  color: #b0b0b0;
  font-size: 20px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 2px;
  transition: background 0.15s;
  &:hover {
    background: #f3f4f6;
  }
`;

// 대댓글 관련 스타일 컴포넌트
export const ReplyInputContainer = styled.div`
  margin-top: 0.75rem;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 0.375rem;
  border-left: 3px solid #fdb924;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ReplyList = styled.div`
  margin-top: 0.75rem;
  padding-left: 1rem;
  border-left: 2px solid #e5e7eb;
`;

export const ReplyItem = styled.div`
  background-color: #f8f9fa;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  border: 1px solid #e9ecef;
`;

export const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const InfoKey = styled.span`
  min-width: 80px;
  color: #6b7280;
  font-weight: 600;
  font-size: 0.8rem;
  text-align: right;
`;

export const InfoValue = styled.span`
  color: #222;
  font-size: 0.95rem;
  font-weight: 500;
`;

export const RelativeTextareaWrapper = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
`;

export const ResizeGuide = styled.div`
  position: absolute;
  right: 10px;
  bottom: 38px;
  font-size: 13px;
  color: #bdbdbd;
  opacity: 0.6;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.2s;
  z-index: 2;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 16px;
    height: 16px;
    display: inline-block;
    vertical-align: middle;
  }

  ${RelativeTextareaWrapper}:hover & {
    opacity: 1;
    color: #fdb924;
    svg path {
      fill: #fdb924;
    }
  }
`;
