import { useContext, useState } from "react";

import { FiLogIn, FiSettings } from "react-icons/fi";
import { FaRegMessage } from "react-icons/fa6";
import { FaBell, FaHome, FaSearch, FaRegUser, FaGithub } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";

import { createImageUrl } from "@/utils";

import TripleDotButton from "@/components/Buttons/TripleDotButton";
import Logo from "@/components/SiteLogo";
import NavbarItem from "@/components/Navbar/NavbarItem";
import { AuthContext } from "@/components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { signOut } from "@/API";
import { displayToast } from "../Toast";

export default function Sidebar() {
  const navigate = useNavigate();

  const user = useContext(AuthContext);
  const [userContextExpanded, setUserContextExpanded] = useState(false);

  async function handleLogoutUser() {
    const response = await signOut();
    if (response.status === 200) {
      navigate(0);
    } else {
      displayToast("Unknown error has occurred", "error");
    }
  }

  const socialButtonsData = [
    {
      name: "Home",
      url: "/",
      icon: FaHome,
    },
    {
      name: "Search",
      url: "/search",
      icon: FaSearch,
    },
  ];

  const personalButtonsData = [
    {
      name: "My profile",
      url: user ? `/u/${user.username}` : "/auth/signin",
      icon: FaRegUser,
    },
    {
      name: "Notifications",
      url: "/notifications",
      icon: FaBell,
    },
    {
      name: "User settings",
      url: "/settings",
      icon: FiSettings,
    },
    {
      name: "Chats",
      url: "/chat",
      icon: FaRegMessage,
    },
    {
      name: "FlutterNest on GitHub",
      url: "https://github.com/Wisieneu/FlutterNest",
      icon: FaGithub,
    },
  ];

  return (
    <>
      <div
        id="navbar"
        className="sticky top-0 h-screen border-r border-gray-700"
      >
        <div className="flex h-full w-48 flex-col items-center text-gray-400">
          <Logo />
          <div className="flex w-full flex-1 flex-col px-2">
            <div className="flex w-full flex-col items-center">
              {socialButtonsData.map((el, index) => (
                <NavbarItem
                  key={index}
                  name={el.name}
                  url={el.url}
                  icon={el.icon}
                />
              ))}
            </div>
            <div className="mt-2 flex w-full flex-col items-center border-t border-gray-700">
              {personalButtonsData.map((el, index) => (
                <NavbarItem
                  key={index}
                  name={el.name}
                  url={el.url}
                  icon={el.icon}
                />
              ))}
            </div>
            <div className="relative mt-auto">
              {!user ? (
                <div className="mt-auto flex w-full flex-col items-center pb-4">
                  <NavbarItem
                    name={"Sign in"}
                    url={"/auth/signin"}
                    icon={FiLogIn}
                  />
                </div>
              ) : (
                <div>
                  {userContextExpanded && (
                    <div
                      className="absolute top-0 w-full -translate-y-full cursor-pointer"
                      onClick={handleLogoutUser}
                    >
                      <NavbarItem
                        name={`Log out of @${user.username}`}
                        icon={CiLogout}
                      />
                    </div>
                  )}
                  <div
                    className="mb-2 flex cursor-pointer items-center rounded-full px-3 py-2 hover:bg-gray-900"
                    onClick={() => setUserContextExpanded(!userContextExpanded)}
                  >
                    <img
                      className="h-8 w-8 cursor-pointer rounded-full"
                      src={createImageUrl(user.profilePicture)}
                    />
                    <div className="ml-2 text-sm text-gray-500">
                      <p className="text-white">{user.displayName}</p>
                      <p>@{user.username}</p>
                    </div>
                    <div className="ml-auto">
                      <TripleDotButton size="16" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
