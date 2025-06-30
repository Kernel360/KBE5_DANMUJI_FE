import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ClickableMentionedUsername from "@/components/ClickableMentionedUsername";
import styled from "styled-components";

const MentionSpan = styled.span`
  color: #fdb924;
  font-weight: 600;
  background-color: rgba(253, 185, 36, 0.1);
  padding: 2px 4px;
  border-radius: 4px;
  margin: 0 1px;
`;

// @멘션을 하이라이트하는 함수 (클릭 가능한 버전)
export const highlightMentions = (
  content: string,
  onUsernameClick?: (
    event: React.MouseEvent,
    username: string,
    userId?: number
  ) => void
): React.ReactNode[] => {
  if (!content) return [];

  // @로 시작하는 사용자명 패턴 찾기 - 공백이나 특수문자로 구분되는 사용자명만
  const mentionPattern = /(@[a-zA-Z0-9._]+)(?=\s|$|[^a-zA-Z0-9._@])/g;
  const parts = content.split(mentionPattern);

  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      const username = part.substring(1); // @ 제거하여 사용자명만 추출

      if (onUsernameClick) {
        return (
          <ClickableMentionedUsername
            key={index}
            username={username}
            onClick={onUsernameClick}
          />
        );
      } else {
        return (
          <span
            key={index}
            style={{
              color: "#fdb924",
              fontWeight: "600",
              backgroundColor: "rgba(253, 185, 36, 0.1)",
              padding: "1px 3px",
              borderRadius: "3px",
              margin: "0 1px",
            }}
          >
            {part}
          </span>
        );
      }
    }
    return part;
  });
};

// 마크다운 렌더링과 @멘션 하이라이트를 모두 지원하는 함수 (클릭 가능한 버전)
export const renderContentWithMentions = (
  content: string,
  onUsernameClick?: (
    event: React.MouseEvent,
    username: string,
    userId?: number
  ) => void
): React.ReactNode => {
  if (!content) return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // 모든 텍스트 노드에서 @멘션을 하이라이트
        p: ({ children, ...props }) => {
          if (typeof children === "string") {
            return (
              <p {...props}>{highlightMentions(children, onUsernameClick)}</p>
            );
          }
          return <p {...props}>{children}</p>;
        },
        // 다른 마크다운 요소들도 동일하게 처리
        h1: ({ children, ...props }) => {
          if (typeof children === "string") {
            return (
              <h1 {...props}>{highlightMentions(children, onUsernameClick)}</h1>
            );
          }
          return <h1 {...props}>{children}</h1>;
        },
        h2: ({ children, ...props }) => {
          if (typeof children === "string") {
            return (
              <h2 {...props}>{highlightMentions(children, onUsernameClick)}</h2>
            );
          }
          return <h2 {...props}>{children}</h2>;
        },
        h3: ({ children, ...props }) => {
          if (typeof children === "string") {
            return (
              <h3 {...props}>{highlightMentions(children, onUsernameClick)}</h3>
            );
          }
          return <h3 {...props}>{children}</h3>;
        },
        li: ({ children, ...props }) => {
          if (typeof children === "string") {
            return (
              <li {...props}>{highlightMentions(children, onUsernameClick)}</li>
            );
          }
          return <li {...props}>{children}</li>;
        },
        strong: ({ children, ...props }) => {
          if (typeof children === "string") {
            return (
              <strong {...props}>
                {highlightMentions(children, onUsernameClick)}
              </strong>
            );
          }
          return <strong {...props}>{children}</strong>;
        },
        em: ({ children, ...props }) => {
          if (typeof children === "string") {
            return (
              <em {...props}>{highlightMentions(children, onUsernameClick)}</em>
            );
          }
          return <em {...props}>{children}</em>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

// @멘션이 포함되어 있는지 확인하는 함수
export const hasMentions = (content: string): boolean => {
  return /(@[a-zA-Z0-9._]+)(?=\s|$|[^a-zA-Z0-9._@])/.test(content);
};

// @멘션된 사용자명들을 추출하는 함수
export const extractMentions = (content: string): string[] => {
  const mentions: string[] = [];
  const mentionPattern = /@[a-zA-Z0-9._]+(?=\s|$|[^a-zA-Z0-9._@])/g;
  let match;

  while ((match = mentionPattern.exec(content)) !== null) {
    mentions.push(match[0]); // 멘션 전체 추출
  }

  return mentions;
};

export const renderMentionText = (text: string) => {
  const mentionRegex = /@[a-zA-Z0-9._]+(?=\s|$|[^a-zA-Z0-9._@])/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    // 매치 이전 텍스트 추가
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // 멘션 텍스트 추가
    parts.push(<MentionSpan key={match.index}>{match[0]}</MentionSpan>);

    lastIndex = match.index + match[0].length;
  }

  // 마지막 부분 추가
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

// 실제 멘션이 완료된 사용자명들을 추출하는 함수 (더 정확한 버전)
export const extractCompletedMentions = (content: string): string[] => {
  const mentions: string[] = [];
  // @username 형태로 완료된 멘션만 추출 (공백이나 특수문자로 구분)
  const mentionPattern = /@[a-zA-Z0-9._]+(?=\s|$|[^a-zA-Z0-9._@])/g;
  let match;

  while ((match = mentionPattern.exec(content)) !== null) {
    mentions.push(match[0]); // 멘션 전체 추출
  }

  return mentions;
};

// 멘션이 완료되었는지 확인하는 함수
export const isCompletedMention = (text: string, username: string): boolean => {
  // @username 형태로 완료된 멘션인지 확인
  const mentionPattern = new RegExp(`@${username}(?=\\s|$|[^\\w@])`, "g");
  return mentionPattern.test(text);
};
