import { useLoaderData } from "react-router-dom";

import UserDetailHeader from "@/components/UserDetailHeader";

import { Post, PostType, User } from "@/types";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/Auth/AuthProvider";
import { isScrolledToBottom } from "@/utils";
import { fetchPostsByUserIdPaginated, fetchUserLikesPaginated } from "@/API";
import PostPreview from "@/components/PostPreview/PostPreview";
import TabSwitchBtn from "@/components/TabSwitchBtn";

export type TabType = "Posts" | "Comments" | "Likes";

export default function UserDetailPage() {
  // Detect if the viewed user is the one that is currently logged in
  const currentUser = useContext(AuthContext);
  const loaderUser = useLoaderData() as User | "me";
  const [activeTab, setActiveTab] = useState<TabType>("Posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number | null>(1);

  let user: User;
  let isViewingSelf: boolean;
  if (loaderUser === "me") {
    user = currentUser as User;
    isViewingSelf = true;
  } else {
    user = loaderUser as User;
    isViewingSelf = Boolean(
      currentUser && loaderUser.username === currentUser?.username,
    );
  }

  useEffect(() => {
    async function fetchPostsPage(page: number) {
      if (activeTab === "Posts") {
        const newPosts: Post[] = await fetchPostsByUserIdPaginated(
          user.id,
          "post",
          page,
          10,
        );
        setPosts([...posts, ...newPosts]);
      } else if (activeTab === "Comments") {
        const newCommments: Post[] = await fetchPostsByUserIdPaginated(
          user.id,
          "comment",
          page,
          10,
        );
        setPosts([...posts, ...newCommments]);
      } else if (activeTab === "Likes") {
        const newLikedPosts: Post[] = await fetchUserLikesPaginated(
          user.id,
          page,
          10,
        );
        setPosts([...posts, ...newLikedPosts]);
      }
    }

    if (page !== null) fetchPostsPage(page);
  }, [page, activeTab]);

  function handleTabChange(tabName: TabType): void {
    setActiveTab(tabName);
    setPage(1);
    setPosts([]);
  }

  function handleScroll() {
    if (isScrolledToBottom()) setPage((page) => (page ? page + 1 : null));
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* User detail component */}
      <UserDetailHeader user={user} isViewingSelf={isViewingSelf} />

      {/* Tabs */}
      <ul className="mt-3 flex justify-evenly">
        <TabSwitchBtn
          tabName="Posts"
          isActive={"Posts" === activeTab}
          changeTab={handleTabChange}
        />
        <TabSwitchBtn
          tabName="Comments"
          isActive={"Comments" === activeTab}
          changeTab={handleTabChange}
        />
        <TabSwitchBtn
          tabName="Likes"
          isActive={"Likes" === activeTab}
          changeTab={handleTabChange}
        />
      </ul>

      {/* User's post contributions */}
      <div className="posts-container border-t border-gray-700">
        {posts &&
          posts.map((post, index) => <PostPreview key={index} data={post} />)}
      </div>
    </>
  );
}
