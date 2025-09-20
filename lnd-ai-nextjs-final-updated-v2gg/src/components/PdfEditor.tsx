"use client";
import React, { useState, useRef, useCallback, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb } from 'pdf-lib';

// Set worker source from a CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

// --- TYPE DEFINITIONS ---
interface RectangleData { x: number; y: number; width: number; height: number; }
type AnnotationData = RectangleData;

interface Annotation {
  id: string;
  type: 'rectangle' | 'highlight';
  color: string;
  strokeWidth: number;
  data: AnnotationData;
}

// --- THUMBNAIL COMPONENT ---
const Thumbnail = ({ page, onPageSelect, isSelected }: { page: pdfjsLib.PDFPageProxy, onPageSelect: () => void, isSelected: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const render = async () => {
            if(!page || !canvasRef.current) return;
            const viewport = page.getViewport({ scale: 0.2 });
            const canvas = canvasRef.current;
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const ctx = canvas.getContext('2d');
            if(!ctx) return;
            await page.render({ canvasContext: ctx, viewport }).promise;
        }
        render();
    }, [page]);
    return <div onClick={onPageSelect} className={`thumbnail-item ${isSelected ? 'selected' : ''}`}><canvas ref={canvasRef}></canvas><p>Page {page.pageNumber}</p></div>;
};

