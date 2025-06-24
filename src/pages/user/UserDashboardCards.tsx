import React from 'react';
import * as S from './UserDashboardCards.styled';

const UserDashboardCards = () => {
  return (
    <S.CardsWrapper>
      <S.Card>
        <S.CardHeader>
          <S.CardHeaderLeft>
            <S.CardIcon role="img">📁</S.CardIcon>
            <S.CardTitle>진행중인 프로젝트</S.CardTitle>
          </S.CardHeaderLeft>
          <S.CardHeaderRight>5개</S.CardHeaderRight>
        </S.CardHeader>
        <S.CardList>
          <S.CardListItem>
            ERP 시스템 개발 <S.Percent color="#65b5f6">65%</S.Percent>
          </S.CardListItem>
          <S.CardListItem>
            모바일 앱 리뉴얼 <S.Percent color="#f6b565">30%</S.Percent>
          </S.CardListItem>
          <S.CardListItem>
            웹 포털 보안 강화 <S.Percent color="#65f6b5">85%</S.Percent>
          </S.CardListItem>
        </S.CardList>
      </S.Card>
      <S.Card>
        <S.CardHeader>
          <S.CardHeaderLeft>
            <S.CardIcon role="img" urgent>⚠️</S.CardIcon>
            <S.CardTitle urgent>긴급 작업</S.CardTitle>
          </S.CardHeaderLeft>
          <S.CardHeaderRight urgent>3개</S.CardHeaderRight>
        </S.CardHeader>
        <S.CardList>
          <S.CardListItem>
            DB 설계 검토 <S.Badge urgent>1일</S.Badge>
          </S.CardListItem>
          <S.CardListItem>
            UI 승인 요청 <S.Badge urgent>3일</S.Badge>
          </S.CardListItem>
          <S.CardListItem>
            보안 점검 완료 <S.Badge urgent>오늘</S.Badge>
          </S.CardListItem>
        </S.CardList>
      </S.Card>
      <S.Card>
        <S.CardHeader>
          <S.CardHeaderLeft>
            <S.CardIcon mention>@</S.CardIcon>
            <S.CardTitle mention>나에게 온 멘션</S.CardTitle>
          </S.CardHeaderLeft>
          <S.CardHeaderRight mention>7개</S.CardHeaderRight>
        </S.CardHeader>
        <S.CardList>
          <S.CardListItem>
            @이개발 검토 부탁드립니다 <S.Badge mention>2시간</S.Badge>
          </S.CardListItem>
          <S.CardListItem>
            @이개발 회의 참석 요청 <S.Badge mention>5시간</S.Badge>
          </S.CardListItem>
          <S.CardListItem>
            @이개발 승인 완료했습니다 <S.Badge mention>1일</S.Badge>
          </S.CardListItem>
        </S.CardList>
      </S.Card>
      <S.Card>
        <S.CardHeader>
          <S.CardHeaderLeft>
            <S.CardIcon team>👥</S.CardIcon>
            <S.CardTitle team>팀 활동량</S.CardTitle>
          </S.CardHeaderLeft>
          <S.CardHeaderRight team>+12%</S.CardHeaderRight>
        </S.CardHeader>
        <S.CardList>
          <S.CardListItem>
            게시글 작성 <S.Badge team>24개</S.Badge>
          </S.CardListItem>
          <S.CardListItem>
            댓글 작성 <S.Badge team>156개</S.Badge>
          </S.CardListItem>
          <S.CardListItem>
            승인 처리 <S.Badge team>18개</S.Badge>
          </S.CardListItem>
        </S.CardList>
      </S.Card>
    </S.CardsWrapper>
  );
};

export default UserDashboardCards; 