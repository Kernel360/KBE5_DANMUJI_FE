import React from "react";
<<<<<<< HEAD
import { MenuItemContainer } from './Sidebar.styles';
// import { useNavigate } from "react-router-dom"; // Remove useNavigate import
import type { IconType } from "react-icons";
=======
// import { useNavigate } from "react-router-dom"; // Remove useNavigate import
import type { IconType } from "react-icons";
import { MenuItemContainer, IconWrapper, MenuText } from "./MenuItem.styled";
>>>>>>> 4d3e692e61a3107aa66158e1bd9cce6739dfd0c5

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
