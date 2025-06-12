// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   getPostDetail,
//   updatePost,
// } from "@/features/project/services/postService";
// import type { Post, PostUpdateRequest } from "@/features/project/types/post";
// import {
//   PageContainer,
//   MainContentWrapper,
//   EditForm,
//   FormTitle,
//   FormGroup,
//   Label,
//   Input,
//   TextArea,
//   Select,
//   ButtonGroup,
//   SubmitButton,
//   CancelButton,
//   ErrorMessage,
// } from "./PostEditPage.styled";

// export default function PostEditPage() {
//   const { postId } = useParams<{ postId: string }>();
//   const navigate = useNavigate();
//   const [post, setPost] = useState<Post | null>(null);
//   const [formData, setFormData] = useState<PostUpdateRequest>({
//     title: "",
//     content: "",
//     type: "GENERAL",
//     priority: 1,
//     status: "PENDING",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     console.log("PostEditPage 마운트됨 - postId:", postId);
//     if (!postId) {
//       setError("게시글 ID가 제공되지 않았습니다.");
//       return;
//     }

//     const fetchPost = async () => {
//       try {
//         setLoading(true);
//         console.log("게시글 상세 조회 시작 - postId:", postId);
//         const response = await getPostDetail(parseInt(postId));
//         console.log("게시글 상세 데이터:", response.data);
//         setPost(response.data);
//         setFormData({
//           title: response.data.title,
//           content: response.data.content,
//           type: response.data.type,
//           priority: response.data.priority,
//           status: response.data.status,
//         });
//       } catch (err) {
//         setError("게시글을 불러오는 데 실패했습니다.");
//         console.error("게시글 로드 중 오류:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPost();
//   }, [postId]);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "priority" ? parseInt(value, 10) : value,
//     }));
//     setFormErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
//   };

//   const validateForm = () => {
//     const errors: Record<string, string> = {};
//     if (!formData.title.trim()) {
//       errors.title = "제목을 입력해주세요.";
//     }
//     if (!formData.content.trim()) {
//       errors.content = "내용을 입력해주세요.";
//     }
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("수정 폼 제출됨 - postId:", postId, "formData:", formData);

//     if (!postId || !post || !validateForm()) {
//       console.error("필수 데이터 누락:", { postId, post });
//       alert("게시글 정보가 올바르지 않습니다. 다시 시도해주세요.");
//       return;
//     }

//     try {
//       setLoading(true);

//       // 전송할 데이터 준비 (문자열 enum 사용)
//       const requestData = {
//         title: formData.title,
//         content: formData.content,
//         type: formData.type,
//         status: formData.status,
//         priority: formData.priority,
//       };

//       console.log("전송할 데이터:", requestData);
//       console.log("데이터 타입 확인:", {
//         title: typeof requestData.title,
//         content: typeof requestData.content,
//         type: typeof requestData.type,
//         status: typeof requestData.status,
//         priority: typeof requestData.priority,
//       });

//       console.log("게시글 수정 API 호출 시작");
//       const response = await updatePost(parseInt(postId), requestData);
//       console.log("게시글 수정 API 응답:", response);

//       if (response.success || response.message?.includes("완료")) {
//         // 성공 시 바로 이전 페이지로 이동 (alert 제거로 부드러운 UX)
//         navigate(-1); // 이전 페이지로 돌아가기
//       } else {
//         alert(response.message || "게시글 수정에 실패했습니다.");
//         setError(response.message);
//       }
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error
//           ? err.message
//           : "게시글 수정 중 오류가 발생했습니다.";
//       alert(errorMessage);
//       setError(errorMessage);
//       console.error("게시글 수정 중 오류:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <PageContainer>로딩 중...</PageContainer>;
//   if (error) return <PageContainer>{error}</PageContainer>;
//   if (!post) return <PageContainer>게시글을 찾을 수 없습니다.</PageContainer>;

//   return (
//     <PageContainer>
//       <MainContentWrapper>
//         <EditForm onSubmit={handleSubmit}>
//           <FormTitle>게시글 수정</FormTitle>

//           <FormGroup>
//             <Label htmlFor="title">제목</Label>
//             <Input
//               id="title"
//               name="title"
//               type="text"
//               value={formData.title}
//               onChange={handleChange}
//             />
//             {formErrors.title && (
//               <ErrorMessage>{formErrors.title}</ErrorMessage>
//             )}
//           </FormGroup>

//           <FormGroup>
//             <Label htmlFor="content">내용</Label>
//             <TextArea
//               id="content"
//               name="content"
//               rows={10}
//               value={formData.content}
//               onChange={handleChange}
//             />
//             {formErrors.content && (
//               <ErrorMessage>{formErrors.content}</ErrorMessage>
//             )}
//           </FormGroup>

//           <FormGroup>
//             <Label htmlFor="type">유형</Label>
//             <Select
//               id="type"
//               name="type"
//               value={formData.type}
//               onChange={handleChange}
//             >
//               <option value="GENERAL">일반</option>
//               <option value="NOTICE">공지</option>
//               <option value="REPORT">보고</option>
//             </Select>
//           </FormGroup>

//           <FormGroup>
//             <Label htmlFor="priority">우선순위</Label>
//             <Select
//               id="priority"
//               name="priority"
//               value={formData.priority.toString()}
//               onChange={handleChange}
//             >
//               <option value="1">낮음</option>
//               <option value="2">보통</option>
//               <option value="3">높음</option>
//             </Select>
//           </FormGroup>

//           <FormGroup>
//             <Label htmlFor="status">상태</Label>
//             <Select
//               id="status"
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//             >
//               <option value="PENDING">대기</option>
//               <option value="APPROVED">승인</option>
//               <option value="REJECTED">반려</option>
//             </Select>
//           </FormGroup>

//           <ButtonGroup>
//             <SubmitButton type="submit" disabled={loading}>
//               {loading ? "저장 중..." : "수정 완료"}
//             </SubmitButton>
//             <CancelButton type="button" onClick={() => navigate(-1)}>
//               취소
//             </CancelButton>
//           </ButtonGroup>
//         </EditForm>
//       </MainContentWrapper>
//     </PageContainer>
//   );
// }
