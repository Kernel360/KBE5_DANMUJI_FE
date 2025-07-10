import React from "react";
import { MenuItemContainer, IconWrapper, MenuText } from "./MenuItem.styled";
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
    <MenuItemContainer $active={isActive} onClick={handleClick}>
      <IconWrapper>
        <Icon />
      </IconWrapper>
      <MenuText>{text}</MenuText>
    </MenuItemContainer>
  );
};
