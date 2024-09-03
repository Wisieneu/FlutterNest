import { likePost, unlikePost } from "@/API";
import { SizeType } from "@/types";
import { useCallback, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface LikeBtnProps {
  postId: string;
  likesAmount: number;
  isLikedByCurrentUser: boolean;
  size: SizeType;
}

export default function LikeBtn(props: LikeBtnProps) {
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(props.isLikedByCurrentUser);
  const [likesAmount, setLikesAmount] = useState<number>(props.likesAmount);

  const sendRequest = useCallback(async () => {
    if (isSending) return;
    setIsSending(true);
    if (isLiked) {
      const res = await unlikePost(props.postId);
      if (res.status === 200) {
        setIsLiked(false);
        setLikesAmount(likesAmount - 1);
      }
    } else {
      const res = await likePost(props.postId);
      if (res.status === 200) {
        setIsLiked(true);
        setLikesAmount(likesAmount + 1);
      }
    }
    setIsSending(false);
  }, [isSending]);

  let textSizeClass: string;
  let size: number;
  switch (props.size) {
    case "L":
      textSizeClass = "text-lg";
      size = 16;
      break;
    case "M":
      textSizeClass = "text-base";
      size = 16;
      break;
    case "S":
      textSizeClass = "text-sm";
      size = 14;
  }

  return (
    <div
      className={`mr-1 flex cursor-pointer items-center rounded px-2 py-1 hover:bg-gray-900 ${textSizeClass}`}
      onClick={sendRequest}
    >
      {isLiked ? (
        <FaHeart size={size} className="mr-1" color="red" />
      ) : (
        <FaRegHeart size={size} className="mr-1" />
      )}
      <span>{likesAmount}</span>
    </div>
  );
}
