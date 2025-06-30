import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { renderContentWithMentions } from "@/utils/mentionUtils";
import type { Post } from "@/features/project-d/types/post";

interface PostContentProps {
  post: Post;
  onUserProfileClick: (
    event: React.MouseEvent,
    username: string,
    userId?: number
  ) => void;
}

const PostContent: React.FC<PostContentProps> = ({
  post,
  onUserProfileClick,
}) => {
  return (
    <div style={{ margin: "32px 16px 0 16px" }}>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
        내용
      </div>
      <div
        style={{
          fontSize: 14,
          color: "#444",
          lineHeight: 1.7,
          background: "#f8f9fa",
          borderRadius: 8,
          padding: 16,
          wordWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  margin: "16px 0 8px 0",
                }}
              >
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  margin: "14px 0 6px 0",
                }}
              >
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "bold",
                  margin: "12px 0 4px 0",
                }}
              >
                {children}
              </h3>
            ),
            p: ({ children }) => {
              if (typeof children === "string") {
                return (
                  <p style={{ margin: "8px 0", lineHeight: "1.6" }}>
                    {renderContentWithMentions(children, onUserProfileClick)}
                  </p>
                );
              }
              return (
                <p style={{ margin: "8px 0", lineHeight: "1.6" }}>{children}</p>
              );
            },
            ul: ({ children }) => (
              <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol style={{ margin: "8px 0", paddingLeft: "20px" }}>
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li style={{ margin: "4px 0" }}>{children}</li>
            ),
            code: ({ children, className }) => {
              const isInline = !className;
              return isInline ? (
                <code
                  style={{
                    backgroundColor: "#f3f4f6",
                    padding: "2px 4px",
                    borderRadius: "3px",
                    fontSize: "0.875rem",
                    fontFamily: "monospace",
                  }}
                >
                  {children}
                </code>
              ) : (
                <pre
                  style={{
                    backgroundColor: "#f3f4f6",
                    padding: "12px",
                    borderRadius: "6px",
                    overflow: "auto",
                    margin: "8px 0",
                  }}
                >
                  <code
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                    }}
                  >
                    {children}
                  </code>
                </pre>
              );
            },
            blockquote: ({ children }) => (
              <blockquote
                style={{
                  borderLeft: "4px solid #d1d5db",
                  paddingLeft: "12px",
                  margin: "8px 0",
                  color: "#6b7280",
                  fontStyle: "italic",
                }}
              >
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  margin: "8px 0",
                }}
              >
                {children}
              </table>
            ),
            th: ({ children }) => (
              <th
                style={{
                  border: "1px solid #d1d5db",
                  padding: "8px",
                  backgroundColor: "#f9fafb",
                  fontWeight: "bold",
                  textAlign: "left",
                }}
              >
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td
                style={{
                  border: "1px solid #d1d5db",
                  padding: "8px",
                }}
              >
                {children}
              </td>
            ),
          }}
        >
          {post.content || ""}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default PostContent;
