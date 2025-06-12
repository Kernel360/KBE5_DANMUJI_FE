// import React, { useState, useEffect } from "react";
// import { Question } from "../../types/question";
// import { getQuestionsByPost } from "../../services/questionService";
// import {
//   QuestionListContainer,
//   QuestionItem,
//   QuestionHeader,
//   QuestionTitle,
//   QuestionAuthor,
//   QuestionDate,
//   QuestionContent,
//   QuestionStats,
//   QuestionActions,
//   LoadMoreButton,
//   EmptyState,
//   LoadingSpinner,
// } from "./QuestionList.styled";

// interface QuestionListProps {
//   postId: string;
//   onQuestionClick?: (question: Question) => void;
// }

// const QuestionList: React.FC<QuestionListProps> = ({
//   postId,
//   onQuestionClick,
// }) => {
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   const fetchQuestions = async (pageNum: number = 1) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await getQuestionsByPost(postId, pageNum);

//       if (pageNum === 1) {
//         setQuestions(response.data);
//       } else {
//         setQuestions((prev) => [...prev, ...response.data]);
//       }

//       setHasMore(response.data.length > 0);
//     } catch (err) {
//       setError("질문을 불러오는데 실패했습니다.");
//       console.error("Error fetching questions:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuestions();
//   }, [postId]);

//   const handleLoadMore = () => {
//     const nextPage = page + 1;
//     setPage(nextPage);
//     fetchQuestions(nextPage);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("ko-KR", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   if (loading && questions.length === 0) {
//     return (
//       <QuestionListContainer>
//         <LoadingSpinner />
//       </QuestionListContainer>
//     );
//   }

//   if (error && questions.length === 0) {
//     return (
//       <QuestionListContainer>
//         <EmptyState>
//           <p>질문을 불러오는데 실패했습니다.</p>
//           <button onClick={() => fetchQuestions()}>다시 시도</button>
//         </EmptyState>
//       </QuestionListContainer>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <QuestionListContainer>
//         <EmptyState>
//           <p>아직 질문이 없습니다.</p>
//         </EmptyState>
//       </QuestionListContainer>
//     );
//   }

//   return (
//     <QuestionListContainer>
//       {questions.map((question) => (
//         <QuestionItem
//           key={question.id}
//           onClick={() => onQuestionClick?.(question)}
//         >
//           <QuestionHeader>
//             <QuestionTitle>{question.title}</QuestionTitle>
//             <QuestionAuthor>{question.authorName}</QuestionAuthor>
//           </QuestionHeader>

//           <QuestionContent>
//             {question.content.length > 100
//               ? `${question.content.substring(0, 100)}...`
//               : question.content}
//           </QuestionContent>

//           <QuestionStats>
//             <span>답변 {question.answerCount}개</span>
//             <span>조회 {question.viewCount}회</span>
//           </QuestionStats>

//           <QuestionActions>
//             <QuestionDate>{formatDate(question.createdAt)}</QuestionDate>
//           </QuestionActions>
//         </QuestionItem>
//       ))}

//       {hasMore && (
//         <LoadMoreButton onClick={handleLoadMore} disabled={loading}>
//           {loading ? "불러오는 중..." : "더 보기"}
//         </LoadMoreButton>
//       )}
//     </QuestionListContainer>
//   );
// };

// export default QuestionList;
