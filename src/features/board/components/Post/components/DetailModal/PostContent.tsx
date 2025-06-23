import React from "react";
import { renderContentWithMentions } from "@/utils/mentionUtils";
import type { Post } from "@/features/project-d/types/post";

interface PostContentProps {
  post: Post;
  onUserProfileClick: (
    event: React.MouseEvent,
    username: string,
    userId?: number
  ) => void;
}

const PostContent: React.FC<PostContentProps> = ({
  post,
  onUserProfileClick,
}) => {
  return (
    <div style={{ margin: "32px 16px 0 16px" }}>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
        내용
      </div>
      <div
        style={{
          fontSize: 14,
          color: "#444",
          lineHeight: 1.7,
          background: "#f8f9fa",
          borderRadius: 8,
          padding: 16,
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        <div>{renderContentWithMentions(post.content, onUserProfileClick)}</div>
      </div>
    </div>
  );
};

export default PostContent;
