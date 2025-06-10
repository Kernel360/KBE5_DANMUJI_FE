import styled from "styled-components";

export const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f9fafb;
`;

export const Sidebar = styled.aside`
  width: 240px;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0,0,0,0.03);
  padding-bottom: 2rem;
`;

export const Logo = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
  color: #fdb924;
  border-bottom: 1px solid #f3f4f6;
`;

export const Menu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0 0 0;
  flex: 1;
`;

export const MenuItem = styled.li<{active?: boolean}>`
  padding: 0.75rem 2rem;
  font-weight: 500;
  color: ${({active}) => active ? '#fff' : '#1f2937'};
  background: ${({active}) => active ? '#fdb924' : 'transparent'};
  border-radius: 8px;
  margin: 0.25rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
`;

export const UserProfile = styled.div`
  margin: 2rem 1rem 0;
  padding: 1rem;
  background: #e0e7ff;
  border-radius: 20px;
  text-align: center;
  color: #4f46e5;
  font-weight: 500;
`;

export const Main = styled.main`
  flex: 1;
  padding: 0 2rem;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
  padding: 0 0.5rem;
`;

export const PageTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 900;
  color: #111827;
`;

export const PageDesc = styled.div`
  color: #6b7280;
  font-size: 1rem;
`;

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

export const SearchInput = styled.input`
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  width: 300px;
`;

export const Button = styled.button<{primary?: boolean}>`
  background: ${({primary}) => primary ? '#3b82f6' : '#fff'};
  color: ${({primary}) => primary ? '#fff' : '#3b82f6'};
  border: 1px solid #3b82f6;
  border-radius: 4px;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
`;

export const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
`;

export const ProjectCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  border: 1px solid #e2e8f0;
  width: 290px;
  padding: 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const CardTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
`;

export const StatusBadge = styled.span<{color: string}>`
  display: inline-block;
  padding: 0.2em 0.8em;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: 600;
  background: ${({color}) => color + '22'};
  color: ${({color}) => color};
`;

export const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.95em;
  color: #334155;
`;

export const CardLabel = styled.span`
  color: #64748b;
  min-width: 80px;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const CardButton = styled.button<{primary?: boolean}>`
  flex: 1;
  padding: 0.4rem 0;
  border-radius: 4px;
  border: 1px solid #3b82f6;
  background: ${({primary}) => primary ? '#3b82f6' : '#fff'};
  color: ${({primary}) => primary ? '#fff' : '#3b82f6'};
  font-weight: 500;
  cursor: pointer;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem 0;
`;

export const PaginationBtn = styled.button<{active?: boolean}>`
  padding: 0.4rem 1rem;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  background: ${({active}) => active ? '#3b82f6' : '#fff'};
  color: ${({active}) => active ? '#fff' : '#64748b'};
  font-weight: ${({active}) => active ? 700 : 500};
  cursor: pointer;
`;