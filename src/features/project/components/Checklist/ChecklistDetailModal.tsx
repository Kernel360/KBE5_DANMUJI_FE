import React from 'react';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  InfoRow,
  InfoLabel,
  InfoValue,
  ApprovalsSection,
  ApprovalItem,
  ApprovalName,
  ApprovalStatus,
  ApprovalMessage,
  ApprovalDate,
} from './ChecklistDetailModal.styled';

const statusMap: Record<string, string> = {
  PENDING: '대기 중',
  APPROVED: '승인',
  REJECTED: '반려',
  waiting: '대기 중',
  approved: '승인',
  rejected: '반려',
};

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '-';
  return dateStr.slice(0, 10) + (dateStr.length > 10 ? ' ' + dateStr.slice(11, 16) : '');
}

interface ChecklistDetailModalProps {
  open: boolean;
  loading: boolean;
  data: any;
  onClose: () => void;
}

const ChecklistDetailModal = ({ open, loading, data, onClose }: ChecklistDetailModalProps) => {
  if (!open) return null;
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>체크리스트 상세</ModalTitle>
          <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>로딩 중...</div>
          ) : !data ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#ef4444' }}>데이터를 불러올 수 없습니다.</div>
          ) : (
            <>
              <InfoRow>
                <InfoLabel>제목</InfoLabel>
                <InfoValue>{data.title}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>작성자</InfoLabel>
                <InfoValue>{data.username}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>상태</InfoLabel>
                <InfoValue>{statusMap[data.status] || data.status}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>생성일</InfoLabel>
                <InfoValue>{formatDate(data.createdAt)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>완료일</InfoLabel>
                <InfoValue>{formatDate(data.completedAt)}</InfoValue>
              </InfoRow>
              {data.content && (
                <InfoRow>
                  <InfoLabel>내용</InfoLabel>
                  <InfoValue>{data.content}</InfoValue>
                </InfoRow>
              )}
              <ApprovalsSection>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>승인자 목록</div>
                {Array.isArray(data.approvals) && data.approvals.length > 0 ? (
                  data.approvals.map((appr: any) => (
                    <ApprovalItem key={appr.id}>
                      <ApprovalName>{appr.username}</ApprovalName>
                      <ApprovalStatus>{statusMap[appr.status] || appr.status}</ApprovalStatus>
                      {appr.message && <ApprovalMessage>메시지: {appr.message}</ApprovalMessage>}
                      <ApprovalDate>
                        {appr.respondedAt ? `응답일: ${formatDate(appr.respondedAt)}` : '응답 대기'}
                      </ApprovalDate>
                    </ApprovalItem>
                  ))
                ) : (
                  <div style={{ color: '#bbb', fontSize: '0.98rem' }}>승인자가 없습니다.</div>
                )}
              </ApprovalsSection>
            </>
          )}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ChecklistDetailModal; 