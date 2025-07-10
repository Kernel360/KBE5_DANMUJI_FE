import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUserByUsername } from "@/features/user/services/userService";

// // UserSummaryResponse 타입을 직접 정의
// interface UserSummaryResponse {
//   id: number;
//   username: string;
//   name: string;
//   role: string;
//   position: string;
// }

interface UserProfileState {
  isOpen: boolean;
  username: string;
  userId?: number;
  position: { top: number; left: number } | null;
  userRole?: string;
  isAdmin?: boolean;
}

export const useUserProfile = () => {
  const navigate = useNavigate();
  const [profileState, setProfileState] = useState<UserProfileState>({
    isOpen: false,
    username: "",
    userId: undefined,
    position: null,
    userRole: undefined,
    isAdmin: false,
  });

  const openUserProfile = useCallback(
    async (event: React.MouseEvent, username: string, userId?: number) => {
      event.preventDefault();
      event.stopPropagation();

      const rect = event.currentTarget.getBoundingClientRect();
      const position = {
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX,
      };

      // 사용자 정보 가져오기
      let userRole = "사용자";
      let isAdmin = false;

      try {
        const response = await getUserByUsername(username);
        if (response.data) {
          const userInfo = response.data;

          // 백엔드 Role enum에 따른 역할 표시
          switch (userInfo.role) {
            case "ROLE_ADMIN":
              userRole = "관리자";
              isAdmin = true;
              break;
            case "ROLE_DEV":
              userRole = "개발자";
              break;
            case "ROLE_CLIENT":
              userRole = "고객";
              break;
            case "ROLE_USER":
            default:
              userRole = "사용자";
              break;
          }
        }
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
      }

      setProfileState({
        isOpen: true,
        username,
        userId,
        position,
        userRole,
        isAdmin,
      });
    },
    []
  );

  const closeUserProfile = useCallback(() => {
    setProfileState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const handleViewProfile = useCallback(
    (userId: number) => {
      // 프로필 보기 페이지로 이동
      navigate("/my");
    },
    [navigate]
  );

  const handleSendMessage = useCallback((userId: number) => {
    // 쪽지 보내기 로직 구현
    console.log("쪽지 보내기:", userId);
    // 예: openMessageModal(userId);
  }, []);

  const handleSendInquiry = useCallback((userId: number) => {
    // 문의하기 로직 구현
    console.log("문의하기:", userId);
    // 예: openInquiryModal(userId);
  }, []);

  return {
    profileState,
    openUserProfile,
    closeUserProfile,
    handleViewProfile,
    handleSendMessage,
    handleSendInquiry,
    setProfileState,
  };
};
