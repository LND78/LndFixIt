"use client";
import React, { useState } from 'react';

const CoinToss = () => {
  const [result, setResult] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleCoinToss = () => {
    setIsFlipping(true);
    setResult(null);
    setTimeout(() => {
      const toss = Math.random() < 0.5 ? 'Heads' : 'Tails';
      setResult(toss);
      setIsFlipping(false);
    }, 1000); // Simulate a 1-second flip
  };

  return (
    <div>
      <h3 className="results-title" style={{ marginBottom: '20px' }}>Coin Toss</h3>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div
            style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: '0 auto 20px',
                color: '#4B5563',
                border: '4px solid #FCD34D',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transformStyle: 'preserve-3d',
                animation: isFlipping ? 'flip 1s ease-in-out' : 'none'
            }}
        >
            {isFlipping ? '?' : result ? result[0] : '🪙'}
        </div>
        {result && (
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-light)' }}>It&apos;s {result}!</p>
        )}
      </div>
      <button className="generate-btn" onClick={handleCoinToss} disabled={isFlipping}>
        <span className="btn-icon">🪙</span>
        {isFlipping ? 'Flipping...' : 'Toss Coin'}
      </button>
      <style jsx>{`
        @keyframes flip {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(1800deg); }
        }
      `}</style>
    </div>
  );
};

export default CoinToss;
