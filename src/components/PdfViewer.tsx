'use client';

import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfViewerProps {
  file: string;
}

export default function PdfViewer({ file }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageWidth, setPageWidth] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const transformWrapperRef = useRef<ReactZoomPanPinchRef>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function onPageLoadSuccess(page: { width: number }) {
    setPageWidth(page.width);
  }

  useEffect(() => {
    if (pageWidth && containerRef.current && transformWrapperRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const scale = containerWidth / pageWidth;
      transformWrapperRef.current.setTransform(0, 0, scale, 0);
    }
  }, [pageWidth]);

  return (
    <div className="w-full h-full flex flex-col items-center" ref={containerRef}>
      <TransformWrapper
        ref={transformWrapperRef}
        minScale={0.5}
        maxScale={4}
        limitToBounds={false}
      >
        {({ zoomIn, zoomOut }) => (
          <>
            <div className="flex items-center justify-center mb-4 p-2 bg-neutral-800 rounded-lg z-10">
              <button
                onClick={() => zoomOut(0.2)}
                className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors duration-300"
              >
                -
              </button>
              <span className="mx-4 text-lg font-medium tabular-nums">
                {/* The scale is now managed by TransformWrapper, so we can't directly display it here without more complex state management. We can leave it out for simplicity. */}
              </span>
              <button
                onClick={() => zoomIn(0.2)}
                className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors duration-300"
              >
                +
              </button>
            </div>
            <TransformComponent
              wrapperClass="w-full h-full overflow-auto cursor-grab"
              contentClass="w-full h-full"
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
                    onLoadSuccess={index === 0 ? onPageLoadSuccess : undefined}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                ))}
              </Document>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}