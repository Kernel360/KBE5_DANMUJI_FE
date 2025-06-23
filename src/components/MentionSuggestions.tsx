import React from "react";
import styled from "styled-components";
import { FiUser } from "react-icons/fi";

interface MentionSuggestionsProps {
  suggestions: string[];
  selectedIndex: number;
  isLoading: boolean;
  onSelect: (username: string) => void;
  position: { top: number; left: number } | null;
}

const SuggestionsContainer = styled.div<{
  position: { top: number; left: number } | null;
}>`
  position: absolute;
  top: ${(props) => props.position?.top ?? 0}px;
  left: ${(props) => props.position?.left ?? 0}px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  min-width: 200px;
  animation: slideIn 0.15s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SuggestionItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 14px;
  color: #374151;
  border-radius: 6px;
  margin: 2px 4px;

  background-color: ${(props) =>
    props.isSelected ? "#fdb924" : "transparent"};
  color: ${(props) => (props.isSelected ? "white" : "#374151")};
  box-shadow: ${(props) =>
    props.isSelected ? "0 2px 4px rgba(253, 185, 36, 0.3)" : "none"};

  &:hover {
    background-color: ${(props) => (props.isSelected ? "#fdb924" : "#f9fafb")};
    transform: ${(props) => (props.isSelected ? "translateY(-1px)" : "none")};
  }

  &:first-child {
    border-radius: 6px 6px 0 0;
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
  }
`;

const UserIcon = styled(FiUser)`
  color: ${(props) => props.color || "#6b7280"};
  flex-shrink: 0;
`;

const Username = styled.span`
  font-weight: 500;
`;

const LoadingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  color: #6b7280;
  font-size: 14px;
`;

const EmptyItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  color: #6b7280;
  font-size: 14px;
  font-style: italic;
`;

const MentionSuggestions: React.FC<MentionSuggestionsProps> = ({
  suggestions,
  selectedIndex,
  isLoading,
  onSelect,
  position,
}) => {
  if (!position || (!isLoading && suggestions.length === 0)) {
    return null;
  }

  return (
    <SuggestionsContainer position={position}>
      {isLoading ? (
        <LoadingItem>검색 중...</LoadingItem>
      ) : suggestions.length === 0 ? (
        <EmptyItem>검색 결과가 없습니다</EmptyItem>
      ) : (
        suggestions.map((username, index) => (
          <SuggestionItem
            key={username}
            isSelected={index === selectedIndex}
            onClick={() => onSelect(username)}
          >
            <UserIcon
              size={16}
              color={index === selectedIndex ? "white" : "#6b7280"}
            />
            <Username>@{username}</Username>
          </SuggestionItem>
        ))
      )}
    </SuggestionsContainer>
  );
};

export default MentionSuggestions;
