import styled, { css } from "styled-components";

export const MenuItemContainer = styled.div<{ $active?: boolean }>`
  padding: 12px 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: #888;
  background: #fff;
  border-left: 4px solid transparent;
  border-radius: 0 6px 6px 0;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s, border-left 0.2s;

  ${({ $active }) =>
    $active &&
    css`
      color: #ffb300;
      background: #fffbe6;
      border-left: 4px solid #ffb300 !important;
      font-weight: 600;
    `}

  &:hover {
    background: #f3f4f6;
    color: #222;
  }

  ${({ $active }) =>
    $active &&
    css`
      &:hover {
        background: #fffbe6;
        color: #ffb300;
      }
    `}

  svg {
    color: inherit;
    transition: color 0.2s;
  }
`;

export const IconWrapper = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MenuText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: inherit;
`;
