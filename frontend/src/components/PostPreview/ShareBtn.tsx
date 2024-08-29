import { BaseSyntheticEvent } from "react";
import { toast, Slide } from "react-toastify";
import { displayToast } from "../Toast";
import { SizeType } from "@/types";
import { FiShare2 } from "react-icons/fi";

interface ShareBtnProps {
  postId: string;
  size: SizeType;
}

export default function ShareBtn(props: ShareBtnProps) {
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

  // Copies the link to the post's detail page to clipboard
  function handleShare(event: BaseSyntheticEvent) {
    event.preventDefault();
    navigator.clipboard.writeText(
      `${window.location.host}/post?id=${props.postId}`,
    );
    displayToast("Link copied to clipboard.");
  }

  return (
    <div
      className={`mr-4 flex cursor-pointer items-center ${textSizeClass}`}
      onClick={handleShare}
    >
      <FiShare2 size={size} className={`mr-2`} />
      <span>Share</span>
    </div>
  );
}
