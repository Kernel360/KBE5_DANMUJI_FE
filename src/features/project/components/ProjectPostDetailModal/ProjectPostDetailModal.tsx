import React, { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalPanel,
  ModalHeader,
  HeaderLeft,
  StatusBadge,
  ModalTitle,
  HeaderRight,
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

interface ProjectPostDetailModalProps {
  // Keep original interface name
  open: boolean;
  onClose: () => void;
  postId?: number | null; // 게시글 ID (Optional로 변경)
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

// Rename component back to ProjectPostDetailModal and export as default
const ProjectPostDetailModal: React.FC<ProjectPostDetailModalProps> = ({
  open,
  onClose,
  postId,
}) => {
  const [commentText, setCommentText] = useState("");
  const [post, setPost] = useState<PostData | null>(null); // State to hold post data
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const loadPost = async () => {
      if (open && postId !== null && postId !== undefined) {
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
  }, [open, postId]);

  if (!open) return null;

  if (loading)
    return (
      <ModalOverlay onClick={onClose}>
        <ModalPanel>로딩 중...</ModalPanel>
      </ModalOverlay>
    );
  if (!post)
    return (
      <ModalOverlay onClick={onClose}>
        <ModalPanel>게시글을 찾을 수 없습니다.</ModalPanel>
      </ModalOverlay>
    );

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
        <ModalHeader>
          <HeaderLeft>
            <StatusBadge $status={post.status}>{post.status}</StatusBadge>
            <ModalTitle>{post.title}</ModalTitle>
          </HeaderLeft>
          <HeaderRight>
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </HeaderRight>
        </ModalHeader>
        <ModalBody>
          <Section>
            <PostMeta>
              <div>작성자: {post.author}</div>
              <div>작성일: {post.date}</div>
            </PostMeta>
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
                  <FileItem
                    key={index}
                    onClick={() => handleFileDownload(file)}
                  >
                    <FileName>{file.name}</FileName>
                    <FileSize>({file.size})</FileSize>
                  </FileItem>
                ))}
              </FileList>
            </Section>
          )}

          {post.comments && post.comments.length > 0 && (
            <CommentsSection>
              <SectionTitle>댓글</SectionTitle>
              <CommentsList>
                {post.comments.map((comment) => (
                  <CommentItem key={comment.id}>
                    <CommentMeta>
                      <CommentAuthor>{comment.author}</CommentAuthor>
                      <span>{comment.date}</span>
                    </CommentMeta>
                    <CommentText>{comment.text}</CommentText>
                    {/* TODO: Add reply/edit/delete options */}
                  </CommentItem>
                ))}
              </CommentsList>
              <CommentInputContainer>
                <CommentTextArea
                  placeholder="댓글을 입력하세요..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <CommentSubmitButton onClick={handleCommentSubmit}>
                  등록
                </CommentSubmitButton>
              </CommentInputContainer>
            </CommentsSection>
          )}
        </ModalBody>
      </ModalPanel>
    </ModalOverlay>
  );
};

export default ProjectPostDetailModal;
