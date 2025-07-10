import React from "react";
import styled from "styled-components";

interface ClickableUsernameProps {
  username: string;
  userId?: number;
  onClick: (event: React.MouseEvent, username: string, userId?: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

const UsernameSpan = styled.span`
  color: #fdb924;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 1px 3px;
  border-radius: 3px;
  margin: 0 1px;

  &:hover {
    background-color: rgba(253, 185, 36, 0.1);
    text-decoration: underline;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ClickableUsername: React.FC<ClickableUsernameProps> = ({
  username,
  userId,
  onClick,
  className,
  style,
}) => {
  const handleClick = (event: React.MouseEvent) => {
    onClick(event, username, userId);
  };

  return (
    <UsernameSpan
      onClick={handleClick}
      className={className}
      style={style}
      title={`${username} 클릭하여 프로필 보기`}
    >
      {username}
    </UsernameSpan>
  );
};

export default ClickableUsername;
