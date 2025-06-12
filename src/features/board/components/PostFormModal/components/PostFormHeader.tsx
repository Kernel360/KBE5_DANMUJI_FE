import React from "react";
import {
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
} from "../PostFormModal.styled";

interface PostFormHeaderProps {
  mode: "create" | "edit";
  parentId?: number;
  onClose: () => void;
}

const PostFormHeader: React.FC<PostFormHeaderProps> = ({
  mode,
  parentId,
  onClose,
}) => {
  const getTitle = () => {
    if (mode === "create") {
      return parentId ? "답글 작성" : "새 게시글 작성";
    }
    return "게시글 수정";
  };

  return (
    <ModalHeader>
      <ModalTitle>{getTitle()}</ModalTitle>
      <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
    </ModalHeader>
  );
};

export default PostFormHeader;
