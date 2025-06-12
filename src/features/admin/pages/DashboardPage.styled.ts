import styled from "styled-components";

export const DashboardContainer = styled.div`
  flex: 1;
  padding: 32px;
  background-color: #f9fafb;
  min-height: 100vh; 
`;

export const Header = styled.div`
  margin-bottom: 36px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
`;

export const Description = styled.p`
  color: #6b7280;
  font-size: 14px;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const Card = styled.div<{ $bgcolor: string }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  background-color: ${(props) => props.$bgcolor};
`;

export const IconContainer = styled.div<{ $iconbgcolor: string }>`
  border-radius: 9999px;
  padding: 0.75rem;
  background-color: white;
  color: ${(props) => props.$iconbgcolor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Icon = styled.img`
  height: 1.75rem;
  width: 1.75rem;
`;

export const CardContent = styled.div`

  `;

export const CardValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
`;

export const CardLabel = styled.div`
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
  margin-top: 0.25rem;
`;

export const RecentActivityContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const RecentActivityCard = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
`;

export const RecentActivityTitle = styled.div`
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: 1rem;
`;

export const RecentActivityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  dividing-line: 1px solid #e5e7eb;
`;

export const RecentActivityItem = styled.li`
  padding: 0.5rem 0;
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  border-bottom: 1px solid #e5e7eb; /* divide-y */

  &:last-child {
    border-bottom: none;
  }
`;

export const RecentActivityDate = styled.span`
  color: #9ca3af;
`;
