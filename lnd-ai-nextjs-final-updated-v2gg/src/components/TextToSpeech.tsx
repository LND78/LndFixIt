"use client";
import React, { useState, useRef, useEffect } from 'react';

interface TTSSettings {
  text: string;
  voice: string;
  speed: number;
  language: string;
  provider: 'api' | 'browser';
}

interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
}

const TextToSpeech = () => {
  const [settings, setSettings] = useState<TTSSettings>({
    text: '',
    voice: 'female',
    speed: 1.0,
    language: 'en-US',
    provider: 'api'
  });
  
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isLoading: false
  });
  
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Available voices for different providers
  const apiVoices = [
    { value: 'female', label: 'ðŸ‘© Female Voice (English)' },
    { value: 'male', label: 'ðŸ‘¨ Male Voice (English)' }
  ];
  
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // Load browser voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      const loadVoices = () => {
        const voices = synthRef.current?.getVoices() || [];
        setBrowserVoices(voices);
      };
      
      loadVoices();
      synthRef.current?.addEventListener('voiceschanged', loadVoices);
      
      return () => {
        synthRef.current?.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setAudioState(prev => ({ ...prev, duration: audio.duration }));
    };

    const handleTimeUpdate = () => {
      setAudioState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleEnded = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    };

    const handlePlay = () => {
      setAudioState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audioUrl]);

  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const generateSpeechAPI = async () => {
    if (!settings.text.trim()) {
      setErrorMessage('Please enter some text to convert to speech.');
      return;
    }

    setAudioState(prev => ({ ...prev, isLoading: true }));
    clearMessages();

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: settings.text,
          voice: settings.voice,
          speed: settings.speed,
          language: settings.language,
          provider: 'api'
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.audioUrl) {
        setAudioUrl(data.audioUrl);
        setSuccessMessage('Speech generated successfully! You can now play or download it.');
      } else {
        throw new Error('No audio URL received from API');
      }
    } catch (error) {
      console.error('API TTS generation failed:', error);
      setErrorMessage(`Failed to generate speech: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setAudioState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const generateSpeechBrowser = () => {
    if (!settings.text.trim()) {
      setErrorMessage('Please enter some text to convert to speech.');
      return;
    }

    if (!synthRef.current) {
      setErrorMessage('Speech synthesis not supported in this browser.');
      return;
    }

    clearMessages();
    
    // Stop any current speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(settings.text);
    
    // Find the selected voice
    const selectedVoice = browserVoices.find(voice => voice.voiceURI === settings.voice);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = settings.speed;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => {
      setAudioState(prev => ({ ...prev, isPlaying: true }));
      setSuccessMessage('Speaking...');
    };
    
    utterance.onend = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false }));
      setSuccessMessage('Speech completed.');
    };
    
    utterance.onerror = (event) => {
      setErrorMessage(`Speech synthesis error: ${event.error}`);
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    };
    
    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const togglePlayPause = () => {
    if (settings.provider === 'browser') {
      if (audioState.isPlaying) {
        synthRef.current?.pause();
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      } else {
        synthRef.current?.resume();
        setAudioState(prev => ({ ...prev, isPlaying: true }));
      }
    } else {
      const audio = audioRef.current;
      if (audio) {
        if (audioState.isPlaying) {
          audio.pause();
        } else {
          audio.play().catch(error => {
            setErrorMessage(`Playback failed: ${error.message}`);
          });
        }
      }
    }
  };

  const stopSpeech = () => {
    if (settings.provider === 'browser') {
      synthRef.current?.cancel();
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    } else {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  };

  const downloadAudio = async () => {
    if (!audioUrl) {
      setErrorMessage('No audio available to download. Please generate speech first.');
      return;
    }

    try {
      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tts_audio_${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setSuccessMessage('Audio downloaded successfully!');
    } catch (error) {
      setErrorMessage(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleGenerate = () => {
    if (settings.provider === 'api') {
      generateSpeechAPI();
    } else {
      generateSpeechBrowser();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = (parseFloat(e.target.value) / 100) * audio.duration;
      audio.currentTime = newTime;
    }
  };

  return (
    <section className="control-panel slide-up">
      <h2 className="results-title" style={{ marginBottom: '30px' }}>
        ðŸ”Š Text to Speech Generator
      </h2>
      <p className="subtitle" style={{ textAlign: 'center', marginBottom: '40px' }}>
        Convert text to natural-sounding speech with multiple provider options and full audio controls.
      </p>

      <div className="tts-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Provider Selection */}
        <div className="control-group" style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
            ðŸŽ›ï¸ Provider:
          </label>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button
              className={`provider-btn ${settings.provider === 'api' ? 'active' : ''}`}
              onClick={() => setSettings(prev => ({ ...prev, provider: 'api' }))}
              style={{
                padding: '10px 20px',
                border: `2px solid ${settings.provider === 'api' ? 'var(--primary-purple)' : 'var(--glass-border)'}`,
                background: settings.provider === 'api' ? 'var(--primary-purple)' : 'var(--glass-bg)',
                color: 'var(--text-light)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ðŸŒ API Provider (High Quality)
            </button>
            <button
              className={`provider-btn ${settings.provider === 'browser' ? 'active' : ''}`}
              onClick={() => setSettings(prev => ({ ...prev, provider: 'browser' }))}
              style={{
                padding: '10px 20px',
                border: `2px solid ${settings.provider === 'browser' ? 'var(--primary-purple)' : 'var(--glass-border)'}`,
                background: settings.provider === 'browser' ? 'var(--primary-purple)' : 'var(--glass-bg)',
                color: 'var(--text-light)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ðŸ–¥ï¸ Browser TTS (Built-in)
            </button>
          </div>
        </div>

        {/* Text Input */}
        <div className="control-group" style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
            ðŸ“ Text to Convert:
          </label>
          <textarea
            value={settings.text}
            onChange={(e) => setSettings(prev => ({ ...prev, text: e.target.value }))}
            placeholder="Enter the text you want to convert to speech..."
            style={{
              width: '100%',
              height: '120px',
              padding: '15px',
              background: 'var(--glass-bg)',
              border: '2px solid var(--glass-border)',
              borderRadius: '12px',
              color: 'var(--text-light)',
              fontSize: '16px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            maxLength={5000}
          />
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '5px' }}>
            {settings.text.length}/5000 characters
          </div>
        </div>

        {/* Voice and Speed Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
          <div className="control-group">
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
              ðŸŽ­ Voice:
            </label>
            <select
              value={settings.voice}
              onChange={(e) => setSettings(prev => ({ ...prev, voice: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--glass-bg)',
                border: '2px solid var(--glass-border)',
                borderRadius: '8px',
                color: 'var(--text-light)',
                fontSize: '16px'
              }}
            >
              {settings.provider === 'api' ? (
                apiVoices.map(voice => (
                  <option key={voice.value} value={voice.value} style={{ background: '#1a1a1a' }}>
                    {voice.label}
                  </option>
                ))
              ) : (
                browserVoices.map(voice => (
                  <option key={voice.voiceURI} value={voice.voiceURI} style={{ background: '#1a1a1a' }}>
                    {voice.name} ({voice.lang})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="control-group">
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
              âš¡ Speed: {settings.speed}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.speed}
              onChange={(e) => setSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
              style={{
                width: '100%',
                height: '6px',
                background: 'var(--glass-border)',
                borderRadius: '3px',
                appearance: 'none',
                cursor: 'pointer'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginTop: '5px' }}>
              <span>0.5x</span>
              <span>1.0x</span>
              <span>2.0x</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button
            onClick={handleGenerate}
            disabled={audioState.isLoading || !settings.text.trim()}
            style={{
              padding: '15px 30px',
              background: audioState.isLoading || !settings.text.trim() 
                ? 'var(--text-muted)' 
                : 'linear-gradient(45deg, var(--primary-purple), var(--secondary-purple))',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              cursor: audioState.isLoading || !settings.text.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              minWidth: '200px'
            }}
          >
            {audioState.isLoading ? (
              <>â³ Generating...</>
            ) : (
              <>ðŸŽµ Generate Speech</>
            )}
          </button>
        </div>

        {/* Audio Controls */}
        {(audioUrl || (settings.provider === 'browser' && settings.text)) && (
          <div className="audio-controls" style={{
            background: 'var(--glass-bg)',
            border: '2px solid var(--glass-border)',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '25px'
          }}>
            <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>ðŸŽµ Audio Controls</h3>
            
            {/* Progress Bar (only for API provider) */}
            {settings.provider === 'api' && audioUrl && (
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioState.duration ? (audioState.currentTime / audioState.duration) * 100 : 0}
                  onChange={handleSeek}
                  style={{
                    width: '100%',
                    height: '8px',
                    background: 'var(--glass-border)',
                    borderRadius: '4px',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-muted)', marginTop: '5px' }}>
                  <span>{formatTime(audioState.currentTime)}</span>
                  <span>{formatTime(audioState.duration)}</span>
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <button
                onClick={togglePlayPause}
                style={{
                  padding: '12px 20px',
                  background: audioState.isPlaying 
                    ? 'linear-gradient(45deg, #ff6b6b, #ff8e8e)' 
                    : 'linear-gradient(45deg, var(--primary-purple), var(--secondary-purple))',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {audioState.isPlaying ? 'â¸ï¸ Pause' : 'â–¶ï¸ Play'}
              </button>

              <button
                onClick={stopSpeech}
                style={{
                  padding: '12px 20px',
                  background: 'linear-gradient(45deg, #6c757d, #868e96)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                â¹ï¸ Stop
              </button>

              {settings.provider === 'api' && audioUrl && (
                <button
                  onClick={downloadAudio}
                  style={{
                    padding: '12px 20px',
                    background: 'linear-gradient(45deg, #28a745, #34ce57)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ðŸ’¾ Download MP3
                </button>
              )}
            </div>
          </div>
        )}

        {/* Hidden Audio Element */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="metadata"
            style={{ display: 'none' }}
          />
        )}

        {/* Messages */}
        {errorMessage && (
          <div style={{
            background: 'rgba(220, 53, 69, 0.2)',
            border: '2px solid #dc3545',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
            color: '#dc3545',
            textAlign: 'center'
          }}>
            âŒ {errorMessage}
          </div>
        )}

        {successMessage && (
          <div style={{
            background: 'rgba(40, 167, 69, 0.2)',
            border: '2px solid #28a745',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
            color: '#28a745',
            textAlign: 'center'
          }}>
            âœ… {successMessage}
          </div>
        )}

        {/* Info Section */}
        <div style={{
          background: 'var(--glass-bg)',
          border: '2px solid var(--glass-border)',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '30px'
        }}>
          <h3 style={{ marginBottom: '15px' }}>â„¹ï¸ How to Use</h3>
          <ul style={{ lineHeight: '1.6', color: 'var(--text-muted)' }}>
            <li><strong>API Provider:</strong> High-quality speech generation using external APIs. Supports MP3 download.</li>
            <li><strong>Browser TTS:</strong> Uses your browser&apos;s built-in text-to-speech engine. Works offline.</li>
            <li><strong>Voice Selection:</strong> Choose from available voices based on your selected provider.</li>
            <li><strong>Speed Control:</strong> Adjust speech rate from 0.5x to 2x for optimal listening.</li>
            <li><strong>Audio Controls:</strong> Play, pause, stop, and download generated speech.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TextToSpeech;