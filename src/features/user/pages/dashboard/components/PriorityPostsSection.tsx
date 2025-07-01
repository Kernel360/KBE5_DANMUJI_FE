import React, { useState, useEffect } from "react";
import * as S from "../styled/UserDashboardPage.styled";
import { MdWarning, MdAccessTime, MdAssignment } from "react-icons/md";
import {
  FiUser,
  FiAlertTriangle,
  FiAlertCircle,
  FiLayers,
  FiFileText,
  FiHelpCircle,
  FiRotateCcw,
} from "react-icons/fi";
import { LuUserRoundCog } from "react-icons/lu";
import { FaProjectDiagram } from "react-icons/fa";
import { BiNews } from "react-icons/bi";
import { getHighPriorityPosts } from "@/features/admin/services/activityLogService";
import type { PostDashboardReadResponse } from "@/features/admin/types/activityLog";
import type { PostPriority, PostType } from "@/features/project/types/Types";
import { POST_PRIORITY_LABELS } from "@/features/project/types/Types";
import styled from "styled-components";
import ProjectPostDetailModal from "@/features/board/components/Post/components/DetailModal/ProjectPostDetailModal";

// ProjectBoard의 StatusBadge 스타일을 복사
const StatusBadge = styled.span<{ $priority: PostPriority }>`
  padding: 3px 6px;
  border-radius: 999px;
  font-size: 11px;
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

// TypeBadge 스타일 추가 (ProjectBoard와 동일)
const TypeBadge = styled.span<{ $type: PostType }>`
  padding: 3px 6px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  color: ${({ $type }) => ($type === "GENERAL" ? "#1e40af" : "#92400e")};
  background-color: ${({ $type }) =>
    $type === "GENERAL" ? "#dbeafe" : "#fef3c7"};
`;

// 긴급 아이콘 애니메이션 스타일 추가
const UrgentIcon = styled.div`
  animation: blink 0.8s infinite;
  display: flex;
  align-items: center;

  @keyframes blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0.3;
    }
  }
`;

// Reload 버튼 스타일 추가
const ReloadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: auto;
  padding: 8px;
  width: 36px;
  height: 36px;
  background: #f9fafb;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    border 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(107, 114, 128, 0.2);

  &:hover {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    border-color: #fef3c7;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(251, 191, 36, 0.3);
    color: #fff;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(251, 191, 36, 0.2);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2);
  }
`;

const PriorityPostsSection = () => {
  const [posts, setPosts] = useState<PostDashboardReadResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

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

  const getPriorityIcon = (priority: PostPriority) => {
    switch (priority) {
      case "URGENT":
        return (
          <UrgentIcon>
            <FiAlertTriangle size={16} style={{ color: "#991b1b" }} />
          </UrgentIcon>
        );
      case "HIGH":
        return <FiAlertCircle size={16} style={{ color: "#a21caf" }} />;
      default:
        return <FiAlertCircle size={16} style={{ color: "#6b7280" }} />;
    }
  };

  const getTypeIcon = (type: PostType) => {
    switch (type) {
      case "GENERAL":
        return <FiFileText size={16} style={{ color: "#1e40af" }} />;
      case "QUESTION":
        return <FiHelpCircle size={16} style={{ color: "#92400e" }} />;
      default:
        return <FiFileText size={16} style={{ color: "#6b7280" }} />;
    }
  };

  const getTypeText = (type: PostType) => {
    switch (type) {
      case "GENERAL":
        return "일반";
      case "QUESTION":
        return "질문";
      default:
        return type;
    }
  };

  const handlePostClick = (postId: number) => {
    setSelectedPostId(postId);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedPostId(null);
  };

  const handleReload = async () => {
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

  if (loading) {
    return (
      <S.PrioritySection>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <S.SectionTitle color="#e74c3c">우선순위 높은 게시글</S.SectionTitle>
          <ReloadButton onClick={handleReload} title="새로고침">
            <FiRotateCcw size={16} />
          </ReloadButton>
        </div>
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <S.SectionTitle color="#e74c3c">우선순위 높은 게시글</S.SectionTitle>
          <ReloadButton onClick={handleReload} title="새로고침">
            <FiRotateCcw size={16} />
          </ReloadButton>
        </div>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p style={{ color: "#ef4444" }}>{error}</p>
        </div>
      </S.PrioritySection>
    );
  }

  return (
    <S.PrioritySection>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
        }}
      >
        <S.SectionTitle color="#e74c3c">
          <BiNews
            size={20}
            style={{
              marginRight: "8px",
              color: "#ef4444",
              verticalAlign: "middle",
            }}
          />
          우선순위 높은 게시글
        </S.SectionTitle>
        <ReloadButton onClick={handleReload} title="새로고침">
          <FiRotateCcw size={16} />
        </ReloadButton>
      </div>
      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p style={{ color: "#6b7280" }}>우선순위 높은 게시글이 없습니다.</p>
        </div>
      ) : (
        posts.map((post, idx) => (
          <S.PriorityCard
            key={`priority-post-${post.postId}-${idx}`}
            onClick={() => handlePostClick(post.postId)}
            style={{ cursor: "pointer" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <FaProjectDiagram size={13} style={{ color: "#8b5cf6" }} />
                    <span
                      style={{
                        fontSize: "13px",
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
                    <FiLayers size={13} style={{ color: "#6366f1" }} />
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#6b7280",
                        fontWeight: "500",
                      }}
                    >
                      {post.projectStepName}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {getPriorityIcon(post.priority)}
                    <StatusBadge $priority={post.priority}>
                      {POST_PRIORITY_LABELS[post.priority] ?? post.priority}
                    </StatusBadge>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {getTypeIcon(post.type)}
                    <TypeBadge $type={post.type}>
                      {getTypeText(post.type)}
                    </TypeBadge>
                  </div>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#111827",
                      fontWeight: "600",
                      marginLeft: "6px",
                    }}
                  >
                    {post.title}
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "12px",
                    color: "#6b7280",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <MdAccessTime size={11} />
                    {formatTimeAgo(post.createdAt)}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {getRoleIcon(post.authorRole)}
                    {post.authorName}({post.authorUsername})
                  </span>
                </div>
              </div>
            </div>
          </S.PriorityCard>
        ))
      )}
      <ProjectPostDetailModal
        open={isDetailModalOpen}
        postId={selectedPostId}
        onClose={handleDetailModalClose}
      />
    </S.PrioritySection>
  );
};

export default PriorityPostsSection;
