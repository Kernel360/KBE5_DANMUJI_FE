import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { FiEdit, FiTrash2, FiMessageSquare } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";

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

// Dummy Data
const dummyInquiry = {
  id: 1,
  title: "안녕하세요",
  content: "안녕하세요",
  authorName: "김고객",
  createdAt: "2025.06.18",
  status: "WAITING", // 'WAITING' or 'COMPLETED'
  answers: [
    {
      id: 1,
      authorName: "박관리",
      content: "네",
      createdAt: "2025.06.18 오전 11:0",
    },
    {
      id: 2,
      authorName: "이관리",
      content: "안녕하세요",
      createdAt: "2025.06.18 오전 11:0",
    },
  ],
};


export default function InquiryDetailPage() {
  const { inquiryId } = useParams();
  const { role } = useAuth(); // Assuming useAuth provides { ... , role: 'ROLE_ADMIN' | 'ROLE_USER' }
  const [inquiry, setInquiry] = useState(dummyInquiry);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  
  // Replace with actual API call
  useEffect(() => {
    // fetchInquiry(inquiryId);
    setInquiry(dummyInquiry);
    setEditedTitle(dummyInquiry.title);
    setEditedContent(dummyInquiry.content);
  }, [inquiryId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", { title: editedTitle, content: editedContent });
    // API call to update inquiry
    setIsEditing(false);
    setInquiry(prev => ({...prev, title: editedTitle, content: editedContent}));
  };
  
  if (!inquiry) {
    return <PageContainer>문의사항을 찾을 수 없습니다.</PageContainer>;
  }

  const isAdmin = role === 'ROLE_ADMIN';
  const isWaiting = inquiry.status === 'WAITING';

  return (
    <PageContainer>
      <Header>
        <HeaderInfo>
          <StatusBadges>
            <Badge type="status">
              {isWaiting ? "답변 대기" : "답변완료"}
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
            <span>작성일 {inquiry.createdAt}</span>
          </MetaInfo>
        </HeaderInfo>
        <HeaderActions>
          {isEditing ? (
            <ActionButton variant="primary" onClick={handleSaveChanges}>저장하기</ActionButton>
          ) : (
            <>
              {isAdmin && isWaiting && (
                <ActionButton variant="primary">답변 완료하기</ActionButton>
              )}
              <ActionButton variant="default" onClick={handleEditToggle}>
                <FiEdit />
                문의사항 수정
              </ActionButton>
              <ActionButton variant="danger">
                <FiTrash2 />
                문의사항 삭제
              </ActionButton>
            </>
          )}
        </HeaderActions>
      </Header>

      <ContentSection>
        {isEditing ? (
          <TextArea 
            value={editedContent}
            onChange={e => setEditedContent(e.target.value)}
            rows={10}
          />
        ) : (
          <p>{inquiry.content}</p>
        )}
      </ContentSection>

      <Section>
        <SectionTitle>답변 목록</SectionTitle>
        <AnswerList>
          {inquiry.answers.map((answer) => (
            <AnswerItem key={answer.id}>
              <AnswerHeader>
                <AnswerMeta>
                  <Badge type="role">관리자</Badge>
                  <span>{answer.authorName}</span>
                  <span>{answer.createdAt}</span>
                </AnswerMeta>
                {isAdmin && <ActionButton variant="danger" style={{padding: '6px 10px', fontSize: '13px'}}><FiTrash2/> 삭제</ActionButton>}
              </AnswerHeader>
              <AnswerContent>{answer.content}</AnswerContent>
            </AnswerItem>
          ))}
        </AnswerList>
      </Section>
      
      {isAdmin && (
        <Section>
          <SectionTitle>답변 작성</SectionTitle>
          <AnswerForm>
            <TextArea placeholder="답변을 입력해주세요... (최대 1000자)" />
            <SubmitButton variant="primary">
              <FiMessageSquare />
              답변 등록
            </SubmitButton>
          </AnswerForm>
        </Section>
      )}
    </PageContainer>
  );
} 