import React, { useState, useRef, useEffect } from "react";
import {
  Filters,
  FilterGroup,
  FilterLabel,
  FilterLeft,
  FilterSearchRight,
  NewButton,
  SearchInput,
  DropdownContainer,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
} from "./ProjectBoard.styled";
import {
  FiFileText,
  FiUser,
  FiMessageCircle,
  FiFlag,
  FiArrowUp,
  FiSearch,
  FiRotateCcw,
  FiChevronDown,
  FiArrowDown,
  FiMinus,
  FiAlertTriangle,
  FiGrid,
  FiPlus,
  FiTarget,
} from "react-icons/fi";
import { PostPriority, PostType } from "../../../project-d/types/post";
import type { ProjectDetailStep } from "../../services/projectService";

interface ProjectBoardFiltersProps {
  typeFilter: "ALL" | PostType;
  setTypeFilter: (filter: "ALL" | PostType) => void;
  priorityFilter: "ALL" | PostPriority;
  setPriorityFilter: (filter: "ALL" | PostPriority) => void;
  stepFilter: number | "ALL";
  setStepFilter: (filter: number | "ALL") => void;
  keywordType: "title" | "writer";
  setKeywordType: (type: "title" | "writer") => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
  projectSteps: ProjectDetailStep[];
  onSearch: () => void;
  onResetFilters: () => void;
  onCreatePost: () => void;
}

