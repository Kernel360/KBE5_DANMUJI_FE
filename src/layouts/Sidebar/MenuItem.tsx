import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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
  margin: 0 8px;

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
`;

const MenuText = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

interface MenuItemProps {
  icon: string;
  text: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  text,
  path,
  isActive,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onClick();
    navigate(path);
  };

  return (
    <MenuItemContainer $isActive={isActive} onClick={handleClick}>
      <IconWrapper>{icon}</IconWrapper>
      <MenuText>{text}</MenuText>
    </MenuItemContainer>
  );
};
