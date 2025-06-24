import React, { useState, useEffect } from "react";
import { FiSearch, FiCheck } from "react-icons/fi";
import api from "@/api/axios";
import type { User } from "@/features/admin/types/activityLog";
import {
  ModalOverlay,
  ClientModal,
  ModalHeader,
  ModalTitle,
  ModalSubtitle,
  ModalBody,
  SearchInputWrapper,
  ModalSearchInput,
  SearchIcon,
  ClientList,
  ClientItem,
  ClientInfo,
  ClientName,
  ClientDescription,
  CheckIcon,
  ModalFooter,
  ModalButton,
  NoResults,
  EmptyState,
} from "@/features/project/components/List/ProjectFilterBar.styled";

interface UserSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (user: User) => void;
}

const UserSelectionModal: React.FC<UserSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userLoading, setUserLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 사용자 목록 가져오기
  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      setUserLoading(true);
      try {
        const response = await api.get("/api/admin/allUsers");
        const userList = response.data.data.content || response.data.data || [];
        setUsers(userList);
      } catch (error) {
        console.error("사용자 목록을 불러오지 못했습니다:", error);
        setUsers([]);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen]);

  // 사용자 검색 필터링
  const filteredUsers = users.filter((user) => {
    if (!userSearchTerm) return true;
    const searchLower = userSearchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower)
    );
  });

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleConfirm = () => {
    if (selectedUser) {
      onSelect(selectedUser);
      setUserSearchTerm("");
      setSelectedUser(null);
    }
  };

  const handleClose = () => {
    setUserSearchTerm("");
    setSelectedUser(null);
    onClose();
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "ROLE_ADMIN":
        return "관리자";
      case "ROLE_DEV":
        return "개발자";
      case "ROLE_CLIENT":
        return "고객";
      default:
        return "사용자";
    }
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
      <ClientModal $isOpen={isOpen} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>사용자 선택</ModalTitle>
          <ModalSubtitle>변경한 사용자를 선택하세요</ModalSubtitle>
        </ModalHeader>

        <ModalBody>
          <SearchInputWrapper>
            <SearchIcon>
              <FiSearch size={16} />
            </SearchIcon>
            <ModalSearchInput
              type="text"
              placeholder="사용자명으로 검색..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
            />
          </SearchInputWrapper>

          <ClientList>
            {userLoading ? (
              <EmptyState>사용자 목록을 불러오는 중...</EmptyState>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <ClientItem
                  key={user.id}
                  $isSelected={selectedUser?.id === user.id}
                  onClick={() => handleUserSelect(user)}
                >
                  <ClientInfo>
                    <ClientName $isSelected={selectedUser?.id === user.id}>
                      {user.name}
                    </ClientName>
                    <ClientDescription
                      $isSelected={selectedUser?.id === user.id}
                    >
                      @{user.username} • {getRoleDisplayName(user.role)}
                    </ClientDescription>
                  </ClientInfo>
                  <CheckIcon $isSelected={selectedUser?.id === user.id}>
                    <FiCheck size={16} />
                  </CheckIcon>
                </ClientItem>
              ))
            ) : userSearchTerm ? (
              <NoResults>
                검색 결과가 없습니다.
                <br />
                다른 검색어를 입력해보세요.
              </NoResults>
            ) : (
              <EmptyState>사용자가 없습니다.</EmptyState>
            )}
          </ClientList>
        </ModalBody>

        <ModalFooter>
          <ModalButton onClick={handleClose}>취소</ModalButton>
          <ModalButton
            $primary
            onClick={handleConfirm}
            disabled={!selectedUser}
          >
            선택 완료
          </ModalButton>
        </ModalFooter>
      </ClientModal>
    </ModalOverlay>
  );
};

export default UserSelectionModal;
