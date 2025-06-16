import React, { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalPanel,
  ModalHeader,
  HeaderLeft,
  ModalTitle,
  HeaderRight,
  CloseButton,
  ModalBody,
  QuestionSection,
  SectionTitle,
  LoadingSpinner,
  ErrorMessage,
} from "@/features/board/components/Question/styles/QuestionAnswerModal.styled";
import { getPostDetail } from "@/features/project-d/services/postService";
import { getQuestionsByPost } from "@/features/project-d/services/questionService";
import type { Post } from "@/features/project-d/types/post";
import type { Question } from "@/features/project-d/types/question";
import { AnswerDetailModal } from "@/features/board/components/Answer";

// 분리된 컴포넌트들
import PostInfo from "./components/PostInfo";
import QuestionForm from "./components/QuestionForm";
import QuestionList from "./components/QuestionList";

interface QuestionAnswerModalProps {
  open: boolean;
  onClose: () => void;
  postId: number | null;
}

const QuestionAnswerModal: React.FC<QuestionAnswerModalProps> = ({
  open,
  onClose,
  postId,
}) => {
  const [post, setPost] = useState<Post | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  // 답변 보기 모달 관련 상태
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedQuestionForAnswer, setSelectedQuestionForAnswer] =
    useState<Question | null>(null);

  useEffect(() => {
    const loadPostData = async () => {
      if (open && postId !== null) {
        try {
          setLoading(true);
          setError(null);

          // 게시글 상세 정보 가져오기
          const postResponse = await getPostDetail(postId);
          if (postResponse.data) {
            setPost(postResponse.data);
          }

          // 질문 목록 가져오기
          try {
            const questionsResponse = await getQuestionsByPost(postId);
            if (questionsResponse.data) {
              console.log("=== 질문 목록 로드 ===");
              console.log("질문 목록:", questionsResponse.data.content);
              questionsResponse.data.content.forEach((question, index) => {
                console.log(`질문 ${index + 1}:`, {
                  id: question.id,
                  author: question.author,
                  content: question.content.substring(0, 50) + "...",
                });
              });
              console.log("======================");
              setQuestions(questionsResponse.data.content);
            }
          } catch (questionError) {
            console.log("질문 로드 실패:", questionError);
            setQuestions([]);
          }
        } catch (err) {
          setError("게시글을 불러오는 중 오류가 발생했습니다.");
          console.error("게시글 로드 중 오류:", err);
        } finally {
          setLoading(false);
        }
      } else if (!open) {
        setPost(null);
        setQuestions([]);
        setLoading(false);
        setError(null);
      }
    };

    loadPostData();
  }, [open, postId]);

  const handleQuestionCreated = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
  };

  const handleQuestionUpdated = async () => {
    if (!postId) return;

    try {
      const questionsResponse = await getQuestionsByPost(postId);
      if (questionsResponse.data) {
        setQuestions(questionsResponse.data.content);
      }
    } catch (err) {
      console.error("질문 목록 새로고침 중 오류:", err);
    }
  };

  const handleOpenAnswerModal = (question: Question) => {
    setSelectedQuestionForAnswer(question);
    setShowAnswerModal(true);
  };

  const handleCloseAnswerModal = () => {
    setShowAnswerModal(false);
    setSelectedQuestionForAnswer(null);
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
            <HeaderLeft>
              <ModalTitle>질문 & 답변</ModalTitle>
            </HeaderLeft>
            <HeaderRight>
              <CloseButton onClick={onClose}>&times;</CloseButton>
            </HeaderRight>
          </ModalHeader>
          <ModalBody>
            {/* 게시글 정보 */}
            <PostInfo post={post} />

            <QuestionSection>
              <SectionTitle>질문 & 답변 ({questions.length})</SectionTitle>

              {/* 질문 작성 폼 */}
              <QuestionForm
                postId={postId!}
                onQuestionCreated={handleQuestionCreated}
              />

              {/* 질문 목록 */}
              <QuestionList
                questions={questions}
                onQuestionUpdated={handleQuestionUpdated}
                onOpenAnswerModal={handleOpenAnswerModal}
              />
            </QuestionSection>
          </ModalBody>
        </ModalPanel>
      </ModalOverlay>

      {/* 답변 보기 모달 */}
      {showAnswerModal && selectedQuestionForAnswer && (
        <AnswerDetailModal
          open={showAnswerModal}
          onClose={handleCloseAnswerModal}
          questionId={selectedQuestionForAnswer.id}
          questionTitle={""}
        />
      )}
    </>
  );
};

export default QuestionAnswerModal;
