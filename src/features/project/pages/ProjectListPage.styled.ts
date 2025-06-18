import styled from "styled-components";

export const ProjectListContainer = styled.div`
  padding: 32px 24px;
  min-height: 100vh;
`;

export const Header = styled.div`
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

export const Description = styled.div`
  color: #bdbdbd;
  font-size: 0.9rem;
  margin-bottom: 18px;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;
