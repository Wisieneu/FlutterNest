export default {
  maxContentLength: 256,
  postTypes: ['post', 'comment', 'repost'],
} as const;

export type postType = 'post' | 'comment' | 'repost';
