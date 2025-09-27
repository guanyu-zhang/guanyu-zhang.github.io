'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <main className="flex-grow container mx-auto px-4 pt-24 md:pt-32">
        {children}
      </main>
      {pathname !== '/' && <Footer />}
    </>
  );
}
