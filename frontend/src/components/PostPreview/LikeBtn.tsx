import { FaHeart, FaRegHeart } from "react-icons/fa";

interface LikeBtnProps {
  postId: string;
  likesAmount: number;
  isLiked: boolean;
}

// TODO: add likes
export default function LikeBtn(props: LikeBtnProps) {
  function handleLike() {
    console.log("Liked");
  }

  return (
    <div
      className="mr-3 flex cursor-pointer items-center text-sm"
      onClick={handleLike}
    >
      {props.isLiked ? (
        <FaHeart className="mr-1 h-4 w-4" color="red" size="14" />
      ) : (
        <FaRegHeart className="mr-1 h-[14px] w-[14px]" />
      )}
      <span>{props.likesAmount}</span>
    </div>
  );
}
