import React, { useState, useEffect } from "react";
import api from "@/api/axios";
import CompanyMemberSelectModal from "./CompanyMemberSelectModal";
import useCompanyMemberSelect from "./useCompanyMemberSelect.ts";
import {
  ModalOverlay,
  ModalPanel,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  Input,
  TextArea,
  Button,
  CloseButton,
} from "./ProjectCreateModal.styled";
import type { ProjectDetailResponse } from "../services/projectService";

type Member = {
  id: number;
  name: string;
  position: string;
};

type SelectedDevCompany = {
  company: { id: number; name: string };
  members: {
    id: number;
    name: string;
    position: string;
    type: "manager" | "member";
  }[];
};

type SelectedClientCompany = {
  company: { id: number; name: string };
  members: {
    id: number;
    name: string;
    position: string;
    type: "manager" | "member";
  }[];
};

// 프로젝트 수정 폼 타입 정의
interface ProjectEditForm {
  name: string;
  description: string;
  projectCost: string;
  startDate: string;
  endDate: string;
  devManagerId: string;
  clientManagerId: string;
  devUserId: string;
  clientUserId: string;
}

interface ProjectCreateModalProps {
  open: boolean;
  onClose: () => void;
  fetchProjects?: (page?: number) => void;
  editMode?: boolean;
  projectData?: ProjectDetailResponse;
  onSave?: (form: ProjectEditForm) => void;
}

