import React, { useState } from 'react';
import api from '@/api/axios';
import { useAuth } from '@/hooks/useAuth';
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
  onRefresh?: () => void;
}

const ChecklistDetailModal = ({ open, loading, data, onClose, onRefresh }: ChecklistDetailModalProps) => {
  const { user } = useAuth();
  // 승인/반려 UI 상태를 approval별로 관리
  const [rejectStates, setRejectStates] = useState<{ [approvalId: number]: boolean }>({});
  const [rejectReasons, setRejectReasons] = useState<{ [approvalId: number]: string }>({});
  const [actionLoading, setActionLoading] = useState<{ [approvalId: number]: boolean }>({});
  const [localApprovals, setLocalApprovals] = useState<any[] | null>(null);

  React.useEffect(() => {
    // 모달 열릴 때마다 approval 상태 초기화
    if (data && Array.isArray(data.approvals)) {
      setLocalApprovals(data.approvals);
      setRejectStates({});
      setRejectReasons({});
      setActionLoading({});
    }
  }, [data, open]);

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

  // 승인 처리
  const handleApprove = async (approvalId: number) => {
    setActionLoading((prev) => ({ ...prev, [approvalId]: true }));
    try {
      await api.put(`/api/checklists/approvals/${approvalId}`, {
        status: 'APPROVED',
        message: '',
      });
      // UI 갱신: localApprovals 상태 변경
      setLocalApprovals((prev) =>
        prev
          ? prev.map((a) =>
              a.id === approvalId
                ? { ...a, status: 'APPROVED', message: '', respondedAt: new Date().toISOString() }
                : a
            )
          : prev
      );
      setRejectStates((prev) => ({ ...prev, [approvalId]: false }));
      setRejectReasons((prev) => ({ ...prev, [approvalId]: '' }));
      // 체크리스트 목록 새로고침
      if (onRefresh) {
        onRefresh();
      }
    } catch (e) {
      let msg = '승인 처리에 실패했습니다.';
      if (e && typeof e === 'object') {
        const err = e as any;
        if ('response' in err && err.response && err.response.data && err.response.data.message) {
          msg = err.response.data.message;
        } else if ('data' in err && err.data && err.data.message) {
          msg = err.data.message;
        } else if ('message' in err) {
          msg = err.message as string;
        }
      }
      alert(msg);
    } finally {
      setActionLoading((prev) => ({ ...prev, [approvalId]: false }));
    }
  };

  // 반려 처리
  const handleReject = async (approvalId: number) => {
    if (!rejectReasons[approvalId] || rejectReasons[approvalId].trim() === '') return;
    setActionLoading((prev) => ({ ...prev, [approvalId]: true }));
    try {
      await api.put(`/api/checklists/approvals/${approvalId}`, {
        status: 'REJECTED',
        message: rejectReasons[approvalId],
      });
      setLocalApprovals((prev) =>
        prev
          ? prev.map((a) =>
              a.id === approvalId
                ? { ...a, status: 'REJECTED', message: rejectReasons[approvalId], respondedAt: new Date().toISOString() }
                : a
            )
          : prev
      );
      setRejectStates((prev) => ({ ...prev, [approvalId]: false }));
      setRejectReasons((prev) => ({ ...prev, [approvalId]: '' }));
      // 체크리스트 목록 새로고침
      if (onRefresh) {
        onRefresh();
      }
    } catch (e) {
      let msg = '반려 처리에 실패했습니다.';
      if (e && typeof e === 'object') {
        const err = e as any;
        if ('response' in err && err.response && err.response.data && err.response.data.message) {
          msg = err.response.data.message;
        } else if ('data' in err && err.data && err.data.message) {
          msg = err.data.message;
        } else if ('message' in err) {
          msg = err.message as string;
        }
      }
      alert(msg);
    } finally {
      setActionLoading((prev) => ({ ...prev, [approvalId]: false }));
    }
  };

  if (!open) return null;
  const approvals = localApprovals ?? (data && Array.isArray(data.approvals) ? data.approvals : []);
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
                  {Array.isArray(approvals) && approvals.length > 0 ? (
                    approvals.map((appr: any) => (
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
                          {/* 승인/반려 UI: 대기 상태이고 본인이 할당된 승인자일 때만 노출 */}
                          {appr.status === 'PENDING' && appr.userId === user?.id && (
                            <ApprovalActions>
                              {!rejectStates[appr.id] ? (
                                <>
                                  <ApprovalButton
                                    disabled={!!actionLoading[appr.id]}
                                    onClick={() => handleApprove(appr.id)}
                                  >
                                    {actionLoading[appr.id] ? '처리 중...' : '승인'}
                                  </ApprovalButton>
                                  <ApprovalButtonSecondary
                                    disabled={!!actionLoading[appr.id]}
                                    onClick={() => handleShowReject(appr.id)}
                                  >
                                    반려
                                  </ApprovalButtonSecondary>
                                </>
                              ) : (
                                <>
                                  <ApprovalTextarea
                                    value={rejectReasons[appr.id] || ''}
                                    onChange={e => handleRejectReasonChange(appr.id, e.target.value)}
                                    placeholder="반려 사유 입력"
                                    disabled={!!actionLoading[appr.id]}
                                  />
                                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                                    <ApprovalButtonSecondary
                                      disabled={!!actionLoading[appr.id]}
                                      onClick={() => handleHideReject(appr.id)}
                                    >
                                      취소
                                    </ApprovalButtonSecondary>
                                    <ApprovalButton
                                      disabled={
                                        !!actionLoading[appr.id] || !rejectReasons[appr.id] || rejectReasons[appr.id].trim() === ''
                                      }
                                      onClick={() => handleReject(appr.id)}
                                    >
                                      {actionLoading[appr.id] ? '처리 중...' : '반려 제출'}
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