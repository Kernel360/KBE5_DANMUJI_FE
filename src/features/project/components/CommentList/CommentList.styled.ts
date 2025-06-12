// import styled from "styled-components";

// export const CommentContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
//   max-height: none;
//   overflow-y: visible;
// `;

// export const CommentItem = styled.div<{ $isReply?: boolean; $depth?: number }>`
//   padding: 1rem;
//   border: 1px solid #e5e7eb;
//   border-radius: 8px;
//   background-color: white;
//   margin-left: ${({ $depth = 0 }) => `${$depth * 2}rem`};
//   position: relative;

//   ${({ $depth = 0 }) =>
//     $depth > 0 &&
//     `
//     &::before {
//       content: "";
//       position: absolute;
//       left: -1rem;
//       top: 1.5rem;
//       width: 1rem;
//       height: 1px;
//       background-color: #e5e7eb;
//     }
//   `}
// `;

// export const CommentMeta = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 0.5rem;
//   flex-wrap: wrap;
//   gap: 0.5rem;
// `;

// export const CommentAuthor = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   font-weight: 600;
//   color: #111827;
// `;

// export const CommentAuthorName = styled.span``;

// export const CommentAuthorIp = styled.span`
//   color: #6b7280;
//   font-size: 0.875rem;
//   font-weight: normal;
// `;

// export const CommentDate = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   color: #6b7280;
//   font-size: 0.875rem;
// `;

// export const CommentText = styled.p`
//   margin: 0.5rem 0;
//   color: #374151;
//   white-space: pre-wrap;
//   word-break: break-all;
// `;

// export const CommentActions = styled.div`
//   display: flex;
//   gap: 0.5rem;
//   margin-top: 0.5rem;
// `;

// export const EditButton = styled.button`
//   background: none;
//   border: none;
//   color: #666;
//   cursor: pointer;
//   font-size: 0.875rem;
//   padding: 0;

//   &:hover {
//     color: #333;
//     text-decoration: underline;
//   }
// `;

// export const DeleteButton = styled.button`
//   padding: 0.25rem 0.5rem;
//   background-color: #fee2e2;
//   color: #dc2626;
//   border: 1px solid #fecaca;
//   border-radius: 4px;
//   font-size: 0.75rem;
//   cursor: pointer;
//   transition: all 0.2s;

//   &:hover {
//     background-color: #fecaca;
//   }
// `;

// export const ReplyButton = styled(EditButton)``;

// export const EditForm = styled.div`
//   margin-top: 0.5rem;
// `;

// export const EditTextArea = styled.textarea`
//   width: 100%;
//   padding: 0.5rem;
//   border: 1px solid #ddd;
//   border-radius: 4px;
//   margin-bottom: 0.5rem;
//   resize: vertical;
//   min-height: 80px;
//   background-color: #ffffff;
//   color: #333333;

//   &:focus {
//     outline: none;
//     border-color: #4f46e5;
//     box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
//   }

//   &::placeholder {
//     color: #9ca3af;
//   }
// `;

// export const EditButtonGroup = styled.div`
//   display: flex;
//   gap: 0.5rem;
//   justify-content: flex-end;
// `;

// export const SaveButton = styled.button`
//   padding: 0.5rem 1rem;
//   background-color: #4f46e5;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   font-size: 0.875rem;

//   &:hover {
//     background-color: #4338ca;
//   }
// `;

// export const CancelButton = styled.button`
//   padding: 0.5rem 1rem;
//   background-color: #f3f4f6;
//   color: #666;
//   border: 1px solid #ddd;
//   border-radius: 4px;
//   cursor: pointer;
//   font-size: 0.875rem;

//   &:hover {
//     background-color: #e5e7eb;
//   }
// `;

// export const ErrorMessage = styled.div`
//   background-color: #fee2e2;
//   color: #dc2626;
//   padding: 0.75rem;
//   border-radius: 4px;
//   margin-bottom: 1rem;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   font-size: 0.875rem;
//   border: 1px solid #fecaca;
// `;

// export const CloseButton = styled.button`
//   background: none;
//   border: none;
//   color: #dc2626;
//   font-size: 1.25rem;
//   cursor: pointer;
//   padding: 0;
//   line-height: 1;
//   opacity: 0.7;
//   transition: opacity 0.2s;

//   &:hover {
//     opacity: 1;
//   }
// `;
