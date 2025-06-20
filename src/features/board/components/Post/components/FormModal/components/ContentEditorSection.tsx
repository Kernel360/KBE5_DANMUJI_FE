import React from "react";
import { FiFileText, FiEdit, FiEye, FiMaximize2 } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FormGroup,
  Label,
  TextArea,
} from "../../../styles/PostFormModal.styled";

interface ContentEditorSectionProps {
  content: string;
  isMarkdownMode: boolean;
  isPreviewMode: boolean;
  formErrors: Record<string, string>;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onMarkdownModeToggle: () => void;
  onPreviewModeToggle: () => void;
  onFullScreenOpen: () => void;
  colorTheme: { main: string; sub: string };
}

const ContentEditorSection: React.FC<ContentEditorSectionProps> = ({
  content,
  isMarkdownMode,
  isPreviewMode,
  formErrors,
  onContentChange,
  onMarkdownModeToggle,
  onPreviewModeToggle,
  onFullScreenOpen,
  colorTheme,
}) => {
  return (
    <FormGroup>
      <Label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FiFileText size={16} style={{ color: colorTheme.sub }} />
            내용
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <button
              type="button"
              onClick={onFullScreenOpen}
              style={{
                background: "none",
                color: "#6b7280",
                border: "none",
                padding: "0",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
                fontWeight: "500",
              }}
              title="확대하기"
            >
              <FiMaximize2 size={14} />
              확대하기
            </button>
            <button
              type="button"
              onClick={onMarkdownModeToggle}
              style={{
                background: "none",
                color: isMarkdownMode ? colorTheme.main : "#6b7280",
                border: "none",
                padding: "0",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
                fontWeight: isMarkdownMode ? "600" : "500",
                textDecoration: "none",
              }}
              title="마크다운 모드"
            >
              <FiEdit size={14} />
              마크다운
            </button>
            {isMarkdownMode && (
              <button
                type="button"
                onClick={onPreviewModeToggle}
                style={{
                  background: "none",
                  color: isPreviewMode ? colorTheme.main : "#6b7280",
                  border: "none",
                  padding: "0",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s",
                  fontWeight: isPreviewMode ? "600" : "500",
                  textDecoration: "none",
                }}
                title="미리보기"
              >
                <FiEye size={14} />
                미리보기
              </button>
            )}
          </div>
        </div>
      </Label>
      {isMarkdownMode && isPreviewMode ? (
        <div
          style={{
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            padding: "12px",
            minHeight: "200px",
            backgroundColor: "#f9fafb",
            overflow: "auto",
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
              p: ({ children }) => (
                <p style={{ margin: "8px 0", lineHeight: "1.6" }}>{children}</p>
              ),
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
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <TextArea
          name="content"
          value={content}
          onChange={onContentChange}
          placeholder={
            isMarkdownMode
              ? "마크다운 문법을 사용하여 내용을 작성하세요"
              : "게시글 내용을 입력하세요"
          }
          style={{
            fontFamily: isMarkdownMode ? "monospace" : "inherit",
            fontSize: isMarkdownMode ? "14px" : "inherit",
            lineHeight: isMarkdownMode ? "1.4" : "inherit",
          }}
        />
      )}
      {formErrors.content && (
        <div
          style={{
            color: "#ef4444",
            fontSize: "12px",
            marginTop: "4px",
          }}
        >
          {formErrors.content}
        </div>
      )}
    </FormGroup>
  );
};

export default ContentEditorSection;
