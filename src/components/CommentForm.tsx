'use client';

import { useState } from 'react';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  buttonText?: string;
  initialContent?: string;
}

export default function CommentForm({ onSubmit, buttonText = 'Submit', initialContent = '' }: CommentFormProps) {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await onSubmit(content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment... (Markdown supported)"
          className="w-full px-3 py-2 border rounded-md bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          required
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:bg-gray-500"
        disabled={!content.trim()}
      >
        {buttonText}
      </button>
    </form>
  );
}