import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
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
import ChecklistCreateModal from './ChecklistCreateModal';

// 카드 타입 명확화
export type ChecklistCardType = {
  id: string;
  title: string;
  assignee: string;
  username: string;
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
    username: 'hong',
    createdAt: '2024-06-01',
    status: 'waiting',
  },
  {
    id: '2',
    title: '디자인 시안 검토',
    assignee: '김디자',
    username: 'kimdesign',
    createdAt: '2024-06-02',
    status: 'approved',
  },
  {
    id: '3',
    title: 'API 명세서 작성',
    assignee: '이개발',
    username: 'leedev',
    createdAt: '2024-06-03',
    status: 'rejected',
    rejectReason: '내용 미흡',
  },
  {
    id: '4',
    title: '테스트 케이스 작성',
    assignee: '박테스터',
    username: 'parktest',
    createdAt: '2024-06-04',
    status: 'waiting',
  },
  {
    id: '5',
    title: '승인 요청 예시',
    assignee: '최승인',
    username: 'choiapprove',
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

// 컬럼 컴포넌트
function Column({ column, cards }: { column: typeof COLUMNS[number]; cards: ChecklistCardType[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch', flex: 1 }}>
      <ColumnHeader>
        <StatusDot color={column.dot} />
        <ColumnTitle>{column.title}</ColumnTitle>
        <ColumnCount>{cards.length}</ColumnCount>
      </ColumnHeader>
      <ColumnBox $bg={column.bg}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
          {cards.map((card) => (
            <ChecklistCard
              key={card.id}
              card={card}
            />
          ))}
        </div>
      </ColumnBox>
    </div>
  );
}

// 카드 컴포넌트
function ChecklistCard({ card }: { card: ChecklistCardType }) {
  return (
    <CardBox $status={card.status}>
      <CardTop>
        <CardTitle>{card.title}</CardTitle>
        <StatusBadge status={card.status}>
          {card.status === 'waiting' && '대기'}
          {card.status === 'approved' && '승인'}
          {card.status === 'rejected' && '반려'}
        </StatusBadge>
      </CardTop>
      <CardMeta>
        <span>{card.username}</span>
        <span>{card.createdAt}</span>
      </CardMeta>
      {/* 반려 사유 표시 */}
      {card.status === 'rejected' && card.rejectReason && (
        <div style={{ color: '#ef4444', fontSize: '0.95rem', marginTop: 4 }}>
          사유: {card.rejectReason}
        </div>
      )}
    </CardBox>
  );
}

// 메인 보드
interface KanbanBoardProps {
  projectId: number;
  selectedStepId: number;
}

export default function KanbanBoard({ projectId, selectedStepId }: KanbanBoardProps) {
  const [cards, setCards] = useState<ChecklistCardType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 카드 목록을 불러오는 함수 분리
  const fetchCards = async () => {
    if (!selectedStepId) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/checklists/${selectedStepId}`);
      const apiCards = Array.isArray(res.data.data) ? res.data.data : [];
      setCards(apiCards.map((item: any) => ({
        id: String(item.id),
        title: item.title || '',
        userId: item.userId,
        username: item.username || '',
        createdAt: item.createdAt ? item.createdAt.slice(0, 10) : '',
        status:
          item.status === 'PENDING'
            ? 'waiting'
            : item.status === 'APPROVED'
            ? 'approved'
            : 'rejected',
      })));
    } catch {
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStepId]);

  const handleCreateChecklist = async (data: {
    title: string;
    content: string;
    approvalIds: number[];
  }) => {
    try {
      await api.post(`/api/checklists/${selectedStepId}`, {
        title: data.title,
        content: data.content,
        approvalIds: data.approvalIds,
      });
      // 체크리스트 생성 성공 시 카드 목록 새로고침
      await fetchCards();
      setIsModalOpen(false);
    } catch (e) {
      console.log(data)
      console.error('체크리스트 생성 실패', e);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        marginBottom: '16px',
        padding: '0 24px'
      }}>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: '#fdb924',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fdb924'}
        >
          체크리스트 작성
        </button>
      </div>
      
      <BoardWrapper>
        {loading ? (
          <div style={{ width: '100%', textAlign: 'center', padding: '48px 0', color: '#bbb', fontSize: '1.1rem' }}>로딩 중...</div>
        ) : (
          COLUMNS.map((col) => (
            <Column
              key={col.key}
              column={col}
              cards={cards.filter((c) => c.status === col.key)}
            />
          ))
        )}
      </BoardWrapper>

      <ChecklistCreateModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateChecklist}
        projectId={projectId}
        stepId={selectedStepId}
      />
    </div>
  );
} 