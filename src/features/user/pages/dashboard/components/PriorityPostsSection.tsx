import React, { useState, useEffect } from "react";
import * as S from "../styled/UserDashboardPage.styled";
import { MdWarning, MdAccessTime, MdAssignment } from "react-icons/md";
import {
  FiUser,
  FiAlertTriangle,
  FiAlertCircle,
  FiLayers,
} from "react-icons/fi";
import { LuUserRoundCog } from "react-icons/lu";
import { FaProjectDiagram } from "react-icons/fa";
import { getHighPriorityPosts } from "@/features/admin/services/activityLogService";
import type { PostDashboardReadResponse } from "@/features/admin/types/activityLog";
import type { PostPriority } from "@/features/project/types/Types";
import { POST_PRIORITY_LABELS } from "@/features/project/types/Types";
import styled from "styled-components";

// ProjectBoard의 StatusBadge 스타일을 복사
const StatusBadge = styled.span<{ $priority: PostPriority }>`
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ $priority }) =>
    $priority === "LOW"
      ? "#065f46"
      : $priority === "MEDIUM"
      ? "#92400e"
      : $priority === "HIGH"
      ? "#a21caf"
      : "#991b1b"};
  background-color: ${({ $priority }) =>
    $priority === "LOW"
      ? "#d1fae5"
      : $priority === "MEDIUM"
      ? "#fef3c7"
      : $priority === "HIGH"
      ? "#fce7f3"
      : "#fee2e2"};
`;

const PriorityPostsSection = () => {
  const [posts, setPosts] = useState<PostDashboardReadResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriorityPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getHighPriorityPosts();
        setPosts(data);
      } catch (err) {
        console.error("우선순위 게시글 조회 실패:", err);
        setError("게시글을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPriorityPosts();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}시간 전`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}일 전`;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ROLE_ADMIN":
        return <LuUserRoundCog size={14} style={{ color: "#8b5cf6" }} />;
      default:
        return <FiUser size={14} style={{ color: "#6b7280" }} />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return <FiAlertTriangle size={16} style={{ color: "#991b1b" }} />;
      case "HIGH":
        return <FiAlertCircle size={16} style={{ color: "#a21caf" }} />;
      default:
        return <FiAlertCircle size={16} style={{ color: "#6b7280" }} />;
    }
  };

  if (loading) {
    return (
      <S.PrioritySection>
        <S.SectionTitle color="#e74c3c">우선순위 높은 게시글</S.SectionTitle>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
          <p style={{ color: "#6b7280", marginTop: "8px" }}>로딩 중...</p>
        </div>
      </S.PrioritySection>
    );
  }

  if (error) {
    return (
      <S.PrioritySection>
        <S.SectionTitle color="#e74c3c">우선순위 높은 게시글</S.SectionTitle>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p style={{ color: "#ef4444" }}>{error}</p>
        </div>
      </S.PrioritySection>
    );
  }

  return (
    <S.PrioritySection>
      <S.SectionTitle color="#e74c3c">우선순위 높은 게시글</S.SectionTitle>
      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p style={{ color: "#6b7280" }}>우선순위 높은 게시글이 없습니다.</p>
        </div>
      ) : (
        posts.map((post) => (
          <S.PriorityCard key={post.postId}>
            <S.PriorityHeader>
              <S.PriorityLabel>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <FaProjectDiagram
                        size={14}
                        style={{ color: "#8b5cf6" }}
                      />
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          fontWeight: "500",
                        }}
                      >
                        {post.projectName}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <FiLayers size={14} style={{ color: "#6366f1" }} />
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          fontWeight: "500",
                        }}
                      >
                        {post.projectStepName}
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "16px",
                      color: "#111827",
                      fontWeight: "600",
                    }}
                  >
                    {post.title}
                  </span>
                </div>
              </S.PriorityLabel>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "-30px",
                }}
              >
                {getPriorityIcon(post.priority)}
                <StatusBadge $priority={post.priority as PostPriority}>
                  {POST_PRIORITY_LABELS[post.priority as PostPriority] ??
                    post.priority}
                </StatusBadge>
              </div>
            </S.PriorityHeader>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "12px",
                marginTop: "8px",
                fontSize: "12px",
                color: "#6b7280",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <MdAccessTime size={12} />
                {formatTimeAgo(post.createdAt)}
              </span>
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                {getRoleIcon(post.authorRole)}
                {post.authorName}({post.authorUsername})
              </span>
            </div>
          </S.PriorityCard>
        ))
      )}
    </S.PrioritySection>
  );
};

export default PriorityPostsSection;
