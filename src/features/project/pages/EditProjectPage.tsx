import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import * as S from './CreateProjectpage.styled';
import api from '@/api/axios';

interface Company { id: number; name: string; }
interface User { id: number; name: string; }
interface UserCompanyResponse {
  id: number;
  name: string;
  userType: string;
  companyId: number;
}

interface ProjectStepSimpleResponse {
  id: number;
  name: string;
  stepOrder: number;
  projectStepStatus: string;
}

interface ProjectData {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  clients: UserCompanyResponse[];
  developers: UserCompanyResponse[];
  steps: ProjectStepSimpleResponse[];
}

export default function ProjectEditPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState<string>('');
  const [overview, setOverview] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Company & user lists
  const [companies, setCompanies] = useState<Company[]>([]);
  const [devUsers, setDevUsers] = useState<User[]>([]);
  const [clientUsers, setClientUsers] = useState<User[]>([]);
  
  const [developCompanyId, setDevelopCompanyId] = useState<number | ''>('');
  const [clientCompanyId, setClientCompanyId] = useState<number | ''>('');
  const [developerId, setDeveloperId] = useState<number | ''>('');
  const [clientId, setClientId] = useState<number | ''>('');
  
  // 멤버 선택을 위한 상태 추가
  const [selectedDevMembers, setSelectedDevMembers] = useState<{ value: number; label: string }[]>([]);
  const [selectedClientMembers, setSelectedClientMembers] = useState<{ value: number; label: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 회사 옵션을 react-select 형식으로 변환
  const companyToOption = (company: Company) => ({
    value: company.id,
    label: company.name,
  });

  // AsyncSelect에서 사용할 옵션 로더
  const loadCompanyOptions = async (inputValue: string) => {
    try {
      const url = inputValue && inputValue.trim() !== ''
        ? `/api/companies/search?name=${encodeURIComponent(inputValue)}`
        : '/api/companies';
      const response = await api.get(url);
      const payload = response.data.data ?? response.data;
      const list: Company[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.content)
          ? payload.content
          : [];
      setCompanies(list); // 회사 목록 저장
      return list.map(companyToOption);
    } catch (err) {
      return [];
    }
  };

  // 기존 프로젝트 데이터 로드
  useEffect(() => {
    api.get(`/api/projects/${projectId}`)
      .then(response => {
        const proj = (response.data.data ?? response.data) as ProjectData;
        console.log('프로젝트 데이터:', proj);
        setName(proj.name);
        setOverview(proj.description);
        setStartDate(proj.startDate ? new Date(proj.startDate) : null);
        setEndDate(proj.endDate ? new Date(proj.endDate) : null);

        // 회사 정보 설정
        const devCompany = proj.developers[0]?.companyId;
        const clientCompany = proj.clients[0]?.companyId;
        setDevelopCompanyId(devCompany || '');
        setClientCompanyId(clientCompany || '');

        // 회사 정보 로드
        if (devCompany) {
          api.get(`/api/companies/${devCompany}`)
            .then(res => {
              const company = res.data.data ?? res.data;
              setCompanies(prev => [...prev, company]);
            })
            .catch(console.error);
        }
        if (clientCompany) {
          api.get(`/api/companies/${clientCompany}`)
            .then(res => {
              const company = res.data.data ?? res.data;
              setCompanies(prev => [...prev, company]);
            })
            .catch(console.error);
        }
        console.log('개발사담당자:', devCompany);
        console.log('고객사담당자:', clientCompany);
        // 매니저 찾기
        const devManager = proj.developers.find((d: UserCompanyResponse) => d.userType === 'MANAGER');
        const clientManager = proj.clients.find((c: UserCompanyResponse) => c.userType === 'MANAGER');
        
        // 담당자 설정
        if (devManager) {
          setDeveloperId(devManager.id);
        }
        if (clientManager) {
          setClientId(clientManager.id);
        }

        // 멤버 설정
        setSelectedDevMembers(proj.developers
          .map((d: UserCompanyResponse) => ({ value: d.id, label: d.name })));
        
        setSelectedClientMembers(proj.clients
          .map((c: UserCompanyResponse) => ({ value: c.id, label: c.name })));
      })
      .catch(console.error);
  }, [projectId]);

  // 개발사 회원 목록
  useEffect(() => {
    if (developCompanyId !== '') {
      api.get(`/api/companies/${developCompanyId}/users`)
        .then(response => {
          const payload = response.data.data ?? response.data;
          const list: User[] = Array.isArray(payload)
            ? payload
            : Array.isArray(payload.content)
              ? payload.content
              : [];
          console.log('개발사 회원 목록:', list);
          setDevUsers(list);
        })
        .catch(err => console.error('Failed to load developers', err));
    } else {
      setDevUsers([]);
      setDeveloperId('');
      setSelectedDevMembers([]);
    }
  }, [developCompanyId]);

  // 고객사 회원 목록
  useEffect(() => {
    if (clientCompanyId !== '') {
      api.get(`/api/companies/${clientCompanyId}/users`)
        .then(response => {
          const payload = response.data.data ?? response.data;
          const list: User[] = Array.isArray(payload)
            ? payload
            : Array.isArray(payload.content)
              ? payload.content
              : [];
          console.log('고객사 회원 목록:', list);
          setClientUsers(list);
        })
        .catch(err => console.error('Failed to load client users', err));
    } else {
      setClientUsers([]);
      setClientId('');
      setSelectedClientMembers([]);
    }
  }, [clientCompanyId]);

  // 개발사 담당자 변경 시
  const handleDevManagerChange = (option: any) => {
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
  };

  // 고객사 담당자 변경 시
  const handleClientManagerChange = (option: any) => {
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
  };

  // 개발사 멤버 목록 업데이트
  const availableDevMembers = useMemo(
    () => devUsers.filter(u => u.id !== developerId),
    [devUsers, developerId]
  );

  // 고객사 멤버 목록 업데이트
  const availableClientMembers = useMemo(
    () => clientUsers.filter(u => u.id !== clientId),
    [clientUsers, clientId]
  );

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name,
      description: overview,
      startDate: startDate ? startDate.toISOString().substring(0, 10) : null,
      endDate: endDate ? endDate.toISOString().substring(0, 10) : null,
      developerId: Number(developerId),
      clientId: Number(clientId),
      developCompanyId: Number(developCompanyId),
      clientCompanyId: Number(clientCompanyId),
      developMemberId: selectedDevMembers.map(member => member.value),
      clientMemberId: selectedClientMembers.map(member => member.value),
    };

    try {
      await api.put(`/api/projects/${projectId}`, payload);
      navigate('/projects');
    } catch (err: any) {
      setError(err.response?.data?.message || '프로젝트 수정에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.Container>
      <S.Header>
        <S.Title>프로젝트 수정</S.Title>
        <S.Subtitle>프로젝트 정보를 수정하세요.</S.Subtitle>
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
                onChange={date => setStartDate(date)}
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
                onChange={date => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="마감일 선택"
                className="date-input white-bg"
                required
                onKeyDown={e => e.preventDefault()}
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
              developCompanyId
                ? { value: developCompanyId, label: companies.find(c => c.id === developCompanyId)?.name || '' }
                : null
            }
            onChange={option => {
              setDevelopCompanyId(option ? option.value : '');
            }}
            placeholder="회사 검색/선택"
            isClearable
            inputId="dev-company"
            styles={{
              container: base => ({ ...base, width: '100%' }),
              control: base => ({
                ...base,
                minHeight: '40px',
                backgroundColor: 'white'
              })
            }}
          />
        </S.Section>

        {/* 개발사 담당자 */}
        <S.Section>
          <S.Label htmlFor="dev-manager">개발사 담당자 *</S.Label>
          <Select
            value={developerId ? { value: developerId, label: devUsers?.find(u => u.id === developerId)?.name || '' } : null}
            onChange={handleDevManagerChange}
            options={devUsers.map(user => ({
              value: user.id,
              label: user.name
            }))}
            placeholder="담당자 선택"
            isDisabled={!devUsers.length}
            styles={{
              container: base => ({ ...base, width: '100%' }),
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
              container: base => ({ ...base, width: '100%' }),
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
                ? { value: clientCompanyId, label: companies.find(c => c.id === clientCompanyId)?.name || '' }
                : null
            }
            onChange={option => {
              setClientCompanyId(option ? option.value : '');
            }}
            placeholder="회사 검색/선택"
            isClearable
            inputId="client-company"
            styles={{
              container: base => ({ ...base, width: '100%' }),
              control: base => ({
                ...base,
                minHeight: '40px',
                backgroundColor: 'white'
              })
            }}
          />
        </S.Section>

        {/* 고객사 담당자 */}
        <S.Section>
          <S.Label htmlFor="client-manager">고객사 담당자 *</S.Label>
          <Select
            value={clientId ? { value: clientId, label: clientUsers.find(u => u.id === clientId)?.name || '' } : null}
            onChange={handleClientManagerChange}
            options={clientUsers.map(user => ({
              value: user.id,
              label: user.name
            }))}
            placeholder="담당자 선택"
            isDisabled={!clientUsers.length}
            styles={{
              container: base => ({ ...base, width: '100%' }),
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
              container: base => ({ ...base, width: '100%' }),
            }}
          />
        </S.Section>

        {/* 버튼 */}
        <S.Actions>
          <S.CancelButton type="button" onClick={() => navigate(-1)} disabled={loading}>
            취소
          </S.CancelButton>
          <S.CreateButton type="submit" disabled={loading}>
            {loading ? '수정 중...' : '수정하기'}
          </S.CreateButton>
        </S.Actions>
      </S.Form>
    </S.Container>
  );
}