'use client';

import { KBarProvider, KBarPortal, KBarPositioner, KBarAnimator, KBarSearch, KBarResults, useMatches, Action, useKBar, useRegisterActions } from 'kbar';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import FlexSearch from 'flexsearch';

// Create a module-level index
// @ts-ignore
const searchIndex = new FlexSearch.Document({
  document: {
    id: 'id',
    index: ['content'],
    store: ['title', 'path', 'heading_text', 'heading_slug', 'content_snippet'],
  },
  tokenize: 'forward',
});

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
  const [indexLoaded, setIndexLoaded] = useState(false);
  const [allContent, setAllContent] = useState<any[]>([]);
  const [contentResults, setContentResults] = useState<Action[]>([]);

  useEffect(() => {
    async function loadData() {
      const [indexRes, contentRes] = await Promise.all([
        fetch('/search-index.json'),
        fetch('/all-content.json'),
      ]);

      const indexData = await indexRes.json();
      for (const key in indexData) {
        // @ts-ignore
        searchIndex.import(key, indexData[key]);
      }

      const contentData = await contentRes.json();
      setAllContent(contentData);

      setIndexLoaded(true);
    }
    loadData();
  }, []);

  const { search } = useKBar((state) => ({ search: state.searchQuery }));

  useEffect(() => {
    if (!indexLoaded) return;

    if (search.length > 0) {
      // @ts-ignore
      const results = searchIndex.search(search, { enrich: true });
      const uniqueResults = results.flatMap((r) => r.result).reduce((acc: any[], doc) => {
        if (!acc.some(item => item.id === doc.id)) {
          acc.push(doc);
        }
        return acc;
      }, []);

      const resultActions: Action[] = uniqueResults.map(doc => ({
        id: String(doc.id),
        name: doc.doc.heading_text,
        subtitle: `In: ${doc.doc.title} - ${doc.doc.content_snippet}`,
        parent: PARENT_SEARCH_ACTION_ID,
        perform: () => {
          router.push(`${doc.doc.path}?highlight=${search}#${doc.doc.heading_slug}`);
        },
      }));
      setContentResults(resultActions);
    } else {
      // When search is empty, show all content as the default
      const defaultActions = allContent.map((post: any) => ({
        id: post.slug,
        name: post.title,
        section: post.type.toUpperCase() + 'S',
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
            <KBarSearch className="w-full px-4 py-3 text-lg bg-transparent border-b border-neutral-800 focus:outline-none" placeholder={'Type a command or search...'} />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}
