'use client';

import { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfViewerProps {
  file: string;
}

export default function PdfViewer({ file }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.0);
  const viewerRef = useRef<HTMLDivElement>(null);

  const [{ x, y }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    config: { mass: 0.2, tension: 220, friction: 24 },
  }));

  async function onDocumentLoadSuccess(pdf: PDFDocumentProxy) {
    setNumPages(pdf.numPages);

    if (viewerRef.current) {
      const firstPage = await pdf.getPage(1);
      const pageWidth = firstPage.getViewport({ scale: 1 }).width;
      const containerWidth = viewerRef.current.clientWidth;
      
      // Set initial scale to fit the container width, with a little padding
      const calculatedScale = (containerWidth / pageWidth) * 0.9;
      setScale(calculatedScale);
    }
  }

  useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [dx, dy] }) => {
        if (pinching) return cancel();
        api.start({ x: dx, y: dy });
      },
      onPinch: ({ offset: [s] }) => {
        setScale(s);
      },
    },
    {
      target: viewerRef,
      eventOptions: { passive: false },
      drag: {
        from: () => [x.get(), y.get()],
        bounds: { left: -200, right: 200, top: -200, bottom: 200 },
        rubberband: true,
      },
      pinch: {
        from: () => [scale, 0],
        scaleBounds: { min: 0.5, max: 4 },
        rubberband: true,
      },
    }
  );

  return (
    <div
      ref={viewerRef}
      className="w-full h-full overflow-hidden cursor-grab touch-none relative bg-neutral-900"
    >
      <animated.div
        style={{
          x,
          y,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex justify-center shadow-2xl"
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
      </animated.div>
    </div>
  );
}