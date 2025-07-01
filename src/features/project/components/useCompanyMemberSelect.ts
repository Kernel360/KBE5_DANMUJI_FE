import { useState } from "react";

type Company = { id: number; name: string } | null;
type Member = { id: number; name: string; position: string; type: "manager" | "member" }[];

type ModalType = "dev" | "client" | null;

export default function useCompanyMemberSelect() {
  const [showCompanyMemberModal, setShowCompanyMemberModal] = useState(false);
  const [editCompany, setEditCompany] = useState<Company>(null);
  const [editMembers, setEditMembers] = useState<Member>([]);
  const [modalType, setModalType] = useState<ModalType>(null);

  const openCompanyMemberModal = (type: "dev" | "client") => {
    setEditCompany(null);
    setEditMembers([]);
    setModalType(type);
    setShowCompanyMemberModal(true);
  };

  const closeCompanyMemberModal = () => {
    setShowCompanyMemberModal(false);
    setEditCompany(null);
    setEditMembers([]);
    setModalType(null);
  };

  return {
    showCompanyMemberModal,
    setShowCompanyMemberModal,
    editCompany,
    setEditCompany,
    editMembers,
    setEditMembers,
    modalType,
    openCompanyMemberModal,
    closeCompanyMemberModal,
  };
} 