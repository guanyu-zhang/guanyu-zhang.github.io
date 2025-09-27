'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
  { href: '/projects', label: 'Projects' },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-4">
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
    </header>
  );
};

export default Header;
