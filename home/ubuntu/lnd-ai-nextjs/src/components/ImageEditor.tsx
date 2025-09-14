"use client";
import React, { useState, useRef, useEffect } from 'react';

const ImageEditor = () => {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [hue, setHue] = useState(0);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setOriginalImage(img);
        };
        if(event.target?.result) {
            img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (originalImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;

        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) hue-rotate(${hue}deg)`;
        ctx.drawImage(originalImage, 0, 0);
      }
    }
  }, [originalImage, brightness, contrast, saturate, hue]);

  const downloadImage = () => {
    if (canvasRef.current) {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = `lnd-edited-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
  };

  return (
    <div>
      <h3 className="results-title" style={{ marginBottom: '20px' }}>Advanced Image Editor</h3>
      <div className="form-group">
        <label className="form-label">Upload Image</label>
        <div className="file-input-wrapper">
          <input type="file" id="imageEditorInput" className="file-input" accept="image/*" onChange={handleImageUpload} />
          <label htmlFor="imageEditorInput" className="file-input-label">Choose Image File</label>
        </div>
      </div>

      {originalImage && (
        <div className="control-panel slide-up" style={{padding: '30px'}}>
            <div className="tools-grid" style={{gridTemplateColumns: '1fr 1fr'}}>
                <div className="form-group">
                    <label htmlFor="brightness" className="form-label">Brightness: {brightness}%</label>
                    <input type="range" id="brightness" min="0" max="200" value={brightness} className="range-slider" onChange={(e) => setBrightness(parseInt(e.target.value))} />
                </div>
                <div className="form-group">
                    <label htmlFor="contrast" className="form-label">Contrast: {contrast}%</label>
                    <input type="range" id="contrast" min="0" max="200" value={contrast} className="range-slider" onChange={(e) => setContrast(parseInt(e.target.value))} />
                </div>
                <div className="form-group">
                    <label htmlFor="saturate" className="form-label">Saturation: {saturate}%</label>
                    <input type="range" id="saturate" min="0" max="200" value={saturate} className="range-slider" onChange={(e) => setSaturate(parseInt(e.target.value))} />
                </div>
                <div className="form-group">
                    <label htmlFor="hue" className="form-label">Hue: {hue}°</label>
                    <input type="range" id="hue" min="0" max="360" value={hue} className="range-slider" onChange={(e) => setHue(parseInt(e.target.value))} />
                </div>
            </div>

            <canvas ref={canvasRef} style={{maxWidth: '100%', borderRadius: '15px', border: '2px solid var(--glass-border)'}}></canvas>

            <div style={{textAlign: 'center', marginTop: '30px'}}>
                <button className="generate-btn" onClick={downloadImage}>
                    <span className="btn-icon">⬇️</span>
                    Download Edited Image
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