const ProjectBoardFilters: React.FC<ProjectBoardFiltersProps> = ({
  typeFilter,
  setTypeFilter,
  priorityFilter,
  setPriorityFilter,
  stepFilter,
  setStepFilter,
  keywordType,
  setKeywordType,
  keyword,
  setKeyword,
  projectSteps,
  onSearch,
  onResetFilters,
  onCreatePost,
}) => {
  // 드롭다운 상태
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isStepDropdownOpen, setIsStepDropdownOpen] = useState(false);
  const [isKeywordDropdownOpen, setIsKeywordDropdownOpen] = useState(false);

  // 드롭다운 refs
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const priorityDropdownRef = useRef<HTMLDivElement>(null);
  const stepDropdownRef = useRef<HTMLDivElement>(null);
  const keywordDropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 위치 조정 함수
  const adjustDropdownPosition = (
    dropdownRef: React.RefObject<HTMLDivElement | null>
  ) => {
    if (!dropdownRef.current) return;

    const rect = dropdownRef.current.getBoundingClientRect();
    const dropdownMenu = dropdownRef.current.querySelector(
      "[data-dropdown-menu]"
    ) as HTMLElement;

    if (!dropdownMenu) return;

    const menuHeight = dropdownMenu.offsetHeight;
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - rect.bottom;
    const spaceAbove = rect.top;

    // 아래쪽 공간이 부족하고 위쪽 공간이 충분하면 위쪽으로 표시
    if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
      dropdownMenu.style.top = "auto";
      dropdownMenu.style.bottom = "100%";
      dropdownMenu.style.marginTop = "0";
      dropdownMenu.style.marginBottom = "4px";
    } else {
      dropdownMenu.style.top = "100%";
      dropdownMenu.style.bottom = "auto";
      dropdownMenu.style.marginTop = "4px";
      dropdownMenu.style.marginBottom = "0";
    }
  };

  // 드롭다운 외부 클릭 및 ESC 키 처리
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(target) &&
        isTypeDropdownOpen
      ) {
        setIsTypeDropdownOpen(false);
      }

      if (
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(target) &&
        isPriorityDropdownOpen
      ) {
        setIsPriorityDropdownOpen(false);
      }

      if (
        stepDropdownRef.current &&
        !stepDropdownRef.current.contains(target) &&
        isStepDropdownOpen
      ) {
        setIsStepDropdownOpen(false);
      }

      if (
        keywordDropdownRef.current &&
        !keywordDropdownRef.current.contains(target) &&
        isKeywordDropdownOpen
      ) {
        setIsKeywordDropdownOpen(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsTypeDropdownOpen(false);
        setIsPriorityDropdownOpen(false);
        setIsStepDropdownOpen(false);
        setIsKeywordDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [
    isTypeDropdownOpen,
    isPriorityDropdownOpen,
    isStepDropdownOpen,
    isKeywordDropdownOpen,
  ]);

  const handleTypeDropdownToggle = () => {
    setIsTypeDropdownOpen((prev) => {
      if (!prev) {
        setIsPriorityDropdownOpen(false);
        setIsKeywordDropdownOpen(false);
        setTimeout(() => adjustDropdownPosition(typeDropdownRef), 0);
      }
      return !prev;
    });
  };

  const handlePriorityDropdownToggle = () => {
    setIsPriorityDropdownOpen((prev) => {
      if (!prev) {
        setIsTypeDropdownOpen(false);
        setIsKeywordDropdownOpen(false);
        setTimeout(() => adjustDropdownPosition(priorityDropdownRef), 0);
      }
      return !prev;
    });
  };

  const handleKeywordDropdownToggle = () => {
    setIsKeywordDropdownOpen((prev) => {
      if (!prev) {
        setIsTypeDropdownOpen(false);
        setIsPriorityDropdownOpen(false);
        setTimeout(() => adjustDropdownPosition(keywordDropdownRef), 0);
      }
      return !prev;
    });
  };

  const handleStepDropdownToggle = () => {
    setIsStepDropdownOpen((prev) => {
      if (!prev) {
        setIsTypeDropdownOpen(false);
        setIsPriorityDropdownOpen(false);
        setIsKeywordDropdownOpen(false);
        setTimeout(() => adjustDropdownPosition(stepDropdownRef), 0);
      }
      return !prev;
    });
  };

  return (
    <Filters>
      <FilterLeft>
        <FilterGroup>
          <FilterLabel>게시글 유형</FilterLabel>
          <DropdownContainer
            ref={typeDropdownRef}
            className="dropdown-container"
          >
            <DropdownButton
              $active={typeFilter !== "ALL"}
              $color={
                typeFilter === "ALL"
                  ? "#6b7280"
                  : typeFilter === PostType.GENERAL
                  ? "#3b82f6"
                  : "#f59e0b"
              }
              $isOpen={isTypeDropdownOpen}
              onClick={handleTypeDropdownToggle}
            >
              {typeFilter === "ALL" ? (
                <FiGrid size={16} />
              ) : typeFilter === PostType.GENERAL ? (
                <FiMessageCircle size={16} />
              ) : (
                <FiFlag size={16} />
              )}
              <span>
                {typeFilter === "ALL"
                  ? "전체"
                  : typeFilter === PostType.GENERAL
                  ? "일반"
                  : "질문"}
              </span>
              <FiChevronDown size={16} />
            </DropdownButton>
            <DropdownMenu $isOpen={isTypeDropdownOpen} data-dropdown-menu>
              <DropdownItem
                $active={typeFilter === "ALL"}
                $color={"#6b7280"}
                onClick={() => {
                  setTypeFilter("ALL");
                  setIsTypeDropdownOpen(false);
                }}
              >
                <FiGrid size={16} />
                <span>전체</span>
              </DropdownItem>
              <DropdownItem
                $active={typeFilter === PostType.GENERAL}
                $color={"#3b82f6"}
                onClick={() => {
                  setTypeFilter(PostType.GENERAL);
                  setIsTypeDropdownOpen(false);
                }}
              >
                <FiMessageCircle size={16} />
                <span>일반</span>
              </DropdownItem>
              <DropdownItem
                $active={typeFilter === PostType.QUESTION}
                $color={"#f59e0b"}
                onClick={() => {
                  setTypeFilter(PostType.QUESTION);
                  setIsTypeDropdownOpen(false);
                }}
              >
                <FiFlag size={16} />
                <span>질문</span>
              </DropdownItem>
            </DropdownMenu>
          </DropdownContainer>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>우선순위</FilterLabel>
          <DropdownContainer
            ref={priorityDropdownRef}
            className="dropdown-container"
          >
            <DropdownButton
              $active={priorityFilter !== "ALL"}
              $color={
                priorityFilter === "ALL"
                  ? "#6b7280"
                  : priorityFilter === PostPriority.LOW
                  ? "#10b981"
                  : priorityFilter === PostPriority.MEDIUM
                  ? "#fbbf24"
                  : priorityFilter === PostPriority.HIGH
                  ? "#a21caf"
                  : "#ef4444"
              }
              $isOpen={isPriorityDropdownOpen}
              onClick={handlePriorityDropdownToggle}
            >
              {priorityFilter === "ALL" ? (
                <FiGrid size={16} />
              ) : priorityFilter === PostPriority.LOW ? (
                <FiArrowDown size={16} />
              ) : priorityFilter === PostPriority.MEDIUM ? (
                <FiMinus size={16} />
              ) : priorityFilter === PostPriority.HIGH ? (
                <FiArrowUp size={16} />
              ) : (
                <FiAlertTriangle size={16} />
              )}
              <span>
                {priorityFilter === "ALL"
                  ? "전체"
                  : priorityFilter === PostPriority.LOW
                  ? "낮음"
                  : priorityFilter === PostPriority.MEDIUM
                  ? "보통"
                  : priorityFilter === PostPriority.HIGH
                  ? "높음"
                  : "긴급"}
              </span>
              <FiChevronDown size={16} />
            </DropdownButton>
            <DropdownMenu $isOpen={isPriorityDropdownOpen} data-dropdown-menu>
              <DropdownItem
                $active={priorityFilter === "ALL"}
                $color={"#6b7280"}
                onClick={() => {
                  setPriorityFilter("ALL");
                  setIsPriorityDropdownOpen(false);
                }}
              >
                <FiGrid size={16} />
                <span>전체</span>
              </DropdownItem>
              <DropdownItem
                $active={priorityFilter === PostPriority.LOW}
                $color={"#10b981"}
                onClick={() => {
                  setPriorityFilter(PostPriority.LOW);
                  setIsPriorityDropdownOpen(false);
                }}
              >
                <FiArrowDown size={16} />
                <span>낮음</span>
              </DropdownItem>
              <DropdownItem
                $active={priorityFilter === PostPriority.MEDIUM}
                $color={"#fbbf24"}
                onClick={() => {
                  setPriorityFilter(PostPriority.MEDIUM);
                  setIsPriorityDropdownOpen(false);
                }}
              >
                <FiMinus size={16} />
                <span>보통</span>
              </DropdownItem>
              <DropdownItem
                $active={priorityFilter === PostPriority.HIGH}
                $color={"#a21caf"}
                onClick={() => {
                  setPriorityFilter(PostPriority.HIGH);
                  setIsPriorityDropdownOpen(false);
                }}
              >
                <FiArrowUp size={16} />
                <span>높음</span>
              </DropdownItem>
              <DropdownItem
                $active={priorityFilter === PostPriority.URGENT}
                $color={"#ef4444"}
                onClick={() => {
                  setPriorityFilter(PostPriority.URGENT);
                  setIsPriorityDropdownOpen(false);
                }}
              >
                <FiAlertTriangle size={16} />
                <span>긴급</span>
              </DropdownItem>
            </DropdownMenu>
          </DropdownContainer>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>단계</FilterLabel>
          <DropdownContainer
            ref={stepDropdownRef}
            className="dropdown-container"
          >
            <DropdownButton
              $active={stepFilter !== "ALL"}
              $color={
                stepFilter === "ALL"
                  ? "#6b7280"
                  : (() => {
                      const selectedStep = projectSteps.find(
                        (step) => step.id === stepFilter
                      );
                      if (!selectedStep) return "#6b7280";

                      switch (selectedStep.projectStepStatus) {
                        case "IN_PROGRESS":
                          return "#fdb924";
                        case "COMPLETED":
                          return "#10b981";
                        case "PENDING":
                          return "#6b7280";
                        default:
                          return "#6b7280";
                      }
                    })()
              }
              $isOpen={isStepDropdownOpen}
              onClick={handleStepDropdownToggle}
            >
              <FiTarget size={16} />
              <span>
                {stepFilter === "ALL"
                  ? "전체"
                  : projectSteps.find((step) => step.id === stepFilter)?.name ||
                    "알 수 없음"}
              </span>
              <FiChevronDown size={16} />
            </DropdownButton>
            <DropdownMenu $isOpen={isStepDropdownOpen} data-dropdown-menu>
              <DropdownItem
                $active={stepFilter === "ALL"}
                $color={"#6b7280"}
                onClick={() => {
                  setStepFilter("ALL");
                  setIsStepDropdownOpen(false);
                }}
              >
                <FiTarget size={16} />
                <span>전체</span>
              </DropdownItem>
              {projectSteps
                .filter((step) => !step.isDeleted)
                .sort((a, b) => a.stepOrder - b.stepOrder)
                .map((step) => (
                  <DropdownItem
                    key={step.id}
                    $active={stepFilter === step.id}
                    $color={"#10b981"}
                    onClick={() => {
                      setStepFilter(step.id);
                      setIsStepDropdownOpen(false);
                    }}
                  >
                    <FiTarget size={16} />
                    <span>{step.name}</span>
                  </DropdownItem>
                ))}
            </DropdownMenu>
          </DropdownContainer>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>키워드</FilterLabel>
          <DropdownContainer
            ref={keywordDropdownRef}
            className="dropdown-container"
          >
            <DropdownButton
              $active={true}
              $color={keywordType === "title" ? "#3b82f6" : "#10b981"}
              $isOpen={isKeywordDropdownOpen}
              onClick={handleKeywordDropdownToggle}
            >
              {keywordType === "title" ? (
                <FiFileText size={16} />
              ) : (
                <FiUser size={16} />
              )}
              <span>{keywordType === "title" ? "제목" : "작성자"}</span>
              <FiChevronDown size={16} />
            </DropdownButton>
            <DropdownMenu $isOpen={isKeywordDropdownOpen} data-dropdown-menu>
              <DropdownItem
                $active={keywordType === "title"}
                $color={"#3b82f6"}
                onClick={() => {
                  setKeywordType("title");
                  setIsKeywordDropdownOpen(false);
                }}
              >
                <FiFileText size={16} />
                <span>제목</span>
              </DropdownItem>
              <DropdownItem
                $active={keywordType === "writer"}
                $color={"#10b981"}
                onClick={() => {
                  setKeywordType("writer");
                  setIsKeywordDropdownOpen(false);
                }}
              >
                <FiUser size={16} />
                <span>작성자</span>
              </DropdownItem>
            </DropdownMenu>
          </DropdownContainer>
        </FilterGroup>

        <SearchInput
          placeholder={
            keywordType === "title" ? "제목으로 검색" : "작성자로 검색"
          }
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
        />
        <NewButton
          style={{
            minWidth: "auto",
            padding: "10px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={onSearch}
        >
          <FiSearch size={16} />
        </NewButton>
        <NewButton
          onClick={onResetFilters}
          style={{
            minWidth: "auto",
            padding: "10px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FiRotateCcw size={16} />
        </NewButton>
      </FilterLeft>
      <FilterSearchRight>
        <NewButton onClick={onCreatePost}>
          <FiPlus size={16} />
          게시글 작성
        </NewButton>
      </FilterSearchRight>
    </Filters>
  );
};

export default ProjectBoardFilters;
