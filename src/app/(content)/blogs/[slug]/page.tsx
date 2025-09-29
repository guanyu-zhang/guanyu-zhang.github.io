import { getAllPostSlugs, getPostData } from '@/lib/content';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Pdf from '@/components/Pdf';

export async function generateStaticParams() {
  const slugs = getAllPostSlugs('blogs');
  return slugs;
}

async function getPost(slug: string) {
  try {
    const post = await getPostData('blogs', slug);
    return post;
  } catch {
    notFound();
  }
}

export default async function BlogSlugPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  return (
    <div className="w-full min-h-screen bg-black text-white pt-24 md:pt-32 pb-24">
      <div className="container mx-auto px-4">
        <article className="prose prose-invert prose-lg max-w-3xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white">{post.title}</h1>
            <div className="text-neutral-400 mt-4">
              <span>By {post.author}</span>
              <span className="mx-2">|</span>
              <span>{new Date(post.date).toLocaleDateString()}</span>
              <span className="mx-2">|</span>
              <span>{post.location}</span>
            </div>
          </header>
          
          <MDXRemote source={post.content} components={{ Pdf }} />

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
