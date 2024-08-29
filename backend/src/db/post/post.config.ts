export default {
  maxTextContentLength: 128,
  postTypes: ["post", "comment", "repost"],
} as const;

export type PostType = "post" | "comment" | "repost";
