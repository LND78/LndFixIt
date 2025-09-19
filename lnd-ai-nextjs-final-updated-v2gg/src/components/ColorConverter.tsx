"use client";
import React, { useState, useMemo } from 'react';

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const hexToHsl = (hex: string) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  let { r, g, b } = rgb;
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

const ColorConverter = () => {
  const [hexColor, setHexColor] = useState('#8B5CF6');

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHexColor(e.target.value);
  };

  const rgbValue = useMemo(() => hexToRgb(hexColor), [hexColor]);
  const hslValue = useMemo(() => hexToHsl(hexColor), [hexColor]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(err => console.error('Failed to copy: ', err));
  };

  return (
    <div>
      <h3 className="results-title" style={{ marginBottom: '20px' }}>Color Picker & Converter</h3>
      <div className="control-panel" style={{padding: '30px', textAlign: 'center'}}>
        <div className="form-group">
          <label htmlFor="colorPicker" className="form-label">Select a Color</label>
          <input
            type="color"
            id="colorPicker"
            value={hexColor}
            onChange={handleColorChange}
            style={{width: '100px', height: '100px', border: 'none', padding: 0, background: 'none', cursor: 'pointer'}}
          />
        </div>
        <div style={{
            width: '100%',
            height: '100px',
            backgroundColor: hexColor,
            borderRadius: '15px',
            marginBottom: '30px',
            border: '2px solid var(--glass-border)'
        }}></div>

        <div className="tools-grid">
            <div className="tool-card" style={{cursor: 'pointer'}} onClick={() => copyToClipboard(hexColor)}>
                <h3 className="tool-title">HEX</h3>
                <p style={{fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-light)'}}>{hexColor}</p>
            </div>
            <div className="tool-card" style={{cursor: 'pointer'}} onClick={() => rgbValue && copyToClipboard(`rgb(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b})`)}>
                <h3 className="tool-title">RGB</h3>
                <p style={{fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-light)'}}>{rgbValue ? `rgb(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b})` : 'N/A'}</p>
            </div>
            <div className="tool-card" style={{cursor: 'pointer'}} onClick={() => hslValue && copyToClipboard(`hsl(${hslValue.h}, ${hslValue.s}%, ${hslValue.l}%)`)}>
                <h3 className="tool-title">HSL</h3>
                <p style={{fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-light)'}}>{hslValue ? `hsl(${hslValue.h}, ${hslValue.s}%, ${hslValue.l}%)` : 'N/A'}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ColorConverter;
