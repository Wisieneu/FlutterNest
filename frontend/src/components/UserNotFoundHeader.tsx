import { BiSolidErrorAlt } from "react-icons/bi";

export default function UserNotFoundHeader({
  searchedUsername,
}: {
  searchedUsername: string;
}) {
  return (
    <div className="mx-auto mt-20 flex w-full items-start justify-center text-sm antialiased">
      <div className="mx-auto w-full max-w-[600px] border-x border-gray-100 dark:border-gray-800">
        {/* Profile picture and edit button */}
        <div className="flex items-start justify-between px-4 py-3">
          <div className="bg flex h-32 w-32 items-center justify-center rounded-full bg-slate-800">
            <BiSolidErrorAlt size={72} className="text-center text-appPurple" />
          </div>
        </div>
        <div className="mt-2 px-4">
          <h2 className="text-4xl font-bold tracking-tight">
            User_not_found_404
          </h2>
          <span className="text-gray-500 dark:text-gray-400">
            @{searchedUsername}
          </span>
        </div>
      </div>
    </div>
  );
}
