import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useMention } from "@/hooks/useMention";
import MentionSuggestions from "./MentionSuggestions";

interface MentionTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const TextAreaContainer = styled.div`
  position: relative;
  width: 100%;
  z-index: 1;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: white;
  color: #374151;
  caret-color: #374151;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
  position: relative;
  z-index: 2;

  &:focus {
    outline: none;
    border-color: #fdb924;
    box-shadow: 0 0 0 3px rgba(253, 185, 36, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const MentionTextArea: React.FC<MentionTextAreaProps> = ({
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
  className,
  style,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [suggestionPosition, setSuggestionPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const {
    mentionState,
    isLoading,
    handleInputChange,
    insertMention,
    setMentionState,
  } = useMention();

  // 커서 위치 계산
  const calculateCursorPosition = () => {
    if (!textareaRef.current) return null;

    const textarea = textareaRef.current;
    const { offsetLeft, offsetTop } = textarea;

    // 커서 위치 계산
    const textBeforeCursor = value.substring(0, textarea.selectionStart);
    const lines = textBeforeCursor.split("\n");
    const currentLine = lines[lines.length - 1];

    // 임시 span을 사용하여 텍스트 너비 계산
    const tempSpan = document.createElement("span");
    tempSpan.style.font = window.getComputedStyle(textarea).font;
    tempSpan.style.whiteSpace = "pre";
    tempSpan.style.position = "absolute";
    tempSpan.style.visibility = "hidden";
    tempSpan.textContent = currentLine;
    document.body.appendChild(tempSpan);

    const textWidth = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);

    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
    const top = offsetTop + (lines.length - 1) * lineHeight + 30; // 약간의 여백
    const left = offsetLeft + textWidth + 10; // 약간의 여백

    return { top, left };
  };

  // mentionState가 변경될 때마다 위치 업데이트
  useEffect(() => {
    if (mentionState.isActive) {
      const position = calculateCursorPosition();
      setSuggestionPosition(position);
    } else {
      setSuggestionPosition(null);
    }
  }, [mentionState.isActive, mentionState.suggestions, value]);

  // 입력 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // @ 검색 처리
    handleInputChange(newValue, e.target.selectionStart);
  };

  // 제안 선택 처리
  const handleSuggestionSelect = (username: string) => {
    if (!textareaRef.current) return;

    const newText = insertMention(
      value,
      username,
      mentionState.startIndex,
      mentionState.endIndex
    );

    // 멘션 선택 후 자동으로 스페이스바 공백 추가
    const textWithSpace = newText + " ";

    onChange(textWithSpace);

    // 멘션 상태 즉시 리셋
    setMentionState((prev) => ({
      ...prev,
      isActive: false,
      suggestions: [],
      selectedIndex: 0,
    }));

    // 커서 위치 조정 - @username 뒤에 위치하도록
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPosition = mentionState.startIndex + username.length + 2; // @ + username + space
        textareaRef.current.setSelectionRange(
          newCursorPosition,
          newCursorPosition
        );
        textareaRef.current.focus();
      }
    }, 0);
  };

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (mentionState.isActive) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMentionState((prev) => ({
          ...prev,
          selectedIndex: Math.min(
            prev.selectedIndex + 1,
            prev.suggestions.length - 1
          ),
        }));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setMentionState((prev) => ({
          ...prev,
          selectedIndex: Math.max(prev.selectedIndex - 1, 0),
        }));
      } else if (e.key === "Enter" && mentionState.suggestions.length > 0) {
        e.preventDefault();
        const selectedUsername =
          mentionState.suggestions[mentionState.selectedIndex];
        if (selectedUsername) {
          handleSuggestionSelect(selectedUsername);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        // 멘션 상태 즉시 리셋
        setMentionState((prev) => ({
          ...prev,
          isActive: false,
          suggestions: [],
          selectedIndex: 0,
        }));
      }
    }
  };

  // 클릭 이벤트 처리
  const handleClick = () => {
    if (mentionState.isActive) {
      const position = calculateCursorPosition();
      setSuggestionPosition(position);
    }
  };

  // 포커스 이벤트 처리
  const handleFocus = () => {
    if (mentionState.isActive) {
      const position = calculateCursorPosition();
      setSuggestionPosition(position);
    }
  };

  return (
    <TextAreaContainer>
      <StyledTextArea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onFocus={handleFocus}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={className}
        style={style}
      />
      <MentionSuggestions
        suggestions={mentionState.suggestions}
        selectedIndex={mentionState.selectedIndex}
        isLoading={isLoading}
        onSelect={handleSuggestionSelect}
        position={suggestionPosition}
      />
    </TextAreaContainer>
  );
};

export default MentionTextArea;
