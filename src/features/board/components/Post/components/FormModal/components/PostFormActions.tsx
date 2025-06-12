import React from "react";
import {
  ButtonGroup,
  SubmitButton,
  CancelButton,
  ErrorMessage,
} from "@/features/board/components/Post/styles/PostFormModal.styled";

interface PostFormActionsProps {
  mode: "create" | "edit";
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const PostFormActions: React.FC<PostFormActionsProps> = ({
  mode,
  loading,
  error,
  onSubmit,
  onCancel,
}) => {
  return (
    <>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <ButtonGroup>
        <CancelButton type="button" onClick={onCancel}>
          취소
        </CancelButton>
        <SubmitButton type="submit" disabled={loading} onClick={onSubmit}>
          {loading ? "처리 중..." : mode === "create" ? "작성" : "수정"}
        </SubmitButton>
      </ButtonGroup>
    </>
  );
};

export default PostFormActions;
