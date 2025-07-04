import React from "react";
import styled from "styled-components";

interface ClickableMentionedUsernameProps {
  username: string;
  userId?: number;
  onClick: (event: React.MouseEvent, username: string, userId?: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

const MentionedUsernameSpan = styled.span`
  color: #fdb924;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  margin: 0;
  display: inline;
  position: relative;

  &:hover {
    color: #f59e0b;
    text-decoration: underline;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ClickableMentionedUsername: React.FC<ClickableMentionedUsernameProps> = ({
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
    <MentionedUsernameSpan
      onClick={handleClick}
      className={className}
      style={style}
      title={`@${username} 클릭하여 프로필 보기`}
    >
      @{username}
    </MentionedUsernameSpan>
  );
};

export default ClickableMentionedUsername;
