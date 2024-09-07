import { PreviewUser } from "@/types";
import { convertDateRelative, createImageUrl } from "@/utils";
import { BsArrow90DegDown } from "react-icons/bs";
import { Link } from "react-router-dom";

export interface UserPreviewSmallProps {
  user: PreviewUser;
}

export default function UserPreviewSmall(props: UserPreviewSmallProps) {
  const user = props.user;
  return (
    <Link to={`/u/${user.username}`}>
      <div className="my-5 cursor-pointer text-xs">
        <div className="flex justify-center text-purple-800">
          <BsArrow90DegDown />
          <span className="ml-1">
            Joined {convertDateRelative(user.createdAt)}
          </span>
        </div>
        <div className="flex w-full py-1">
          <img
            src={createImageUrl(user.profilePicture)}
            className="h-8 w-8 rounded-full"
          />
          <div className="mx-2">
            <p className="text-white">{user.displayName}</p>
            <p className="text-gray-500">@{user.username}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
