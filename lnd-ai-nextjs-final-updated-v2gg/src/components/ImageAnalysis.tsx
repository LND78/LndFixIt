"use client";
import React, { useState, useRef } from 'react';

const ImageAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Describe this image in detail');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [model, setModel] = useState('openai');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setAnalysis(''); // Clear previous analysis
    }
  };

  const handleImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setAnalysis(''); // Clear previous analysis
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = (reader.result as string);
        
        // Use Pollination AI Vision API via OpenAI compatible endpoint
        const response = await fetch('https://text.pollinations.ai/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: prompt },
                  {
                    type: 'image_url',
                    image_url: { url: base64Image }
                  }
                ]
              }
            ],
            max_tokens: 500
          })
        });

        if (!response.ok) {
          throw new Error('Failed to analyze image');
        }

        const data = await response.json();
        const analysisResult = data.choices?.[0]?.message?.content || 'No analysis available';
        setAnalysis(analysisResult);
      };
      
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setAnalysis('Error: Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImageUrl(null);
    setAnalysis('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section id="imageAnalysis" className="tool-section active">
      <div className="control-panel slide-up">
        <div className="form-group">
          <label className="form-label">🖼️ Image Analysis with AI Vision</label>
          <p className="subtitle" style={{ marginBottom: '25px', color: 'var(--text-muted)' }}>
            Upload an image and get detailed AI-powered analysis using Pollination AI
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="analysisPrompt" className="form-label">💭 Analysis Prompt</label>
          <div className="prompt-container">
            <textarea
              id="analysisPrompt"
              className="prompt-input"
              placeholder="What would you like to know about this image?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{ minHeight: '80px' }}
            />
          </div>
        </div>

        <div className="controls-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label htmlFor="visionModel" className="form-label">🤖 Vision Model</label>
            <div className="select-wrapper">
              <select 
                id="visionModel" 
                className="custom-select" 
                value={model} 
                onChange={(e) => setModel(e.target.value)}
              >
                <option value="openai">OpenAI Vision (Recommended)</option>
                <option value="openai-large">OpenAI Vision Large</option>
                <option value="claude-hybridspace">Claude Hybrid Space</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">📁 Upload Image</label>
          <div
            className="image-upload-area"
            onDrop={handleImageDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed var(--glass-border)',
              borderRadius: '15px',
              padding: '40px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              marginBottom: '20px'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />
            
            {imageUrl ? (
              <div style={{ position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Selected"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '10px',
                    objectFit: 'contain'
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(220, 38, 38, 0.8)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📷</div>
                <div style={{ color: 'var(--text-light)', marginBottom: '10px' }}>
                  Click to upload or drag & drop an image
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Supports JPG, PNG, GIF, WebP formats
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="generate-btn"
          onClick={analyzeImage}
          disabled={!selectedImage || isAnalyzing}
          style={{
            opacity: !selectedImage ? 0.5 : 1,
            cursor: !selectedImage ? 'not-allowed' : 'pointer'
          }}
        >
          <span className="btn-icon">🔍</span>
          {isAnalyzing ? 'Analyzing Image...' : 'Analyze Image'}
        </button>
      </div>

      <div className="results-section slide-up">
        <div className="results-header">
          <h2 className="results-title">◆ Analysis Result ◆</h2>
          <div className="results-count">{analysis ? '1 Result' : '0 Results'}</div>
        </div>

        <div id="analysisContainer">
          {isAnalyzing ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">Analyzing Image...</div>
              <div className="loading-subtext">AI is examining your image in detail</div>
            </div>
          ) : analysis ? (
            <div className="results-section" style={{ background: "rgba(0, 0, 0, 0.3)", borderRadius: "15px", padding: "25px", marginTop: "20px" }}>
              <div className="analysis-card">
                <div className="analysis-content">
                  <h4 style={{ color: "var(--text-light)", marginBottom: "15px" }}>AI Analysis</h4>
                  <div style={{ 
                    background: "rgba(139, 92, 246, 0.1)", 
                    border: "1px solid var(--glass-border)", 
                    borderRadius: "10px", 
                    padding: "20px", 
                    marginBottom: "15px",
                    color: "var(--text-light)",
                    lineHeight: "1.6",
                    fontSize: "1.1rem",
                    whiteSpace: "pre-wrap"
                  }}>
                    {analysis}
                  </div>
                  <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                    <button 
                      className="download-btn" 
                      onClick={() => navigator.clipboard.writeText(analysis)}
                    >
                      📋 Copy Analysis
                    </button>
                    <button 
                      className="download-btn" 
                      onClick={() => {
                        const element = document.createElement('a');
                        const file = new Blob([`Image Analysis:\n\nPrompt: ${prompt}\n\nAnalysis:\n${analysis}`], { type: 'text/plain' });
                        element.href = URL.createObjectURL(file);
                        element.download = `image-analysis-${Date.now()}.txt`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                    >
                      ⬇️ Download Analysis
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-text">Ready to Analyze Images</div>
              <div className="empty-subtext">Upload an image and get detailed AI-powered analysis</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ImageAnalysis;
