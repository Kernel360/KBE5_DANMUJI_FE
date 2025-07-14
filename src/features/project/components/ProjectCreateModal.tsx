import React, { useState, useEffect } from "react";
import api from "@/api/axios";
import CompanyMemberSelectModal from "./CompanyMemberSelectModal";
import useCompanyMemberSelect from "./useCompanyMemberSelect.ts";
import { SiGoogledocs } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import { IoCalendarNumber, IoClose, IoPerson } from "react-icons/io5";
import { MdPeople } from "react-icons/md";
import { HiBuildingOffice2 } from "react-icons/hi2";
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
  SectionTitle,
  FieldLabel,
  CompanyRow,
  CompanyCard,
  CompanyCardHeader,
  CompanyCardTitle,
  CompanyCardMembers,
  DateButton,
  DateSeparator,
  DatePickerWrapper,
  CompanySectionLabel,
  AddCompanyButton,
  EditButton,
  DeleteButton,
  ProjectCreateButton,
  CancelButton,
  ButtonGroup,
} from "./ProjectCreateModal.styled";
import type { ProjectDetailResponse } from "../services/projectService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaArchive } from "react-icons/fa";
import {
  FiFileText,
  FiCalendar,
  FiAlignLeft,
  FiUsers,
  FiBriefcase,
  FiPlus,
  FiUser,
  FiUserCheck,
} from "react-icons/fi";
import { TbMoneybag, TbUserCode } from "react-icons/tb";
import { RiUserSettingsLine } from "react-icons/ri";

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

