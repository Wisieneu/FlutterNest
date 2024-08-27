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

  return (
    <Link to={`/post/${data.id}`}>
      <div className="flex w-full border-b border-gray-700 px-8 py-6 shadow-lg">
        <img
          className="mr-4 h-12 w-12 rounded-full object-cover shadow"
          src={createImageUrl(data.author.profilePicture)}
          alt="pfp"
        />
        <div className="w-full">
          <div className="flex justify-between font-semibold">
            <div className="text-sm">
              <a href={`/profile/${data.author.username}`}>
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
            <BsThreeDots size="24" className="ml-2 text-gray-600" />
          </div>

          <p className="my-3">{data.textContent}</p>

          <PostMediaPreview data={data} />

          <div className="interactions-container mt-4 flex items-center text-gray-500">
            <LikeBtn
              postId={data.id}
              likesAmount={data.likesAmount}
              isLiked={false}
            />
            <CommentsBtn
              postId={data.id}
              commentsAmount={data.commentsAmount}
            />
            <ShareBtn postId={data.id} />
          </div>
        </div>
      </div>
    </Link>
  );
}
