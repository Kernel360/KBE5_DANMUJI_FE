import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
// import CompanyMemberSelectModal from '../CompanyMemberSelectModal';
import { getUsersByProject } from '@/features/user/services/userService';
import type { UserSummaryResponse } from '@/features/user/services/userService';

// 스타일 컴포넌트
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;

  &:hover {
    color: #111827;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  background-color: #ffffff;
  color: #333333;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;

  ${({ variant }) =>
    variant === 'primary'
      ? `
        background-color: #fdb924;
        color: white;
        &:hover {
          background-color: #f59e0b;
        }
      `
      : `
        background-color: #f3f4f6;
        color: #374151;
        &:hover {
          background-color: #e5e7eb;
        }
      `}
`;

// 타입 정의
interface SelectedApprover {
  id: number;
  name: string;
  username: string;
  companyName: string;
}

interface UserListCompany {
  id: number;
  companyName: string;
  assignUsers: {
    id: number;
    name: string;
    position: string;
    userType: 'MANAGER' | 'MEMBER';
    username?: string;
  }[];
}

interface ChecklistCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content: string;
  }) => void;
  projectId: number;
}

export default function ChecklistCreateModal({ open, onClose, onSubmit, projectId }: ChecklistCreateModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [users, setUsers] = useState<UserSummaryResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoadingUsers(true);
    setUserError(null);
    getUsersByProject(projectId)
      .then(res => setUsers(res.data))
      .catch(err => setUserError('유저 목록을 불러오지 못했습니다.'))
      .finally(() => setLoadingUsers(false));
  }, [open, projectId]);

  if (!open) return null;

  const handleRequestApproval = (user: UserSummaryResponse) => {
    // TODO: 실제 승인요청 로직 구현
    alert(`${user.name}님에게 승인요청! (stub)`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
    });
    setTitle('');
    setContent('');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
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
            <Label>유저 리스트</Label>
            {loadingUsers ? (
              <div style={{ color: '#888', fontSize: '0.98rem' }}>유저 목록 불러오는 중...</div>
            ) : userError ? (
              <div style={{ color: '#ef4444', fontSize: '0.98rem' }}>{userError}</div>
            ) : users.length === 0 ? (
              <div style={{ color: '#bbb', fontSize: '0.98rem' }}>유저가 없습니다.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {users.map(user => (
                  <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px' }}>
                    <span style={{ fontWeight: 500 }}>{user.name}</span>
                    <span style={{ color: '#888', fontSize: '0.97rem' }}>({user.username})</span>
                    <span style={{ color: '#bbb', fontSize: '0.97rem' }}>{user.role}</span>
                    <Button type="button" style={{ marginLeft: 'auto', background: '#fdb924', color: '#fff', fontWeight: 600, padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer' }} onClick={() => handleRequestApproval(user)}>
                      승인요청
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </FormGroup>

          <ButtonGroup>
            <Button type="button" onClick={handleClose}>
              취소
            </Button>
            <Button type="submit" variant="primary">
              작성 완료
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
} 