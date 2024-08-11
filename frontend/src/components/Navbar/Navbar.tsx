import { FiLogIn, FiSettings } from "react-icons/fi";
import { FaBell, FaHome, FaSearch, FaUser } from "react-icons/fa";
import { useContext } from "react";

import NavbarItem from "./NavbarItem";
import Logo from "@/components/SiteLogo";

export default function Sidebar() {
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
      name: "Profile",
      url: "/me",
      icon: FaUser,
    },
    {
      name: "Notifications",
      url: "/notifications",
      icon: FaBell,
    },
    {
      name: "Chats",
      url: "/chat",
      icon: FiSettings,
    },
    {
      name: "Preferences",
      url: "/preferences",
      icon: FiSettings,
    },
  ];

  return (
    <div className="flex h-screen flex-col">
      <div className="flex h-full w-40 flex-col items-center text-gray-400">
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
          <div className="mt-auto flex w-full flex-col items-center pb-4">
            <NavbarItem name={"Sign in"} url={"/auth/signin"} icon={FiLogIn} />
          </div>
        </div>
      </div>
    </div>
  );
}
