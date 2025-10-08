'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, memo } from 'react';
import Mark from 'mark.js';

const HighlightWrapper = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const highlightQuery = searchParams.get('highlight');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightQuery && contentRef.current) {
      const markInstance = new Mark(contentRef.current);
      // Unmark previous highlights before applying new ones
      markInstance.unmark({
        done: () => {
          markInstance.mark(highlightQuery, {
            element: 'mark',
            className: 'bg-yellow-400 text-black px-1 rounded-sm',
          });
        },
      });
    }
  }, [highlightQuery, children]); // Rerun when query or children change

  return <div ref={contentRef}>{children}</div>;
};

export default memo(HighlightWrapper);
