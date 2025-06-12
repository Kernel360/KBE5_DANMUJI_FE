import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

// contexts
import { AuthProvider, useAuth } from "@/contexts/AuthContexts";

// layout
import { Sidebar } from "./layouts/Sidebar";
import { Topbar } from "./layouts/Topbar";
import Footer from "./layouts/Footer/Footer";

// un authorization pages
import LoginPage from "./features/auth/pages/LoginPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";

// admin pages
import AdminDashboardPage from "./features/admin/pages/DashboardPage";
import CompanyPage from "./features/company/pages/CompanyPage";
import MemberPage from "./features/user/pages/MemberPage";
import AdminProjectPage from "./features/project/pages/AdminProjectPage";
import EditProjectPage from "./features/project/pages/EditProjectPage";

// user pages
import UserDashboardPage from "./features/board/pages/DashboardPage";
import PostListPage from "./features/board/pages/PostListPage";
// import PostEditPage from "./features/project/pages/PostEditPage";
// import PostCreatePage from "./features/project/pages/PostCreatePage";
import CreateProjectPage from "./features/project/pages/CreateProjectPage";
import UserProjectPage from "./features/project/pages/UserProjectPage";
import ProjectDetailPage from "./features/project/pages/ProjectDetailPage";
import CompletedProject from "./features/project/pages/CompletedProject";
import InProgressProject from "./features/project/pages/InProgressProject";

// etc
import { AppContainer, MainContent, PageContent } from "./App.styled";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  if (
    ["/", "/login", "/forgot-password", "/reset-password"].includes(
      location.pathname
    )
  ) {
    return <>{children}</>;
  }

  return (
    <AppContainer>
      <Sidebar />
      <MainContent>
        <Topbar />
        <PageContent>{children}</PageContent>
        <Footer />
      </MainContent>
    </AppContainer>
  );
};

// 라우트 구성 컴포넌트
const AppRoutes = () => {
  const { role } = useAuth();

  return (
    <Routes>
      {/* 루트 경로 처리: 로그인 여부에 따라 리디렉션 */}
      <Route
        path="/"
        element={
          role === "ROLE_ADMIN" ? (
            <Navigate to="/dashboard" replace />
          ) : role === "ROLE_USER" ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* 로그인 후 대시보드 라우팅 */}
      <Route
        path="/dashboard"
        element={
          role === "ROLE_ADMIN" ? (
            <AdminDashboardPage />
          ) : role === "ROLE_USER" ? (
            <UserDashboardPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* admin 전용 */}
      {role === "ROLE_ADMIN" && (
        <>
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/members" element={<MemberPage />} />
          <Route path="/projects/create" element={<CreateProjectPage />} />
          <Route path="/projects" element={<AdminProjectPage />} />
          <Route path="/projects/:projectId/edit" element={<EditProjectPage />} />
        </>
      )}

      {/* 공용 */}
      <Route path="/posts" element={<PostListPage />} />
      {/* <Route path="/posts/create" element={<PostCreatePage />} /> */}
      {/* <Route path="/posts/:postId/edit" element={<PostEditPage />} /> */}
      <Route path="/projects/all" element={<UserProjectPage />} />
      <Route
        path="/projects/:projectId/detail"
        element={<ProjectDetailPage />}
      />
      <Route path="/projects/completed" element={<CompletedProject />} />
      <Route path="/projects/active" element={<InProgressProject />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <LayoutWrapper>
          <AppRoutes />
          <Footer />
        </LayoutWrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;
