import React, { useState } from 'react';
import {
  BoardWrapper,
  ColumnBox,
  ColumnHeader,
  StatusDot,
  ColumnTitle,
  ColumnCount,
  CardBox,
  CardTop,
  CardTitle,
  CardMeta,
  Avatar,
  StatusBadge,
  CardActions,
  ApproveButton,
  RejectButton,
  RejectInput,
} from './ChecklistBoard.styled';

// 카드 타입 명확화
export type ChecklistCardType = {
  id: string;
  title: string;
  assignee: string;
  createdAt: string;
  status: 'waiting' | 'approved' | 'rejected';
  approvalRequest?: boolean;
  rejectReason?: string;
};

// 상태별 컬럼 정보
const COLUMNS = [
  {
    key: 'waiting',
    title: '대기',
    bg: '#fffbea',
    dot: '#fbbf24',
  },
  {
    key: 'approved',
    title: '승인',
    bg: '#ecfdf5',
    dot: '#10b981',
  },
  {
    key: 'rejected',
    title: '반려',
    bg: '#fef2f2',
    dot: '#ef4444',
  },
];

// 예시 데이터
const MOCK_CARDS: ChecklistCardType[] = [
  {
    id: '1',
    title: '기획서 작성',
    assignee: '홍길동',
    createdAt: '2024-06-01',
    status: 'waiting',
  },
  {
    id: '2',
    title: '디자인 시안 검토',
    assignee: '김디자',
    createdAt: '2024-06-02',
    status: 'approved',
  },
  {
    id: '3',
    title: 'API 명세서 작성',
    assignee: '이개발',
    createdAt: '2024-06-03',
    status: 'rejected',
    rejectReason: '내용 미흡',
  },
  {
    id: '4',
    title: '테스트 케이스 작성',
    assignee: '박테스터',
    createdAt: '2024-06-04',
    status: 'waiting',
  },
  {
    id: '5',
    title: '승인 요청 예시',
    assignee: '최승인',
    createdAt: '2024-06-05',
    status: 'waiting',
    approvalRequest: true,
  },
];

// 담당자 이니셜 생성
function getInitials(name: string) {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return name.slice(0, 2);
  return parts.map((p) => p[0]).join('').slice(0, 2);
}

// 카드 컴포넌트
function ChecklistCard({ card, onApprove, onReject }: { card: ChecklistCardType; onApprove: (id: string) => void; onReject: (id: string, reason: string) => void }) {
  const [rejectInput, setRejectInput] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  return (
    <CardBox status={card.status}>
      <CardTop>
        <CardTitle>{card.title}</CardTitle>
        <StatusBadge status={card.status}>
          {card.status === 'waiting' && '대기'}
          {card.status === 'approved' && '승인'}
          {card.status === 'rejected' && '반려'}
        </StatusBadge>
      </CardTop>
      <CardMeta>
        <Avatar>{getInitials(card.assignee)}</Avatar>
        <span>{card.assignee}</span>
        <span>{card.createdAt}</span>
      </CardMeta>
      {/* 승인 요청 카드일 때만 버튼 노출 */}
      {card.approvalRequest && card.status === 'waiting' && (
        <CardActions>
          <ApproveButton onClick={() => onApprove(card.id)}>승인</ApproveButton>
          <RejectButton
            onClick={() => setShowRejectInput((v) => !v)}
            style={{ minWidth: 0 }}
          >
            반려
          </RejectButton>
        </CardActions>
      )}
      {/* 반려 버튼 클릭 시 사유 입력 */}
      {showRejectInput && (
        <RejectInput
          placeholder="반려 사유 입력"
          value={rejectInput}
          onChange={(e) => setRejectInput(e.target.value)}
          onBlur={() => setShowRejectInput(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onReject(card.id, rejectInput);
              setShowRejectInput(false);
              setRejectInput('');
            }
          }}
        />
      )}
      {/* 반려 사유 표시 */}
      {card.status === 'rejected' && card.rejectReason && (
        <div style={{ color: '#ef4444', fontSize: '0.95rem', marginTop: 4 }}>
          사유: {card.rejectReason}
        </div>
      )}
    </CardBox>
  );
}

// 컬럼 컴포넌트
function Column({ column, cards, onApprove, onReject }: { column: typeof COLUMNS[number]; cards: ChecklistCardType[]; onApprove: (id: string) => void; onReject: (id: string, reason: string) => void }) {
  return (
    <ColumnBox bg={column.bg}>
      <ColumnHeader>
        <StatusDot color={column.dot} />
        <ColumnTitle>{column.title}</ColumnTitle>
        <ColumnCount>{cards.length}</ColumnCount>
      </ColumnHeader>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {cards.map((card) => (
          <ChecklistCard
            key={card.id}
            card={card}
            onApprove={onApprove}
            onReject={onReject}
          />
        ))}
      </div>
    </ColumnBox>
  );
}

// 메인 보드
export default function KanbanBoard() {
  const [cards, setCards] = useState<ChecklistCardType[]>(MOCK_CARDS);

  // 승인 처리
  const handleApprove = (id: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: 'approved', approvalRequest: undefined, rejectReason: undefined }
          : c
      )
    );
  };
  // 반려 처리
  const handleReject = (id: string, reason: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: 'rejected', approvalRequest: undefined, rejectReason: reason }
          : c
      )
    );
  };

  return (
    <BoardWrapper>
      {COLUMNS.map((col) => (
        <Column
          key={col.key}
          column={col}
          cards={cards.filter((c) => c.status === col.key)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ))}
    </BoardWrapper>
  );
} 