import React, { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Column from './Column';
import { BoardWrapper } from './ChecklistBoard.styled';

// 샘플 데이터
const initialData = [
  {
    id: 'todo',
    title: '해야 할 일',
    color: '',
    dot: '',
    items: [
      {
        id: 'NUC-001',
        tags: [
          { label: '양식', color: 'bg-green-100 text-green-700' },
          { label: '높음', color: 'bg-red-100 text-red-700' },
        ],
        title: '웹사이트 예약 기능 스펙 작성',
        code: 'NUC-001',
        badge: { type: 'priority' as const, value: 1 },
        assignee: '김',
      },
      {
        id: 'NUC-002',
        tags: [
          { label: '청구', color: 'bg-purple-100 text-purple-700' },
        ],
        title: '결제 시스템 연동 방안 검토',
        code: 'NUC-002',
        badge: { type: 'priority' as const, value: 2 },
        assignee: '이',
      },
      {
        id: 'NUC-003',
        tags: [
          { label: '디자인', color: 'bg-yellow-100 text-yellow-700' },
        ],
        title: 'UI/UX 가이드라인 정의',
        code: 'NUC-003',
        badge: { type: 'priority' as const, value: 3 },
        assignee: '박',
      },
    ],
  },
  {
    id: 'doing',
    title: '진행 중',
    color: '',
    dot: '',
    items: [
      {
        id: 'NUC-004',
        tags: [
          { label: '개발', color: 'bg-green-100 text-green-700' },
          { label: '50%', color: 'bg-blue-100 text-blue-700' },
        ],
        title: '데이터베이스 스키마 설계',
        code: 'NUC-004',
        badge: { type: 'progress' as const, value: 50 },
        assignee: '최',
      },
      {
        id: 'NUC-005',
        tags: [
          { label: '테스트', color: 'bg-yellow-100 text-yellow-700' },
        ],
        title: '사용자 시나리오 테스트',
        code: 'NUC-005',
        badge: { type: 'priority' as const, value: 2 },
        assignee: '정',
      },
    ],
  },
  {
    id: 'review',
    title: '승인 요청됨',
    color: '',
    dot: '',
    items: [
      {
        id: 'NUC-006',
        tags: [
          { label: '문서', color: 'bg-green-100 text-green-700' },
          { label: '긴급', color: 'bg-red-100 text-red-700' },
        ],
        title: 'API 문서 작성 완료',
        code: 'NUC-006',
        badge: { type: 'approval' as const, value: null },
        assignee: '김',
      },
      {
        id: 'NUC-007',
        tags: [
          { label: '검토', color: 'bg-purple-100 text-purple-700' },
        ],
        title: '보안 정책 수립',
        code: 'NUC-007',
        badge: { type: 'approval' as const, value: null },
        assignee: '이',
      },
      {
        id: 'NUC-008',
        tags: [
          { label: '배포', color: 'bg-orange-100 text-orange-700' },
        ],
        title: '운영 환경 설정',
        code: 'NUC-008',
        badge: { type: 'approval' as const, value: null },
        assignee: '오',
      },
    ],
  },
];

const columnColors = {
  todo: { bg: '#f3f4f6', dot: '#a3a3a3' },
  doing: { bg: '#e3f0fd', dot: '#60a5fa' },
  review: { bg: '#fff7e6', dot: '#fbbf24' },
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
    <BoardWrapper>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {columns.map((col) => (
          <Column
            key={col.id}
            column={{ ...col, color: columnColors[col.id as keyof typeof columnColors]?.bg, dot: columnColors[col.id as keyof typeof columnColors]?.dot }}
          />
        ))}
      </DndContext>
    </BoardWrapper>
  );
} 