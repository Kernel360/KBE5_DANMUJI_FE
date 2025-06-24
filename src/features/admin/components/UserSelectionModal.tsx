import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import api from "@/api/axios";
import type { User } from "@/features/admin/types/activityLog";

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
    onSelect(user);
    setUserSearchTerm("");
  };

  const handleClose = () => {
    setUserSearchTerm("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
          width: "400px",
          maxHeight: "500px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: "16px" }}>
          <h3
            style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}
          >
            사용자 선택
          </h3>
          <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
            변경한 사용자를 선택하세요
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="사용자명으로 검색..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
            <FiSearch
              size={16}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {userLoading ? (
            <div
              style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}
            >
              사용자 목록을 불러오는 중...
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserSelect(user)}
                style={{
                  padding: "12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  marginBottom: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
                <div>
                  <div style={{ fontWeight: "500", fontSize: "14px" }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    @{user.username}
                  </div>
                </div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                  {user.role === "ROLE_ADMIN"
                    ? "관리자"
                    : user.role === "ROLE_DEV"
                    ? "개발자"
                    : user.role === "ROLE_CLIENT"
                    ? "고객"
                    : "사용자"}
                </div>
              </div>
            ))
          ) : userSearchTerm ? (
            <div
              style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}
            >
              검색 결과가 없습니다.
            </div>
          ) : (
            <div
              style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}
            >
              사용자가 없습니다.
            </div>
          )}
        </div>

        <div style={{ marginTop: "16px", textAlign: "right" }}>
          <button
            onClick={handleClose}
            style={{
              padding: "8px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              backgroundColor: "white",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSelectionModal;
