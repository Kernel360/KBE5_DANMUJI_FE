import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Sidebar } from "./layouts/Sidebar";
import { Topbar } from "./layouts/Topbar";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import CompanyPage from "./features/company/pages/CompanyPage";
import MemberPage from "./features/user/pages/MemberPage";
import ProjectPage from "./features/project/pages/ProjectPage";
import DashboardPage2 from "./features/board/pages/DashboardPage";
import LoginPage from "./features/auth/pages/LoginPage";
import ProjectPostPage from "./features/project/pages/ProjectPostPage";
import { AppContainer, MainContent, PageContent } from "./App.styled";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/" || location.pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AppContainer>
      <Sidebar />
      <MainContent>
        <Topbar />
        <PageContent>{children}</PageContent>
      </MainContent>
    </AppContainer>
  );
};

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/members" element={<MemberPage />} />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/projects/posts" element={<ProjectPostPage />} />
          <Route path="/dashboard2" element={<DashboardPage2 />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
