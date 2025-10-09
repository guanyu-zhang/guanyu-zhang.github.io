'use client';

import { KBarProvider, KBarPortal, KBarPositioner, KBarAnimator, KBarSearch, KBarResults, useMatches, Action, useKBar, useRegisterActions } from 'kbar';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useRef } from 'react';

function RenderResults() {
  const { results } = useMatches();

  if (results.length === 0) {
    return <div className="px-4 py-2 text-sm text-neutral-400">No results found.</div>;
  }

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) => (
        <div>
          {typeof item === 'string' ? (
            <div className="px-4 pt-4 pb-2 font-medium text-neutral-500 text-xs tracking-widest uppercase">{item}</div>
          ) : (
            <div
              onClick={() => item.perform && item.perform(item)}
              className={`px-4 py-3 text-sm flex flex-col cursor-pointer ${
                active ? 'bg-neutral-800' : 'bg-transparent'
              }`}
            >
              <div className='font-medium'>{item.name}</div>
              {item.subtitle && <div className='text-xs text-neutral-400 mt-1'>{item.subtitle}</div>}
            </div>
          )}
        </div>
      )}
    />
  );
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
  { href: '/projects', label: 'Projects' },
  { href: '/blogs', label: 'Blogs' },
];

const PARENT_SEARCH_ACTION_ID = "search-content-parent";

function SearchLogic() {
  const router = useRouter();
  const searchIndexRef = useRef<any>(null);
  const [indexLoaded, setIndexLoaded] = useState(false);
  const [allContent, setAllContent] = useState<any[]>([]);
  const [contentResults, setContentResults] = useState<Action[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!searchIndexRef.current) {
        const FlexSearch = await import('flexsearch');
        const Document = FlexSearch.Document;
        searchIndexRef.current = new Document({
          document: {
            id: 'id',
            index: ['title', 'heading_text', 'content', 'author', 'date', 'location'], // Simplified index fields
            store: ['title', 'path', 'heading_text', 'heading_slug', 'content_snippet', 'chunkId', 'author', 'date', 'location'], // Keep all store fields
          },
          tokenize: 'full',
        });
      }
      const searchIndex = searchIndexRef.current;

      const [indexRes, contentRes] = await Promise.all([
        fetch('/search-index.json'),
        fetch('/all-content.json'),
      ]);

      const indexData = await indexRes.json();
      for (const key in indexData) {
        searchIndex.import(key, indexData[key]);
      }

      const contentData = await contentRes.json();
      setAllContent(contentData);

      setIndexLoaded(true);
    }
    loadData();
  }, []);

  const { search } = useKBar((state) => ({ search: state.searchQuery }));

  // Helper to format subtitle for search results
  const formatSubtitle = (doc: any, query: string) => {
    let subtitleParts = [];
    if (doc.title && doc.title !== doc.heading_text) {
      subtitleParts.push(`In: ${doc.title}`);
    }
    if (doc.author) {
      subtitleParts.push(`By: ${doc.author}`);
    }
    if (doc.date) {
      subtitleParts.push(`On: ${new Date(doc.date).toLocaleDateString()}`);
    }
    if (doc.location) {
      subtitleParts.push(`At: ${doc.location}`);
    }
    if (doc.content_snippet) {
      subtitleParts.push(`Snippet: ${doc.content_snippet}`);
    }
    return subtitleParts.join(' | ');
  };

  useEffect(() => {
    if (!indexLoaded) return;
    const searchIndex = searchIndexRef.current;
    if (!searchIndex) return;

    if (search.length > 0) {
      const results = searchIndex.search(search, { // Use 'search' directly
        enrich: true,
        fields: ['title', 'heading_text', 'content', 'author', 'date', 'location'], // Search across all relevant fields
      });
      const uniqueResults = results.flatMap((r: any) => r.result).reduce((acc: any[], doc: any) => {
        if (!acc.some(item => item.id === doc.id)) {
          acc.push(doc);
        }
        return acc;
      }, []);

      const resultActions: Action[] = uniqueResults.map((doc: any) => ({
        id: String(doc.id),
        name: doc.doc.heading_text,
        subtitle: formatSubtitle(doc.doc, search),
        parent: PARENT_SEARCH_ACTION_ID,
        perform: () => {
          router.push(`${doc.doc.path}?highlight=${search}#${doc.doc.heading_slug}`);
        },
      }));
      setContentResults(resultActions);
    } else {
      const defaultActions = allContent.map((post: any) => ({
        id: post.slug,
        name: post.title,
        section: post.type.toUpperCase(), // Removed extra 'S'
        parent: PARENT_SEARCH_ACTION_ID,
        perform: () => router.push(`/${post.type}/${post.slug}`),
      }));
      setContentResults(defaultActions);
    }
  }, [search, indexLoaded, allContent, router]);

  const initialActions = useMemo(() => [
    ...navLinks.map(link => ({
      id: link.href,
      name: link.label,
      section: 'NAVIGATION',
      perform: () => router.push(link.href),
    })),
    {
      id: PARENT_SEARCH_ACTION_ID,
      name: 'Search all content...',
      section: 'SITE SEARCH',
    },
  ], [router]);

  const allActions = useMemo(() => {
    return [...initialActions, ...contentResults];
  }, [initialActions, contentResults]);

  useRegisterActions(allActions, [allActions]);

  return null;
}

export default function SearchProvider({ children }: { children: React.ReactNode }) {
  return (
    <KBarProvider>
      <SearchLogic />
      <KBarPortal>
        <KBarPositioner className="z-50 bg-black/50 backdrop-blur-sm">
          <KBarAnimator className="w-full max-w-xl bg-neutral-900 text-neutral-100 rounded-lg shadow-lg overflow-hidden">
            <KBarSearch className="w-full px-4 py-3 text-lg bg-transparent border-b border-neutral-800 focus:outline-none" placeholder={'Type a command or search... (e.g., author, keywords, year)'} />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}