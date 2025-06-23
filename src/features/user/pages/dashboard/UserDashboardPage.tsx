import { useNavigate } from 'react-router-dom';
import * as S from './styled/UserDashboardPage.styled';
import {
  MdOutlineViewHeadline,
  MdAccessTime,
  MdWarning,
  MdAssignment,
} from 'react-icons/md';

const UserDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <S.Container>
      <S.MainContent>
        {/* 대시보드 헤더 */}
        <S.DashboardHeader>
          <S.DashboardTitle>대시보드</S.DashboardTitle>
          <S.DashboardDescription>
            오늘의 프로젝트 현황과 주요 알림을 한눈에 확인하세요
          </S.DashboardDescription>
        </S.DashboardHeader>

        {/* 레이아웃 */}
        <S.LayoutGrid>
          {/* 왼쪽 영역 */}
          <S.LeftColumn>
            {/* 프로젝트 진행률 */}
            <S.Section>
              <S.ProgressSectionTitleRow>
                <S.SectionTitle color="#1abc7b">내 프로젝트 진행률</S.SectionTitle>
                <S.ViewAllButton onClick={() => navigate('/projects')}>
                  전체 보기
                  <S.ViewAllButtonIcon>
                    <MdOutlineViewHeadline />
                  </S.ViewAllButtonIcon>
                </S.ViewAllButton>
              </S.ProgressSectionTitleRow>
              <S.ProgressList>
                <S.ProgressItem>
                  <S.ProgressLabel>모바일 앱 리뉴얼 프로젝트</S.ProgressLabel>
                  <S.ProgressPercent>75%</S.ProgressPercent>
                  <S.ProgressBarWrap>
                    <S.ProgressBar percent={75} />
                  </S.ProgressBarWrap>
                </S.ProgressItem>
                <S.ProgressItem>
                  <S.ProgressLabel>웹사이트 개편 작업</S.ProgressLabel>
                  <S.ProgressPercent>45%</S.ProgressPercent>
                  <S.ProgressBarWrap>
                    <S.ProgressBar percent={45} />
                  </S.ProgressBarWrap>
                </S.ProgressItem>
                <S.ProgressItem>
                  <S.ProgressLabel>API 통합 개발</S.ProgressLabel>
                  <S.ProgressPercent>90%</S.ProgressPercent>
                  <S.ProgressBarWrap>
                    <S.ProgressBar percent={90} />
                  </S.ProgressBarWrap>
                </S.ProgressItem>
              </S.ProgressList>
            </S.Section>

            {/* 언급된 게시글 */}
            <S.MentionedSection>
              <S.SectionTitle>언급된 게시글</S.SectionTitle>
              <S.MentionedCard color="yellow">
                <S.MentionedTitle>UI/UX 피드백 요청</S.MentionedTitle>
                <S.MentionedDesc>
                  @김개발님, 메인 페이지 레이아웃에 대한 의견 부탁드립니다.
                </S.MentionedDesc>
                <S.MentionedMeta>
                  <MdAccessTime /> 2시간 전
                </S.MentionedMeta>
              </S.MentionedCard>
              <S.MentionedCard color="blue">
                <S.MentionedTitle>코드 리뷰 완료</S.MentionedTitle>
                <S.MentionedDesc>
                  @김개발님이 작성한 컴포넌트 리뷰가 완료되었습니다.
                </S.MentionedDesc>
                <S.MentionedMeta>
                  <MdAccessTime /> 5시간 전
                </S.MentionedMeta>
              </S.MentionedCard>
            </S.MentionedSection>
          </S.LeftColumn>

          {/* 오른쪽 영역 */}
          <S.RightColumn>
            {/* 우선순위 높은 게시글 */}
            <S.PrioritySection>
              <S.SectionTitle color="#e74c3c">우선순위 높은 게시글</S.SectionTitle>
              <S.PriorityCard>
                <S.PriorityHeader>
                  <S.PriorityLabel>
                    <MdWarning style={{ marginRight: 6 }} />
                    긴급 버그 수정 요청
                  </S.PriorityLabel>
                  <S.PriorityTag>긴급</S.PriorityTag>
                </S.PriorityHeader>
                <S.PriorityDesc>
                  최신 모듈에서 오류가 발생하고 있습니다. 즉시 확인 부탁드립니다.
                </S.PriorityDesc>
                <S.PriorityMeta>
                  <span><MdAccessTime /> 30분 전</span>
                  <span><MdAssignment /> 5</span>
                </S.PriorityMeta>
              </S.PriorityCard>
              <S.PriorityCard>
                <S.PriorityHeader>
                  <S.PriorityLabel>
                    <MdWarning style={{ marginRight: 6 }} />
                    클라이언트 승인 대기
                  </S.PriorityLabel>
                  <S.PriorityTag type="yellow">보류</S.PriorityTag>
                </S.PriorityHeader>
                <S.PriorityDesc>
                  최종 디자인안에 대한 클라이언트 피드백이 필요합니다.
                </S.PriorityDesc>
                <S.PriorityMeta>
                  <span><MdAccessTime /> 1시간 전</span>
                  <span><MdAssignment /> 3</span>
                </S.PriorityMeta>
              </S.PriorityCard>
            </S.PrioritySection>

            {/* 최신 게시글 */}
            <S.LatestSection>
              <S.SectionTitle>진행 중인 프로젝트 최신 게시글</S.SectionTitle>
              <S.LatestCard>
                <S.LatestTitle>디자인 시스템 업데이트</S.LatestTitle>
                <S.LatestDesc>새로운 컴포넌트가 추가되었습니다.</S.LatestDesc>
                <S.LatestMeta>
                  <S.LatestTag color="blue">모바일 앱 리뉴얼</S.LatestTag>
                  <span><MdAccessTime /> 1시간 전</span>
                </S.LatestMeta>
              </S.LatestCard>
              <S.LatestCard>
                <S.LatestTitle>테스트 결과 공유</S.LatestTitle>
                <S.LatestDesc>QA 테스트가 완료되었습니다.</S.LatestDesc>
                <S.LatestMeta>
                  <S.LatestTag color="yellow">웹사이트 개편</S.LatestTag>
                  <span><MdAccessTime /> 3시간 전</span>
                </S.LatestMeta>
              </S.LatestCard>
              <S.LatestCard>
                <S.LatestTitle>API 문서 업데이트</S.LatestTitle>
                <S.LatestDesc>새로운 엔드포인트가 추가되었습니다.</S.LatestDesc>
                <S.LatestMeta>
                  <S.LatestTag color="green">API 통합 개발</S.LatestTag>
                  <span><MdAccessTime /> 5시간 전</span>
                </S.LatestMeta>
              </S.LatestCard>
            </S.LatestSection>
          </S.RightColumn>
        </S.LayoutGrid>
      </S.MainContent>
    </S.Container>
  );
};

export default UserDashboardPage;
