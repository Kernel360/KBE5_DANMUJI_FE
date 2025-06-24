import * as S from "../styled/UserDashboardPage.styled";
import { MdWarning, MdAccessTime, MdAssignment } from "react-icons/md";

const PriorityPostsSection = () => (
  <S.PrioritySection>
    <S.SectionTitle color="#e74c3c">
      우선순위 높은 게시글
    </S.SectionTitle>
    <S.PriorityCard>
      <S.PriorityHeader>
        <S.PriorityLabel>
          <MdWarning style={{ marginRight: 6 }} />
          긴급 버그 수정 요청
        </S.PriorityLabel>
        <S.PriorityTag>긴급</S.PriorityTag>
      </S.PriorityHeader>
      <S.PriorityDesc>
        최신 모듈에서 오류가 발생하고 있습니다. 즉시 확인
        부탁드립니다.
      </S.PriorityDesc>
      <S.PriorityMeta>
        <span>
          <MdAccessTime /> 30분 전
        </span>
        <span>
          <MdAssignment /> 5
        </span>
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
        <span>
          <MdAccessTime /> 1시간 전
        </span>
        <span>
          <MdAssignment /> 3
        </span>
      </S.PriorityMeta>
    </S.PriorityCard>
  </S.PrioritySection>
);

export default PriorityPostsSection; 