import { BaseSyntheticEvent } from "react";
import { toast, Slide } from "react-toastify";
import { displayToast } from "../Toast";

interface ShareBtnProps {
  postId: string;
}

export default function ShareBtn(props: ShareBtnProps) {
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
      className="mr-4 flex cursor-pointer items-center text-sm"
      onClick={handleShare}
    >
      <svg
        fill="none"
        viewBox="0 0 24 24"
        className="mr-1 h-4 w-4"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
        />
      </svg>
      <span>Share</span>
    </div>
  );
}
