import {
  Wrapper,
  Filters,
  Select,
  NewButton,
  SearchInput,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  StatusBadge,
} from './ProjectBoard.styled';
import type { Post } from '../../types/Types'; 
const posts: Post[] = [
  {
    id: 10,
    title: '데이터베이스 설계 완료 보고서',
    writer: '이개발',
    status: '승인',
    approver: '박관리',
    approvedAt: '2023.09.15',
    createdAt: '2023.09.10',
  },
  {
    id: 9,
    title: 'UI/UX 디자인 검토 요청',
    writer: '최디자인',
    status: '대기',
    approver: '-',
    approvedAt: '-',
    createdAt: '2023.09.05',
  },
  {
    id: 8,
    title: 'API 개발 진행 상황 보고',
    writer: '정백엔드',
    status: '승인',
    approver: '박관리',
    approvedAt: '2023.08.28',
    createdAt: '2023.08.25',
  },
  {
    id: 7,
    title: '프론트엔드 프레임워크 선정 보고서',
    writer: '김프론트',
    status: '반려',
    approver: '이개발',
    approvedAt: '2023.08.20',
    createdAt: '2023.08.18',
  },
  {
    id: 6,
    title: '요구사항 정의서 v1.2',
    writer: '이개발',
    status: '승인',
    approver: '김고객',
    approvedAt: '2023.08.10',
    createdAt: '2023.08.05',
  },
];

const ProjectBoard = () => {
  return (
    <Wrapper>
      <Filters>
        <Select><option>현재 단계: 개발</option></Select>
        <Select><option>승인 상태: 전체</option></Select>
        <Select><option>정렬: 최신순</option></Select>
        <SearchInput placeholder="게시글 검색..." />
        <NewButton>+ 게시글 작성</NewButton>
      </Filters>

      <Table>
        <Thead>
          <Tr>
            <Th>번호</Th>
            <Th>제목</Th>
            <Th>작성자</Th>
            <Th>승인상태</Th>
            <Th>결재자</Th>
            <Th>결재일</Th>
            <Th>작성일</Th>
          </Tr>
        </Thead>
        <Tbody>
          {posts.map((post) => (
            <Tr key={post.id}>
              <Td>{post.id}</Td>
              <Td>
                <strong style={{ color: '#2563eb' }}>{post.title}</strong>
              </Td>
              <Td>{post.writer}</Td>
              <Td>
                <StatusBadge status={post.status as '승인' | '대기' | '반려'}>
                  {post.status}
                </StatusBadge>
              </Td>
              <Td>{post.approver}</Td>
              <Td>{post.approvedAt}</Td>
              <Td>{post.createdAt}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Wrapper>
  );
};

export default ProjectBoard;
