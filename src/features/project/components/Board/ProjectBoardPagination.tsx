import React from "react";
import {
  PaginationContainer,
  PaginationInfo,
  PaginationNav,
  PaginationButton,
} from "./ProjectBoard.styled";

interface ProjectBoardPaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

const ProjectBoardPagination: React.FC<ProjectBoardPaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
}) => {
  return (
    <PaginationContainer>
      <PaginationNav>
        {/* 첫 페이지로 이동 버튼 */}
        {currentPage > 0 && (
          <PaginationButton onClick={() => onPageChange(0)}>
            맨 처음
          </PaginationButton>
        )}

        {/* 이전 버튼 */}
        {currentPage > 0 && (
          <PaginationButton onClick={() => onPageChange(currentPage - 1)}>
            이전
          </PaginationButton>
        )}

        {/* 페이지 번호 버튼들을 스마트하게 생성 */}
        {(() => {
          const pages: (number | string)[] = [];

          if (totalPages <= 7) {
            // 총 페이지가 7개 이하면 모든 페이지 표시
            for (let i = 0; i < totalPages; i++) {
              pages.push(i);
            }
          } else {
            // 총 페이지가 8개 이상이면 스마트 페이지네이션
            if (currentPage <= 3) {
              // 현재 페이지가 앞쪽에 있는 경우
              for (let i = 0; i <= 4; i++) {
                pages.push(i);
              }
              pages.push("...");
              pages.push(totalPages - 1);
            } else if (currentPage >= totalPages - 4) {
              // 현재 페이지가 뒤쪽에 있는 경우
              pages.push(0);
              pages.push("...");
              for (let i = totalPages - 5; i < totalPages; i++) {
                pages.push(i);
              }
            } else {
              // 현재 페이지가 중간에 있는 경우
              pages.push(0);
              pages.push("...");
              for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pages.push(i);
              }
              pages.push("...");
              pages.push(totalPages - 1);
            }
          }

          return pages.map((page, idx) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  style={{
                    padding: "8px 12px",
                    color: "#6b7280",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            return (
              <PaginationButton
                key={pageNum}
                $active={currentPage === pageNum}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum + 1}
              </PaginationButton>
            );
          });
        })()}

        {/* 다음 버튼 */}
        {currentPage + 1 < totalPages && (
          <PaginationButton onClick={() => onPageChange(currentPage + 1)}>
            다음
          </PaginationButton>
        )}

        {/* 마지막 페이지로 이동 버튼 */}
        {currentPage + 1 < totalPages && (
          <PaginationButton onClick={() => onPageChange(totalPages - 1)}>
            맨 마지막
          </PaginationButton>
        )}
      </PaginationNav>
      <PaginationInfo>
        총 {totalElements}개 항목 중 {currentPage * 10 + 1}-
        {Math.min((currentPage + 1) * 10, totalElements)}개 표시
      </PaginationInfo>
    </PaginationContainer>
  );
};

export default ProjectBoardPagination;
