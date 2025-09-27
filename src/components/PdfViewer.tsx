'use client';

import { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useGesture } from '@use-gesture/react';

// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfViewerProps {
  file: string;
}

export default function PdfViewer({ file }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.5);
  const viewerRef = useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [x, y], ...rest }) => {
        if (pinching) return cancel();
        if (viewerRef.current) {
          viewerRef.current.style.cursor = 'grabbing';
          viewerRef.current.scrollLeft = -x;
          viewerRef.current.scrollTop = -y;
        }
      },
      onDragEnd: () => {
        if (viewerRef.current) {
          viewerRef.current.style.cursor = 'grab';
        }
      },
      onPinch: ({ origin: [ox, oy], first, movement: [ms], memo }) => {
        const newScale = first ? scale : memo + ms;
        setScale(Math.max(0.5, Math.min(newScale, 4)));
        return newScale;
      },
    },
    {
      target: viewerRef,
      drag: {
        from: () => [-viewerRef.current!.scrollLeft, -viewerRef.current!.scrollTop],
        filterTaps: true,
        bounds: {
          left: -Infinity,
          right: Infinity,
          top: -Infinity,
          bottom: Infinity,
        },
      },
      pinch: {
        from: () => [scale, 0],
        scaleBounds: { min: 0.5, max: 4 },
      },
    }
  );

  const zoomIn = () => setScale(prevScale => Math.min(prevScale + 0.2, 4));
  const zoomOut = () => setScale(prevScale => Math.max(prevScale - 0.2, 0.5));

  return (
    <div className="w-full h-full flex flex-col items-center touch-none">
      <div className="flex items-center justify-center mb-4 p-2 bg-neutral-800 rounded-lg z-10">
        <button
          onClick={zoomOut}
          className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors duration-300 disabled:bg-neutral-600"
          disabled={scale <= 0.5}
        >
          -
        </button>
        <span className="mx-4 text-lg font-medium tabular-nums">{(scale * 100).toFixed(0)}%</span>
        <button
          onClick={zoomIn}
          className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors duration-300 disabled:bg-neutral-600"
          disabled={scale >= 4}
        >
          +
        </button>
      </div>
      <div
        ref={viewerRef}
        className="w-full h-full overflow-auto cursor-grab"
        style={{ touchAction: 'none' }}
      >
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex justify-center"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={scale}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          ))}
        </Document>
      </div>
    </div>
  );
}