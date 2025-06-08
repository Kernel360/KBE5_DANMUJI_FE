import React, { useState, useEffect } from "react";
import type { Comment, Post } from "../../types/post";
import { getPostDetail, getComments } from "../../services/postService";
import CommentList from "../CommentList/CommentList";
// import { BiMinimize, BiExpand } from "react-icons/bi"; // BiMinimize, BiExpand 임포트 주석 처리
import {
  ModalOverlay,
  ModalPanel,
  ModalHeader,
  HeaderTop,
  HeaderLeft,
  StatusBadge,
  PanelTitle,
  PostPanelTitle,
  HeaderRight,
  IconWrapper,
  CloseButton,
  PostDetailMeta,
  MetaItem,
  ModalBody,
  Section,
  SectionTitle,
  PostContent,
  FileList,
  FileItem,
  FileName,
  FileSize,
  CommentsSection,
  CommentCountHeader,
  QuestionCount,
  CommentInputContainer,
  CommentTextArea,
  CommentSubmitButton,
  CommentButtonGroup,
  QuestionButton,
} from "./ProjectPostDetailModal.styled.ts";

interface File {
  name: string;
  size: string;
  url?: string;
}

interface ProjectPostDetailModalProps {
  open: boolean;
  onClose: () => void;
  postId: number | null;
}

const ProjectPostDetailModal: React.FC<ProjectPostDetailModalProps> = ({
  open,
  onClose,
  postId,
}) => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const fetchPostAndComments = async () => {
      if (!open || !postId) {
        setPost(null);
        setComments([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [postResponse, commentsResponse] = await Promise.all([
          getPostDetail(postId),
          getComments(postId),
        ]);

        setPost(postResponse.data);
        setComments(commentsResponse.data || []);
      } catch (err) {
        setError("게시글을 불러오는데 실패했습니다.");
        console.error("게시글 상세 조회 중 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [open, postId]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !postId) return;

    try {
      // TODO: 댓글 작성 API 구현 후 추가
      console.log("댓글 작성:", commentText);
      setCommentText("");
      // 댓글 작성 후 댓글 목록 새로고침 로직 필요 (API 구현 후)
    } catch (err) {
      console.error("댓글 작성 중 오류:", err);
      alert("댓글 작성 중 오류가 발생했습니다.");
    }
  };

  const handleReply = async (parentId: number, content: string) => {
    if (!content.trim() || !postId) return;

    try {
      // TODO: 답글 작성 API 구현 후 추가
      console.log("답글 작성:", { parentId, content });
      // 답글 작성 후 댓글 목록 새로고침 로직 필요 (API 구현 후)
    } catch (err) {
      console.error("답글 작성 중 오류:", err);
      alert("답글 작성 중 오류가 발생했습니다.");
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "대기";
      case "APPROVED":
        return "승인";
      case "REJECTED":
        return "반려";
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "NOTICE":
        return "공지";
      case "QUESTION":
        return "질문";
      case "REPORT":
        return "보고";
      case "GENERAL":
        return "일반";
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 임시 파일 데이터
  const dummyFiles: File[] = [
    { name: "ERP_DB_ERD_v1.2.pdf", size: "2.4MB", url: "#" },
    { name: "ERP_DB_SQL_Scripts.zip", size: "1.8MB", url: "#" },
  ];

  const handleFileDownload = (file: File) => {
    if (file.url) {
      window.open(file.url, "_blank");
    } else {
      console.log("Download file:", file.name);
    }
  };

  // comments가 항상 배열임을 보장하는 안전한 변수
  const safeComments = comments || [];

  const questionComments = safeComments.filter((comment) =>
    comment.content.includes("질문")
  ); // 임시 필터링

  if (!open) return null;

  if (loading) {
    return (
      <ModalOverlay>
        <ModalPanel $open={open}>
          <p>로딩 중...</p>
        </ModalPanel>
      </ModalOverlay>
    );
  }

  if (error) {
    return (
      <ModalOverlay>
        <ModalPanel $open={open}>
          <p>{error}</p>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalPanel>
      </ModalOverlay>
    );
  }

  if (!post) {
    return (
      <ModalOverlay>
        <ModalPanel $open={open}>
          <p>게시글을 찾을 수 없습니다.</p>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalPanel>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay>
      <ModalPanel $open={open}>
        <ModalHeader>
          <HeaderTop>
            <HeaderLeft>
              <StatusBadge $status={getStatusText(post.status)}>
                승인상태: {getStatusText(post.status)}
              </StatusBadge>
              <PanelTitle>게시글 상세</PanelTitle>
            </HeaderLeft>
            <HeaderRight>
              {/* <IconWrapper onClick={() => console.log("Minimize clicked")}>
                <BiMinimize />
              </IconWrapper>
              <IconWrapper onClick={() => console.log("Expand clicked")}>
                <BiExpand />
              </IconWrapper> */}
              <CloseButton onClick={onClose}>&times;</CloseButton>
            </HeaderRight>
          </HeaderTop>
          <PostDetailMeta>
            <MetaItem>
              <PostPanelTitle>작성자:</PostPanelTitle> {post.author.name}
            </MetaItem>
            <MetaItem>
              <PostPanelTitle>작성일:</PostPanelTitle>{" "}
              {formatDate(post.createdAt)}
            </MetaItem>
            {post.updatedAt !== post.createdAt && (
              <MetaItem>
                <PostPanelTitle>수정일:</PostPanelTitle>{" "}
                {formatDate(post.updatedAt)}
              </MetaItem>
            )}
            <MetaItem>
              <PostPanelTitle>유형:</PostPanelTitle> {getTypeText(post.type)}
            </MetaItem>
            <MetaItem>
              <PostPanelTitle>우선순위:</PostPanelTitle> {post.priority}
            </MetaItem>
            <MetaItem>
              <PostPanelTitle>프로젝트:</PostPanelTitle> {post.project.name}
            </MetaItem>
          </PostDetailMeta>
        </ModalHeader>

        <ModalBody>
          <Section>
            <SectionTitle>작업 설명</SectionTitle>
            <PostContent>{post.content}</PostContent>
          </Section>

          {/* 첨부 파일 섹션 활성화 */}
          {dummyFiles && dummyFiles.length > 0 && (
            <Section>
              <SectionTitle>첨부 파일</SectionTitle>
              <FileList>
                {dummyFiles.map((file, index) => (
                  <FileItem
                    key={index}
                    onClick={() => handleFileDownload(file)}
                  >
                    <FileName>{file.name}</FileName>
                    <FileSize>{file.size}</FileSize>
                  </FileItem>
                ))}
              </FileList>
            </Section>
          )}

          <CommentsSection>
            <CommentCountHeader>
              <span>댓글 ({safeComments.length})</span>
              <QuestionCount>질문 ({questionComments.length})</QuestionCount>
            </CommentCountHeader>
            <CommentInputContainer>
              <CommentTextArea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="댓글을 입력하세요..."
                rows={3}
              />
              <CommentButtonGroup>
                <QuestionButton type="button">질문</QuestionButton>
                <CommentSubmitButton onClick={handleCommentSubmit}>
                  등록
                </CommentSubmitButton>
              </CommentButtonGroup>
            </CommentInputContainer>
            <CommentList comments={safeComments} onReply={handleReply} />
          </CommentsSection>
        </ModalBody>
      </ModalPanel>
    </ModalOverlay>
  );
};

export default ProjectPostDetailModal;
