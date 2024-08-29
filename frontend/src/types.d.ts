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
  active: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  type: PostType;
  textContent: string;
  createdAt: string;
  updatedAt: string | null;
  parentId: string | null;
  likesAmount: number;
  commentsAmount: number;
  author: User;
  media?: Media[];
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
