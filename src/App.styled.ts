import styled from "styled-components";

export const AppContainer = styled.div`
  display: flex;
  min-height: 100vh; 
  background-color: #f9fafb;
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const PageContent = styled.div`
  flex: 1;
  /* Removed padding as individual pages should control their own spacing */
`;
