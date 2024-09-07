import { FaBug, FaLightbulb } from "react-icons/fa";

import UserPreviewSmall from "@/components/UserPreviewSmall";

import { PreviewUser } from "@/types";
import { useEffect, useState } from "react";
import { getNewcomerUsers } from "@/API";
import RepoLinkSidebarElement from "./RepoLinkSidebarElement";

export default function Sidebar() {
  const [users, setUsers] = useState<PreviewUser[]>([]);

  useEffect(() => {
    async function fetchNewcomers() {
      const users = await getNewcomerUsers(4);
      setUsers(users);
    }
    fetchNewcomers();
  }, []);

  return (
    <div className="flex w-48 flex-col gap-4">
      <RepoLinkSidebarElement />
      <div className="border-t border-gray-700 p-2">
        <p className="p-1 text-center">Freshly baked users</p>
        {users &&
          users.map((user: PreviewUser, index: number) => (
            <UserPreviewSmall user={user} key={index} />
          ))}
      </div>
    </div>
  );
}
