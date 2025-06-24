import styled, { css } from 'styled-components';

export const CardsWrapper = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;
  justify-content: center;
  margin: 0 auto;
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  padding: 22px 28px 18px 28px;
  min-width: 250px;
  max-width: 300px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const CardHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CardHeaderRight = styled.div<{urgent?: boolean; mention?: boolean; team?: boolean}>`
  font-size: 1.05rem;
  font-weight: 600;
  color: #bdbdbd;
  ${({urgent}) => urgent && css`
    color: #ff6f61;
  `}
  ${({mention}) => mention && css`
    color: #4ecdc4;
  `}
  ${({team}) => team && css`
    color: #7d5fff;
  `}
`;

export const CardIcon = styled.span<{urgent?: boolean; mention?: boolean; team?: boolean}>`
  font-size: 1.3rem;
  ${({urgent}) => urgent && css`
    color: #ff6f61;
  `}
  ${({mention}) => mention && css`
    color: #4ecdc4;
  `}
  ${({team}) => team && css`
    color: #7d5fff;
  `}
`;

export const CardTitle = styled.span<{urgent?: boolean; mention?: boolean; team?: boolean}>`
  font-size: 1.08rem;
  font-weight: 700;
  color: #222;
  ${({urgent}) => urgent && css`
    color: #ff6f61;
  `}
  ${({mention}) => mention && css`
    color: #4ecdc4;
  `}
  ${({team}) => team && css`
    color: #7d5fff;
  `}
`;

export const CardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const CardListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  color: #333;
`;

export const Percent = styled.span<{color: string}>`
  font-weight: 700;
  color: ${({color}) => color};
  background: ${({color}) => color}22;
  border-radius: 8px;
  padding: 2px 10px;
  font-size: 0.98em;
`;

export const Badge = styled.span<{urgent?: boolean; mention?: boolean; team?: boolean}>`
  font-weight: 700;
  border-radius: 8px;
  padding: 2px 10px;
  font-size: 0.98em;
  background: #f4f6fa;
  color: #bdbdbd;
  ${({urgent}) => urgent && css`
    background: #fff0f0;
    color: #ff6f61;
  `}
  ${({mention}) => mention && css`
    background: #f0fcfa;
    color: #4ecdc4;
  `}
  ${({team}) => team && css`
    background: #f5f3ff;
    color: #7d5fff;
  `}
`; 