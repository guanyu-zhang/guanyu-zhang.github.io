import { getAllPostSlugs, getPostData } from '@/lib/content';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Pdf from '@/components/Pdf';
import remarkGfm from 'remark-gfm';
import { useMDXComponents } from '@/mdx-components';

export async function generateStaticParams() {
  const slugs = getAllPostSlugs('projects');
  // If there are no projects, return a dummy slug to prevent build errors with output: 'export'
  if (slugs.length === 0) {
    return [{ slug: 'dummy' }];
  }
  return slugs;
}

async function getPost(slug: string) {
  try {
    const post = await getPostData('projects', slug);
    return post;
  } catch {
    notFound();
  }
}

type Props = {
  params: { slug: string };
};

export default async function ProjectSlugPage({ params }: Props) {
  const post = await getPost(params.slug);

  return (
    <div className="w-full min-h-screen bg-black text-white pt-24 md:pt-32 pb-24">
      <div className="container mx-auto px-4">
        <article className="prose prose-invert prose-lg max-w-3xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white">{post.title}</h1>
            <div className="text-neutral-400 mt-4 flex justify-center items-center flex-wrap gap-x-2">
              <span>By {post.author}</span>
              <span className="hidden sm:inline">|</span>
              <span>{new Date(post.date).toLocaleDateString()}</span>
              {post.location && (
                <>
                  <span className="hidden sm:inline">|</span>
                  <span>{post.location}</span>
                </>
              )}
            </div>
          </header>
          
          <MDXRemote 
            source={post.content} 
            components={useMDXComponents({ Pdf })} 
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} 
          />

          <hr className="my-12 border-neutral-700" />

          {/* Comment Section Placeholder */}
          <div id="comments" className="mt-8">
            <h2 className="text-2xl font-bold text-white">Comments</h2>
            <div className="mt-4 p-4 bg-neutral-900 rounded-lg text-center text-neutral-500">
              <p>Comments are coming soon.</p>
            </div>
          </div>

        </article>
      </div>
    </div>
  );
}
