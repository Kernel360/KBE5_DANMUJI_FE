import {
    Wrapper,
    Inner,
    Name,
    SectionTitle,
    CompanyCard,
    CompanyHeader,
    CompanyList,
    MemberCard,
    MemberRow,
    Position,
    UnifiedCompanyRow,
    CompanyGroup,
  } from './ProjectMemberList.styled';
  
  const ProjectMemberList = () => (
    <Wrapper>
      <Inner>
        <UnifiedCompanyRow>
          <CompanyGroup>
            <SectionTitle>고객사</SectionTitle>
            <CompanyList>
              <CompanyCard>
                <CompanyHeader>ABC 기업</CompanyHeader>
                <MemberCard>
                  <MemberRow><Name>김고객</Name> <Position>팀장</Position></MemberRow>
                  <MemberRow><Name>이사용자</Name> <Position>매니저</Position></MemberRow>
                </MemberCard>
              </CompanyCard>
            </CompanyList>
          </CompanyGroup>
  
          <CompanyGroup>
            <SectionTitle>개발사</SectionTitle>
            <CompanyList>
              <CompanyCard>
                <CompanyHeader>디벨롭 컴퍼니</CompanyHeader>
                <MemberCard>
                  <MemberRow><Name>이개발</Name> <Position>PM</Position></MemberRow>
                  <MemberRow><Name>김코드</Name> <Position>프론트엔드</Position></MemberRow>
                </MemberCard>
              </CompanyCard>
  
              <CompanyCard>
                <CompanyHeader>코드베이스</CompanyHeader>
                <MemberCard>
                  <MemberRow><Name>박백엔드</Name> <Position>백엔드</Position></MemberRow>
                </MemberCard>
              </CompanyCard>
            </CompanyList>
          </CompanyGroup>
        </UnifiedCompanyRow>
      </Inner>
    </Wrapper>
  );
  
  export default ProjectMemberList;
  