import type { Answer } from "@/features/project/types/question";

// 답변 내용에서 @태그와 "답글" 텍스트에 색상을 적용하는 함수
export const formatAnswerContent = (content: string) => {
  const parts = content.split(/(@\w+|답글)/);
  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      return (
        <span key={index} style={{ color: "#fdb924", fontWeight: "600" }}>
          {part}
        </span>
      );
    } else if (part === "답글") {
      return (
        <span key={index} style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
          {part}
        </span>
      );
    }
    return part;
  });
};

// 답변을 부모-자식 관계로 구성하는 함수
export const organizeAnswers = (answers: Answer[]) => {
  const answerMap = new Map<number, AnswerWithReplies>();
  const rootAnswers: AnswerWithReplies[] = [];

  // 모든 답변을 Map에 추가
  answers.forEach((answer) => {
    answerMap.set(answer.id, { ...answer, replies: [] });
  });

  // 부모-자식 관계 구성
  answers.forEach((answer) => {
    const answerWithReplies = answerMap.get(answer.id)!;
    if (answer.parentId) {
      const parent = answerMap.get(answer.parentId);
      if (parent) {
        parent.replies.push(answerWithReplies);
      }
    } else {
      rootAnswers.push(answerWithReplies);
    }
  });

  return rootAnswers;
};

// 답변 작성자 확인 함수
export const isAnswerAuthor = (
  answerAuthorId: number,
  currentUserId?: number
) => {
  return currentUserId === answerAuthorId;
};

// 렌더링되는 답변 개수 계산 함수
export const getRenderedAnswerCount = (answers: Answer[]) => {
  const visibleAnswers = answers.filter(
    (answer) => !answer.deletedAt && answer.status !== "DELETED"
  );

  const rootAnswers = visibleAnswers.filter((answer) => !answer.parentId);
  let totalCount = 0;

  rootAnswers.forEach((rootAnswer) => {
    totalCount++; // 루트 답변 카운트

    // 이 답변을 부모로 하는 모든 답글(1,2,3...depth) 카운트
    const replies = visibleAnswers.filter((a) => {
      let parent = a.parentId;
      while (parent) {
        if (parent === rootAnswer.id) return true;
        const parentAnswer = visibleAnswers.find((aa) => aa.id === parent);
        parent = parentAnswer?.parentId ?? null;
      }
      return false;
    });

    totalCount += replies.length; // 답글들 카운트
  });

  return totalCount;
};

// 답변 타입 확장
export interface AnswerWithReplies extends Answer {
  replies: AnswerWithReplies[];
}
