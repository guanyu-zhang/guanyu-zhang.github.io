'use client';

import { useState, useRef, useEffect } from 'react';

export default function CodeBlockWrapper({ children, ...props }: React.ComponentProps<'pre'>) {
  const preRef = useRef<HTMLPreElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (preRef.current) {
      const code = preRef.current.innerText;
      try {
        await navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <div className="relative group">
      <pre ref={preRef} {...props}>{children}</pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 text-xs bg-neutral-800 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}
