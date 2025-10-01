'use client';

import { useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CommentWithChildren, User } from '@/lib/types';
import CommentForm from './CommentForm';

interface CommentListProps {
  comments: CommentWithChildren[];
  onPostReply: (content: string, parentId: string) => Promise<void>;
  currentUser: User | null;
}

interface CommentItemProps {
  comment: CommentWithChildren;
  onPostReply: (content: string, parentId: string) => Promise<void>;
  currentUser: User | null;
}

function CommentItem({ comment, onPostReply, currentUser }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleReplySubmit = async (content: string) => {
    await onPostReply(content, comment.id);
    setShowReplyForm(false);
  };

  return (
    <div className={`py-4 ${comment.parentId ? 'ml-4 lg:ml-8' : ''}`}>
      <div className="flex items-start">
        {/* Vertical line for threading - not shown for top-level comments */}
        {comment.parentId && <div className="w-px bg-gray-700 h-full mr-4"></div>}
        
        <div className="flex-shrink-0 mr-4">
          <Image 
            src={comment.author.image || '/default-avatar.png'} 
            alt={comment.author.name || 'User'} 
            width={40} 
            height={40} 
            className="rounded-full"
          />
        </div>

        <div className="flex-grow">
          <div className="flex items-center">
            <p className="font-semibold text-white">{comment.author.name || 'Anonymous'}</p>
            <p className="text-sm text-gray-400 ml-3">{new Date(comment.createdAt).toLocaleString()}</p>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-sm text-gray-500 ml-3">
              {isCollapsed ? '[+]' : '[-]'}
            </button>
          </div>
          <div className="prose prose-invert prose-sm max-w-none mt-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment.content}</ReactMarkdown>
          </div>
          {currentUser && (
            <button 
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="mt-2 text-sm text-blue-400 hover:underline"
            >
              Reply
            </button>
          )}
        </div>
      </div>

      {showReplyForm && (
        <div className="ml-14 mt-4">
          <CommentForm onSubmit={handleReplySubmit} buttonText="Post Reply" />
        </div>
      )}

      {!isCollapsed && comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          <CommentList comments={comment.replies} onPostReply={onPostReply} currentUser={currentUser} />
        </div>
      )}
    </div>
  );
}

export default function CommentList({ comments, onPostReply, currentUser }: CommentListProps) {
  return (
    <div className="divide-y divide-gray-800">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} onPostReply={onPostReply} currentUser={currentUser} />
      ))}
    </div>
  );
}