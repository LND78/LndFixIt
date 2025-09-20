"use client";
import React, { useState, useRef, useCallback, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import { v4 as uuidv4 } from 'uuid';

// Set worker source from a CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

// --- INTERFACES AND TYPES ---
interface Annotation {
  id: string;
  type: 'rectangle' | 'circle' | 'path' | 'image' | 'text' | 'highlight';
  color: string;
  strokeWidth: number;
  data: any;
}

// --- SIGNATURE MODAL COMPONENT ---
const SignatureModal = ({ onSave, onCancel }: { onSave: (dataUrl: string) => void, onCancel: () => void }) => {
    // ... (SignatureModal implementation as before)
    return <div>Signature Modal...</div>; // Placeholder for brevity
};

// --- THUMBNAIL COMPONENT ---
const Thumbnail = ({ page, onPageSelect, isSelected }: { page: pdfjsLib.PDFPageProxy, onPageSelect: () => void, isSelected: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        // ... (Thumbnail rendering logic as before)
    }, [page]);
    return <div onClick={onPageSelect} className={`thumbnail-item ${isSelected ? 'selected' : ''}`}><canvas ref={canvasRef}></canvas><p>Page {page.pageNumber}</p></div>;
};

// --- MAIN PDF EDITOR COMPONENT ---
const PdfEditor = () => {
  // --- STATE MANAGEMENT ---
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [originalPdfBytes, setOriginalPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pages, setPages] = useState<pdfjsLib.PDFPageProxy[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [annotations, setAnnotations] = useState<{ [pageIndex: number]: Annotation[] }>({});

  // Interaction State
  const [activeTool, setActiveTool] = useState('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [savedSignature, setSavedSignature] = useState<string|null>(null);

  // Drawing State
  const [drawing, setDrawing] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [pathData, setPathData] = useState<string[]>([]);
  const [strokeColor, setStrokeColor] = useState('#ff0000');
  const [strokeWidth, setStrokeWidth] = useState(2);

  // Selection & Moving State
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [interactionState, setInteractionState] = useState<'none' | 'moving'>('none');
  const [moveStart, setMoveStart] = useState({ x: 0, y: 0, annoStart: {x: 0, y: 0} });

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // --- PDF & ANNOTATION RENDERING ---

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

    const renderContext = { canvasContext: ctx, viewport: viewport };
    await page.render(renderContext).promise;
  }, [zoom]);

  const loadPdfForViewing = useCallback(async (pdfData: ArrayBuffer) => {
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    setPdfDoc(pdf);

    const allPages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        allPages.push(page);
    }
    setPages(allPages);
  }, []);

  const applyAnnotationsAndRender = useCallback(async () => {
    if (!originalPdfBytes) return;
    setIsProcessing(true);

    const newLibPdfDoc = await PDFDocument.load(originalPdfBytes);
    const helveticaFont = await newLibPdfDoc.embedFont(StandardFonts.Helvetica);

    for (const pageIndexStr in annotations) {
      const pageIndex = parseInt(pageIndexStr, 10);
      const pageAnnotations = annotations[pageIndex];
      const page = newLibPdfDoc.getPage(pageIndex);
      // ... (Loop through pageAnnotations and draw them using pdf-lib as implemented before)
    }

    const pdfBytes = await newLibPdfDoc.save();
    await loadPdfForViewing(pdfBytes);
    setIsProcessing(false);
  }, [annotations, originalPdfBytes, loadPdfForViewing]);

  // --- USE-EFFECT HOOKS ---

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
    if (pages.length > 0) {
      renderPage(pages[currentPage - 1]);
    }
  }, [pages, currentPage, renderPage]);

  // --- EVENT HANDLERS ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    }
  };

  const handleSave = async () => {
    // ... (Save logic as implemented before)
  };

  const getCanvasRelativeCoords = (event: React.MouseEvent | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = overlayCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // ... (Combined logic for selection and starting a drawing)
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // ... (Combined logic for moving and drawing)
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // ... (Combined logic for finalizing move or drawing)
  };


  // --- JSX ---
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
      {isSigning && <SignatureModal onSave={()=>{}} onCancel={() => setIsSigning(false)} />}

      <div className="pdf-toolbar">
        {/* All toolbar buttons go here: Save, Page Nav, Zoom, Tools etc. */}
        <button onClick={handleSave}>Save & Download</button>
        <button onClick={() => setActiveTool('select')}>Select</button>
        <button onClick={() => setActiveTool('rectangle')}>Rectangle</button>
        {/* ... other buttons */}
      </div>

      <div className="pdf-editor-main">
        <div className="pdf-sidebar">
          {pages.map((page, index) => (
            <Thumbnail
              key={`thumb-${index}`}
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
        .pdf-editor-container { font-family: sans-serif; }
        .pdf-toolbar { padding: 8px; background: #f0f0f0; border-bottom: 1px solid #ccc; display: flex; gap: 8px; }
        .pdf-editor-main { display: flex; height: 85vh; }
        .pdf-sidebar { width: 200px; border-right: 1px solid #ccc; overflow-y: auto; background: #f8f8f8; }
        .pdf-viewer { flex-grow: 1; position: relative; overflow: auto; background: #e9e9e9; display: flex; justify-content: center; align-items: center; }
        .thumbnail-item { padding: 5px; margin: 5px; border: 2px solid transparent; cursor: pointer; }
        .thumbnail-item.selected { border-color: #0070f3; }
        .loading-overlay { /* ... */ }
      `}</style>
    </div>
  );
};

export default PdfEditor;
