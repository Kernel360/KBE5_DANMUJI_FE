import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 24px;
`;

const BoardPage: React.FC = () => {
  return (
    <Container>
      <Title>게시판</Title>
      {/* 게시판 내용은 추후 구현 */}
    </Container>
  );
};

export default BoardPage;
