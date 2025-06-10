import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as S from "./CreateProjectpage.styled";

interface Company {
  id: number;
  name: string;
}
interface User {
  id: number;
  name: string;
}

export default function ProjectCreatePage() {
  // Form state
  const [name, setName] = useState<string>("");
  const [overview, setOverview] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Company & user lists
  const [companies, setCompanies] = useState<Company[]>([]);
  const [devCompanyId, setDevCompanyId] = useState<number | "">("");
  const [clientCompanyId, setClientCompanyId] = useState<number | "">("");
  const [devUsers, setDevUsers] = useState<User[]>([]);
  const [clientUsers, setClientUsers] = useState<User[]>([]);
  const [developerId, setDeveloperId] = useState<number | "">("");
  const [clientId, setClientId] = useState<number | "">("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Load companies on mount
  useEffect(() => {
    fetch("http://localhost:8080/api/companies")
      .then(res => res.json())
      .then((response: any) => {
        const payload = response.data ?? response;
        const list: Company[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.content)
            ? payload.content
            : [];
        setCompanies(list);
      })
      .catch(err => console.error("Failed to load companies", err));
  }, []);

  // Load developers when devCompanyId changes
  useEffect(() => {
    if (devCompanyId !== "") {
      fetch(`http://localhost:8080/api/companies/${devCompanyId}/users`)
        .then(res => res.json())
        .then((response: any) => {
          const payload = response.data ?? response;
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
    }
  }, [devCompanyId]);

  // Load clients when clientCompanyId changes
  useEffect(() => {
    if (clientCompanyId !== "") {
      fetch(`http://localhost:8080/api/companies/${clientCompanyId}/users`)
        .then(res => res.json())
        .then((response: any) => {
          const payload = response.data ?? response;
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
    }
  }, [clientCompanyId]);

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
      developCompanyId: Number(devCompanyId),
      clientCompanyId: Number(clientCompanyId),
    };

    try {
      const res = await fetch("http://localhost:8080/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "프로젝트 생성에 실패했습니다");
      }
      console.log("프로젝트 생성 성공");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
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
                onChange={date => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="시작일 선택"
                className="input"
                required
              />
            </div>
            <div>
              <S.Label htmlFor="end-date">마감일</S.Label>
              <DatePicker
                id="end-date"
                selected={endDate}
                onChange={date => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="마감일 선택"
                className="input"
                required
              />
            </div>
          </S.DateRow>
        </S.Section>

        {/* 개발사 */}
        <S.Section>
          <S.Label htmlFor="dev-company">개발사 *</S.Label>
          <S.Select
            id="dev-company"
            value={devCompanyId}
            onChange={e => setDevCompanyId(Number(e.target.value))}
            required
          >
            <option value="">회사 선택</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </S.Select>
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
          <S.Select
            id="client-company"
            value={clientCompanyId}
            onChange={e => setClientCompanyId(Number(e.target.value))}
            required
          >
            <option value="">회사 선택</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </S.Select>
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