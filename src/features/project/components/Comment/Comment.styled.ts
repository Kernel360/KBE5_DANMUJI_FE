// import styled from "styled-components";

// export const CommentContainer = styled.div<{ $level: number }>`
//   background-color: #ffffff; /* 흰색 배경 */
//   border-radius: 8px;
//   padding: 15px;
//   margin-bottom: 10px;
//   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); /* 그림자 */

//   /* 중첩된 댓글에 대한 스타일 오버라이드 및 기존 레벨 스타일 제거 */
//   ${(props) =>
//     props.$level > 0 &&
//     `
//     margin-left: 20px; /* 중첩된 댓글 들여쓰기 */
//     background-color: #f9fafb; /* 중첩된 댓글은 약간 다른 배경 */
//     box-shadow: none; /* 중첩된 댓글은 그림자 제거 */
//     border: 1px solid #eeeeee; /* 테두리 추가 */
//   `}
// `;

// export const CommentHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   font-size: 12px;
//   color: #999999;
//   margin-bottom: 8px;
// `;

// export const AuthorName = styled.span`
//   font-weight: bold;
//   color: #333333;
//   font-size: 14px;
// `;

// export const CommentDate = styled.span`
//   color: #999999;
//   font-size: 12px;
// `;

// export const CommentContent = styled.p`
//   font-size: 14px;
//   color: #555555;
//   line-height: 1.5;
//   margin-bottom: 10px;
// `;

// export const ReplyButton = styled.button`
//   background: none;
//   border: none;
//   color: #666666;
//   font-size: 12px;
//   padding: 0;
//   margin-left: 10px; /* 액션 링크 간 간격 */
//   cursor: pointer;

//   &:hover {
//     text-decoration: underline;
//     color: #2c3e50;
//   }
// `;

// export const ReplyFormContainer = styled.div`
//   margin-top: 12px;
//   background-color: #f9f9f9;
//   padding: 15px;
//   border-radius: 8px;
//   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
// `;

// export const ReplyForm = styled.form`
//   display: flex;
//   flex-direction: column; /* 세로 정렬 */
//   gap: 10px;
// `;

// export const ReplyInput = styled.textarea`
//   width: 100%;
//   padding: 10px;
//   border: 1px solid #dddddd;
//   border-radius: 4px;
//   resize: vertical;
//   font-size: 14px;
//   line-height: 1.5;
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

// export const SubmitButton = styled.button`
//   padding: 8px 16px;
//   background-color: #4f46e5;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   font-size: 14px;
//   cursor: pointer;
//   transition: background-color 0.2s;
//   align-self: flex-end; /* 오른쪽 정렬 */

//   &:hover {
//     background-color: #4338ca;
//   }

//   &:disabled {
//     background-color: #cccccc;
//     cursor: not-allowed;
//   }
// `;

// export const NestedReplyList = styled.div`
//   margin-top: 10px;
// `;

// // ReplyList는 CommentContainer의 $level > 0 스타일로 대체되어 더 이상 필요하지 않습니다.

// // ReplyItem은 CommentContainer의 $level > 0 스타일로 대체되어 더 이상 필요하지 않습니다.

// export const ReplyAuthorName = styled(AuthorName)`
//   font-size: 13px;
// `;

// export const ReplyContent = styled(CommentContent)`
//   font-size: 13px;
// `;

// export const ReplyDate = styled(CommentDate)`
//   font-size: 11px;
// `;

// export const CommentActions = styled.div`
//   font-size: 12px;
//   text-align: right;
//   margin-top: 5px; /* 댓글 내용과 액션 링크 간 간격 */

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
