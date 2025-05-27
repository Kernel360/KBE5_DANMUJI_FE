import React, { useState } from "react";
import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";

const PageContainer = styled.div`
  padding: 32px;
  background-color: #f9fafb;
`;

const Header = styled.div`
  margin-bottom: 36px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
`;

const Description = styled.p`
  color: #6b7280;
  font-size: 14px;
`;

const TopFilters = styled.div`
  margin-bottom: 20px;
  font-size: 14px;
  color: #4b5563;
`;

const TopFilterOption = styled.span<{ $active?: boolean }>`
  cursor: pointer;
  color: ${(props) => (props.$active ? "#4f46e5" : "#6b7280")};
  font-weight: ${(props) => (props.$active ? "600" : "400")};

  &:hover {
    text-decoration: ${(props) => (props.$active ? "none" : "underline")};
  }

  & + &::before {
    content: " · ";
    margin: 0 8px;
    color: #d1d5db;
  }
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 12px;
`;

const FilterSelect = styled.select`
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  background-color: white;
  color: #374151;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 24px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 8px 12px;
  width: 256px;
  background-color: white;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #374151;
  background-color: transparent;
  padding: 0;

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchIcon = styled(AiOutlineSearch)`
  color: #9ca3af;
  font-size: 18px;
  margin-left: 8px;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  background-color: white;
`;

const Table = styled.table`
  min-width: 100%;
  font-size: 14px;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const TableHeader = styled.th<{ $align?: "left" | "center" | "right" }>`
  padding: 12px 16px;
  text-align: ${(props) => props.$align || "left"};
  font-weight: 600;
  color: #4b5563;
  white-space: nowrap;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td<{ $align?: "left" | "center" | "right" }>`
  padding: 12px 16px;
  text-align: ${(props) => props.$align || "left"};
  color: #374151;
  vertical-align: top;

  & > span:first-child {
    font-weight: 600;
    color: #1f2937;
    line-height: 1.4;
  }
  & > span:last-child {
    font-size: 12px;
    color: #6b7280;
    line-height: 1.4;
  }
`;

const StageBadge = styled.span<{ $stage: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  ${(props) => {
    switch (props.$stage) {
      case "진행":
        return "background-color: #fef3c7; color: #92400e;";
      case "완료":
        return "background-color: #dcfce7; color: #14532d;";
      case "요구분석":
        return "background-color: #e5e7eb; color: #374151;";
      case "설계":
        return "background-color: #ccfbf1; color: #0f766e;";
      default:
        return "background-color: #e5e7eb; color: #374151;";
    }
  }}
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const PaginationNav = styled.nav`
  display: inline-flex;
  border-radius: 4px;
  overflow: hidden;
`;

const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-right: none;
  background-color: white;
  color: ${(props) => (props.$active ? "#ffffff" : "#6b7280")};
  background-color: ${(props) => (props.$active ? "#4f46e5" : "white")};
  border-color: ${(props) => (props.$active ? "#4f46e5" : "#d1d5db")};
  font-weight: ${(props) => (props.$active ? "600" : "400")};
  cursor: pointer;

  &:last-child {
    border-right: 1px solid #d1d5db;
  }

  &:hover {
    background-color: ${(props) => (props.$active ? "#4338ca" : "#f9fafb")};
    border-color: ${(props) => (props.$active ? "#4338ca" : "#d1d5db")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Function to format date as YYYY.MM.DD
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date string provided: ${dateString}`);
      return "Invalid Date";
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}.${month}.${day}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

