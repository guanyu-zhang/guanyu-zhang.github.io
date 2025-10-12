'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/lib/hooks';
import { useKBar } from 'kbar';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
  { href: '/projects', label: 'Projects' },
  { href: '/blogs', label: 'Blogs' },
];

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Header = () => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { query } = useKBar();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isMobile === null) {
    return <header className="fixed top-0 left-0 right-0 z-50 p-4 h-[68px]"></header>; // Placeholder for initial render
  }

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div className="mt-4 bg-black/30 backdrop-blur-sm rounded-full p-2 flex items-center justify-between">
        <div className="flex-1 overflow-x-auto whitespace-nowrap no-scrollbar">
          <nav className="flex items-center md:justify-center space-x-2 md:space-x-4 px-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm md:text-base font-medium transition-colors duration-300 px-3 py-1.5 rounded-full ${ 
                    isActive ? 'bg-white text-black' : 'text-neutral-300 hover:bg-white/10 hover:text-white' 
                  }`}>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center">
          {isMobile ? (
            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2.5">
                <MenuIcon />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded-md shadow-lg py-1">
                  <button
                    onClick={() => {
                      query.toggle();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-700 flex items-center"
                  >
                    <SearchIcon className="mr-2" />
                    Search
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => query.toggle()}
              className="text-neutral-300 hover:text-white transition-colors duration-300 p-2.5"
              aria-label="Open search bar"
            >
              <SearchIcon />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
