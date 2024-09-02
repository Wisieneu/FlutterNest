import axios, { AxiosInstance } from "axios";

import { Post, User } from "@/types";
import FormData from "form-data";

type APIPostType = "post" | "comment" | "repost";

const API: AxiosInstance = axios.create({
  baseURL: `http://localhost:6699/api/v1`,
  withCredentials: true,
});

export async function fetchPostsPaginated(
  page: number = 1,
  limit: number = 10,
): Promise<Post[]> {
  const response = await API.get(`/posts?page=${page}&limit=${limit}`);
  return response.data.data.result;
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
  return response.data.data.result;
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
  const response = await API.post("/users/signout");
  return response;
}

export async function fetchCurrentUser(): Promise<User> {
  const response = await API.get("/users/me");
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

export async function likePost(postId: string) {
  const response = await API.post(`/posts/${postId}/like`);
  return response;
}

export async function unlikePost(postId: string) {
  const response = await API.delete(`/posts/${postId}/like`);
  return response;
}
