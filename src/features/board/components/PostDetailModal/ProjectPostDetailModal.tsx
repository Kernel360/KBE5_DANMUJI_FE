import React, { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalPanel,
  ModalHeader,
  HeaderLeft,
  StatusBadge,
  ModalTitle,
  HeaderRight,
  ActionButton,
  CloseButton,
  ModalBody,
  Section,
  SectionTitle,
  PostMeta,
  PostContent,
  FileList,
  FileItem,
  FileName,
  FileSize,
  CommentsSection,
  CommentsList,
  CommentItem,
  CommentMeta,
  CommentAuthor,
  CommentActions,
  CommentText,
  CommentInputContainer,
  CommentTextArea,
  CommentSubmitButton,
} from "./ProjectPostDetailModal.styled.ts";

interface File {
  name: string;
  size: string;
  url?: string; // Add optional url for actual download link
}

interface Comment {
  id: number;
  author: string;
  date: string;
  text: string;
}

interface PostData {
  id: number;
  title: string;
  status: string;
  author: string;
  date: string;
  content: string;
  relatedLink?: string; // Optional related link
  files?: File[]; // Optional files array
  comments?: Comment[]; // Optional comments array
}

interface PostDetailModalProps {
  open: boolean;
  onClose: () => void;
  postId: number | null; // 게시글 ID
}

// Mock function to simulate fetching post data
const fetchPostData = async (postId: number): Promise<PostData | null> => {
  console.log(`Fetching post data for ID: ${postId}`);
  const dummyPosts: PostData[] = [
    {
      id: 1,
      title: "데이터베이스 설계 완료 보고서",
      status: "승인",
      author: "이개발",
      date: "2023.09.10",
      content: `프로젝트의 데이터베이스 설계가 완료되었습니다. 주요 테이블 구조와 관계 설정이 모두 마무리되었으며, 성능 최적화를 위한 인덱스 설계도 포함되어 있습니다.\n\n첨부된 ERD 문서와 SQL 스크립트를 검토해 주시기 바랍니다. 특히 사용자 인증 관련 테이블 구조에 대한 피드백 부탁드립니다.`, // Use \n for newlines
      relatedLink: "https://wiki.xyz-software.com/erpproject/db-design",
      files: [
        {
          name: "ERP_DB_ERD_v1.2.pdf",
          size: "2.4MB",
          url: "/dummy-files/ERP_DB_ERD_v1.2.pdf",
        }, // Example dummy URL
        {
          name: "ERP_DB_SQL_Scripts.zip",
          size: "1.8MB",
          url: "/dummy-files/ERP_DB_SQL_Scripts.zip",
        }, // Example dummy URL
      ],
      comments: [
        {
          id: 1,
          author: "박관리",
          date: "2023.09.15",
          text: "ERD 검토 완료했습니다. 인덱스 설계가 잘 되어 있네요. 승인 처리하겠습니다.",
        },
        {
          id: 2,
          author: "정백엔드",
          date: "2023.09.12",
          text: "사용자 인증 테이블에 세션 관리 필드가 추가되면 좋을 것 같습니다.",
        },
        {
          id: 3,
          author: "이개발",
          date: "2023.09.12",
          text: "좋은 의견 감사합니다. 다음 버전에 반영하겠습니다.",
        },
      ],
    },
    // Add more dummy posts as needed
  ];
  return dummyPosts.find((post) => post.id === postId) || null;
};

