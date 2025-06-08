import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent backdrop */
  display: flex;
  justify-content: flex-end; /* Align modal panel to the right */
  align-items: flex-start; /* Align to the top of the overlay */
  z-index: 1000; /* Ensure it's above other content */
`;

export const ModalPanel = styled.div<{ $open: boolean }>`
  background-color: white;
  width: 450px; /* Fixed width for the sidebar-like modal */
  height: 100vh; /* Full viewport height */
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2); /* Shadow on the left side */
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Enable scrolling for modal content */
  border-top-left-radius: 8px; /* Apply border-radius only to the top-left */
  border-bottom-left-radius: 8px; /* Apply border-radius only to the bottom-left */
  transform: translateX(
    ${(props) => (props.$open ? "0%" : "100%")}
  ); /* Slide in/out */
  transition: transform 0.3s ease-out; /* Smooth transition */
`;

export const ModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  gap: 10px;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  width: fit-content;

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
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  margin: 0;
`;

export const PostPanelTitle = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #333333;
  min-width: 60px; /* 라벨 너비 고정 */
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const IconWrapper = styled.div`
  color: #999999;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    color: #333333;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #999999;
  line-height: 1;

  &:hover {
    color: #333333;
  }
`;

export const PostDetailMeta = styled.div`
  display: grid;
  grid-template-columns: auto 1fr; /* 라벨과 값 2열 */
  gap: 8px 16px;
  font-size: 14px;
  color: #666666;
  width: 100%;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ModalBody = styled.div`
  flex: 1;
  padding: 20px;
`;

export const Section = styled.div`
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eeeeee;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 15px;
`;

export const PostContent = styled.div`
  font-size: 14px;
  color: #555555;
  line-height: 1.6;
  white-space: pre-wrap;
`;

export const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const FileItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

export const FileName = styled.a`
  color: #2c3e50;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

export const FileSize = styled.span`
  font-size: 12px;
  color: #999999;
`;

export const CommentsSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eeeeee;
`;

export const CommentCountHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;

  span {
    font-weight: bold;
    color: #333333;
    font-size: 15px;
  }

  &::after {
    content: "";
    flex-grow: 1;
    height: 1px;
    background-color: #dddddd;
  }
`;

export const QuestionCount = styled.span`
  color: #666666;
  font-weight: normal !important;
`;

export const CommentInputContainer = styled.div`
  margin-bottom: 20px;
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const CommentTextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  resize: vertical;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
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
  float: right; /* 버튼을 오른쪽으로 정렬 */

  &:hover {
    background-color: #4338ca;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

export const CommentsList = styled.div`
  max-height: none; /* 스크롤바 제거 */
  overflow-y: visible; /* 스크롤바 제거 */
  margin-bottom: 0;
  padding-right: 0;
`;

export const CommentItem = styled.div`
  background-color: #ffffff; /* 흰색 배경 */
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); /* 그림자 */
`;

export const CommentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999999;
  margin-bottom: 8px;
`;

export const CommentAuthor = styled.span`
  font-weight: bold;
  color: #333333;
  font-size: 14px;
`;

export const CommentText = styled.p`
  font-size: 14px;
  color: #555555;
  line-height: 1.5;
  margin-bottom: 10px;
`;

export const CommentActions = styled.div`
  font-size: 12px;
  text-align: right;
  a {
    color: #666666;
    margin-left: 10px;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
      color: #2c3e50;
    }
  }
`;
