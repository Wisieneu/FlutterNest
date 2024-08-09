import { BaseSyntheticEvent } from 'react';
import { toast, Slide } from 'react-toastify';

interface ShareBtnProps {
  postId: number;
}

export default function ShareBtn(props: ShareBtnProps) {
  // Copies the link to the post's detail page to clipboard
  function handleShare(event: BaseSyntheticEvent) {
    event.preventDefault();
    navigator.clipboard.writeText(`${window.location.host}/post?id=${props.postId}`);
    toast('Link copied to clipboard', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'dark',
      transition: Slide,
    });
  }

  return (
    <div className="flex text-sm mr-4 cursor-pointer" onClick={handleShare}>
      <svg fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-1" stroke="currentColor">
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
