import styled, { css } from 'styled-components';

export const Container = styled.div`
  padding: 32px 32px;
  min-height: 100vh;
  background: #fafbfc;
`;

export const MainContent = styled.div`
  width: 100%;
`;

export const GreetingSection = styled.div`
  margin-bottom: 32px;
`;

export const GreetingTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 6px;
  color: #222;
`;

export const GreetingSubtitle = styled.div`
  font-size: 1.05rem;
  color: #8b95a1;
`;

export const Section = styled.section`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 28px 32px 24px 32px;
  margin-bottom: 28px;
`;

export const SectionTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 18px;
`;

export const ProgressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const ProgressItem = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

export const ProgressLabel = styled.div`
  flex: 1.5;
  font-size: 1.05rem;
  color: #222;
`;

export const ProgressPercent = styled.div`
  width: 48px;
  font-size: 1.05rem;
  font-weight: 600;
  color: #1abc7b;
`;

export const ProgressBarWrap = styled.div`
  flex: 3;
  height: 8px;
  background: #f1f3f7;
  border-radius: 8px;
  overflow: hidden;
`;

export const ProgressBar = styled.div<{ percent: number }>`
  height: 100%;
  background: linear-gradient(90deg, #1abc7b 0%, #1abc7b 100%);
  width: ${({ percent }) => percent}%;
  border-radius: 8px;
  transition: width 0.4s;
`;

export const FlexRow = styled.div`
  display: flex;
  gap: 24px;
`;

export const MentionedSection = styled(Section)`
  flex: 1.1;
  min-width: 260px;
  padding-bottom: 18px;
`;

export const MentionedCard = styled.div<{ color: 'yellow' | 'blue' }>`
  background: ${({ color }) =>
    color === 'yellow' ? '#fff9db' : '#e6f0fa'};
  border-radius: 10px;
  padding: 18px 18px 12px 18px;
  margin-bottom: 12px;
`;

export const MentionedTitle = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 6px;
  color: #222;
`;

export const MentionedDesc = styled.div`
  font-size: 0.98rem;
  color: #444;
  margin-bottom: 8px;
`;

export const MentionedMeta = styled.div`
  font-size: 0.93rem;
  color: #8b95a1;
`;

export const PrioritySection = styled(Section)`
  flex: 1.1;
  min-width: 320px;
  background: #fff6f6;
  border: 1.5px solid #ffd6d6;
  padding-bottom: 18px;
`;

export const PriorityTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #e74c3c;
  margin-bottom: 14px;
`;

export const PriorityCard = styled.div`
  background: #fff;
  border-radius: 10px;
  border: 1.5px solid #ffd6d6;
  padding: 16px 16px 10px 16px;
  margin-bottom: 12px;
`;

export const PriorityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

export const PriorityLabel = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: #e74c3c;
`;

export const PriorityTag = styled.div<{ type?: 'yellow' }>`
  font-size: 0.93rem;
  font-weight: 600;
  color: ${({ type }) => (type === 'yellow' ? '#ff9800' : '#fff')};
  background: ${({ type }) => (type === 'yellow' ? '#fff3cd' : '#e74c3c')};
  border-radius: 8px;
  padding: 2px 10px;
  margin-left: 8px;
  display: inline-block;
`;

export const PriorityDesc = styled.div`
  font-size: 0.98rem;
  color: #444;
  margin-bottom: 8px;
`;

export const PriorityMeta = styled.div`
  font-size: 0.93rem;
  color: #8b95a1;
  display: flex;
  gap: 12px;
`;

export const LatestSection = styled(Section)`
  flex: 1.2;
  min-width: 320px;
  padding-bottom: 18px;
`;

export const LatestCard = styled.div`
  background: #fff;
  border-radius: 10px;
  border: 1.5px solid #e6eaf3;
  padding: 16px 16px 10px 16px;
  margin-bottom: 12px;
`;

export const LatestTitle = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: #222;
`;

export const LatestDesc = styled.div`
  font-size: 0.98rem;
  color: #444;
  margin-bottom: 8px;
`;

export const LatestMeta = styled.div`
  font-size: 0.93rem;
  color: #8b95a1;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const LatestTag = styled.div<{ color: 'blue' | 'yellow' | 'green' }>`
  font-size: 0.93rem;
  font-weight: 600;
  color: ${({ color }) =>
    color === 'blue' ? '#1976d2' : color === 'yellow' ? '#ff9800' : '#1abc7b'};
  background: ${({ color }) =>
    color === 'blue'
      ? '#e3f0fd'
      : color === 'yellow'
      ? '#fff3cd'
      : '#e6f9f0'};
  border-radius: 8px;
  padding: 2px 10px;
  display: inline-block;
`;

export const ProjectListSection = styled(Section)`
  /* Section 스타일 재사용 */
`;

export const ProjectListTitle = styled(SectionTitle)`
  /* SectionTitle 스타일 재사용 */
`;

export const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const ProjectListItem = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ProjectInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ProjectName = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: #222;
`;

export const ProjectDesc = styled.div`
  font-size: 0.98rem;
  color: #888;
  margin-top: 4px;
`;

export const ProjectStatus = styled.div<{ status?: 'progress' | 'done' | 'hold' }>`
  font-size: 0.93rem;
  font-weight: 600;
  color: ${({ status }) =>
    status === 'progress' ? '#1abc7b' : status === 'done' ? '#1976d2' : '#ff9800'};
  background: ${({ status }) =>
    status === 'progress'
      ? '#e6f9f0'
      : status === 'done'
      ? '#e3f0fd'
      : '#fff3cd'};
  border-radius: 8px;
  padding: 2px 10px;
  display: inline-block;
`;

export const DashboardHeader = styled.div`
  margin-bottom: 24px;
`;

export const DashboardTitle = styled.h1`
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

export const DashboardDescription = styled.div`
  color: #bdbdbd;
  font-size: 0.9rem;
  margin-bottom: 18px;
`; 