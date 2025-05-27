import styled from "styled-components";

export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
`;

export const LoginContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

export const LoginCard = styled.div`
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 420px;
  padding: 2rem;
`;

export const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const LogoImage = styled.img`
  height: 2.5rem;
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

export const Footer = styled.footer`
  text-align: center;
  color: #9ca3af;
  font-size: 0.75rem;
  padding: 2rem 0;
  width: 900px;
  margin: 0 auto;
`;
