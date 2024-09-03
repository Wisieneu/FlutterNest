import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";

import PostMediaPreview from "../MediaPreview/PostMediaPreview";
import ShareBtn from "./ShareBtn";
import CommentsBtn from "./CommentsBtn";
import LikeBtn from "./LikeBtn";

import { convertDateRelative, createImageUrl } from "@/utils";
import { Post as PostType } from "@/types";

export default function PostPreview({ data }: { data: PostType }) {
  const convertedPostDate = convertDateRelative(data.createdAt);
  function handleOptionsBtnClick() {
    console.log("clicked"); // TODO: implement
  }

  // Whether the post is created less than a minute ago - used for the golden highlight effect class
  const createdTimeAgo =
    new Date().getTime() - new Date(data.createdAt).getTime() < 60000;

  return (
    <div
      className={`relative flex w-full border-b border-gray-700 px-8 py-6 shadow-lg ${createdTimeAgo ? "highlight-container" : ""}`}
    >
      <a href={`/u/${data.author.username}`}>
        <img
          className="mr-4 h-12 w-12 rounded-full object-cover shadow"
          src={createImageUrl(data.author.profilePicture)}
          alt="pfp"
        />
      </a>
      <div className="w-full">
        <div className="flex justify-between font-semibold">
          <div className="text-sm">
            <a href={`/u/${data.author.username}`}>
              {data.author.displayName + " "}
              <span className="text-gray-600">
                @{data.author.username}
                {" · "}
              </span>
            </a>
            <div className="inline-block text-gray-600">
              {convertedPostDate}
            </div>
          </div>
          <div
            className="options-btn-container cursor-pointer"
            onClick={handleOptionsBtnClick}
          >
            <BsThreeDots size="24" className="ml-2 text-gray-600" />
          </div>
        </div>

        <Link to={`/post/${data.id}`}>
          <p className="post-text-content my-3 text-wrap break-words sm:max-w-[448px]">
            {data.textContent}
          </p>
        </Link>

        <PostMediaPreview data={data} />

        <div className="interactions-container mt-4 flex items-center text-gray-500">
          <LikeBtn
            postId={data.id}
            likesAmount={data.likesAmount}
            isLikedByCurrentUser={data.isLikedByCurrentUser}
            size="S"
          />
          <CommentsBtn
            postId={data.id}
            commentsAmount={data.commentsAmount}
            size="S"
          />
          <ShareBtn postId={data.id} size="S" />
        </div>
      </div>
    </div>
  );
}
