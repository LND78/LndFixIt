"use client";
import React, { useState, useRef } from 'react';

const ImageConverter = () => {
  const [format, setFormat] = useState('jpeg');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  const handleConvert = () => {
    setError(null);
    setResult(null);

    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
      setError('Please select an image file.');
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

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const mimeType = `image/${format}`;

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setResult(url);
          } else {
            setError('Failed to create blob from canvas.');
          }
        }, mimeType, 0.9);
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
      <h3 className="results-title" style={{ marginBottom: '20px' }}>Image Format Converter</h3>
      <div className="form-group">
        <label className="form-label">Upload Image</label>
        <div className="file-input-wrapper">
          <input type="file" id="convertImageInput" className="file-input" accept="image/*" ref={fileInputRef} />
          <label htmlFor="convertImageInput" className="file-input-label">Choose Image File</label>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="convertFormat" className="form-label">Convert to Format</label>
        <div className="select-wrapper">
          <select id="convertFormat" className="custom-select" value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </div>
      </div>
      <button className="generate-btn" onClick={handleConvert}>
        <span className="btn-icon">🔄</span>
        Convert Image
      </button>
      {error && <div className="error-message" style={{marginTop: '20px'}}><span>❌</span><span>{error}</span></div>}
      {result && (
        <div id="convertResult" style={{ marginTop: '20px' }}>
          <div className="results-section" style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '15px', padding: '25px', marginTop: '20px' }}>
            <h4 style={{ color: 'var(--text-light)', marginBottom: '15px' }}>Converted to {format.toUpperCase()}</h4>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result} style={{ maxWidth: '100%', borderRadius: '10px', marginBottom: '15px' }} alt="Converted image" />
            <button className="download-btn" onClick={() => downloadBlob(result, `lnd-converted-${Date.now()}.${format === 'jpeg' ? 'jpg' : format}`)}>
              ⬇️ Download {format.toUpperCase()} Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageConverter;
