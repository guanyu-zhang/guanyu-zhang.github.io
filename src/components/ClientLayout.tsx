'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { StackProvider } from '@stackframe/stack';
import { stackServerApp } from '@/lib/stack'; // Assuming stack.ts is moved to lib

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // some logic
  }, [pathname]);

  return (
    <StackProvider app={stackServerApp}>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </div>
    </StackProvider>
  );
}
