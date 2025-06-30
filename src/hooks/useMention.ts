import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { searchUsernames } from "@/features/user/services/userService";

// UserSummaryResponse 타입을 직접 정의
interface UserSummaryResponse {
  id: number;
  username: string;
  name: string;
  role: string;
}

interface MentionState {
  isActive: boolean;
  query: string;
  startIndex: number;
  endIndex: number;
  suggestions: string[];
  selectedIndex: number;
}

export const useMention = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [mentionState, setMentionState] = useState<MentionState>({
    isActive: false,
    query: "",
    startIndex: 0,
    endIndex: 0,
    suggestions: [],
    selectedIndex: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  // @ 검색 로직
  const searchMentions = useCallback(
    async (query: string) => {
      if (!projectId) {
        console.warn("projectId가 없어서 멘션 검색을 건너뜁니다.");
        return;
      }

      setIsLoading(true);
      try {
        // 빈 쿼리일 때도 API 호출 (모든 사용자 가져오기)
        const response = await searchUsernames(query, parseInt(projectId));

        // API 응답이 유효한지 확인하고 안전하게 처리
        const userData = response?.data;
        if (userData && Array.isArray(userData)) {
          // UserSummaryResponse 객체 배열에서 username만 추출하여 문자열 배열로 변환
          const usernames = userData.map(
            (user: UserSummaryResponse) => user.username
          );

          setMentionState((prev) => ({
            ...prev,
            suggestions: usernames,
            isActive: usernames.length > 0,
            selectedIndex: 0,
          }));
        } else {
          // 유효하지 않은 응답인 경우 빈 배열로 설정
          setMentionState((prev) => ({
            ...prev,
            suggestions: [],
            isActive: false,
          }));
        }
      } catch (error) {
        console.error("Mention search failed:", error);
        // 에러가 발생해도 빈 배열로 설정하여 UI가 깨지지 않도록 함
        setMentionState((prev) => ({
          ...prev,
          suggestions: [],
          isActive: false,
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [projectId]
  );

  // 디바운스된 검색
  const debouncedSearch = useCallback(
    (query: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        searchMentions(query);
      }, 300);
    },
    [searchMentions]
  );

  // @ 입력 감지 및 처리
  const handleInputChange = useCallback(
    (value: string, cursorPosition: number) => {
      const beforeCursor = value.slice(0, cursorPosition);
      const afterCursor = value.slice(cursorPosition);

      // @ 패턴 찾기 - @만 입력해도 감지하도록 수정
      const mentionPattern = /@(\w*)$/;
      const match = beforeCursor.match(mentionPattern);

      if (match) {
        const query = match[1];
        const startIndex = beforeCursor.lastIndexOf("@");

        setMentionState((prev) => ({
          ...prev,
          isActive: true,
          query,
          startIndex,
          endIndex: cursorPosition,
          selectedIndex: 0,
        }));

        // @ 입력 시 바로 검색 시작 (빈 쿼리도 허용)
        searchMentions(query);
      } else {
        setMentionState((prev) => ({ ...prev, isActive: false }));
      }
    },
    [searchMentions, mentionState.isActive]
  );

  // 제안 목록에서 선택
  const selectMention = useCallback((username: string) => {
    setMentionState((prev) => ({ ...prev, isActive: false }));
    return username;
  }, []);

  // 키보드 네비게이션
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!mentionState.isActive) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setMentionState((prev) => ({
            ...prev,
            selectedIndex: Math.min(
              prev.selectedIndex + 1,
              prev.suggestions.length - 1
            ),
          }));
          break;
        case "ArrowUp":
          e.preventDefault();
          setMentionState((prev) => ({
            ...prev,
            selectedIndex: Math.max(prev.selectedIndex - 1, 0),
          }));
          break;
        case "Enter":
          e.preventDefault();
          if (mentionState.suggestions[mentionState.selectedIndex]) {
            const selectedUsername =
              mentionState.suggestions[mentionState.selectedIndex];
            selectMention(selectedUsername);
            // 상태 즉시 리셋
            setMentionState((prev) => ({
              ...prev,
              isActive: false,
              suggestions: [],
              selectedIndex: 0,
            }));
          }
          break;
        case "Escape":
          e.preventDefault();
          setMentionState((prev) => ({
            ...prev,
            isActive: false,
            suggestions: [],
            selectedIndex: 0,
          }));
          break;
      }
    },
    [
      mentionState.isActive,
      mentionState.selectedIndex,
      mentionState.suggestions,
      selectMention,
    ]
  );

  // 텍스트에 @username 삽입
  const insertMention = useCallback(
    (text: string, username: string, startIndex: number, endIndex: number) => {
      const beforeMention = text.slice(0, startIndex);
      const afterMention = text.slice(endIndex);
      return beforeMention + "@" + username + afterMention;
    },
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [handleKeyDown]);

  return {
    mentionState,
    isLoading,
    handleInputChange,
    selectMention,
    insertMention,
    setMentionState,
  };
};
