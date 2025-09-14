"use client";
import React, { useState, useRef, useEffect } from 'react';

type Tool = 'pen' | 'eraser' | 'rectangle' | 'circle';

const Whiteboard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const snapshotRef = useRef<ImageData | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [penColor, setPenColor] = useState('#FFFFFF');
  const [penWidth, setPenWidth] = useState(5);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set canvas size based on its container's size
      const container = canvas.parentElement;
      if(container) {
        canvas.width = container.offsetWidth;
        canvas.height = 500; // Fixed height
      }

      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.lineJoin = 'round';
        contextRef.current = context;
      }
    }
  }, []);

  useEffect(() => {
    if (contextRef.current) {
        contextRef.current.strokeStyle = penColor;
        contextRef.current.lineWidth = penWidth;
    }
  }, [penColor, penWidth]);

  const getCoords = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in event.nativeEvent) {
      return {
        x: event.nativeEvent.touches[0].clientX - rect.left,
        y: event.nativeEvent.touches[0].clientY - rect.top,
      };
    }
    return { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const context = contextRef.current;
    if (!context) return;

    const { x, y } = getCoords(e);
    setStartX(x);
    setStartY(y);
    setIsDrawing(true);

    if (tool === 'pen' || tool === 'eraser') {
      context.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
      context.beginPath();
      context.moveTo(x, y);
    } else {
      snapshotRef.current = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;
    const context = contextRef.current;
    const { x, y } = getCoords(e);

    if (snapshotRef.current) {
        context.putImageData(snapshotRef.current, 0, 0);
    }

    if (tool === 'pen' || tool === 'eraser') {
      context.lineTo(x, y);
      context.stroke();
    } else if (tool === 'rectangle') {
      context.strokeRect(startX, startY, x - startX, y - startY);
    } else if (tool === 'circle') {
      context.beginPath();
      const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
      context.arc(startX, startY, radius, 0, 2 * Math.PI);
      context.stroke();
    }
  };

  const finishDrawing = () => {
    setIsDrawing(false);
    snapshotRef.current = null;
    if (contextRef.current && (tool === 'pen' || tool === 'eraser')) {
        contextRef.current.closePath();
    }
  };

  const clearCanvas = () => {
    if(canvasRef.current && contextRef.current) {
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }

  return (
    <div>
      <h3 className="results-title" style={{ marginBottom: '20px' }}>Online Whiteboard</h3>
      <div className="controls-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))'}}>
        <div className="form-group">
          <label className="form-label">Tool</label>
          <div className="select-wrapper">
            <select className="custom-select" value={tool} onChange={(e) => setTool(e.target.value as Tool)}>
              <option value="pen">Pen</option>
              <option value="eraser">Eraser</option>
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Color</label>
          <input type="color" value={penColor} onChange={(e) => setPenColor(e.target.value)} style={{width: '100%', height: '50px'}} disabled={tool === 'eraser'}/>
        </div>
        <div className="form-group">
          <label className="form-label">Width: {penWidth}px</label>
          <input type="range" min="1" max="50" value={penWidth} className="range-slider" onChange={(e) => setPenWidth(parseInt(e.target.value))} />
        </div>
        <div className="form-group">
             <label className="form-label">Actions</label>
            <button className="generate-btn" onClick={clearCanvas} style={{fontSize: '1rem', padding: '15px'}}>Clear All</button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={finishDrawing}
        onTouchStart={startDrawing}
        onTouchEnd={finishDrawing}
        onTouchMove={draw}
        style={{ border: '2px solid var(--glass-border)', borderRadius: '15px', touchAction: 'none' }}
      />
    </div>
  );
};

export default Whiteboard;
