import styled, { css } from 'styled-components';

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin-top: 0.5rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

export const Section = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

export const DateRow = styled.div`
  display: flex;
  gap: 1rem;
`;

export const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const buttonStyles = css`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  min-width: 100px;
  transition: opacity 0.2s;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  ${buttonStyles}
  background: #f9fafb;
  color: #333;
  border: 1px solid #ccc;
`;

export const CreateButton = styled.button`
  ${buttonStyles}
  background: #4f46e5;
  color: #fff;
`;