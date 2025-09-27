'use client';

import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfViewerProps {
  file: string;
}

export default function PdfViewer({ file }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scaleState, setScaleState] = useState(1.0);
  const viewerRef = useRef<HTMLDivElement>(null);

  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    config: { mass: 0.2, tension: 220, friction: 24 },
    onChange: ({ value }) => {
      setScaleState(value.scale);
    },
  }));

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const initialScale = isMobile ? 0.6 : 1.2;
    api.set({ scale: initialScale });
  }, [api]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [dx, dy] }) => {
        if (pinching) return cancel();
        api.start({ x: dx, y: dy });
      },
      onPinch: ({ origin: [ox, oy], first, movement: [ms], offset: [s], memo }) => {
        if (first) {
          const { top, left, width, height } = viewerRef.current!.getBoundingClientRect();
          const tx = ox - left - width / 2;
          const ty = oy - top - height / 2;
          memo = [x.get(), y.get(), tx, ty];
        }
        
        const newScale = s;
        const [x_orig, y_orig, tx, ty] = memo;
        
        const newX = x_orig + (1 - newScale / scale.get()) * tx;
        const newY = y_orig + (1 - newScale / scale.get()) * ty;

        api.start({ scale: newScale, x: newX, y: newY });
        return memo;
      },
    },
    {
      target: viewerRef,
      eventOptions: { passive: false },
      drag: {
        from: () => [x.get(), y.get()],
        bounds: { left: -200, right: 200, top: -200, bottom: 200 }, // Example bounds
        rubberband: true,
      },
      pinch: {
        from: () => [scale.get(), 0],
        scaleBounds: { min: 0.5, max: 4 },
        rubberband: true,
      },
    }
  );

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = parseFloat(e.target.value);
    api.start({ scale: newScale, x: 0, y: 0 }); // Also reset position on slider change
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-neutral-900">
      <div className="flex items-center justify-center mb-4 p-2 bg-neutral-800 rounded-lg z-10 shadow-lg">
        <input
          type="range"
          min="0.5"
          max="4"
          step="0.05"
          value={scaleState}
          onChange={handleSliderChange}
          className="w-48 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
        />
        <span className="ml-4 text-lg font-medium tabular-nums w-16 text-center">
          {(scaleState * 100).toFixed(0)}%
        </span>
      </div>
      <div
        ref={viewerRef}
        className="w-full h-full overflow-hidden cursor-grab touch-none relative"
      >
        <animated.div
          style={{
            x,
            y,
            scale,
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
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            ))}
          </Document>
        </animated.div>
      </div>
    </div>
  );
}
