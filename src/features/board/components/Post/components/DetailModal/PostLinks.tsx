import React from "react";
import { FiExternalLink } from "react-icons/fi";
import { TbWorldShare } from "react-icons/tb";
import {
  AttachmentsSection,
  FileList,
  FileItem,
  FileInfo,
  FileIcon,
  FileDetails,
  FileName,
  FileMeta,
  NoFilesMessage,
} from "@/features/board/components/Post/styles/ProjectPostDetailModal.styled";

interface PostLink {
  id: number;
  url: string;
}

interface PostLinksProps {
  links: PostLink[];
}

const PostLinks: React.FC<PostLinksProps> = ({ links }) => {
  if (!links || links.length === 0) {
    return (
      <AttachmentsSection>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
          첨부 링크
        </div>
        <FileList>
          <FileItem>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "2px 12px",
              }}
            >
              <TbWorldShare
                size={16}
                style={{ color: "#9ca3af", marginLeft: -10 }}
              />
              <NoFilesMessage>첨부된 링크가 없습니다.</NoFilesMessage>
            </div>
          </FileItem>
        </FileList>
      </AttachmentsSection>
    );
  }

  return (
    <AttachmentsSection>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
        첨부 링크
      </div>
      <FileList>
        {links.map((link) => (
          <FileItem key={link.id}>
            <FileInfo>
              <FileIcon>
                <TbWorldShare size={16} style={{ color: "#8b5cf6" }} />
              </FileIcon>
              <FileDetails>
                <FileName>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#2563eb",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textDecoration = "underline";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textDecoration = "none";
                    }}
                  >
                    {link.url}
                    <FiExternalLink size={12} />
                  </a>
                </FileName>
                <FileMeta>
                  <span></span>
                </FileMeta>
              </FileDetails>
            </FileInfo>
          </FileItem>
        ))}
      </FileList>
    </AttachmentsSection>
  );
};

export default PostLinks;
