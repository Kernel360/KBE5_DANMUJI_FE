// import React from "react";
// import { Answer } from "../../types/question";
// import AnswerItem from "../Answer/AnswerItem";
// import { AnswerListContainer, EmptyState } from "./AnswerList.styled";

// interface AnswerListProps {
//   answers: Answer[];
//   questionId: string;
//   onAnswerUpdated?: () => void;
// }

// const AnswerList: React.FC<AnswerListProps> = ({
//   answers,
//   questionId,
//   onAnswerUpdated,
// }) => {
//   if (answers.length === 0) {
//     return (
//       <AnswerListContainer>
//         <EmptyState>
//           <p>아직 답변이 없습니다.</p>
//           <p>첫 번째 답변을 작성해보세요!</p>
//         </EmptyState>
//       </AnswerListContainer>
//     );
//   }

//   return (
//     <AnswerListContainer>
//       {answers.map((answer) => (
//         <AnswerItem
//           key={answer.id}
//           answer={answer}
//           questionId={questionId}
//           onAnswerUpdated={onAnswerUpdated}
//         />
//       ))}
//     </AnswerListContainer>
//   );
// };

// export default AnswerList;
