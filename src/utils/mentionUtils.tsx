import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// @멘션을 하이라이트하는 함수
export const highlightMentions = (content: string): React.ReactNode[] => {
  if (!content) return [];

  // @로 시작하는 사용자명 패턴 찾기
  const mentionPattern = /(@\w+)/g;
  const parts = content.split(mentionPattern);

  return parts.map((part, index) => {
    if (part.startsWith("@")) {
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
    return part;
  });
};

// 마크다운 렌더링과 @멘션 하이라이트를 모두 지원하는 함수
export const renderContentWithMentions = (content: string): React.ReactNode => {
  if (!content) return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // 모든 텍스트 노드에서 @멘션을 하이라이트
        p: ({ children, ...props }) => {
          if (typeof children === "string") {
            return <p {...props}>{highlightMentions(children)}</p>;
          }
          return <p {...props}>{children}</p>;
        },
        // 다른 마크다운 요소들도 동일하게 처리
        h1: ({ children, ...props }) => {
          if (typeof children === "string") {
            return <h1 {...props}>{highlightMentions(children)}</h1>;
          }
          return <h1 {...props}>{children}</h1>;
        },
        h2: ({ children, ...props }) => {
          if (typeof children === "string") {
            return <h2 {...props}>{highlightMentions(children)}</h2>;
          }
          return <h2 {...props}>{children}</h2>;
        },
        h3: ({ children, ...props }) => {
          if (typeof children === "string") {
            return <h3 {...props}>{highlightMentions(children)}</h3>;
          }
          return <h3 {...props}>{children}</h3>;
        },
        li: ({ children, ...props }) => {
          if (typeof children === "string") {
            return <li {...props}>{highlightMentions(children)}</li>;
          }
          return <li {...props}>{children}</li>;
        },
        strong: ({ children, ...props }) => {
          if (typeof children === "string") {
            return <strong {...props}>{highlightMentions(children)}</strong>;
          }
          return <strong {...props}>{children}</strong>;
        },
        em: ({ children, ...props }) => {
          if (typeof children === "string") {
            return <em {...props}>{highlightMentions(children)}</em>;
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
  return /@\w+/.test(content);
};

// @멘션된 사용자명들을 추출하는 함수
export const extractMentions = (content: string): string[] => {
  const mentions: string[] = [];
  const mentionPattern = /@(\w+)/g;
  let match;

  while ((match = mentionPattern.exec(content)) !== null) {
    mentions.push(match[1]); // @ 제외하고 사용자명만 추출
  }

  return mentions;
};
