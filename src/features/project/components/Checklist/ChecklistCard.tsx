import React from 'react';

interface Item {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
}

interface ChecklistCardProps {
  item: Item;
  columnId?: string;
}

export default function ChecklistCard({ item }: ChecklistCardProps) {
  return (
    <div style={{
      background: '#f9fafb',
      borderRadius: 10,
      padding: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      border: '1.5px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginBottom: 4,
      minHeight: 60,
    }}>
      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#23272f', marginBottom: 6 }}>{item.title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.97rem', color: '#888' }}>
        <span style={{ fontWeight: 500 }}>{item.userId}</span>
        <span style={{ fontSize: 13, color: '#bdbdbd' }}>{item.createdAt}</span>
      </div>
    </div>
  );
} 