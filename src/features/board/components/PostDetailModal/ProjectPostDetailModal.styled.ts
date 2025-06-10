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

export const ModalPanel = styled.div`
  background-color: white;
  width: 100%;
  max-width: 600px; /* Set a max-width for larger screens */
  height: 100%;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  animation: slideIn 0.3s forwards;

  @keyframes slideIn {
    to {
      transform: translateX(0);
    }
  }

  @media (min-width: 768px) {
    /* Adjust width for medium screens and up */
    width: 60%;
  }

  @media (min-width: 1024px) {
    /* Adjust width for large screens and up */
    width: 40%;
  }
`;

export const ModalHeader = styled.div`
  padding: 1.5rem;
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

export const QuestionAnswerButton = styled.button`
  background-color: #fdb924;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e6a720;
  }
`;

export const CloseButton = styled(ActionButton)``;

export const ModalBody = styled.div`
  flex: 1;
  padding: 1.5rem;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;

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
  padding: 0.25rem 0.5rem;
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
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
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
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #fdb924;
    color: white;
  }
`;
