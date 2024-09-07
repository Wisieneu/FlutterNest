import { IconType } from "react-icons";

enum userRolesEnum {
  user,
  mod,
  admin,
}

export interface PreviewUser {
  id: string;
  username: string;
  displayName: string;
  profilePicture: string;
  createdAt: string;
  role: userRolesEnum;
}

export interface User extends PreviewUser {
  birthDate?: string;
  active: boolean;
  bio?: string;
  website?: string;
  location?: string;
}

export interface SettingsUser extends User {
  email: string;
  lastPasswordChangeDate: string;
}

export interface Post {
  id: string;
  authorId: string;
  type: PostType;
  textContent: string;
  createdAt: string;
  updatedAt: string | null;
  parentId: string | null;
  author: User;
  media?: Media[];
  likesAmount: number;
  commentsAmount: number;
  isLikedByCurrentUser: boolean;
  isDeleted: boolean;
  bookmarksAmount: number;
  viewsAmount: number;
}

export interface Media {
  authorId: string;
  createdAt: string;
  fileName: string;
  fileSize: number;
  id: string;
  mimetype: string;
  postId: string;
}

type UploadedImagesReducerActionBody = {
  type: "pop" | "append" | "clear";
  filesToAppend?: File[];
  indexToRemove?: number;
};

export type PostType = "post" | "comment" | "repost";

type SizeType = "L" | "M" | "S";
