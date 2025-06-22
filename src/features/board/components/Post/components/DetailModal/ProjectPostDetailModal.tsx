import React, { useState, useEffect, useRef } from "react";
import {
  ModalOverlay,
  ModalPanel,
  ModalHeader,
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
  RelativeTextareaWrapper,
  AttachmentsSection,
  FileList,
  FileItem,
  FileInfo,
  FileIcon,
  FileDetails,
  FileName,
  FileMeta,
  FileActions,
  FileActionButton,
  NoFilesMessage,
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
import QuestionAnswerModal from "@/features/board/components/Question/components/QuestionAnswerModal/QuestionAnswerModal";
import api from "@/api/axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  showErrorToast,
  showSuccessToast,
  withErrorHandling,
} from "@/utils/errorHandler";
import { renderContentWithMentions } from "@/utils/mentionUtils";
import { useUserProfile } from "@/hooks/useUserProfile";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import ClickableUsername from "@/components/ClickableUsername";

import {
  FaReply,
  FaEdit,
  FaTrash,
  FaComments,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive,
  FaFileAlt,
} from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import {
  FiUser,
  FiCalendar,
  FiFile,
  FiDownload,
  FiImage,
  FiFileText,
  FiFile as FiFileGeneric,
  FiFlag,
} from "react-icons/fi";
import MentionTextArea from "@/components/MentionTextArea";

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

  const [closing, setClosing] = useState(false);

  const {
    profileState,
    openUserProfile,
    closeUserProfile,
    handleViewProfile,
    handleSendMessage,
    handleSendInquiry,
  } = useUserProfile();

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
    if (e.target === e.currentTarget) {
      handleCloseWithAnimation();
    }
  };

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
            console.log(
              "우선순위 값:",
              postResponse.data.priority,
              "타입:",
              typeof postResponse.data.priority
            );
          }

          // 댓글 목록 가져오기
          try {
            const commentsResponse = await getComments(postId);
            if (commentsResponse.data) {
              // 추가: 각 댓글의 작성자 이름과 IP 콘솔 출력
              (Array.isArray(commentsResponse.data)
                ? commentsResponse.data
                : []
              ).forEach((c) => {
                console.log("댓글 작성자:", c.authorName, "IP:", c.authorIp);
              });
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

    const result = await withErrorHandling(async () => {
      setSubmittingComment(true);
      await createComment(postId, commentText);
      // 댓글 목록을 다시 불러오기
      const commentsResponse = await getComments(postId);
      if (commentsResponse.data) {
        setComments(commentsResponse.data);
      }
      setCommentText("");
      // showSuccessToast("댓글이 성공적으로 작성되었습니다.");
      return commentsResponse;
    }, "댓글 작성에 실패했습니다.");

    setSubmittingComment(false);
  };

  // 대댓글 생성 함수
  const handleReplyClick = (comment: Comment) => {
    setReplyingTo(comment.id);
    const authorName =
      comment.authorName || comment.author?.name || "알 수 없는 사용자";
    setReplyText(`@${authorName} `);
  };

  // 답글 등록
  const handleReplySubmit = async () => {
    if (!replyText.trim() || !postId || replyingTo === null) return;

    const result = await withErrorHandling(async () => {
      setSubmittingReply(true);
      await createComment(postId, replyText, replyingTo);
      // 댓글 목록 새로고침
      const commentsResponse = await getComments(postId);
      setComments(commentsResponse.data || []);
      setReplyText("");
      setReplyingTo(null);
      // showSuccessToast("답글이 성공적으로 작성되었습니다.");
      return commentsResponse;
    }, "답글 작성에 실패했습니다.");

    setSubmittingReply(false);
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
      showErrorToast("게시글 정보가 올바르지 않습니다.");
      return;
    }

    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    const result = await withErrorHandling(async () => {
      setLoading(true);
      console.log("게시글 삭제 시작 - postId:", postId);
      const response = await deletePost(postId);
      console.log("게시글 삭제 응답:", response);

      // 백엔드 응답 형식에 맞춰 성공 여부 확인
      if (response.status === "OK" || response.message?.includes("완료")) {
        // 성공 시 바로 모달 닫고 콜백 호출
        showSuccessToast("게시글이 성공적으로 삭제되었습니다.");
        onClose();
        if (onPostDelete && postId) {
          onPostDelete(postId);
        }
      } else {
        throw new Error(response.message || "게시글 삭제에 실패했습니다.");
      }
      return response;
    }, "게시글 삭제에 실패했습니다.");

    setLoading(false);
  };

  // 우선순위 텍스트 반환 함수
  const getPriorityText = (priority: any) => {
    // 디버깅을 위한 로그 추가
    console.log("우선순위 값:", priority, "타입:", typeof priority);

    // 백엔드에서 오는 문자열 우선순위 처리
    if (typeof priority === "string") {
      switch (priority) {
        case "LOW":
          return "낮음";
        case "MEDIUM":
          return "보통";
        case "HIGH":
          return "높음";
        case "URGENT":
          return "긴급";
        default:
          console.warn(
            "알 수 없는 우선순위 문자열:",
            priority,
            "기본값 '낮음' 사용"
          );
          return "낮음";
      }
    }

    // 숫자 우선순위 처리 (기존 호환성)
    if (typeof priority === "number") {
      switch (priority) {
        case 1:
          return "낮음";
        case 2:
          return "보통";
        case 3:
          return "높음";
        case 4:
          return "긴급";
        default:
          console.warn(
            "알 수 없는 우선순위 숫자:",
            priority,
            "기본값 '낮음' 사용"
          );
          return "낮음";
      }
    }

    console.warn(
      "알 수 없는 우선순위 타입:",
      typeof priority,
      "값:",
      priority,
      "기본값 '낮음' 사용"
    );
    return "낮음";
  };

  // 우선순위별 스타일 반환 함수
  const getPriorityStyle = (priority: any) => {
    // 백엔드에서 오는 문자열 우선순위 처리
    if (typeof priority === "string") {
      switch (priority) {
        case "LOW":
          return {
            backgroundColor: "#dcfce7",
            color: "#166534",
            border: "1px solid #bbf7d0",
          };
        case "MEDIUM":
          return {
            backgroundColor: "#fef3c7",
            color: "#92400e",
            border: "1px solid #fde68a",
          };
        case "HIGH":
          return {
            backgroundColor: "#f3e8ff",
            color: "#7c3aed",
            border: "1px solid #e9d5ff",
          };
        case "URGENT":
          return {
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            border: "1px solid #fecaca",
          };
        default:
          return {
            backgroundColor: "#dcfce7",
            color: "#166534",
            border: "1px solid #bbf7d0",
          };
      }
    }

    // 숫자 우선순위 처리 (기존 호환성)
    if (typeof priority === "number") {
      switch (priority) {
        case 1:
          return {
            backgroundColor: "#dcfce7",
            color: "#166534",
            border: "1px solid #bbf7d0",
          };
        case 2:
          return {
            backgroundColor: "#fef3c7",
            color: "#92400e",
            border: "1px solid #fde68a",
          };
        case 3:
          return {
            backgroundColor: "#f3e8ff",
            color: "#7c3aed",
            border: "1px solid #e9d5ff",
          };
        case 4:
          return {
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            border: "1px solid #fecaca",
          };
        default:
          return {
            backgroundColor: "#dcfce7",
            color: "#166534",
            border: "1px solid #bbf7d0",
          };
      }
    }

    // 기본 스타일
    return {
      backgroundColor: "#dcfce7",
      color: "#166534",
      border: "1px solid #bbf7d0",
    };
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

  // 작성자 본인 여부 확인 함수
  const isAuthor = (authorId: number) => {
    return user?.id === authorId;
  };

  // soft delete 제외한 댓글만 필터링
  const visibleComments = comments.filter(
    (comment) => !comment.deletedAt && comment.status !== "DELETED"
  );

  // 삭제된 댓글 중 대댓글이 있는 것들만 필터링
  const deletedCommentsWithReplies = comments.filter((comment) => {
    const isDeleted = comment.deletedAt || comment.status === "DELETED";
    if (!isDeleted) return false;

    // 이 댓글을 부모로 하는 대댓글이 있는지 확인
    return comments.some((reply) => {
      let parent = reply.parentId;
      while (parent) {
        if (parent === comment.id) return true;
        const parentComment = comments.find((cc) => cc.id === parent);
        parent = parentComment?.parentId ?? null;
        if (!parent) return false;
      }
      return false;
    });
  });

  // 렌더링할 댓글 목록 (정상 댓글 + 대댓글이 있는 삭제된 댓글)
  const commentsToRender = [...visibleComments, ...deletedCommentsWithReplies];

  // 렌더링되는 댓글 개수 계산
  const getRenderedCommentCount = () => {
    let count = 0;
    const countComments = (comments: Comment[]) => {
      comments.forEach((comment) => {
        count++;
        if (comment.children && comment.children.length > 0) {
          countComments(comment.children);
        }
      });
    };
    countComments(comments);
    return count;
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

  // 파일 아이콘 결정 함수 (확장자별로 알맞게)
  const getFileIcon = (file: PostFile) => {
    const name = file.fileName.toLowerCase();
    const ext = name.split(".").pop();
    const yellow = "#fdb924";
    if (!ext) return <FiFile size={16} color={yellow} />;
    if (["png", "jpg", "jpeg", "gif", "bmp", "webp", "svg"].includes(ext))
      return <FiImage size={16} color={yellow} />;
    if (["pdf"].includes(ext)) return <FiFileText size={16} color={yellow} />;
    if (["doc", "docx", "docs"].includes(ext))
      return <FaFileWord size={16} color={yellow} />;
    if (["xls", "xlsx", "csv"].includes(ext))
      return <FaFileExcel size={16} color={yellow} />;
    if (["ppt", "pptx"].includes(ext))
      return <FaFilePowerpoint size={16} color={yellow} />;
    if (["hwp", "hwpx"].includes(ext))
      return <FaFileAlt size={16} color={yellow} />;
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
      return <FaFileArchive size={16} color={yellow} />;
    if (["txt", "md", "rtf"].includes(ext))
      return <FiFileText size={16} color={yellow} />;
    return <FiFileGeneric size={16} color={yellow} />;
  };

  // 파일 크기 포맷 함수
  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // 파일 다운로드 함수 수정
  const handleFileDownload = async (file: PostFile, postId: number) => {
    const result = await withErrorHandling(async () => {
      const response = await api.get(`/api/posts/${postId}/files/${file.id}`, {
        responseType: "blob",
      });
      // 파일명 추출
      const contentDisposition = response.headers["content-disposition"];
      let fileName = file.fileName;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename=\"(.+)\"/);
        if (match && match[1]) fileName = decodeURIComponent(match[1]);
      }
      // 다운로드 처리
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSuccessToast("파일 다운로드가 시작되었습니다.");
      return response;
    }, "파일 다운로드에 실패했습니다.");
  };

  // 파일 유효성 체크
  const hasValidFiles =
    post &&
    Array.isArray(post.files) &&
    post.files.some((f) => Number(f.fileSize) > 0);

  const hasAttachments =
    post?.files &&
    post.files.length > 0 &&
    post.files.some((f) => Number(f.fileSize) > 0);

  if (!open && !closing) return null;

  if (loading) {
    return (
      <ModalOverlay onClick={handleOverlayClick}>
        <ModalPanel>
          <LoadingSpinner>로딩 중...</LoadingSpinner>
        </ModalPanel>
      </ModalOverlay>
    );
  }

  if (!post) {
    return (
      <ModalOverlay onClick={handleOverlayClick}>
        <ModalPanel>
          <ErrorMessage>게시글을 찾을 수 없습니다.</ErrorMessage>
        </ModalPanel>
      </ModalOverlay>
    );
  }

  return (
    <>
      <ModalOverlay onClick={handleOverlayClick}>
        <ModalPanel
          $closing={closing}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <ModalHeader>
            {/* 상단 고정 제목/버튼 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                marginLeft: 10,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  height: 22,
                  width: 4,
                  borderRadius: 2,
                  background: "#fdb924",
                  marginRight: 9,
                }}
              />
              <span
                style={{
                  fontSize: "1.01rem",
                  fontWeight: 700,
                  color: "#111827",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                게시글 상세
              </span>
            </div>
            <ModalHeaderButtonGroup>
              <ModalHeaderActionButton
                onClick={handleReplyPost}
                title="답글달기"
              >
                <FaReply size={14} style={{ marginRight: 4 }} /> 답글
              </ModalHeaderActionButton>
              {post.author?.id ?? post.authorId
                ? isAuthor(post.author?.id ?? post.authorId) && (
                    <>
                      <button
                        onClick={handleEditPost}
                        style={{
                          background: "none",
                          color: "#888",
                          border: "none",
                          borderRadius: "5px",
                          padding: "0 10px",
                          fontSize: "0.85rem",
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
                          e.currentTarget.style.color = "#fdb924";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "none";
                          e.currentTarget.style.color = "#888";
                        }}
                      >
                        <FaEdit style={{ marginRight: "0.25rem" }} />
                        수정
                      </button>
                      <button
                        onClick={handleDeletePost}
                        style={{
                          background: "none",
                          color: "#888",
                          border: "none",
                          borderRadius: "5px",
                          padding: "0 10px",
                          fontSize: "0.85rem",
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
                          e.currentTarget.style.color = "#fdb924";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "none";
                          e.currentTarget.style.color = "#888";
                        }}
                      >
                        <FaTrash style={{ marginRight: "0.25rem" }} />
                        삭제
                      </button>
                    </>
                  )
                : null}
              <ModalHeaderCloseButton onClick={handleCloseWithAnimation}>
                ×
              </ModalHeaderCloseButton>
            </ModalHeaderButtonGroup>
          </ModalHeader>
          <ModalBody>
            {/* 게시글 제목 + 질문&답변 버튼 */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 28,
                gap: "1rem",
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#222",
                  wordBreak: "break-all",
                  flex: 1,
                  minWidth: 0,
                  marginLeft: 18,
                }}
              >
                {post.title}
              </span>
              <div style={{ marginTop: 12, marginBottom: 8, marginLeft: -12 }}>
                <QuestionAnswerStyledButton
                  onClick={() => setShowQuestionAnswer(true)}
                  style={{
                    flexShrink: 0,
                    marginRight: 10,
                    background: "none",
                    color: "#888",
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                    fontWeight: 500,
                    padding: "8px 12px",
                    borderRadius: 4,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#fdb924";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.borderColor = "#fdb924";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "none";
                    e.currentTarget.style.color = "#888";
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  }}
                >
                  <FaComments size={12} />
                  질문 & 답변
                </QuestionAnswerStyledButton>
              </div>
            </div>

            {/* 상세 정보 */}
            <InfoGrid style={{ marginLeft: 18 }}>
              <InfoRow>
                <InfoKey
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#6b7280",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                >
                  <FiCalendar style={{ color: "#fdb924" }} /> 작성일
                </InfoKey>
                <InfoValue
                  style={{
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    color: "#111827",
                  }}
                >
                  {formatDate(post.createdAt)}
                </InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoKey
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#6b7280",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                >
                  <FiCalendar style={{ color: "#fdb924" }} /> 수정일
                </InfoKey>
                <InfoValue
                  style={{
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    color: "#111827",
                  }}
                >
                  {formatDate(post.updatedAt)}
                </InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoKey
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#6b7280",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                >
                  <FiUser style={{ color: "#fdb924" }} /> 작성자
                </InfoKey>
                <InfoValue
                  style={{
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    color: "#111827",
                  }}
                >
                  <ClickableUsername
                    username={
                      post.author?.name ||
                      post.authorName ||
                      "알 수 없는 사용자"
                    }
                    userId={post.author?.id || post.authorId}
                    onClick={openUserProfile}
                    style={{ color: "#111827" }}
                  />
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
              <InfoRow>
                <InfoKey
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#6b7280",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                >
                  <FiFlag style={{ color: "#fdb924" }} /> 우선순위
                </InfoKey>
                <InfoValue
                  style={{
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: "#111827",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      ...getPriorityStyle(post.priority),
                      fontWeight: 600,
                      fontSize: 13,
                      borderRadius: 9999,
                      padding: "2px 12px",
                      marginLeft: 0,
                      display: "inline-block",
                    }}
                  >
                    {getPriorityText(post.priority)}
                  </span>
                </InfoValue>
              </InfoRow>
            </InfoGrid>

            {/* 작업 설명 */}
            <div style={{ margin: "32px 16px 0 16px" }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
                내용
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#444",
                  lineHeight: 1.7,
                  background: "#f8f9fa",
                  borderRadius: 8,
                  padding: 16,
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                <div>
                  {renderContentWithMentions(post.content, openUserProfile)}
                </div>
              </div>
            </div>

            {/* 첨부 파일 */}
            <AttachmentsSection>
              <SectionTitle>첨부 파일</SectionTitle>
              <FileList>
                {hasValidFiles ? (
                  post.files
                    .filter((f) => Number(f.fileSize) > 0)
                    .map((file: PostFile) => (
                      <FileItem key={file.id}>
                        <FileInfo>
                          <FileIcon>{getFileIcon(file)}</FileIcon>
                          <FileDetails>
                            <FileName>{file.fileName}</FileName>
                            <FileMeta>
                              <span>{file.fileType.toUpperCase()}</span>
                              <span>{formatFileSize(file.fileSize)}</span>
                            </FileMeta>
                          </FileDetails>
                        </FileInfo>
                        <FileActions>
                          <FileActionButton
                            onClick={() =>
                              handleFileDownload(file, post.postId)
                            }
                            title="다운로드"
                          >
                            <FiDownload size={16} />
                          </FileActionButton>
                        </FileActions>
                      </FileItem>
                    ))
                ) : (
                  <FileItem>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "2px 12px",
                      }}
                    >
                      <FiFile
                        size={16}
                        style={{ color: "#9ca3af", marginLeft: -10 }}
                      />
                      <NoFilesMessage>첨부된 파일이 없습니다.</NoFilesMessage>
                    </div>
                  </FileItem>
                )}
              </FileList>
            </AttachmentsSection>

            <div style={{ margin: "0 16px" }}>
              <CommentsSection>
                <SectionTitle>댓글 ({renderedCommentCount})</SectionTitle>

                {/* 댓글 입력창을 위로 이동 */}
                <RelativeTextareaWrapper style={{ marginBottom: "1.5rem" }}>
                  <MentionTextArea
                    placeholder="댓글을 입력하세요. @를 입력하여 사용자를 언급할 수 있습니다. (우측 하단 마우스 드래그를 통해 크기 조절 가능)"
                    value={commentText}
                    onChange={(newContent: string) =>
                      setCommentText(newContent)
                    }
                    disabled={submittingComment}
                    style={{
                      width: "100%",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.5rem",
                      padding: "0.75rem",
                      fontSize: "0.875rem",
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
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      height: 38,
                      borderRadius: 8,
                      background: "#fdb924",
                      color: "white",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      fontWeight: 700,
                      padding: "0 18px",
                      cursor: "pointer",
                      transition: "background 0.18s, color 0.18s",
                      boxShadow: "0 2px 8px 0 rgba(253,185,36,0.10)",
                      zIndex: 2,
                    }}
                  >
                    {submittingComment ? "..." : "댓글"}
                  </CommentSubmitButton>
                </RelativeTextareaWrapper>

                <CommentsList>
                  {commentsToRender.length > 0 ? (
                    commentsToRender
                      .filter((comment) => !comment.parentId)
                      .map((rootComment) => {
                        // 이 댓글을 부모로 하는 모든 답글(1,2,3...depth) 평면적으로 시간순 정렬
                        const replies = commentsToRender.filter((c) => {
                          let parent = c.parentId;
                          while (parent) {
                            if (parent === rootComment.id) return true;
                            const parentComment = commentsToRender.find(
                              (cc) => cc.id === parent
                            );
                            parent = parentComment?.parentId ?? null;
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
                            {(() => {
                              const isDeleted =
                                rootComment.deletedAt ||
                                rootComment.status === "DELETED";

                              if (isDeleted) {
                                // 삭제된 댓글 표시
                                return (
                                  <div
                                    style={{
                                      textAlign: "center",
                                      color: "#9ca3af",
                                      fontStyle: "italic",
                                      padding: "1rem",
                                      opacity: 0.6,
                                    }}
                                  >
                                    삭제된 댓글입니다.
                                  </div>
                                );
                              }

                              // 정상 댓글 표시
                              return (
                                <>
                                  <CommentMeta>
                                    <CommentAuthor>
                                      <ClickableUsername
                                        username={
                                          rootComment.author?.name ||
                                          rootComment.authorName ||
                                          "undefined"
                                        }
                                        userId={
                                          rootComment.author?.id ||
                                          rootComment.authorId
                                        }
                                        onClick={openUserProfile}
                                        style={{ color: "#111827" }}
                                      />
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
                                      <span>
                                        {formatDate(rootComment.createdAt)}
                                      </span>
                                      {rootComment.author?.id ??
                                      rootComment.authorId
                                        ? isAuthor(
                                            rootComment.author?.id ??
                                              rootComment.authorId
                                          ) && (
                                            <>
                                              {editingCommentId ===
                                              rootComment.id ? (
                                                <>
                                                  <CommentActionButton
                                                    onClick={() => {
                                                      setEditingCommentId(
                                                        rootComment.id
                                                      );
                                                      setEditText(
                                                        rootComment.content
                                                      );
                                                    }}
                                                  >
                                                    수정
                                                  </CommentActionButton>
                                                  <CommentActionButton
                                                    onClick={() =>
                                                      handleDeleteComment(
                                                        rootComment.id
                                                      )
                                                    }
                                                  >
                                                    삭제
                                                  </CommentActionButton>
                                                </>
                                              ) : (
                                                <>
                                                  <CommentActionButton
                                                    onClick={() => {
                                                      setEditingCommentId(
                                                        rootComment.id
                                                      );
                                                      setEditText(
                                                        rootComment.content
                                                      );
                                                    }}
                                                  >
                                                    수정
                                                  </CommentActionButton>
                                                  <CommentActionButton
                                                    onClick={() =>
                                                      handleDeleteComment(
                                                        rootComment.id
                                                      )
                                                    }
                                                  >
                                                    삭제
                                                  </CommentActionButton>
                                                </>
                                              )}
                                            </>
                                          )
                                        : null}
                                      <CommentActionButton
                                        onClick={() =>
                                          handleReplyClick(rootComment)
                                        }
                                      >
                                        답글
                                      </CommentActionButton>
                                    </CommentActions>
                                  </CommentMeta>
                                  <CommentText>
                                    {editingCommentId === rootComment.id ? (
                                      <div style={{ marginTop: 8 }}>
                                        <MentionTextArea
                                          value={editText}
                                          onChange={(newContent: string) =>
                                            setEditText(newContent)
                                          }
                                          autoFocus
                                          rows={3}
                                          placeholder="댓글 내용을 수정하세요. @를 입력하여 사용자를 언급할 수 있습니다."
                                          style={{
                                            width: "100%",
                                            border: "1.5px solid #fdb924",
                                            borderRadius: "0.375rem",
                                            background: "#fffdfa",
                                            color: "#222",
                                            fontSize: "0.95em",
                                            padding: "0.75rem",
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
                                            <ClickableUsername
                                              key={idx}
                                              username={part.substring(1)}
                                              onClick={openUserProfile}
                                            />
                                          ) : (
                                            <span key={idx}>{part}</span>
                                          )
                                        )
                                    )}
                                  </CommentText>
                                  {(replyingTo as number | null) ===
                                    rootComment.id && (
                                    <ReplyInputContainer>
                                      <MentionTextArea
                                        value={replyText}
                                        onChange={(newContent: string) =>
                                          setReplyText(newContent)
                                        }
                                        placeholder={`@${
                                          rootComment.authorName ||
                                          rootComment.author?.name ||
                                          "알 수 없는 사용자"
                                        } 님에게 답글을 입력하세요. @를 입력하여 사용자를 언급할 수 있습니다.`}
                                        disabled={submittingReply}
                                        rows={3}
                                      />
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "flex-end",
                                          gap: 8,
                                        }}
                                      >
                                        <CommentActionButton
                                          type="button"
                                          onClick={() => {
                                            setReplyText("");
                                            setReplyingTo(null);
                                          }}
                                          disabled={submittingReply}
                                        >
                                          취소
                                        </CommentActionButton>
                                        <CommentSubmitButton
                                          onClick={handleReplySubmit}
                                          disabled={
                                            !replyText.trim() || submittingReply
                                          }
                                        >
                                          {submittingReply
                                            ? "등록 중..."
                                            : "등록"}
                                        </CommentSubmitButton>
                                      </div>
                                    </ReplyInputContainer>
                                  )}
                                </>
                              );
                            })()}
                          </CommentItem>,
                          ...replies
                            .map((reply) => {
                              const isDeleted =
                                reply.deletedAt || reply.status === "DELETED";

                              // 삭제된 답글 중 대댓글이 있는 것만 표시
                              if (isDeleted) {
                                const hasReplies = commentsToRender.some(
                                  (comment) => {
                                    let parent = comment.parentId;
                                    while (parent) {
                                      if (parent === reply.id) return true;
                                      const parentComment =
                                        commentsToRender.find(
                                          (cc) => cc.id === parent
                                        );
                                      parent = parentComment?.parentId ?? null;
                                    }
                                    return false;
                                  }
                                );

                                if (!hasReplies) {
                                  return null; // 대댓글이 없는 삭제된 답글은 숨김
                                }

                                // 대댓글이 있는 삭제된 답글 표시
                                return (
                                  <CommentItem key={reply.id}>
                                    <div
                                      style={{
                                        textAlign: "center",
                                        color: "#9ca3af",
                                        fontStyle: "italic",
                                        padding: "1rem",
                                        opacity: 0.6,
                                      }}
                                    >
                                      삭제된 댓글입니다.
                                    </div>
                                  </CommentItem>
                                );
                              }

                              // 정상 답글 표시
                              return (
                                <CommentItem key={reply.id}>
                                  <CommentMeta>
                                    <CommentAuthor>
                                      <ClickableUsername
                                        username={
                                          reply.author?.name ||
                                          reply.authorName ||
                                          "undefined"
                                        }
                                        userId={
                                          reply.author?.id || reply.authorId
                                        }
                                        onClick={openUserProfile}
                                        style={{ color: "#111827" }}
                                      />
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
                                      {reply.author?.id ?? reply.authorId
                                        ? isAuthor(
                                            reply.author?.id ?? reply.authorId
                                          ) && (
                                            <>
                                              {editingCommentId === reply.id ? (
                                                <>
                                                  <CommentActionButton
                                                    onClick={() => {
                                                      setEditingCommentId(
                                                        reply.id
                                                      );
                                                      setEditText(
                                                        reply.content
                                                      );
                                                    }}
                                                  >
                                                    수정
                                                  </CommentActionButton>
                                                  <CommentActionButton
                                                    onClick={() =>
                                                      handleDeleteComment(
                                                        reply.id
                                                      )
                                                    }
                                                  >
                                                    삭제
                                                  </CommentActionButton>
                                                </>
                                              ) : (
                                                <>
                                                  <CommentActionButton
                                                    onClick={() => {
                                                      setEditingCommentId(
                                                        reply.id
                                                      );
                                                      setEditText(
                                                        reply.content
                                                      );
                                                    }}
                                                  >
                                                    수정
                                                  </CommentActionButton>
                                                  <CommentActionButton
                                                    onClick={() =>
                                                      handleDeleteComment(
                                                        reply.id
                                                      )
                                                    }
                                                  >
                                                    삭제
                                                  </CommentActionButton>
                                                </>
                                              )}
                                            </>
                                          )
                                        : null}
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
                                        <MentionTextArea
                                          value={replyText}
                                          onChange={(newContent: string) =>
                                            setReplyText(newContent)
                                          }
                                          autoFocus
                                          rows={3}
                                          placeholder="댓글 내용을 수정하세요. @를 입력하여 사용자를 언급할 수 있습니다."
                                          style={{
                                            width: "100%",
                                            border: "1.5px solid #fdb924",
                                            borderRadius: "0.375rem",
                                            background: "#fffdfa",
                                            color: "#222",
                                            fontSize: "0.95em",
                                            padding: "0.75rem",
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
                                            onClick={() => {
                                              handleReplySubmit();
                                            }}
                                          >
                                            저장
                                          </CommentSubmitButton>
                                          <CommentActionButton
                                            onClick={() => {
                                              setReplyText("");
                                              setReplyingTo(null);
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
                                            <ClickableUsername
                                              key={idx}
                                              username={part.substring(1)}
                                              onClick={openUserProfile}
                                            />
                                          ) : (
                                            <span key={idx}>{part}</span>
                                          )
                                        )
                                    )}
                                  </CommentText>
                                  {(replyingTo as number | null) ===
                                    reply.id && (
                                    <ReplyInputContainer>
                                      <MentionTextArea
                                        value={replyText}
                                        onChange={(newContent: string) =>
                                          setReplyText(newContent)
                                        }
                                        placeholder={`@${
                                          reply.authorName ||
                                          reply.author?.name ||
                                          "알 수 없는 사용자"
                                        } 님에게 답글을 입력하세요. @를 입력하여 사용자를 언급할 수 있습니다.`}
                                        disabled={submittingReply}
                                        rows={3}
                                      />
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "flex-end",
                                          gap: 8,
                                        }}
                                      >
                                        <CommentActionButton
                                          type="button"
                                          onClick={() => {
                                            setReplyText("");
                                            setReplyingTo(null);
                                          }}
                                          disabled={submittingReply}
                                        >
                                          취소
                                        </CommentActionButton>
                                        <CommentSubmitButton
                                          onClick={handleReplySubmit}
                                          disabled={
                                            !replyText.trim() || submittingReply
                                          }
                                        >
                                          {submittingReply
                                            ? "등록 중..."
                                            : "등록"}
                                        </CommentSubmitButton>
                                      </div>
                                    </ReplyInputContainer>
                                  )}
                                </CommentItem>
                              );
                            })
                            .filter(Boolean), // null 값 제거
                        ];
                      })
                  ) : (
                    <p>아직 댓글이 없습니다.</p>
                  )}
                </CommentsList>
              </CommentsSection>
            </div>
          </ModalBody>
        </ModalPanel>
      </ModalOverlay>
      <QuestionAnswerModal
        open={showQuestionAnswer}
        onClose={() => setShowQuestionAnswer(false)}
        postId={postId}
      />
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
    </>
  );
};

export default PostDetailModal;
