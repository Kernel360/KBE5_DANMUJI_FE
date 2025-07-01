import React, { useState, useEffect } from "react";
import * as S from "../styled/UserDashboardPage.styled";
import { MdAccessTime } from "react-icons/md";
import { FiRotateCcw, FiAtSign } from "react-icons/fi";
import { getMyMentions } from "@/features/admin/services/activityLogService";
import type { MyMentionListResponse } from "@/features/admin/types/activityLog";
import styled from "styled-components";

// Reload 버튼 스타일 추가
const ReloadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: auto;
  padding: 10px;
  width: 40px;
  height: 40px;
  background: #f9fafb;
  color: #374151;
  font-size: 14px;
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

// MentionCard hover 스타일 추가
const MentionCardWithHover = styled(S.MentionedCard)`
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }
`;

const MentionedPostsSection = () => {
  const [mentions, setMentions] = useState<MyMentionListResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMyMentions();
        setMentions(data);
      } catch (err) {
        console.error("나를 멘션한 게시글 조회 실패:", err);
        setError("멘션을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentions();
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

  const handleReload = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyMentions();
      setMentions(data);
    } catch (err) {
      console.error("나를 멘션한 게시글 조회 실패:", err);
      setError("멘션을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleMentionClick = (referenceId: number) => {
    // TODO: 멘션된 게시글로 이동하는 로직 구현
    console.log("멘션된 게시글 클릭:", referenceId);
  };

  if (loading) {
    return (
      <S.MentionedSection>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <S.SectionTitle>나를 멘션</S.SectionTitle>
          <ReloadButton onClick={handleReload} title="새로고침">
            <FiRotateCcw size={16} />
          </ReloadButton>
        </div>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p style={{ color: "#6b7280", marginTop: "8px" }}>로딩 중...</p>
        </div>
      </S.MentionedSection>
    );
  }

  if (error) {
    return (
      <S.MentionedSection>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <S.SectionTitle>나를 멘션</S.SectionTitle>
          <ReloadButton onClick={handleReload} title="새로고침">
            <FiRotateCcw size={16} />
          </ReloadButton>
        </div>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p style={{ color: "#ef4444" }}>{error}</p>
        </div>
      </S.MentionedSection>
    );
  }

  return (
    <S.MentionedSection>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "18px",
        }}
      >
        <S.SectionTitle>나를 멘션</S.SectionTitle>
        <ReloadButton onClick={handleReload} title="새로고침">
          <FiRotateCcw size={16} />
        </ReloadButton>
      </div>
      {mentions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p style={{ color: "#6b7280" }}>나를 멘션한 게시글이 없습니다.</p>
        </div>
      ) : (
        mentions.slice(0, 5).map((mention) => (
          <MentionCardWithHover
            key={mention.notificationId}
            color={mention.isRead ? "gray" : "blue"}
            onClick={() => handleMentionClick(mention.referenceId)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <FiAtSign size={16} style={{ color: "#3b82f6" }} />
              <S.MentionedTitle
                style={{
                  color: mention.isRead ? "#6b7280" : "#111827",
                  fontWeight: mention.isRead ? "400" : "600",
                }}
              >
                멘션 알림 #{mention.notificationId}
              </S.MentionedTitle>
            </div>
            <S.MentionedDesc
              style={{
                color: mention.isRead ? "#9ca3af" : "#374151",
              }}
            >
              {mention.content}
            </S.MentionedDesc>
            <S.MentionedMeta
              style={{
                color: mention.isRead ? "#9ca3af" : "#6b7280",
              }}
            >
              <MdAccessTime /> {formatTimeAgo(mention.createdAt)}
              {!mention.isRead && (
                <span
                  style={{
                    marginLeft: "8px",
                    padding: "2px 6px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: "600",
                  }}
                >
                  NEW
                </span>
              )}
            </S.MentionedMeta>
          </MentionCardWithHover>
        ))
      )}
    </S.MentionedSection>
  );
};

export default MentionedPostsSection;
