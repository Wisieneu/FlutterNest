import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SidebarItemProps } from '../../../types';

export default function NavbarItem(props: SidebarItemProps) {
  const itemIcon =
    typeof props.icon === 'string' ? (
      <svg
        className="w-6 h-6 stroke-current"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={props.icon}
        />
      </svg>
    ) : (
      <FontAwesomeIcon icon={props.icon} className="w-6 h-6 stroke-current" />
    );

  return (
    <a
      className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300"
      href={props.url}
    >
      {itemIcon}
      <span className="ml-2 text-sm font-medium">{props.name}</span>
    </a>
  );
}
