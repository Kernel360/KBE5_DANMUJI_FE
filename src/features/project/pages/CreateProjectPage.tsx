import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as S from "./CreateProjectpage.styled";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

interface Company {
  id: number;
  name: string;
}
interface User {
  id: number;
  name: string;
}

// --- 변경된 부분: 로컬 날짜를 문자열로 포맷하는 유틸 함수 추가 ---
function formatLocalDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function ProjectCreatePage() {
  // Form state
  const [name, setName] = useState<string>("");
  const [overview, setOverview] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // 회사 옵션을 react-select 형식으로 변환
  const companyToOption = (company: Company) => ({
    value: company.id,
    label: company.name,
  });

  // Company & user lists
  const [companies, setCompanies] = useState<Company[]>([]);
  const [devCompanyId, setDevCompanyId] = useState<number | "">("");
  const [clientCompanyId, setClientCompanyId] = useState<number | "">("");
  const [devUsers, setDevUsers] = useState<User[]>([]);
  const [clientUsers, setClientUsers] = useState<User[]>([]);
  const [developerId, setDeveloperId] = useState<number | "">("");
  const [clientId, setClientId] = useState<number | "">("");
  
  // 멤버 선택을 위한 상태 추가
  const [selectedDevMembers, setSelectedDevMembers] = useState<{ value: number; label: string }[]>([]);
  const [selectedClientMembers, setSelectedClientMembers] = useState<{ value: number; label: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // AsyncSelect에서 사용할 옵션 로더
  const loadCompanyOptions = async (inputValue: string) => {
    try {
      const url = inputValue && inputValue.trim() !== ""
        ? `/api/companies/search?name=${encodeURIComponent(inputValue)}`
        : "/api/companies";
      const response = await api.get(url);
      const payload = response.data.data ?? response.data;
      const list: Company[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.content)
          ? payload.content
          : [];
      return list.map(companyToOption);
    } catch (err) {
      return [];
    }
  };

  // 개발사 회원 목록
  useEffect(() => {
    if (devCompanyId !== "") {
      api.get(`/api/companies/${devCompanyId}/users`)
        .then(response => {
          const payload = response.data.data ?? response.data;
          const list: User[] = Array.isArray(payload)
            ? payload
            : Array.isArray(payload.content)
              ? payload.content
              : [];
          setDevUsers(list);
        })
        .catch(err => console.error("Failed to load developers", err));
    } else {
      setDevUsers([]);
      setDeveloperId("");
      setSelectedDevMembers([]);
    }
  }, [devCompanyId]);

  // 고객사 회원 목록
  useEffect(() => {
    if (clientCompanyId !== "") {
      api.get(`/api/companies/${clientCompanyId}/users`)
        .then(response => {
          const payload = response.data.data ?? response.data;
          const list: User[] = Array.isArray(payload)
            ? payload
            : Array.isArray(payload.content)
              ? payload.content
              : [];
          setClientUsers(list);
        })
        .catch(err => console.error("Failed to load client users", err));
    } else {
      setClientUsers([]);
      setClientId("");
      setSelectedClientMembers([]);
    }
  }, [clientCompanyId]);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 필수 필드 검증
    if (!name.trim()) {
      alert('프로젝트명을 입력해주세요.');
      setLoading(false);
      return;
    }
    if (!overview.trim()) {
      alert('개요를 입력해주세요.');
      setLoading(false);
      return;
    }
    if (!startDate) {
      alert('시작일을 선택해주세요.');
      setLoading(false);
      return;
    }
    if (!devCompanyId) {
      alert('개발사를 선택해주세요.');
      setLoading(false);
      return;
    }
    if (!clientCompanyId) {
      alert('고객사를 선택해주세요.');
      setLoading(false);
      return;
    }
    if (!developerId) {
      alert('개발사 담당자를 선택해주세요.');
      setLoading(false);
      return;
    }
    if (!clientId) {
      alert('고객사 담당자를 선택해주세요.');
      setLoading(false);
      return;
    }

    const payload = {
      name,
      description: overview,
      startDate: startDate ? formatLocalDate(startDate) : null,
      endDate: endDate ? formatLocalDate(endDate) : null,
      developerId: Number(developerId),
      clientId: Number(clientId),
      developCompanyId: Number(devCompanyId),
      clientCompanyId: Number(clientCompanyId),
      developMemberId: selectedDevMembers.map((member) => member.value),
      clientMemberId: selectedClientMembers.map((member) => member.value),
    };

    try {
      await api.post("/api/projects", payload);
      navigate("/projects");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "프로젝트 생성에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.Container>
      <S.Header>
        <S.Title>프로젝트 생성</S.Title>
        <S.Subtitle>새로운 프로젝트의 정보를 입력해주세요.</S.Subtitle>
      </S.Header>

      <S.Form onSubmit={handleSubmit}>
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

        {/* 프로젝트명 */}
        <S.Section>
          <S.Label htmlFor="project-name">프로젝트명 *</S.Label>
          <S.Input
            id="project-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="프로젝트 이름을 입력하세요"
            required
          />
        </S.Section>

        {/* 개요 */}
        <S.Section>
          <S.Label htmlFor="project-overview">개요 *</S.Label>
          <S.Input
            id="project-overview"
            type="text"
            value={overview}
            onChange={e => setOverview(e.target.value)}
            placeholder="프로젝트 개요를 간략히 입력하세요"
            required
          />
        </S.Section>

        {/* 기간 */}
        <S.Section>
          <S.Label>프로젝트 기간 *</S.Label>
          <S.DateRow>
            <div>
              <S.Label htmlFor="start-date">시작일</S.Label>
              <DatePicker
                id="start-date"
                selected={startDate}
                onChange={date => {
                  setStartDate(date);
                  // 시작일이 변경되면 마감일이 시작일보다 이전이면 초기화
                  if (endDate && date && endDate < date) {
                    setEndDate(null);
                  }
                }}
                dateFormat="yyyy-MM-dd"
                placeholderText="시작일 선택"
                className="date-input white-bg"
                required
                onKeyDown={e => e.preventDefault()}
              />
            </div>
            <div>
              <S.Label htmlFor="end-date">종료일</S.Label>
              <DatePicker
                id="end-date"
                selected={endDate}
                onChange={date => {
                  console.log('Selected end date:', date);
                  setEndDate(date);
                }}
                dateFormat="yyyy-MM-dd"
                placeholderText="마감일 선택"
                className="date-input white-bg"
                required
                onKeyDown={e => e.preventDefault()}
                disabled={!startDate} // 시작일이 선택되지 않으면 비활성화
                minDate={startDate || undefined} // 시작일 이후의 날짜만 선택 가능
              />
            </div>
          </S.DateRow>
        </S.Section>

        {/* 개발사 */}
        <S.Section>
          <S.Label htmlFor="dev-company">개발사 *</S.Label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadCompanyOptions}
            value={
              devCompanyId
                ? companies
                    .filter(c => c.id === devCompanyId)
                    .map(companyToOption)[0]
                : null
            }
            onChange={option => {
              setDevCompanyId(option ? option.value : "");
              setSelectedDevMembers([]);
              setDeveloperId("");
            }}
            placeholder="회사 검색/선택"
            isClearable
            inputId="dev-company"
            styles={{
              container: base => ({ ...base, width: "100%" }),
            }}
          />
        </S.Section>

        {/* 개발사 담당자 */}
        <S.Section>
          <S.Label htmlFor="dev-manager">개발사 담당자 *</S.Label>
          <Select
            value={developerId ? { value: developerId, label: devUsers.find(u => u.id === developerId)?.name || '' } : null}
            onChange={(option) => {
              setDeveloperId(option ? option.value : '');
              // 담당자 선택 시 자동으로 멤버에 추가
              if (option) {
                const newMember = { value: option.value, label: option.label };
                setSelectedDevMembers(prev => {
                  // 이미 멤버에 있는지 확인
                  if (!prev.some(member => member.value === option.value)) {
                    return [...prev, newMember];
                  }
                  return prev;
                });
              }
            }}
            options={devUsers.map(user => ({
              value: user.id,
              label: user.name
            }))}
            placeholder="담당자 선택"
            isDisabled={!devUsers.length}
            styles={{
              container: base => ({ ...base, width: "100%" }),
            }}
          />
        </S.Section>

        {/* 개발사 멤버 */}
        <S.Section>
          <S.Label htmlFor="dev-members">개발사 멤버</S.Label>
          <Select
            isMulti
            value={selectedDevMembers}
            onChange={(newValue) =>
              setSelectedDevMembers(newValue as { value: number; label: string }[])
            }
            options={devUsers.map(user => ({
              value: user.id,
              label: user.name
            }))}
            placeholder="개발사 멤버 선택"
            isDisabled={!developerId}
            styles={{
              container: base => ({ ...base, width: "100%" }),
            }}
          />
        </S.Section>

        {/* 고객사 */}
        <S.Section>
          <S.Label htmlFor="client-company">고객사 *</S.Label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadCompanyOptions}
            value={
              clientCompanyId
                ? companies
                    .filter(c => c.id === clientCompanyId)
                    .map(companyToOption)[0]
                : null
            }
            onChange={option => {
              setClientCompanyId(option ? option.value : "");
              setSelectedClientMembers([]);
              setClientId("");
            }}
            placeholder="회사 검색/선택"
            isClearable
            inputId="client-company"
            styles={{
              container: base => ({ ...base, width: "100%" }),
            }}
          />
        </S.Section>

        {/* 고객사 담당자 */}
        <S.Section>
          <S.Label htmlFor="client-manager">고객사 담당자 *</S.Label>
          <Select
            value={clientId ? { value: clientId, label: clientUsers.find(u => u.id === clientId)?.name || '' } : null}
            onChange={(option) => {
              setClientId(option ? option.value : '');
              // 담당자 선택 시 자동으로 멤버에 추가
              if (option) {
                const newMember = { value: option.value, label: option.label };
                setSelectedClientMembers(prev => {
                  // 이미 멤버에 있는지 확인
                  if (!prev.some(member => member.value === option.value)) {
                    return [...prev, newMember];
                  }
                  return prev;
                });
              }
            }}
            options={clientUsers.map(user => ({
              value: user.id,
              label: user.name
            }))}
            placeholder="담당자 선택"
            isDisabled={!clientUsers.length}
            styles={{
              container: base => ({ ...base, width: "100%" }),
            }}
          />
        </S.Section>

        {/* 고객사 멤버 */}
        <S.Section>
          <S.Label htmlFor="client-members">고객사 멤버</S.Label>
          <Select
            isMulti
            value={selectedClientMembers}
            onChange={(newValue) =>
              setSelectedClientMembers(newValue as { value: number; label: string }[])
            }
            options={clientUsers.map(user => ({
              value: user.id,
              label: user.name
            }))}
            placeholder="고객사 멤버 선택"
            isDisabled={!clientId}
            styles={{
              container: base => ({ ...base, width: "100%" }),
            }}
          />
        </S.Section>

        {/* 버튼 */}
        <S.Actions>
          <S.CancelButton type="button" onClick={() => window.history.back()} disabled={loading}>
            취소
          </S.CancelButton>
          <S.CreateButton type="submit" disabled={loading}>
            {loading ? '생성 중...' : '생성하기'}
          </S.CreateButton>
        </S.Actions>
      </S.Form>
    </S.Container>
  );
}