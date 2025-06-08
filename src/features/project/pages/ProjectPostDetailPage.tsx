import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { PostDetail, Comment } from "../types/post";
import { getPostDetail } from "../services/postService";
import CommentList from "../components/CommentList/CommentList";
import {
  PageContainer,
  PostContainer,
  PostHeader,
  PostTitle,
  PostMeta,
  PostContent,
  BackButton,
  PostInfo,
  PostInfoItem,
  PostInfoLabel,
  PostInfoValue,
  CommentSection,
} from "./ProjectPostDetailPage.styled";

export default function ProjectPostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postId) return;
        const response = await getPostDetail(parseInt(postId));
        setPost(response.data);
      } catch (err) {
        setError("게시글을 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleReply = async (parentId: number, content: string) => {
    // TODO: 댓글 작성 API 구현
    console.log("Reply to comment:", parentId, content);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <PageContainer>
      <PostContainer>
        <BackButton onClick={() => navigate("/projects/posts")}>
          ← 목록으로 돌아가기
        </BackButton>

        <PostHeader>
          <PostTitle>{post.title}</PostTitle>
          <PostMeta>
            <span>작성자: {post.author.name}</span>
            <span>작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
          </PostMeta>
        </PostHeader>

        <PostInfo>
          <PostInfoItem>
            <PostInfoLabel>프로젝트</PostInfoLabel>
            <PostInfoValue>{post.project.name}</PostInfoValue>
          </PostInfoItem>
          <PostInfoItem>
            <PostInfoLabel>상태</PostInfoLabel>
            <PostInfoValue>{post.status}</PostInfoValue>
          </PostInfoItem>
          <PostInfoItem>
            <PostInfoLabel>유형</PostInfoLabel>
            <PostInfoValue>{post.type}</PostInfoValue>
          </PostInfoItem>
          <PostInfoItem>
            <PostInfoLabel>우선순위</PostInfoLabel>
            <PostInfoValue>{post.priority}</PostInfoValue>
          </PostInfoItem>
        </PostInfo>

        <PostContent>{post.content}</PostContent>

        <CommentSection>
          <CommentList comments={post.comments} onReply={handleReply} />
        </CommentSection>
      </PostContainer>
    </PageContainer>
  );
}
