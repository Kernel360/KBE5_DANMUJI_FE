import styled from "styled-components";

// 전체 컨테이너
export const Container = styled.div`
  padding: 32px;
  min-height: 100vh;
  background: #fafbfc;
`;

export const MainContent = styled.div`
  width: 100%;
`;

// 대시보드 헤더
export const DashboardHeader = styled.div`
  margin-bottom: 24px;
`;

export const DashboardTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  padding-left: 16px;
  position: relative;
  color: #222;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 1.4rem;
    background: #fdb924;
    border-radius: 2px;
  }
`;

export const DashboardDescription = styled.div`
  color: #bdbdbd;
  font-size: 0.9rem;
  margin-bottom: 18px;
  margin-left: 0px;
`;

// 레이아웃 구조
export const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: flex-start;
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 공통 섹션
export const Section = styled.section`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 28px 32px 24px;
  min-height: 400px;
`;

export const ProgressSectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
`;

export const ProgressSectionTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1abc7b;
`;

export const ViewAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #e6f9f0;
  border: none;
  color: #1abc7b;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: #1abc7b;
    color: #fff;

    svg {
      color: #fff;
    }
  }
`;

export const ViewAllButtonIcon = styled.span`
  display: flex;
  align-items: center;
  font-size: 1.15em;
  color: inherit;
`;

export const ProgressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 360px;
`;

export const ProgressListEmpty = styled.div`
  color: #bdbdbd;
  text-align: center;
  gap: 18px;
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProgressItem = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

export const ProgressLabel = styled.div`
  flex: 1.5;
  font-size: 1.05rem;
  color: #222;
`;

export const ProgressPercent = styled.div`
  width: 48px;
  font-size: 1.05rem;
  font-weight: 600;
  color: #1abc7b;
  text-align: right;
`;

export const ProgressBarWrap = styled.div`
  flex: 3;
  height: 8px;
  background: #f1f3f7;
  border-radius: 8px;
  overflow: hidden;
`;

export const ProgressBar = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: #1abc7b;
  border-radius: 8px;
  transition: width 0.4s;
`;

export const WarningProgressBar = styled.div<{
  $percent: number;
  $status: string;
}>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: ${({ $status }) =>
    $status === "DELAYED" ? "#dc2626" : "#f59e0b"};
  border-radius: 8px;
  transition: width 0.4s;
`;

// 언급된 게시글
export const MentionedSection = styled(Section)`
  padding-bottom: 18px;
`;

export const MentionedCard = styled.div<{ color: "yellow" | "blue" }>`
  background: ${({ color }) => (color === "yellow" ? "#fff9db" : "#e6f0fa")};
  border-radius: 10px;
  padding: 18px 18px 12px;
  margin-bottom: 12px;
`;

export const MentionedTitle = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 6px;
  color: #222;
`;

export const MentionedDesc = styled.div`
  font-size: 0.98rem;
  color: #444;
  margin-bottom: 8px;
`;

export const MentionedMeta = styled.div`
  font-size: 0.93rem;
  color: #8b95a1;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    font-size: 1.1rem;
  }
`;

// 우선순위 높은 게시글
export const PrioritySection = styled(Section)`
  background: #fff6f6;
  border: 1px solid #ffd6d6;
  padding-bottom: 14px;
`;

export const PriorityTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #e74c3c;
  margin-bottom: 14px;
`;

export const PriorityCard = styled.div`
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ffd6d6;
  padding: 12px;
  margin-bottom: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #fff9f9;
    border-color: #ffb3b3;
    box-shadow: 0 2px 8px rgba(255, 182, 182, 0.15);
    transform: translateY(-1px);
  }
`;

export const PriorityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

export const PriorityLabel = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: #e74c3c;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    font-size: 1.2rem;
  }
`;

export const PriorityTag = styled.div<{ type?: "yellow" }>`
  font-size: 0.93rem;
  font-weight: 600;
  color: ${({ type }) => (type === "yellow" ? "#ff9800" : "#fff")};
  background: ${({ type }) => (type === "yellow" ? "#fff3cd" : "#e74c3c")};
  border-radius: 8px;
  padding: 2px 10px;
`;

export const PriorityDesc = styled.div`
  font-size: 0.98rem;
  color: #444;
  margin-bottom: 8px;
`;

export const PriorityMeta = styled.div`
  font-size: 0.93rem;
  color: #8b95a1;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    font-size: 1rem;
    margin-right: 4px;
  }
`;

// 최신 게시글
export const LatestSection = styled(Section)`
  padding-bottom: 14px;
