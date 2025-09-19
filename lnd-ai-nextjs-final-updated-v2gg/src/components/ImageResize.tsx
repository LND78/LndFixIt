"use client";
import React, { useState, useRef } from 'react';

const ImageResize = () => {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadBlob = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setWidth(img.width);
          setHeight(img.height);
          setAspectRatio(img.width / img.height);
        };
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (keepAspectRatio && aspectRatio) {
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (keepAspectRatio && aspectRatio) {
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const handleResize = () => {
    setError(null);
    setResult(null);

    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
      setError('Please select an image file.');
      return;
    }

    if (!width || !height || width <= 0 || height <= 0) {
      setError('Please enter valid width and height values.');
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setError('Could not get canvas context.');
          return;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setResult(url);
          } else {
            setError('Failed to create blob from canvas.');
          }
        }, 'image/jpeg', 0.9);
      };
      img.onerror = () => {
        setError('Failed to load image.');
      };
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.onerror = () => {
      setError('Failed to read file.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h3 className="results-title" style={{ marginBottom: '20px' }}>Image Resize Tool</h3>
      <div className="form-group">
        <label className="form-label">Upload Image</label>
        <div className="file-input-wrapper">
          <input type="file" id="resizeImageInput" className="file-input" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} />
          <label htmlFor="resizeImageInput" className="file-input-label">Choose Image File</label>
        </div>
      </div>
      <div className="controls-grid">
        <div className="form-group">
          <label htmlFor="resizeWidth" className="form-label">Width (px)</label>
          <input type="number" id="resizeWidth" className="prompt-input" style={{ minHeight: 'auto', padding: '15px' }} placeholder="800" min="1" value={width} onChange={(e) => handleWidthChange(parseInt(e.target.value))} />
        </div>
        <div className="form-group">
          <label htmlFor="resizeHeight" className="form-label">Height (px)</label>
          <input type="number" id="resizeHeight" className="prompt-input" style={{ minHeight: 'auto', padding: '15px' }} placeholder="600" min="1" value={height} onChange={(e) => handleHeightChange(parseInt(e.target.value))} />
        </div>
      </div>
       <div className="form-group">
            <label className="checkbox-label">
                <input type="checkbox" checked={keepAspectRatio} onChange={(e) => setKeepAspectRatio(e.target.checked)} />
                <span className="checkmark"></span>
                Keep Aspect Ratio
            </label>
        </div>
      <button className="generate-btn" onClick={handleResize}>
        <span className="btn-icon">📐</span>
        Resize Image
      </button>
      {error && <div className="error-message" style={{marginTop: '20px'}}><span>❌</span><span>{error}</span></div>}
      {result && (
        <div id="resizeResult" style={{ marginTop: '20px' }}>
          <div className="results-section" style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '15px', padding: '25px', marginTop: '20px' }}>
            <h4 style={{ color: 'var(--text-light)', marginBottom: '15px' }}>Resized Image ({width}x{height})</h4>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result} style={{ maxWidth: '100%', borderRadius: '10px', marginBottom: '15px' }} alt="Resized image" />
            <button className="download-btn" onClick={() => downloadBlob(result, `lnd-resized-${width}x${height}-${Date.now()}.jpg`)}>
              ⬇️ Download Resized Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageResize;
