'use client';

import { useState, useRef, MouseEvent, TouchEvent } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfViewerProps {
  file: string;
}

export default function PdfViewer({ file }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.5);
  const viewerRef = useRef<HTMLDivElement>(null);

  // Mouse drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ top: 0, left: 0 });

  // Touch pinch/zoom state
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
  const [initialScaleOnPinch, setInitialScaleOnPinch] = useState<number | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  // Mouse handlers
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (viewerRef.current && e.button === 0) { // Only left click
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

  // Touch handlers
  const getDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const [t1, t2] = [touches[0], touches[1]];
    return Math.sqrt(Math.pow(t2.clientX - t1.clientX, 2) + Math.pow(t2.clientY - t1.clientY, 2));
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (viewerRef.current) {
      if (e.touches.length === 2) {
        e.preventDefault(); // Prevent default zoom behavior
        setInitialPinchDistance(getDistance(e.touches));
        setInitialScaleOnPinch(scale);
      } else if (e.touches.length === 1) {
        setIsDragging(true);
        setStartPos({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        });
        setScrollPos({
          top: viewerRef.current.scrollTop,
          left: viewerRef.current.scrollLeft,
        });
      }
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (viewerRef.current) {
      if (e.touches.length === 2 && initialPinchDistance !== null && initialScaleOnPinch !== null) {
        e.preventDefault(); // Prevent default zoom behavior
        const currentDistance = getDistance(e.touches);
        const newScale = initialScaleOnPinch * (currentDistance / initialPinchDistance);
        setScale(Math.max(0.5, Math.min(newScale, 4)));
      } else if (isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - startPos.x;
        const dy = e.touches[0].clientY - startPos.y;
        viewerRef.current.scrollTop = scrollPos.top - dy;
        viewerRef.current.scrollLeft = scrollPos.left - dx;
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setInitialPinchDistance(null);
    setInitialScaleOnPinch(null);
  };

  const zoomIn = () => setScale(prevScale => Math.min(prevScale + 0.2, 4));
  const zoomOut = () => setScale(prevScale => Math.max(prevScale - 0.2, 0.5));

  return (
    <div className="w-full h-full flex flex-col items-center">
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
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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