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

export const SearchBarContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 32px;
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 10px 16px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  font-size: 1rem;
  background: #fff;
`;

export const SearchButton = styled.button`
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0 24px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #1d4ed8;
  }
`;

export const RegisterButton = styled.button`
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0 18px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  margin-left: auto;
  &:hover {
    background: #1d4ed8;
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

export const ProjectCard = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  padding: 0 0 16px 0;
  display: flex;
  flex-direction: column;
  min-width: 320px;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 0 20px;
`;

export const CardTitle = styled.div`
  font-size: 1.13rem;
  font-weight: 700;
  color: #222;
`;

export const CardStatus = styled.div`
  font-size: 0.98rem;
  font-weight: 600;
  color: #fff;
  border-radius: 8px;
  padding: 2px 14px;
  margin-left: 8px;
`;

export const CardBody = styled.div`
  padding: 12px 20px 0 20px;
`;

export const CardInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.98rem;
  color: #444;
  margin-bottom: 6px;
`;

export const CardFooter = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 12px 20px 0 20px;
`;

export const DetailButton = styled.button`
  background: #fff;
  color: #2563eb;
  border: 1px solid #2563eb;
  border-radius: 6px;
  padding: 4px 18px;
  font-size: 0.98rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #2563eb;
    color: #fff;
  }
`;

export const ManagerButton = styled.button`
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 18px;
  font-size: 0.98rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #1d4ed8;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  background: ${({ $active }) => ($active ? '#2563eb' : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#222')};
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 4px 14px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #2563eb;
    color: #fff;
  }
`; 