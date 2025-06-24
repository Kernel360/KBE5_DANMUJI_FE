// src/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// pages
import LoginPage from "@/features/auth/pages/LoginPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";

// dashboard
import AdminDashboardPage from "@/features/admin/pages/DashboardPage";
// import UserDashboardPage from "@/features/board/pages/DashboardPage";
import UserDashboardPage from "@/features/user/pages/dashboard/UserDashboardPage";

// project

// company
import CompanyPage from "@/features/company/pages/CompanyPage";

// member
import MemberPage from "@/features/user/pages/MemberPage";
import MemberDetailPage from "@/features/user/pages/MemberDetailPage"; // todo : 삭제 예정
import UserProfilePage from "@/features/user/pages/profile/UserProfilePage"; // todo : 이걸로 변경

import PostListPage from "@/features/board/components/Post/pages/PostListPage";

import ProjectDetailPage from "@/features/project/pages/ProjectDetailPage";
import ProjectListPage from "@/features/project/pages/ProjectListPage";

// project-d
// import EditProjectPage from "@/features/project-d/pages/EditProjectPage";
// import AdminProjectPage from "@/features/project-d/pages/AdminProjectPage";
// import CreateProjectPage from "@/features/project-d/pages/CreateProjectPage";
// import ProjectDetailPage from "@/features/project-d/pages/ProjectDetailPage";
// import CompletedProject from "@/features/project-d/pages/CompletedProject";
// import InProgressProject from "@/features/project-d/pages/InProgressProject";
// import MemberProjectPage from "@/features/project-d/pages/MemberProjectPage";

const AppRoutes = () => {
  const { role } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          role === null ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/dashboard"
        element={
          role === "ROLE_ADMIN" ? (
            <AdminDashboardPage />
          ) : role === "ROLE_USER" ||
            role === "ROLE_MANAGER" ||
            role === "ROLE_DEV" ||
            role === "ROLE_CLIENT" ? (
            <UserDashboardPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 관리자 전용 */}
      {role === "ROLE_ADMIN" && (
        <>
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/members" element={<MemberPage />} />
          <Route path="/member/:id" element={<MemberDetailPage />} />
          {/* <Route path="/projects/create" element={<CreateProjectPage />} /> */}
          {/* <Route
            path="/projects/:projectId/edit"
            element={<EditProjectPage />}
          />
          <Route path="/projects" element={<AdminProjectPage />} /> */}
        </>
      )}

      {/* 공용 페이지 */}
      <Route path="/posts/:stepId" element={<PostListPage />} />
      {/* <Route path="/projects/all" element={<MemberProjectPage />} /> */}
      <Route
        path="/projects/:projectId/detail"
        element={<ProjectDetailPage />}
      />
      <Route path="/projects" element={<ProjectListPage />} />
      {/* <Route path="/projects/completed" element={<CompletedProject />} />
      <Route path="/projects/inprogress" element={<InProgressProject />} />
      <Route path="/projects/active" element={<InProgressProject />} /> */}
      <Route path="/my" element={<UserProfilePage />} />
    </Routes>
  );
};

export default AppRoutes;
