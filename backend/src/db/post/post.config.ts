export default {
  maxTextContentLength: 128,
  postTypes: ['post', 'comment', 'repost'],
} as const;

export type postType = 'post' | 'comment' | 'repost';
