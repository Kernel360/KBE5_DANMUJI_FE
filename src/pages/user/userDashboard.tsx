import React from 'react';
import * as S from './styled';

const UserDashboard = () => {
  return (
    <S.Container>
      <S.Sidebar>
        <S.LogoSection>
          <S.Logo>D</S.Logo>
          <S.LogoText>Danmuji</S.LogoText>
        </S.LogoSection>
        <S.Menu>
          <S.MenuItem active>대시보드</S.MenuItem>
          <S.MenuItem>프로젝트 관리</S.MenuItem>
          <S.MenuItem>분석 리포트</S.MenuItem>
        </S.Menu>
      </S.Sidebar>
      <S.MainContent>
        <S.Topbar>
          <S.TopbarTitle>프로젝트 대시보드</S.TopbarTitle>
          <S.TopbarRight>
            <S.CompanyName>XYZ 소프트웨어</S.CompanyName>
            <S.DevLabel>이개발</S.DevLabel>
            <S.BellIcon />
          </S.TopbarRight>
        </S.Topbar>
        <S.CardsRow>
          <S.Card>
            <S.CardTitle>진행중인 프로젝트</S.CardTitle>
            <S.CardList>
              <S.CardListItem>
                ERP 시스템 개발 <S.CardListPercent>65%</S.CardListPercent>
              </S.CardListItem>
              <S.CardListItem>
                모바일 앱 리뉴얼 <S.CardListPercent>30%</S.CardListPercent>
              </S.CardListItem>
              <S.CardListItem>
                웹 포털 보안 강화 <S.CardListPercent>85%</S.CardListPercent>
              </S.CardListItem>
            </S.CardList>
          </S.Card>
          <S.Card urgent>
            <S.CardTitle>긴급 작업</S.CardTitle>
            <S.CardList>
              <S.CardListItem>DB 설계 검토 <S.CardUrgent>1일</S.CardUrgent></S.CardListItem>
              <S.CardListItem>UI 승인 요청 <S.CardUrgent>3일</S.CardUrgent></S.CardListItem>
              <S.CardListItem>보안 점검 완료 <S.CardUrgent>오늘</S.CardUrgent></S.CardListItem>
            </S.CardList>
          </S.Card>
          <S.Card mention>
            <S.CardTitle>나에게 온 멘션</S.CardTitle>
            <S.CardList>
              <S.CardListItem>@이개발 검토 부탁드립니다 <S.CardMention>2시간</S.CardMention></S.CardListItem>
              <S.CardListItem>@이개발 회의 참석 요청 <S.CardMention>5시간</S.CardMention></S.CardListItem>
              <S.CardListItem>@이개발 승인 완료했습니다 <S.CardMention>1일</S.CardMention></S.CardListItem>
            </S.CardList>
          </S.Card>
          <S.Card team>
            <S.CardTitle>팀 활동량</S.CardTitle>
            <S.CardList>
              <S.CardListItem>게시글 작성 <S.CardTeam>24개</S.CardTeam></S.CardListItem>
              <S.CardListItem>댓글 작성 <S.CardTeam>156개</S.CardTeam></S.CardListItem>
              <S.CardListItem>승인 처리 <S.CardTeam>18개</S.CardTeam></S.CardListItem>
            </S.CardList>
          </S.Card>
        </S.CardsRow>
        <S.BottomRow>
          <S.ProjectStatusCard>
            <S.CardTitle>프로젝트 진행 현황</S.CardTitle>
            <S.BarChartPlaceholder>Bar Chart</S.BarChartPlaceholder>
          </S.ProjectStatusCard>
          <S.TimelineCard>
            <S.CardTitle>마감 일정 타임라인</S.CardTitle>
            <S.TimelinePlaceholder>Timeline</S.TimelinePlaceholder>
          </S.TimelineCard>
        </S.BottomRow>
      </S.MainContent>
    </S.Container>
  );
};

export default UserDashboard; 