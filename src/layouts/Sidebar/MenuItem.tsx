import React from "react";
// import { useNavigate } from "react-router-dom"; // Remove useNavigate import
import type { IconType } from "react-icons";
import { MenuItemContainer, IconWrapper, MenuText } from "./MenuItem.styled";

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
