import React, { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalPanel,
  ModalHeader,
  ModalHeaderActionButton,
  ModalBody,
  LoadingSpinner,
  ErrorMessage,
  ModalHeaderButtonGroup,
  ModalHeaderCloseButton,
} from "@/features/board/components/Post/styles/ProjectPostDetailModal.styled";
import {
  getPostDetail,
  getComments,
  deletePost,
  updateComment,
  deleteComment,
  createComment,
} from "@/features/project-d/services/postService";
import type { Post, Comment, PostFile } from "@/features/project-d/types/post";
import api from "@/api/axios";
import {
  showErrorToast,
  showSuccessToast,
  withErrorHandling,
} from "@/utils/errorHandler";
import { useUserProfile } from "@/hooks/useUserProfile";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import { useAuth } from "@/hooks/useAuth";
import { FaReply, FaEdit, FaTrash } from "react-icons/fa";
import { FiX } from "react-icons/fi";

// 분리된 컴포넌트들 import
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostAttachments from "./PostAttachments";
import PostLinks from "./PostLinks";
import CommentSection from "./CommentSection";
import { getUsersByProject } from "@/features/user/services/userService";
import { extractCompletedMentions } from "@/utils/mentionUtils";
import PostFormModal from "../FormModal/PostFormModal";

