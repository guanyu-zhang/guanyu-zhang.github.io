'use client';

import { useStackApp, useUser } from '@stackframe/stack';
import useSWR from 'swr';
import { CommentWithChildren, User } from '@/lib/types';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const fetcher = (url: string) => fetch(url).then(res => res.json());

// Helper to count total comments, including nested ones
const countComments = (comments: CommentWithChildren[]): number => {
  return comments.reduce((acc, comment) => {
    return acc + 1 + countComments(comment.replies || []);
  }, 0);
};

function LoginButtons() {
  const app = useStackApp();

  if (!app) {
    return <p className="text-red-500">Login configuration is missing.</p>;
  }

  return (
    <div className="border border-gray-700 rounded-lg p-6 text-center">
      <h3 className="font-semibold text-white mb-4">Join the conversation</h3>
      <p className="text-gray-400 mb-6">Please log in to post a comment.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a href={app.urls.signInWithProvider('github')} className="px-6 py-2 font-semibold text-white bg-gray-800 border border-gray-600 rounded-md hover:bg-gray-700">
          Login with GitHub
        </a>
        <a href={app.urls.signInWithProvider('google')} className="px-6 py-2 font-semibold text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700">
          Login with Google
        </a>
      </div>
    </div>
  );
}

export function CommentSection({ slug, initialComments }: {
  slug: string;
  initialComments: CommentWithChildren[];
}) {
  const currentUser = useUser();
  const { data: comments, error, mutate } = useSWR<CommentWithChildren[]>(API_URL ? `${API_URL}/api/comments?slug=${slug}` : null, fetcher, { fallbackData: initialComments });

  const totalComments = comments ? countComments(comments) : 0;
  const limitReached = totalComments >= 100;

  const handlePostComment = async (content: string, parentId: string | null = null) => {
    if (!API_URL) {
      alert('API URL is not configured.');
      return;
    }
    if (limitReached) {
      alert('Comment limit reached for this post.');
      return;
    }

    const res = await fetch(`${API_URL}/api/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, content, parentId }),
      credentials: 'include', // Important for sending the session cookie
    });

    if (res.ok) {
      mutate(); // Re-fetch comments
    } else {
      const errorData = await res.json();
      alert(`Failed to post comment: ${errorData.message || 'Server error'}`);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6">Comments ({totalComments})</h2>
      
      <div className="mb-8">
        {currentUser ? (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Leave a Comment</h3>
            {limitReached ? (
              <p className="text-yellow-500">Comment limit reached for this post.</p>
            ) : (
              <CommentForm onSubmit={(content) => handlePostComment(content)} />
            )}
          </div>
        ) : (
          <LoginButtons />
        )}
      </div>

      {error && <p className="text-red-500">Error loading comments.</p>}
      {!comments && !error && <p className="text-gray-400">Loading...</p>}
      {comments && (
        <CommentList comments={comments} onPostReply={handlePostComment} currentUser={currentUser} />
      )}
    </div>
  );
}
