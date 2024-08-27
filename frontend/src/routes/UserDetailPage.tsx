import { useLoaderData } from "react-router-dom";

import { User } from "@/types";

export default function UserDetailPage() {
  const user = useLoaderData() as User;
  console.log(user);

  return (
    <>
      <div className="box" />
      <div className="mx-auto mt-20 flex w-full items-start justify-center text-sm antialiased">
        <div className="mx-auto w-full max-w-[600px] border-x border-gray-100 dark:border-gray-800">
          {/* Profile picture and edit button */}
          <div className="flex items-start justify-between px-4 py-3">
            <img
              className="-mt-[4.5rem] h-32 w-32 cursor-pointer rounded-full"
              src="https://pbs.twimg.com/profile_images/1586993585903345664/UCxfdIT1_400x400.jpg"
            />
            <button className="rounded-full border border-gray-300 px-4 py-1.5 font-bold transition duration-150 ease-in-out hover:bg-gray-200 dark:border-gray-500 dark:hover:bg-gray-700">
              Edit profile
            </button>
          </div>

          {/* Name and handle */}
          <div className="mt-2 px-4">
            <h2 className="text-xl font-bold tracking-tight">Ronald Blüthl</h2>
            <span className="text-gray-500 dark:text-gray-400">@rbluethl</span>
          </div>

          {/* Bio */}
          <div className="mt-4 px-4">
            <span>
              ✨ Designing, building and talking about digital products.
            </span>
          </div>

          {/* Location, CTA and join date */}
          <div className="mt-3 flex items-center space-x-4 px-4">
            <div className="flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="h-4 w-4 dark:text-gray-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              <span className="text-gray-500 dark:text-gray-400">
                ✍️ &nbsp;&nbsp;→
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="h-4 w-4 dark:text-gray-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                />
              </svg>
              <a
                className="text-sky-500 hover:underline"
                href="https://r.bluethl.net"
                target="_blank"
              >
                r.bluethl.net
              </a>
            </div>
            <div className="flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="h-4 w-4 dark:text-gray-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>

              <span className="text-gray-700 dark:text-gray-400">
                {" "}
                Joined August 2020
              </span>
            </div>
          </div>

          {/* Following/follower count */}
          <div className="mt-3 flex items-center space-x-4 px-4">
            <div className="cursor-pointer hover:underline">
              <span className="font-bold">168</span>
              <span className="text-gray-700 dark:text-gray-400">
                Following
              </span>
            </div>
            <div className="cursor-pointer hover:underline">
              <span className="font-bold">638</span>
              <span className="text-gray-700 dark:text-gray-400">
                Followers
              </span>
            </div>
          </div>

          {/* Tabs */}
          <ul className="mt-3 flex justify-evenly">
            <li className="relative flex w-full cursor-pointer items-center justify-center p-4 transition duration-150 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800">
              <span className="font-bold">Tweets</span>
              <div className="absolute bottom-0 w-14 border-b-[3px] border-appPurple"></div>
            </li>
            <li className="flex w-full cursor-pointer items-center justify-center p-4 transition duration-150 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800">
              <span className="font-bold text-gray-600 dark:text-gray-400">
                Tweets & replies
              </span>
            </li>
            <li className="flex w-full cursor-pointer items-center justify-center p-4 transition duration-150 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800">
              <span className="font-bold text-gray-600 dark:text-gray-400">
                Media
              </span>
            </li>
            <li className="flex w-full cursor-pointer items-center justify-center p-4 transition duration-150 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800">
              <span className="font-bold text-gray-600 dark:text-gray-400">
                Likes
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
