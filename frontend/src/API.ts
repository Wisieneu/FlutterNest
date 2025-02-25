import axios, { AxiosInstance } from "axios";
import FormData from "form-data";

import { Post, SettingsUser, User } from "@/types";
import { UserMetadataUpdateFormState } from "@/components/Settings/UserMetadataChangeForm";

type APIPostType = "post" | "comment" | "repost";

let baseURL: string;

if (import.meta.env.VITE_ENV === "PROD") {
  baseURL = import.meta.env.VITE_API_URL_PROD;
} else {
  baseURL = import.meta.env.VITE_API_URL_DEV;
}

const API: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export async function fetchPostsPaginated(
  page: number = 1,
  limit: number = 10,
): Promise<Post[]> {
  const response = await API.get(`/posts?page=${page}&limit=${limit}`);
  return response.data.data;
}

export async function fetchPostsByUserIdPaginated(
  userId: string,
  postType: APIPostType,
  page: number = 1,
  limit: number = 10,
): Promise<Post[]> {
  const response = await API.get(
    `/posts/user/${userId}?type=${postType}&page=${page}&limit=${limit}`,
  );
  return response.data.data.result;
}

export async function fetchUserLikesPaginated(
  userId: string,
  page: number = 1,
  limit: number = 10,
) {
  const response = await API.get(
    `/posts/likes/${userId}?page=${page}&limit=${limit}`,
  );
  return response.data.data;
}

export async function fetchPostById(postId: string): Promise<Post> {
  const response = await API.get(`/posts/${postId}`);
  return response.data.data.result;
}

export async function createPost(formData: FormData) {
  const response = await API.post(`/posts`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
    maxBodyLength: 4096,
  });
  return response;
}

export async function getPostComments(
  postId: string,
  page: number = 1,
  limit: number = 10,
): Promise<Post[]> {
  const response = await API.get(
    `/posts/${postId}/comments?page=${page}&limit=${limit}`,
  );
  return response.data.data.result;
}

export async function createComment(postId: string, requestBody: FormData) {
  const response = API.post(`/posts/${postId}/comments`, requestBody);
  return response;
}

export async function signUp(formState: {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  birthDate: string;
}) {
  const response = await API.post("/users/signup", formState);
  return response;
}

export async function signIn(formState: { login: string; password: string }) {
  const response = await API.post("/users/signin", formState);
  return response;
}

export async function signOut() {
  const response = await API.get("/users/logout");
  return response;
}

export async function fetchAuthContext(): Promise<User> {
  const response = await API.get("/users/authContext");
  return response.data.data.user;
}

export async function fetchUserByUsername(username: string): Promise<User> {
  const response = await API.get(`/users/?username=${username}`);
  return response.data.data.user;
}

export async function fetchUserById(username: string): Promise<User> {
  const response = await API.get(`/users/?id=${username}`);
  return response.data.data.user;
}

export async function fetchUserSettingsData(): Promise<SettingsUser> {
  const response = await API.get(`/users/me/settings`);
  return response.data.data.user;
}

export async function likePost(postId: string) {
  const response = await API.post(`/posts/${postId}/like`);
  return response;
}

export async function unlikePost(postId: string) {
  const response = await API.delete(`/posts/${postId}/unlike`);
  return response;
}

export async function deactivateAccount(password: string) {
  const response = await API.delete("/users/me", { data: password });
  return response;
}

export async function updateUserPassword(
  currentPassword: string,
  newPassword: string,
) {
  const response = await API.patch("/users/me/pwChange", {
    currentPassword,
    newPassword,
  });
  return response;
}

export async function updateUserMetadata(
  formData: UserMetadataUpdateFormState,
) {
  const response = await API.patch("/users/me", formData);
  return response;
}

export async function updateUserProfilePicture(formData: FormData) {
  const response = await API.patch("/users/me/profilePicture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
    maxBodyLength: 1024 * 1024 * 2, // 2MB
  });
  return response;
}

export async function getNewcomerUsers(limit: number) {
  const response = await API.get(`/users/newcomers?limit=${limit}`);
  return response.data.data.users;
}

export async function updatePost(postId: string, textContent: string) {
  const response = await API.patch(`/posts/${postId}`, {
    textContent,
  });
  return response;
}

export async function deletePost(postId: string) {
  const response = await API.delete(`/posts/${postId}`);
  return response;
}
