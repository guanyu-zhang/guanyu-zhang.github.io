'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { CommentWithChildren, User } from '@/lib/types';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

interface CommentSectionProps {
  slug: string;
  initialComments: CommentWithChildren[];
  currentUser: User | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'; // Placeholder
const fetcher = (url: string) => fetch(url).then(res => res.json());

// Helper to count total comments, including nested ones
const countComments = (comments: CommentWithChildren[]): number => {
  return comments.reduce((acc, comment) => {
    return acc + 1 + countComments(comment.replies || []);
  }, 0);
};

export default function LoginButtons() {
  const neonAuthHost = process.env.NEXT_PUBLIC_NEON_AUTH_HOST;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!neonAuthHost || !appUrl) {
    console.error('Missing NEXT_PUBLIC_NEON_AUTH_HOST or NEXT_PUBLIC_APP_URL env vars');
    return <p className="text-red-500">Login configuration is missing.</p>;
  }

  const githubLoginUrl = `https://${neonAuthHost}/login?provider=github&redirect_uri=${appUrl}`;
  const googleLoginUrl = `https://${neonAuthHost}/login?provider=google&redirect_uri=${appUrl}`;

  return (
    <div className="border border-gray-700 rounded-lg p-6 text-center">
      <h3 className="font-semibold text-white mb-4">Join the conversation</h3>
      <p className="text-gray-400 mb-6">Please log in to post a comment.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a href={githubLoginUrl} className="px-6 py-2 font-semibold text-white bg-gray-800 border border-gray-600 rounded-md hover:bg-gray-700">
          Login with GitHub
        </a>
        <a href={googleLoginUrl} className="px-6 py-2 font-semibold text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700">
          Login with Google
        </a>
      </div>
    </div>
  );
}

export function CommentSection({ slug, initialComments, currentUser }: CommentSectionProps) {
  const { data: comments, error, mutate } = useSWR<CommentWithChildren[]>(`${API_URL}/api/comments?slug=${slug}`, fetcher, { fallbackData: initialComments });

  const totalComments = comments ? countComments(comments) : 0;
  const limitReached = totalComments >= 100;

  const handlePostComment = async (content: string, parentId: string | null = null) => {
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
      {!comments && <p className="text-gray-400">Loading...</p>}
      {comments && (
        <CommentList comments={comments} onPostReply={handlePostComment} currentUser={currentUser} />
      )}
    </div>
  );
}
