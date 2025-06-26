import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import api from "@/api/axios";

// Styled Components
const PageContainer = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 32px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 24px;
  margin-bottom: 24px;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatusBadges = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const Badge = styled.span<{ type: "status" | "role" }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ type, children }) =>
    type === "status"
      ? children === "답변완료"
        ? "#16a34a"
        : "#d97706"
      : "#4f46e5"};
  background-color: ${({ type, children }) =>
    type === "status"
      ? children === "답변완료"
        ? "#dcfce7"
        : "#fef3c7"
      : "#e0e7ff"};
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px;
`;

const MetaInfo = styled.div`
  font-size: 14px;
  color: #6b7280;
  & > span:not(:last-child)::after {
    content: "|";
    margin: 0 12px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button<{ variant: "primary" | "danger" | "default" }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  ${({ variant }) => {
    if (variant === "primary")
      return "background-color: #22c55e; color: #fff; border-color: #22c55e;";
    if (variant === "danger")
      return "background-color: #ef4444; color: #fff; border-color: #ef4444;";
    return "background-color: #fff; color: #4b5565; border-color: #d1d5db;";
  }}
  &:hover {
    opacity: 0.9;
  }
`;

const ContentSection = styled.div`
  font-size: 16px;
  line-height: 1.7;
  color: #374151;
  padding: 16px 0;
  min-height: 150px;
`;

// 답변 작성 폼 관련 스타일 복구
const AnswerForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #a5b4fc;
    box-shadow: 0 0 0 3px #e0e7ff;
  }
`;

const SubmitButton = styled(ActionButton)`
  align-self: flex-end;
`;

const Section = styled.section`
  margin-top: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 12px;
`;

// 타입 정의 추가
interface InquiryDetail {
  id: number;
  authorName: string;
  title: string;
  content: string;
  inquiryStatus: 'WAITING' | 'COMPLETED';
  createdAt: string;
  // answers?: Answer[]; // 답변 API 연동 시 추가
}

// 답변 목록 타입 정의
interface Answer {
  id: number;
  inquiryId: number;
  authorName: string;
  content: string;
  createdAt: string;
}

export default function InquiryDetailPage() {
  const { inquiryId } = useParams();
  const { role } = useAuth();
  const [inquiry, setInquiry] = useState<InquiryDetail | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [answerContent, setAnswerContent] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [answerPage, setAnswerPage] = useState({
    size: 10,
    number: 0,
    totalElements: 0,
    totalPages: 1,
  });
  const answerListRef = useRef<HTMLDivElement | null>(null);
  const answerFormRef = useRef<HTMLFormElement | null>(null);
  
  // 답변 수정 상태
  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
  const [editedAnswerContent, setEditedAnswerContent] = useState<string>("");
  
  const navigate = useNavigate();
  
  // 답변 목록 조회
  const fetchAnswers = async (page = 0) => {
    try {
      const res = await api.get(`/api/answers/${inquiryId}?page=${page}`);
      setAnswers(res.data.data.content);
      setAnswerPage(res.data.data.page);
    } catch {
      setAnswers([]);
      setAnswerPage({ size: 10, number: 0, totalElements: 0, totalPages: 1 });
    }
  };

  // 문의 상세, 답변 목록 동시 조회
  useEffect(() => {
    async function fetchInquiry() {
      try {
        const res = await api.get(`/api/inquiries/${inquiryId}`);
        const data = res.data.data;
        setInquiry(data);
        setEditedTitle(data.title);
        setEditedContent(data.content);
      } catch {
        setInquiry(null);
      }
    }
    if (inquiryId) {
      fetchInquiry();
      fetchAnswers(0);
    }
  }, [inquiryId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // 문의사항 수정 저장
  const handleSaveChanges = async () => {
    try {
      await api.put(`/api/inquiries/${inquiryId}/user`, {
        title: editedTitle,
        content: editedContent,
      });
      setIsEditing(false);
      // 저장 후 상세 정보 갱신
      if (inquiryId) {
        const res = await api.get(`/api/inquiries/${inquiryId}`);
        const data = res.data.data;
        setInquiry(data);
        setEditedTitle(data.title);
        setEditedContent(data.content);
      }
    } catch {
      alert("문의사항 수정에 실패했습니다.");
    }
  };

  // 문의사항 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(inquiry?.title || "");
    setEditedContent(inquiry?.content || "");
  };
  
  // 답변 등록 핸들러
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim()) return;
    try {
      await api.post(`/api/answers/${inquiryId}`, { content: answerContent });
      setAnswerContent("");
      // 답변 새로고침 (첫 페이지로 이동)
      fetchAnswers(0);
      // 답변 등록 후 페이지 맨 위로 스크롤
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } catch {
      alert("답변 등록에 실패했습니다.");
    }
  };

  // 문의사항 수정 취소
  const handleAnswerKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // 등록
      if (answerContent.trim()) {
        answerFormRef.current?.requestSubmit();
      }
    }
  };
  
  // 페이지네이션 핸들러
  const handlePageChange = (newPage: number) => {
    fetchAnswers(newPage);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };
  
  // 답변 완료 처리 (관리자만)
  const handleCompleteInquiry = async () => {
    try {
      await api.put(`/api/inquiries/${inquiryId}/admin`, { status: 'ANSWERED' });
      // 완료 후 상세 정보 갱신
      if (inquiryId) {
        const res = await api.get(`/api/inquiries/${inquiryId}`);
        const data = res.data.data;
        setInquiry(data);
        setEditedTitle(data.title);
        setEditedContent(data.content);
      }
    } catch {
      alert('답변 완료 처리에 실패했습니다.');
    }
  };

  // 답변 수정 시작
  const handleEditAnswer = (answerId: number, currentContent: string) => {
    setEditingAnswerId(answerId);
    setEditedAnswerContent(currentContent);
  };

  // 답변 수정 저장
  const handleSaveAnswer = async (answerId: number) => {
    try {
      await api.put(`/api/answers/${answerId}`, { content: editedAnswerContent });
      setEditingAnswerId(null);
      setEditedAnswerContent("");
      fetchAnswers(answerPage.number); // 현재 페이지 새로고침
    } catch {
      alert("답변 수정에 실패했습니다.");
    }
  };

  // 답변 수정 취소
  const handleCancelEditAnswer = () => {
    setEditingAnswerId(null);
    setEditedAnswerContent("");
  };

  // 답변 다시하기 (관리자만)
  const handleReopenInquiry = async () => {
    try {
      await api.put(`/api/inquiries/${inquiryId}/admin`, { status: 'WAITING' });
      // 상태 변경 후 상세 정보 갱신
      if (inquiryId) {
        const res = await api.get(`/api/inquiries/${inquiryId}`);
        const data = res.data.data;
        setInquiry(data);
        setEditedTitle(data.title);
        setEditedContent(data.content);
      }
    } catch {
      alert('답변 다시하기 처리에 실패했습니다.');
    }
  };

  // 문의사항 삭제
  const handleDeleteInquiry = async () => {
    if (!window.confirm("정말로 이 문의사항을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/inquiries/${inquiryId}`);
      // 삭제 후 목록 페이지로 이동 (예: /inquiry)
      navigate("/inquiry");
    } catch {
      alert("문의사항 삭제에 실패했습니다.");
    }
  };

  // 답변 삭제
  const handleDeleteAnswer = async (answerId: number) => {
    if (!window.confirm("정말로 이 답변을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/answers/${answerId}`);
      // 현재 페이지의 마지막 답변을 삭제하고, 현재 페이지가 첫 페이지가 아닐 경우
      if (answers.length === 1 && answerPage.number > 0) {
        // 이전 페이지로 이동
        fetchAnswers(answerPage.number - 1);
      } else {
        // 현재 페이지 새로고침
        fetchAnswers(answerPage.number);
      }
    } catch {
      alert("답변 삭제에 실패했습니다.");
    }
  };

  if (!inquiry) {
    return <PageContainer>문의사항을 찾을 수 없습니다.</PageContainer>;
  }

  const isAdmin = role === 'ROLE_ADMIN';
  const isWaiting = inquiry.inquiryStatus === 'WAITING';

  // 날짜 포맷 (YYYY-MM-DD HH:mm)
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
  }

  return (
    <PageContainer>
      <Header>
        <HeaderInfo>
          <StatusBadges>
            <Badge type="status">
              {inquiry.inquiryStatus === 'WAITING' ? "답변 대기" : "답변완료"}
            </Badge>
          </StatusBadges>
          {isEditing ? (
            <input 
              value={editedTitle}
              onChange={e => setEditedTitle(e.target.value)}
              style={{fontSize: '28px', fontWeight: 700, border: '1px solid #ccc', borderRadius: '8px', padding: '8px'}}
            />
          ) : (
            <Title>{inquiry.title}</Title>
          )}
          
          <MetaInfo>
            <span>작성자 {inquiry.authorName}</span>
            <span>작성일 {formatDate(inquiry.createdAt)}</span>
          </MetaInfo>
        </HeaderInfo>
        <HeaderActions>
          {isEditing ? (
            <>
              <ActionButton variant="primary" onClick={handleSaveChanges}>저장하기</ActionButton>
              <ActionButton variant="default" onClick={handleCancelEdit}>취소</ActionButton>
            </>
          ) : (
            <>
              {/* 답변 대기 상태: 답변 완료하기, 답변완료 상태: 답변 다시하기 */}
              {isAdmin && isWaiting && (
                <ActionButton variant="primary" onClick={handleCompleteInquiry}>답변 완료하기</ActionButton>
              )}
              {isAdmin && !isWaiting && (
                <ActionButton variant="default" onClick={handleReopenInquiry}>답변 다시하기</ActionButton>
              )}
              {/* 일반 사용자만 수정 버튼 노출 */}
              {!isAdmin && (
                <ActionButton variant="default" onClick={handleEditToggle}>
                  <FiEdit />
                  문의사항 수정
                </ActionButton>
              )}
              {/* 일반 사용자만 삭제 버튼 노출 */}
              {!isAdmin && (
                <ActionButton variant="danger" onClick={handleDeleteInquiry}>
                  <FiTrash2 />
                  문의사항 삭제
                </ActionButton>
              )}
            </>
          )}
        </HeaderActions>
      </Header>

      <ContentSection>
        {isEditing ? (
          <input value={editedContent} onChange={e => setEditedContent(e.target.value)} style={{width: '100%', minHeight: 120, padding: 12, border: '1px solid #d1d5db', borderRadius: 8, fontSize: 15}} />
        ) : (
          <p>{inquiry.content}</p>
        )}
      </ContentSection>

      {/* 답변 목록 */}
      <Section>
        <SectionTitle>답변 목록</SectionTitle>
        <AnswerList ref={answerListRef}>
          {answers.length === 0 ? (
            <div style={{ color: '#888', padding: '16px 0' }}>아직 등록된 답변이 없습니다.</div>
          ) : (
            answers.map((answer) => (
              <AnswerItem key={answer.id}>
                <AnswerHeader>
                  <AnswerMeta>
                    <Badge type="role">관리자</Badge>
                    <span>{answer.authorName}</span>
                    <span>{formatDate(answer.createdAt)}</span>
                  </AnswerMeta>
                  {/* 답변완료 상태가 아니고, 관리자일 때만 수정/삭제 버튼 노출 */}
                  {isAdmin && isWaiting && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {editingAnswerId === answer.id ? null : (
                        <ActionButton
                          variant="default"
                          style={{ padding: '6px 10px', fontSize: '13px' }}
                          onClick={() => handleEditAnswer(answer.id, answer.content)}
                        >
                          <FiEdit /> 수정
                        </ActionButton>
                      )}
                      <ActionButton variant="danger" style={{ padding: '6px 10px', fontSize: '13px' }} onClick={() => handleDeleteAnswer(answer.id)}>
                        <FiTrash2 /> 삭제
                      </ActionButton>
                    </div>
                  )}
                </AnswerHeader>
                {editingAnswerId === answer.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <TextArea
                      value={editedAnswerContent}
                      onChange={e => setEditedAnswerContent(e.target.value)}
                      rows={4}
                    />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <ActionButton variant="primary" onClick={() => handleSaveAnswer(answer.id)}>
                        저장
                      </ActionButton>
                      <ActionButton variant="default" onClick={handleCancelEditAnswer}>
                        취소
                      </ActionButton>
                    </div>
                  </div>
                ) : (
                  <AnswerContent>{answer.content}</AnswerContent>
                )}
              </AnswerItem>
            ))
          )}
        </AnswerList>
        {/* 페이지네이션 UI */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 24 }}>
          {answers.length === 0 ? (
            <span style={{ fontWeight: 600 }}>1</span>
          ) : (
            <>
              <button
                onClick={() => handlePageChange(answerPage.number - 1)}
                disabled={answerPage.number === 0}
                style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #ddd', background: answerPage.number === 0 ? '#f3f4f6' : '#fff', cursor: answerPage.number === 0 ? 'not-allowed' : 'pointer' }}
              >
                이전
              </button>
              <span style={{ fontWeight: 600 }}>
                {answerPage.number + 1} / {answerPage.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(answerPage.number + 1)}
                disabled={answerPage.number + 1 >= answerPage.totalPages}
                style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #ddd', background: answerPage.number + 1 >= answerPage.totalPages ? '#f3f4f6' : '#fff', cursor: answerPage.number + 1 >= answerPage.totalPages ? 'not-allowed' : 'pointer' }}
              >
                다음
              </button>
            </>
          )}
        </div>
      </Section>

      {/* 답변 작성 UI (관리자만) */}
      {isAdmin && (
        <Section>
          <SectionTitle>답변 작성</SectionTitle>
          <AnswerForm ref={answerFormRef} onSubmit={handleSubmitAnswer}>
            <TextArea
              placeholder="답변을 입력해주세요... (최대 1000자)"
              value={answerContent}
              onChange={e => setAnswerContent(e.target.value)}
              maxLength={1000}
              onKeyDown={handleAnswerKeyDown}
            />
            <SubmitButton variant="primary" type="submit">
              답변 등록
            </SubmitButton>
          </AnswerForm>
        </Section>
      )}
    </PageContainer>
  );
}

// 답변 목록 스타일 복구
const AnswerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AnswerItem = styled.div`
  background-color: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
`;

const AnswerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const AnswerMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #4b5565;
`;

const AnswerContent = styled.p`
  font-size: 15px;
  color: #374151;
  line-height: 1.6;
`; 