import React, { useState } from "react";
import { Answer } from "../../types/question";
import { deleteAnswer, updateAnswer } from "../../services/questionService";
import {
  AnswerContainer,
  AnswerHeader,
  AnswerAuthor,
  AnswerDate,
  AnswerContent,
  AnswerActions,
  EditButton,
  DeleteButton,
  EditForm,
  EditTextArea,
  EditActions,
  SaveButton,
  CancelButton,
  ErrorMessage,
} from "./AnswerItem.styled";

interface AnswerItemProps {
  answer: Answer;
  questionId: string;
  onAnswerUpdated?: () => void;
}

const AnswerItem: React.FC<AnswerItemProps> = ({
  answer,
  questionId,
  onAnswerUpdated,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(answer.content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(answer.content);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(answer.content);
    setError(null);
  };

  const handleSave = async () => {
    if (!editContent.trim()) {
      setError("답변 내용을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await updateAnswer(answer.id, {
        content: editContent.trim(),
      });

      setIsEditing(false);
      onAnswerUpdated?.();
    } catch (err) {
      setError("답변 수정에 실패했습니다.");
      console.error("Error updating answer:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 답변을 삭제하시겠습니까?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await deleteAnswer(answer.id);
      onAnswerUpdated?.();
    } catch (err) {
      setError("답변 삭제에 실패했습니다.");
      console.error("Error deleting answer:", err);
    } finally {
      setLoading(false);
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

  return (
    <AnswerContainer>
      <AnswerHeader>
        <AnswerAuthor>{answer.authorName}</AnswerAuthor>
        <AnswerDate>{formatDate(answer.createdAt)}</AnswerDate>
      </AnswerHeader>

      {isEditing ? (
        <EditForm>
          <EditTextArea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="답변 내용을 입력하세요"
            rows={4}
            maxLength={2000}
            disabled={loading}
          />

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <EditActions>
            <CancelButton
              type="button"
              onClick={handleCancel}
              disabled={loading}
            >
              취소
            </CancelButton>
            <SaveButton
              type="button"
              onClick={handleSave}
              disabled={loading || !editContent.trim()}
            >
              {loading ? "저장 중..." : "저장"}
            </SaveButton>
          </EditActions>
        </EditForm>
      ) : (
        <>
          <AnswerContent>{answer.content}</AnswerContent>

          <AnswerActions>
            <EditButton onClick={handleEdit} disabled={loading}>
              수정
            </EditButton>
            <DeleteButton onClick={handleDelete} disabled={loading}>
              삭제
            </DeleteButton>
          </AnswerActions>
        </>
      )}
    </AnswerContainer>
  );
};

export default AnswerItem;
