"use client";
import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';

const CodeScanner = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startScan = async () => {
    setError(null);
    setScanResult(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS
        videoRef.current.play();
        setIsScanning(true);
        requestAnimationFrame(tick);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera access in your browser settings.');
      console.error(err);
    }
  };

  const stopScan = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0, img.width, img.height);
            const imageData = ctx?.getImageData(0, 0, img.width, img.height);
            if (imageData) {
              const code = jsQR(imageData.data, imageData.width, imageData.height);
              if (code) {
                setScanResult(code.data);
                setError(null);
              } else {
                setError('No QR code found in the image.');
              }
            }
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');

        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
            });

            if (code) {
                setScanResult(code.data);
                stopScan();
                return;
            }
        }
      }
    }
    if (isScanning && streamRef.current?.active) {
        requestAnimationFrame(tick);
    }
  };

  useEffect(() => {
    if (isScanning) {
        requestAnimationFrame(tick);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScanning]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <h3 className="results-title" style={{ marginBottom: '20px' }}>Code Scanner</h3>
      <div className="control-panel" style={{padding: '20px'}}>
        {!isScanning && !scanResult && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="generate-btn" onClick={startScan}>
                <span className="btn-icon">📷</span>
                Start Camera
            </button>
            <button className="generate-btn" onClick={() => fileInputRef.current?.click()}>
                <span className="btn-icon">📁</span>
                Upload QR Code
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
        )}
        {isScanning && (
            <button className="generate-btn" onClick={stopScan} style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)' }}>
                <span className="btn-icon">⏹️</span>
                Stop Camera
            </button>
        )}
        <div style={{position: 'relative', marginTop: '20px'}}>
            <video ref={videoRef} style={{ width: '100%', display: isScanning ? 'block' : 'none', borderRadius: '15px' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
        {error && <div className="error-message" style={{marginTop: '20px'}}><span>❌</span><span>{error}</span></div>}
        {scanResult && (
            <div className="results-section" style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '15px', padding: '25px', marginTop: '20px' }}>
                <h4 style={{ color: 'var(--text-light)', marginBottom: '15px' }}>✅ Scan Result</h4>
                <div style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '15px', borderRadius: '8px', marginTop: '10px', wordBreak: 'break-all', fontFamily: "'Courier New', monospace", color: 'var(--text-light)' }}>
                    <a href={scanResult} target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent-purple)'}}>{scanResult}</a>
                </div>
                <button className="generate-btn" onClick={startScan} style={{marginTop: '20px'}}>
                    <span className="btn-icon">📷</span>
                    Scan Again
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CodeScanner;
