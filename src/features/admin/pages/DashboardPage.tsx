import React, { useState, useEffect, useCallback } from "react";
import api from "@/api/axios";
import {
  DashboardContainer,
  Header,
  Title,
  Description,
  RecentActivityContainer,
  RecentActivityCard,
  RecentActivityTitle,
  RecentActivityList,
  RecentActivityItem,
  RecentActivityDate,
} from "./DashboardPage.styled";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts";
import {
  FaUsers,
  FaBuilding,
  FaChartPie,
  FaQuestionCircle,
} from "react-icons/fa";
import {
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiAlertCircle,
  FiUsers,
  FiHome,
  FiHelpCircle,
  FiRotateCcw,
} from "react-icons/fi";
import CompanyDetailModal from "@/features/company/components/CompanyDetailModal/CompanyDetailModal";
import { useNavigate } from "react-router-dom";

// Define interfaces for new data types
interface RecentPost {
  id: number;
  title: string;
  createdAt: string;
}

interface RecentCompany {
  id: number;
  name: string;
  createdAt: string;
}

interface RecentProject {
  id: number;
  name: string;
  createdAt: string;
}

// 커스텀 라벨 컴포넌트
interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  name: string;
  value: number;
}

const CustomLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  value,
}: Omit<CustomLabelProps, "innerRadius">) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#374151"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{
        fontSize: "12px",
        fontWeight: "600",
        textShadow: "0 0 3px white, 0 0 3px white, 0 0 3px white",
      }}
      pointerEvents="none"
    >
      {`${name}: ${value}`}
    </text>
  );
};

// Define ProjectStatusKey
type ProjectStatusKey = "DUE_SOON" | "IN_PROGRESS" | "COMPLETED" | "DELAY";

