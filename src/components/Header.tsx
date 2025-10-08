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
    return <header className="absolute top-0 left-0 right-0 z-20 p-4 h-[68px]"></header>; // Placeholder for initial render
  }

  if (isMobile) {
    return (
      <header className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
        <div className="overflow-x-auto whitespace-nowrap no-scrollbar pr-4">
          <nav className="flex items-center space-x-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-medium transition-colors duration-300 ${ 
                    isActive ? 'text-white' : 'text-neutral-400 hover:text-white' 
                  }`}>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
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
      </header>
    );
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-4">
      <div className="flex justify-center items-center relative">
        <nav className="flex justify-center items-center space-x-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-medium transition-colors duration-300 ${ 
                  isActive ? 'text-white' : 'text-neutral-400 hover:text-white' 
                }`}>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button 
          onClick={() => query.toggle()}
          className="absolute right-0 text-neutral-400 hover:text-white transition-colors duration-300"
          aria-label="Open search bar"
        >
          <SearchIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
