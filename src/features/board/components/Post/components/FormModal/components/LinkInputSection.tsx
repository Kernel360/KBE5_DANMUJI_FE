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
    console.log("=== 기존 링크 삭제 ===");
    console.log("삭제할 링크 ID:", id);
    console.log("삭제 전 deletedLinkIds:", deletedLinkIds);

    setDeletedLinkIds([...deletedLinkIds, id]);
    setExistingLinks(existingLinks.filter((l) => l.id !== id));

    console.log("삭제 후 deletedLinkIds:", [...deletedLinkIds, id]);
    console.log("=========================");
  };

  return (
    <FormGroup>
      <Label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FiLink size={16} style={{ color: "#8b5cf6" }} />
          첨부 링크
        </div>
      </Label>
      {/* 기존 링크 목록 (수정 모드) */}
      {mode === "edit" && existingLinks.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            기존 링크 ({existingLinks.length}개)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {existingLinks.map((link) => (
              <div
                key={link.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#f9fafb",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  padding: "6px 10px",
                }}
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#2563eb",
                    textDecoration: "underline",
                    flex: 1,
                    wordBreak: "break-all",
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
                  }}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* 새로 추가할 링크 목록 */}
      {newLinks.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            새로 추가할 링크 ({newLinks.length}개)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {newLinks.map((url, idx) => (
              <div
                key={url + idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#f9fafb",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  padding: "6px 10px",
                }}
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#2563eb",
                    textDecoration: "underline",
                    flex: 1,
                    wordBreak: "break-all",
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
                  }}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* 새 링크 입력란 */}
      <div style={{ display: "flex", gap: 8 }}>
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
        />
        <button
          type="button"
          onClick={handleAddLink}
          title="링크 추가 (여러 개 추가 가능)"
          style={{
            background: "#fdb924",
            border: "none",
            borderRadius: 6,
            color: "#fff",
            fontWeight: 600,
            padding: "0 14px",
            display: "flex",
            alignItems: "center",
            gap: 4,
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f59e0b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#fdb924";
          }}
        >
          <FiPlus size={16} /> 추가
        </button>
      </div>
    </FormGroup>
  );
};

export default LinkInputSection;
