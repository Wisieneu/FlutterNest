import { useLoaderData } from "react-router-dom";

import UserDetailHeader from "@/components/UserDetailHeader";

import { Post, PostType, User } from "@/types";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/Wrappers/AuthProvider";
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
  const [isFormBeingSubmitted, setIsFormBeingSubmitted] =
    useState<boolean>(false);

  let user: User;
  let isViewingSelf: boolean;
  if (loaderUser === "me") {
    user = currentUser as User;
    isViewingSelf = true;
  } else {
    user = loaderUser as User;
    isViewingSelf = loaderUser.username === currentUser?.username;
  }

  useEffect(() => {
    async function fetchPostsPage(page: number) {
      setIsFormBeingSubmitted(true);
      if (activeTab === "Posts") {
        console.log("111111111");
        const newPosts: Post[] = await fetchPostsByUserIdPaginated(
          user.id,
          "post",
          page,
          10,
        );
        setPosts([...posts, ...newPosts]);
      } else if (activeTab === "Comments") {
        console.log("2222222222");
        const newCommments: Post[] = await fetchPostsByUserIdPaginated(
          user.id,
          "comment",
          page,
          10,
        );
        setPosts([...posts, ...newCommments]);
      } else if (activeTab === "Likes") {
        const newLikedPosts: Post[] = await fetchUserLikesPaginated(
          currentUser!.id,
          page,
          10,
        );
        setPosts([...posts, ...newLikedPosts]);
      }
      setIsFormBeingSubmitted(false);
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

  console.log(posts);

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
      <div
        className={`posts-container border-t border-gray-700 ${isFormBeingSubmitted ? "blur-container" : ""}`}
      >
        {posts &&
          posts.map((post, index) => <PostPreview key={index} data={post} />)}
      </div>
    </>
  );
}
