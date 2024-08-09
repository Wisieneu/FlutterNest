import { IconType } from "react-icons";

interface SidebarItemProps {
  name: string;
  url: string;
  icon: IconType;
}

export default function NavbarItem(props: SidebarItemProps) {
  return (
    <a
      className="mt-2 flex h-12 w-full items-center rounded px-3 hover:bg-gray-700 hover:text-gray-300"
      href={props.url}
    >
      <props.icon className="h-6 w-6 stroke-current" color="#fff" />
      <span className="ml-2 text-sm font-medium">{props.name}</span>
    </a>
  );
}
