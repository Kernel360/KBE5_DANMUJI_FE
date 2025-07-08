import React, { useState } from 'react';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  InfoSection,
  InfoRow,
  InfoLabel,
  InfoValue,
  ApprovalsSection,
  ApprovalCardList,
  ApprovalCard,
  ApprovalCardHeader,
  ApprovalName,
  ApprovalStatusBadge,
  ApprovalCardBody,
  ApprovalMessage,
  ApprovalDate,
  ApprovalActions,
  ApprovalTextarea,
  ApprovalButton,
  ApprovalButtonSecondary,
} from './ChecklistDetailModal.styled';

const statusMap: Record<string, string> = {
  PENDING: '대기 중',
  APPROVED: '승인',
  REJECTED: '반려',
  waiting: '대기 중',
  approved: '승인',
  rejected: '반려',
};
const statusColor: Record<string, string> = {
  PENDING: '#fbbf24',
  APPROVED: '#10b981',
  REJECTED: '#ef4444',
  waiting: '#fbbf24',
  approved: '#10b981',
  rejected: '#ef4444',
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
  // 승인/반려 UI 상태를 approval별로 관리
  const [rejectStates, setRejectStates] = useState<{ [approvalId: number]: boolean }>({});
  const [rejectReasons, setRejectReasons] = useState<{ [approvalId: number]: string }>({});

  const handleShowReject = (approvalId: number) => {
    setRejectStates((prev) => ({ ...prev, [approvalId]: true }));
  };
  const handleHideReject = (approvalId: number) => {
    setRejectStates((prev) => ({ ...prev, [approvalId]: false }));
    setRejectReasons((prev) => ({ ...prev, [approvalId]: '' }));
  };
  const handleRejectReasonChange = (approvalId: number, value: string) => {
    setRejectReasons((prev) => ({ ...prev, [approvalId]: value }));
  };

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
            <ModalContent>
              {/* 왼쪽: 체크리스트 정보 */}
              <InfoSection>
                <InfoRow>
                  <InfoLabel>제목</InfoLabel>
                  <InfoValue>{data.title}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>내용</InfoLabel>
                  <InfoValue>{data.content}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>작성자</InfoLabel>
                  <InfoValue>{data.username}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>상태</InfoLabel>
                  <InfoValue>
                    <ApprovalStatusBadge color={statusColor[data.status] || '#bbb'}>
                      {statusMap[data.status] || data.status}
                    </ApprovalStatusBadge>
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>생성일</InfoLabel>
                  <InfoValue>{formatDate(data.createdAt)}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>완료일</InfoLabel>
                  <InfoValue>{formatDate(data.completedAt)}</InfoValue>
                </InfoRow>
              </InfoSection>
              {/* 오른쪽: 승인자 카드 목록 */}
              <ApprovalsSection>
                <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: 12 }}>승인자 목록</div>
                <ApprovalCardList>
                  {Array.isArray(data.approvals) && data.approvals.length > 0 ? (
                    data.approvals.map((appr: any) => (
                      <ApprovalCard key={appr.id}>
                        <ApprovalCardHeader>
                          <ApprovalName>{appr.username}</ApprovalName>
                          <ApprovalStatusBadge color={statusColor[appr.status] || '#bbb'}>
                            {statusMap[appr.status] || appr.status}
                          </ApprovalStatusBadge>
                        </ApprovalCardHeader>
                        <ApprovalCardBody>
                          {appr.message && <ApprovalMessage>메시지: {appr.message}</ApprovalMessage>}
                          <ApprovalDate>
                            {appr.respondedAt ? `응답일: ${formatDate(appr.respondedAt)}` : '응답 대기'}
                          </ApprovalDate>
                          {/* 승인/반려 UI: 대기 상태일 때만 노출 */}
                          {appr.status === 'PENDING' && (
                            <ApprovalActions>
                              {!rejectStates[appr.id] ? (
                                <>
                                  <ApprovalButton>
                                    승인
                                  </ApprovalButton>
                                  <ApprovalButtonSecondary onClick={() => handleShowReject(appr.id)}>
                                    반려
                                  </ApprovalButtonSecondary>
                                </>
                              ) : (
                                <>
                                  <ApprovalTextarea
                                    value={rejectReasons[appr.id] || ''}
                                    onChange={e => handleRejectReasonChange(appr.id, e.target.value)}
                                    placeholder="반려 사유 입력"
                                  />
                                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                                    <ApprovalButtonSecondary onClick={() => handleHideReject(appr.id)}>
                                      취소
                                    </ApprovalButtonSecondary>
                                    <ApprovalButton disabled={!rejectReasons[appr.id] || rejectReasons[appr.id].trim() === ''}>
                                      반려 제출
                                    </ApprovalButton>
                                  </div>
                                </>
                              )}
                            </ApprovalActions>
                          )}
                        </ApprovalCardBody>
                      </ApprovalCard>
                    ))
                  ) : (
                    <div style={{ color: '#bbb', fontSize: '0.98rem' }}>승인자가 없습니다.</div>
                  )}
                </ApprovalCardList>
              </ApprovalsSection>
            </ModalContent>
          )}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ChecklistDetailModal; 