const PostDetailModal: React.FC<PostDetailModalProps> = ({
  open,
  onClose,
  postId,
}) => {
  const [commentText, setCommentText] = useState("");
  const [post, setPost] = useState<PostData | null>(null); // State to hold post data
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const loadPost = async () => {
      if (open && postId !== null) {
        setLoading(true);
        const postData = await fetchPostData(postId);
        setPost(postData);
        setLoading(false);
      } else if (!open) {
        // Reset post data when modal is closed
        setPost(null);
        setLoading(false);
      }
    };
    loadPost();
  }, [open, postId]); // Rerun effect when open or postId changes

  if (!open) return null; // Render nothing if not open

  if (loading)
    return (
      <ModalOverlay onClick={onClose}>
        <ModalPanel>로딩 중...</ModalPanel>
      </ModalOverlay>
    ); // Show loading state
  if (!post)
    return (
      <ModalOverlay onClick={onClose}>
        <ModalPanel>게시글을 찾을 수 없습니다.</ModalPanel>
      </ModalOverlay>
    ); // Show not found state

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      console.log("New comment:", commentText);
      // TODO: Implement comment submission logic
      setCommentText("");
    }
  };

  // Function to handle file download
  const handleFileDownload = (file: File) => {
    if (file.url) {
      // If a URL exists, open in a new tab (simulates download)
      window.open(file.url, "_blank");
    } else {
      // Otherwise, log the file name (previous behavior)
      console.log("Download file:", file.name);
      // TODO: Implement actual file download logic if no direct URL (e.g., using a download API)
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalPanel onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        {" "}
        {/* Prevent closing when clicking inside panel */}
        <ModalHeader>
          <HeaderLeft>
            {/* Pass status to StatusBadge for dynamic coloring */}
            <StatusBadge $status={post.status}>{post.status}</StatusBadge>
            <ModalTitle>{post.title}</ModalTitle>
          </HeaderLeft>
          <HeaderRight>
            {/* Action Buttons */}
            {/* Example Expand Button (optional) */}
            {/* <ActionButton onClick={() => console.log('Expand')}>🔍</ActionButton> */}
            {/* Example Edit Button (optional) */}
            {/* <ActionButton onClick={() => console.log('Edit post')}>✏️</ActionButton> */}
            {/* Example Delete Button (optional) */}
            {/* <ActionButton onClick={() => console.log('Delete post')}>🗑️</ActionButton> */}
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </HeaderRight>
        </ModalHeader>
        <ModalBody>
          <Section>
            <PostMeta>
              <div>작성자: {post.author}</div>
              <div>작성일: {post.date}</div>
            </PostMeta>
            {/* Render content preserving newlines */}
            <PostContent>{post.content}</PostContent>
          </Section>

          {post.relatedLink && (
            <Section>
              <SectionTitle>관련 링크</SectionTitle>
              <a
                href={post.relatedLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {post.relatedLink}
              </a>
            </Section>
          )}

          {post.files && post.files.length > 0 && (
            <Section>
              <SectionTitle>첨부 파일</SectionTitle>
              <FileList>
                {post.files.map((file, index) => (
                  <FileItem key={index}>
                    {/* Use handleFileDownload for clicking file name */}
                    <FileName onClick={() => handleFileDownload(file)}>
                      {file.name}
                    </FileName>
                    <FileSize>{file.size}</FileSize>
                  </FileItem>
                ))}
              </FileList>
            </Section>
          )}

          <CommentsSection>
            <SectionTitle>댓글 ({post.comments?.length || 0})</SectionTitle>{" "}
            {/* Safely access comments length */}
            <CommentsList>
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <CommentItem key={comment.id}>
                    <CommentMeta>
                      <CommentAuthor>{comment.author}</CommentAuthor>
                      <CommentActions>
                        {/* Example actions (Reply, Edit, Delete) */}
                        {/* <a>답글</a><a>수정</a><a>삭제</a> */}
                        <span>{comment.date}</span>
                      </CommentActions>
                    </CommentMeta>
                    <CommentText>{comment.text}</CommentText>
                  </CommentItem>
                ))
              ) : (
                <p>아직 댓글이 없습니다.</p> // Message when no comments
              )}
            </CommentsList>
            <CommentInputContainer>
              <CommentTextArea
                placeholder="댓글을 입력하세요"
                value={commentText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setCommentText(e.target.value)
                }
              />
              <CommentSubmitButton
                onClick={handleCommentSubmit}
                disabled={!commentText.trim()}
              >
                등록
              </CommentSubmitButton>
            </CommentInputContainer>
          </CommentsSection>
        </ModalBody>
      </ModalPanel>
    </ModalOverlay>
  );
};

export default PostDetailModal; // Export as default
