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

// admin pages
import AdminDashboardPage from "./features/admin/pages/DashboardPage";
import CompanyPage from "./features/company/pages/CompanyPage";
import MemberPage from "./features/user/pages/MemberPage";
import AdminMainPage from "./features/project/pages/AdminMainPage";

// user pages
import UserDashboardPage from "./features/board/pages/DashboardPage";
import PostListPage from "./features/board/pages/PostListPage";
import PostEditPage from "./features/project/pages/PostEditPage";
import PostCreatePage from "./features/project/pages/PostCreatePage";

// etc
import { AppContainer, MainContent, PageContent } from "./App.styled";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  if (["/", "/login", "/forgot-password"].includes(location.pathname)) {
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
          <Route path="/projects" element={<AdminMainPage />} />
        </>
      )}

      {/* 공용 */}
      <Route path="/posts" element={<PostListPage />} />
      <Route path="/posts/create" element={<PostCreatePage />} />
      <Route path="/posts/:postId/edit" element={<PostEditPage />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <LayoutWrapper>
          <AppRoutes />
        </LayoutWrapper>
        {/* <Footer /> */}
      </Router>
    </AuthProvider>
  );
}

export default App;
