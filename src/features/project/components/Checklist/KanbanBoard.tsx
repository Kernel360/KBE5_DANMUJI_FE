import React, { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Column from './Column';
import { BoardWrapper, ColumnTitle } from './ChecklistBoard.styled';
import ChecklistCard from './ChecklistCard';

// 샘플 데이터
const columnDefs = [
  { id: 'waiting', title: '대기' },
  { id: 'approved', title: '승인' },
  { id: 'rejected', title: '반려' },
];

const initialData = [
  {
    id: 'waiting',
    items: [
      { id: '1', title: '기능 명세서 작성', userId: 'kim', createdAt: '2024-07-01' },
      { id: '2', title: 'API 설계', userId: 'lee', createdAt: '2024-07-02' },
    ],
  },
  {
    id: 'approved',
    items: [
      { id: '3', title: '디자인 시안 확정', userId: 'park', createdAt: '2024-07-03' },
    ],
  },
  {
    id: 'rejected',
    items: [
      { id: '4', title: '테스트 케이스 작성', userId: 'choi', createdAt: '2024-07-04' },
    ],
  },
];

const columnColors = {
  waiting: { bg: '#fffbe8', dot: '#fbbf24', title: '#fbbf24' },
  approved: { bg: '#fffde7', dot: '#fde68a', title: '#f59e0b' },
  rejected: { bg: '#fff7e6', dot: '#f59e0b', title: '#f59e0b' },
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialData);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // 드래그 앤 드롭 핸들러 (추후 카드 이동 로직 추가)
  const handleDragEnd = (event: any) => {
    // TODO: 카드 이동 로직 구현
  };

  return (
    <div style={{ width: '100%' }}>
      {/* 상단 고정 타이틀 row */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 0,
        padding: '0 0 12px 0',
        borderBottom: '1px solid #f3f4f6',
        background: 'transparent'
      }}>
        {columnDefs.map((col) => (
          <ColumnTitle
            key={col.id}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#222',
              letterSpacing: '-0.5px'
            }}
          >
            {col.title}
          </ColumnTitle>
        ))}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 24,
        width: '100%',
        margin: '0 auto',
        padding: '24px 0'
      }}>
        {columns.map((col) => (
          <div
            key={col.id}
            style={{
              minWidth: 300,
              maxWidth: 340,
              background: '#fff',
              borderRadius: 10,
              border: '1px solid #ececec',
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
              padding: 18,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              alignItems: 'stretch',
              transition: 'box-shadow 0.18s, border 0.18s'
            }}
          >
            {(col.items && col.items.length > 0) ? (
              col.items.map((item) => (
                <ChecklistCard key={item.id} item={item} columnId={col.id} />
              ))
            ) : (
              <div style={{ color: '#bbb', fontSize: '0.97rem', textAlign: 'center', margin: '32px 0' }}>카드가 없습니다</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 