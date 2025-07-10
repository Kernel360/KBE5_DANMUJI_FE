import styled from "styled-components";

export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #6b7280;
  font-size: 0.875rem;
  gap: 1rem;

  &::before {
    content: "";
    width: 32px;
    height: 32px;
    background-image: url("/favicon.ico");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    animation: bounceDanmuji 2s ease-in-out infinite;
    transform-origin: center;
  }

  @keyframes bounceDanmuji {
    0% {
      transform: scale(1) rotate(0deg);
    }
    25% {
      transform: scale(1.2) rotate(90deg);
    }
    50% {
      transform: scale(0.8) rotate(180deg);
    }
    75% {
      transform: scale(1.1) rotate(270deg);
    }
    100% {
      transform: scale(1) rotate(360deg);
    }
  }
`;

// 높이가 고정된 버전 (목록 페이지용)
export const LoadingSpinnerFixed = styled(LoadingSpinner)`
  height: 200px;
  font-size: 1.125rem;
`;
