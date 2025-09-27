'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfViewerProps {
  file: string;
  /** 全宽适配时预留的左右内边距比例，默认 0.98（留 2% 边缘，避免紧贴） */
  widthPaddingRatio?: number; // 0~1
  /** 缩放下限/上限 */
  minScale?: number;
  maxScale?: number;
}

export default function PdfViewer({
  file,
  widthPaddingRatio = 0.98,
  minScale: minScaleLimit = 0.25,
  maxScale: maxScaleLimit = 6,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // 统计每页渲染完成，全部完成后再精确适配
  const renderedPagesRef = useRef(0);
  useEffect(() => {
    renderedPagesRef.current = 0;
  }, [numPages]);

  const centerFitWidth = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inst: any = transformRef.current?.instance;
    if (!inst) return;

    const wrapper: HTMLDivElement | undefined = inst.wrapperComponent;
    const content: HTMLDivElement | undefined = inst.contentComponent;
    if (!wrapper || !content) return;

    const ww = wrapper.clientWidth;
    const wh = wrapper.clientHeight;
    const cw = content.scrollWidth;   // 内容自然宽度
    const ch = content.scrollHeight;  // 内容自然高度
    if (!ww || !wh || !cw || !ch) return;

    // —— 核心策略：严格“全宽适配” —— //
    let scale = (ww / cw) * widthPaddingRatio;

    // clamp 到 min/max
    scale = Math.min(Math.max(scale, minScaleLimit), maxScaleLimit);

    // 计算使内容在当前 scale 下“水平居中 + 垂直居中”
    //（如果内容高度 > 容器高度，会出现上下可拖动，limitToBounds=true 会帮你限位）
    const x = (ww - cw * scale) / 2;
    const y = (wh - ch * scale) / 2;

    // 交给库自身的边界限制去收敛（不手动硬夹，避免与库的内置逻辑冲突）
    transformRef.current?.setTransform(x, y, scale, 0);
  }, [widthPaddingRatio, minScaleLimit, maxScaleLimit]);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: PDFDocumentProxy) => {
      setNumPages(numPages);
      // 先粗略适配一遍，避免白屏/抖动；精确适配在全部页面渲完后做
      requestAnimationFrame(centerFitWidth);
    },
    [centerFitWidth]
  );

  const onPageRenderSuccess = useCallback(() => {
    renderedPagesRef.current += 1;
    if (renderedPagesRef.current === numPages) {
      requestAnimationFrame(centerFitWidth);
    }
  }, [numPages, centerFitWidth]);

  // 监听窗口变化
  useEffect(() => {
    const onResize = () => requestAnimationFrame(centerFitWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [centerFitWidth]);

  // 监听容器自身尺寸变化
  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver(() => requestAnimationFrame(centerFitWidth));
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [centerFitWidth]);

  return (
    <div ref={wrapperRef} className="w-full h-full bg-neutral-900">
      <TransformWrapper
        ref={transformRef}
        minScale={minScaleLimit}
        maxScale={maxScaleLimit}
        limitToBounds={true}   // 保证不会被拖出可视区域
        centerOnInit={false}   // 我们手动控制初始位置
        doubleClick={{ disabled: true }} // 可选：禁用双击自动缩放，避免破坏全宽
      >
        <TransformComponent
          // wrapper: 真实宽高 + 隐藏溢出
          wrapperStyle={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}
          // content: 收缩到内容自然尺寸，确保测量准确
          contentStyle={{ width: 'max-content', height: 'max-content', display: 'inline-block' }}
        >
          {/* 让多页在视觉上居中排列；不影响测量 */}
          <div className="flex flex-col items-center">
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
              {Array.from({ length: numPages }, (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  onRenderSuccess={onPageRenderSuccess}
                />
              ))}
            </Document>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
