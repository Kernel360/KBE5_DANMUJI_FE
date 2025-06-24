import React from "react";
import { FiUser, FiCalendar, FiFlag, FiEdit } from "react-icons/fi";
import ClickableUsername from "@/components/ClickableUsername";
import {
  InfoGrid,
  InfoRow,
  InfoKey,
  InfoValue,
} from "@/features/board/components/Post/styles/ProjectPostDetailModal.styled";
import type { Post } from "@/features/project-d/types/post";

// 우선순위 타입 정의
type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT" | 1 | 2 | 3 | 4;

// 우선순위 스타일 타입 정의
interface PriorityStyle {
  backgroundColor: string;
  color: string;
  border: string;
}

interface PostHeaderProps {
  post: Post;
  onUserProfileClick: (
    event: React.MouseEvent,
    username: string,
    userId?: number
  ) => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  post,
  onUserProfileClick,
}) => {
  // 우선순위 텍스트 반환 함수
  const getPriorityText = (priority: Priority): string => {
    // 백엔드에서 오는 문자열 우선순위 처리
    if (typeof priority === "string") {
      switch (priority) {
        case "LOW":
          return "낮음";
        case "MEDIUM":
          return "보통";
        case "HIGH":
          return "높음";
        case "URGENT":
          return "긴급";
        default:
          console.warn(
            "알 수 없는 우선순위 문자열:",
            priority,
            "기본값 '낮음' 사용"
          );
          return "낮음";
      }
    }

    // 숫자 우선순위 처리 (기존 호환성)
    if (typeof priority === "number") {
      switch (priority) {
        case 1:
          return "낮음";
        case 2:
          return "보통";
        case 3:
          return "높음";
        case 4:
          return "긴급";
        default:
          console.warn(
            "알 수 없는 우선순위 숫자:",
            priority,
            "기본값 '낮음' 사용"
          );
          return "낮음";
      }
    }

    console.warn(
      "알 수 없는 우선순위 타입:",
      typeof priority,
      "값:",
      priority,
      "기본값 '낮음' 사용"
    );
    return "낮음";
  };

  // 우선순위별 스타일 반환 함수
  const getPriorityStyle = (priority: Priority): PriorityStyle => {
    // 백엔드에서 오는 문자열 우선순위 처리
    if (typeof priority === "string") {
      switch (priority) {
        case "LOW":
          return {
            backgroundColor: "#dcfce7",
            color: "#166534",
            border: "1px solid #bbf7d0",
          };
        case "MEDIUM":
          return {
            backgroundColor: "#fef3c7",
            color: "#92400e",
            border: "1px solid #fde68a",
          };
        case "HIGH":
          return {
            backgroundColor: "#f3e8ff",
            color: "#7c3aed",
            border: "1px solid #e9d5ff",
          };
        case "URGENT":
          return {
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            border: "1px solid #fecaca",
          };
        default:
          return {
            backgroundColor: "#dcfce7",
            color: "#166534",
            border: "1px solid #bbf7d0",
          };
      }
    }

    // 숫자 우선순위 처리 (기존 호환성)
    if (typeof priority === "number") {
      switch (priority) {
        case 1:
          return {
            backgroundColor: "#dcfce7",
            color: "#166534",
            border: "1px solid #bbf7d0",
          };
        case 2:
          return {
            backgroundColor: "#fef3c7",
            color: "#92400e",
            border: "1px solid #fde68a",
          };
        case 3:
          return {
            backgroundColor: "#f3e8ff",
            color: "#7c3aed",
            border: "1px solid #e9d5ff",
          };
        case 4:
          return {
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            border: "1px solid #fecaca",
          };
        default:
          return {
            backgroundColor: "#dcfce7",
            color: "#166534",
            border: "1px solid #bbf7d0",
          };
      }
    }

    // 기본 스타일
    return {
      backgroundColor: "#dcfce7",
      color: "#166534",
      border: "1px solid #bbf7d0",
    };
  };

  const formatDate = (dateString: string) => {
    let date;
    if (dateString.includes("T")) {
      // ISO 8601 (UTC) 문자열
      date = new Date(dateString);
    } else {
      // 'YYYY-MM-DD HH:mm:ss' → 'YYYY-MM-DDTHH:mm:ssZ'로 변환 후 UTC로 파싱
      date = new Date(dateString.replace(" ", "T") + "Z");
    }
    date.setHours(date.getHours() + 9);

    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <InfoGrid
      style={{ marginBottom: "24px", marginLeft: "20px", marginRight: "16px" }}
    >
      <InfoRow style={{ justifyContent: "flex-start" }}>
        <InfoKey
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#6b7280",
            fontWeight: 500,
            fontSize: "0.95rem",
            minWidth: "80px",
          }}
        >
          <FiUser style={{ color: "#fdb924" }} /> 작성자
        </InfoKey>
        <InfoValue
          style={{
            marginLeft: "-4.5px",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#111827",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <ClickableUsername
            username={
              post.author?.name || post.authorName || "알 수 없는 사용자"
            }
            userId={post.author?.id || post.authorId}
            onClick={onUserProfileClick}
            style={{ color: "#111827" }}
          />
          <span
            style={{
              fontSize: 12,
              color: "#b0b0b0",
              marginLeft: 8,
              fontWeight: 400,
            }}
          >
            {post.authorIp}
          </span>
        </InfoValue>
      </InfoRow>
      <InfoRow style={{ justifyContent: "flex-start" }}>
        <InfoKey
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#6b7280",
            fontWeight: 500,
            fontSize: "0.95rem",
            minWidth: "80px",
          }}
        >
          <FiCalendar style={{ color: "#fdb924" }} /> 작성일
        </InfoKey>
        <InfoValue
          style={{
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#111827",
          }}
        >
          {formatDate(post.createdAt)}
        </InfoValue>
      </InfoRow>
      <InfoRow style={{ justifyContent: "flex-start" }}>
        <InfoKey
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#6b7280",
            fontWeight: 500,
            fontSize: "0.95rem",
            minWidth: "80px",
          }}
        >
          <FiEdit style={{ color: "#fdb924" }} /> 수정일
        </InfoKey>
        <InfoValue
          style={{
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#111827",
          }}
        >
          {post.updatedAt && post.updatedAt !== post.createdAt
            ? formatDate(post.updatedAt)
            : "-"}
        </InfoValue>
      </InfoRow>
      <InfoRow style={{ justifyContent: "flex-start" }}>
        <InfoKey
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#6b7280",
            fontWeight: 500,
            fontSize: "0.95rem",
            minWidth: "80px",
          }}
        >
          <FiFlag style={{ color: "#fdb924" }} /> 우선순위
        </InfoKey>
        <InfoValue
          style={{
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#111827",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              ...getPriorityStyle(post.priority),
              fontWeight: 600,
              fontSize: 13,
              borderRadius: 9999,
              padding: "2px 12px",
              marginLeft: 0,
              display: "inline-block",
            }}
          >
            {getPriorityText(post.priority)}
          </span>
        </InfoValue>
      </InfoRow>
    </InfoGrid>
  );
};

export default PostHeader;
