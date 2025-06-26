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
    if (linkInput.trim() && !newLinks.includes(linkInput.trim())) {
      setNewLinks([...newLinks, linkInput.trim()]);
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
            }}
          >
            기존 링크
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
            }}
          >
            새로 추가할 링크
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
          placeholder="https://example.com/"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddLink();
          }}
        />
        <button
          type="button"
          onClick={handleAddLink}
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
          }}
        >
          <FiPlus size={16} /> 추가
        </button>
      </div>
    </FormGroup>
  );
};

export default LinkInputSection;
