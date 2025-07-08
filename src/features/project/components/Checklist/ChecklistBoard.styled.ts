import styled, { css } from 'styled-components';

export const BoardWrapper = styled.div`
  display: flex;
  gap: 24px;
  padding: 24px;
  width: 100%;
  align-items: flex-start;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 18px;
    padding: 12px;
  }
`;

export const ColumnBox = styled.div<{ bg: string }>`
  background: ${({ bg }) => bg};
  border-radius: 18px;
  box-shadow: 0 4px 16px 0 rgba(80, 80, 120, 0.10);
  min-width: 0;
  max-width: none;
  flex: 1;
  padding: 18px 14px 22px 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  @media (max-width: 900px) {
    min-width: 0;
    max-width: 100%;
    width: 100%;
  }
`;

export const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;
  position: relative;
`;

export const StatusDot = styled.span<{ color: string }>`
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: ${({ color }) => color};
`;

export const ColumnTitle = styled.span`
  font-weight: 700;
  font-size: 1.1rem;
  color: #23272f;
  text-align: center;
`;

export const ColumnCount = styled.span`
  margin-left: 8px;
  font-size: 0.92rem;
  background: #fff;
  color: #bdbdbd;
  border-radius: 999px;
  padding: 2px 10px;
  font-weight: 600;
`;

export const CardBox = styled.div<{ status?: string }>`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  border: 1.5px solid #f3f4f6;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 60px;
  transition: box-shadow 0.18s, transform 0.18s;
  &:hover {
    box-shadow: 0 6px 24px 0 rgba(80, 80, 120, 0.13);
    transform: translateY(-2px) scale(1.015);
  }
`;

export const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const CardTitle = styled.div`
  font-weight: 700;
  font-size: 1.05rem;
  color: #23272f;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.97rem;
  color: #888;
`;

export const Avatar = styled.span`
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

export const StatusBadge = styled.span<{ status: string }>`
  font-size: 0.92rem;
  font-weight: 600;
  border-radius: 8px;
  padding: 2px 10px;
  ${({ status }) => {
    switch (status) {
      case 'approved':
        return css`
          background: #ecfdf5;
          color: #10b981;
        `;
      case 'rejected':
        return css`
          background: #fef2f2;
          color: #ef4444;
        `;
      case 'waiting':
      default:
        return css`
          background: #fffbea;
          color: #fbbf24;
        `;
    }
  }}
`;

export const CardActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

export const ApproveButton = styled.button`
  flex: 1;
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 7px 0;
  font-size: 0.98rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #059669;
  }
`;

export const RejectButton = styled.button`
  flex: 1;
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 7px 0;
  font-size: 0.98rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #b91c1c;
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