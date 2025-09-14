"use client";
import React, { useState } from 'react';

const QrGenerator = () => {
  const [text, setText] = useState('');
  const [size, setSize] = useState(300);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    setError(null);
    setQrUrl(null);

    if (!text.trim()) {
      setError('Please enter text or URL to generate QR code.');
      return;
    }

    const encodedText = encodeURIComponent(text);
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}`;
    setQrUrl(url);
  };

  return (
    <div>
      <h3 className="results-title" style={{ marginBottom: '20px' }}>QR Code Generator</h3>
      <div className="form-group">
        <label htmlFor="qrText" className="form-label">Text or URL</label>
        <textarea id="qrText" className="prompt-input" placeholder="Enter text, URL, or any data to encode..." value={text} onChange={(e) => setText(e.target.value)}></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="qrSize" className="form-label">QR Code Size</label>
        <div className="select-wrapper">
          <select id="qrSize" className="custom-select" value={size} onChange={(e) => setSize(parseInt(e.target.value))}>
            <option value="200">200x200</option>
            <option value="300">300x300</option>
            <option value="400">400x400</option>
            <option value="500">500x500</option>
          </select>
        </div>
      </div>
      <button className="generate-btn" onClick={handleGenerate}>
        <span className="btn-icon">📱</span>
        Generate QR Code
      </button>
      {error && <div className="error-message" style={{marginTop: '20px'}}><span>❌</span><span>{error}</span></div>}
      {qrUrl && (
        <div id="qrResult" style={{ marginTop: '20px' }}>
          <div className="results-section" style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '15px', padding: '25px', marginTop: '20px' }}>
            <h4 style={{ color: 'var(--text-light)', marginBottom: '15px' }}>Generated QR Code</h4>
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} style={{ borderRadius: '10px', background: 'white', padding: '10px' }} alt="QR Code" />
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '15px', wordBreak: 'break-all' }}>{text}</p>
            <a href={`/api/download?url=${encodeURIComponent(qrUrl)}`} className="download-btn" style={{textDecoration: 'none'}}>
              ⬇️ Download QR Code
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrGenerator;
