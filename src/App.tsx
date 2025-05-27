import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import styled from "styled-components";
import { Sidebar } from "./layouts/Sidebar";
import { Topbar } from "./layouts/Topbar";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import CompanyPage from "./features/company/pages/CompanyPage";
import MemberPage from "./features/user/pages/MemberPage";
import ProjectPage from "./features/project/pages/ProjectPage";
import BoardPage from "./features/board/pages/BoardPage";
import LoginPage from "./features/auth/pages/LoginPage";

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f9fafb;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PageContent = styled.div`
  flex: 1;
  padding: 32px;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Sidebar />
        <MainContent>
          <Topbar />
          <PageContent>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/company" element={<CompanyPage />} />
              <Route path="/members" element={<MemberPage />} />
              <Route path="/projects" element={<ProjectPage />} />
              <Route path="/dashboard2" element={<BoardPage />} />
            </Routes>
          </PageContent>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;
