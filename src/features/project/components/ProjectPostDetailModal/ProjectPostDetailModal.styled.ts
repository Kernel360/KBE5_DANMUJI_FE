// import styled from "styled-components";

// export const ModalOverlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: rgba(0, 0, 0, 0.5);
//   display: flex;
//   justify-content: flex-end;
//   align-items: stretch;
//   z-index: 1000;
// `;

// export const ModalPanel = styled.div<{ $open: boolean }>`
//   background: white;
//   width: 450px;
//   height: 100vh;
//   overflow-y: auto;
//   position: relative;
//   box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
//   transform: translateX(${({ $open }) => ($open ? "0%" : "100%")});
//   transition: transform 0.3s ease-out;
//   border-top-left-radius: 8px;
//   border-bottom-left-radius: 8px;
// `;

// export const ModalHeader = styled.div`
//   padding: 1.5rem;
//   border-bottom: 1px solid #eee;
//   position: sticky;
//   top: 0;
//   background: white;
//   z-index: 1;
// `;

// export const HeaderTop = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1rem;
// `;

// export const HeaderLeft = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;
// `;

// export const HeaderRight = styled.div`
//   display: flex;
//   gap: 0.5rem;
//   align-items: center;
// `;

// export const ActionButton = styled.button`
//   padding: 0.5rem 1rem;
//   background-color: #f3f4f6;
//   color: #374151;
//   border: 1px solid #d1d5db;
//   border-radius: 4px;
//   font-size: 0.875rem;
//   cursor: pointer;
//   transition: all 0.2s;

//   &:hover {
//     background-color: #e5e7eb;
//   }

//   &.edit {
//     background-color: #3b82f6;
//     color: white;
//     border-color: #2563eb;

//     &:hover {
//       background-color: #2563eb;
//     }
//   }

//   &.delete {
//     background-color: #ef4444;
//     color: white;
//     border-color: #dc2626;

//     &:hover {
//       background-color: #dc2626;
//     }
//   }
// `;

// export const ModalTitle = styled.h2`
//   font-size: 1.25rem;
//   font-weight: 600;
//   color: #111827;
//   margin: 0;
// `;

// export const PostMeta = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
//   color: #6b7280;
//   font-size: 0.875rem;
//   margin-top: 1rem;
//   padding: 1rem;
//   background-color: #f9fafb;
//   border-radius: 8px;
//   border: 1px solid #e5e7eb;

//   span {
//     display: flex;
//     align-items: center;
//     gap: 0.5rem;
//     padding: 0.25rem 0;
//   }
// `;

// export const StatusBadge = styled.span<{ status: string }>`
//   padding: 0.25rem 0.75rem;
//   border-radius: 9999px;
//   font-size: 0.75rem;
//   font-weight: 500;
//   background-color: ${({ status }) => {
//     switch (status) {
//       case "PENDING":
//         return "#fef3c7";
//       case "APPROVED":
//         return "#d1fae5";
//       case "REJECTED":
//         return "#fee2e2";
//       default:
//         return "#f3f4f6";
//     }
//   }};
//   color: ${({ status }) => {
//     switch (status) {
//       case "PENDING":
//         return "#92400e";
//       case "APPROVED":
//         return "#065f46";
//       case "REJECTED":
//         return "#991b1b";
//       default:
//         return "#374151";
//     }
//   }};
// `;

// export const PanelTitle = styled.h2`
//   font-size: 18px;
//   font-weight: bold;
//   color: #333333;
//   margin: 0;
// `;

// export const PostPanelTitle = styled.span`
//   font-size: 14px;
//   font-weight: bold;
//   color: #333333;
//   min-width: 60px; /* 라벨 너비 고정 */
// `;

// export const IconWrapper = styled.div`
//   color: #999999;
//   font-size: 18px;
//   cursor: pointer;

//   &:hover {
//     color: #333333;
//   }
// `;

// export const CloseButton = styled.button`
//   background: none;
//   border: none;
//   cursor: pointer;
//   font-size: 24px;
//   color: #999999;
//   line-height: 1;

//   &:hover {
//     color: #333333;
//   }
// `;

// export const PostDetailMeta = styled.div`
//   display: grid;
//   grid-template-columns: auto 1fr; /* 라벨과 값 2열 */
//   gap: 8px 16px;
//   font-size: 14px;
//   color: #666666;
//   width: 100%;
// `;

// export const MetaItem = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
// `;

// export const ModalBody = styled.div`
//   flex: 1;
//   padding: 20px;
// `;

// export const Section = styled.div`
//   margin-bottom: 20px;
//   padding-bottom: 20px;
//   border-bottom: 1px solid #eeeeee;

//   &:last-child {
//     border-bottom: none;
//     margin-bottom: 0;
//   }
// `;

// export const SectionTitle = styled.h3`
//   font-size: 16px;
//   font-weight: bold;
//   color: #333333;
//   margin-bottom: 15px;
// `;

