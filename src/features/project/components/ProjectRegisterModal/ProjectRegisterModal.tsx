import React, { useState, useEffect } from "react";
import Select from "react-select";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 28rem; /* max-w-md */
  padding: 2rem;
  position: relative;
`;

const ModalTitle = styled.div`
  font-size: 1.25rem; /* text-xl */
  font-weight: 700; /* font-bold */
  margin-bottom: 1.5rem; /* mb-6 */
`;

const FormSection = styled.div`
  /* space-y-4 */
  & > div {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-size: 0.875rem; /* text-sm */
  font-weight: 600; /* font-semibold */
  margin-bottom: 0.25rem; /* mb-1 */
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #d1d5db; /* border */
  border-radius: 0.25rem; /* rounded */
  padding: 0.5rem 0.75rem; /* px-3 py-2 */

  &:focus {
    outline: none;
    border-color: #3b82f6; /* focus:border-blue-500 */
    box-shadow: 0 0 0 1px #3b82f6; /* focus:ring-blue-500 */
  }
`;

const SectionDivider = styled.div`
  border-bottom: 1px solid #e5e7eb; /* border-b */
  padding-bottom: 1rem; /* pb-4 */
  margin-bottom: 1rem; /* mb-4 */
`;

const SectionTitle = styled.div`
  font-weight: 600; /* font-semibold */
  color: #374151; /* text-gray-700 */
  margin-bottom: 0.5rem; /* mb-2 */
`;

const DateInputContainer = styled.div`
  display: flex;
  gap: 1rem; /* gap-4 */
`;

const DateInputWrapper = styled.div`
  flex: 1; /* flex-1 */
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end; /* justify-end */
  gap: 0.5rem; /* gap-2 */
  margin-top: 2rem; /* mt-8 */
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 0.5rem 1rem; /* px-4 py-2 */
  border-radius: 0.25rem; /* rounded */
  font-weight: 600; /* font-semibold */
  cursor: pointer;

  ${(props) =>
    props.$variant === "primary"
      ? `
    background-color: #3b82f6; /* bg-blue-500 */
    color: white; /* text-white */

    &:hover {
      background-color: #2563eb; /* hover:bg-blue-600 */
    }
  `
      : `
    background-color: #e5e7eb; /* bg-gray-200 */
    color: #374151; /* text-gray-700 */

    &:hover {
      background-color: #d1d5db; /* hover:bg-gray-300 */
    }
  `}
`;

const companyOptions = [
  { value: "ABC", label: "ABC 주식회사" },
  { value: "DEF", label: "DEF 테크놀로지" },
  { value: "GHI", label: "GHI 시스템즈" },
];

const dummyMembers = [
  { value: "hong", label: "홍길동" },
  { value: "kim", label: "김철수" },
  { value: "park", label: "박영희" },
  { value: "lee", label: "이이름" },
  { value: "choi", label: "최담당" },
];

const statusOptions = [
  { value: "진행중", label: "진행중" },
  { value: "대기", label: "대기" },
  { value: "완료", label: "완료" },
];

interface MemberOption {
  value: string;
  label: string;
}

interface StatusOption {
  value: string;
  label: string;
}

interface ProjectEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    client: string;
    clientManagers: MemberOption[];
    dev: string;
    devManagers: MemberOption[];
    name: string;
    start: string;
    end: string;
    status: string;
  }) => void;
  project: {
    client: string;
    clientManagers: MemberOption[];
    dev: string;
    devManagers: MemberOption[];
    name: string;
    start: string;
    end: string;
    status: string;
  };
}

export default function ProjectEditModal({
  open,
  onClose,
  onSave,
  project,
}: ProjectEditModalProps) {
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [clientManagers, setClientManagers] = useState<MemberOption[]>([]);
  const [dev, setDev] = useState("");
  const [devManagers, setDevManagers] = useState<MemberOption[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [status, setStatus] = useState<StatusOption>(statusOptions[0]);

  useEffect(() => {
    if (project) {
      setName(project.name || "");
      setClient(project.client || "");
      setClientManagers(project.clientManagers || []);
      setDev(project.dev || "");
      setDevManagers(project.devManagers || []);
      setStart(project.start || "");
      setEnd(project.end || "");
      setStatus(
        statusOptions.find((opt) => opt.value === project.status) ||
          statusOptions[0]
      );
    }
  }, [project, open]);

  if (!open) return null;

  const handleSave = () => {
    onSave &&
      onSave({
        name,
        client,
        clientManagers,
        dev,
        devManagers,
        start,
        end,
        status: status.value,
      });
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>프로젝트 수정</ModalTitle>
        <FormSection>
          <FormGroup>
            <Label>프로젝트명</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>
          <SectionDivider>
            <SectionTitle>고객사 정보</SectionTitle>
            <FormGroup>
              <Label>고객사명</Label>
              <Select
                options={companyOptions}
                value={
                  companyOptions.find((opt) => opt.value === client) || null
                }
                onChange={(val) => setClient(val ? val.value : "")}
                placeholder="고객사 선택"
                classNamePrefix="react-select"
                isClearable
              />
            </FormGroup>
            <FormGroup>
              <Label>고객사 담당자(다중 선택)</Label>
              <Select
                isMulti
                options={dummyMembers}
                value={clientManagers}
                onChange={(val) => setClientManagers(val as MemberOption[])}
                placeholder="고객사 담당자 검색/선택"
                classNamePrefix="react-select"
              />
            </FormGroup>
          </SectionDivider>
          <SectionDivider>
            <SectionTitle>개발사 정보</SectionTitle>
            <FormGroup>
              <Label>개발사명</Label>
              <Select
                options={companyOptions}
                value={companyOptions.find((opt) => opt.value === dev) || null}
                onChange={(val) => setDev(val ? val.value : "")}
                placeholder="개발사 선택"
                classNamePrefix="react-select"
                isClearable
              />
            </FormGroup>
            <FormGroup>
              <Label>개발사 담당자(다중 선택)</Label>
              <Select
                isMulti
                options={dummyMembers}
                value={devManagers}
                onChange={(val) => setDevManagers(val as MemberOption[])}
                placeholder="개발사 담당자 검색/선택"
                classNamePrefix="react-select"
              />
            </FormGroup>
          </SectionDivider>
          <DateInputContainer>
            <DateInputWrapper>
              <Label>시작일</Label>
              <Input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </DateInputWrapper>
            <DateInputWrapper>
              <Label>종료일</Label>
              <Input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </DateInputWrapper>
          </DateInputContainer>
          <FormGroup>
            <Label>상태</Label>
            <Select
              options={statusOptions}
              value={status}
              onChange={(val) => setStatus(val as StatusOption)}
              classNamePrefix="react-select"
            />
          </FormGroup>
        </FormSection>
        <ButtonGroup>
          <Button $variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button $variant="primary" onClick={handleSave}>
            저장
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
}
