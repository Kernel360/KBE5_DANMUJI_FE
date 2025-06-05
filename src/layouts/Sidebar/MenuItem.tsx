import React from "react";
import { MenuItemContainer } from './Sidebar.styles';
// import { useNavigate } from "react-router-dom"; // Remove useNavigate import
import type { IconType } from "react-icons";

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
      <span style={{ display: 'flex', alignItems: 'center', width: 20, height: 20 }}>
        <Icon />
      </span>
      <span style={{ fontSize: 14, fontWeight: 500 }}>{text}</span>
    </MenuItemContainer>
  );
};