// 날짜 문자열 <-> Date 객체 변환 함수
function parseDate(str?: string) {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}
function formatDate(date?: string | Date | null) {
  if (!date) return "";
  const d = typeof date === "string" ? parseDate(date) : date;
  if (!d) return "";
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// 날짜를 YYYY-MM-DD로 변환 (로컬 기준)
function toDateStringLocal(date: Date | null) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

  // DatePicker 팝업 상태
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const handleStartDateClick = () => setStartDateOpen((v) => !v);
  const handleEndDateClick = () => setEndDateOpen((v) => !v);
  const handleStartDateChange = (date: Date | null) => {
    setForm((prev) => ({
      ...prev,
      startDate: date ? toDateStringLocal(date) : "",
      endDate: "", // 시작일 바뀌면 마감일 초기화
    }));
    setStartDateOpen(false);
  };
  const handleEndDateChange = (date: Date | null) => {
    setForm((prev) => ({
      ...prev,
      endDate: date ? toDateStringLocal(date) : "",
    }));
    setEndDateOpen(false);
  };

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
              userCount: 0,
            },
            members: client.assignUsers.map((user) => ({
              id: user.id,
              name: user.name,
              position: user.positon,
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
              userCount: 0,
            },
            members: developer.assignUsers.map((user) => ({
              id: user.id,
              name: user.name,
              position: user.positon,
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
            {editMode ? "프로젝트 수정" : "새 프로젝트 생성"}
          </ModalTitle>
        </ModalHeader>
        <ModalDescription>
          {editMode
            ? "프로젝트 정보를 수정해주세요"
            : "새로운 프로젝트의 정보를 입력해주세요"}
        </ModalDescription>
        <SectionTitle
          as="div"
          style={{ fontWeight: 400, marginBottom: 0, gap: 0 }}
        />
        <div>
          {/* 프로젝트명, 개요 */}
          <FieldLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FiFileText size={18} color="#fdb924" style={{ flexShrink: 0 }} />
              <span>프로젝트명</span>
            </div>
          </FieldLabel>
          <Input
            placeholder="프로젝트 이름을 입력하세요"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            maxLength={255}
          />
          <FieldLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FiAlignLeft
                size={18}
                color="#fdb924"
                style={{ flexShrink: 0 }}
              />
              <span>개요</span>
            </div>
          </FieldLabel>
          <TextArea
            placeholder="프로젝트 개요를 상세히 입력하세요"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            maxLength={255}
          />
        </div>
        {/* 프로젝트 예산 */}
        <div>
          <FieldLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <TbMoneybag size={18} color="#fdb924" style={{ flexShrink: 0 }} />
              <span>프로젝트 예산</span>
            </div>
          </FieldLabel>
          <Input
            type="text"
            placeholder="프로젝트 예산을 입력하세요"
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
          <FieldLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FiCalendar size={18} color="#fdb924" style={{ flexShrink: 0 }} />
              <span>프로젝트 기간</span>
            </div>
          </FieldLabel>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <DateButton
                type="button"
                onClick={handleStartDateClick}
                $hasValue={!!form.startDate}
              >
                <span>시작일</span>
                <span className="date-value">{formatDate(form.startDate)}</span>
              </DateButton>
              {startDateOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    zIndex: 1000,
                    marginTop: 4,
                  }}
                >
                  <DatePicker
                    selected={form.startDate ? parseDate(form.startDate) : null}
                    onChange={handleStartDateChange}
                    selectsStart
                    startDate={
                      form.startDate ? parseDate(form.startDate) : null
                    }
                    endDate={form.endDate ? parseDate(form.endDate) : null}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="시작일 선택"
                    inline
                    onClickOutside={() => setStartDateOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setStartDateOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
            <DateSeparator>~</DateSeparator>
            <div style={{ flex: 1, position: "relative" }}>
              <DateButton
                type="button"
                onClick={handleEndDateClick}
                $hasValue={!!form.endDate}
              >
                <span>종료일</span>
                <span className="date-value">{formatDate(form.endDate)}</span>
              </DateButton>
              {endDateOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    zIndex: 1000,
                    marginTop: 4,
                  }}
                >
                  <DatePicker
                    selected={form.endDate ? parseDate(form.endDate) : null}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={
                      form.startDate ? parseDate(form.startDate) : null
                    }
                    endDate={form.endDate ? parseDate(form.endDate) : null}
                    minDate={
                      form.startDate ? parseDate(form.startDate) : undefined
                    }
                    dateFormat="yyyy-MM-dd"
                    placeholderText="종료일 선택"
                    inline
                    onClickOutside={() => setEndDateOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setEndDateOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* 개발사/고객사 선택을 한 줄에 가로배치 */}
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
            marginTop: 18,
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ minHeight: 32 }}>
              <FieldLabel>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    minHeight: 32,
                  }}
                >
                  <FiUsers
                    size={18}
                    color="#fdb924"
                    style={{ flexShrink: 0 }}
                  />
                  <span>개발사 선택</span>
                  <Button
                    $variant="primary"
                    onClick={() => openCompanyMemberModal("dev")}
                    style={{
                      padding: "4px 8px",
                      fontSize: 13,
                      minWidth: 0,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: 8,
                    }}
                  >
                    <FiPlus size={16} />
                  </Button>
                </div>
              </FieldLabel>
            </div>
            <CompanyRow>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {selectedDevCompanies.length === 0 && (
                  <span style={{ color: "#aaa", fontSize: 13 }}>
                    개발사를 추가하세요
                  </span>
                )}
                {selectedDevCompanies.map((dev) => (
                  <CompanyCard key={dev.company.id}>
                    <CompanyCardHeader>
                      <CompanyCardTitle>
                        {/* 개발사 업체 아이콘 */}
                        <FiUsers
                          size={15}
                          style={{ marginRight: 4, color: "#3b82f6" }}
                        />
                        {dev.company.name}
                      </CompanyCardTitle>
                    </CompanyCardHeader>
                    <CompanyCardMembers>
                      {dev.members.map((m) => (
                        <span
                          key={m.id}
                          style={{
                            marginRight: 8,
                            display: "inline-flex",
                            alignItems: "center",
                            fontSize: 13,
                          }}
                        >
                          {m.type === "admin" ? (
                            <RiUserSettingsLine
                              size={14}
                              style={{ color: "#8b5cf6", marginRight: 2 }}
                            />
                          ) : m.type === "manager" ? (
                            <FiUserCheck
                              size={14}
                              style={{ color: "#ec4899", marginRight: 2 }}
                            />
                          ) : m.type === "dev_employee" ? (
                            <TbUserCode
                              size={14}
                              style={{ color: "#3b82f6", marginRight: 2 }}
                            />
                          ) : (
                            <FiUser
                              size={14}
                              style={{ color: "#6b7280", marginRight: 2 }}
                            />
                          )}
                          {m.name}({m.position})
                          {m.type === "manager" && (
                            <span
                              style={{
                                color: "#ec4899",
                                fontWeight: 600,
                                marginLeft: 3,
                              }}
                            >
                              담당자
                            </span>
                          )}
                        </span>
                      ))}
                    </CompanyCardMembers>
                  </CompanyCard>
                ))}
              </div>
            </CompanyRow>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ minHeight: 32 }}>
              <FieldLabel>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    minHeight: 32,
                  }}
                >
                  <FiBriefcase
                    size={18}
                    color="#fdb924"
                    style={{ flexShrink: 0 }}
                  />
                  <span>고객사 선택</span>
                  <Button
                    $variant="primary"
                    onClick={() => openCompanyMemberModal("client")}
                    style={{
                      padding: "4px 8px",
                      fontSize: 13,
                      minWidth: 0,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: 8,
                    }}
                  >
                    <FiPlus size={16} />
                  </Button>
                </div>
              </FieldLabel>
            </div>
            <CompanyRow>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {selectedClientCompanies.length === 0 && (
                  <span style={{ color: "#aaa", fontSize: 13 }}>
                    고객사를 추가하세요
                  </span>
                )}
                {selectedClientCompanies.map((client) => (
                  <CompanyCard key={client.company.id}>
                    <CompanyCardHeader>
                      <CompanyCardTitle>
                        {/* 고객사 업체 아이콘 */}
                        <FiBriefcase
                          size={15}
                          style={{ marginRight: 4, color: "#10b981" }}
                        />
                        {client.company.name}
                      </CompanyCardTitle>
                    </CompanyCardHeader>
                    <CompanyCardMembers>
                      {client.members.map((m) => (
                        <span
                          key={m.id}
                          style={{
                            marginRight: 8,
                            display: "inline-flex",
                            alignItems: "center",
                            fontSize: 13,
                          }}
                        >
                          {m.type === "admin" ? (
                            <RiUserSettingsLine
                              size={14}
                              style={{ color: "#8b5cf6", marginRight: 2 }}
                            />
                          ) : m.type === "manager" ? (
                            <FiUserCheck
                              size={14}
                              style={{ color: "#ec4899", marginRight: 2 }}
                            />
                          ) : m.type === "dev_employee" ? (
                            <TbUserCode
                              size={14}
                              style={{ color: "#3b82f6", marginRight: 2 }}
                            />
                          ) : (
                            <FiUser
                              size={14}
                              style={{ color: "#6b7280", marginRight: 2 }}
                            />
                          )}
                          {m.name}({m.position})
                          {m.type === "manager" && (
                            <span
                              style={{
                                color: "#ec4899",
                                fontWeight: 600,
                                marginLeft: 3,
                              }}
                            >
                              담당자
                            </span>
                          )}
                        </span>
                      ))}
                    </CompanyCardMembers>
                  </CompanyCard>
                ))}
              </div>
            </CompanyRow>
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
          <Button
            $variant={undefined}
            onClick={onClose}
            style={{
              padding: "6px 16px",
              fontSize: 14,
              height: 32,
              minWidth: 0,
            }}
          >
            취소
          </Button>
          <Button
            $variant="secondary"
            onClick={handleReset}
            style={{
              padding: "6px 16px",
              fontSize: 14,
              height: 32,
              minWidth: 0,
            }}
          >
            초기화
          </Button>
          <Button
            $variant="primary"
            onClick={handleCreateProject}
            style={{
              padding: "6px 16px",
              fontSize: 14,
              height: 32,
              minWidth: 0,
            }}
          >
            {editMode ? "편집" : "프로젝트 생성"}
          </Button>
        </div>
        {/* 닫기 버튼 (오른쪽 상단) */}
        <CloseButton onClick={onClose} aria-label="닫기">
          <IoClose />
        </CloseButton>
        {showCompanyMemberModal && (
          <CompanyMemberSelectModal
            onClose={closeCompanyMemberModal}
            onDone={
              modalType === "dev"
                ? handleDevCompanyDone
                : handleClientCompanyDone
            }
            selectedCompany={
              editCompany ? { ...editCompany, userCount: 0 } : undefined
            }
            selectedMembers={editMembers}
            selectedDevCompanies={selectedDevCompanies.map((dev) => ({
              ...dev,
              company: { ...dev.company, userCount: 0 },
            }))}
            selectedClientCompanies={selectedClientCompanies.map((client) => ({
              ...client,
              company: { ...client.company, userCount: 0 },
            }))}
          />
        )}
      </ModalPanel>
    </ModalOverlay>
  );
}