`;

export const LatestCard = styled.div`
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e6eaf3;
  padding: 12px;
  margin-bottom: 8px;
`;

export const LatestTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #222;
`;

export const LatestDesc = styled.div`
  font-size: 0.98rem;
  color: #444;
  margin-bottom: 8px;
`;

export const LatestMeta = styled.div`
  font-size: 0.93rem;
  color: #8b95a1;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    font-size: 1rem;
    margin-right: 4px;
  }
`;

export const LatestTag = styled.div<{ color: "blue" | "yellow" | "green" }>`
  font-size: 0.93rem;
  font-weight: 600;
  color: ${({ color }) =>
    color === "blue" ? "#1976d2" : color === "yellow" ? "#ff9800" : "#1abc7b"};
  background: ${({ color }) =>
    color === "blue" ? "#e3f0fd" : color === "yellow" ? "#fff3cd" : "#e6f9f0"};
  border-radius: 8px;
  padding: 2px 10px;
`;

export const SectionTitle = styled.div<{ color?: string }>`
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 18px;
  color: ${({ color }) => color || "#222"};
`;

// 프로젝트 카드 및 관련 컴포넌트
export const ProjectCard = styled.div`
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 10px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
    border-color: #3b82f6;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }
`;

export const ProjectHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const ProjectTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 6px;
  padding: 2px 8px;
  color: #fff;
  background: ${({ $status }) =>
    $status === "COMPLETED"
      ? "#10b981"
      : $status === "IN_PROGRESS"
      ? "#1abc7b"
      : $status === "DELAYED"
      ? "#e74c3c"
      : "#bdbdbd"};
`;

export const ProjectMeta = styled.div`
  display: flex;
  gap: 12px;
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.4;
`;

export const CompanyRow = styled.div`
  display: flex;
  gap: 18px;
  font-size: 0.97rem;
  color: #8b95a1;
`;

export const CompanyName = styled.span`
  color: #222;
  font-weight: 500;
`;

export const Divider = styled.div`
  height: 1px;
  background: #f1f3f7;
  margin: 10px 0 14px 0;
`;

// ViewAllButton은 그대로 두고, 주의 프로젝트 탭에만 적용할 새로운 스타일 추가
export const WarningTabButton = styled.button<{ $selected?: boolean }>`
  padding: 6px 16px;
  border: none;
  border-radius: 0;
  background: ${({ $selected }) => ($selected ? "#fff" : "#f4f6fa")};
  color: ${({ $selected }) => ($selected ? "#e74c3c" : "#bdbdbd")};
  font-weight: 600;
  font-size: 0.95rem;
  border-bottom: 2px solid
    ${({ $selected }) => ($selected ? "#e74c3c" : "transparent")};
  box-shadow: none;
  transition: background 0.2s, color 0.2s, border-bottom 0.2s;
  margin-bottom: -2px;
  cursor: pointer;
`;

// 프로젝트 상태 탭 버튼 (주의 프로젝트 탭과 완전히 동일하게)
export const ProjectStatusTabButton = styled.button<{ $selected?: boolean }>`
  padding: 6px 16px;
  border: none;
  border-radius: 0;
  background: ${({ $selected }) => ($selected ? "#fff" : "#f4f6fa")};
  color: ${({ $selected }) => ($selected ? "#1abc7b" : "#bdbdbd")};
  font-weight: 600;
  font-size: 0.95rem;
  border-bottom: 2px solid
    ${({ $selected }) => ($selected ? "#1abc7b" : "transparent")};
  box-shadow: none;
  transition: background 0.2s, color 0.2s, border-bottom 0.2s;
  margin-bottom: -2px;
  cursor: pointer;
`;

export const ProjectGoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #f4f6fa;
  color: #444;
  font-weight: 600;
  font-size: 0.97rem;
  padding: 4px 13px 4px 8px;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, border 0.18s,
    transform 0.12s;
  outline: none;

  &:hover,
  &:focus {
    background: #444;
    color: #fff;
    border: 1px solid #444;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.13);
    transform: translateY(-1px) scale(1.03);
  }
`;

export const ProjectGoButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
`;

export const ProjectProgressInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
  gap: 10px;
`;

export const ProjectProgressStep = styled.span`
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
`;

export const ProjectProgressPercent = styled.span<{ $percent: number }>`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ $percent }) =>
    $percent === 100 ? "#10b981" : $percent < 50 ? "#fdb924" : "#1abc7b"};
  min-width: 42px;
  text-align: right;
`;

export const ProjectDate = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 4px;
`;
