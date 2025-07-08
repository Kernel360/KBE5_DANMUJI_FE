import styled, { css } from 'styled-components';

// 전체 보드
export const BoardWrapper = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  overflow-x: auto;
  padding: 24px 8px 24px 8px;
  background: #fafbfc;
  min-height: 100vh;
  border-radius: 0;
  box-shadow: none;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 16px;
    padding: 16px 0;
  }
`;

// 컬럼(리스트)
export const ColumnWrapper = styled.div<{ color?: string }>`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: 340px;
  background: ${({ color }) => color || '#fff'};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 18px 10px 18px 10px;
  gap: 14px;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.15s, transform 0.15s, border-color 0.15s;
  &:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    border-color: #3b82f6;
    transform: translateY(-1px);
  }
  @media (max-width: 900px) {
    min-width: 100%;
    max-width: 100%;
  }
`;

export const ColumnHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  background: none;
  box-shadow: none;
  border: none;
  padding: 0;
  margin-bottom: 10px;
`;

export const ColumnDot = styled.span<{ dot: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  ${({ dot }) =>
    dot &&
    css`
      background: ${dot};
    `}
`;

export const ColumnTitle = styled.span<{ color?: string }>`
  font-weight: 600;
  font-size: 1rem;
  color: ${({ color }) => color || '#111'};
  padding: 0;
  background: none;
`;

export const ColumnCount = styled.span`
  margin-left: 8px;
  font-size: 0.92rem;
  background: #f3f4f6;
  color: #7b7f8a;
  border-radius: 999px;
  padding: 2px 10px;
  font-weight: 600;
`;

// 카드
export const CardWrapper = styled.div`
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 14px 14px 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 80px;
  transition: box-shadow 0.15s, border-color 0.15s, transform 0.15s;
  &:hover {
    background: #f9fafb;
    border-color: #3b82f6;
    box-shadow: 0 4px 16px rgba(59,130,246,0.10);
    transform: translateY(-1px);
  }
`;

export const Tag = styled.span<{ color: string }>`
  font-size: 0.92rem;
  font-weight: 600;
  border-radius: 8px;
  padding: 2px 10px;
  ${({ color }) =>
    color &&
    css`
      background: ${color};
      color: #555;
    `}
  margin-right: 6px;
`;

export const CardTitle = styled.div`
  font-weight: 700;
  font-size: 1.02rem;
  color: #23272f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
  gap: 8px;
`;

export const CardCode = styled.span`
  font-size: 0.92rem;
  color: #b0b0b0;
  font-family: 'Fira Mono', 'Consolas', monospace;
`;

export const Badge = styled.span<{ type: string }>`
  font-size: 0.92rem;
  font-weight: 600;
  border-radius: 8px;
  padding: 2px 10px;
  ${({ type }) => {
    switch (type) {
      case 'priority':
        return css`
          background: #e6f9f0;
          color: #1abc7b;
        `;
      case 'progress':
        return css`
          background: #e3f0fd;
          color: #1976d2;
        `;
      case 'approval':
        return css`
          background: #fff3cd;
          color: #ff9800;
        `;
      default:
        return css``;
    }
  }}
`;

export const Avatar = styled.span`
  margin-left: 8px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f3f4f6;
  color: #555;
  font-weight: 700;
  font-size: 1rem;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

export const ApproveButton = styled.button`
  flex: 1;
  background: #1abc7b;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 7px 0;
  font-size: 0.98rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #159c5b;
  }
`;

export const RejectButton = styled.button`
  flex: 1;
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 7px 0;
  font-size: 0.98rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #dc2626;
  }
`;

export const RejectInput = styled.input`
  margin-top: 8px;
  border: 1.5px solid #fbbf24;
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 0.98rem;
  outline: none;
  &:focus {
    border-color: #f59e0b;
    box-shadow: 0 0 0 2px #fef3c7;
  }
`; 