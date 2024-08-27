import { useLoaderData } from "react-router-dom";

import { Post } from "@/types";
import PostPreviewWithDetails from "@/components/PostPreview/PostPreviewWithDetails";

export default function PostDetailPage() {
  const post = useLoaderData() as Post;
  console.log(post);
  return (
    <div className="post-detail-page post-container">
      <PostPreviewWithDetails data={post} />
    </div>
  );
}
