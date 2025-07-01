import React, { useState, useEffect } from "react";
import * as S from "../styled/UserDashboardPage.styled";
import { MdAccessTime, MdComment, MdReply, MdPostAdd } from "react-icons/md";
import { FiRotateCcw, FiAtSign } from "react-icons/fi";
import { getMyMentions } from "@/features/admin/services/activityLogService";
import type { MyMentionListResponse } from "@/features/admin/types/activityLog";
import ProjectPostDetailModal from "@/features/board/components/Post/components/DetailModal/ProjectPostDetailModal";
import {
  getPostDetail,
  getCommentDetail,
} from "@/features/project-d/services/postService";
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

  // 게시글 상세 모달 관련 상태
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "MENTIONED":
        return <FiAtSign size={14} style={{ color: "#3b82f6" }} />;
      case "COMMENT_POST_CREATED":
        return <MdComment size={14} style={{ color: "#10b981" }} />;
      case "COMMENT_REPLY_CREATED":
        return <MdReply size={14} style={{ color: "#f59e0b" }} />;
      case "PROJECT_POST_CREATED":
        return <MdPostAdd size={14} style={{ color: "#8b5cf6" }} />;
      default:
        return <FiAtSign size={14} style={{ color: "#6b7280" }} />;
    }
  };

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case "MENTIONED":
        return "멘션 알림";
      case "COMMENT_POST_CREATED":
        return "댓글 알림";
      case "COMMENT_REPLY_CREATED":
        return "답글 알림";
      case "PROJECT_POST_CREATED":
        return "새 게시글";
      default:
        return "알림";
    }
  };

  const handleReload = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyMentions();
      setMentions(data);
    } catch (err) {
      console.error("알림 조회 실패:", err);
      setError("알림을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleMentionClick = async (mention: MyMentionListResponse) => {
    console.log("알림 클릭:", mention);

    // 타입에 따라 다른 처리
    switch (mention.type) {
      case "MENTIONED":
        // 멘션된 게시글로 이동 (게시글이거나 댓글일 수 있음)
        console.log("멘션된 게시글로 이동:", mention.referenceId);
        try {
          // 먼저 게시글으로 시도
          await getPostDetail(mention.referenceId);
          // 게시글이 존재하면 게시글 ID로 사용
          setSelectedPostId(mention.referenceId);
          setIsDetailModalOpen(true);
        } catch (error) {
          // 게시글이 없으면 댓글일 가능성
          console.log(
            "게시글이 아니므로 댓글일 가능성 확인:",
            mention.referenceId
          );
          try {
            // 댓글 상세 조회하여 게시글 ID 가져오기
            const commentResponse = await getCommentDetail(mention.referenceId);
            if (commentResponse.data && commentResponse.data.postId) {
              setSelectedPostId(commentResponse.data.postId);
              setIsDetailModalOpen(true);
            } else {
              console.error("댓글에서 게시글 ID를 찾을 수 없습니다.");
            }
          } catch (commentError) {
            console.error("댓글 상세 조회도 실패:", commentError);
            // 최종 fallback으로 원래 ID 사용
            setSelectedPostId(mention.referenceId);
            setIsDetailModalOpen(true);
          }
        }
        break;

      case "COMMENT_POST_CREATED":
        // 내 게시글에 댓글이 달린 경우 - referenceId가 게시글 ID일 가능성
        console.log("내 게시글에 댓글이 달린 경우:", mention.referenceId);
        try {
          // 먼저 게시글으로 시도
          await getPostDetail(mention.referenceId);
          console.log("게시글 ID로 확인됨:", mention.referenceId);
          setSelectedPostId(mention.referenceId);
          setIsDetailModalOpen(true);
        } catch (error) {
          console.log(
            "게시글이 아니므로 댓글일 가능성 확인:",
            mention.referenceId
          );
          // 댓글 상세 조회 시도
          try {
            const commentResponse = await getCommentDetail(mention.referenceId);
            console.log("댓글 상세 조회 응답:", commentResponse);

            if (commentResponse.data && commentResponse.data.postId) {
              console.log(
                "댓글에서 게시글 ID 찾음:",
                commentResponse.data.postId
              );
              setSelectedPostId(commentResponse.data.postId);
              setIsDetailModalOpen(true);
            } else {
              console.error(
                "댓글에서 게시글 ID를 찾을 수 없습니다. 응답:",
                commentResponse
              );
              // 최종 fallback으로 원래 ID 사용
              setSelectedPostId(mention.referenceId);
              setIsDetailModalOpen(true);
            }
          } catch (commentError) {
            console.error("댓글 상세 조회도 실패:", commentError);
            // 최종 fallback으로 원래 ID 사용
            setSelectedPostId(mention.referenceId);
            setIsDetailModalOpen(true);
          }
        }
        break;

      case "COMMENT_REPLY_CREATED":
        // 내 댓글에 대댓글이 달린 경우 - 해당 게시글 상세로 이동
        console.log("댓글이 달린 게시글 상세로 이동:", mention.referenceId);
        try {
          // 먼저 게시글으로 시도
          await getPostDetail(mention.referenceId);
          console.log("게시글 ID로 확인됨:", mention.referenceId);
          setSelectedPostId(mention.referenceId);
          setIsDetailModalOpen(true);
        } catch (error) {
          console.log(
            "게시글이 아니므로 댓글일 가능성 확인:",
            mention.referenceId
          );
          // 댓글 상세 조회 시도
          try {
            const commentResponse = await getCommentDetail(mention.referenceId);
            console.log("답글 상세 조회 응답:", commentResponse);

            if (commentResponse.data && commentResponse.data.postId) {
              console.log(
                "댓글에서 게시글 ID 찾음:",
                commentResponse.data.postId
              );
              setSelectedPostId(commentResponse.data.postId);
              setIsDetailModalOpen(true);
            } else {
              console.error(
                "댓글에서 게시글 ID를 찾을 수 없습니다. 응답:",
                commentResponse
              );
              // 최종 fallback으로 원래 ID 사용
              setSelectedPostId(mention.referenceId);
              setIsDetailModalOpen(true);
            }
          } catch (commentError) {
            console.error("댓글 상세 조회도 실패:", commentError);
            // 최종 fallback으로 원래 ID 사용
            setSelectedPostId(mention.referenceId);
            setIsDetailModalOpen(true);
          }
        }
        break;

      case "PROJECT_POST_CREATED":
        // 프로젝트에 새로운 게시글이 등록된 경우 - 게시글 상세로 이동
        console.log("새 게시글 상세로 이동:", mention.referenceId);
        setSelectedPostId(mention.referenceId);
        setIsDetailModalOpen(true);
        break;

      default:
        console.log("알 수 없는 알림 타입:", mention.type);
    }
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedPostId(null);
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
          <S.SectionTitle>알림</S.SectionTitle>
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
          <S.SectionTitle>알림</S.SectionTitle>
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
        <S.SectionTitle>알림 목록</S.SectionTitle>
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
            onClick={() => handleMentionClick(mention)}
            style={{
              padding: "12px 16px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "4px",
                  }}
                >
                  {getNotificationIcon(mention.type)}
                  <span
                    style={{
                      fontSize: "14px",
                      color: mention.isRead ? "#6b7280" : "#111827",
                      fontWeight: mention.isRead ? "400" : "600",
                    }}
                  >
                    {getNotificationTitle(mention.type)}
                  </span>
                  {!mention.isRead && (
                    <span
                      style={{
                        padding: "1px 4px",
                        backgroundColor: "#ef4444",
                        color: "white",
                        borderRadius: "3px",
                        fontSize: "9px",
                        fontWeight: "600",
                        lineHeight: "1",
                      }}
                    >
                      NEW
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: mention.isRead ? "#9ca3af" : "#374151",
                    lineHeight: "1.4",
                    marginBottom: "4px",
                  }}
                >
                  {mention.content}
                </div>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: mention.isRead ? "#9ca3af" : "#6b7280",
                  whiteSpace: "nowrap",
                }}
              >
                {formatTimeAgo(mention.createdAt)}
              </div>
            </div>
          </MentionCardWithHover>
        ))
      )}

      {/* 게시글 상세 모달 */}
      <ProjectPostDetailModal
        open={isDetailModalOpen}
        onClose={handleDetailModalClose}
        postId={selectedPostId}
        stepName="알림"
      />
    </S.MentionedSection>
  );
};

export default MentionedPostsSection;
