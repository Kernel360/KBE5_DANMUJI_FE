import React, { useState, useEffect } from "react";
import { FiX, FiEdit, FiEye } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ModalOverlay,
  ModalPanel,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ButtonGroup,
  SubmitButton,
  CancelButton,
} from "../../styles/PostFormModal.styled";

interface FullScreenContentEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (content: string) => void;
  initialContent: string;
  colorTheme: { main: string; sub: string };
}

const FullScreenContentEditor: React.FC<FullScreenContentEditorProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialContent,
  colorTheme,
}) => {
  const [content, setContent] = useState(initialContent);
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // ESC 키 이벤트 처리
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    onConfirm(content);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalPanel
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: "800px",
          height: "85vh",
          maxHeight: "85vh",
        }}
      >
        <ModalHeader>
          <ModalTitle>게시글 내용 편집</ModalTitle>
          <ModalCloseButton onClick={handleClose}>
            <FiX size={18} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody style={{ height: "calc(85vh - 80px)", padding: "2rem" }}>
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            {/* 마크다운 및 미리보기 버튼 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setIsMarkdownMode(!isMarkdownMode);
                  if (!isMarkdownMode) {
                    setIsPreviewMode(false);
                  }
                }}
                style={{
                  background: "none",
                  color:
                    isMarkdownMode && !isPreviewMode
                      ? colorTheme.main
                      : "#6b7280",
                  border: "none",
                  padding: "0",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s",
                  fontWeight: isMarkdownMode && !isPreviewMode ? "600" : "500",
                }}
                title="마크다운 모드"
              >
                <FiEdit size={14} />
                마크다운
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isMarkdownMode) {
                    setIsPreviewMode(!isPreviewMode);
                  }
                }}
                disabled={!isMarkdownMode}
                style={{
                  background: "none",
                  color:
                    isMarkdownMode && isPreviewMode
                      ? colorTheme.main
                      : "#6b7280",
                  border: "none",
                  padding: "0",
                  fontSize: "13px",
                  cursor: isMarkdownMode ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s",
                  fontWeight: isMarkdownMode && isPreviewMode ? "600" : "500",
                  opacity: isMarkdownMode ? 1 : 0.5,
                }}
                title={
                  isMarkdownMode ? "미리보기" : "마크다운 모드에서만 사용 가능"
                }
              >
                <FiEye size={14} />
                미리보기
              </button>
            </div>

            {isMarkdownMode && isPreviewMode ? (
              <div
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  padding: "16px",
                  flex: 1,
                  backgroundColor: "#f9fafb",
                  overflow: "auto",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1
                        style={{
                          fontSize: "2rem",
                          fontWeight: "bold",
                          margin: "24px 0 16px 0",
                        }}
                      >
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          margin: "20px 0 12px 0",
                        }}
                      >
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          margin: "16px 0 8px 0",
                        }}
                      >
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p style={{ margin: "12px 0", lineHeight: "1.7" }}>
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul style={{ margin: "12px 0", paddingLeft: "24px" }}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol style={{ margin: "12px 0", paddingLeft: "24px" }}>
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li style={{ margin: "6px 0" }}>{children}</li>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code
                          style={{
                            backgroundColor: "#f3f4f6",
                            padding: "3px 6px",
                            borderRadius: "4px",
                            fontSize: "0.9rem",
                            fontFamily: "monospace",
                          }}
                        >
                          {children}
                        </code>
                      ) : (
                        <pre
                          style={{
                            backgroundColor: "#f3f4f6",
                            padding: "16px",
                            borderRadius: "8px",
                            overflow: "auto",
                            margin: "12px 0",
                          }}
                        >
                          <code
                            style={{
                              fontFamily: "monospace",
                              fontSize: "0.9rem",
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
                          paddingLeft: "16px",
                          margin: "12px 0",
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
                          margin: "12px 0",
                        }}
                      >
                        {children}
                      </table>
                    ),
                    th: ({ children }) => (
                      <th
                        style={{
                          border: "1px solid #d1d5db",
                          padding: "12px",
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
                          padding: "12px",
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
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  isMarkdownMode
                    ? "마크다운 문법을 사용하여 내용을 작성할 수 있습니다."
                    : "게시글 내용을 입력하세요."
                }
                style={{
                  width: "100%",
                  flex: 1,
                  padding: "16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontFamily: isMarkdownMode ? "monospace" : "inherit",
                  fontSize: isMarkdownMode ? "14px" : "14px",
                  lineHeight: "1.6",
                  resize: "none",
                  outline: "none",
                  backgroundColor: "#ffffff",
                  color: "#374151",
                }}
                onFocus={(e) => {
                  e.target.style.fontSize = isMarkdownMode ? "14px" : "14px";
                }}
                onBlur={(e) => {
                  e.target.style.fontSize = isMarkdownMode ? "14px" : "14px";
                }}
              />
            )}

            <style>
              {`
                textarea::placeholder {
                  font-size: 13px !important;
                  color: #9ca3af !important;
                }
              `}
            </style>

            <ButtonGroup
              style={{
                marginTop: "20px",
              }}
            >
              <CancelButton type="button" onClick={handleClose}>
                취소
              </CancelButton>
              <SubmitButton type="button" onClick={handleConfirm}>
                확인
              </SubmitButton>
            </ButtonGroup>
          </div>
        </ModalBody>
      </ModalPanel>
    </ModalOverlay>
  );
};

export default FullScreenContentEditor;
