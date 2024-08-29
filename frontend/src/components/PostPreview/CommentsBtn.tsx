import { FaRegComment } from "react-icons/fa";

import { SizeType } from "@/types";

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
    <div className={`mr-8 flex items-center ${textSizeClass}`}>
      <FaRegComment size={size} className={`mr-2`} />
      <span>{props.commentsAmount}</span>
    </div>
  );
}
