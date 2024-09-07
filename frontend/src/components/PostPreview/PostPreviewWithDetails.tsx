import { useContext, useState } from "react";

import ShareBtn from "./ShareBtn";
import CommentsBtn from "./CommentsBtn";
import LikeBtn from "./LikeBtn";
import SingleMediaElementPreview from "@/components/MediaPreview/SingleMediaElementPreview";
import TwoMediaElementsPreview from "@/components/MediaPreview/TwoMediaElementsPreview";
import { AuthContext } from "@/components/Auth/AuthProvider";

import { convertDateDetailed, createImageUrl } from "@/utils";

import { Post as PostType } from "@/types";
import TripleDotButton from "../Buttons/TripleDotButton";
import PostSettingsContextMenu from "./PostSettingsContextMenu";

export default function PostPreviewWithDetails({ data }: { data: PostType }) {
  const convertedPostDate = convertDateDetailed(data.createdAt);
  const currentUser = useContext(AuthContext);
  const [isOptionsExpanded, expandOptionsMenu] = useState(false);

  let mediaPreviewElement;
  if (data.media && data.media.length > 0) {
    if (data.media.length === 1) {
      mediaPreviewElement = <SingleMediaElementPreview file={data.media[0]} />;
    } else {
      mediaPreviewElement = <TwoMediaElementsPreview files={data.media} />;
    }
  }

  return (
    <div className="flex flex-col shadow-lg">
      <div className="flex w-full items-center px-8 py-6">
        <a href={`/u/${data.author.username}`}>
          <img
            className="mr-4 h-16 w-16 rounded-full object-cover shadow"
            src={createImageUrl(data.author.profilePicture)}
            alt="pfp"
          />
        </a>
        <div className="flex w-full justify-between font-semibold">
          <a href={`/u/${data.author.username}`}>
            <div className="flex flex-col">
              <span>{data.author.displayName}</span>
              <span className="text-gray-600">@{data.author.username}</span>
            </div>
          </a>

          <div className="options-btn-container">
            {currentUser?.id === data.authorId && (
              <>
                <div className="relative">
                  <TripleDotButton
                    size="24"
                    onClickFn={() => expandOptionsMenu((state) => !state)}
                  />
                  {isOptionsExpanded && <PostSettingsContextMenu post={data} />}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <p className="post-text-content my-3 whitespace-normal text-wrap break-words px-8 text-lg">
        {data.textContent}
      </p>
      {/* Post media */}
      <div className="flex w-full px-8 py-4">{mediaPreviewElement}</div>
      <div className="flex w-full px-8 pb-4 text-sm text-gray-500">
        <span className="text-base">
          {convertedPostDate} · {data.viewsAmount} views
        </span>
      </div>
      <div className="mx-auto w-[90%] border-t border-gray-700" />
      <div className="flex w-full px-[20%] py-4">
        <div className="interactions-container flex w-full items-center justify-between text-gray-500">
          <LikeBtn
            postId={data.id}
            likesAmount={data.likesAmount}
            isLikedByCurrentUser={data.isLikedByCurrentUser}
            size={"L"}
          />
          <CommentsBtn
            postId={data.id}
            commentsAmount={data.commentsAmount}
            size={"L"}
          />
          <ShareBtn postId={data.id} size={"L"} />
        </div>
      </div>
    </div>
  );
}
