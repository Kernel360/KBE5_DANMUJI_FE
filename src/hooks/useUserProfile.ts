import { useState, useCallback } from "react";

interface UserProfileState {
  isOpen: boolean;
  username: string;
  userId?: number;
  position: { top: number; left: number } | null;
}

export const useUserProfile = () => {
  const [profileState, setProfileState] = useState<UserProfileState>({
    isOpen: false,
    username: "",
    userId: undefined,
    position: null,
  });

  const openUserProfile = useCallback(
    (event: React.MouseEvent, username: string, userId?: number) => {
      event.preventDefault();
      event.stopPropagation();

      const rect = event.currentTarget.getBoundingClientRect();
      const position = {
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX,
      };

      setProfileState({
        isOpen: true,
        username,
        userId,
        position,
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

  const handleViewProfile = useCallback((userId: number) => {
    // 프로필 보기 로직 구현
    console.log("프로필 보기:", userId);
    // 예: navigate(`/user/${userId}`);
  }, []);

  const handleSendMessage = useCallback((userId: number) => {
    // 쪽지 보내기 로직 구현
    console.log("쪽지 보내기:", userId);
    // 예: openMessageModal(userId);
  }, []);

  return {
    profileState,
    openUserProfile,
    closeUserProfile,
    handleViewProfile,
    handleSendMessage,
  };
};
