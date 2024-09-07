import { useState } from "react";

import { MdOutlineEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { TiWarning } from "react-icons/ti";

import PostEditModal from "./PostEditModal";

import { Post as PostType } from "@/types";
import { deletePost } from "@/API";
import { displayToast } from "../Toast";
import { useNavigate } from "react-router-dom";

export interface PostSettingsContextMenuProps {
  post: PostType;
}

export default function PostSettingsContextMenu(
  props: PostSettingsContextMenuProps,
) {
  const { post } = props;
  const navigate = useNavigate();
  const [displayDeleteElement, setDisplayDeleteElement] = useState(false);
  const [isEditModalOpen, setDisplayEditModal] = useState(false);

  async function handlePostDeletion() {
    try {
      const response = await deletePost(post.id);
      if (response.status === 204)
        displayToast("Post deleted successfully.", "success");
    } catch {
      displayToast("Unknown error has occurred.", "error");
    } finally {
      navigate("/");
    }
  }
  return (
    <div className="absolute -left-24 w-40 rounded border border-gray-700 bg-appBgColor p-1">
      {/* Edit post */}
      <div
        className="flex cursor-pointer items-center p-2 hover:bg-gray-800"
        onClick={() => setDisplayEditModal(true)}
      >
        <MdOutlineEdit className="mr-2" size={20} />
        Edit post
      </div>
      {isEditModalOpen && (
        <PostEditModal
          post={post}
          closeModal={() => setDisplayEditModal(false)}
        />
      )}

      {/* Delete post */}
      <div
        className="flex cursor-pointer items-center p-2 text-red-600 hover:bg-red-950"
        onClick={() => setDisplayDeleteElement(true)}
      >
        <FaTrashAlt className="mr-2" size={20} />
        Delete post
      </div>
      {displayDeleteElement && (
        <div
          className="flex cursor-pointer items-center p-2 text-orange-600 hover:bg-orange-950"
          onClick={handlePostDeletion}
        >
          <TiWarning className="mr-2" size={20} />
          Are you sure?
        </div>
      )}
    </div>
  );
}
