import React from "react";
import { Section } from "@/features/board/components/Question/styles/QuestionAnswerModal.styled";
import type { Post } from "@/features/project-d/types/post";

interface PostInfoProps {
  post: Post;
}

const PostInfo: React.FC<PostInfoProps> = ({ post }) => {
  const getPostStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "대기";
      case "APPROVED":
        return "승인";
      case "REJECTED":
        return "거부";
      default:
        return status;
    }
  };

  const getPostStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "#10b981";
      case "PENDING":
        return "#f59e0b";
      case "REJECTED":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return kstDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Section style={{ marginBottom: 24 }}>
      <span style={{ fontWeight: 600, color: "#6b7280", marginBottom: 4 }}>
        제목
      </span>
      <span
        style={{
          fontSize: 16,
          color: "#222",
          marginBottom: 8,
          marginLeft: 14,
        }}
      >
        {post.title}
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <span style={{ fontWeight: 600, color: "#6b7280" }}>상태</span>
        <span
          style={{
            background: getPostStatusColor(post.status),
            color: "white",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 13,
            padding: "2px 12px",
            marginLeft: 0,
          }}
        >
          {getPostStatusText(post.status)}
        </span>
        <span style={{ color: "#b0b0b0", fontSize: 13, marginLeft: 10 }}>
          {formatDate(post.createdAt)}
        </span>
      </div>
      <div style={{ fontWeight: 600, color: "#6b7280", marginBottom: 4 }}>
        내용
      </div>
      <div
        style={{
          fontSize: 15,
          color: "#444",
          lineHeight: 1.7,
          background: "#f8f9fa",
          borderRadius: 8,
          padding: 16,
        }}
      >
        {post.content}
      </div>
    </Section>
  );
};

export default PostInfo;