// 프로젝트 등록 모달 컴포넌트
export default function ProjectCreateModal({
  open,
  onClose,
  fetchProjects,
  editMode = false,
  projectData,
  onSave,
}: ProjectCreateModalProps) {
  const initialForm: ProjectEditForm = {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    devManagerId: "",
    clientManagerId: "",
    devUserId: "",
    clientUserId: "",
    projectCost: "",
  };
  const [form, setForm] = useState<ProjectEditForm>(initialForm);
  const {
    showCompanyMemberModal,
    setShowCompanyMemberModal,
    editCompany,
    setEditCompany,
    editMembers,
    setEditMembers,
    modalType,
    openCompanyMemberModal,
    closeCompanyMemberModal,
  } = useCompanyMemberSelect();
  const [selectedDevCompanies, setSelectedDevCompanies] = useState<
    SelectedDevCompany[]
  >([]);
  const [selectedClientCompanies, setSelectedClientCompanies] = useState<
    SelectedClientCompany[]
  >([]);

  // devManagerId, devUserId, clientManagerId, clientUserId 동기화
  useEffect(() => {
    const allDevMembers = selectedDevCompanies.flatMap((c) => c.members);
    const allClientMembers = selectedClientCompanies.flatMap((c) => c.members);
    setForm((f) => ({
      ...f,
      devManagerId: allDevMembers
        .filter((m) => m.type === "manager")
        .map((m) => m.id)
        .join(","),
      devUserId: allDevMembers.map((m) => m.id).join(","),
      clientManagerId: allClientMembers
        .filter((m) => m.type === "manager")
        .map((m) => m.id)
        .join(","),
      clientUserId: allClientMembers.map((m) => m.id).join(","),
    }));
  }, [selectedDevCompanies, selectedClientCompanies]);

  useEffect(() => {
    const allDevMembers = selectedDevCompanies.flatMap((c) => c.members);
    const allClientMembers = selectedClientCompanies.flatMap((c) => c.members);
  }, [selectedDevCompanies, selectedClientCompanies]);

  // editMode일 때 projectData로 form 초기화
  useEffect(() => {
    if (editMode && projectData) {
      setForm({
        name: projectData.name || "",
        description: projectData.description || "",
        startDate: projectData.startDate || "",
        endDate: projectData.endDate || "",
        devManagerId: projectData.devManagerId || "",
        clientManagerId: projectData.clientManagerId || "",
        devUserId: projectData.devUserId || "",
        clientUserId: projectData.clientUserId || "",
        projectCost: projectData.projectCost || "",
      });

      // clients 데이터 파싱하여 selectedClientCompanies 설정
      if (projectData.clients && Array.isArray(projectData.clients)) {
        const parsedClientCompanies: SelectedClientCompany[] =
          projectData.clients.map((client) => ({
            company: {
              id: client.id,
              name: client.companyName,
            },
            members: client.assignUsers.map((user) => ({
              id: user.id,
              name: user.name,
              type: user.userType === "MANAGER" ? "manager" : "member",
            })),
          }));
        setSelectedClientCompanies(parsedClientCompanies);
      }

      // developers 데이터 파싱하여 selectedDevCompanies 설정
      if (projectData.developers && Array.isArray(projectData.developers)) {
        const parsedDevCompanies: SelectedDevCompany[] =
          projectData.developers.map((developer) => ({
            company: {
              id: developer.id,
              name: developer.companyName,
            },
            members: developer.assignUsers.map((user) => ({
              id: user.id,
              name: user.name,
              type: user.userType === "MANAGER" ? "manager" : "member",
            })),
          }));
        setSelectedDevCompanies(parsedDevCompanies);
      }
    } else if (!editMode) {
      setForm(initialForm);
      setSelectedDevCompanies([]);
      setSelectedClientCompanies([]);
    }
  }, [editMode, projectData]);

  // 개발사 추가 모달에서 선택된 업체/멤버 반영
  const handleDevCompanyDone = (
    company: { id: number; name: string },
    members: {
      id: number;
      name: string;
      position: string;
      type: "manager" | "member";
    }[]
  ) => {
    setSelectedDevCompanies((prev) => {
      // 이미 등록된 업체면 덮어쓰기, 아니면 추가
      const exists = prev.find((c) => c.company.id === company.id);
      if (exists) {
        return prev.map((c) =>
          c.company.id === company.id ? { company, members } : c
        );
      } else {
        return [...prev, { company, members }];
      }
    });
    setShowCompanyMemberModal(false);
  };

  // 고객사 추가 모달에서 선택된 업체/멤버 반영
  const handleClientCompanyDone = (
    company: { id: number; name: string },
    members: {
      id: number;
      name: string;
      position: string;
      type: "manager" | "member";
    }[]
  ) => {
    setSelectedClientCompanies((prev) => {
      const exists = prev.find((c) => c.company.id === company.id);
      if (exists) {
        return prev.map((c) =>
          c.company.id === company.id ? { company, members } : c
        );
      } else {
        return [...prev, { company, members }];
      }
    });
    setShowCompanyMemberModal(false);
  };

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCreateProject = async () => {
    // 모든 필드 입력 체크
    if (
      !form.name ||
      !form.description ||
      !form.startDate ||
      !form.endDate ||
      selectedDevCompanies.length === 0 ||
      selectedClientCompanies.length === 0
    ) {
      alert("모든 필드를 입력하세요");
      return;
    }
    if (editMode && onSave) {
      onSave(form);
      return;
    }
    if (fetchProjects) {
      await handleCreateProjectOuter(form, onClose, fetchProjects);
    }
  };

  // 외부에서 전달된 handleCreateProjectOuter를 사용
  const handleCreateProjectOuter = async (
    form: ProjectEditForm,
    onClose: () => void,
    fetchProjects: (page?: number) => void
  ) => {
    try {
      const payload = {
        name: form.name,
        description: form.description,
        startDate: form.startDate,
        endDate: form.endDate,
        projectCost: form.projectCost ? Number(form.projectCost) : 0,
        devManagerId: form.devManagerId
          ? form.devManagerId
              .split(",")
              .map((s: string) => Number(s.trim()))
              .filter(Boolean)
          : [],
        clientManagerId: form.clientManagerId
          ? form.clientManagerId
              .split(",")
              .map((s: string) => Number(s.trim()))
              .filter(Boolean)
          : [],
        devUserId: form.devUserId
          ? form.devUserId
              .split(",")
              .map((s: string) => Number(s.trim()))
              .filter(Boolean)
          : [],
        clientUserId: form.clientUserId
          ? form.clientUserId
              .split(",")
              .map((s: string) => Number(s.trim()))
              .filter(Boolean)
          : [],
      };
      await api.post("/api/projects", payload);
      if (fetchProjects) fetchProjects(0);
      onClose();
    } catch (e) {
      alert("프로젝트 생성에 실패했습니다.");
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setSelectedDevCompanies([]);
    setSelectedClientCompanies([]);
    setEditCompany(null);
    setEditMembers([]);
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalPanel>
        <ModalHeader>
          <ModalTitle>
            {/* 아이콘 등 추가 가능 */}
            {editMode ? "프로젝트 수정" : "새 프로젝트 생성"}
          </ModalTitle>
        </ModalHeader>
        <ModalDescription>
          {editMode
            ? "프로젝트 정보를 수정해주세요"
            : "새로운 프로젝트의 정보를 입력해주세요"}
        </ModalDescription>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* 프로젝트명, 개요 */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>프로젝트명 *</div>
            <Input
              placeholder="프로젝트 이름을 입력하세요"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              maxLength={255}
            />
            <div style={{ fontWeight: 600, marginBottom: 8 }}>개요 *</div>
            <TextArea
              placeholder="프로젝트 개요를 상세히 입력하세요..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              maxLength={255}
            />
          </div>
          {/* 프로젝트 금액 */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              프로젝트 금액
            </div>
            <Input
              type="text"
              placeholder="프로젝트 금액을 입력하세요"
              value={Number(form.projectCost).toLocaleString()}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, "");
                if (!isNaN(Number(value))) {
                  setForm({ ...form, projectCost: value });
                }
              }}
              maxLength={20}
            />
          </div>
          {/* 프로젝트 기간 */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              프로젝트 기간 *
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 4 }}>시작일 *</div>
                <div
                  style={{ width: "100%" }}
                  onClick={(e) => {
                    const input = e.currentTarget.querySelector(
                      "input"
                    ) as HTMLInputElement;
                    if (input) input.showPicker && input.showPicker();
                  }}
                >
                  <Input
                    as="input"
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                        endDate: "",
                      }))
                    }
                  />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 4 }}>마감일 *</div>
                <div
                  style={{ width: "100%" }}
                  onClick={(e) => {
                    const input = e.currentTarget.querySelector(
                      "input"
                    ) as HTMLInputElement;
                    if (input) input.showPicker && input.showPicker();
                  }}
                >
                  <Input
                    as="input"
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                    min={form.startDate || undefined}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* 담당 정보 */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>담당 정보</div>
            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontWeight: 500 }}>개발사 선택 *</span>
                  <Button
                    style={{ marginLeft: 12 }}
                    $variant="primary"
                    type="button"
                    onClick={() => {
                      openCompanyMemberModal("dev", true);
                    }}
                  >
                    + 개발사 추가
                  </Button>
                </div>
                {/* 여러 개발사/멤버 표시 (이동) */}
                {selectedDevCompanies.map(({ company, members }) => (
                  <div
                    key={company.id}
                    style={{
                      marginBottom: 16,
                      background: "#f4f6fa",
                      borderRadius: 8,
                      padding: 16,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>
                        선택된 개발사: {company.name}
                      </div>
                      <Button
                        style={{ marginLeft: 8 }}
                        $variant="secondary"
                        type="button"
                        onClick={() => {
                          setEditCompany(company);
                          setEditMembers(members);
                          openCompanyMemberModal("dev", false);
                        }}
                      >
                        수정
                      </Button>
                      <Button
                        style={{
                          marginLeft: 8,
                          fontSize: 18,
                          background: "transparent",
                          color: "#888",
                        }}
                        $variant={undefined}
                        type="button"
                        onClick={() =>
                          setSelectedDevCompanies((prev) =>
                            prev.filter((c) => c.company.id !== company.id)
                          )
                        }
                        aria-label="삭제"
                      >
                        ×
                      </Button>
                    </div>
                    <div
                      style={{ marginTop: 8, color: "#555", fontWeight: 500 }}
                    >
                      선택된 멤버: {members.length}명
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontWeight: 500 }}>고객사 선택 *</span>
                  <Button
                    style={{ marginLeft: 12 }}
                    $variant="primary"
                    type="button"
                    onClick={() => {
                      openCompanyMemberModal("client", true);
                    }}
                  >
                    + 고객사 추가
                  </Button>
                </div>
                {/* 여러 고객사/멤버 표시 (이동) */}
                {selectedClientCompanies.map(({ company, members }) => (
                  <div
                    key={company.id}
                    style={{
                      marginBottom: 16,
                      background: "#eaf6ff",
                      borderRadius: 8,
                      padding: 16,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>
                        선택된 고객사: {company.name}
                      </div>
                      <Button
                        style={{ marginLeft: 8 }}
                        $variant="secondary"
                        type="button"
                        onClick={() => {
                          setEditCompany(company);
                          setEditMembers(members);
                          openCompanyMemberModal("client", false);
                        }}
                      >
                        수정
                      </Button>
                      <Button
                        style={{
                          marginLeft: 8,
                          fontSize: 18,
                          background: "transparent",
                          color: "#888",
                        }}
                        $variant={undefined}
                        type="button"
                        onClick={() =>
                          setSelectedClientCompanies((prev) =>
                            prev.filter((c) => c.company.id !== company.id)
                          )
                        }
                        aria-label="삭제"
                      >
                        ×
                      </Button>
                    </div>
                    <div
                      style={{ marginTop: 8, color: "#555", fontWeight: 500 }}
                    >
                      선택된 멤버: {members.length}명
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* 하단 버튼 */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 40,
          }}
        >
          <Button $variant={undefined} onClick={onClose}>
            취소
          </Button>
          <Button $variant="secondary" onClick={handleReset}>
            초기화
          </Button>
          <Button $variant="primary" onClick={handleCreateProject}>
            {editMode ? "편집" : "프로젝트 생성"}
          </Button>
        </div>
        {/* 닫기 버튼 (오른쪽 상단) */}
        <CloseButton onClick={onClose} aria-label="닫기">
          ×
        </CloseButton>
        {showCompanyMemberModal && (
          <CompanyMemberSelectModal
            onClose={closeCompanyMemberModal}
            onDone={
              modalType === "dev"
                ? handleDevCompanyDone
                : handleClientCompanyDone
            }
            selectedCompany={editCompany}
            selectedMembers={editMembers}
            selectedDevCompanies={selectedDevCompanies}
            selectedClientCompanies={selectedClientCompanies}
          />
        )}
      </ModalPanel>
    </ModalOverlay>
  );
}
