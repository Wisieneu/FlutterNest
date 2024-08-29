import { SizeType } from "@/types";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface LikeBtnProps {
  postId: string;
  likesAmount: number;
  isLiked: boolean;
  size: SizeType;
}

// TODO: add likes
export default function LikeBtn(props: LikeBtnProps) {
  function handleLike() {
    console.log("Liked");
  }

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
      className={`mr-3 flex cursor-pointer items-center ${textSizeClass}`}
      onClick={handleLike}
    >
      {props.isLiked ? (
        <FaHeart size={size} className="mr-2" color="red" />
      ) : (
        <FaRegHeart size={size} className="mr-2" />
      )}
      <span>{props.likesAmount}</span>
    </div>
  );
}
