import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  FormSection,
  FormGroup,
  Label,
  Input,
  SectionDivider,
  SectionTitle,
  DateInputContainer,
  DateInputWrapper,
  ButtonGroup,
  Button,
} from "./ProjectRegisterModal.styled";

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

interface RegisterData {
  name: string;
  client: string;
  clientManagers: MemberOption[];
  dev: string;
  devManagers: MemberOption[];
  start: string;
  end: string;
  status: string;
}

interface ProjectRegisterModalProps {
  open: boolean;
  onClose: () => void;
  onRegister: (data: RegisterData) => void;
}

export default function ProjectRegisterModal({
  open,
  onClose,
  onRegister,
}: ProjectRegisterModalProps) {
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [clientManagers, setClientManagers] = useState<MemberOption[]>([]);
  const [dev, setDev] = useState("");
  const [devManagers, setDevManagers] = useState<MemberOption[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [status, setStatus] = useState<StatusOption>(statusOptions[0]);

  useEffect(() => {
    if (open) {
      setName("");
      setClient("");
      setClientManagers([]);
      setDev("");
      setDevManagers([]);
      setStart("");
      setEnd("");
      setStatus(statusOptions[0]);
    }
  }, [open]);

  if (!open) return null;

  const handleSave = () => {
    onRegister &&
      onRegister({
        name: name,
        client: client,
        clientManagers: clientManagers,
        dev: dev,
        devManagers: devManagers,
        start: start,
        end: end,
        status: status.value,
      });
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>새 프로젝트 등록</ModalTitle>
        <FormSection>
          {/* 프로젝트 정보 */}
          <SectionTitle>프로젝트 정보</SectionTitle>
          <FormGroup>
            <Label htmlFor="projectName">프로젝트명</Label>
            <Input
              type="text"
              id="projectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>
          <SectionDivider />

          {/* 회사 정보 */}
          <SectionTitle>회사 정보</SectionTitle>
          <FormGroup>
            <Label htmlFor="client">고객사</Label>
            <Select
              id="client"
              options={companyOptions}
              onChange={(option) => setClient(option?.value || "")}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="clientManagers">고객사 담당자</Label>
            <Select
              id="clientManagers"
              options={dummyMembers}
              isMulti
              onChange={(options) =>
                setClientManagers(options as MemberOption[])
              }
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="developer">개발사</Label>
            <Select
              id="developer"
              options={companyOptions}
              onChange={(option) => setDev(option?.value || "")}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="devManagers">개발사 담당자</Label>
            <Select
              id="devManagers"
              options={dummyMembers}
              isMulti
              onChange={(options) => setDevManagers(options as MemberOption[])}
            />
          </FormGroup>
          <SectionDivider />

          {/* 기간 및 상태 */}
          <SectionTitle>기간 및 상태</SectionTitle>
          <FormGroup>
            <Label htmlFor="projectPeriod">프로젝트 기간</Label>
            <DateInputContainer>
              <DateInputWrapper>
                <Input
                  type="date"
                  id="projectStart"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </DateInputWrapper>
              <span>~</span>
              <DateInputWrapper>
                <Input
                  type="date"
                  id="projectEnd"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </DateInputWrapper>
            </DateInputContainer>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="projectStatus">프로젝트 상태</Label>
            <Select
              id="projectStatus"
              options={statusOptions}
              value={status}
              onChange={(option) =>
                setStatus((option as StatusOption) || statusOptions[0])
              }
            />
          </FormGroup>
        </FormSection>

        <ButtonGroup>
          <Button $variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button $variant="primary" onClick={handleSave}>
            등록
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
}
