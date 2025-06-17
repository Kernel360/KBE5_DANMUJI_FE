import styled from 'styled-components';

export const ProjectListContainer = styled.div`
  padding: 32px 24px;
  min-height: 100vh;
`;

export const Header = styled.div`
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 1.7rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

export const Description = styled.div`
  color: #bdbdbd;
  font-size: 1.08rem;
  margin-bottom: 18px;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 32px;
  margin-bottom: 32px;
`;