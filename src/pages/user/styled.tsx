import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #fafbfc;
`;

export const Sidebar = styled.div`
  width: 250px;
  background: #fff;
  box-shadow: 2px 0 8px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  padding: 32px 0 0 0;
`;

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  padding: 0 32px 32px 32px;
`;

export const Logo = styled.div`
  width: 40px;
  height: 40px;
  background: #ffe066;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffb300;
`;

export const LogoText = styled.div`
  margin-left: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffb300;
`;

export const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
`;

export const MenuItem = styled.div<{active?: boolean}>`
  padding: 12px 32px;
  font-size: 1rem;
  color: #888;
  cursor: pointer;
  border-left: 4px solid transparent;
  ${({active}) => active && css`
    color: #ffb300;
    background: #fffbe6;
    border-left: 4px solid #ffb300;
    font-weight: 600;
  `}
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 32px 32px 0 32px;
`;

export const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const TopbarTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
`;

export const TopbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const CompanyName = styled.div`
  font-size: 1rem;
  color: #888;
`;

export const DevLabel = styled.div`
  font-size: 1rem;
  color: #222;
  font-weight: 600;
`;

export const BellIcon = styled.div`
  width: 24px;
  height: 24px;
  background: url('https://img.icons8.com/ios-filled/50/000000/bell.png') no-repeat center/contain;
`;

export const CardsRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
`;

export const Card = styled.div<{urgent?: boolean; mention?: boolean; team?: boolean}>`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 24px 20px;
  flex: 1;
  min-width: 220px;
  ${({urgent}) => urgent && css`
    border: 1.5px solid #ff6f61;
    background: #fff0f0;
  `}
  ${({mention}) => mention && css`
    border: 1.5px solid #4ecdc4;
    background: #f0fcfa;
  `}
  ${({team}) => team && css`
    border: 1.5px solid #7d5fff;
    background: #f5f3ff;
  `}
`;

export const CardTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 12px;
`;

export const CardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const CardListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  color: #333;
  margin-bottom: 8px;
`;

export const CardListPercent = styled.span`
  color: #4ecdc4;
  font-weight: 600;
`;

export const CardUrgent = styled.span`
  color: #ff6f61;
  font-weight: 600;
  background: #fff0f0;
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 0.95em;
`;

export const CardMention = styled.span`
  color: #4ecdc4;
  font-weight: 600;
  background: #f0fcfa;
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 0.95em;
`;

export const CardTeam = styled.span`
  color: #7d5fff;
  font-weight: 600;
  background: #f5f3ff;
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 0.95em;
`;

export const BottomRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
`;

export const ProjectStatusCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 24px 20px;
  flex: 2;
  min-width: 320px;
`;

export const TimelineCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 24px 20px;
  flex: 1.2;
  min-width: 220px;
`;

export const BarChartPlaceholder = styled.div`
  width: 100%;
  height: 180px;
  background: #f4f6fa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  font-size: 1.1rem;
`;

export const TimelinePlaceholder = styled.div`
  width: 100%;
  height: 180px;
  background: #f4f6fa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  font-size: 1.1rem;
`; 