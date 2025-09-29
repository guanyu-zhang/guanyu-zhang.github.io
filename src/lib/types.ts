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