// Dummy data matching the image columns
const initialPosts = [
  {
    title:
      "클라우드 기반 ERP 시스템 개발\n기업 자원 관리를 위한 클라우드 기반 ERP 시스템",
    customer: "ABC 기업",
    developer: "XYZ 소프트웨어",
    stage: "진행",
    startDate: "2023-06-01",
    endDate: "2023-12-31",
  },
  {
    title:
      "모바일 앱 리뉴얼 프로젝트\n기존 모바일 앱의 UI/UX 개선 및 기능 추가",
    customer: "DEF 모바일",
    developer: "XYZ 소프트웨어",
    stage: "완료",
    startDate: "2023-07-15",
    endDate: "2023-11-30",
  },
  {
    title:
      "웹 포털 보안 강화 프로젝트\n기존 웹 포털의 보안 취약점 개선 및 인증 시스템 강화",
    customer: "GHI 금융",
    developer: "XYZ 소프트웨어",
    stage: "진행",
    startDate: "2023-08-01",
    endDate: "2023-10-31",
  },
  {
    title:
      "데이터 분석 대시보드 개발\n실시간 데이터 시각화 및 분석 대시보드 구축",
    customer: "JKL 리테일",
    developer: "XYZ 소프트웨어",
    stage: "요구분석",
    startDate: "2023-09-01",
    endDate: "2024-01-31",
  },
  {
    title: "AI 기반 고객 서비스 챗봇\n자연어 처리 기반 고객 응대 챗봇 시스템",
    customer: "MNO 서비스",
    developer: "XYZ 소프트웨어",
    stage: "설계",
    startDate: "2023-08-15",
    endDate: "2024-02-28",
  },
];

export default function BoardPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("title");
  const [posts, setPosts] = useState(initialPosts);
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredPosts = posts.filter((post) => {
    if (activeFilter !== "all" && post.stage !== activeFilter) {
      return false;
    }

    const searchTermLower = search.toLowerCase();

    let postValue = "";
    if (filter === "title") {
      const titleAndDescription = `${post.title.split("\\n")[0]} ${
        post.title.split("\\n")[1] || ""
      }`.toLowerCase();
      return titleAndDescription.includes(searchTermLower);
    }

    postValue = (post[filter as keyof Omit<typeof post, "title">] || "")
      .toString()
      .toLowerCase();
    return postValue.includes(searchTermLower);
  });

  const handleEdit = (post: any) => {
    console.log(`Edit post with title: ${post.title.split("\\n")[0]}`);
  };

  const handleDelete = (post: any) => {
    console.log(`Delete post with title: ${post.title.split("\\n")[0]}`);
    // Example: Remove the post from state
    // setPosts(posts.filter(p => p.title !== post.title));
  };

  return (
    <PageContainer>
      <Header>
        <Title>대시보드</Title>
        <Description>
          프로젝트 관리 시스템의 주요 정보를 한눈에 확인하세요
        </Description>
      </Header>
      <TopFilters>
        <TopFilterOption
          $active={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
        >
          전체
        </TopFilterOption>
        <TopFilterOption
          $active={activeFilter === "진행"}
          onClick={() => setActiveFilter("진행")}
        >
          진행중
        </TopFilterOption>
        <TopFilterOption
          $active={activeFilter === "완료"}
          onClick={() => setActiveFilter("완료")}
        >
          완료
        </TopFilterOption>
      </TopFilters>
      <Toolbar>
        <FilterSelect
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="title">프로젝트명</option>
          <option value="customer">고객사명</option>
          <option value="developer">개발사명</option>
        </FilterSelect>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="검색어를 입력하세요"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon />
        </SearchContainer>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <tr>
              <TableHeader $align="left">프로젝트명</TableHeader>
              <TableHeader $align="left">고객사명</TableHeader>
              <TableHeader $align="left">개발사명</TableHeader>
              <TableHeader $align="center">단계</TableHeader>
              <TableHeader $align="center">시작일</TableHeader>
              <TableHeader $align="center">마감일</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {filteredPosts.map((post, index) => (
              <TableRow key={index}>
                <TableCell $align="left">
                  <span>{post.title.split("\\n")[0]}</span>
                  <br />
                  <span>{post.title.split("\\n")[1]}</span>
                </TableCell>
                <TableCell $align="left">{post.customer}</TableCell>
                <TableCell $align="left">{post.developer}</TableCell>
                <TableCell $align="center">
                  <StageBadge $stage={post.stage}>{post.stage}</StageBadge>
                </TableCell>
                <TableCell $align="center">
                  {formatDate(post.startDate)}
                </TableCell>
                <TableCell $align="center">
                  {formatDate(post.endDate)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationContainer>
        <PaginationNav>
          <PaginationButton disabled>{"<"}</PaginationButton>
          <PaginationButton $active={true}>1</PaginationButton>
          <PaginationButton $active={false}>2</PaginationButton>
          <PaginationButton disabled>{">"}</PaginationButton>
        </PaginationNav>
      </PaginationContainer>
    </PageContainer>
  );
}
