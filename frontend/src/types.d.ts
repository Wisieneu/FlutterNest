import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface SidebarItemProps {
  name: string;
  url: string;
  icon: string | IconDefinition;
}

export interface Profile {
  id: string;
  username: string;
  displayName: string;
  profilePicture: string;
  role: string;
  active: boolean;
}
