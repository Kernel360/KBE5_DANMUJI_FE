import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ModalOverlay,
  ModalPanel,
  ModalHeader,
  CloseButton,
  ModalHeaderActionButton,
  ModalBody,
  SectionTitle,
  CommentsSection,
  CommentsList,
  CommentItem,
  CommentMeta,
  CommentAuthor,
  CommentActions,
  CommentActionButton,
  CommentText,
  CommentTextArea,
  CommentSubmitButton,
  LoadingSpinner,
  ErrorMessage,
  ReplyInputContainer,
  ModalHeaderButtonGroup,
  ModalHeaderCloseButton,
  InfoGrid,
  InfoRow,
  InfoKey,
  InfoValue,
  QuestionAnswerStyledButton,
} from "./ProjectPostDetailModal.styled.ts";
import {
  getPostDetail,
  getComments,
  createComment,
  deletePost,
  updateComment,
  deleteComment,
} from "@/features/project/services/postService";
import type { Post, Comment } from "@/features/project/types/post";
import QuestionAnswerModal from "../QuestionAnswerModal/QuestionAnswerModal";
import { useAuth } from "@/contexts/AuthContexts";
import { FaReply, FaEdit, FaTrash } from "react-icons/fa";

interface PostDetailModalProps {
  open: boolean;
  onClose: () => void;
  postId: number | null;
  onPostDelete?: (deletedPostId: number) => void;
  onEditPost?: (postId: number) => void;
  onReplyPost?: (parentId: number) => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({
  open,
  onClose,
  postId,
  onPostDelete,
  onEditPost,
  onReplyPost,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showQuestionAnswer, setShowQuestionAnswer] = useState(false);

  // 대댓글 관련 상태 추가
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  // 댓글 수정 상태 추가
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const loadPostData = async () => {
      if (open && postId !== null) {
        try {
          setLoading(true);

          // 게시글 상세 정보 가져오기
          const postResponse = await getPostDetail(postId);
          if (postResponse.data) {
            setPost(postResponse.data);
            // 프로젝트 정보 디버깅
            console.log("게시글 상세 정보:", postResponse.data);
            console.log("프로젝트 정보:", postResponse.data.project);
            console.log("고객사:", postResponse.data.project?.clientCompany);
            console.log("개발사:", postResponse.data.project?.developerCompany);
          }

          // 댓글 목록 가져오기
          try {
            const commentsResponse = await getComments(postId);
            if (commentsResponse.data) {
              setComments(commentsResponse.data);
            }
          } catch (commentError) {
            console.log("댓글 로드 실패:", commentError);
            setComments([]);
          }
        } catch (err) {
          console.error("게시글 로드 중 오류:", err);
        } finally {
          setLoading(false);
        }
      } else if (!open) {
        setPost(null);
        setComments([]);
        setLoading(false);
      }
    };

    loadPostData();
  }, [open, postId]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !postId) return;

    try {
      setSubmittingComment(true);
      const response = await createComment(postId, commentText);

      if (response.data) {
        // 댓글 목록을 다시 불러오기
        const commentsResponse = await getComments(postId);
        if (commentsResponse.data) {
          setComments(commentsResponse.data);
        }
        setCommentText("");
      }
    } catch (error) {
      console.error("댓글 작성 중 오류:", error);
      alert("댓글 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmittingComment(false);
    }
  };

  // 대댓글 생성 함수
  const handleReplyClick = (comment: Comment) => {
    setReplyingTo(comment.id);
    setReplyText(`@${comment.author?.name || "알 수 없는 사용자"} `);
  };

  // 답글 등록
  const handleReplySubmit = async () => {
    if (!replyText.trim() || !postId || replyingTo === null) return;
    try {
      setSubmittingReply(true);
      await createComment(postId, replyText, replyingTo); // parentId는 남겨두되, UI는 평면
      // 댓글 목록 새로고침
      const commentsResponse = await getComments(postId);
      setComments(commentsResponse.data || []);
      setReplyText("");
      setReplyingTo(null);
    } catch {
      alert("답글 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleEditPost = () => {
    if (!postId) return;
    console.log("게시글 수정 버튼 클릭 - postId:", postId);
    onEditPost?.(postId);
    onClose();
  };

  const handleReplyPost = () => {
    if (!postId) return;
    console.log("답글 작성 버튼 클릭 - parentId:", postId);
    onReplyPost?.(postId);
    onClose();
  };

  const handleDeletePost = async () => {
    if (!postId) {
      alert("게시글 정보가 올바르지 않습니다.");
      return;
    }

    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      setLoading(true);
      console.log("게시글 삭제 시작 - postId:", postId);
      const response = await deletePost(postId);
      console.log("게시글 삭제 응답:", response);

      // 백엔드 응답 형식에 맞춰 성공 여부 확인
      if (response.status === "OK" || response.message?.includes("완료")) {
        // 성공 시 바로 모달 닫고 콜백 호출 (alert 제거로 부드러운 UX)
        onClose();
        if (onPostDelete && postId) {
          onPostDelete(postId);
        }
      } else {
        throw new Error(response.message || "게시글 삭제에 실패했습니다.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "게시글 삭제 중 오류가 발생했습니다.";
      console.error("게시글 삭제 중 오류:", err);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "대기";
      case "APPROVED":
        return "승인";
      case "REJECTED":
        return "거부";
      default:
        return status;
    }
  };

  // 상태별 스타일 반환 함수
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          background: "#fef3c7",
          color: "#d97706",
        };
      case "APPROVED":
        return {
          background: "#d1fae5",
          color: "#059669",
        };
      case "REJECTED":
        return {
          background: "#fee2e2",
          color: "#dc2626",
        };
      default:
        return {
          background: "#f3f4f6",
          color: "#6b7280",
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 작성자 본인 여부 확인 함수
  const isAuthor = (authorId: number) => {
    return user?.id === authorId;
  };

  // soft delete 제외한 댓글만 필터링
  const visibleComments = comments.filter(
    (comment) => !comment.deletedAt && comment.status !== "DELETED"
  );

  // 렌더링되는 댓글 개수 계산
  const getRenderedCommentCount = () => {
    const rootComments = visibleComments.filter(
      (comment) => !comment.parentCommentId
    );
    let totalCount = 0;

    rootComments.forEach((rootComment) => {
      totalCount++; // 루트 댓글 카운트

      // 이 댓글을 부모로 하는 모든 답글(1,2,3...depth) 카운트
      const replies = visibleComments.filter((c) => {
        let parent = c.parentCommentId;
        while (parent) {
          if (parent === rootComment.id) return true;
          const parentComment = visibleComments.find((cc) => cc.id === parent);
          parent = parentComment?.parentCommentId;
        }
        return false;
      });

      totalCount += replies.length; // 답글들 카운트
    });

    return totalCount;
  };

  const renderedCommentCount = getRenderedCommentCount();

  // 댓글 저장
  const handleSaveEdit = async (commentId: number) => {
    try {
      await updateComment(commentId, editText);
      setEditingCommentId(null);
      setEditText("");
      // 목록 새로고침
      if (postId) {
        const commentsResponse = await getComments(postId);
        setComments(commentsResponse.data || []);
      }
    } catch {
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  // 댓글 삭제 함수 추가
  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await deleteComment(commentId);
      if (postId) {
        const commentsResponse = await getComments(postId);
        setComments(commentsResponse.data || []);
      }
    } catch {
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  if (!open) return null;

  if (loading) {
    return (
      <ModalOverlay onClick={onClose}>
        <ModalPanel>
          <LoadingSpinner>로딩 중...</LoadingSpinner>
        </ModalPanel>
      </ModalOverlay>
    );
  }

  if (!post) {
    return (
      <ModalOverlay onClick={onClose}>
        <ModalPanel>
          <ErrorMessage>게시글을 찾을 수 없습니다.</ErrorMessage>
        </ModalPanel>
      </ModalOverlay>
    );
  }

  return (
    <>
      <ModalOverlay onClick={onClose}>
        <ModalPanel onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <ModalHeader>
            {/* 상단 고정 제목/버튼 */}
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#222",
              }}
            >
              게시글 상세
            </span>
            <ModalHeaderButtonGroup>
              <ModalHeaderActionButton
                onClick={handleReplyPost}
                title="답글달기"
              >
                <FaReply size={14} style={{ marginRight: 4 }} /> 답글
              </ModalHeaderActionButton>
              {post.author?.id && isAuthor(post.author.id) && (
                <>
                  <button
                    onClick={handleEditPost}
                    style={{
                      background: "none",
                      color: "#6366f1",
                      border: "none",
                      borderRadius: "5px",
                      padding: "0 10px",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      height: "28px",
                      minWidth: "0",
                      boxShadow: "none",
                      whiteSpace: "nowrap",
                      transition: "background 0.15s, color 0.15s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#f3f4f6";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "none";
                    }}
                  >
                    <FaEdit style={{ marginRight: "0.25rem" }} />
                    수정
                  </button>
                  <button
                    onClick={handleDeletePost}
                    style={{
                      background: "none",
                      color: "#ef4444",
                      border: "none",
                      borderRadius: "5px",
                      padding: "0 10px",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      height: "28px",
                      minWidth: "0",
                      boxShadow: "none",
                      whiteSpace: "nowrap",
                      transition: "background 0.15s, color 0.15s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#f3f4f6";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "none";
                    }}
                  >
                    <FaTrash style={{ marginRight: "0.25rem" }} />
                    삭제
                  </button>
                </>
              )}
              <ModalHeaderCloseButton onClick={onClose}>
                ×
              </ModalHeaderCloseButton>
            </ModalHeaderButtonGroup>
          </ModalHeader>
          <ModalBody>
            {/* 게시글 제목 + 질문&답변 버튼 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#222",
                  wordBreak: "break-all",
                }}
              >
                {post.title}
              </span>
              <QuestionAnswerStyledButton
                onClick={() => setShowQuestionAnswer(true)}
              >
                질문 & 답변
              </QuestionAnswerStyledButton>
            </div>

            {/* 상세 정보 */}
            <InfoGrid>
              <InfoRow>
                <InfoKey>요청 상태</InfoKey>
                <InfoValue>
                  <span
                    style={{
                      ...getStatusStyle(post.status),
                      fontWeight: 600,
                      fontSize: 13,
                      borderRadius: 8,
                      padding: "2px 12px",
                      marginLeft: 0,
                    }}
                  >
                    {getStatusText(post.status)}
                  </span>
                </InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoKey>작성일</InfoKey>
                <InfoValue>{formatDate(post.createdAt)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoKey>수정일</InfoKey>
                <InfoValue>{formatDate(post.updatedAt)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoKey>작성자</InfoKey>
                <InfoValue>
                  {post.author?.name}
                  <span
                    style={{
                      fontSize: 12,
                      color: "#b0b0b0",
                      marginLeft: 8,
                      fontWeight: 400,
                    }}
                  >
                    {post.authorIp}
                  </span>
                </InfoValue>
              </InfoRow>
            </InfoGrid>

            {/* 작업 설명 */}
            <div style={{ margin: "32px 0 0 0" }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
                작업 설명
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#444",
                  lineHeight: 1.7,
                  background: "#f8f9fa",
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                {post.content}
              </div>
            </div>

            {/* 첨부 파일 */}
            <div style={{ margin: "32px 0 0 0" }}>
              <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 15 }}>
                첨부 파일
              </div>
              <div>
                {("attachments" in post &&
                (post as { attachments?: { name: string; size: string }[] })
                  .attachments &&
                (post as { attachments?: { name: string; size: string }[] })
                  .attachments.length > 0
                  ? (post as { attachments: { name: string; size: string }[] })
                      .attachments
                  : [
                      { name: "ERP_DB_ERD_v1.2.pdf", size: "2.4MB" },
                      { name: "ERP_DB_SQL_Scripts.zip", size: "1.8MB" },
                    ]
                ).map((file: { name: string; size: string }, idx: number) => {
                  const ext = file.name.split(".").pop();
                  let icon = null;
                  if (ext === "pdf")
                    icon = (
                      <span
                        style={{
                          display: "inline-block",
                          width: 18,
                          height: 18,
                          background: "#e74c3c",
                          borderRadius: 4,
                          marginRight: 8,
                        }}
                      />
                    );
                  else if (ext === "zip")
                    icon = (
                      <span
                        style={{
                          display: "inline-block",
                          width: 18,
                          height: 18,
                          background: "#f1c40f",
                          borderRadius: 4,
                          marginRight: 8,
                        }}
                      />
                    );
                  else
                    icon = (
                      <span
                        style={{
                          display: "inline-block",
                          width: 18,
                          height: 18,
                          background: "#bdbdbd",
                          borderRadius: 4,
                          marginRight: 8,
                        }}
                      />
                    );
                  return (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#f7f7f8",
                        borderRadius: 8,
                        padding: "10px 14px",
                        marginBottom: 8,
                        fontSize: 14,
                      }}
                    >
                      {icon}
                      <span style={{ flex: 1 }}>{file.name}</span>
                      <span
                        style={{
                          color: "#b0b0b0",
                          fontSize: 12,
                          marginLeft: 8,
                        }}
                      >
                        {file.size}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <CommentsSection>
              <SectionTitle>댓글 ({renderedCommentCount})</SectionTitle>

              {/* 댓글 입력창을 위로 이동 */}
              <div
                style={{
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "flex-end",
                  }}
                >
                  <CommentTextArea
                    placeholder="댓글을 입력하세요"
                    value={commentText}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setCommentText(e.target.value)
                    }
                    disabled={submittingComment}
                    style={{
                      flex: 1,
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.5rem",
                      padding: "0.75rem",
                      fontSize: "0.875rem",
                      resize: "vertical",
                      minHeight: "60px",
                      background: "white",
                      color: "#374151",
                      transition: "border-color 0.2s ease",
                    }}
                  />
                  <CommentSubmitButton
                    onClick={handleCommentSubmit}
                    disabled={!commentText.trim() || submittingComment}
                    style={{
                      background: "#fdb924",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      padding: "0.75rem 1.25rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                      height: "fit-content",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {submittingComment ? "등록 중..." : "등록"}
                  </CommentSubmitButton>
                </div>
              </div>

              <CommentsList>
                {visibleComments.length > 0 ? (
                  visibleComments
                    .filter((comment) => !comment.parentCommentId)
                    .map((rootComment) => {
                      // 이 댓글을 부모로 하는 모든 답글(1,2,3...depth) 평면적으로 시간순 정렬
                      const replies = visibleComments.filter((c) => {
                        let parent = c.parentCommentId;
                        while (parent) {
                          if (parent === rootComment.id) return true;
                          const parentComment = visibleComments.find(
                            (cc) => cc.id === parent
                          );
                          parent = parentComment?.parentCommentId;
                        }
                        return false;
                      });
                      // 시간순 정렬
                      replies.sort(
                        (a, b) =>
                          new Date(a.createdAt).getTime() -
                          new Date(b.createdAt).getTime()
                      );
                      return [
                        <CommentItem key={rootComment.id}>
                          <CommentMeta>
                            <CommentAuthor>
                              {rootComment.author?.name || "알 수 없는 사용자"}
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "#b0b0b0",
                                  marginLeft: 6,
                                  fontWeight: 400,
                                }}
                              >
                                {rootComment.authorIp}
                              </span>
                            </CommentAuthor>
                            <CommentActions>
                              <span>{formatDate(rootComment.createdAt)}</span>
                              {rootComment.author &&
                                isAuthor(rootComment.author.id) && (
                                  <>
                                    {editingCommentId === rootComment.id ? (
                                      <>
                                        <CommentActionButton
                                          onClick={() => {
                                            setEditingCommentId(rootComment.id);
                                            setEditText(rootComment.content);
                                          }}
                                        >
                                          수정
                                        </CommentActionButton>
                                        <CommentActionButton
                                          onClick={() =>
                                            handleDeleteComment(rootComment.id)
                                          }
                                        >
                                          삭제
                                        </CommentActionButton>
                                      </>
                                    ) : (
                                      <>
                                        <CommentActionButton
                                          onClick={() => {
                                            setEditingCommentId(rootComment.id);
                                            setEditText(rootComment.content);
                                          }}
                                        >
                                          수정
                                        </CommentActionButton>
                                        <CommentActionButton
                                          onClick={() =>
                                            handleDeleteComment(rootComment.id)
                                          }
                                        >
                                          삭제
                                        </CommentActionButton>
                                      </>
                                    )}
                                  </>
                                )}
                              <CommentActionButton
                                onClick={() => handleReplyClick(rootComment)}
                              >
                                답글
                              </CommentActionButton>
                            </CommentActions>
                          </CommentMeta>
                          <CommentText>
                            {editingCommentId === rootComment.id ? (
                              <div style={{ marginTop: 8 }}>
                                <CommentTextArea
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  autoFocus
                                  rows={3}
                                  style={{
                                    width: "100%",
                                    border: "1.5px solid #fdb924",
                                    borderRadius: "0.375rem",
                                    background: "#fffdfa",
                                    color: "#222",
                                    fontSize: "0.95em",
                                    padding: "0.75rem",
                                    resize: "vertical",
                                  }}
                                />
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 8,
                                    marginTop: 6,
                                  }}
                                >
                                  <CommentSubmitButton
                                    onClick={() =>
                                      handleSaveEdit(rootComment.id)
                                    }
                                  >
                                    저장
                                  </CommentSubmitButton>
                                  <CommentActionButton
                                    onClick={() => {
                                      setEditingCommentId(null);
                                      setEditText("");
                                    }}
                                  >
                                    취소
                                  </CommentActionButton>
                                </div>
                              </div>
                            ) : (
                              rootComment.content
                                .split(/(@\S+)/g)
                                .map((part, idx) =>
                                  part.startsWith("@") ? (
                                    <span
                                      key={idx}
                                      style={{
                                        color: "#fdb924",
                                        fontWeight: 500,
                                      }}
                                    >
                                      {part}
                                    </span>
                                  ) : (
                                    <span key={idx}>{part}</span>
                                  )
                                )
                            )}
                          </CommentText>
                          {(replyingTo as number | null) === rootComment.id && (
                            <ReplyInputContainer>
                              <CommentTextArea
                                placeholder="답글을 입력하세요"
                                value={replyText}
                                onChange={(
                                  e: React.ChangeEvent<HTMLTextAreaElement>
                                ) => setReplyText(e.target.value)}
                                disabled={submittingReply}
                                rows={3}
                              />
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <CommentSubmitButton
                                  onClick={handleReplySubmit}
                                  disabled={
                                    !replyText.trim() || submittingReply
                                  }
                                >
                                  {submittingReply ? "등록 중..." : "답글 등록"}
                                </CommentSubmitButton>
                              </div>
                            </ReplyInputContainer>
                          )}
                        </CommentItem>,
                        ...replies.map((reply) => (
                          <CommentItem key={reply.id}>
                            <CommentMeta>
                              <CommentAuthor>
                                {reply.author?.name || "알 수 없는 사용자"}
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: "#b0b0b0",
                                    marginLeft: 6,
                                    fontWeight: 400,
                                  }}
                                >
                                  {reply.authorIp}
                                </span>
                              </CommentAuthor>
                              <CommentActions>
                                <span>{formatDate(reply.createdAt)}</span>
                                {reply.author && isAuthor(reply.author.id) && (
                                  <>
                                    {editingCommentId === reply.id ? (
                                      <>
                                        <CommentActionButton
                                          onClick={() => {
                                            setEditingCommentId(reply.id);
                                            setEditText(reply.content);
                                          }}
                                        >
                                          수정
                                        </CommentActionButton>
                                        <CommentActionButton
                                          onClick={() =>
                                            handleDeleteComment(reply.id)
                                          }
                                        >
                                          삭제
                                        </CommentActionButton>
                                      </>
                                    ) : (
                                      <>
                                        <CommentActionButton
                                          onClick={() => {
                                            setEditingCommentId(reply.id);
                                            setEditText(reply.content);
                                          }}
                                        >
                                          수정
                                        </CommentActionButton>
                                        <CommentActionButton
                                          onClick={() =>
                                            handleDeleteComment(reply.id)
                                          }
                                        >
                                          삭제
                                        </CommentActionButton>
                                      </>
                                    )}
                                  </>
                                )}
                                <CommentActionButton
                                  onClick={() => handleReplyClick(reply)}
                                >
                                  답글
                                </CommentActionButton>
                              </CommentActions>
                            </CommentMeta>
                            <CommentText>
                              <span
                                style={{
                                  display: "inline-block",
                                  background: "#f3f4f6",
                                  color: "#888",
                                  fontSize: "0.75em",
                                  borderRadius: 4,
                                  padding: "2px 6px",
                                  marginRight: 6,
                                  verticalAlign: "middle",
                                }}
                              >
                                답글
                              </span>
                              {editingCommentId === reply.id ? (
                                <div style={{ marginTop: 8 }}>
                                  <CommentTextArea
                                    value={editText}
                                    onChange={(e) =>
                                      setEditText(e.target.value)
                                    }
                                    autoFocus
                                    rows={3}
                                    style={{
                                      width: "100%",
                                      border: "1.5px solid #fdb924",
                                      borderRadius: "0.375rem",
                                      background: "#fffdfa",
                                      color: "#222",
                                      fontSize: "0.95em",
                                      padding: "0.75rem",
                                      resize: "vertical",
                                    }}
                                  />
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      gap: 8,
                                      marginTop: 6,
                                    }}
                                  >
                                    <CommentSubmitButton
                                      onClick={() => handleSaveEdit(reply.id)}
                                    >
                                      저장
                                    </CommentSubmitButton>
                                    <CommentActionButton
                                      onClick={() => {
                                        setEditingCommentId(null);
                                        setEditText("");
                                      }}
                                    >
                                      취소
                                    </CommentActionButton>
                                  </div>
                                </div>
                              ) : (
                                reply.content
                                  .split(/(@\S+)/g)
                                  .map((part, idx) =>
                                    part.startsWith("@") ? (
                                      <span
                                        key={idx}
                                        style={{
                                          color: "#fdb924",
                                          fontWeight: 500,
                                        }}
                                      >
                                        {part}
                                      </span>
                                    ) : (
                                      <span key={idx}>{part}</span>
                                    )
                                  )
                              )}
                            </CommentText>
                            {(replyingTo as number | null) === reply.id && (
                              <ReplyInputContainer>
                                <CommentTextArea
                                  placeholder="답글을 입력하세요"
                                  value={replyText}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>
                                  ) => setReplyText(e.target.value)}
                                  disabled={submittingReply}
                                  rows={3}
                                />
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <CommentSubmitButton
                                    onClick={handleReplySubmit}
                                    disabled={
                                      !replyText.trim() || submittingReply
                                    }
                                  >
                                    {submittingReply
                                      ? "등록 중..."
                                      : "답글 등록"}
                                  </CommentSubmitButton>
                                </div>
                              </ReplyInputContainer>
                            )}
                          </CommentItem>
                        )),
                      ];
                    })
                ) : (
                  <p>아직 댓글이 없습니다.</p>
                )}
              </CommentsList>
            </CommentsSection>
          </ModalBody>
        </ModalPanel>
      </ModalOverlay>
      <QuestionAnswerModal
        open={showQuestionAnswer}
        onClose={() => setShowQuestionAnswer(false)}
        postId={postId}
      />
    </>
  );
};

export default PostDetailModal;