// 프로젝트 리스트 아이템 타입
interface ProjectListItem {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

// 프로젝트 상태별 아이콘 반환 함수 (ProjectListPage와 동일하게)
const getStatusIcon = (status: string) => {
  switch (status) {
    case "IN_PROGRESS":
      return <FiClock size={15} style={{ marginRight: 6, color: "#3b82f6" }} />;
    case "COMPLETED":
      return (
        <FiCheckCircle size={15} style={{ marginRight: 6, color: "#10b981" }} />
      );
    case "DELAY":
      return (
        <FiAlertTriangle
          size={15}
          style={{ marginRight: 6, color: "#ef4444" }}
        />
      );
    case "DUE_SOON":
      return (
        <FiAlertCircle size={15} style={{ marginRight: 6, color: "#f59e0b" }} />
      );
    default:
      return null;
  }
};

export default function DashboardPage() {
  const [companyCount, setCompanyCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [totalProjectCount, setTotalProjectCount] = useState(0);
  const [inProgressProjectCount, setInProgressProjectCount] = useState(0);
  const [completedProjectCount, setCompletedProjectCount] = useState(0);
  const [delayedProjectCount, setDelayedProjectCount] = useState(0);
  const [dueSoonProjectCount, setDueSoonProjectCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);
  const [waitingInquiryCount, setWaitingInquiryCount] = useState(0);
  const [answeredInquiryCount, setAnsweredInquiryCount] = useState(0);
  const [recentCompanies, setRecentCompanies] = useState<RecentCompany[]>([]);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<RecentPost[]>([]);
  const [companyDetailModalOpen, setCompanyDetailModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] =
    useState<ProjectStatusKey>("DUE_SOON");
  const [projectList, setProjectList] = useState<ProjectListItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectListError, setProjectListError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();

  // 차트용 데이터
  const projectStatusData = [
    {
      name: "진행중",
      value: inProgressProjectCount,
      fill: "#dbeafe",
      stroke: "#3b82f6",
    },
    {
      name: "완료",
      value: completedProjectCount,
      fill: "#d1fae5",
      stroke: "#10b981",
    },
    {
      name: "마감임박",
      value: dueSoonProjectCount,
      fill: "#fef3c7",
      stroke: "#f59e0b",
    },
    {
      name: "지연",
      value: delayedProjectCount,
      fill: "#fee2e2",
      stroke: "#ef4444",
    },
  ];

  // 전체 프로젝트 수(퍼센티지 계산용)
  const totalForPercent =
    inProgressProjectCount +
    completedProjectCount +
    delayedProjectCount +
    dueSoonProjectCount;

  // 커스텀 툴팁
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { payload: { name: string; value: number } }[];
  }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      const percent =
        totalForPercent > 0 ? ((value / totalForPercent) * 100).toFixed(1) : 0;
      return (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "10px 16px",
            fontWeight: 600,
            fontSize: 14,
            color: "#374151",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          }}
        >
          <div>{name}</div>
          <div style={{ color: "#fdb924", fontWeight: 700 }}>
            {value.toLocaleString()}건
          </div>
          <div style={{ color: "#3b82f6", fontWeight: 600 }}>{percent}%</div>
        </div>
      );
    }
    return null;
  };

  // Pie의 activeShape(섹터 확대)
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;
    return (
      <g tabIndex={-1}>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="none" // 검은색 테두리 제거
          style={{ outline: "none" }} // outline도 제거
        />
      </g>
    );
  };

  // 최근 등록된 업체만 다시 불러오는 함수
  const fetchRecentCompanies = useCallback(async () => {
    try {
      const recentCompaniesResponse = await api.get(
        "/api/companies/recent-companies"
      );
      setRecentCompanies(recentCompaniesResponse.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch recent companies:", error);
    }
  }, []);

  // 프로젝트 리스트 fetch 함수
  const fetchProjectList = useCallback(async (status: ProjectStatusKey) => {
    setLoadingProjects(true);
    setProjectListError(null);
    try {
      const res = await api.get(`/api/projects/status?status=${status}`);
      setProjectList(res.data?.data || []);
    } catch {
      setProjectListError("프로젝트 목록을 불러오지 못했습니다.");
      setProjectList([]);
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  // 최근 문의사항 목록 새로고침 함수
  const fetchRecentInquiries = useCallback(async () => {
    try {
      const recentInquiriesResponse = await api.get(
        "/api/inquiries/recent-inquiries"
      );
      setRecentInquiries(recentInquiriesResponse.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch recent inquiries:", error);
    }
  }, []);

  // 최근 프로젝트 목록 새로고침 함수
  const fetchRecentProjects = useCallback(async () => {
    try {
      const recentProjectsResponse = await api.get(
        "/api/projects/recent-projects"
      );
      setRecentProjects(recentProjectsResponse.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch recent projects:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Company Count
        const companyResponse = await api.get("/api/companies/counts");
        const companies = companyResponse.data?.data || 0;
        setCompanyCount(companies);

        // Fetch Member Count
        const memberResponse = await api.get("/api/admin/counts");
        setMemberCount(memberResponse.data?.data || 0);

        // Fetch Project Counts
        const projectCountsResponse = await api.get(
          "/api/projects/status-count"
        );
        type ProjectStatusCount = {
          projectStatus: string;
          statusCount: number;
        };
        const content: ProjectStatusCount[] =
          projectCountsResponse.data?.data || [];
        const statusMap = content.reduce((acc, cur) => {
          acc[cur.projectStatus] = cur.statusCount;
          return acc;
        }, {} as Record<string, number>);
        setInProgressProjectCount(statusMap["IN_PROGRESS"] || 0);
        setCompletedProjectCount(statusMap["COMPLETED"] || 0);
        setDelayedProjectCount(statusMap["DELAY"] || 0);
        setDueSoonProjectCount(statusMap["DUE_SOON"] || 0);
        setTotalProjectCount(
          (statusMap["IN_PROGRESS"] || 0) +
            (statusMap["COMPLETED"] || 0) +
            (statusMap["DELAY"] || 0) +
            (statusMap["DUE_SOON"] || 0)
        );

        // Fetch Recent Companies
        await fetchRecentCompanies();

        // Fetch Recent Projects
        await fetchRecentProjects();

        // Fetch Inquiry Count (실제 데이터)
        const inquiriesResponse = await api.get("/api/inquiries/counts");
        const inquiryCounts = inquiriesResponse.data?.data || {
          total: 0,
          waitingCnt: 0,
          answeredCnt: 0,
        };
        setInquiryCount(inquiryCounts.total || 0);
        setWaitingInquiryCount(inquiryCounts.waitingCnt || 0);
        setAnsweredInquiryCount(inquiryCounts.answeredCnt || 0);

        // Fetch Recent Inquiries
        await fetchRecentInquiries();

        // Fetch Project List
        await fetchProjectList(selectedStatus);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
  }, [
    fetchRecentCompanies,
    fetchProjectList,
    fetchRecentInquiries,
    fetchRecentProjects,
  ]);

  // 최초 및 상태 변경 시 fetch
  useEffect(() => {
    fetchProjectList(selectedStatus);
  }, [selectedStatus, fetchProjectList]);

  return (
    <DashboardContainer>
      <Header>
        <Title>관리자 대시보드</Title>
        <Description>
          단무지 프로젝트 관리 시스템의 전체 현황을 확인하세요
        </Description>
      </Header>

      {/* 통계 카드 섹션 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {/* 회원 통계 카드 */}
        <RecentActivityCard
          style={{
            padding: "24px",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            background: "#ffffff",
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
          onClick={() => (window.location.href = "/members")}
          onMouseOver={(e) => (e.currentTarget.style.background = "#fffbe6")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#ffffff")}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                color: "#fdb924",
                background: "#fef3c7",
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                marginRight: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiUsers />
            </div>
            <div>
              <div
                style={{ fontWeight: 600, fontSize: "16px", color: "#374151" }}
              >
                총 회원 수
              </div>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                전체 가입 회원
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#fdb924",
              marginBottom: "8px",
            }}
          >
            {memberCount.toLocaleString()}
          </div>
        </RecentActivityCard>

        {/* 업체 통계 카드 */}
        <RecentActivityCard
          style={{
            padding: "24px",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            background: "#ffffff",
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
          onClick={() => (window.location.href = "/company")}
          onMouseOver={(e) => (e.currentTarget.style.background = "#fffbe6")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#ffffff")}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                color: "#fdb924",
                background: "#fef3c7",
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                marginRight: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiHome />
            </div>
            <div>
              <div
                style={{ fontWeight: 600, fontSize: "16px", color: "#374151" }}
              >
                총 업체 수
              </div>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                전체 등록 업체
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#fdb924",
              marginBottom: "8px",
            }}
          >
            {companyCount.toLocaleString()}
          </div>
        </RecentActivityCard>

        {/* 프로젝트 통계 카드 */}
        <RecentActivityCard
          style={{
            padding: "24px",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            background: "#ffffff",
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
          onClick={() => (window.location.href = "/projects")}
          onMouseOver={(e) => (e.currentTarget.style.background = "#fffbe6")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#ffffff")}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                color: "#fdb924",
                background: "#fef3c7",
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                marginRight: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiPackage />
            </div>
            <div>
              <div
                style={{ fontWeight: 600, fontSize: "16px", color: "#374151" }}
              >
                총 프로젝트 수
              </div>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                전체 등록 프로젝트
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#fdb924",
              marginBottom: "8px",
            }}
          >
            {totalProjectCount.toLocaleString()}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "8px",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {getStatusIcon("IN_PROGRESS")}
              진행 중:{" "}
              <span style={{ fontWeight: 600 }}>{inProgressProjectCount}</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {getStatusIcon("DUE_SOON")}
              마감 임박:{" "}
              <span style={{ fontWeight: 600 }}>{dueSoonProjectCount}</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {getStatusIcon("DELAY")}
              지연:{" "}
              <span style={{ fontWeight: 600 }}>{delayedProjectCount}</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {getStatusIcon("COMPLETED")}
              완료:{" "}
              <span style={{ fontWeight: 600 }}>{completedProjectCount}</span>
            </span>
          </div>
        </RecentActivityCard>

        {/* 문의내역 통계 카드 */}
        <RecentActivityCard
          style={{
            padding: "24px",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            background: "#ffffff",
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
          onClick={() => (window.location.href = "/inquiry")}
          onMouseOver={(e) => (e.currentTarget.style.background = "#fffbe6")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#ffffff")}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                color: "#fdb924",
                background: "#fef3c7",
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                marginRight: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiHelpCircle />
            </div>
            <div>
              <div
                style={{ fontWeight: 600, fontSize: "16px", color: "#374151" }}
              >
                총 문의내역
              </div>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                전체 문의 건수
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#fdb924",
              marginBottom: "8px",
            }}
          >
            {inquiryCount.toLocaleString()}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <FiAlertCircle size={15} style={{ color: "#ef4444" }} />
              답변 대기:{" "}
              <span style={{ fontWeight: 600 }}>{waitingInquiryCount}</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <FiCheckCircle size={15} style={{ color: "#10b981" }} />
              답변 완료:{" "}
              <span style={{ fontWeight: 600 }}>{answeredInquiryCount}</span>
            </span>
          </div>
        </RecentActivityCard>
      </div>

      {/* 차트 섹션 */}
      <RecentActivityCard
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          background: "#ffffff",
          padding: "24px",
          minHeight: 340,
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 32,
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {/* 프로젝트 상태 분포 */}
          <div style={{ flex: 1, minWidth: 320 }}>
            <RecentActivityTitle
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#374151",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "12px",
                marginBottom: "20px",
              }}
            >
              <FaChartPie style={{ color: "#fdb924" }} />
              프로젝트 상태 분포
            </RecentActivityTitle>
            <div style={{ height: "260px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart style={{ cursor: "pointer" }}>
                  <Pie
                    data={projectStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={100}
                    label={CustomLabel}
                    stroke="#ffffff"
                    strokeWidth={1}
                    labelLine={false}
                    isAnimationActive={false}
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    onMouseEnter={(_, idx) => setActiveIndex(idx)}
                    onMouseLeave={() => setActiveIndex(-1)}
                    onClick={(_, idx) => {
                      if (typeof idx === "number" && idx >= 0) {
                        const statusKey = [
                          "IN_PROGRESS",
                          "COMPLETED",
                          "DUE_SOON",
                          "DELAY",
                        ][idx] as ProjectStatusKey;
                        setSelectedStatus(statusKey);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        stroke={entry.stroke}
                        strokeWidth={1}
                        // onClick 제거, tabIndex/outine 스타일 제거
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={(props) => <CustomTooltip {...props} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* 오른쪽: 상태별 프로젝트 리스트 */}
          <div style={{ flex: 1, minWidth: 320 }}>
            <RecentActivityTitle
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#374151",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "12px",
                marginBottom: "20px",
              }}
            >
              {(() => {
                switch (selectedStatus) {
                  case "DUE_SOON":
                    return "마감 임박 프로젝트";
                  case "IN_PROGRESS":
                    return "진행중 프로젝트";
                  case "COMPLETED":
                    return "완료 프로젝트";
                  case "DELAY":
                    return "지연 프로젝트";
                  default:
                    return "프로젝트 리스트";
                }
              })()}
            </RecentActivityTitle>
            <div style={{ height: 260, overflow: "auto" }}>
              {loadingProjects ? (
                <div style={{ textAlign: "center", padding: 12 }}>
                  로딩중...
                </div>
              ) : projectListError ? (
                <div
                  style={{ textAlign: "center", color: "#ef4444", padding: 12 }}
                >
                  {projectListError}
                </div>
              ) : projectList.length === 0 ? (
                <div
                  style={{ textAlign: "center", color: "#aaa", padding: 12 }}
                >
                  프로젝트가 없습니다.
                </div>
              ) : (
                projectList.map((project) => (
                  <RecentActivityItem
                    key={project.id}
                    style={{
                      padding: "12px 0",
                      borderBottom: "1px solid #f3f4f6",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onClick={() => navigate(`/projects/${project.id}/detail`)}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#f9fafb")
                    }
                    onMouseOut={(e) => (e.currentTarget.style.background = "")}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#374151",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      {getStatusIcon(selectedStatus)}
                      {project.name.length > 25
                        ? project.name.slice(0, 25) + "..."
                        : project.name}
                    </span>
                    <span
                      style={{ fontSize: "13px", color: "#888", marginTop: 2 }}
                    >
                      {project.startDate} ~ {project.endDate}
                    </span>
                  </RecentActivityItem>
                ))
              )}
            </div>
          </div>
        </div>
      </RecentActivityCard>

      {/* 최근 활동 섹션 */}
      <RecentActivityContainer>
        {/* 최근 등록된 문의사항 */}
        <RecentActivityCard
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            background: "#ffffff",
          }}
        >
          <RecentActivityTitle
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#374151",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "12px",
              marginBottom: "16px",
              justifyContent: "space-between",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FaQuestionCircle style={{ color: "#fdb924" }} />
              최근 등록된 문의사항
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                style={{
                  background: "#fff",
                  color: "#fdb924",
                  border: "1px solid #fdb924",
                  borderRadius: "6px",
                  padding: "6px 16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.18s",
                  marginRight: "6px",
                }}
                onClick={() => (window.location.href = "/inquiry")}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#fdb924";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.color = "#fdb924";
                }}
              >
                전체보기
              </button>
              <button
                style={{
                  background: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px",
                  cursor: "pointer",
                  transition: "background 0.18s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="목록 새로고침"
                onClick={fetchRecentInquiries}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#f3f4f6")
                }
                onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
              >
                <FiRotateCcw size={18} color="#fdb924" />
              </button>
            </div>
          </RecentActivityTitle>
          <RecentActivityList>
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry) => (
                <RecentActivityItem
                  key={inquiry.id}
                  style={{
                    padding: "8px 0",
                    borderBottom: "1px solid #f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onClick={() =>
                    (window.location.href = `/inquiry/${inquiry.id}`)
                  }
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#f9fafb")
                  }
                  onMouseOut={(e) => (e.currentTarget.style.background = "")}
                >
                  <span style={{ fontSize: "14px", color: "#374151" }}>
                    {inquiry.title.length > 25
                      ? inquiry.title.slice(0, 25) + "..."
                      : inquiry.title}
                  </span>
                  <RecentActivityDate style={{ fontSize: "12px" }}>
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </RecentActivityDate>
                </RecentActivityItem>
              ))
            ) : (
              <RecentActivityItem style={{ padding: "8px 0" }}>
                <span style={{ fontSize: "14px", color: "#6b7280" }}>
                  문의사항이 없습니다.
                </span>
              </RecentActivityItem>
            )}
          </RecentActivityList>
        </RecentActivityCard>

        {/* 최근 등록된 업체 */}
        <RecentActivityCard
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            background: "#ffffff",
          }}
        >
          <RecentActivityTitle
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#374151",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "12px",
              marginBottom: "16px",
              justifyContent: "space-between",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FiHome style={{ color: "#fdb924" }} />
              최근 등록된 업체
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                style={{
                  background: "#fff",
                  color: "#fdb924",
                  border: "1px solid #fdb924",
                  borderRadius: "6px",
                  padding: "6px 16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.18s",
                  marginRight: "6px",
                }}
                onClick={() => (window.location.href = "/company")}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#fdb924";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.color = "#fdb924";
                }}
              >
                전체보기
              </button>
              <button
                style={{
                  background: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px",
                  cursor: "pointer",
                  transition: "background 0.18s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="목록 새로고침"
                onClick={fetchRecentCompanies}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#f3f4f6")
                }
                onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
              >
                <FiRotateCcw size={18} color="#fdb924" />
              </button>
            </div>
          </RecentActivityTitle>
          <RecentActivityList>
            {recentCompanies.length > 0 ? (
              recentCompanies.slice(0, 5).map((company) => (
                <RecentActivityItem
                  key={company.id}
                  style={{
                    padding: "8px 0",
                    borderBottom: "1px solid #f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onClick={() => {
                    setSelectedCompanyId(company.id);
                    setCompanyDetailModalOpen(true);
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#f9fafb")
                  }
                  onMouseOut={(e) => (e.currentTarget.style.background = "")}
                >
                  <span style={{ fontSize: "14px", color: "#374151" }}>
                    {company.name}
                  </span>
                  <RecentActivityDate style={{ fontSize: "12px" }}>
                    {new Date(company.createdAt).toLocaleDateString()}
                  </RecentActivityDate>
                </RecentActivityItem>
              ))
            ) : (
              <RecentActivityItem style={{ padding: "8px 0" }}>
                <span style={{ fontSize: "14px", color: "#6b7280" }}>
                  업체가 없습니다.
                </span>
              </RecentActivityItem>
            )}
          </RecentActivityList>
          <CompanyDetailModal
            open={companyDetailModalOpen}
            onClose={() => {
              setCompanyDetailModalOpen(false);
              fetchRecentCompanies();
            }}
            companyId={selectedCompanyId}
            onUpdated={fetchRecentCompanies}
          />
        </RecentActivityCard>

        {/* 최근 등록된 프로젝트 */}
        <RecentActivityCard
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            background: "#ffffff",
          }}
        >
          <RecentActivityTitle
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#374151",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "12px",
              marginBottom: "16px",
              justifyContent: "space-between",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FiPackage style={{ color: "#fdb924" }} />
              최근 등록된 프로젝트
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                style={{
                  background: "#fff",
                  color: "#fdb924",
                  border: "1px solid #fdb924",
                  borderRadius: "6px",
                  padding: "6px 16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.18s",
                  marginRight: "6px",
                }}
                onClick={() => (window.location.href = "/projects")}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#fdb924";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.color = "#fdb924";
                }}
              >
                전체보기
              </button>
              <button
                style={{
                  background: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px",
                  cursor: "pointer",
                  transition: "background 0.18s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="목록 새로고침"
                onClick={fetchRecentProjects}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#f3f4f6")
                }
                onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
              >
                <FiRotateCcw size={18} color="#fdb924" />
              </button>
            </div>
          </RecentActivityTitle>
          <RecentActivityList>
            {recentProjects.length > 0 ? (
              recentProjects.slice(0, 5).map((project) => (
                <RecentActivityItem
                  key={project.id}
                  style={{
                    padding: "8px 0",
                    borderBottom: "1px solid #f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onClick={() => navigate(`/projects/${project.id}/detail`)}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#f9fafb")
                  }
                  onMouseOut={(e) => (e.currentTarget.style.background = "")}
                >
                  <span style={{ fontSize: "14px", color: "#374151" }}>
                    {project.name.length > 25
                      ? project.name.slice(0, 25) + "..."
                      : project.name}
                  </span>
                  <RecentActivityDate style={{ fontSize: "12px" }}>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </RecentActivityDate>
                </RecentActivityItem>
              ))
            ) : (
              <RecentActivityItem style={{ padding: "8px 0" }}>
                <span style={{ fontSize: "14px", color: "#6b7280" }}>
                  프로젝트가 없습니다.
                </span>
              </RecentActivityItem>
            )}
          </RecentActivityList>
        </RecentActivityCard>
      </RecentActivityContainer>
    </DashboardContainer>
  );
}
