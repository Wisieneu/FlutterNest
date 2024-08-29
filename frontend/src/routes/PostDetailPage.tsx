import { useLoaderData } from "react-router-dom";

import { Post, PostType } from "@/types";
import PostPreviewWithDetails from "@/components/PostPreview/PostPreviewWithDetails";
import PostCreateForm from "@/components/PostCreateForm";
import { useEffect, useState } from "react";
import { isScrolledToBottom } from "@/utils";
import { getPostComments } from "@/API";
import PostPreview from "@/components/PostPreview/PostPreview";

export default function PostDetailPage() {
  const post = useLoaderData() as Post;

  const [page, setPage] = useState<number | null>(1);
  const [commentsArray, setCommentsArray] = useState<Post[]>([]);

  function handleScroll() {
    if (isScrolledToBottom()) setPage((page) => (page ? page + 1 : null));
  }

  /** Attaches an event listener to the window object
   *  to detect when the user scrolls to the bottom of the page
   *  and fetches the next page of posts
   */
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /** Fetches posts from the posts API endpoint each time the user scrolls to the bottom of the page
   *  If no results are returned, resets the page state to 0, which is handled not to fetch anymore
   *  */
  useEffect(() => {
    async function fetchPostsPage() {
      if (page === null) return;
      const newPosts: Post[] = await getPostComments(post.id, page, 10);
      if (newPosts.length > 0) {
        setCommentsArray([...commentsArray, ...newPosts]);
      } else {
        setPage(null);
      }
    }

    fetchPostsPage();
  }, [page]);

  function handleAddNewComment(post: Post) {
    setCommentsArray([post, ...commentsArray]);
  }

  return (
    <div className="post-detail-page post-container">
      <div className="post-detail">
        <PostPreviewWithDetails data={post} />
      </div>
      <div className="p-8 text-3xl font-semibold">Comments</div>
      <div className="mx-auto w-[90%] border-t border-gray-700" />
      <div className="post-create-form">
        <PostCreateForm
          postType="comment"
          parentPostId={post.id}
          textareaPlaceholder="Leave a comment 🐱‍👤"
          insertNewComment={handleAddNewComment}
        />
      </div>
      {commentsArray.length > 0 && (
        <div className="comments-container border-t border-gray-700">
          {commentsArray.map((comment, index) => (
            <PostPreview data={comment} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
