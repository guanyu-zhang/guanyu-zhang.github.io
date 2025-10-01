export interface Frontmatter {
  title: string;
  date: string;
  author: string;
  location: string;
}

export interface Post extends Frontmatter {
  slug: string;
}

export interface PostWithContent extends Post {
  content: string;
}

// Types for the Comment System

export interface User {
  id: string;
  name: string | null;
  image: string | null;
}

export interface Comment {
  id: string;
  createdAt: string;
  content: string;
  author: User;
  slug: string;
  parentId: string | null;
}

export interface CommentWithChildren extends Comment {
  replies: CommentWithChildren[];
}