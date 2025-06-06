// src/components/Sidebar/SideItem.tsx
import React from "react";
import { MenuItemSideContainer } from "./Sidebar.styles";
import type { IconType } from "react-icons";

interface SideItemProps {
  icon: IconType;
  text: string;
  isActive: boolean;
  onClick: () => void;
}

export const MenuItemSide: React.FC<SideItemProps> = ({
  icon: Icon,
  text,
  isActive,
  onClick,
}) => {
  return (
    <MenuItemSideContainer $isActive={isActive} onClick={onClick}>
        <Icon />
      <span>{text}</span>
    </MenuItemSideContainer>
  );
};
