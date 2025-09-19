"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';

type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

const ToneGenerator = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(440); // A4 note
  const [volume, setVolume] = useState(0.5);
  const [waveType, setWaveType] = useState<OscillatorType>('sine');

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const stopSound = useCallback(() => {
    if (!oscillatorRef.current || !audioContextRef.current) return;

    oscillatorRef.current.stop();
    oscillatorRef.current.disconnect();
    gainRef.current?.disconnect();
    audioContextRef.current.close().then(() => {
        audioContextRef.current = null;
        oscillatorRef.current = null;
        gainRef.current = null;
    });

    setIsPlaying(false);
  }, []);

  const startSound = () => {
    if (isPlaying) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    gain.gain.setValueAtTime(volume, context.currentTime);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();

    audioContextRef.current = context;
    oscillatorRef.current = oscillator;
    gainRef.current = gain;

    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && oscillatorRef.current && gainRef.current && audioContextRef.current) {
      oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      gainRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
      oscillatorRef.current.type = waveType;
    }
  }, [frequency, volume, waveType, isPlaying]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (isPlaying) {
        stopSound();
      }
    };
  }, [isPlaying, stopSound]);

  return (
    <div>
      <h3 className="results-title" style={{ marginBottom: '20px' }}>Tone Generator</h3>

      <div className="form-group">
        <label htmlFor="frequency" className="form-label">Frequency: {frequency} Hz</label>
        <input type="range" id="frequency" min="20" max="20000" value={frequency} className="range-slider" onChange={(e) => setFrequency(parseInt(e.target.value))} />
      </div>

      <div className="form-group">
        <label htmlFor="volume" className="form-label">Volume: {Math.round(volume * 100)}%</label>
        <input type="range" id="volume" min="0" max="1" step="0.01" value={volume} className="range-slider" onChange={(e) => setVolume(parseFloat(e.target.value))} />
      </div>

      <div className="form-group">
        <label htmlFor="waveType" className="form-label">Wave Type</label>
        <div className="select-wrapper">
            <select id="waveType" className="custom-select" value={waveType} onChange={(e) => setWaveType(e.target.value as OscillatorType)}>
                <option value="sine">Sine</option>
                <option value="square">Square</option>
                <option value="sawtooth">Sawtooth</option>
                <option value="triangle">Triangle</option>
            </select>
        </div>
      </div>

      <div className="controls-grid">
        {!isPlaying ? (
            <button className="generate-btn" onClick={startSound}>
                <span className="btn-icon">▶️</span>
                Play Tone
            </button>
        ) : (
            <button className="generate-btn" onClick={stopSound} style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)' }}>
                <span className="btn-icon">⏹️</span>
                Stop Tone
            </button>
        )}
      </div>
    </div>
  );
};

export default ToneGenerator;
