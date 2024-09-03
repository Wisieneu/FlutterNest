import { FaRegComment } from "react-icons/fa";

import { SizeType } from "@/types";
import { Link } from "react-router-dom";

interface CommentsBtnProps {
  postId: string;
  commentsAmount: number;
  size: SizeType;
}

export default function CommentsBtn(props: CommentsBtnProps) {
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
    <Link to={`/post/${props.postId}`}>
      <div
        className={`mr-4 flex cursor-pointer items-center rounded px-2 py-1 hover:bg-gray-900 ${textSizeClass}`}
      >
        <FaRegComment size={size} className={`mr-2`} />
        <span>{props.commentsAmount}</span>
      </div>
    </Link>
  );
}
