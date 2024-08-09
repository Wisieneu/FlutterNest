import { BsThreeDots } from "react-icons/bs";

import ShareBtn from "./ShareBtn";
import CommentsBtn from "./CommentsBtn";
import LikesBtn from "./LikeBtn";

import { convertDateRelative } from "@/utils";

import { Post as PostType } from "@/types";

export default function Post({ data }: { data: PostType }) {
  const convertedPostDate = convertDateRelative(data.createdAt);
  return (
    <div className="flex border-b border-gray-700 shadow-lg">
      <div className="flex w-full px-8 py-6">
        <img
          className="mr-4 h-12 w-12 rounded-full object-cover shadow"
          src={`https://wisie-flutternest.s3.eu-central-1.amazonaws.com/${data.author.profilePicture}`}
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

          <p className="mt-3 text-sm">{data.textContent}</p>

          <div className="interactions-container mt-4 flex items-center text-gray-500">
            <LikesBtn
              postId={data.id}
              likesAmount={data.likesAmount}
              isLiked={false}
            />
            <CommentsBtn postId={23} commentAmount={55} />
            <ShareBtn postId={23} />
          </div>
        </div>
      </div>
    </div>
  );
}
