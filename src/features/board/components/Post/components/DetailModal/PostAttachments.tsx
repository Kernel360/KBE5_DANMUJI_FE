import React from "react";
import {
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive,
  FaFileAlt,
} from "react-icons/fa";
import { FiDownload, FiFile } from "react-icons/fi";
import { LuImage } from "react-icons/lu";
import {
  AttachmentsSection,
  FileList,
  FileItem,
  FileInfo,
  FileIcon,
  FileDetails,
  FileName,
  FileMeta,
  FileActions,
  FileActionButton,
  NoFilesMessage,
} from "@/features/board/components/Post/styles/ProjectPostDetailModal.styled";
import type { PostFile } from "@/features/project-d/types/post";

interface PostAttachmentsProps {
  files: PostFile[];
  onFileDownload: (file: PostFile, postId: number) => void;
  postId: number;
}

const PostAttachments: React.FC<PostAttachmentsProps> = ({
  files,
  onFileDownload,
  postId,
}) => {
  const getFileIcon = (file: PostFile) => {
    const fileType = file.fileType.toLowerCase();
    const fileName = file.fileName.toLowerCase();
    const extension = fileName.split(".").pop() || "";

    // 아이콘 파일 (.ico)
    if (extension === "ico") {
      return <FiFile style={{ color: "#fbbf24" }} />;
    }

    if (fileType.includes("word") || fileType.includes("doc")) {
      return <FaFileWord style={{ color: "#2b579a" }} />;
    } else if (fileType.includes("excel") || fileType.includes("xls")) {
      return <FaFileExcel style={{ color: "#217346" }} />;
    } else if (fileType.includes("powerpoint") || fileType.includes("ppt")) {
      return <FaFilePowerpoint style={{ color: "#d24726" }} />;
    } else if (
      fileType.includes("zip") ||
      fileType.includes("rar") ||
      fileType.includes("7z")
    ) {
      return <FaFileArchive style={{ color: "#ff6b35" }} />;
    } else if (fileType.includes("pdf")) {
      return <FaFileAlt style={{ color: "#dc3545" }} />;
    } else if (
      fileType.includes("image") ||
      fileType.includes("jpg") ||
      fileType.includes("png") ||
      fileType.includes("gif") ||
      fileType.includes("webp") ||
      extension === "webp"
    ) {
      return <LuImage style={{ color: "#10b981" }} />;
    } else {
      return <FiFile style={{ color: "#6c757d" }} />;
    }
  };

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(size) / Math.log(k));

    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const hasValidFiles =
    files && files.length > 0 && files.some((f) => Number(f.fileSize) > 0);

  return (
    <AttachmentsSection>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
        첨부 파일
      </div>
      <FileList>
        {hasValidFiles ? (
          files
            .filter((f) => Number(f.fileSize) > 0)
            .map((file: PostFile) => (
              <FileItem key={file.id}>
                <FileInfo>
                  <FileIcon>{getFileIcon(file)}</FileIcon>
                  <FileDetails>
                    <FileName>{file.fileName}</FileName>
                    <FileMeta>
                      <span>{file.fileType.toUpperCase()}</span>
                      <span>{formatFileSize(file.fileSize)}</span>
                    </FileMeta>
                  </FileDetails>
                </FileInfo>
                <FileActions>
                  <FileActionButton
                    onClick={() => onFileDownload(file, postId)}
                    title="다운로드"
                  >
                    <FiDownload size={16} />
                  </FileActionButton>
                </FileActions>
              </FileItem>
            ))
        ) : (
          <FileItem>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "2px 12px",
              }}
            >
              <FiFile size={16} style={{ color: "#9ca3af", marginLeft: -10 }} />
              <NoFilesMessage>첨부된 파일이 없습니다.</NoFilesMessage>
            </div>
          </FileItem>
        )}
      </FileList>
    </AttachmentsSection>
  );
};

export default PostAttachments;
