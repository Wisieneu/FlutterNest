import { BsThreeDots } from "react-icons/bs";

import ShareBtn from "./ShareBtn";
import CommentsBtn from "./CommentsBtn";
import LikeBtn from "./LikeBtn";

import { convertDateRelative, createImageUrl } from "@/utils";

import { Post as PostType } from "@/types";
import SingleMediaElementPreview from "../MediaPreview/SingleMediaElementPreview";
import TwoMediaElementsPreview from "../MediaPreview/TwoMediaElementsPreview";
import MultipleMediaElementsPreview from "../MediaPreview/MultipleMediaElementsPreview";

export default function PostPreview({ data }: { data: PostType }) {
  const convertedPostDate = convertDateRelative(data.createdAt);

  let mediaPreviewElement;
  if (data.media && data.media.length > 0) {
    if (data.media.length === 1) {
      mediaPreviewElement = <SingleMediaElementPreview file={data.media[0]} />;
    } else if (data.media.length === 2) {
      mediaPreviewElement = <TwoMediaElementsPreview files={data.media} />;
    } else {
      mediaPreviewElement = <MultipleMediaElementsPreview files={data.media} />;
    }
  }

  return (
    <div className="flex border-b border-gray-700 shadow-lg">
      <div className="flex w-full px-8 py-6">
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

          {mediaPreviewElement}

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
    </div>
  );
}
