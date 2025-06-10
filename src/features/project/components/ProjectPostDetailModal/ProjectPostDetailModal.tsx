// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContexts";
// import type { Comment, Post } from "../../types/post";
// import {
//   getPostDetail,
//   getComments,
//   createComment,
//   deletePost,
//   updatePost,
// } from "../../services/postService";
// import CommentList from "../CommentList/CommentList";
// // import { BiMinimize, BiExpand } from "react-icons/bi"; // BiMinimize, BiExpand 임포트 주석 처리
// import {
//   ModalOverlay,
//   ModalPanel,
//   ModalHeader,
//   HeaderTop,
//   HeaderLeft,
//   StatusBadge,
//   PanelTitle,
//   PostPanelTitle,
//   HeaderRight,
//   IconWrapper,
//   CloseButton,
//   PostDetailMeta,
//   MetaItem,
//   ModalBody,
//   Section,
//   SectionTitle,
//   PostContent,
//   FileList,
//   FileItem,
//   FileName,
//   FileSize,
//   CommentsSection,
//   CommentCountHeader,
//   QuestionCount,
//   CommentInputContainer,
//   CommentTextArea,
//   CommentSubmitButton,
//   CommentButtonGroup,
//   QuestionButton,
//   ModalTitle,
//   PostMeta,
//   ActionButton,
//   ReplyInputContainer,
//   CancelButton,
// } from "./ProjectPostDetailModal.styled.ts";

// interface File {
//   name: string;
//   size: string;
//   url?: string;
// }

// interface ProjectPostDetailModalProps {
//   open: boolean;
//   onClose: () => void;
//   postId: number | null;
//   onDeleteSuccess?: () => void; // 삭제 성공 후 목록을 새로고침하는 콜백
// }

// const ProjectPostDetailModal: React.FC<ProjectPostDetailModalProps> = ({
//   open,
//   onClose,
//   postId,
//   onDeleteSuccess,
// }) => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [post, setPost] = useState<Post | null>(null);
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [commentText, setCommentText] = useState("");
//   const [replyText, setReplyText] = useState<string>("");
//   const [replyingTo, setReplyingTo] = useState<number | null>(null);

//   const isAuthor = post?.author?.id === user?.id;

//   useEffect(() => {
//     const fetchPostAndComments = async () => {
//       if (!postId) return;

//       try {
//         setLoading(true);
//         setError(null);
//         const [postResponse, commentsResponse] = await Promise.all([
//           getPostDetail(postId),
//           getComments(postId),
//         ]);

//         // postResponse.data가 존재하는지 확인
//         if (!postResponse.data) {
//           throw new Error("게시글 데이터를 불러올 수 없습니다.");
//         }

//         console.log("게시글 상세 authorIp:", {
//           postId: postResponse.data.postId,
//           authorIp: postResponse.data.authorIp,
//         });

//         // 댓글 목록이 있을 때만 authorIp 출력
//         if (commentsResponse.data && Array.isArray(commentsResponse.data)) {
//           console.log(
//             "댓글 목록 authorIp:",
//             commentsResponse.data.map((comment) => ({
//               commentId: comment.id,
//               authorIp: comment.authorIp,
//             }))
//           );
//         } else {
//           console.log("댓글 목록이 없습니다.");
//         }

//         setPost(postResponse.data);
//         setComments(commentsResponse.data || []);

//         // 디버깅: project 정보 확인
//         console.log("게시글 상세 조회 응답:", postResponse.data);
//         console.log("Project 정보:", postResponse.data.project);
//         console.log("ClientCompany:", postResponse.data.project?.clientCompany);
//         console.log(
//           "DeveloperCompany:",
//           postResponse.data.project?.developerCompany
//         );
//       } catch (err) {
//         if (err instanceof Error && err.message.includes("완료")) {
//           console.log(err.message);
//         } else {
//           setError("게시글을 불러오는데 실패했습니다.");
//           console.error("게시글 상세 조회 중 오류:", err);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (open && postId) {
//       fetchPostAndComments();
//     }
//   }, [open, postId]);

//   const handleCommentSubmit = async () => {
//     if (!commentText.trim() || !postId) return;

//     try {
//       await createComment(postId, commentText);
//       setCommentText("");
//       // 댓글 작성 후 댓글 목록 새로고침
//       const commentsResponse = await getComments(postId);
//       setComments(commentsResponse.data || []);
//     } catch (err) {
//       console.error("댓글 작성 중 오류:", err);
//       alert("댓글 작성 중 오류가 발생했습니다.");
//     }
//   };

