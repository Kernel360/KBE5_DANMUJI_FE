# 댓글 및 답변 컴포넌트 구조

## 개요

댓글과 답변 관련 기능을 기능별로 분리하여 재사용 가능하고 유지보수가 용이한 컴포넌트 구조로 개선했습니다.

## 컴포넌트 구조

### 1. 댓글 관련 컴포넌트 (`src/features/board/components/Comment/`)

#### CommentUtils.ts

- `formatCommentDate()`: 날짜 포맷팅
- `formatCommentContent()`: @태그와 "답글" 텍스트 색상 적용
- `organizeComments()`: 댓글을 부모-자식 관계로 구성
- `isCommentAuthor()`: 댓글 작성자 확인
- `getRenderedCommentCount()`: 렌더링되는 댓글 개수 계산

#### CommentItem.tsx

- 개별 댓글 아이템 컴포넌트
- 댓글 수정/삭제/답글 기능 포함
- 재귀적 렌더링 지원 (depth 기반)

#### CommentActions.tsx

- 댓글 액션 버튼들 (수정, 삭제, 답글)
- 수정 모드와 일반 모드 구분

#### CommentForm.tsx

- 댓글 작성 폼 컴포넌트
- 재사용 가능한 폼 컴포넌트

#### CommentList.tsx

- 댓글 목록 컴포넌트
- 댓글 작성 폼과 목록을 포함
- 재귀적 렌더링으로 계층 구조 지원

### 2. 답변 관련 컴포넌트 (`src/features/board/components/Answer/`)

#### AnswerUtils.ts

- `formatAnswerContent()`: @태그와 "답글" 텍스트 색상 적용
- `organizeAnswers()`: 답변을 부모-자식 관계로 구성
- `isAnswerAuthor()`: 답변 작성자 확인
- `getRenderedAnswerCount()`: 렌더링되는 답변 개수 계산

#### AnswerItem.tsx

- 개별 답변 아이템 컴포넌트
- 답변 수정/삭제/답글 기능 포함
- 베스트 답변 표시 기능
- 재귀적 렌더링 지원 (depth 기반)

#### AnswerActions.tsx

- 답변 액션 버튼들 (수정, 삭제, 답글)
- 수정 모드와 일반 모드 구분

#### AnswerForm.tsx

- 답변 작성 폼 컴포넌트
- 재사용 가능한 폼 컴포넌트

### 3. 스타일 파일들

각 컴포넌트별로 분리된 스타일 파일:

- `CommentItem.styled.ts`
- `CommentActions.styled.ts`
- `CommentForm.styled.ts`
- `CommentList.styled.ts`
- `AnswerItem.styled.ts`
- `AnswerActions.styled.ts`
- `AnswerForm.styled.ts`

## 주요 개선사항

### 1. 컴포넌트 분리

- **단일 책임 원칙**: 각 컴포넌트가 하나의 명확한 책임을 가짐
- **재사용성**: CommentForm, CommentActions 등이 여러 곳에서 재사용 가능
- **유지보수성**: 기능별로 분리되어 수정이 용이

### 2. 스타일 분리

- 각 컴포넌트별로 독립적인 스타일 파일
- styled-components를 사용한 타입 안전한 스타일링
- 일관된 디자인 시스템 적용

### 3. 유틸리티 함수 분리

- 공통 로직을 유틸리티 함수로 분리
- 테스트 가능한 순수 함수들
- 재사용 가능한 헬퍼 함수들

### 4. 타입 안전성

- TypeScript를 활용한 타입 안전성 확보
- 인터페이스를 통한 명확한 props 정의
- 제네릭을 활용한 유연한 타입 시스템

## 사용 예시

### 댓글 목록 사용

```tsx
import { CommentList } from "../Comment";

<CommentList
  comments={comments}
  currentUserId={user?.id}
  onCommentSubmit={handleCommentSubmit}
  onCommentEdit={handleCommentEdit}
  onCommentDelete={handleCommentDelete}
  isSubmitting={submittingComment}
/>;
```

### 답변 아이템 사용

```tsx
import { AnswerItem } from "../Answer";

<AnswerItem
  answer={answer}
  currentUserId={user?.id}
  onEdit={handleAnswerEdit}
  onDelete={handleAnswerDelete}
  onReply={handleReplySubmit}
  isSubmitting={submittingAnswer}
  depth={depth}
/>;
```

## 장점

1. **코드 가독성**: 각 컴포넌트가 명확한 역할을 가짐
2. **재사용성**: 다른 페이지에서도 동일한 컴포넌트 사용 가능
3. **테스트 용이성**: 작은 단위로 분리되어 테스트 작성이 쉬움
4. **유지보수성**: 특정 기능 수정 시 해당 컴포넌트만 수정하면 됨
5. **확장성**: 새로운 기능 추가 시 기존 컴포넌트에 영향 없이 확장 가능

## 마이그레이션 완료

- `PostDetailModal`: 분리된 Comment 컴포넌트 사용
- `AnswerDetailModal`: 분리된 Answer 컴포넌트 사용
- 기존 복잡한 인라인 코드 제거
- 일관된 UI/UX 제공
