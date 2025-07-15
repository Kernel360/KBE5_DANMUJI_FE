import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FiX } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import api from "@/api/axios";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
`;
const ModalPanel = styled.div`
  background: #fff;
  width: 100%;
  max-width: 600px;
  height: 100%;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  border-radius: 12px 0 0 12px;
  animation: slideIn 0.32s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
const ModalHeader = styled.div`
  padding: 1rem 1rem 0.7rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  &:hover {
    color: #1f2937;
  }
`;
const ModalBody = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

interface InquiryDetailModalProps {
  open: boolean;
  onClose: () => void;
  inquiryId: number;
}

const InquiryDetailModal: React.FC<InquiryDetailModalProps> = ({
  open,
  onClose,
  inquiryId,
}) => {
  const { role } = useAuth();
  const [inquiry, setInquiry] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [answerContent, setAnswerContent] = useState("");
  const [answers, setAnswers] = useState<any[]>([]);
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

  useEffect(() => {
    if (!open) return;
    async function fetchInquiry() {
      try {
        const res = await api.get(`/api/inquiries/${inquiryId}`);
        setInquiry(res.data.data);
        setEditedTitle(res.data.data.title);
        setEditedContent(res.data.data.content);
      } catch {
        setInquiry(null);
      }
    }
    fetchInquiry();
  }, [open, inquiryId]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

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
    if (e.key === "Enter" && !e.shiftKey) {
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
      await api.put(`/api/inquiries/${inquiryId}/admin`, {
        status: "ANSWERED",
      });
      // 완료 후 상세 정보 갱신
      if (inquiryId) {
        const res = await api.get(`/api/inquiries/${inquiryId}`);
        const data = res.data.data;
        setInquiry(data);
        setEditedTitle(data.title);
        setEditedContent(data.content);
      }
    } catch {
      alert("답변 완료 처리에 실패했습니다.");
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
      await api.put(`/api/answers/${answerId}`, {
        content: editedAnswerContent,
      });
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
      await api.put(`/api/inquiries/${inquiryId}/admin`, { status: "WAITING" });
      // 상태 변경 후 상세 정보 갱신
      if (inquiryId) {
        const res = await api.get(`/api/inquiries/${inquiryId}`);
        const data = res.data.data;
        setInquiry(data);
        setEditedTitle(data.title);
        setEditedContent(data.content);
      }
    } catch {
      alert("답변 다시하기 처리에 실패했습니다.");
    }
  };

  // 문의사항 삭제
  const handleDeleteInquiry = async () => {
    if (!window.confirm("정말로 이 문의사항을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/inquiries/${inquiryId}`);
      // 일반 유저는 my-inquiry로, 관리자는 inquiry로 이동
      if (role === "ROLE_USER") {
        onClose(); // 모달 닫기
      } else {
        onClose(); // 모달 닫기
      }
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

  useEffect(() => {
    if (inquiryId) {
      fetchAnswers(0);
    }
  }, [inquiryId]);

  const isAdmin = role === "ROLE_ADMIN";
  const isWaiting = inquiry?.inquiryStatus === "WAITING";

  // 날짜 포맷 (YYYY-MM-DD HH:mm)
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
  }

  return (
    <ModalOverlay
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <ModalPanel>
        <ModalHeader>
          <ModalTitle>문의 상세</ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          {inquiry ? (
            <>
              <h3 style={{ fontWeight: 700, fontSize: 20 }}>{inquiry.title}</h3>
              <div style={{ color: "#6b7280", marginBottom: 12 }}>
                작성자: {inquiry.authorName}
              </div>
              <div style={{ margin: "16px 0", color: "#374151", fontSize: 16 }}>
                {inquiry.content}
              </div>
              <div style={{ color: "#6b7280", marginTop: 16 }}>
                작성일: {formatDate(inquiry.createdAt)}
              </div>
              <div style={{ color: "#6b7280", marginTop: 16 }}>
                상태:{" "}
                {inquiry.inquiryStatus === "WAITING" ? "답변 대기" : "답변완료"}
              </div>

              {isEditing ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginTop: 20,
                  }}
                >
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: "18px",
                      fontWeight: 700,
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "8px",
                      fontFamily:
                        "Pretendard, Noto Sans KR, Roboto, Arial, sans-serif",
                      lineHeight: 1.2,
                    }}
                    maxLength={100}
                  />
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    style={{
                      minHeight: 120,
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      fontSize: "15px",
                      resize: "vertical",
                    }}
                    maxLength={255}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={handleSaveChanges}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 6,
                        border: "1px solid #22c55e",
                        background: "#22c55e",
                        color: "#fff",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "opacity 0.2s",
                      }}
                    >
                      저장하기
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 6,
                        border: "1px solid #d1d5db",
                        background: "#fff",
                        color: "#4b5565",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "opacity 0.2s",
                      }}
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* 답변 대기 상태: 답변 완료하기, 답변완료 상태: 답변 다시하기 */}
                  {isAdmin && isWaiting && (
                    <button
                      onClick={handleCompleteInquiry}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 6,
                        border: "1px solid #22c55e",
                        background: "#22c55e",
                        color: "#fff",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "opacity 0.2s",
                      }}
                    >
                      답변 완료하기
                    </button>
                  )}
                  {isAdmin && !isWaiting && (
                    <button
                      onClick={handleReopenInquiry}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 6,
                        border: "1px solid #d1d5db",
                        background: "#fff",
                        color: "#4b5565",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "opacity 0.2s",
                      }}
                    >
                      답변 다시하기
                    </button>
                  )}
                  {/* 일반 사용자만 수정/삭제 버튼 노출: inquiryStatus가 WAITING일 때만 */}
                  {!isAdmin && inquiry.inquiryStatus === "WAITING" && (
                    <>
                      <button
                        onClick={handleEditToggle}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 6,
                          border: "1px solid #4f46e5",
                          background: "#4f46e5",
                          color: "#fff",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "opacity 0.2s",
                        }}
                      >
                        문의사항 수정
                      </button>
                      <button
                        onClick={handleDeleteInquiry}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 6,
                          border: "1px solid #ef4444",
                          background: "#ef4444",
                          color: "#fff",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "opacity 0.2s",
                        }}
                      >
                        문의사항 삭제
                      </button>
                    </>
                  )}
                </>
              )}

              <div
                style={{
                  marginTop: 20,
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: 12,
                }}
              >
                <h4 style={{ fontSize: 18, fontWeight: 600, color: "#1f2937" }}>
                  답변 목록
                </h4>
              </div>
              {answers.length === 0 ? (
                <div style={{ color: "#888", padding: "16px 0" }}>
                  아직 등록된 답변이 없습니다.
                </div>
              ) : (
                answers.map((answer) => (
                  <div
                    key={answer.id}
                    style={{
                      background: "#f9fafb",
                      padding: 20,
                      borderRadius: 12,
                      border: "1px solid #f3f4f6",
                      marginTop: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          fontSize: 14,
                          color: "#4b5565",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>관리자</span>
                        <span>{answer.authorName}</span>
                        <span>{formatDate(answer.createdAt)}</span>
                      </div>
                      {isAdmin && isWaiting && (
                        <div style={{ display: "flex", gap: "8px" }}>
                          {editingAnswerId === answer.id ? null : (
                            <button
                              onClick={() =>
                                handleEditAnswer(answer.id, answer.content)
                              }
                              style={{
                                padding: "6px 10px",
                                borderRadius: 6,
                                border: "1px solid #4f46e5",
                                background: "#4f46e5",
                                color: "#fff",
                                fontSize: "13px",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "opacity 0.2s",
                              }}
                            >
                              수정
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAnswer(answer.id)}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 6,
                              border: "1px solid #ef4444",
                              background: "#ef4444",
                              color: "#fff",
                              fontSize: "13px",
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "opacity 0.2s",
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                    {editingAnswerId === answer.id ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <textarea
                          value={editedAnswerContent}
                          onChange={(e) =>
                            setEditedAnswerContent(e.target.value)
                          }
                          rows={4}
                          style={{
                            width: "100%",
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            fontSize: "15px",
                            resize: "vertical",
                          }}
                          maxLength={255}
                        />
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            onClick={() => handleSaveAnswer(answer.id)}
                            style={{
                              padding: "8px 16px",
                              borderRadius: 6,
                              border: "1px solid #22c55e",
                              background: "#22c55e",
                              color: "#fff",
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "opacity 0.2s",
                            }}
                          >
                            저장
                          </button>
                          <button
                            onClick={handleCancelEditAnswer}
                            style={{
                              padding: "8px 16px",
                              borderRadius: 6,
                              border: "1px solid #d1d5db",
                              background: "#fff",
                              color: "#4b5565",
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "opacity 0.2s",
                            }}
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p
                        style={{
                          fontSize: 15,
                          color: "#374151",
                          lineHeight: 1.6,
                        }}
                      >
                        {answer.content}
                      </p>
                    )}
                  </div>
                ))
              )}
              {/* 페이지네이션 UI */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 16,
                  marginTop: 24,
                }}
              >
                {answers.length === 0 ? (
                  <span style={{ fontWeight: 600 }}>1</span>
                ) : (
                  <>
                    <button
                      onClick={() => handlePageChange(answerPage.number - 1)}
                      disabled={answerPage.number === 0}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: "1px solid #ddd",
                        background:
                          answerPage.number === 0 ? "#f3f4f6" : "#fff",
                        cursor:
                          answerPage.number === 0 ? "not-allowed" : "pointer",
                      }}
                    >
                      이전
                    </button>
                    <span style={{ fontWeight: 600 }}>
                      {answerPage.number + 1} / {answerPage.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(answerPage.number + 1)}
                      disabled={answerPage.number + 1 >= answerPage.totalPages}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: "1px solid #ddd",
                        background:
                          answerPage.number + 1 >= answerPage.totalPages
                            ? "#f3f4f6"
                            : "#fff",
                        cursor:
                          answerPage.number + 1 >= answerPage.totalPages
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      다음
                    </button>
                  </>
                )}
              </div>

              {/* 답변 작성 UI (관리자만, 그리고 WAITING 상태일 때만) */}
              {isAdmin && inquiry.inquiryStatus === "WAITING" && (
                <div
                  style={{
                    marginTop: 20,
                    borderBottom: "1px solid #e5e7eb",
                    paddingBottom: 12,
                  }}
                >
                  <h4
                    style={{ fontSize: 18, fontWeight: 600, color: "#1f2937" }}
                  >
                    답변 작성
                  </h4>
                </div>
              )}
              {isAdmin && inquiry.inquiryStatus === "WAITING" && (
                <form ref={answerFormRef} onSubmit={handleSubmitAnswer}>
                  <textarea
                    placeholder="답변을 입력해주세요... (최대 255자)"
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                    style={{
                      minHeight: 120,
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      fontSize: "15px",
                      resize: "vertical",
                    }}
                    maxLength={255}
                    onKeyDown={handleAnswerKeyDown}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: "8px 16px",
                      borderRadius: 6,
                      border: "1px solid #22c55e",
                      background: "#22c55e",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "opacity 0.2s",
                      marginTop: 10,
                    }}
                  >
                    답변 등록
                  </button>
                </form>
              )}
            </>
          ) : (
            <div style={{ color: "#888", textAlign: "center", padding: 40 }}>
              로딩 중...
            </div>
          )}
        </ModalBody>
      </ModalPanel>
    </ModalOverlay>
  );
};

export default InquiryDetailModal;
