import * as S from "../styled/UserDashboardPage.styled";
import { MdAccessTime } from "react-icons/md";
import React from "react";

const LatestPostsSection = () => (
  <S.LatestSection>
    <S.SectionTitle>진행 중인 프로젝트 최신 게시글</S.SectionTitle>
    <S.LatestCard>
      <S.LatestTitle>디자인 시스템 업데이트</S.LatestTitle>
      <S.LatestDesc>새로운 컴포넌트가 추가되었습니다.</S.LatestDesc>
      <S.LatestMeta>
        <S.LatestTag color="blue">모바일 앱 리뉴얼</S.LatestTag>
        <span>
          <MdAccessTime /> 1시간 전
        </span>
      </S.LatestMeta>
    </S.LatestCard>
    <S.LatestCard>
      <S.LatestTitle>테스트 결과 공유</S.LatestTitle>
      <S.LatestDesc>QA 테스트가 완료되었습니다.</S.LatestDesc>
      <S.LatestMeta>
        <S.LatestTag color="yellow">웹사이트 개편</S.LatestTag>
        <span>
          <MdAccessTime /> 3시간 전
        </span>
      </S.LatestMeta>
    </S.LatestCard>
    <S.LatestCard>
      <S.LatestTitle>API 문서 업데이트</S.LatestTitle>
      <S.LatestDesc>새로운 엔드포인트가 추가되었습니다.</S.LatestDesc>
      <S.LatestMeta>
        <S.LatestTag color="green">API 통합 개발</S.LatestTag>
        <span>
          <MdAccessTime /> 5시간 전
        </span>
      </S.LatestMeta>
    </S.LatestCard>
  </S.LatestSection>
);

export default LatestPostsSection; 