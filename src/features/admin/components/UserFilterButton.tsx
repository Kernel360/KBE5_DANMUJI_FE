import React from "react";
import { FiUser, FiSettings } from "react-icons/fi";
import { SelectButton } from "@/features/admin/pages/ActivityLogPage.styled";
import type { User } from "@/features/admin/types/activityLog";

interface UserFilterButtonProps {
  selectedUser: User | null;
  onOpenModal: () => void;
  onClear: () => void;
}

const UserFilterButton: React.FC<UserFilterButtonProps> = ({
  selectedUser,
  onOpenModal,
  onClear,
}) => {
  return (
    <div style={{ position: "relative" }}>
      <SelectButton
        type="button"
        onClick={onOpenModal}
        $hasValue={!!selectedUser}
        $color={selectedUser ? "#3b82f6" : "#6b7280"}
        style={{ width: "160px" }}
      >
        <FiUser size={16} />
        <span className="select-value">
          {selectedUser?.name || "사용자 선택"}
        </span>
        <FiSettings size={16} />
      </SelectButton>
      {selectedUser && (
        <button
          onClick={onClear}
          style={{
            position: "absolute",
            right: "-30px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#ef4444",
            fontSize: "12px",
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default UserFilterButton;
