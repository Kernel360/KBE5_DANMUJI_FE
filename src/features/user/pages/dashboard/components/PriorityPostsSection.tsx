import React, { useState, useEffect } from "react";
import * as S from "../styled/UserDashboardPage.styled";
import { MdWarning, MdAccessTime, MdAssignment } from "react-icons/md";
import { getHighPriorityPosts } from "@/features/admin/services/activityLogService";
import type { PostDashboardReadResponse } from "@/features/admin/types/activityLog";

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

  const getPriorityTagType = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "긴급";
      case "HIGH":
        return "높음";
      case "MEDIUM":
        return "보통";
      case "LOW":
        return "낮음";
      default:
        return "보통";
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
                <MdWarning style={{ marginRight: 6 }} />
                {post.title}
              </S.PriorityLabel>
              <S.PriorityTag
                type={post.priority === "URGENT" ? "red" : "yellow"}
              >
                {getPriorityTagType(post.priority)}
              </S.PriorityTag>
            </S.PriorityHeader>
            <S.PriorityDesc>
              {post.projectName} - {post.projectStepName}
            </S.PriorityDesc>
            <S.PriorityMeta>
              <span>
                <MdAccessTime /> {formatTimeAgo(post.createdAt)}
              </span>
              <span>
                <MdAssignment /> {post.authorName}
              </span>
            </S.PriorityMeta>
          </S.PriorityCard>
        ))
      )}
    </S.PrioritySection>
  );
};

export default PriorityPostsSection;
