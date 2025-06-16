import {
    Wrapper,
    Name,
    SectionTitle,
    CompanyCard,
    CompanyHeader,
    CompanyList,
    MemberCard,
    MemberRow,
    Role,
    UnifiedCompanyRow,
    CompanyGroup,
  } from './ProjectMemberList.styled';
  
  const ProjectMemberList = () => (
    <Wrapper>
      <UnifiedCompanyRow>
        <CompanyGroup>
          <SectionTitle>고객사</SectionTitle>
          <CompanyList count={1}>
            <CompanyCard>
              <CompanyHeader>ABC 기업</CompanyHeader>
              <MemberCard>
                <MemberRow><Name>김고객</Name> <Role>팀장</Role></MemberRow>
                <MemberRow><Name>이사용자</Name> <Role>매니저</Role></MemberRow>
              </MemberCard>
            </CompanyCard>
          </CompanyList>
        </CompanyGroup>
  
        <CompanyGroup>
          <SectionTitle>개발사</SectionTitle>
          <CompanyList count={2}>
            <CompanyCard>
              <CompanyHeader>디벨롭 컴퍼니</CompanyHeader>
              <MemberCard>
                <MemberRow><Name>이개발</Name> <Role>PM</Role></MemberRow>
                <MemberRow><Name>김코드</Name> <Role>프론트엔드</Role></MemberRow>
              </MemberCard>
            </CompanyCard>
  
            <CompanyCard>
              <CompanyHeader>코드베이스</CompanyHeader>
              <MemberCard>
                <MemberRow><Name>박백엔드</Name> <Role>백엔드</Role></MemberRow>
              </MemberCard>
            </CompanyCard>

          </CompanyList>
        </CompanyGroup>
      </UnifiedCompanyRow>
    </Wrapper>
  );
  
  export default ProjectMemberList;
  