// --- MAIN PDF EDITOR COMPONENT ---
const PdfEditor = () => {
  // --- STATE AND REFS ---
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [originalPdfBytes, setOriginalPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<pdfjsLib.PDFPageProxy[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [annotations, setAnnotations] = useState<{ [pageIndex: number]: Annotation[] }>({});
  const [activeTool, setActiveTool] = useState('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [strokeColor, setStrokeColor] = useState('#ff0000');
  const [strokeWidth, setStrokeWidth] = useState(2);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  // --- CORE PDF & RENDERING LOGIC ---
  const loadPdfForViewing = useCallback(async (pdfData: ArrayBuffer) => {
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    const allPages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        allPages.push(page);
    }
    setPages(allPages);
  }, []);

  const generatePdfBytes = useCallback(async () => {
    if (!originalPdfBytes) return null;
    const newLibPdfDoc = await PDFDocument.load(originalPdfBytes);
    for (const pageIndexStr in annotations) {
      const pageIndex = parseInt(pageIndexStr, 10);
      const pageAnnotations = annotations[pageIndex];
      const page = newLibPdfDoc.getPage(pageIndex);
      for (const anno of pageAnnotations) {
        const color = rgb(
          parseInt(anno.color.slice(1, 3), 16) / 255,
          parseInt(anno.color.slice(3, 5), 16) / 255,
          parseInt(anno.color.slice(5, 7), 16) / 255
        );
        if (anno.type === 'rectangle' || (anno.type === 'highlight' && 'width' in anno.data)) {
          page.drawRectangle({
            ...(anno.data as RectangleData),
            borderColor: anno.type === 'rectangle' ? color : undefined,
            borderWidth: anno.type === 'rectangle' ? anno.strokeWidth : 0,
            color: anno.type === 'highlight' ? color : undefined,
            opacity: anno.type === 'highlight' ? 0.3 : 1,
          });
        }
      }
    }
    return await newLibPdfDoc.save();
  }, [annotations, originalPdfBytes]);

  const applyAnnotationsAndRender = useCallback(async () => {
    setIsProcessing(true);
    const pdfBytes = await generatePdfBytes();
    if (pdfBytes) {
      await loadPdfForViewing(pdfBytes.slice().buffer);
    }
    setIsProcessing(false);
  }, [generatePdfBytes, loadPdfForViewing]);

  const renderPage = useCallback(async (page: pdfjsLib.PDFPageProxy) => {
    if (!page) return;
    const viewport = page.getViewport({ scale: zoom });
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!canvas || !overlayCanvas) return;
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    overlayCanvas.height = viewport.height;
    overlayCanvas.width = viewport.width;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    await page.render({ canvasContext: ctx, viewport }).promise;
  }, [zoom]);

  // --- EFFECT HOOKS ---
  useEffect(() => {
    const loadInitial = async () => {
        if (!pdfFile) return;
        const buffer = await pdfFile.arrayBuffer();
        setOriginalPdfBytes(buffer);
    }
    loadInitial();
  }, [pdfFile]);

  useEffect(() => {
    if(originalPdfBytes){
        applyAnnotationsAndRender();
    }
  }, [originalPdfBytes, annotations, applyAnnotationsAndRender]);

  useEffect(() => {
    if (pages.length > 0 && currentPage <= pages.length) {
      renderPage(pages[currentPage - 1]);
    }
  }, [pages, currentPage, renderPage]);

  // --- UI EVENT HANDLERS ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') setPdfFile(file);
  };

  const getCanvasRelativeCoords = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = overlayCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'none') return;
    setDrawing(true);
    setStartCoords(getCanvasRelativeCoords(e));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const overlay = overlayCanvasRef.current!;
    const ctx = overlay.getContext('2d')!;
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    const { x, y } = getCanvasRelativeCoords(e);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.strokeRect(startCoords.x, startCoords.y, x - startCoords.x, y - startCoords.y);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    setDrawing(false);
    const overlay = overlayCanvasRef.current!;
    const ctx = overlay.getContext('2d')!;
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    const endCoords = getCanvasRelativeCoords(e);
    const newAnnotation: Annotation = {
      id: Math.random().toString(), // Using random for simplicity
      type: activeTool as 'rectangle' | 'highlight',
      color: strokeColor,
      strokeWidth: strokeWidth,
      data: {
        x: startCoords.x,
        y: startCoords.y,
        width: endCoords.x - startCoords.x,
        height: endCoords.y - startCoords.y,
      }
    };
    setAnnotations(prev => ({
      ...prev,
      [currentPage - 1]: [...(prev[currentPage - 1] || []), newAnnotation]
    }));
  };

  const handleSave = async () => {
    const pdfBytes = await generatePdfBytes();
    if (!pdfBytes) return;
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `edited-${pdfFile?.name || 'document.pdf'}`;
    link.click();
  };

  if (!pdfFile) {
    return (
      <div className="file-drop-zone">
        <input type="file" onChange={handleFileChange} accept="application/pdf" />
        <p>Drag and drop a PDF file here, or click to select a file.</p>
      </div>
    );
  }

  return (
    <div className="pdf-editor-container">
      {isProcessing && <div className="loading-overlay">Processing...</div>}
      <div className="pdf-toolbar">
        <button onClick={handleSave}>Save & Download</button>
        <button onClick={() => setZoom(z => z * 1.2)}>Zoom In</button>
        <button onClick={() => setZoom(z => z / 1.2)}>Zoom Out</button>
        <button onClick={() => setActiveTool('rectangle')}>Rectangle</button>
        <button onClick={() => setActiveTool('highlight')}>Highlight</button>
        <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} />
        <input type="number" value={strokeWidth} onChange={(e) => setStrokeWidth(parseInt(e.target.value, 10))} />
      </div>
      <div className="pdf-editor-main">
        <div className="pdf-sidebar">
          {pages.map((page, index) => (
            <Thumbnail
              key={index}
              page={page}
              onPageSelect={() => setCurrentPage(index + 1)}
              isSelected={currentPage === index + 1}
            />
          ))}
        </div>
        <div className="pdf-viewer" ref={viewerRef}>
          <canvas ref={canvasRef} style={{ zIndex: 1, position: 'absolute' }} />
          <canvas
            ref={overlayCanvasRef}
            style={{ zIndex: 2, position: 'absolute', cursor: 'crosshair' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </div>
      </div>
      <style jsx>{`
        /* All necessary styles go here */
      `}</style>
    </div>
  );
};

export default PdfEditor;
