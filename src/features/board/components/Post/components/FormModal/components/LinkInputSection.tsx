import React, { useState } from "react";
import {
  FormGroup,
  Label,
  Input,
} from "@/features/board/components/Post/styles/PostFormModal.styled";
import { FiLink, FiTrash2, FiPlus } from "react-icons/fi";

interface LinkInputSectionProps {
  mode: "create" | "edit";
  existingLinks: { id: number; url: string }[];
  setExistingLinks: (links: { id: number; url: string }[]) => void;
  newLinks: string[];
  setNewLinks: (links: string[]) => void;
  deletedLinkIds: number[];
  setDeletedLinkIds: (ids: number[]) => void;
}

const LinkInputSection: React.FC<LinkInputSectionProps> = ({
  mode,
  existingLinks,
  setExistingLinks,
  newLinks,
  setNewLinks,
  deletedLinkIds,
  setDeletedLinkIds,
}) => {
  const [linkInput, setLinkInput] = useState("");

  // 새 링크 추가
  const handleAddLink = () => {
    const trimmedUrl = linkInput.trim();
    if (trimmedUrl) {
      // URL 형식 검증 (http:// 또는 https://로 시작하는지 확인)
      if (
        !trimmedUrl.startsWith("http://") &&
        !trimmedUrl.startsWith("https://")
      ) {
        alert("올바른 URL 형식으로 입력해주세요. (예: https://example.com)");
        return;
      }

      // 중복 체크 제거 - 같은 URL이라도 여러 번 추가 가능하도록
      setNewLinks([...newLinks, trimmedUrl]);
      setLinkInput("");
    }
  };

  // 새 링크 삭제
  const handleRemoveNewLink = (idx: number) => {
    setNewLinks(newLinks.filter((_, i) => i !== idx));
  };

  // 기존 링크 삭제
  const handleRemoveExistingLink = (id: number) => {
    setDeletedLinkIds([...deletedLinkIds, id]);
    setExistingLinks(existingLinks.filter((l) => l.id !== id));
  };

  return (
    <FormGroup>
      <Label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 35,
          }}
        >
          <FiLink size={16} style={{ color: "#fdb924" }} />
          첨부 링크
        </div>
      </Label>
      {/* 기존 링크 목록 (수정 모드) */}
      {mode === "edit" && existingLinks.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#6b7280",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            기존 링크 ({existingLinks.length}개)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {existingLinks.map((link) => (
              <div
                key={link.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#f9fafb",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  padding: "8px 12px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f3f4f6";
                  e.currentTarget.style.borderColor = "#d1d5db";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f9fafb";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                <FiLink
                  size={14}
                  style={{ color: "#9ca3af", marginRight: 8 }}
                />
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#374151",
                    textDecoration: "none",
                    flex: 1,
                    wordBreak: "break-all",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  {link.url}
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveExistingLink(link.id)}
                  style={{
                    background: "none",
                    border: "none",
                    marginLeft: 8,
                    color: "#ef4444",
                    cursor: "pointer",
                    padding: 4,
                    borderRadius: 4,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fef2f2";
                    e.currentTarget.style.color = "#dc2626";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                    e.currentTarget.style.color = "#ef4444";
                  }}
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* 새로 추가할 링크 목록 */}
      {newLinks.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#6b7280",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            새로 추가할 링크 ({newLinks.length}개)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {newLinks.map((url, idx) => (
              <div
                key={url + idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#f0f9ff",
                  borderRadius: 6,
                  border: "1px solid #bae6fd",
                  padding: "8px 12px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e0f2fe";
                  e.currentTarget.style.borderColor = "#7dd3fc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f0f9ff";
                  e.currentTarget.style.borderColor = "#bae6fd";
                }}
              >
                <FiLink
                  size={14}
                  style={{ color: "#0ea5e9", marginRight: 8 }}
                />
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#374151",
                    textDecoration: "none",
                    flex: 1,
                    wordBreak: "break-all",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  {url}
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveNewLink(idx)}
                  style={{
                    background: "none",
                    border: "none",
                    marginLeft: 8,
                    color: "#ef4444",
                    cursor: "pointer",
                    padding: 4,
                    borderRadius: 4,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fef2f2";
                    e.currentTarget.style.color = "#dc2626";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                    e.currentTarget.style.color = "#ef4444";
                  }}
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* 새 링크 입력란 */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div
          style={{
            position: "relative",
            flex: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <FiLink
            size={16}
            style={{
              position: "absolute",
              left: 12,
              color: "#9ca3af",
              zIndex: 1,
            }}
          />
          <Input
            type="url"
            placeholder="https://example.com (여러 개 추가 가능)"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddLink();
              }
            }}
            style={{
              paddingLeft: "40px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "14px",
              transition: "all 0.2s ease",
              background: "#ffffff",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#fdb924";
              e.target.style.boxShadow = "0 0 0 3px rgba(253, 185, 36, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
        <button
          type="button"
          onClick={handleAddLink}
          title="링크 추가 (여러 개 추가 가능)"
          style={{
            background: "#fdb924",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 4px rgba(253, 185, 36, 0.2)",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f59e0b";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow =
              "0 4px 8px rgba(253, 185, 36, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#fdb924";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 2px 4px rgba(253, 185, 36, 0.2)";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 1px 2px rgba(253, 185, 36, 0.2)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow =
              "0 4px 8px rgba(253, 185, 36, 0.3)";
          }}
        >
          <FiPlus size={20} />
        </button>
      </div>
    </FormGroup>
  );
};

export default LinkInputSection;
