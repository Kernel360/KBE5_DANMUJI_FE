// src/layouts/AppLayout.tsx
import { useLocation } from "react-router-dom";
import { Sidebar } from "@/layouts/Sidebar";
import { Topbar } from "@/layouts/Topbar";
import Footer from "@/layouts/Footer/Footer";
import { AppContainer, MainContent, PageContent } from "@/App.styled";
import type { Notification } from "@/layouts/Topbar/Topbar.types";

interface Props {
  children: React.ReactNode;
  notifications: Notification[];
  markAsRead: (id: string) => void;
  error: string | null;
}

export default function AppLayout({ children, notifications, markAsRead, error }: Props) {
  const location = useLocation();
  const isAuthPage = ["/", "/login", "/forgot-password", "/reset-password"].includes(location.pathname);

  if (isAuthPage) return <>{children}</>;

  return (
    <AppContainer>
      <Sidebar />
      <MainContent>
        <Topbar notifications={notifications} markAsRead={markAsRead} error={error} />
        <PageContent>{children}</PageContent>
        <Footer />
      </MainContent>
    </AppContainer>
  );
}
