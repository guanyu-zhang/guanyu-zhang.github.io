'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import IframeViewer from '@/components/IframeViewer';

const PdfViewer = dynamic(() => import('@/components/PdfViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-white">Loading PDF viewer...</p>
    </div>
  ),
});

export default function ResumePage() {
  const resumePdfUrl = '/Guanyu_resume.pdf';
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIsMobile = () => {
      // A more robust way to detect all touch devices, including all iPads.
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(hasTouch);
    };
    checkIsMobile();
    // No need to re-check on resize, as touch capability doesn't change.
  }, []);

  return (
    <div className="w-full min-h-screen bg-black text-white pt-24 md:pt-32 pb-24">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">My Resume</h1>
        <p className="text-neutral-400 mb-8 text-center">
          Here is my resume. You can view it below or download it directly.
        </p>

        <div className="w-full max-w-4xl flex justify-center mb-8">
          <a
            href={resumePdfUrl}
            download="Guanyu_Zhang_Resume.pdf"
            className="px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors duration-300"
          >
            Download PDF
          </a>
        </div>

        <div className="w-full max-w-4xl h-[80vh] bg-neutral-900 rounded-lg shadow-2xl overflow-hidden border border-neutral-700">
          {isMobile === null ? (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white">Loading...</p>
            </div>
          ) : isMobile ? (
            <PdfViewer file={resumePdfUrl} />
          ) : (
            <div className="w-full h-full p-2">
              <IframeViewer src={resumePdfUrl} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
