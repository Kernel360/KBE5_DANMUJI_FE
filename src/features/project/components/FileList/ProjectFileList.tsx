// components/FileList/ProjectFileList.tsx
import {
  Wrapper,
  Title,
  FileName,
  FileLink,
} from './ProjectFileList.styled';

const ProjectFileList = () => {
  return (
    <Wrapper>
      <Title>첨부 파일</Title>
      <FileName>시스템 아키텍처 다이어그램 공유</FileName>
      <FileLink href="#">system_architecture.v2.pdf (2.33MB)</FileLink>
    </Wrapper>
  );
};

export default ProjectFileList;
