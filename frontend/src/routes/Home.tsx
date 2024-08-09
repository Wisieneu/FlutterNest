import { useEffect, useState } from "react";

import { getPosts } from "@/API";

import PostPreview from "@/components/PostPreview";

import { Post } from "@/types";
import { isScrolledToBottom } from "@/utils";

export default function Home() {
  // Fetch the first 10 posts from the API
  const [page, setPage] = useState<number | null>(1);
  const [postsState, setPosts] = useState<Post[]>([]);

  function handleScrollToBottom() {
    const isBottom = isScrolledToBottom();
    if (isBottom && page !== null) setPage((page) => Number(page) + 1);
  }

  /** Attaches the event listener to the window object
   *  to detect when the user scrolls to the bottom of the page
   *  and fetches the next page of posts TODO:
   */
  useEffect(() => {
    window.addEventListener("scroll", () => handleScrollToBottom());
    return () => {
      window.removeEventListener("scroll", () => handleScrollToBottom());
    };
  }, []);

  /** Fetches pages from the posts API endpoint each time the user scrolls to the bottom of the page
   *  If no results are returned, resets the page state to 0, which is handled not to fetch anymore
   *  */
  useEffect(() => {
    async function fetchPosts() {
      if (page === null) return;
      const newPosts: Post[] = await getPosts(page as number);
      if (newPosts.length > 0) {
        setPosts([...postsState, ...newPosts]);
      } else {
        setPage(null);
      }
      console.log(page);
      setPosts([...postsState, ...newPosts]);
    }

    fetchPosts();
  }, [page]);

  return (
    <div className="home">
      <div className="posts-container">
        {postsState.map((post, index) => (
          <PostPreview key={index} data={post} />
        ))}
      </div>
    </div>
  );
}
