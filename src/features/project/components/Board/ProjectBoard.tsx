// components/Board/ProjectBoard.tsx
import {
  Wrapper,
  Filters,
  Select,
  NewButton,
  PostCard,
  SearchInput,
} from './ProjectBoard.styled';

const ProjectBoard = () => {
  return (
    <Wrapper>
      <Filters>
        <Select><option>현재 단계: 개발</option></Select>
        <Select><option>태그: 전체</option></Select>
        <Select><option>정렬: 최신순</option></Select>
        <SearchInput placeholder="게시글 검색..." />
        <NewButton>+ 새 글 작성</NewButton>
      </Filters>

      <PostCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
          <span>API 응답 속도 개선 방안 논의 필요</span>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>2시간 전</span>
        </div>
        <p style={{ marginTop: 4, fontSize: '14px' }}>
          현재 사용자 조회 API의 응답 속도가 평균 2초 이상 소요되고 있어 개선이 필요합니다. <strong>@이개발님 @정백엔드님</strong> 점검 부탁드립니다.
        </p>
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: 6 }}>
          김코딩 · ABC 기업 · IT팀장 · 댓글 5
        </div>
      </PostCard>
    </Wrapper>
  );
};

export default ProjectBoard;
