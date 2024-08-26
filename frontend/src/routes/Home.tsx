import { useEffect, useState } from "react";

import { getPosts } from "@/API";

import PostPreview from "@/components/PostPreview";
import PostCreateForm from "@/components/PostCreateForm";

import { Post } from "@/types";
import { isScrolledToBottom } from "@/utils";

export default function Home() {
  // Fetch the first 10 posts from the API
  const [page, setPage] = useState<number | null>(1);
  const [postsState, setPosts] = useState<Post[]>([]);

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
      const newPosts: Post[] = await getPosts(page);
      if (newPosts.length > 0) {
        setPosts([...postsState, ...newPosts]);
      } else {
        setPage(null);
      }
    }

    fetchPostsPage();
  }, [page]);

  return (
    <div className="home">
      <PostCreateForm />
      <div className="posts-container border-t border-gray-700">
        {postsState.map((post, index) => (
          <PostPreview key={index} data={post} />
        ))}
      </div>
    </div>
  );
}
