import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkSlug from 'remark-slug';
import { visit } from 'unist-util-visit';
import FlexSearch from 'flexsearch';

// A custom plugin to strip MDX tags and get raw text
function remarkStripMdx() {
  return (tree) => {
    visit(tree, ['mdxjsEsm', 'mdxJsxFlowElement', 'mdxJsxTextElement'], (node, index, parent) => {
      if (parent && parent.children && typeof index === 'number') {
        parent.children.splice(index, 1);
        return [visit.SKIP, index]; // Return new index to continue visiting from the same position
      }
    });
  };
}

const contentDirectory = path.join(process.cwd(), 'src', 'content');
const publicDirectory = path.join(process.cwd(), 'public');

function getPosts(type) {
  const postsDirectory = path.join(contentDirectory, type);
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const filenames = fs.readdirSync(postsDirectory);

  return filenames
    .filter(filename => filename.endsWith('.mdx'))
    .map(filename => {
      const fullPath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      return { ...data, content, slug: filename.replace(/\.mdx$/, ''), type };
    });
}

async function createSearchIndex() {
  console.log('Starting search index build...');

  const blogs = getPosts('blogs');
  const projects = getPosts('projects');
  const allPosts = [...blogs, ...projects];

  const index = new FlexSearch.Document({
    document: {
      id: 'id',
      index: ['content'],
      store: ['title', 'path', 'heading_text', 'heading_slug', 'content_snippet'],
    },
    tokenize: 'forward',
  });

  let docId = 0;

  for (const post of allPosts) {
    const tree = unified()
      .use(remarkParse)
      .use(remarkStripMdx)
      .use(remarkSlug)
      .parse(post.content);

    let currentHeading = null;
    let currentHeadingSlug = null;

    visit(tree, (node) => {
      if (node.type === 'heading') {
        currentHeading = node.children.map(c => c.value).join('');
        currentHeadingSlug = node.data && node.data.id ? node.data.id : null;
      }

      if (node.type === 'paragraph') {
        const content = node.children.map(c => c.value).join('');
        if (content.trim() === '') return;

        index.add({
          id: docId++,
          title: post.title,
          path: `/${post.type}/${post.slug}`,
          heading_text: currentHeading || post.title,
          heading_slug: currentHeadingSlug || '',
          content: content,
          content_snippet: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        });
      }
    });
  }

  console.log(`Indexed ${docId} documents.`);

  const indexFile = path.join(publicDirectory, 'search-index.json');
  const data = {};
  index.export((key, value) => {
    data[key] = value;
  });

  fs.writeFileSync(indexFile, JSON.stringify(data));

  console.log(`Search index built successfully at ${indexFile}`);

  // Create a simple list for default view
  const allContent = allPosts.map(post => ({
    title: post.title,
    slug: post.slug,
    type: post.type,
  }));

  const allContentFile = path.join(publicDirectory, 'all-content.json');
  fs.writeFileSync(allContentFile, JSON.stringify(allContent));
  console.log(`All content list built successfully at ${allContentFile}`);
}

createSearchIndex().catch(console.error);
