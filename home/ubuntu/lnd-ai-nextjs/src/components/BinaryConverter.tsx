"use client";
import React, { useState } from 'react';

const BinaryConverter = () => {
  const [input, setInput] = useState('');
  const [inputFormat, setInputFormat] = useState('decimal');
  const [outputFormat, setOutputFormat] = useState('binary');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    if (!input) {
      setError('Please enter a value to convert.');
      return;
    }
    setError('');
    setResult('');

    try {
      if (inputFormat === 'text') {
        let output = '';
        for (let i = 0; i < input.length; i++) {
          const charCode = input[i].charCodeAt(0);
          switch (outputFormat) {
            case 'binary':
              output += charCode.toString(2).padStart(8, '0') + ' ';
              break;
            case 'decimal':
              output += charCode.toString(10) + ' ';
              break;
            case 'octal':
              output += charCode.toString(8) + ' ';
              break;
            case 'hexadecimal':
              output += charCode.toString(16).toUpperCase() + ' ';
              break;
            case 'text':
              output = input;
              break;
          }
          if (outputFormat === 'text') break;
        }
        setResult(output.trim());
      } else {
        const radixMap: { [key: string]: number } = {
          decimal: 10,
          binary: 2,
          octal: 8,
          hexadecimal: 16,
        };
        const decimal = parseInt(input.replace(/\s/g, ''), radixMap[inputFormat]);

        if (isNaN(decimal)) {
          throw new Error('Invalid input for the selected format.');
        }

        let output = '';
        if (outputFormat === 'text') {
          output = String.fromCharCode(decimal);
        } else {
          output = decimal.toString(radixMap[outputFormat]).toUpperCase();
        }
        setResult(output);
      }
    } catch {
      setError('Conversion failed. Please check your input for the selected format.');
    }
  };

  return (
    <div>
      <h3 className="results-title" style={{ marginBottom: '20px' }}>Binary Converter</h3>
      <div className="form-group">
        <label htmlFor="binaryInput" className="form-label">Input Value</label>
        <textarea id="binaryInput" className="prompt-input" placeholder="Enter value to convert..." style={{ minHeight: '100px' }} value={input} onChange={(e) => setInput(e.target.value)}></textarea>
      </div>
      <div className="controls-grid">
        <div className="form-group">
          <label htmlFor="inputFormat" className="form-label">Input Format</label>
          <div className="select-wrapper">
            <select id="inputFormat" className="custom-select" value={inputFormat} onChange={(e) => setInputFormat(e.target.value)}>
              <option value="decimal">Decimal (Base 10)</option>
              <option value="binary">Binary (Base 2)</option>
              <option value="octal">Octal (Base 8)</option>
              <option value="hexadecimal">Hexadecimal (Base 16)</option>
              <option value="text">Text (ASCII)</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="outputFormat" className="form-label">Output Format</label>
          <div className="select-wrapper">
            <select id="outputFormat" className="custom-select" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)}>
              <option value="binary">Binary (Base 2)</option>
              <option value="decimal">Decimal (Base 10)</option>
              <option value="octal">Octal (Base 8)</option>
              <option value="hexadecimal">Hexadecimal (Base 16)</option>
              <option value="text">Text (ASCII)</option>
            </select>
          </div>
        </div>
      </div>
      <div className="controls-grid">
        <button className="generate-btn" onClick={convert}>
          <span className="btn-icon">💻</span>
          Convert
        </button>
        <button className="generate-btn" onClick={() => { setInput(''); setResult(''); setError(''); }} style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)' }}>
          <span className="btn-icon">🗑️</span>
          Clear
        </button>
      </div>
      {error && <div className="error-message" style={{marginTop: '20px'}}><span>❌</span><span>{error}</span></div>}
      {result && (
        <div id="binaryResult" style={{ marginTop: '20px' }}>
          <div className="results-section" style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '15px', padding: '25px', marginTop: '20px' }}>
            <h4 style={{ color: 'var(--text-light)', marginBottom: '15px' }}>💻 Conversion Result</h4>
            <div style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '15px', borderRadius: '8px', marginTop: '10px', wordBreak: 'break-all', fontFamily: "'Courier New', monospace", color: 'var(--text-light)' }}>
              {result}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BinaryConverter;
