// import React, { useState } from "react";
// import { createQuestion } from "../../services/questionService";
// import {
//   ModalOverlay,
//   ModalContainer,
//   ModalHeader,
//   ModalTitle,
//   CloseButton,
//   ModalBody,
//   FormGroup,
//   Label,
//   Input,
//   TextArea,
//   ButtonGroup,
//   SubmitButton,
//   CancelButton,
//   ErrorMessage,
// } from "./QuestionCreateModal.styled";

// interface QuestionCreateModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   postId: string;
//   onQuestionCreated?: () => void;
// }

// const QuestionCreateModal: React.FC<QuestionCreateModalProps> = ({
//   isOpen,
//   onClose,
//   postId,
//   onQuestionCreated,
// }) => {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!title.trim()) {
//       setError("제목을 입력해주세요.");
//       return;
//     }

//     if (!content.trim()) {
//       setError("내용을 입력해주세요.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       await createQuestion({
//         postId,
//         title: title.trim(),
//         content: content.trim(),
//       });

//       // 성공 시 폼 초기화
//       setTitle("");
//       setContent("");
//       onQuestionCreated?.();
//       onClose();
//     } catch (err) {
//       setError("질문 생성에 실패했습니다. 다시 시도해주세요.");
//       console.error("Error creating question:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     if (!loading) {
//       setTitle("");
//       setContent("");
//       setError(null);
//       onClose();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <ModalOverlay onClick={handleClose}>
//       <ModalContainer onClick={(e) => e.stopPropagation()}>
//         <ModalHeader>
//           <ModalTitle>새 질문 작성</ModalTitle>
//           <CloseButton onClick={handleClose} disabled={loading}>
//             ×
//           </CloseButton>
//         </ModalHeader>

//         <ModalBody>
//           <form onSubmit={handleSubmit}>
//             <FormGroup>
//               <Label htmlFor="title">제목 *</Label>
//               <Input
//                 id="title"
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="질문 제목을 입력하세요"
//                 maxLength={100}
//                 disabled={loading}
//               />
//             </FormGroup>

//             <FormGroup>
//               <Label htmlFor="content">내용 *</Label>
//               <TextArea
//                 id="content"
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 placeholder="질문 내용을 자세히 작성해주세요"
//                 rows={8}
//                 maxLength={2000}
//                 disabled={loading}
//               />
//             </FormGroup>

//             {error && <ErrorMessage>{error}</ErrorMessage>}

//             <ButtonGroup>
//               <CancelButton
//                 type="button"
//                 onClick={handleClose}
//                 disabled={loading}
//               >
//                 취소
//               </CancelButton>
//               <SubmitButton
//                 type="submit"
//                 disabled={loading || !title.trim() || !content.trim()}
//               >
//                 {loading ? "작성 중..." : "질문 작성"}
//               </SubmitButton>
//             </ButtonGroup>
//           </form>
//         </ModalBody>
//       </ModalContainer>
//     </ModalOverlay>
//   );
// };

// export default QuestionCreateModal;
