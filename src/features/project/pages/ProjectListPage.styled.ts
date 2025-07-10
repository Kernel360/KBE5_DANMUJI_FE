import styled from "styled-components";

export const ProjectListContainer = styled.div`
  padding: 32px 32px;
  min-height: 100vh;
`;

export const Header = styled.div`
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 8px;
  padding-left: 16px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 1.4rem;
    background: #fdb924;
    border-radius: 2px;
  }
`;

export const Description = styled.div`
  color: #bdbdbd;
  font-size: 0.9rem;
  margin-bottom: 18px;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  min-height: 470px; /* 2 rows of cards height */
  align-content: start; /* Prevent items from stretching vertically */
`;

export const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.5rem;
  gap: 0.7rem;
`;

export const PaginationInfo = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 0.825rem;
  margin-top: 0.75rem;
  margin-bottom: 0.1rem;
`;

export const PaginationNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
  justify-content: center;
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 0.32rem 0.6rem;
  border: none;
  background: ${({ $active }) => ($active ? "#fdb924" : "#f9fafb")};
  color: ${({ $active }) => ($active ? "#fff" : "#374151")};
  border-radius: 1.2rem;
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  outline: none;
  &:hover:not(:disabled) {
    background: #fbbf24;
    color: #fff;
  }
  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;
