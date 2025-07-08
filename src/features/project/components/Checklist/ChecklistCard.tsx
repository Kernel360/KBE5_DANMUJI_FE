import React, { useState } from 'react';
import {
  CardWrapper,
  Tag,
  CardTitle,
  CardBottom,
  CardCode,
  Badge,
  Avatar,
  CardActions,
  ApproveButton,
  RejectButton,
  RejectInput,
} from './ChecklistBoard.styled';

interface TagType {
  label: string;
  color: string;
}

interface BadgeType {
  type: 'priority' | 'progress' | 'approval';
  value: number | null;
}

interface Item {
  id: string;
  tags: TagType[];
  title: string;
  code: string;
  badge: BadgeType;
  assignee: string;
}

interface ChecklistCardProps {
  item: Item;
  columnId?: string;
}

export default function ChecklistCard({ item, columnId }: ChecklistCardProps) {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // 승인/반려 버튼 핸들러 (실제 로직은 추후 구현)
  const handleApprove = () => {
    alert('승인 처리!');
  };
  const handleReject = () => {
    if (!showRejectReason) setShowRejectReason(true);
    else alert(`반려 사유: ${rejectReason}`);
  };

  return (
    <CardWrapper>
      {/* 태그 */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 2 }}>
        {item.tags.map((tag) => (
          <Tag key={tag.label} color={tag.color}>{tag.label}</Tag>
        ))}
      </div>
      {/* 제목 */}
      <CardTitle>{item.title}</CardTitle>
      {/* 코드, 뱃지, 담당자 */}
      <CardBottom>
        <CardCode>{item.code}</CardCode>
        {item.badge.type === 'priority' && (
          <Badge type="priority">{item.badge.value}</Badge>
        )}
        {item.badge.type === 'progress' && (
          <Badge type="progress">{item.badge.value}%</Badge>
        )}
        {item.badge.type === 'approval' && (
          <Badge type="approval">승인요청</Badge>
        )}
        <Avatar>{item.assignee}</Avatar>
      </CardBottom>
      {/* 승인/반려 버튼 (승인요청 상태에서만) */}
      {item.badge.type === 'approval' && columnId === 'review' && (
        <CardActions>
          <ApproveButton onClick={handleApprove}>승인</ApproveButton>
          <RejectButton onClick={handleReject}>반려</RejectButton>
        </CardActions>
      )}
      {/* 반려 사유 입력 */}
      {showRejectReason && (
        <RejectInput
          placeholder="반려 사유를 입력하세요"
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
        />
      )}
    </CardWrapper>
  );
} 