import React, { useState, useEffect } from "react";
import * as S from "../styled/UserDashboardPage.styled";
import { MdAccessTime, MdComment, MdReply, MdPostAdd } from "react-icons/md";
import {
  FiRotateCcw,
  FiAtSign,
  FiBell,
  FiCheckSquare,
  FiCheck,
  FiX,
  FiPackage,
} from "react-icons/fi";
import {
  getMyMentions,
  markNotificationAsRead,
} from "@/features/admin/services/activityLogService";
import type { MyMentionListResponse } from "@/features/admin/types/activityLog";
import { formatRelativeTime } from "@/utils/dateUtils";
import ProjectPostDetailModal from "@/features/board/components/Post/components/DetailModal/ProjectPostDetailModal";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

const blinkAnimation = keyframes`
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0.3;
  }
`;

const NewBadge = styled.span`
  padding: 1px 4px;
  background-color: #ef4444;
  color: white;
  border-radius: 3px;
  font-size: 9px;
  font-weight: 600;
  line-height: 1;
  animation: ${blinkAnimation} 0.8s ease-in-out infinite;
`;

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
    box-shadow: 0 8px 25px rgba(26, 188, 123, 0.15);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(26, 188, 123, 0.1);
  }
`;

const MentionedPostsSection = () => {
  const [mentions, setMentions] = useState<MyMentionListResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 게시글 상세 모달 관련 상태
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const navigate = useNavigate();

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
    return formatRelativeTime(dateString);
  };

  const getNotificationIcon = (type: string, content: string) => {
    // 체크리스트 관련 알림이면 무조건 체크리스트 아이콘
    if (type.startsWith("CHECKLIST_")) {
      return <FiCheckSquare size={14} style={{ color: "#fdb924" }} />;
    }
    switch (type) {
      case "MENTIONED":
        return <FiAtSign size={14} style={{ color: "#3b82f6" }} />;
      case "COMMENT_POST_CREATED":
        return <MdComment size={14} style={{ color: "#10b981" }} />;
      case "COMMENT_REPLY_CREATED":
        return <MdReply size={14} style={{ color: "#f59e0b" }} />;
      case "POST_REPLY_CREATED":
        return <MdReply size={14} style={{ color: "#f59e0b" }} />;
      case "PROJECT_POST_CREATED":
        return <MdPostAdd size={14} style={{ color: "#8b5cf6" }} />;
      case "POST_RESTORED":
        return <FiRotateCcw size={14} style={{ color: "#8b5cf6" }} />;
      case "STEP_APPROVAL_REQUEST":
        return <FiCheckSquare size={14} style={{ color: "#fdb924" }} />;
      case "STEP_APPROVAL_ACCEPTED":
        return <FiCheck size={14} style={{ color: "#10b981" }} />;
      case "STEP_APPROVAL_REJECTED":
        return <FiX size={14} style={{ color: "#ef4444" }} />;
      case "PROJECT_CREATE_ASSIGNMENT":
        return <FiPackage size={14} style={{ color: "#3b82f6" }} />;
      default:
        return <FiAtSign size={14} style={{ color: "#6b7280" }} />;
    }
  };

  const getNotificationTitle = (type: string, content: string) => {
    switch (type) {
      case "MENTIONED":
        return "멘션 알림";
      case "COMMENT_POST_CREATED":
        return "댓글 알림";
      case "COMMENT_REPLY_CREATED":
        return "답글 알림";
      case "POST_REPLY_CREATED":
        return "답글 알림";
      case "PROJECT_POST_CREATED":
        return "새 게시글";
      case "POST_RESTORED":
        return "게시글 복구";
      case "STEP_APPROVAL_REQUEST":
        return "단계 승인 요청";
      case "STEP_APPROVAL_ACCEPTED":
        return "단계 승인 완료";
      case "STEP_APPROVAL_REJECTED":
        return "단계 승인 거절";
      case "PROJECT_CREATE_ASSIGNMENT":
        return "프로젝트 배정";
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
      setError("알림을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleMentionClick = async (mention: MyMentionListResponse) => {
    // 읽지 않은 알림인 경우 읽음 처리
    if (!mention.isRead) {
      try {
        await markNotificationAsRead(mention.notificationId);
        // 로컬 상태 업데이트
        setMentions((prev) =>
          prev.map((m) =>
            m.notificationId === mention.notificationId
              ? { ...m, isRead: true }
              : m
          )
        );
      } catch (error) {
        // 읽음 처리 실패해도 계속 진행
      }
    }

    // 체크리스트/게시글 알림: 프로젝트 상세로 이동 후 게시글 모달 오픈
    if (
      (mention.type.startsWith("CHECKLIST_") ||
        mention.type === "PROJECT_POST_CREATED") &&
      mention.projectId &&
      mention.postId
    ) {
      navigate(`/projects/${mention.projectId}/detail`, {
        state: { openPostId: mention.postId },
      });
      return;
    }

    // 기존 멘션/댓글/답글 등은 기존대로 처리
    switch (mention.type) {
      case "MENTIONED":
      case "COMMENT_POST_CREATED":
      case "COMMENT_REPLY_CREATED":
      case "POST_REPLY_CREATED":
      case "PROJECT_POST_CREATED":
      case "POST_RESTORED":
        if (mention.referenceId) {
          setSelectedPostId(mention.referenceId);
          setIsDetailModalOpen(true);
        }
        break;
      default:
        break;
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
        <S.SectionTitle>
          <FiBell
            size={20}
            style={{
              marginRight: "8px",
              color: "#3b82f6",
              verticalAlign: "middle",
            }}
          />
          알림 목록
        </S.SectionTitle>
        <ReloadButton onClick={handleReload} title="새로고침">
          <FiRotateCcw size={16} />
        </ReloadButton>
      </div>
      {mentions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p style={{ color: "#6b7280" }}>새로운 알림이 없습니다.</p>
        </div>
      ) : (
        mentions.slice(0, 5).map((mention, idx) => (
          <MentionCardWithHover
            key={`mention-${mention.notificationId}-${idx}`}
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
                  {getNotificationIcon(mention.type, mention.content)}
                  <span
                    style={{
                      fontSize: "14px",
                      color: mention.isRead ? "#6b7280" : "#111827",
                      fontWeight: mention.isRead ? "400" : "600",
                    }}
                  >
                    {getNotificationTitle(mention.type, mention.content)}
                  </span>
                  {!mention.isRead && <NewBadge>NEW</NewBadge>}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: mention.isRead ? "#9ca3af" : "#374151",
                    lineHeight: "1.4",
                    marginBottom: "4px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "300px",
                  }}
                  title={mention.content}
                >
                  {mention.content}
                </div>
              </div>
              <div
                style={{
                  fontSize: "12px",
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
