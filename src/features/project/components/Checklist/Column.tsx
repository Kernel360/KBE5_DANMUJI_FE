import React from 'react';
import ChecklistCard from './ChecklistCard'; // 추후 구현
import { ColumnWrapper, ColumnHeader, ColumnDot, ColumnTitle, ColumnCount } from './ChecklistBoard.styled';

interface Tag {
  label: string;
  color: string;
}

interface Badge {
  type: 'priority' | 'progress' | 'approval';
  value: number | null;
}

interface Item {
  id: string;
  tags: Tag[];
  title: string;
  code: string;
  badge: Badge;
  assignee: string;
}

interface ColumnProps {
  column: {
    id: string;
    title: string;
    color: string;
    dot: string;
    items: Item[];
  };
}

export default function Column({ column }: ColumnProps) {
  return (
    <ColumnWrapper color={column.color}>
      <ColumnHeader>
        <ColumnDot dot={column.dot} />
        <ColumnTitle>{column.title}</ColumnTitle>
        <ColumnCount>{column.items.length}</ColumnCount>
      </ColumnHeader>
      <div className="flex flex-col gap-3">
        {column.items.map((item) => (
          <ChecklistCard key={item.id} item={item} columnId={column.id} />
        ))}
      </div>
    </ColumnWrapper>
  );
} 