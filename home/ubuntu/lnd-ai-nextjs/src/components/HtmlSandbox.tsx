"use client";
import React, { useState, useEffect } from 'react';

const HtmlSandbox = () => {
  const [htmlCode, setHtmlCode] = useState('<h1>Hello, World!</h1>');
  const [cssCode, setCssCode] = useState('h1 { color: #8B5CF6; }');
  const [jsCode, setJsCode] = useState('// Your JavaScript here');
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <body>${htmlCode}</body>
          <style>${cssCode}</style>
          <script>${jsCode}</script>
        </html>
      `);
    }, 250);

    return () => clearTimeout(timeout);
  }, [htmlCode, cssCode, jsCode]);

  const downloadHtmlFile = () => {
    const blob = new Blob([srcDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'index.html';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h3 className="results-title" style={{ marginBottom: '20px' }}>HTML Viewer & Sandbox</h3>
      <div className="tools-grid" style={{gridTemplateColumns: '1fr 1fr'}}>
        <div>
            <div className="form-group">
                <label htmlFor="htmlInput" className="form-label">HTML</label>
                <textarea id="htmlInput" className="prompt-input" style={{ minHeight: '200px', fontFamily: "'Courier New', monospace" }} value={htmlCode} onChange={(e) => setHtmlCode(e.target.value)}></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="cssInput" className="form-label">CSS</label>
                <textarea id="cssInput" className="prompt-input" style={{ minHeight: '150px', fontFamily: "'Courier New', monospace" }} value={cssCode} onChange={(e) => setCssCode(e.target.value)}></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="jsInput" className="form-label">JavaScript</label>
                <textarea id="jsInput" className="prompt-input" style={{ minHeight: '150px', fontFamily: "'Courier New', monospace" }} value={jsCode} onChange={(e) => setJsCode(e.target.value)}></textarea>
            </div>
        </div>
        <div className="results-section" style={{minHeight: 'auto'}}>
            <h4 style={{ color: 'var(--text-light)', marginBottom: '15px' }}>Live Preview</h4>
            <iframe
                srcDoc={srcDoc}
                title="output"
                sandbox="allow-scripts"
                frameBorder="0"
                width="100%"
                height="500px"
                style={{backgroundColor: '#fff', borderRadius: '15px'}}
            />
        </div>
      </div>
       <div style={{textAlign: 'center', marginTop: '30px'}}>
            <button className="generate-btn" onClick={downloadHtmlFile}>
                <span className="btn-icon">⬇️</span>
                Download as HTML File
            </button>
        </div>
    </div>
  );
};

export default HtmlSandbox;
