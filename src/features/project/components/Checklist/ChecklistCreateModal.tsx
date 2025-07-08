import React, { useState, useEffect } from 'react';
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
  Button
} from './ChecklistCreateModal.styled';
// import CompanyMemberSelectModal from '../CompanyMemberSelectModal';
import { getUsersByProject } from '@/features/user/services/userService';
import type { UserSummaryResponse } from '@/features/user/services/userService';

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