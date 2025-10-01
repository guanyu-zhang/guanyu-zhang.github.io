import { getPostData, getSortedPostsData } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';
import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('@/components/PdfViewer'), { ssr: false });
const CommentSection = dynamic(() => import('@/components/CommentSection').then(mod => mod.CommentSection), { ssr: false });

const components = { Pdf: PdfViewer };

export async function generateStaticParams() {
  const posts = await getSortedPostsData('blogs');
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostData('blogs', params.slug);
  const initialComments: any[] = []; // Comments will be fetched client-side

  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-400 mb-8">{post.date}</p>
      <article>
        <MDXRemote source={post.content} components={components} />
        <CommentSection 
          slug={params.slug} 
          initialComments={initialComments} 
        />
      </article>
    </div>
  );
}