import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  StatusBadge,
  TitleText,
  TypeBadge,
} from "./ProjectBoard.styled";
import { FiUser, FiCalendar } from "react-icons/fi";
import { LuUserRoundCog } from "react-icons/lu";
import { POST_PRIORITY_LABELS } from "../../types/Types";
import type { PostSummaryReadResponse } from "../../../project-d/types/post";
import { PostPriority, PostType } from "../../../project-d/types/post";
import type { ProjectDetailStep } from "../../services/projectService";

interface ProjectBoardTableProps {
  posts: PostSummaryReadResponse[];
  loading: boolean;
  error: string | null;
  projectSteps: ProjectDetailStep[];
  onRowClick: (postId: number) => void;
}

const ProjectBoardTable: React.FC<ProjectBoardTableProps> = ({
  posts,
  loading,
  error,
  projectSteps,
  onRowClick,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const timeStr = date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <span style={{ fontSize: "14px", color: "#374151" }}>{dateStr}</span>
        <span style={{ fontSize: "12px", color: "#6b7280" }}>{timeStr}</span>
      </div>
    );
  };

  // 게시글의 단계 이름을 가져오는 헬퍼 함수
  const getStepName = (stepId: number | null): string => {
    if (!stepId) return "";
    const step = projectSteps.find((s) => s.id === stepId);
    return step ? step.name : "";
  };

  // 게시글 계층 렌더링 함수
  const renderPosts = (posts: PostSummaryReadResponse[]): JSX.Element[] => {
    // 부모 게시글들 (parentId가 null인 것들)
    const parentPosts = posts.filter((post) => post.parentId === null);

    // 답글들 (parentId가 null이 아닌 것들)
    const replyPosts = posts.filter((post) => post.parentId !== null);

    const result: JSX.Element[] = [];

    // 부모 게시글들을 먼저 렌더링
    parentPosts.forEach((parentPost) => {
      // 부모 게시글 추가
      result.push(
        <Tr
          key={parentPost.postId}
          onClick={() => onRowClick(parentPost.postId || 0)}
        >
          <Td>
            <TitleText>
              {getStepName(parentPost.projectStepId) && (
                <span
                  style={{
                    color: "#9ca3af",
                    fontSize: "0.85em",
                    marginRight: "8px",
                  }}
                >
                  {getStepName(parentPost.projectStepId)}
                </span>
              )}
              {parentPost.title}
            </TitleText>
          </Td>
          <Td>
            {parentPost.commentCount > 0 && (
              <span style={{ color: "#9ca3af", fontSize: "0.9em" }}>
                댓글 {parentPost.commentCount}
              </span>
            )}
          </Td>
          <Td style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {parentPost.authorName === "관리자" ? (
                <LuUserRoundCog size={14} style={{ color: "#8b5cf6" }} />
              ) : (
                <FiUser size={14} style={{ color: "#3b82f6" }} />
              )}
              <span>{parentPost.authorName}</span>
            </div>
          </Td>
          <Td>
            <TypeBadge type={parentPost.type as PostType}>
              {parentPost.type === "GENERAL" ? "일반" : "질문"}
            </TypeBadge>
          </Td>
          <Td>
            <StatusBadge $priority={parentPost.priority as PostPriority}>
              {POST_PRIORITY_LABELS[parentPost.priority as PostPriority] ??
                parentPost.priority}
            </StatusBadge>
          </Td>
          <Td style={{ textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <FiCalendar size={14} style={{ color: "#8b5cf6" }} />
              {formatDate(parentPost.createdAt)}
            </div>
          </Td>
        </Tr>
      );

      // 이 부모에 대한 답글들을 찾아서 바로 아래에 렌더링
      const children = replyPosts.filter(
        (reply) => reply.parentId === parentPost.postId
      );
      children.forEach((child) => {
        result.push(
          <Tr key={child.postId} onClick={() => onRowClick(child.postId || 0)}>
            <Td style={{ paddingLeft: 32 }}>
              <TitleText>
                <span
                  style={{
                    color: "#fdb924",
                    fontSize: "0.85em",
                    fontWeight: 600,
                  }}
                >
                  [답글]
                </span>{" "}
                <span
                  style={{
                    color: "#6b7280",
                    fontSize: "0.85em",
                  }}
                >
                  @{parentPost.title}
                </span>{" "}
                {child.title}
              </TitleText>
            </Td>
            <Td>
              {child.commentCount > 0 && (
                <span style={{ color: "#9ca3af", fontSize: "0.9em" }}>
                  댓글 {child.commentCount}
                </span>
              )}
            </Td>
            <Td style={{ textAlign: "left" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {child.authorName === "관리자" ? (
                  <LuUserRoundCog size={14} style={{ color: "#8b5cf6" }} />
                ) : (
                  <FiUser size={14} style={{ color: "#3b82f6" }} />
                )}
                <span>{child.authorName}</span>
              </div>
            </Td>
            <Td>
              <TypeBadge type={child.type as PostType}>
                {child.type === "GENERAL" ? "일반" : "질문"}
              </TypeBadge>
            </Td>
            <Td>
              <StatusBadge $priority={child.priority as PostPriority}>
                {POST_PRIORITY_LABELS[child.priority as PostPriority] ??
                  child.priority}
              </StatusBadge>
            </Td>
            <Td style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <FiCalendar size={14} style={{ color: "#8b5cf6" }} />
                {formatDate(child.createdAt)}
              </div>
            </Td>
          </Tr>
        );
      });
    });

    return result;
  };

  return (
    <Table>
      <Thead>
        <Tr>
          <Th style={{ width: "20%" }}>제목</Th>
          <Th style={{ width: "5%" }}></Th>
          <Th style={{ textAlign: "left", width: "5%" }}>작성자</Th>
          <Th style={{ width: "5%" }}>유형</Th>
          <Th style={{ width: "5%" }}>우선순위</Th>
          <Th style={{ textAlign: "center", width: "10%" }}>작성일</Th>
        </Tr>
      </Thead>
      <Tbody>
        {loading ? (
          <Tr>
            <Td colSpan={6}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 24px",
                  gap: "12px",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span>게시글을 불러오는 중...</span>
              </div>
            </Td>
          </Tr>
        ) : error ? (
          <Tr>
            <Td colSpan={6}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 24px",
                  color: "#ef4444",
                  fontSize: "14px",
                }}
              >
                <span>게시글을 불러오는데 실패했습니다: {error}</span>
              </div>
            </Td>
          </Tr>
        ) : posts.length === 0 ? (
          <Tr>
            <Td colSpan={6}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 24px",
                  color: "#9ca3af",
                  fontSize: "14px",
                }}
              >
                <span>게시글이 없습니다.</span>
              </div>
            </Td>
          </Tr>
        ) : (
          renderPosts(posts)
        )}
      </Tbody>
    </Table>
  );
};

export default ProjectBoardTable;
