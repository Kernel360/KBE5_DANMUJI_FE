import ProjectHeader from "../components/Header/ProjectHeader";
import ProjectProgress from "../components/Progress/ProjectProgress";
import ProjectBoard from "../components/Board/ProjectBoard";
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

const ProjectDetailPage = () => {
  return (
    <DetailPageContainer>
      <PageTitle>프로젝트 상세</PageTitle>
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
        <ProjectHeader />
        {/* <ProjectMemberList /> */}
        <ProjectProgress />
        <div style={{ display: "flex", gap: 24, padding: "0 24px 24px" }}>
          <div style={{ flex: 2 }}>
            <ProjectBoard />
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
