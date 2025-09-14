"use client";
import React, { useState } from 'react';

const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(1);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeExtendedSymbols, setIncludeExtendedSymbols] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [customChars, setCustomChars] = useState('');

  const [results, setResults] = useState<string[]>([]);
  const [resultType, setResultType] = useState<'password' | 'passphrase' | null>(null);
  const [strength, setStrength] = useState<{ level: string, color: string, entropy: number } | null>(null);
  const [error, setError] = useState('');

  const generateSecurePassword = (len: number, charset: string) => {
    let password = '';
    const array = new Uint8Array(len);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < len; i++) {
      password += charset[array[i] % charset.length];
    }
    return password;
  };

  const calculatePasswordStrength = (password: string, charsetSize: number) => {
    const entropy = Math.log2(Math.pow(charsetSize, password.length));
    let level, color;
    if (entropy < 30) { level = 'Very Weak'; color = '#DC2626'; }
    else if (entropy < 50) { level = 'Weak'; color = '#F59E0B'; }
    else if (entropy < 70) { level = 'Fair'; color = '#EAB308'; }
    else if (entropy < 90) { level = 'Good'; color = '#10B981'; }
    else { level = 'Very Strong'; color = '#059669'; }
    return { level, color, entropy: Math.round(entropy) };
  };

  const handleGeneratePasswords = () => {
    setError('');
    setResultType('password');

    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (includeExtendedSymbols) charset += '~`"\'\\/';
    if (customChars) charset += customChars;

    if (excludeSimilar) {
      charset = charset.replace(/[0Ool1I]/g, '');
    }

    if (charset.length === 0) {
      setError('Please select at least one character type.');
      setResults([]);
      setStrength(null);
      return;
    }

    const newPasswords = [];
    for (let i = 0; i < count; i++) {
      newPasswords.push(generateSecurePassword(length, charset));
    }
    setResults(newPasswords);
    setStrength(calculatePasswordStrength(newPasswords[0], charset.length));
  };

  const handleGeneratePassphrase = () => {
    setError('');
    setResultType('passphrase');
    setStrength(null);

    const words = [
      'apple', 'banana', 'cherry', 'dragon', 'elephant', 'forest', 'guitar', 'horizon',
      'island', 'jungle', 'kitchen', 'lemon', 'mountain', 'ocean', 'piano', 'quartz',
      'rainbow', 'sunset', 'thunder', 'umbrella', 'violet', 'whisper', 'xylophone', 'yellow',
      'zebra', 'adventure', 'butterfly', 'cascade', 'diamond', 'emerald', 'firefly', 'galaxy',
      'harmony', 'infinity', 'journey', 'kaleidoscope', 'lighthouse', 'melody', 'nebula', 'oasis'
    ];

    const wordCount = 4 + Math.floor(Math.random() * 3);
    const selectedWords = [];
    for (let i = 0; i < wordCount; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        selectedWords.push(words[randomIndex]);
    }

    const formats = [
        selectedWords.join('-'),
        selectedWords.join(' '),
        selectedWords.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''),
        selectedWords.join('') + Math.floor(Math.random() * 1000),
        selectedWords.join('.') + '!'
    ];
    setResults(formats);
  };

  return (
    <div>
      <h3 className="results-title" style={{ marginBottom: '20px' }}>Secure Password Generator</h3>

      <div className="controls-grid">
        <div className="form-group">
          <label htmlFor="passwordLength" className="form-label">Password Length</label>
          <input type="range" id="passwordLength" min="4" max="128" value={length} className="range-slider" onChange={(e) => setLength(parseInt(e.target.value))} />
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <span id="lengthDisplay" style={{ color: 'var(--accent-purple)', fontWeight: 600, fontSize: '1.2rem' }}>{length}</span> characters
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="passwordCount" className="form-label">Number of Passwords</label>
          <div className="select-wrapper">
            <select id="passwordCount" className="custom-select" value={count} onChange={(e) => setCount(parseInt(e.target.value))}>
              <option value="1">1 Password</option>
              <option value="5">5 Passwords</option>
              <option value="10">10 Passwords</option>
              <option value="20">20 Passwords</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Character Types</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
          <label className="checkbox-label"><input type="checkbox" checked={includeUppercase} onChange={() => setIncludeUppercase(!includeUppercase)} /><span className="checkmark"></span>Uppercase (A-Z)</label>
          <label className="checkbox-label"><input type="checkbox" checked={includeLowercase} onChange={() => setIncludeLowercase(!includeLowercase)} /><span className="checkmark"></span>Lowercase (a-z)</label>
          <label className="checkbox-label"><input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} /><span className="checkmark"></span>Numbers (0-9)</label>
          <label className="checkbox-label"><input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} /><span className="checkmark"></span>Symbols (!@#$)</label>
          <label className="checkbox-label"><input type="checkbox" checked={includeExtendedSymbols} onChange={() => setIncludeExtendedSymbols(!includeExtendedSymbols)} /><span className="checkmark"></span>Extended Symbols</label>
          <label className="checkbox-label"><input type="checkbox" checked={excludeSimilar} onChange={() => setExcludeSimilar(!excludeSimilar)} /><span className="checkmark"></span>Exclude Similar (0,O,l,1)</label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="customChars" className="form-label">Custom Characters (Optional)</label>
        <input type="text" id="customChars" className="prompt-input" style={{ minHeight: 'auto', padding: '15px' }} placeholder="Add custom characters..." value={customChars} onChange={(e) => setCustomChars(e.target.value)} />
      </div>

      <div className="controls-grid">
        <button className="generate-btn" onClick={handleGeneratePasswords}>
          <span className="btn-icon">🔑</span>
          Generate Passwords
        </button>
        <button className="generate-btn" onClick={handleGeneratePassphrase} style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
          <span className="btn-icon">📝</span>
          Generate Passphrase
        </button>
      </div>

      {error && <div className="error-message" style={{marginTop: '20px'}}><span>❌</span><span>{error}</span></div>}

      {results.length > 0 && (
        <div id="passwordResult" style={{ marginTop: '20px' }}>
          <div className="results-section" style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '15px', padding: '25px', marginTop: '20px' }}>
            <h4 style={{ color: 'var(--text-light)', marginBottom: '15px' }}>{resultType === 'password' ? '🔑 Generated Passwords' : '📝 Generated Passphrases'}</h4>
            {strength && (
              <div style={{marginBottom: '15px'}}>
                <strong style={{ color: 'var(--accent-purple)' }}>Strength:</strong>
                <span style={{ color: strength.color, fontWeight: 600 }}> {strength.level} </span>
                <span style={{ color: 'var(--text-muted)', marginLeft: '10px' }}>({strength.entropy} bits)</span>
              </div>
            )}
            {results.map((item, index) => (
              <div key={index} style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '15px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Courier New', monospace", color: 'var(--text-light)', wordBreak: 'break-all', flex: '1' }}>{item}</span>
                <button className="download-btn" onClick={() => navigator.clipboard.writeText(item)} style={{ marginLeft: '15px', padding: '8px 12px', fontSize: '0.8rem' }}>
                  📋 Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;
