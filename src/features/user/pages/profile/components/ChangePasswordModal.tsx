import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { CheckCircle, Circle } from "lucide-react";
import { showErrorToast, showSuccessToast, withErrorHandling } from "@/utils/errorHandler";
import { ModalOverlay, ModalContent, ModalHeader, ModalTitle, CloseButton, Form, Label, Input, Button } from "./ChangePasswordModel.styled";
import api from "@/api/axios";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const validatePassword = (value: string) => {
    if (value.length < 8) return "8자 이상 입력해주세요.";
    if (!/[A-Z]/.test(value)) return "대문자를 포함해야 합니다.";
    if (!/[0-9]/.test(value)) return "숫자를 포함해야 합니다.";
    return "";
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordError(validatePassword(value));
    setPasswordMismatch(newPasswordConfirm !== value);
  };
  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPasswordConfirm(value);
    setPasswordMismatch(newPassword !== value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validatePassword(newPassword);
    const mismatch = newPassword !== newPasswordConfirm;

    if (error || mismatch) {
      if (error) {
        setPasswordError(error);
      }
      if (mismatch) {
        showErrorToast("비밀번호가 일치하지 않습니다.");
        setPasswordMismatch(true);
      }
      return;
    }

    setLoading(true);
    await withErrorHandling(async () => {
      const res = await api.put("/api/users/password/change", {
        currentPassword,
        newPassword,
      });

      const isSuccess =
        (res.data.status && res.data.status.toLowerCase() === "ok") ||
        res.data.message?.includes("비밀번호 변경 완료");

      if (!isSuccess) {
        throw { response: { data: res.data } };
      }

      showSuccessToast("비밀번호가 성공적으로 변경되었습니다. 다시 로그인 해주세요.");
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      onClose();
    });
    setLoading(false);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>비밀번호 변경</ModalTitle>
          <CloseButton onClick={onClose} aria-label="닫기">
            <IoMdClose />
          </CloseButton>
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="currentPassword">현재 비밀번호</Label>
            <Input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="newPassword">새 비밀번호</Label>
            <Input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
              style={{ borderColor: passwordError ? "red" : undefined }}
            />
          </div>
          <div>
            <Label htmlFor="newPasswordConfirm">비밀번호 확인</Label>
            <Input
              type="password"
              id="newPasswordConfirm"
              value={newPasswordConfirm}
              onChange={handleConfirmChange}
              required
              style={{ borderColor: passwordMismatch && newPasswordConfirm.length > 0 ? "red" : undefined }}
            />
            {passwordMismatch && newPasswordConfirm.length > 0 && (
              <p style={{ color: "red", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                비밀번호가 일치하지 않습니다.
              </p>
            )}
            <PasswordRequirements password={newPassword} />
          </div>
          <Button type="submit" disabled={loading}>{loading ? "변경 중..." : "비밀번호 변경"}</Button>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}

const PasswordRequirements = ({ password }: { password: string }) => {
  const requirements = [
    { label: "최소 8자 이상", valid: password.length >= 8 },
    { label: "최소 1자의 대문자 사용", valid: /[A-Z]/.test(password) },
    { label: "최소 1자의 숫자 사용", valid: /[0-9]/.test(password) },
  ];
  return (
    <div style={{ marginTop: "0.5rem" }}>
      {requirements.map((req, idx) => (
        <div key={idx} style={{ display: "flex", alignItems: "center", color: req.valid ? "#111827" : "#9ca3af", fontSize: "0.8rem" }}>
          <span style={{ marginRight: "0.5rem", marginTop: "0.5rem" }}>
            {req.valid ? <CheckCircle size={16} color="#10b981" /> : <Circle size={16} color="#d1d5db" />}
          </span>
          {req.label}
        </div>
      ))}
    </div>
  );
}; 