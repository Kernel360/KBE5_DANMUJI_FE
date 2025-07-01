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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  FaUsers,
  FaBuilding,
  FaChartLine,
  FaChartPie,
  FaQuestionCircle,
} from "react-icons/fa";
import CompanyDetailModal from "@/features/company/components/CompanyDetailModal/CompanyDetailModal";

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

interface RecentInquiry {
  id: number;
  title: string;
  createdAt: string;
  inquiryStatus: string;
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
  innerRadius,
  outerRadius,
  name,
  value,
}: CustomLabelProps) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
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
    >
      {`${name}: ${value}`}
    </text>
  );
};

export default function DashboardPage() {
  const [companyCount, setCompanyCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [totalProjectCount, setTotalProjectCount] = useState(0);
  const [inProgressProjectCount, setInProgressProjectCount] = useState(0);
  const [completedProjectCount, setCompletedProjectCount] = useState(0);
  const [delayedProjectCount, setDelayedProjectCount] = useState(0);
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

  // 차트용 데이터
  const projectStatusData = [
    {
      name: "진행중",
      value: inProgressProjectCount,
      fill: "#dbeafe",
      stroke: "#3b82f6",
    },
    { name: "완료", value: 5, fill: "#d1fae5", stroke: "#10b981" },
    { name: "지연", value: 2, fill: "#fef3c7", stroke: "#f59e0b" },
    { name: "임박", value: 1, fill: "#fee2e2", stroke: "#ef4444" },
  ];

  const monthlyData = [
    { month: "1월", posts: 12, projects: 3 },
    { month: "2월", posts: 19, projects: 5 },
    { month: "3월", posts: 15, projects: 4 },
    { month: "4월", posts: 22, projects: 7 },
    { month: "5월", posts: 18, projects: 6 },
    { month: "6월", posts: 25, projects: 8 },
  ];

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Company Count
        const companyResponse = await api.get("/api/companies/all");
        const companies = companyResponse.data?.data || [];
        setCompanyCount(companies.length);

        // Fetch Member Count
        const memberResponse = await api.get("/api/admin/allUsers");
        const members = memberResponse.data?.data?.page?.totalElements || 0;
        setMemberCount(members);

        // Fetch Project Counts
        const projectCountsResponse = await api.get("/api/projects/all");
        const content = projectCountsResponse.data?.data || [];
        const total = content.length;
        const inProgressCount = content.filter(
          (p: { status: string }) => p.status === "IN_PROGRESS"
        ).length;
        const completedCount = content.filter(
          (p: { status: string }) => p.status === "COMPLETED"
        ).length;
        const delayedCount = content.filter(
          (p: { status: string }) => p.status === "DELAY"
        ).length;

        setTotalProjectCount(total);
        setInProgressProjectCount(inProgressCount);
        setCompletedProjectCount(completedCount);
        setDelayedProjectCount(delayedCount);

        // Fetch Recent Companies
        await fetchRecentCompanies();

        // Fetch Recent Projects
        const recentProjectsResponse = await api.get(
          "/api/projects/recent-projects"
        );
        setRecentProjects(recentProjectsResponse.data?.data || []);

        // Fetch Inquiry Count (실제 데이터)
        const inquiriesResponse = await api.get("/api/inquiries/all");
        const inquiries: RecentInquiry[] = inquiriesResponse.data?.data || [];
        setInquiryCount(inquiries.length);
        setWaitingInquiryCount(
          inquiries.filter((inq) => inq.inquiryStatus === "WAITING").length
        );
        setAnsweredInquiryCount(
          inquiries.filter((inq) => inq.inquiryStatus === "ANSWERED").length
        );

        // Fetch Recent Inquiries
        const sortedInquiries = [...inquiries].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentInquiries(sortedInquiries.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
  }, [fetchRecentCompanies]);

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
            background: "linear-gradient(135deg, #ffffff 0%, #fefdf4 100%)",
            cursor: "pointer",
          }}
          onClick={() => (window.location.href = "/members")}
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
                borderRadius: "10px",
                padding: "12px",
                marginRight: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaUsers />
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
            background: "linear-gradient(135deg, #ffffff 0%, #fefdf4 100%)",
            cursor: "pointer",
          }}
          onClick={() => (window.location.href = "/company")}
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
                borderRadius: "10px",
                padding: "12px",
                marginRight: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaBuilding />
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
            background: "linear-gradient(135deg, #ffffff 0%, #fefdf4 100%)",
            cursor: "pointer",
          }}
          onClick={() => (window.location.href = "/projects")}
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
              gap: "4px",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            <span>
              진행 중:{" "}
              <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                {inProgressProjectCount}
              </span>
            </span>
            <span>
              마감 임박:{" "}
              <span style={{ color: "#ef4444", fontWeight: 600 }}>2</span>
            </span>
            <span>
              지연:{" "}
              <span style={{ color: "#f59e0b", fontWeight: 600 }}>
                {delayedProjectCount}
              </span>
            </span>
            <span>
              완료:{" "}
              <span style={{ color: "#10b981", fontWeight: 600 }}>
                {completedProjectCount}
              </span>
            </span>
          </div>
        </RecentActivityCard>

        {/* 문의내역 통계 카드 */}
        <RecentActivityCard
          style={{
            padding: "24px",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #ffffff 0%, #fefdf4 100%)",
            cursor: "pointer",
          }}
          onClick={() => (window.location.href = "/inquiry")}
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
                borderRadius: "10px",
                padding: "12px",
                marginRight: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaQuestionCircle />
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
            <span>
              답변 대기:{" "}
              <span style={{ color: "#ef4444", fontWeight: 600 }}>
                {waitingInquiryCount}
              </span>
            </span>
            <span>
              답변 완료:{" "}
              <span style={{ color: "#10b981", fontWeight: 600 }}>
                {answeredInquiryCount}
              </span>
            </span>
          </div>
        </RecentActivityCard>
      </div>

      {/* 차트 섹션 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {/* 프로젝트 상태 분포 차트 */}
        <RecentActivityCard
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            background: "#ffffff",
            padding: "24px",
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
              marginBottom: "20px",
            }}
          >
            <FaChartPie style={{ color: "#fdb924" }} />
            프로젝트 상태 분포
          </RecentActivityTitle>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  label={CustomLabel}
                  stroke="#ffffff"
                  strokeWidth={1}
                  labelLine={false}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      stroke={entry.stroke}
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                  labelStyle={{
                    color: "#374151",
                    fontWeight: "600",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </RecentActivityCard>

        {/* 월별 활동 추이 차트 */}
        <RecentActivityCard
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            background: "#ffffff",
            padding: "24px",
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
              marginBottom: "20px",
            }}
          >
            <FaChartLine style={{ color: "#fdb924" }} />
            월별 활동 추이
          </RecentActivityTitle>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="posts"
                  fill="#fef3c7"
                  stroke="#fdb924"
                  strokeWidth={2}
                  name="게시물"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="projects"
                  fill="#dbeafe"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="프로젝트"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </RecentActivityCard>
      </div>

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
            <button
              style={{
                background: "#fdb924",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "6px 16px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={() => (window.location.href = "/admin/inquiries")}
            >
              더보기
            </button>
          </RecentActivityTitle>
          <RecentActivityList>
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry) => (
                <RecentActivityItem
                  key={inquiry.id}
                  style={{
                    padding: "8px 0",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#374151",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() =>
                      (window.location.href = `/inquiry/${inquiry.id}`)
                    }
                  >
                    {inquiry.title}
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
              <FaBuilding style={{ color: "#fdb924" }} />
              최근 등록된 업체
            </span>
            <button
              style={{
                background: "#fdb924",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "6px 16px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={() => (window.location.href = "/company")}
            >
              더보기
            </button>
          </RecentActivityTitle>
          <RecentActivityList>
            {recentCompanies.length > 0 ? (
              recentCompanies.slice(0, 5).map((company) => (
                <RecentActivityItem
                  key={company.id}
                  style={{
                    padding: "8px 0",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#374151",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => {
                      setSelectedCompanyId(company.id);
                      setCompanyDetailModalOpen(true);
                    }}
                  >
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
            <button
              style={{
                background: "#fdb924",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "6px 16px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={() => (window.location.href = "/projects")}
            >
              더보기
            </button>
          </RecentActivityTitle>
          <RecentActivityList>
            {recentProjects.length > 0 ? (
              recentProjects.slice(0, 5).map((project) => (
                <RecentActivityItem
                  key={project.id}
                  style={{
                    padding: "8px 0",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#374151",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() =>
                      (window.location.href = `/projects/${project.id}/detail`)
                    }
                  >
                    {project.name}
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
