import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { FiUser, FiMail, FiEye, FiX, FiMessageCircle } from "react-icons/fi";

interface UserProfileDropdownProps {
  username: string;
  userId?: number;
  position?: { top: number; left: number };
  onClose: () => void;
  onViewProfile?: (userId: number) => void;
  onSendMessage?: (userId: number) => void;
  onSendInquiry?: (userId: number) => void;
  userRole?: string;
  isAdmin?: boolean;
}

const DropdownOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
`;

const DropdownContainer = styled.div<{
  position: { top: number; left: number };
}>`
  position: absolute;
  top: ${(props) => props.position.top}px;
  left: ${(props) => props.position.left}px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 200px;
  z-index: 1001;
  animation: slideIn 0.15s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #f9fafb;
  border-radius: 8px 8px 0 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fdb924;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.span`
  font-weight: 600;
  color: #374151;
  font-size: 14px;
`;

const UserRole = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const DropdownMenu = styled.div`
  padding: 8px 0;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 16px;
  background: none;
  border: none;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }

  &:first-child {
    border-radius: 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  username,
  userId,
  position,
  onClose,
  onViewProfile,
  onSendMessage,
  onSendInquiry,
  userRole,
  isAdmin,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleViewProfile = () => {
    if (userId && onViewProfile) {
      onViewProfile(userId);
    }
    onClose();
  };

  const handleSendMessage = () => {
    if (userId && onSendMessage) {
      onSendMessage(userId);
    }
    onClose();
  };

  const handleSendInquiry = () => {
    if (userId && onSendInquiry) {
      onSendInquiry(userId);
    }
    onClose();
  };

  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") {
      return "??";
    }

    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <DropdownOverlay />
      <DropdownContainer ref={dropdownRef} position={position}>
        <DropdownHeader>
          <UserInfo>
            <UserAvatar>{getInitials(username)}</UserAvatar>
            <UserDetails>
              <Username>{username}</Username>
              <UserRole>{userRole}</UserRole>
            </UserDetails>
          </UserInfo>
          <CloseButton onClick={onClose}>
            <FiX size={16} />
          </CloseButton>
        </DropdownHeader>
        <DropdownMenu>
          <MenuItem onClick={handleViewProfile}>
            <FiEye size={16} />
            프로필 보기
          </MenuItem>
          <MenuItem onClick={handleSendMessage}>
            <FiMail size={16} />
            쪽지 보내기
          </MenuItem>
          {isAdmin && (
            <MenuItem onClick={handleSendInquiry}>
              <FiMessageCircle size={16} />
              문의하기
            </MenuItem>
          )}
        </DropdownMenu>
      </DropdownContainer>
    </>
  );
};

export default UserProfileDropdown;
