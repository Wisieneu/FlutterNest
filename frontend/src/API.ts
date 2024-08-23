import axios, { AxiosInstance } from "axios";

import { Post, User } from "@/types";
import FormData from "form-data";

const API: AxiosInstance = axios.create({
  baseURL: `http://localhost:6699/api/v1`,
  withCredentials: true,
});

export async function getPosts(page: number, limit: number = 10): Promise<Post[]> {
  const response = await API.get(`/posts?page=${page}&limit=${limit}`);
  return response.data.data.result;
}

export async function getPost(postId: string): Promise<Post> {
  const response = await API.get(`/posts/${postId}`);
  return response.data.data.result;
}

export async function createPost(formData: FormData) {
  const response = await API.post(`/posts`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data', 
      'Accept': 'application/json'
    },
  });
  return response;
}

export async function createComment(postId: string, requestBody: string) {
  const response = API.post(`/posts/${postId}/comment`, requestBody);
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

export async function getUser(): Promise<User> {
  const response = await API.get("/users/me");
  return response.data.data.user;
}