//   const handleReply = (commentId: number) => {
//     setReplyingTo(commentId);
//     setReplyText("");
//   };

//   const handleReplySubmit = async () => {
//     if (!postId || !replyingTo || !replyText.trim()) return;

//     try {
//       await createComment(postId, replyText, replyingTo);
//       setReplyText("");
//       setReplyingTo(null);
//       // 댓글 목록 새로고침
//       const commentsResponse = await getComments(postId);
//       setComments(commentsResponse.data || []);
//     } catch (error) {
//       console.error("답글 작성 중 오류:", error);
//       alert("답글 작성 중 오류가 발생했습니다.");
//     }
//   };

//   const handleCommentUpdate = async () => {
//     if (!postId) return;
//     try {
//       const commentsResponse = await getComments(postId);
//       setComments(commentsResponse.data || []);
//     } catch (error) {
//       console.error("댓글 목록 새로고침 중 오류:", error);
//     }
//   };

//   const getStatusText = (status: string) => {
//     switch (status) {
//       case "PENDING":
//         return "대기";
//       case "APPROVED":
//         return "승인";
//       case "REJECTED":
//         return "반려";
//       default:
//         return status;
//     }
//   };

//   const getTypeText = (type: string) => {
//     switch (type) {
//       case "NOTICE":
//         return "공지";
//       case "QUESTION":
//         return "질문";
//       case "REPORT":
//         return "보고";
//       case "GENERAL":
//         return "일반";
//       default:
//         return type;
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("ko-KR", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // 임시 파일 데이터
//   const dummyFiles: File[] = [
//     { name: "ERP_DB_ERD_v1.2.pdf", size: "2.4MB", url: "#" },
//     { name: "ERP_DB_SQL_Scripts.zip", size: "1.8MB", url: "#" },
//   ];

//   const handleFileDownload = (file: File) => {
//     if (file.url) {
//       window.open(file.url, "_blank");
//     } else {
//       console.log("Download file:", file.name);
//     }
//   };

//   // comments가 항상 배열임을 보장하는 안전한 변수
//   const safeComments = comments || [];

//   const questionComments = safeComments.filter((comment) =>
//     comment.content.includes("질문")
//   ); // 임시 필터링

//   const handleEdit = () => {
//     if (!postId) return;
//     navigate(`/posts/${postId}/edit`);
//     onClose();
//   };

//   const handleDelete = async () => {
//     if (!postId) {
//       alert("게시글 정보가 올바르지 않습니다. 다시 시도해주세요.");
//       return;
//     }

//     if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await deletePost(postId);
//       if (response.success) {
//         alert("게시글이 성공적으로 삭제되었습니다.");
//         onClose();
//         // 삭제 성공 후 목록 새로고침 콜백 호출
//         if (onDeleteSuccess) {
//           onDeleteSuccess();
//         }
//       } else {
//         alert(response.message || "게시글 삭제에 실패했습니다.");
//         setError(response.message);
//       }
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error
//           ? err.message
//           : "게시글 삭제 중 오류가 발생했습니다.";
//       alert(errorMessage);
//       setError(errorMessage);
//       console.error("게시글 삭제 중 오류:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 모달이 열려있지 않으면 렌더링하지 않음
//   if (!open) return null;

//   if (loading) {
//     return (
//       <ModalOverlay>
//         <ModalPanel $open={open}>
//           <p>로딩 중...</p>
//         </ModalPanel>
//       </ModalOverlay>
//     );
//   }

//   if (error) {
//     return (
//       <ModalOverlay>
//         <ModalPanel $open={open}>
//           <p>{error}</p>
//           <CloseButton onClick={onClose}>&times;</CloseButton>
//         </ModalPanel>
//       </ModalOverlay>
//     );
//   }

//   if (!post) {
//     return (
//       <ModalOverlay>
//         <ModalPanel $open={open}>
//           <p>게시글을 찾을 수 없습니다.</p>
//           <CloseButton onClick={onClose}>&times;</CloseButton>
//         </ModalPanel>
//       </ModalOverlay>
//     );
//   }

//   return (
//     <ModalOverlay>
//       <ModalPanel $open={open} onClick={(e) => e.stopPropagation()}>
//         <ModalHeader>
//           <HeaderTop>
//             <HeaderLeft>
//               <ModalTitle>게시글 상세</ModalTitle>
//             </HeaderLeft>
//             <HeaderRight>
//               {isAuthor && (
//                 <>
//                   <ActionButton className="edit" onClick={handleEdit}>
//                     수정
//                   </ActionButton>
//                   <ActionButton className="delete" onClick={handleDelete}>
//                     삭제
//                   </ActionButton>
//                 </>
//               )}
//               <ActionButton onClick={onClose}>닫기</ActionButton>
//             </HeaderRight>
//           </HeaderTop>
//           <PostMeta>
//             <span>작성자: {post?.author.name || ""}</span>
//             <span>IP: {post?.authorIp || ""}</span>
//             <span>
//               작성일:{" "}
//               {post?.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
//             </span>
//             {post?.updatedAt && post.updatedAt !== post.createdAt && (
//               <span>수정일: {new Date(post.updatedAt).toLocaleString()}</span>
//             )}
//             <span>프로젝트: {post?.project?.name || ""}</span>
//             {post?.project?.clientCompany &&
//               post.project.clientCompany.trim() !== "" && (
//                 <span>담당자: {post.project.clientCompany}</span>
//               )}
//             {post?.project?.developerCompany &&
//               post.project.developerCompany.trim() !== "" && (
//                 <span>개발사: {post.project.developerCompany}</span>
//               )}
//             <span>상태: {getStatusText(post?.status || "")}</span>
//           </PostMeta>
//         </ModalHeader>

//         <ModalBody>
//           {/* 게시글 제목과 상태 */}
//           <Section>
//             <div style={{ marginBottom: 16 }}>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   marginBottom: 8,
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 10,
//                     flex: 1,
//                     minWidth: 0,
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: 18,
//                       fontWeight: 700,
//                       color: "#222",
//                       whiteSpace: "nowrap",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       flex: 1,
//                       minWidth: 0,
//                     }}
//                   >
//                     {post?.title || ""}
//                   </span>
//                   <StatusBadge status={post?.status || ""}>
//                     {getStatusText(post?.status || "")}
//                   </StatusBadge>
//                 </div>
//               </div>
//             </div>
//           </Section>

//           <Section>
//             <SectionTitle>작업 설명</SectionTitle>
//             <PostContent>{post.content}</PostContent>
//           </Section>

//           {/* 첨부 파일 섹션 활성화 */}
//           {dummyFiles && dummyFiles.length > 0 && (
//             <Section>
//               <SectionTitle>첨부 파일</SectionTitle>
//               <FileList>
//                 {dummyFiles.map((file, index) => (
//                   <FileItem
//                     key={index}
//                     onClick={() => handleFileDownload(file)}
//                   >
//                     <FileName>{file.name}</FileName>
//                     <FileSize>{file.size}</FileSize>
//                   </FileItem>
//                 ))}
//               </FileList>
//             </Section>
//           )}

//           <CommentsSection>
//             <CommentCountHeader>
//               <span>댓글 ({safeComments.length})</span>
//               <QuestionCount>질문 ({questionComments.length})</QuestionCount>
//             </CommentCountHeader>
//             <CommentInputContainer>
//               <CommentTextArea
//                 value={commentText}
//                 onChange={(e) => setCommentText(e.target.value)}
//                 placeholder="댓글을 입력하세요..."
//                 rows={3}
//               />
//               <CommentButtonGroup>
//                 <QuestionButton type="button">질문</QuestionButton>
//                 <CommentSubmitButton onClick={handleCommentSubmit}>
//                   등록
//                 </CommentSubmitButton>
//               </CommentButtonGroup>
//             </CommentInputContainer>
//             {replyingTo && (
//               <ReplyInputContainer>
//                 <CommentTextArea
//                   value={replyText}
//                   onChange={(e) => setReplyText(e.target.value)}
//                   placeholder="답글을 입력하세요..."
//                   rows={3}
//                 />
//                 <CommentButtonGroup>
//                   <CancelButton onClick={() => setReplyingTo(null)}>
//                     취소
//                   </CancelButton>
//                   <CommentSubmitButton onClick={handleReplySubmit}>
//                     답글 등록
//                   </CommentSubmitButton>
//                 </CommentButtonGroup>
//               </ReplyInputContainer>
//             )}
//             <CommentList
//               comments={safeComments}
//               onReply={handleReply}
//               onCommentUpdate={handleCommentUpdate}
//             />
//           </CommentsSection>
//         </ModalBody>
//       </ModalPanel>
//     </ModalOverlay>
//   );
// };

// export default ProjectPostDetailModal;
