import styled from "styled-components";

export const ComponentContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  position: relative;
`;

export const ComponentWrapper = styled.div`
  display: flex;
  width: 1100px;
  min-height: 650px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

export const ComponentLeft = styled.div`
  background: #fdb924;
  color: white;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 48px;
`;

export const ComponentRight = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 48px;
  background: white;
  position: relative;
`;

export const ComponentCard = styled.div`
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 420px;
  padding: 2rem;

  position: absolute;
  top: 7rem;
`;

export const Logo = styled.div`
  position: absolute;
  top: 4rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
`;

export const LogoImage = styled.img`
  height: 2.5rem;
`;

export const LeftTitle = styled.h1`
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

export const LeftDesc = styled.p`
  font-size: 1rem;
  color: #fff;
  margin-bottom: 2rem;
  display: block;
`;

export const DescIconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #fff;
  font-size: 0.875rem;
`;

export const DescIconImage = styled.img`
  width: 2rem;
  height: 2rem;
  verticalalign: "middle";
  margin-right: 4;
  margin-top: 0.2rem;
`;

export const DescIconText = styled.p`
  font-size: 1rem;
  font-weight: 700;
  margin-left: 0.5rem;
  display: block;
  margin-top: 0.2rem;
`;

export const DescIconDesc = styled.p`
  font-size: 1rem;
  font-weight: 700;
  margin-left: 0.5rem;
  display: block;
  margin-top: 0.2rem;
`;

export const LockContainer = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 0.875rem;
  margin-top: 4rem;
`;

export const LockIconImage = styled.img`
  width: 1.2rem;
  height: 1.2rem;
  verticalalign: "middle";
  marginright: 4;
`;

export const LockTitle = styled.p`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: -0.2rem;
  margin-left: 0.5rem;
  display: block;
`;

export const LockText = styled.p`
  font-size: 0.8rem;
  font-weight: 700;
  margin-left: 0.5rem;
`;

export const MailIconImage = styled.img`
  width: 6rem;
  height: 6rem;
  margin-bottom: 1rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin-bottom: 0.5rem;
`;

export const Subtitle = styled.p`
  color: #6b7280;
  text-align: center;
  margin-bottom: 2rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 2px rgba(253, 185, 36, 0.1);
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #fdb924;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e6a720;
  }
`;

export const SecureConnection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  color: #9ca3af;
  font-size: 0.75rem;
`;
