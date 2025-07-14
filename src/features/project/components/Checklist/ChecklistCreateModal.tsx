import React, { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  Form,
  FormGroup,
  Label,
  Input,
  TextArea,
  ButtonGroup,
  Button,
  UserListWrap,
  UserCard,
  UserName,
  UserUsername,
  CompanySection,
  CompanyNameHeader,
  CheckCircle,
  Avatar,
  UserInfoBlock,
} from "./ChecklistCreateModal.styled";
import { FaCheckCircle } from "react-icons/fa";
// import CompanyMemberSelectModal from '../CompanyMemberSelectModal';
import { getProjectClientUsers } from "@/features/project/services/projectService";
import type { ProjectClientUserResponse } from "@/features/project/services/projectService";

interface ChecklistCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content: string;
    approvalIds: number[];
  }) => void;
  projectId: number;
  stepId: number;
}

export default function ChecklistCreateModal({
  open,
  onClose,
  onSubmit,
  projectId,
  stepId,
}: ChecklistCreateModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [users, setUsers] = useState<ProjectClientUserResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ [userId: number]: boolean }>({});

  useEffect(() => {
    if (!open) return;
    setLoadingUsers(true);
    setUserError(null);
    getProjectClientUsers(projectId)
      .then((res) => setUsers(res.data || []))
      .catch((err) => setUserError("유저 목록을 불러오지 못했습니다."))
      .finally(() => setLoadingUsers(false));
  }, [open, projectId]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const handleUserToggle = (userId: number) => {
    setSelected((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const approvalIds = users.filter((u) => selected[u.id]).map((u) => u.id);
    // 필수 validation: 제목, 내용, 승인자
    if (!title.trim()) {
      alert("제목을 입력하세요");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력하세요");
      return;
    }
    if (approvalIds.length === 0) {
      alert("승인자를 1명 이상 선택하세요");
      return;
    }
    onSubmit({
      title,
      content,
      approvalIds,
    });
    setTitle("");
    setContent("");
    setSelected({});
    onClose();
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>체크리스트 작성</ModalTitle>
          <CloseButton onClick={handleClose}>&times;</CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="체크리스트 제목을 입력하세요"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="content">내용 *</Label>
            <TextArea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="체크리스트 내용을 입력하세요"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>승인자 선택</Label>
            {loadingUsers ? (
              <div style={{ color: "#888", fontSize: "0.98rem" }}>
                유저 목록 불러오는 중...
              </div>
            ) : userError ? (
              <div style={{ color: "#ef4444", fontSize: "0.98rem" }}>
                {userError}
              </div>
            ) : users.length === 0 ? (
              <div style={{ color: "#bbb", fontSize: "0.98rem" }}>
                유저가 없습니다.
              </div>
            ) : (
              <UserListWrap>
                {Object.entries(
                  users.reduce((acc, user) => {
                    const key = user.companyId + "-" + user.companyName;
                    if (!acc[key])
                      acc[key] = { companyName: user.companyName, users: [] };
                    acc[key].users.push(user);
                    return acc;
                  }, {} as Record<string, { companyName: string; users: typeof users }>)
                ).map(([key, group]) => (
                  <CompanySection key={key}>
                    <CompanyNameHeader>{group.companyName}</CompanyNameHeader>
                    {group.users.map((user) => (
                      <UserCard
                        key={user.id}
                        selected={!!selected[user.id]}
                        onClick={() => handleUserToggle(user.id)}
                      >
                        <CheckCircle selected={!!selected[user.id]}>
                          {selected[user.id] && <FaCheckCircle />}
                        </CheckCircle>
                        <UserName>
                          {user.name}{" "}
                          <UserUsername>({user.username})</UserUsername>
                        </UserName>
                      </UserCard>
                    ))}
                  </CompanySection>
                ))}
              </UserListWrap>
            )}
          </FormGroup>

          <ButtonGroup>
            <Button type="button" onClick={handleClose}>
              취소
            </Button>
            <Button type="submit" variant="primary">
              저장
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}
