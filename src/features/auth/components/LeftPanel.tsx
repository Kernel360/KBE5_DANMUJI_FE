import React from "react";
import {
  ComponentLeft,
  LeftTitle,
  LeftDesc,
  DescIconContainer,
  DescIconImage,
  DescIconText,
  LockContainer,
  LockIconImage,
  LockTitle,
  LockText,
} from "../components/UserPage.styled";

type Props = {
  showLockInfo?: boolean;
};

export const LeftPanel: React.FC<Props> = ({ showLockInfo = false }) => (
  <ComponentLeft>
    <LeftTitle>단계 별 무리 없는 지원 시스템</LeftTitle>
    <LeftDesc>Project Management System</LeftDesc>
    <DescIconContainer>
      <DescIconImage src="/assets/Check-Icon.png" alt="Check Icon" />
      <DescIconText>효율적인 프로젝트 관리 시스템</DescIconText>
    </DescIconContainer>
    <DescIconContainer>
      <DescIconImage src="/assets/Team-Icon.png" alt="Team Icon" />
      <DescIconText>팀 협업 및 커뮤니케이션 향상</DescIconText>
    </DescIconContainer>
    <DescIconContainer>
      <DescIconImage src="/assets/Chart-Icon.png" alt="Chart Icon" />
      <DescIconText>실시간 데이터 분석 및 보고서</DescIconText>
    </DescIconContainer>

    {showLockInfo && (
      <>
        <LockContainer>
          <LockIconImage src="/assets/Lock-Icon.png" alt="Lock Icon" />
          <LockTitle>보안 정보</LockTitle>
        </LockContainer>
        <LockText>
          <br /> 이메일로 전송된 링크는 30분 동안 유효합니다.
          <br />
          개인정보 보호를 위해 링크를 공유하지 마세요.
        </LockText>
      </>
    )}
  </ComponentLeft>
);
