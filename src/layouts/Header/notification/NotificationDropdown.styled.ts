import styled from "styled-components";

export const DropdownContainer = styled.div`
  position: relative;
`;

export const NotificationButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  color: #6b7280;
  font-size: 20px;

  &:hover {
    background-color: #f3f4f6;
  }
`;

export const NotificationBadge = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  border-radius: 60%;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  border: 2px solid #fff;
  z-index: 1;
  transition: transform 0.2s ease;

  ${NotificationButton}:hover & {
    transform: scale(1.1);
  }
`;


export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 50;
`;

export const NotificationHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NotificationTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

export const MarkAllAsReadButton = styled.button`
  background: none;
  border: none;
  padding: 4px 8px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
`;

export const NotificationList = styled.div`
  padding: 8px 0;
`;

export const NotificationItem = styled.div<{ $isRead: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  background-color: ${({ $isRead }) => ($isRead ? '#fff' : '#f9fafb')};

  &:hover {
    background-color: ${({ $isRead }) => ($isRead ? '#f5f5f5' : '#f3f4f6')};
  }
`;

export const NotificationMessage = styled.div`
  font-size: 14px;
  color: #111827;
  margin-bottom: 4px;
`;

export const NotificationTime = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

export const EmptyState = styled.div`
  padding: 24px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
`;

export const LoadingState = styled(EmptyState)`
  color: #4b5563;
`;

export const ErrorState = styled(EmptyState)`
  color: #ef4444;
`;
