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
  authorId: string;
  type: string;
  textContent: string;
  createdAt: string;
  updatedAt: string | null;
  parentId: string | null;
  likesAmount: number;
  commentsAmount: number;
  author: User;
  media?: Media[];
  isDeleted: boolean;
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
  type: "pop" | "append";
  filesToAppend?: File[];
  indexToRemove?: number;
};
