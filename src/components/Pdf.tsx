'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import IframeViewer from '@/components/IframeViewer';

// Dynamically import PdfViewer to avoid SSR issues and reduce initial bundle size
const PdfViewer = dynamic(() => import('@/components/PdfViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-white">Loading PDF viewer...</p>
    </div>
  ),
});

interface PdfProps {
  src: string;
}

export default function Pdf({ src }: PdfProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for touch support, a common way to identify mobile devices.
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobile(hasTouch);
  }, []);

  // Render a loading state until the check is complete
  if (isMobile === null) {
    return (
      <div className="w-full h-[90vh] flex items-center justify-center bg-neutral-900 rounded-lg">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  // Common Download Button JSX
  const downloadButton = (
    <a
      href={src}
      download
      className="mt-4 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors duration-300 text-center"
    >
      Download PDF
    </a>
  );

  // Render based on device, always with the button above
  return (
    <div className="w-full h-[90vh] flex flex-col items-center gap-4 mb-4">
      {downloadButton} {/* Button is now always above */}
      <div className="w-full flex-grow bg-neutral-900 rounded-lg shadow-2xl overflow-hidden border border-neutral-700">
        {isMobile ? (
          <PdfViewer file={src} />
        ) : (
          <div className="w-full h-full p-2">
            <IframeViewer src={src} />
          </div>
        )}
      </div>
    </div>
  );
}