interface PostDetailModalProps {
  open: boolean;
  onClose: () => void;
  postId: number | null;
  stepName?: string;
  onPostDelete?: (deletedPostId: number) => void;
  onEditPost?: (postId: number) => void;
  onReplyPost?: (parentId: number) => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({
  open,
  onClose,
  postId,
  stepName,
  onPostDelete,
  onEditPost,
  onReplyPost,
}) => {
  const { user, role } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  // 대댓글 관련 상태 추가
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  // 댓글 수정 상태 추가
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const [closing, setClosing] = useState(false);

  const {
    profileState,
    openUserProfile,
    closeUserProfile,
    handleViewProfile,
    handleSendMessage,
    handleSendInquiry,
    setProfileState,
  } = useUserProfile();

  const [allUsernames, setAllUsernames] = useState<string[]>([]);

  // 수정 모달 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 모달 닫기 애니메이션 적용
  const handleCloseWithAnimation = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 320); // 애니메이션 시간과 맞춤
  };

  // ESC 키 이벤트 처리
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        handleCloseWithAnimation();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [open]);

  // 모달 바깥 클릭 처리
  const handleOverlayClick = (e: React.MouseEvent) => {
    // ModalOverlay 자체를 클릭했을 때만 닫기
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      handleCloseWithAnimation();
    }
  };

  useEffect(() => {
    const loadPostData = async () => {
      if (open && postId !== null) {
        try {
          setLoading(true);
          // 댓글 상태 초기화
          setComments([]);

          // 게시글 상세 정보 가져오기
          const postResponse = await getPostDetail(postId);
          if (postResponse.data) {
            setPost(postResponse.data);
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
          showErrorToast("게시글을 불러오는 중 오류가 발생했습니다.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadPostData();
  }, [open, postId]);

  useEffect(() => {
    const fetchAllUsernames = async () => {
      if (post && post.project && post.project.projectId) {
        try {
          const response = await getUsersByProject(post.project.projectId);
          if (response.data) {
            setAllUsernames(response.data.map((user) => user.username));
          }
        } catch (e) {
          setAllUsernames([]);
        }
      }
    };
    fetchAllUsernames();
  }, [post]);

  // 댓글 제출 핸들러
  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !postId) return;

    await withErrorHandling(async () => {
      setSubmittingComment(true);
      await createComment(postId, commentText);
      setCommentText("");

      // 댓글 목록 새로고침
      const commentsResponse = await getComments(postId);
      if (commentsResponse.data) {
        setComments(commentsResponse.data);
      }

      showSuccessToast("댓글이 등록되었습니다.");
    });

    setSubmittingComment(false);
  };

  // 답글 클릭 핸들러
  const handleReplyClick = (comment: Comment) => {
    const authorName =
      comment.authorName || comment.author?.name || "알 수 없는 사용자";
    setReplyText(`@${authorName} `);
    setReplyingTo(comment.id);
  };

  // 답글 제출 핸들러
  const handleReplySubmit = async () => {
    if (!replyText.trim() || !postId || replyingTo === null) return;

    await withErrorHandling(async () => {
      setSubmittingReply(true);
      await createComment(postId, replyText, replyingTo);
      setReplyText("");
      setReplyingTo(null);

      // 댓글 목록 새로고침
      const commentsResponse = await getComments(postId);
      if (commentsResponse.data) {
        setComments(commentsResponse.data);
      }

      showSuccessToast("답글이 등록되었습니다.");
    });

    setSubmittingReply(false);
  };

  // 게시글 수정 핸들러
  const handleEditPost = () => {
    if (postId) {
      setIsEditModalOpen(true);
    }
  };

  // 수정 모달 닫기 핸들러
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  // 수정 완료 핸들러
  const handleEditSuccess = async () => {
    // 게시글 데이터 새로고침
    if (postId) {
      try {
        const postResponse = await getPostDetail(postId);
        if (postResponse.data) {
          setPost(postResponse.data);
        }
      } catch (err) {
        console.error("게시글 새로고침 실패:", err);
      }
    }
    setIsEditModalOpen(false);
  };

  // 게시글 답글 핸들러
  const handleReplyPost = () => {
    if (onReplyPost && postId) {
      onReplyPost(postId);
    }
  };

  // 게시글 삭제 핸들러
  const handleDeletePost = async () => {
    if (!postId) return;

    if (
      !window.confirm(
        "정말로 이 게시글을 삭제하시겠습니까?\n\n삭제된 게시글은 관리자에게 문의하여 복구가 가능합니다."
      )
    ) {
      return;
    }

    await withErrorHandling(async () => {
      setLoading(true);
      await deletePost(postId);
      showSuccessToast("게시글이 삭제되었습니다.");

      if (onPostDelete) {
        onPostDelete(postId);
      }

      handleCloseWithAnimation();
    });

    setLoading(false);
  };

  // 댓글 수정 시작 핸들러
  const handleEditComment = (commentId: number) => {
    const comment = comments.find((c) => c.id === commentId);
    if (comment) {
      setEditingCommentId(commentId);
      setEditText(comment.content);
    }
  };

  // 댓글 수정 저장 핸들러
  const handleSaveEdit = async (commentId: number) => {
    if (!editText.trim()) return;

    await withErrorHandling(async () => {
      await updateComment(commentId, editText);
      setEditingCommentId(null);
      setEditText("");

      // 댓글 목록 새로고침
      if (postId) {
        const commentsResponse = await getComments(postId);
        if (commentsResponse.data) {
          setComments(commentsResponse.data);
        }
      }

      showSuccessToast("댓글이 수정되었습니다.");
    });
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      return;
    }

    await withErrorHandling(async () => {
      await deleteComment(commentId);

      // 댓글 목록 새로고침
      if (postId) {
        const commentsResponse = await getComments(postId);
        if (commentsResponse.data) {
          setComments(commentsResponse.data);
        }
      }

      showSuccessToast("댓글이 삭제되었습니다.");
    });
  };

  // 파일 다운로드 핸들러
  const handleFileDownload = async (file: PostFile, referenceId: number) => {
    try {
      const response = await api.get(
        `/api/posts/${referenceId}/files/${file.id}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("파일 다운로드 실패:", error);
      showErrorToast("파일 다운로드에 실패했습니다.");
    }
  };

  // 작성자 본인 여부 확인 함수
  const isAuthor = (authorId: number) => {
    return user?.id === authorId;
  };

  const formatDate = (dateString: string) => {
    let date;
    if (dateString.includes("T")) {
      // ISO 8601 (UTC) 문자열
      date = new Date(dateString);
    } else {
      // 'YYYY-MM-DD HH:mm:ss' → 'YYYY-MM-DDTHH:mm:ssZ'로 변환 후 UTC로 파싱
      date = new Date(dateString.replace(" ", "T") + "Z");
    }
    date.setHours(date.getHours() + 9);

    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!open) return null;

  return (
    <>
      <ModalOverlay
        onClick={handleOverlayClick}
        style={{
          opacity: closing ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        <ModalPanel $closing={closing}>
          <ModalHeader>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  color: "#fdb924",
                  fontSize: "1.5rem",
                  fontWeight: "900",
                  marginRight: "2px",
                  marginLeft: "5px",
                }}
              >
                |
              </span>
              <span
                style={{
                  marginLeft: "-2.5px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                }}
              >
                {stepName || "게시글 상세"}
              </span>
            </div>
            <ModalHeaderButtonGroup>
              {post && (
                <>
                  {/* 작성자 본인인 경우: 수정/삭제 버튼 모두 표시 */}
                  {isAuthor(post.author?.id || post.authorId) && (
                    <>
                      <ModalHeaderActionButton
                        onClick={handleEditPost}
                        title="수정"
                      >
                        <FaEdit />
                        수정
                      </ModalHeaderActionButton>
                      <ModalHeaderActionButton
                        onClick={handleDeletePost}
                        title="삭제"
                      >
                        <FaTrash />
                        삭제
                      </ModalHeaderActionButton>
                    </>
                  )}
                  {/* 관리자가 다른 사용자의 게시글을 조회하는 경우: 삭제 버튼만 표시 */}
                  {!isAuthor(post.author?.id || post.authorId) &&
                    role === "ROLE_ADMIN" && (
                      <ModalHeaderActionButton
                        onClick={handleDeletePost}
                        title="삭제"
                      >
                        <FaTrash />
                        삭제
                      </ModalHeaderActionButton>
                    )}
                  <ModalHeaderActionButton
                    onClick={handleReplyPost}
                    title="답글"
                  >
                    <FaReply />
                    답글
                  </ModalHeaderActionButton>
                </>
              )}
              <ModalHeaderCloseButton onClick={handleCloseWithAnimation}>
                <FiX />
              </ModalHeaderCloseButton>
            </ModalHeaderButtonGroup>
          </ModalHeader>

          <ModalBody>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                }}
              >
                <LoadingSpinner />
              </div>
            ) : post ? (
              <>
                {/* 게시글 제목 */}
                <div
                  style={{
                    margin: "0 16px 24px 16px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: "#111827",
                      margin: "0",
                      lineHeight: "1.4",
                    }}
                  >
                    {post.title}
                  </h2>
                </div>
                <PostHeader post={post} onUserProfileClick={openUserProfile} />
                <PostContent post={post} onUserProfileClick={openUserProfile} />
                <PostAttachments
                  files={post.files}
                  onFileDownload={handleFileDownload}
                  referenceId={post.postId}
                />
                <PostLinks links={post.links} />
                <CommentSection
                  comments={comments}
                  commentText={commentText}
                  onCommentTextChange={setCommentText}
                  onCommentSubmit={handleCommentSubmit}
                  submittingComment={submittingComment}
                  replyingTo={replyingTo}
                  replyText={replyText}
                  onReplyTextChange={setReplyText}
                  onReplySubmit={handleReplySubmit}
                  onReplyCancel={() => setReplyingTo(null)}
                  submittingReply={submittingReply}
                  editingCommentId={editingCommentId}
                  editText={editText}
                  onEditTextChange={setEditText}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={() => {
                    setEditingCommentId(null);
                    setEditText("");
                  }}
                  onReply={handleReplyClick}
                  isAuthor={isAuthor}
                  formatDate={formatDate}
                  onUserProfileClick={(e, username, userId) => {
                    // 댓글에서 해당 사용자의 role 정보 찾기
                    const comment = comments.find(
                      (c) =>
                        c.authorUsername === username ||
                        c.authorName === username
                    );
                    const role = comment?.role;

                    // 역할에 따른 한글 표시
                    let roleDisplay = "사용자";
                    let isAdmin = false;

                    switch (role) {
                      case "ROLE_ADMIN":
                        roleDisplay = "관리자";
                        isAdmin = true;
                        break;
                      case "ROLE_DEV":
                        roleDisplay = "개발자";
                        break;
                      case "ROLE_CLIENT":
                        roleDisplay = "고객";
                        break;
                      case "ROLE_USER":
                      default:
                        roleDisplay = "사용자";
                        break;
                    }

                    // 프로필 상태 업데이트
                    const rect = e.currentTarget.getBoundingClientRect();
                    const position = {
                      top: rect.bottom + window.scrollY + 5,
                      left: rect.left + window.scrollX,
                    };

                    setProfileState({
                      isOpen: true,
                      username,
                      userId,
                      position,
                      userRole: roleDisplay,
                      isAdmin,
                    });
                  }}
                  allUsernames={allUsernames}
                  completedMentions={extractCompletedMentions(
                    comments.map((c) => c.content).join(" ")
                  )}
                />
              </>
            ) : (
              <ErrorMessage>게시글을 찾을 수 없습니다.</ErrorMessage>
            )}
          </ModalBody>
        </ModalPanel>
      </ModalOverlay>

      {/* 사용자 프로필 드롭다운 */}
      {profileState.isOpen && (
        <UserProfileDropdown
          username={profileState.username}
          userId={profileState.userId}
          position={profileState.position}
          onClose={closeUserProfile}
          onViewProfile={handleViewProfile}
          onSendMessage={handleSendMessage}
          onSendInquiry={handleSendInquiry}
          userRole={profileState.userRole}
          isAdmin={profileState.isAdmin}
        />
      )}

      {/* 게시글 수정 모달 */}
      <PostFormModal
        open={isEditModalOpen}
        onClose={handleEditModalClose}
        mode="edit"
        postId={postId || undefined}
        projectId={post?.project?.projectId || 1}
        stepId={post?.projectStepId || 1}
        onSuccess={handleEditSuccess}
        colorTheme={{ main: "#fdb924", sub: "#f59e0b" }}
      />
    </>
  );
};

export default PostDetailModal;
