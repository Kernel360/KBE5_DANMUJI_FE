// src/components/Sidebar/SideItem.tsx
import React from "react";
import { MenuItemSideContainer } from "./Sidebar.styles";

interface SideItemProps {
  text: string;
  isActive: boolean;
  onClick: () => void;
}

export const MenuItemSide: React.FC<SideItemProps> = ({
  text,
  isActive,
  onClick,
}) => {
  return (
    <MenuItemSideContainer $isActive={isActive} onClick={onClick}>
      <span>•</span>
      <span>{text}</span>
    </MenuItemSideContainer>
  );
};
