import { getAllPostSlugs, getPostData } from '@/lib/content';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Pdf from '@/components/Pdf';

export async function generateStaticParams() {
  const slugs = getAllPostSlugs('projects');
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
            <div className="text-neutral-400 mt-4">
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
          </header>
          
          <MDXRemote source={post.content} components={{ Pdf }} />

        </article>
      </div>
    </div>
  );
}
