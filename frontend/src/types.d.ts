import { IconType } from "react-icons";

enum userRolesEnum {
  user,
  mod,
  admin,
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  createdAt: string;
  birthDate: string | null;
  profilePicture: string;
  role: userRolesEnum;
}

export interface Post {
  id: string;
  type: string;
  textContent: string;
  createdAt: string;
  updatedAt: string | null;
  parentId: string | null;
  isDeleted: boolean;
  likesAmount: string;
  author: User;
}
