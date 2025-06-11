import styled from "styled-components";

export const Container = styled.div`
  margin: 0 auto;
  padding: 2rem 1rem;
  background: #f9fafb;
  min-height: 100vh;
  flex: 1;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

export const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: #FDB924;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #FDB924;
  }
`;

export const Card = styled.section`
  background: #fff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  span {
    font-size: 0.875rem;
    color: #6b7280;
  }
`;

export const IconCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ffcf53;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

export const Value = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
`;

export const ActivityCard = styled.section`
  background: #fff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  h4 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1rem;
  }
`;

export const ActivityRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-top: 1px solid #f3f4f6;

  &:first-child {
    border-top: none;
  }
`;

export const OnlineBadge = styled.span`
  background: #22c55e;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  padding: 0.25rem 0.5rem;
  margin-right: 0.5rem;
`;