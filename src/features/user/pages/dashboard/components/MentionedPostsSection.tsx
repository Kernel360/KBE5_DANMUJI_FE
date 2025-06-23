import * as S from "../styled/UserDashboardPage.styled";
import { MdAccessTime } from "react-icons/md";
import React from "react";

const MentionedPostsSection = () => (
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
);

export default MentionedPostsSection; 