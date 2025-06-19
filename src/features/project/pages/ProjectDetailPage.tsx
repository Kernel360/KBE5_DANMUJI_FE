import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectHeader from "../components/Header/ProjectHeader";
import ProjectProgress from "../components/Progress/ProjectProgress";
import ProjectBoard from "../components/Board/ProjectBoard";
import {
  getProjectDetail,
  type ProjectDetailResponse,
} from "../services/projectService";
import styled from "styled-components";
// import ProjectMemberList from "../components/MemberList/ProjectMemberList";
// import ProjectFileList from '../components/FileList/ProjectFileList';

const DetailPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100vh;
  padding: 32px 32px;
`;

const PageTitle = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: -7px;
  padding-left: 16px;
  position: relative;
  color: #111827;

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

const PageDescription = styled.p`
  color: #bdbdbd;
  font-size: 0.9rem;
  margin-bottom: 18px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.1rem;
  color: #666;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.1rem;
  color: #ef4444;
`;

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [projectDetail, setProjectDetail] =
    useState<ProjectDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 프로젝트 상세 정보 가져오기
  const fetchProjectDetail = async () => {
    if (!projectId) {
      setError("프로젝트 ID가 없습니다.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getProjectDetail(parseInt(projectId));

      if (response.data) {
        setProjectDetail(response.data);
      }
    } catch (err) {
      console.error("프로젝트 상세 정보 불러오기 실패", err);
      setError("프로젝트 상세 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [projectId]);

  if (loading) {
    return (
      <DetailPageContainer>
        <PageTitle>프로젝트 상세</PageTitle>
        <PageDescription>
          프로젝트의 상세 정보와 진행 상황을 확인하세요.
        </PageDescription>
        <LoadingContainer>프로젝트 상세 정보를 불러오는 중...</LoadingContainer>
      </DetailPageContainer>
    );
  }

  if (error || !projectDetail) {
    return (
      <DetailPageContainer>
        <PageTitle>프로젝트 상세</PageTitle>
        <PageDescription>
          프로젝트의 상세 정보와 진행 상황을 확인하세요.
        </PageDescription>
        <ErrorContainer>
          {error || "프로젝트 정보를 찾을 수 없습니다."}
        </ErrorContainer>
      </DetailPageContainer>
    );
  }

  return (
    <DetailPageContainer>
      <PageTitle>{projectDetail.name}</PageTitle>
      <PageDescription>
        프로젝트의 상세 정보와 진행 상황을 확인하세요.
      </PageDescription>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          background: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <ProjectHeader projectDetail={projectDetail} />
        {/* <ProjectMemberList projectDetail={projectDetail} /> */}
        <ProjectProgress projectDetail={projectDetail} />
        <div style={{ display: "flex", gap: 24, padding: "0 24px 24px" }}>
          <div style={{ flex: 2 }}>
            <ProjectBoard projectDetail={projectDetail} />
            {/* <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <ProjectFileList />
                    </div> */}
          </div>
        </div>
      </div>
    </DetailPageContainer>
  );
};

export default ProjectDetailPage;
