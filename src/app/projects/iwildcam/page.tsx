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

export default function IWildCamPage() {
  const paperUrl = '/academic_writing.pdf';
  const articleUrl = 'https://medium.com/@bbouslog/iwildcam-2020-trail-camera-animal-classification-2535a23cebae';
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIsMobile = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(hasTouch);
    };
    checkIsMobile();
  }, []);

  return (
    <div className="w-full min-h-screen bg-black text-white pt-24 md:pt-32 pb-24">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">iWildCam 2020 Animal Classification</h1>
        <p className="text-neutral-400 mb-8 text-center max-w-3xl">
          This page showcases the academic paper for a project submitted to the iWildCam 2020 Kaggle Competition. You can read the paper below, or view the accompanying article.
        </p>

        <div className="w-full max-w-4xl flex justify-center items-center gap-4 mb-8">
          <a
            href={articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors duration-300"
          >
            View Article
          </a>
          <a
            href={paperUrl}
            download="iWildCam2020_Paper.pdf"
            className="px-6 py-3 bg-neutral-700 text-white font-semibold rounded-lg hover:bg-neutral-600 transition-colors duration-300"
          >
            Download Paper
          </a>
        </div>

        <div className="w-full max-w-4xl h-[80vh] bg-neutral-900 rounded-lg shadow-2xl overflow-hidden border border-neutral-700">
          {isMobile === null ? (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white">Loading...</p>
            </div>
          ) : isMobile ? (
            <PdfViewer file={paperUrl} />
          ) : (
            <div className="w-full h-full p-2">
              <IframeViewer src={paperUrl} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
