import React, { useState, useEffect } from "react";
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
  CommentsList,
  CommentItem,
  CommentMeta,
  CommentAuthor,
  CommentText,
  CommentInputContainer,
  CommentTextArea,
  CommentSubmitButton,
  TabsContainer,
  TabButton,
  TabContent,
} from "./ProjectPostDetailModal.styled.ts";
import { BiMinus, BiPlus } from "react-icons/bi";

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
  isQuestion?: boolean; // 질문인지 여부
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
  approver?: string;
  customer?: string;
  dueDate?: string;
}

interface ProjectPostDetailModalProps {
  open: boolean;
  onClose: () => void;
  postId?: number | null;
}

// Function to format date as YYYY.MM.DD
const formatDate = (dateString: string) => {
  try {
    if (!dateString) return "-"; // Handle empty date strings
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date string provided: ${dateString}`);
      return "Invalid Date";
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}.${month}.${day}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

// Mock function to simulate fetching post data
const fetchPostData = async (postId: number): Promise<PostData | null> => {
  console.log(`Fetching post data for ID: ${postId}`);
  const dummyPosts: PostData[] = [
    {
      id: 10,
      title: "데이터베이스 설계 및 구축 보고서",
      status: "승인",
      author: "이지원",
      date: "2023.08.20",
      content: `프로젝트의 데이터베이스 설계가 완료되었습니다. 주요 테이블 구조와 관계 설정이 모두 마무리되었으며, 성능 최적화를 위한 인덱스 설계도 포함되어 있습니다.\n\n첨부된 ERD 문서와 SQL 스크립트를 검토해 주시기 바랍니다. 특히 사용자 인증 관련 테이블 구조에 대한 피드백 부탁드립니다.`,
      files: [
        {
          name: "ERP_DB_ERD_v1.2.pdf",
          size: "2.4MB",
          url: "/dummy-files/ERP_DB_ERD_v1.2.pdf",
        },
        {
          name: "ERP_DB_SQL_Scripts.zip",
          size: "1.8MB",
          url: "/dummy-files/ERP_DB_SQL_Scripts.zip",
        },
      ],
      comments: [
        {
          id: 1,
          author: "박민수",
          date: "2023.08.19",
          text: "ERD 검토 완료했습니다. 전체적 설계가 잘 되어 있으나, 성능 최적화 부분에서 추가 검토가 필요할 것 같습니다. 승인 처리하겠습니다.",
        },
        {
          id: 2,
          author: "김현우",
          date: "2023.08.12",
          text: "인덱스 설정에서 성능 관련 검토가 필요할 것 같습니다. 특히 복합 인덱스 부분을 다시 한번 확인해주세요.",
          isQuestion: true,
        },
        {
          id: 3,
          author: "이지원",
          date: "2023.08.12",
          text: "좋은 작업 감사합니다. 다음 단계 진행하겠습니다.",
        },
      ],
      approver: "박민수",
      customer: "ABC 기업",
      dueDate: "2023.08.25",
    },
    // Add more dummy posts as needed
    {
      id: 9,
      title: "UI/UX 디자인 검토 요청",
      status: "대기",
      author: "최지수",
      date: "2023.08.18",
      content: "UI/UX 디자인 시안 검토 요청합니다.",
      approver: "최지수",
      customer: "ABC 기업",
      dueDate: "2023.08.20",
    },
  ];
  return dummyPosts.find((post) => post.id === postId) || null;
};

const ProjectPostDetailModal: React.FC<ProjectPostDetailModalProps> = ({
  open,
  onClose,
  postId,
}) => {
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState("comments"); // 'comments' or 'questions'
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (open && postId !== null && postId !== undefined) {
        setLoading(true);
        const postData = await fetchPostData(postId);
        setPost(postData);
        setLoading(false);
      } else if (!open) {
        setPost(null);
        setLoading(false);
      }
    };
    loadPost();
  }, [open, postId]);

  if (!open) return null;

  if (loading)
    return (
      <ModalPanel>
        <p>로딩 중...</p>
      </ModalPanel>
    );
  if (!post)
    return (
      <ModalPanel>
        <p>게시글을 찾을 수 없습니다.</p>
      </ModalPanel>
    );

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      console.log("New comment:", commentText);
      // TODO: Implement comment submission logic
      setCommentText("");
    }
  };

  const handleFileDownload = (file: File) => {
    if (file.url) {
      window.open(file.url, "_blank");
    } else {
      console.log("Download file:", file.name);
    }
  };

  const comments =
    post.comments?.filter((comment) => !comment.isQuestion) || [];
  const questions =
    post.comments?.filter((comment) => comment.isQuestion) || [];

  return (
    <ModalOverlay>
      <ModalPanel>
        <ModalHeader>
          <HeaderTop>
            <HeaderLeft>
              <PanelTitle>작업 상세</PanelTitle>
            </HeaderLeft>
            <HeaderRight>
              <IconWrapper>
                <BiMinus />
              </IconWrapper>
              <IconWrapper>
                <BiPlus />
              </IconWrapper>
              <CloseButton onClick={onClose}>&times;</CloseButton>
            </HeaderRight>
          </HeaderTop>
          <PostPanelTitle>{post.title}</PostPanelTitle>
          <PostDetailMeta>
            <MetaItem>
              <span>승인상태:</span>
              <StatusBadge $status={post.status}>{post.status}</StatusBadge>
            </MetaItem>
            <MetaItem>
              <span>작업일:</span>
              <span>{formatDate(post.date)}</span>
            </MetaItem>
            <MetaItem>
              <span>담당자:</span>
              <span>{post.author}</span>
            </MetaItem>
            <MetaItem>
              <span>결재자:</span>
              <span>{post.approver || "-"}</span>
            </MetaItem>
            <MetaItem>
              <span>고객사:</span>
              <span>{post.customer || "-"}</span>
            </MetaItem>
            <MetaItem>
              <span>완료 예정일:</span>
              <span>{post.dueDate || "-"}</span>
            </MetaItem>
          </PostDetailMeta>
        </ModalHeader>
        <ModalBody>
          <Section>
            <SectionTitle>작업 설명</SectionTitle>
            <PostContent>{post.content}</PostContent>
          </Section>

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
                    <FileSize>{file.size}</FileSize>
                  </FileItem>
                ))}
              </FileList>
            </Section>
          )}

          <CommentsSection>
            <TabsContainer>
              <TabButton
                $active={activeTab === "comments"}
                onClick={() => setActiveTab("comments")}
              >
                댓글 ({comments.length})
              </TabButton>
              <TabButton
                $active={activeTab === "questions"}
                onClick={() => setActiveTab("questions")}
              >
                질문 ({questions.length})
              </TabButton>
            </TabsContainer>

            <TabContent>
              {activeTab === "comments" && (
                <CommentsList>
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <CommentItem key={comment.id}>
                        <CommentMeta>
                          <CommentAuthor>{comment.author}</CommentAuthor>
                          <span>{comment.date}</span>
                        </CommentMeta>
                        <CommentText>{comment.text}</CommentText>
                        {/* TODO: Add reply/edit/delete options */}
                      </CommentItem>
                    ))
                  ) : (
                    <p>댓글이 없습니다.</p>
                  )}
                </CommentsList>
              )}

              {activeTab === "questions" && (
                <CommentsList>
                  {questions.length > 0 ? (
                    questions.map((comment) => (
                      <CommentItem key={comment.id}>
                        <CommentMeta>
                          <CommentAuthor>{comment.author}</CommentAuthor>
                          <span>{comment.date}</span>
                        </CommentMeta>
                        <CommentText>{comment.text}</CommentText>
                        {/* TODO: Add reply/edit/delete options */}
                      </CommentItem>
                    ))
                  ) : (
                    <p>질문이 없습니다.</p>
                  )}
                </CommentsList>
              )}
            </TabContent>

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
        </ModalBody>
      </ModalPanel>
    </ModalOverlay>
  );
};

export default ProjectPostDetailModal;
