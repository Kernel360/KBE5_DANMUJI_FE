import React from "react";
import styled from "styled-components";
// import { useNavigate } from "react-router-dom"; // Remove useNavigate import
import type { IconType } from "react-icons";

const MenuItemContainer = styled.div<{ $isActive: boolean }>`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: ${({ $isActive }) => ($isActive ? "#111827" : "#6b7280")};
  background-color: ${({ $isActive }) =>
    $isActive ? "#f3f4f6" : "transparent"};
  border-radius: 6px;

  &:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
`;

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Add color based on active state if needed */
`;

const MenuText = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

interface MenuItemProps {
  icon: IconType;
  text: string;
  isActive: boolean;
  onClick: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  text,
  isActive,
  onClick,
}) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <MenuItemContainer $isActive={isActive} onClick={handleClick}>
      <IconWrapper>
        {<Icon />} {/* Render the Icon component */}
      </IconWrapper>
      <MenuText>{text}</MenuText>
    </MenuItemContainer>
  );
};
