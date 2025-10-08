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

// Helper function to recursively get all text from a node
function getNodeText(node) {
  if (node.type === 'text') {
    return node.value;
  }
  if (node.children) {
    return node.children.map(getNodeText).join('');
  }
  return '';
}

async function createSearchIndex() {
  console.log('Starting search index build...');

  const blogs = getPosts('blogs');
  const projects = getPosts('projects');
  const allPosts = [...blogs, ...projects];

  const index = new FlexSearch.Document({
    document: {
      id: 'id',
      index: ['title', 'heading_text', 'content'],
      store: ['title', 'path', 'heading_text', 'heading_slug', 'content_snippet'],
    },
    tokenize: 'full',
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
        currentHeading = getNodeText(node);
        currentHeadingSlug = node.data && node.data.id ? node.data.id : null;
      }

      if (node.type === 'paragraph') {
        const content = getNodeText(node);
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

  // Add static pages manually with comprehensive, sectioned content
  const staticPageSections = [
    // About Page Sections
    {
      id: 'about-intro1',
      title: 'About Me',
      path: '/about',
      heading_text: 'Introduction',
      content: `I hold a Master's in Computer Science from Columbia University, where I specialized in Machine Learning.`
    },
    {
      id: 'about-intro2',
      title: 'About Me',
      path: '/about',
      heading_text: 'Introduction',
      content: `I have professional experience as a software engineer at Ant International and`
    },
    {
      id: 'about-intro3',
      title: 'About Me',
      path: '/about',
      heading_text: 'Introduction',
      content: `am passionate about building intelligent, scalable systems and exploring the frontiers of AI.`
    },
    {
      id: 'about-skills',
      title: 'About Me',
      path: '/about',
      heading_text: 'Technical Skills',
      content: 'C++, Java, Go, Python, JavaScript, SQL, AWS, GCP, Docker, Kubernetes, PyTorch, MongoDB, Redis'
    },
    {
      id: 'about-contact',
      title: 'About Me',
      path: '/about',
      heading_text: 'Contact',
      content: 'You can reach me via email at evanz1627@gmail.com or connect with me on social media. GitHub LinkedIn'
    },
    // Resume Page Section
    {
      id: 'resume-main',
      title: 'Resume',
      path: '/resume',
      heading_text: 'My Resume',
      content: 'My Resume. Here is my resume. You can view it below or download it directly. Download PDF.'
    },
  ];

  for (const section of staticPageSections) {
    index.add({
      id: docId++,
      title: section.title,
      path: section.path,
      heading_text: section.heading_text,
      heading_slug: section.heading_text.toLowerCase().replace(/ /g, '-'), // simple slug generation
      content: section.content,
      content_snippet: section.content.substring(0, 100) + (section.content.length > 100 ? '...' : ''),
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
