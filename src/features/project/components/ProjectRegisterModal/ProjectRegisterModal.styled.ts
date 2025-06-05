import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
`;

export const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 28rem; /* max-w-md */
  padding: 2rem;
  position: relative;
`;

export const ModalTitle = styled.div`
  font-size: 1.25rem; /* text-xl */
  font-weight: 700; /* font-bold */
  margin-bottom: 1.5rem; /* mb-6 */
`;

export const FormSection = styled.div`
  /* space-y-4 */
  & > div {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const FormGroup = styled.div``;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem; /* text-sm */
  font-weight: 600; /* font-semibold */
  margin-bottom: 0.25rem; /* mb-1 */
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid #d1d5db; /* border */
  border-radius: 0.25rem; /* rounded */
  padding: 0.5rem 0.75rem; /* px-3 py-2 */

  &:focus {
    outline: none;
    border-color: #3b82f6; /* focus:border-blue-500 */
    box-shadow: 0 0 0 1px #3b82f6; /* focus:ring-blue-500 */
  }
`;

export const SectionDivider = styled.div`
  border-bottom: 1px solid #e5e7eb; /* border-b */
  padding-bottom: 1rem; /* pb-4 */
  margin-bottom: 1rem; /* mb-4 */
`;

export const SectionTitle = styled.div`
  font-weight: 600; /* font-semibold */
  color: #374151; /* text-gray-700 */
  margin-bottom: 0.5rem; /* mb-2 */
`;

export const DateInputContainer = styled.div`
  display: flex;
  gap: 1rem; /* gap-4 */
`;

export const DateInputWrapper = styled.div`
  flex: 1; /* flex-1 */
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end; /* justify-end */
  gap: 0.5rem; /* gap-2 */
  margin-top: 2rem; /* mt-8 */
`;

export const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 0.5rem 1rem; /* px-4 py-2 */
  border-radius: 0.25rem; /* rounded */
  font-weight: 600; /* font-semibold */
  cursor: pointer;

  ${(props) =>
    props.$variant === "primary"
      ? `
    background-color: #3b82f6; /* bg-blue-500 */
    color: white; /* text-white */

    &:hover {
      background-color: #2563eb; /* hover:bg-blue-600 */
    }
  `
      : `
    background-color: #e5e7eb; /* bg-gray-200 */
    color: #374151; /* text-gray-700 */

    &:hover {
      background-color: #d1d5db; /* hover:bg-gray-300 */
    }
  `}
`;
