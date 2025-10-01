import { getAllPostSlugs, getPostData } from '@/lib/content';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Pdf from '@/components/Pdf';
import remarkGfm from 'remark-gfm';
import { useMDXComponents } from '@/mdx-components';
import { CommentSection } from '@/components/CommentSection';
import { User, CommentWithChildren } from '@/lib/types';

// --- Helper functions to be implemented in the backend --- 
// These are placeholders to simulate fetching data on the server.
async function getUserSession(): Promise<User | null> {
  // In a real backend, this would verify a session cookie and return user data.
  // For now, we'll simulate a logged-out user.
  return null;
}

async function getComments(slug: string): Promise<CommentWithChildren[]> {
  // In a real backend, this would fetch from the database.
  // For now, return an empty array.
  return [];
}
// --- End of helper functions ---

export async function generateStaticParams() {
  const slugs = getAllPostSlugs('projects');
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

  // Fetch user and comments data on the server
  const currentUser = await getUserSession();
  const initialComments = await getComments(params.slug);

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

          <CommentSection 
            slug={params.slug} 
            initialComments={initialComments} 
            currentUser={currentUser} 
          />

        </article>
      </div>
    </div>
  );
}
