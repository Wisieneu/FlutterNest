import { useEffect } from "react";

import { FaLink } from "react-icons/fa6";
import { CiCalendar, CiLocationOn } from "react-icons/ci";

import { User } from "@/types";
import { createImageUrl } from "@/utils";
import UserNotFoundHeader from "./UserNotFoundHeader";

export interface UserDetailHeaderProps {
  user: User | string;
  isViewingSelf: boolean;
}

export default function UserDetailHeader(props: UserDetailHeaderProps) {
  const { user, isViewingSelf } = props;

  if (typeof user === "string")
    return <UserNotFoundHeader searchedUsername={user} />;

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-gb", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div className="mx-auto mt-20 flex w-full items-start justify-center text-sm antialiased">
        <div className="mx-auto w-full max-w-[600px] border-x border-gray-100 dark:border-gray-800">
          {/* Profile picture and edit button */}
          <div className="flex items-start justify-between px-4 py-3">
            <img
              className="-mt-[4.5rem] h-32 w-32 cursor-pointer rounded-full"
              src={createImageUrl(user.profilePicture)}
            />
            {isViewingSelf && (
              <button className="rounded-full border border-gray-300 px-4 py-1.5 font-bold transition duration-150 ease-in-out hover:bg-gray-200 dark:border-gray-500 dark:hover:bg-gray-700">
                Edit profile
              </button>
            )}
          </div>

          {/* Name and @ */}
          <div className="mt-2 px-4">
            <h2 className="text-xl font-bold tracking-tight">
              {user.displayName}
            </h2>
            <span className="text-gray-500">@{user.username}</span>
          </div>

          {/* Bio */}
          <div className="mt-4 px-4">
            <span>{user.bio}</span>
          </div>

          {/* Location, CTA and join date */}
          <div className="mt-3 flex items-center space-x-4 px-4">
            {user.location && (
              <div className="flex items-center space-x-1">
                <CiLocationOn size={16} className="text-gray-400" />
                <span className="text-gray-500">{user.location}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center space-x-1 text-gray-500">
                <FaLink size={16} className="" />
                <a
                  className="text-sky-500 hover:underline"
                  href={`${user.website}`}
                  target="_blank"
                >
                  {user.website}
                </a>
              </div>
            )}
            <div className="flex items-center space-x-1 text-gray-500">
              <CiCalendar size={16} />

              <span>Joined {joinedDate}</span>
            </div>
          </div>

          {/* Following/follower count */}
          {/*TODO: Replace with actual followers count */}
          <div className="mt-3 flex items-center space-x-4 px-4">
            <div className="cursor-pointer hover:underline">
              <span className="font-bold">0</span>{" "}
              <span className="text-gray-500">Following</span>
            </div>
            <div className="cursor-pointer hover:underline">
              <span className="font-bold">0</span>{" "}
              <span className="text-gray-500">Followers</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
