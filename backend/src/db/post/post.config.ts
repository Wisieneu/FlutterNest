export default {
  maxTextContentLength: 128,
  maxPostMediaImageSize: 1024 * 1024 * 2, // 2MB
  postTypes: ["post", "comment", "repost"],
} as const;

export type PostType = "post" | "comment" | "repost";
