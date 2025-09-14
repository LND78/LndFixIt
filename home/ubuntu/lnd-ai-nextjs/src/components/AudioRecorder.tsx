"use client";
import React, { useState, useRef } from 'react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    setError(null);
    setAudioUrl(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Media Devices API not supported by your browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        // Stop all tracks on the stream to turn off the mic indicator
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      setError('Microphone access was denied. Please allow microphone access in your browser settings.');
      console.error(err);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      <h3 className="results-title" style={{ marginBottom: '20px' }}>Audio Recorder</h3>
      <div className="form-group" style={{textAlign: 'center'}}>
        <p style={{marginBottom: '20px', color: 'var(--text-muted)'}}>
            {isRecording ? 'Recording in progress... Click Stop to finish.' : 'Click the button to start recording from your microphone.'}
        </p>
        {!isRecording ? (
            <button className="generate-btn" onClick={handleStartRecording}>
                <span className="btn-icon">🎤</span>
                Start Recording
            </button>
        ) : (
            <button className="generate-btn" onClick={handleStopRecording} style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)' }}>
                <span className="btn-icon">⏹️</span>
                Stop Recording
            </button>
        )}
      </div>
      {error && <div className="error-message" style={{marginTop: '20px'}}><span>❌</span><span>{error}</span></div>}
      {audioUrl && (
        <div id="audioResult" style={{ marginTop: '20px' }}>
          <div className="results-section" style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '15px', padding: '25px', marginTop: '20px' }}>
            <h4 style={{ color: 'var(--text-light)', marginBottom: '15px' }}>🎙️ Your Recording</h4>
            <audio controls src={audioUrl} style={{width: '100%', marginBottom: '20px'}}></audio>
            <a href={audioUrl} download={`lnd-recording-${Date.now()}.webm`} className="download-btn" style={{textDecoration: 'none', textAlign: 'center'}}>
              ⬇️ Download Recording (.webm)
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