// export const PostContent = styled.div`
//   font-size: 14px;
//   color: #555555;
//   line-height: 1.6;
//   white-space: pre-wrap;
// `;

// export const FileList = styled.ul`
//   list-style: none;
//   padding: 0;
//   margin: 0;
// `;

// export const FileItem = styled.li`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 8px 0;
//   border-bottom: 1px solid #f0f0f0;

//   &:last-child {
//     border-bottom: none;
//   }
// `;

// export const FileName = styled.a`
//   color: #2c3e50;
//   text-decoration: none;
//   font-size: 14px;

//   &:hover {
//     text-decoration: underline;
//   }
// `;

// export const FileSize = styled.span`
//   font-size: 12px;
//   color: #999999;
// `;

// export const CommentsSection = styled.div`
//   margin-top: 20px;
//   padding-top: 20px;
//   border-top: 1px solid #eeeeee;
// `;

// export const CommentCountHeader = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   margin-bottom: 20px;

//   span {
//     font-weight: bold;
//     color: #333333;
//     font-size: 15px;
//   }

//   &::after {
//     content: "";
//     flex-grow: 1;
//     height: 1px;
//     background-color: #dddddd;
//   }
// `;

// export const QuestionCount = styled.span`
//   color: #666666;
//   font-weight: normal !important;
// `;

// export const CommentInputContainer = styled.div`
//   margin-bottom: 20px;
//   background-color: #ffffff;
//   padding: 15px;
//   border-radius: 8px;
//   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
// `;

// export const CommentTextArea = styled.textarea`
//   width: 100%;
//   padding: 10px;
//   border: 1px solid #dddddd;
//   border-radius: 4px;
//   resize: vertical;
//   font-size: 14px;
//   line-height: 1.5;
//   margin-bottom: 10px;

//   &:focus {
//     outline: none;
//     border-color: #4f46e5;
//     box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
//   }
// `;

// export const CommentSubmitButton = styled.button`
//   padding: 8px 16px;
//   background-color: #4f46e5;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   font-size: 14px;
//   cursor: pointer;
//   transition: background-color 0.2s;
//   float: right; /* 버튼을 오른쪽으로 정렬 */

//   &:hover {
//     background-color: #4338ca;
//   }

//   &:disabled {
//     background-color: #cccccc;
//     cursor: not-allowed;
//   }
// `;

// export const CommentButtonGroup = styled.div`
//   display: flex;
//   justify-content: flex-end;
//   gap: 10px; /* 버튼 간 간격 */
//   margin-top: 10px; /* textarea와의 간격 */
// `;

// export const QuestionButton = styled.button`
//   padding: 8px 16px;
//   background-color: #f0f0f0; /* 배경색 */
//   color: #333333; /* 글자색 */
//   border: 1px solid #dddddd; /* 테두리 */
//   border-radius: 4px;
//   font-size: 14px;
//   cursor: pointer;
//   transition: background-color 0.2s;

//   &:hover {
//     background-color: #e0e0e0;
//   }

//   &:disabled {
//     background-color: #cccccc;
//     cursor: not-allowed;
//   }
// `;

// export const CommentsList = styled.div`
//   max-height: none; /* 스크롤바 제거 */
//   overflow-y: visible; /* 스크롤바 제거 */
//   margin-bottom: 0;
//   padding-right: 0;
// `;

// export const CommentItem = styled.div`
//   background-color: #ffffff; /* 흰색 배경 */
//   border-radius: 8px;
//   padding: 15px;
//   margin-bottom: 10px;
//   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); /* 그림자 */
// `;

// export const CommentMeta = styled.div`
//   display: flex;
//   justify-content: space-between;
//   font-size: 12px;
//   color: #999999;
//   margin-bottom: 8px;
// `;

// export const CommentAuthor = styled.span`
//   font-weight: bold;
//   color: #333333;
//   font-size: 14px;
// `;

// export const CommentText = styled.p`
//   font-size: 14px;
//   color: #555555;
//   line-height: 1.5;
//   margin-bottom: 10px;
// `;

// export const CommentActions = styled.div`
//   font-size: 12px;
//   text-align: right;
//   a {
//     color: #666666;
//     margin-left: 10px;
//     cursor: pointer;

//     &:hover {
//       text-decoration: underline;
//       color: #2c3e50;
//     }
//   }
// `;

// export const ReplyInputContainer = styled(CommentInputContainer)`
//   margin-top: 1rem;
//   padding: 1rem;
//   background-color: #f9fafb;
//   border-radius: 8px;
//   border: 1px solid #e5e7eb;
// `;

// export const CancelButton = styled.button`
//   padding: 0.5rem 1rem;
//   background-color: #f3f4f6;
//   color: #374151;
//   border: 1px solid #d1d5db;
//   border-radius: 4px;
//   font-size: 0.875rem;
//   cursor: pointer;
//   transition: all 0.2s;

//   &:hover {
//     background-color: #e5e7eb;
//   }
// `;
