'use client';

import { useState, useRef, MouseEvent } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfViewerProps {
  file: string;
}

export default function PdfViewer({ file }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.5); // Start with a zoomed-in view
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ top: 0, left: 0 });

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (viewerRef.current) {
      setIsDragging(true);
      setStartPos({
        x: e.clientX,
        y: e.clientY,
      });
      setScrollPos({
        top: viewerRef.current.scrollTop,
        left: viewerRef.current.scrollLeft,
      });
      viewerRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (viewerRef.current) {
      viewerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging && viewerRef.current) {
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      viewerRef.current.scrollTop = scrollPos.top - dy;
      viewerRef.current.scrollLeft = scrollPos.left - dx;
    }
  };
  
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (viewerRef.current) {
        viewerRef.current.style.cursor = 'grab';
      }
    }
  };

  const zoomIn = () => setScale(prevScale => Math.min(prevScale + 0.2, 3));
  const zoomOut = () => setScale(prevScale => Math.max(prevScale - 0.2, 0.5));

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="flex items-center justify-center mb-4 p-2 bg-neutral-800 rounded-lg">
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
          disabled={scale >= 3}
        >
          +
        </button>
      </div>
      <div
        ref={viewerRef}
        className="w-full h-full overflow-auto cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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