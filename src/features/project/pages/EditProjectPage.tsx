import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AsyncSelect from 'react-select/async';
import * as S from './CreateProjectpage.styled';

interface Company { id: number; name: string; }
interface User { id: number; name: string; }
interface ProjectData {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  developCompanyId: number;
  clientCompanyId: number;
  developerId: number;
  clientId: number;
}

export default function ProjectEditPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  // 폼 상태
  const [name, setName] = useState<string>('');
  const [overview, setOverview] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [devCompanyId, setDevCompanyId] = useState<number | ''>('');
  const [clientCompanyId, setClientCompanyId] = useState<number | ''>('');
  const [devUsers, setDevUsers] = useState<User[]>([]);
  const [clientUsers, setClientUsers] = useState<User[]>([]);
  const [developerId, setDeveloperId] = useState<number | ''>('');
  const [clientId, setClientId] = useState<number | ''>('');

  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // options 변환 헬퍼
  const companyToOption = (c: Company) => ({ value: c.id, label: c.name });

  // AsyncSelect 옵션 로더
  const loadCompanyOptions = async (inputValue: string) => {
    const url = inputValue
      ? `http://localhost:8080/api/companies/search?name=${encodeURIComponent(inputValue)}`
      : 'http://localhost:8080/api/companies';
    try {
      const res = await fetch(url);
      const json = await res.json();
      const payload = json.data ?? json;
      const list: Company[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.content)
          ? payload.content
          : [];
      return list.map(companyToOption);
    } catch {
      return [];
    }
  };

  // // 회사 목록 로드
  // useEffect(() => {
  //   fetch('http://localhost:8080/api/companies')
  //     .then(res => res.json())
  //     .then((json: any) => {
  //       const payload = json.data ?? json;
  //       const list: Company[] = Array.isArray(payload)
  //         ? payload
  //         : Array.isArray(payload.content)
  //           ? payload.content
  //           : [];
  //       setCompanies(list);
  //     })
  //     .catch(console.error);
  // }, []);

  // 기존 프로젝트 데이터 로드
  useEffect(() => {
    fetch(`http://localhost:8080/api/projects/${projectId}`)
     .then(res => res.json())
    .then((json: any) => {
       // ApiResponse<ProjectDetailResponse> 형태에서 실제 페이로드를 꺼낸다
       const proj = json.data ?? json;
        setName(proj.name);
        setOverview(proj.description);
        setStartDate(proj.startDate ? new Date(proj.startDate) : null);
        setEndDate(proj.endDate ? new Date(proj.endDate) : null);
      setDevCompanyId(proj.developCompanyId);
       setClientCompanyId(proj.clientCompanyId);
       setDeveloperId(proj.developerId);
       setClientId(proj.clientId);
       // (개발사/고객사 필드도 추후 API 구조에 맞춰 꺼내거나, 
       //  ProjectDetailResponse.developers/clients에서 꺼내도록 추가 구현)
      })
      .catch(console.error);
 }, []);

  // 개발사 담당자 로드
  useEffect(() => {
    if (!devCompanyId) {
      setDevUsers([]);
      setDeveloperId('');
      return;
    }
    fetch(`http://localhost:8080/api/companies/${devCompanyId}/users`)
      .then(res => res.json())
      .then((json: any) => {
        const payload = json.data ?? json;
        const list: User[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.content)
            ? payload.content
            : [];
        setDevUsers(list);
      })
      .catch(console.error);
  }, [devCompanyId]);

  // 고객사 담당자 로드
  useEffect(() => {
    if (!clientCompanyId) {
      setClientUsers([]);
      setClientId('');
      return;
    }
    fetch(`http://localhost:8080/api/companies/${clientCompanyId}/users`)
      .then(res => res.json())
      .then((json: any) => {
        const payload = json.data ?? json;
        const list: User[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.content)
            ? payload.content
            : [];
        setClientUsers(list);
      })
      .catch(console.error);
  }, [clientCompanyId]);

  // 수정 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name,
      description: overview,
      startDate: startDate ? startDate.toISOString().slice(0, 10) : null,
      endDate: endDate ? endDate.toISOString().slice(0, 10) : null,
      developCompanyId: Number(devCompanyId),
      clientCompanyId: Number(clientCompanyId),
      developerId: Number(developerId),
      clientId: Number(clientId),
    };

    try {
      const res = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || '프로젝트 수정에 실패했습니다');
      }
      navigate('/projects');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.Container>
      <S.Header>
        <S.Title>프로젝트 수정</S.Title>
        <S.Subtitle>기존 프로젝트 정보를 수정하세요.</S.Subtitle>
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
                className="date-input"
                required
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
                className="date-input"
                required
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
                ? companyToOption(
                    companies.find(c => c.id === devCompanyId) as Company
                  )
                : null
            }
            onChange={opt => setDevCompanyId(opt ? opt.value : '')}
            placeholder="회사 검색/선택"
            isClearable
            inputId="dev-company"
            styles={{ container: base => ({ ...base, width: '100%' }) }}
          />
        </S.Section>

        {/* 개발사 담당자 */}
        <S.Section>
          <S.Label htmlFor="dev-manager">개발사 담당자 *</S.Label>
          <S.Select
            id="dev-manager"
            value={developerId}
            onChange={e => setDeveloperId(Number(e.target.value))}
            required
            disabled={!devUsers.length}
          >
            <option value="">담당자 선택</option>
            {devUsers.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </S.Select>
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
                ? companyToOption(
                    companies.find(c => c.id === clientCompanyId) as Company
                  )
                : null
            }
            onChange={opt => setClientCompanyId(opt ? opt.value : '')}
            placeholder="회사 검색/선택"
            isClearable
            inputId="client-company"
            styles={{ container: base => ({ ...base, width: '100%' }) }}
          />
        </S.Section>

        {/* 고객사 담당자 */}
        <S.Section>
          <S.Label htmlFor="client-manager">고객사 담당자 *</S.Label>
          <S.Select
            id="client-manager"
            value={clientId}
            onChange={e => setClientId(Number(e.target.value))}
            required
            disabled={!clientUsers.length}
          >
            <option value="">담당자 선택</option>
            {clientUsers.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </S.Select>
        </S.Section>

        {/* 액션 버튼 */}
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