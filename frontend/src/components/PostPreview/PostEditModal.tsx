import { Post as PostType } from "@/types";
import { useState } from "react";
import SubmitBtn from "../Buttons/SubmitBtn";
import { updatePost } from "@/API";
import { displayToast } from "../Toast";
import { useNavigate } from "react-router-dom";

export interface PostEditModalProps {
  post: PostType;
  closeModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PostEditModal(props: PostEditModalProps) {
  const navigate = useNavigate();
  const [textContentState, setTextContentState] = useState(
    props.post.textContent,
  );
  const { post } = props;

  async function handleSubmit() {
    if (
      textContentState.length > 2 &&
      textContentState.length < 129 &&
      textContentState !== post.textContent
    ) {
      try {
        // TODO: better toasts
        const response = await updatePost(post.id, textContentState);
        if (response.status === 200)
          displayToast("Post updated successfully.", "success");
        navigate(`/post/${post.id}`);
      } catch {
        displayToast("Unknown error has occurred.", "error");
      } finally {
        props.closeModal(false);
      }
    }
  }

  return (
    <div>
      <div className="fixed left-0 top-0 z-40 h-screen w-screen cursor-default bg-slate-700/50 backdrop-blur-sm" />
      <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform rounded-lg border border-gray-700 bg-appBgColor p-4 text-center">
        <p className="text-2xl font-semibold">Edit post</p>
        <div className="mt-4">
          <textarea
            className="h-40 w-80 rounded-lg border border-gray-700 bg-appBgColor p-2 text-sm"
            defaultValue={post.textContent}
            onChange={(e) => setTextContentState(e.target.value)}
          />
        </div>
        <div className="mt-4 flex w-full flex-row justify-between">
          <button
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm"
            onClick={() => props.closeModal(false)}
          >
            Cancel
          </button>
          <SubmitBtn
            disabled={textContentState === post.textContent}
            onClickHandler={handleSubmit}
            text="Update"
            type="submit"
          />
        </div>
      </div>
    </div>
  );
}
