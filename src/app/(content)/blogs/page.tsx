import Link from 'next/link';
import { getSortedPostsData } from '@/lib/content';
import type { Post } from '@/lib/types';

const POSTS_PER_PAGE = 6;

function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blogs/${post.slug}`}>
      <div className="block p-6 bg-neutral-800 rounded-lg shadow-lg hover:bg-neutral-700 transition-colors duration-300 h-full">
        <h2 className="text-2xl font-bold mb-2 text-white">{post.title}</h2>
        <p className="text-neutral-400 mb-2">{post.author}</p>
        <p className="text-neutral-400">{new Date(post.date).toLocaleDateString()}</p>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const allPosts = getSortedPostsData('blogs');
  const currentPage = 1;
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  const posts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="w-full min-h-screen bg-black text-white pt-24 md:pt-32 pb-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Blog</h1>
        <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-center items-center gap-8 mt-12">
          {/* No Previous button on page 1 */}
          <span className='text-lg font-medium text-white'>
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`/blogs/page/${currentPage + 1}`}>
              <span className="text-lg font-medium text-neutral-400 hover:text-white transition-colors">Next</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
