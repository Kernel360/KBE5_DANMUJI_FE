import React from "react";
import {
  FiPaperclip,
  FiFile,
  FiImage,
  FiDownload,
  FiTrash2,
} from "react-icons/fi";
import {
  FormGroup,
  Label,
  FileUploadArea,
} from "../../../styles/PostFormModal.styled";
import type { PostFile } from "@/features/project-d/types/post";

interface FileUploadSectionProps {
  files: File[];
  existingFiles: PostFile[];
  isDragOver: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleFileClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileRemove: (index: number) => void;
  handleExistingFileRemove: (fileId: number) => void;
  colorTheme: { main: string; sub: string };
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  files,
  existingFiles,
  isDragOver,
  fileInputRef,
  handleFileDrop,
  handleDragOver,
  handleDragLeave,
  handleFileClick,
  handleFileChange,
  handleFileRemove,
  handleExistingFileRemove,
  colorTheme,
}) => {
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <FiImage size={16} />;
    }
    return <FiFile size={16} />;
  };

  const getExistingFileIcon = (file: PostFile) => {
    if (file.fileName.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
      return <FiImage size={16} />;
    }
    return <FiFile size={16} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      <FormGroup>
        <Label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FiPaperclip size={16} style={{ color: colorTheme.sub }} />
            첨부파일
          </div>
        </Label>
        <FileUploadArea
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          $isDragOver={isDragOver}
          onClick={handleFileClick}
        >
          <div style={{ textAlign: "center", padding: "20px" }}>
            <FiDownload
              size={32}
              style={{ color: "#9ca3af", marginBottom: "8px" }}
            />
            <p style={{ margin: "0 0 8px 0", color: "#6b7280" }}>
              파일을 드래그하여 업로드하거나 클릭하여 선택하세요
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#9ca3af",
              }}
            >
              최대 5개 파일, 각 파일 최대 10MB
            </p>
          </div>
          <input
            id="file-input"
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept="image/*,.pdf,.doc,.docx,.txt"
            ref={fileInputRef}
          />
        </FileUploadArea>
      </FormGroup>

      {/* 첨부된 파일 목록 */}
      {(files.length > 0 || existingFiles.length > 0) && (
        <div style={{ marginTop: "12px" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FiFile size={16} style={{ color: colorTheme.sub }} />
            첨부된 파일 ({files.length + existingFiles.length}개)
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {/* 기존 파일 목록 */}
            {existingFiles.map((file) => (
              <div
                key={`existing-${file.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flex: 1,
                  }}
                >
                  <div style={{ color: "#9ca3af" }}>
                    {getExistingFileIcon(file)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#374151",
                        fontWeight: "500",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {file.fileName}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        marginTop: "2px",
                      }}
                    >
                      {formatFileSize(parseInt(file.fileSize))}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExistingFileRemove(file.id);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#fef2f2";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  title="파일 삭제"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}

            {/* 새로 추가된 파일 목록 */}
            {files.map((file, index) => (
              <div
                key={`new-${index}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  backgroundColor: "#f0f9ff",
                  borderRadius: "6px",
                  border: "1px solid #bae6fd",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flex: 1,
                  }}
                >
                  <div style={{ color: colorTheme.sub }}>
                    {getFileIcon(file)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#374151",
                        fontWeight: "500",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {file.name}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        marginTop: "2px",
                      }}
                    >
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileRemove(index);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#fef2f2";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  title="파일 삭제"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FileUploadSection;
