// import styled from "styled-components";

// export const QuestionListContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 16px;
//   width: 100%;
// `;

// export const QuestionItem = styled.div`
//   background: #ffffff;
//   border: 1px solid #e1e5e9;
//   border-radius: 8px;
//   padding: 20px;
//   cursor: pointer;
//   transition: all 0.2s ease;

//   &:hover {
//     border-color: #007bff;
//     box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
//     transform: translateY(-1px);
//   }
// `;

// export const QuestionHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: flex-start;
//   margin-bottom: 12px;
//   gap: 16px;
// `;

// export const QuestionTitle = styled.h3`
//   font-size: 18px;
//   font-weight: 600;
//   color: #2c3e50;
//   margin: 0;
//   flex: 1;
//   line-height: 1.4;
// `;

// export const QuestionAuthor = styled.span`
//   font-size: 14px;
//   color: #6c757d;
//   background: #f8f9fa;
//   padding: 4px 8px;
//   border-radius: 4px;
//   white-space: nowrap;
// `;

// export const QuestionContent = styled.p`
//   font-size: 14px;
//   color: #495057;
//   line-height: 1.6;
//   margin: 0 0 16px 0;
//   display: -webkit-box;
//   -webkit-line-clamp: 2;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
// `;

// export const QuestionStats = styled.div`
//   display: flex;
//   gap: 16px;
//   margin-bottom: 12px;

//   span {
//     font-size: 13px;
//     color: #6c757d;
//     display: flex;
//     align-items: center;
//     gap: 4px;

//     &::before {
//       content: "";
//       width: 4px;
//       height: 4px;
//       background: #6c757d;
//       border-radius: 50%;
//     }

//     &:first-child::before {
//       display: none;
//     }
//   }
// `;

// export const QuestionActions = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// `;

// export const QuestionDate = styled.span`
//   font-size: 12px;
//   color: #adb5bd;
// `;

// export const LoadMoreButton = styled.button`
//   background: #ffffff;
//   border: 1px solid #dee2e6;
//   border-radius: 6px;
//   padding: 12px 24px;
//   font-size: 14px;
//   color: #495057;
//   cursor: pointer;
//   transition: all 0.2s ease;
//   align-self: center;
//   margin-top: 16px;

//   &:hover:not(:disabled) {
//     background: #f8f9fa;
//     border-color: #adb5bd;
//   }

//   &:disabled {
//     opacity: 0.6;
//     cursor: not-allowed;
//   }
// `;

// export const EmptyState = styled.div`
//   text-align: center;
//   padding: 40px 20px;
//   color: #6c757d;

//   p {
//     font-size: 16px;
//     margin-bottom: 16px;
//   }

//   button {
//     background: #007bff;
//     color: white;
//     border: none;
//     border-radius: 6px;
//     padding: 8px 16px;
//     font-size: 14px;
//     cursor: pointer;
//     transition: background 0.2s ease;

//     &:hover {
//       background: #0056b3;
//     }
//   }
// `;

// export const LoadingSpinner = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 40px;

//   &::after {
//     content: "";
//     width: 32px;
//     height: 32px;
//     border: 3px solid #f3f3f3;
//     border-top: 3px solid #007bff;
//     border-radius: 50%;
//     animation: spin 1s linear infinite;
//   }

//   @keyframes spin {
//     0% {
//       transform: rotate(0deg);
//     }
//     100% {
//       transform: rotate(360deg);
//     }
//   }
// `;
