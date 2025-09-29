import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Post, PostWithContent, Frontmatter } from './types';

const contentDirectory = path.join(process.cwd(), 'src', 'content');

function getPostsDirectory(type: 'blogs' | 'projects') {
  return path.join(contentDirectory, type);
}

export function getSortedPostsData(type: 'blogs' | 'projects'): Post[] {
  const postsDirectory = getPostsDirectory(type);
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const filenames = fs.readdirSync(postsDirectory);

  const allPostsData = filenames
    .filter(filename => filename.endsWith('.mdx'))
    .map(filename => {
      const slug = filename.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        ...(data as Frontmatter),
      } as Post;
    });

  return allPostsData.sort((a, b) => {
    // Primary sort: by date in descending order
    if (a.date < b.date) {
      return 1;
    }
    if (a.date > b.date) {
      return -1;
    }

    // Secondary sort: if dates are equal, sort by slug number in descending order
    // Extract number from slug (e.g., "blog12" -> 12)
    const aNum = parseInt(a.slug.replace(/[^0-9]/g, ''), 10);
    const bNum = parseInt(b.slug.replace(/[^0-9]/g, ''), 10);

    if (aNum < bNum) {
      return 1; // bNum (e.g., 12) comes before aNum (e.g., 11)
    }
    if (aNum > bNum) {
      return -1; // aNum (e.g., 11) comes before bNum (e.g., 12)
    }
    return 0; // Should not happen if slugs are unique
  });
}

export function getAllPostSlugs(type: 'blogs' | 'projects') {
  const postsDirectory = getPostsDirectory(type);
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const filenames = fs.readdirSync(postsDirectory);

  return filenames
    .filter(filename => filename.endsWith('.mdx'))
    .map(filename => {
      return {
        slug: filename.replace(/\.mdx$/, ''),
      };
    });
}

export async function getPostData(type: 'blogs' | 'projects', slug: string): Promise<PostWithContent> {
  const fullPath = path.join(getPostsDirectory(type), `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = matter(fileContents);

  return {
    slug,
    content,
    ...(data as Frontmatter),
  } as PostWithContent;
}