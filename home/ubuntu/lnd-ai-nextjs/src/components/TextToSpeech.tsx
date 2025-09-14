"use client";
import React, { useState, useEffect } from 'react';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('male');
  const [speed, setSpeed] = useState(1);
  const [language, setLanguage] = useState('en-US');
  const [provider, setProvider] = useState('browser');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const getVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      // Voices may load asynchronously
      getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = getVoices;
      }
    }
  }, []);

  const handleTtsSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAudioUrl(null);

    if (provider === 'browser') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

      if (typeof window !== 'undefined' && window.speechSynthesis && AudioContext) {
        setIsGenerating(true);
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          // Use the 'voices' state variable which is populated by useEffect
          const selectedVoice = voices.find(v => v.lang === language && v.name.toLowerCase().includes(voice)) || voices.find(v => v.lang.startsWith(language.split('-')[0]) && v.name.toLowerCase().includes(voice)) || voices.find(v => v.lang.startsWith(language.split('-')[0]));

          utterance.voice = selectedVoice || voices[0];
          utterance.rate = speed;
          utterance.pitch = 1;
          utterance.lang = language;

          // --- MediaRecorder Logic ---
          const audioContext = new AudioContext();
          const destination = audioContext.createMediaStreamDestination();
          const mediaRecorder = new MediaRecorder(destination.stream);
          const chunks: Blob[] = [];

          mediaRecorder.ondataavailable = (event) => {
            chunks.push(event.data);
          };

          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
            setIsGenerating(false);
          };

          const source = audioContext.createMediaStreamSource(destination.stream);
          source.connect(audioContext.destination);

          utterance.onstart = () => {
            setIsPlaying(true);
            mediaRecorder.start();
          };

          utterance.onend = () => {
            setIsPlaying(false);
            setTimeout(() => {
                mediaRecorder.stop();
                audioContext.close();
            }, 500);
          };

          utterance.onerror = (e) => {
            console.error('Speech synthesis error', e);
            setIsPlaying(false);
            setIsGenerating(false);
            audioContext.close();
          };

          window.speechSynthesis.speak(utterance);

        } catch (error) {
          console.error("Error with browser TTS recording:", error);
          setIsGenerating(false);
        }
      } else {
        alert('Browser TTS is not supported.');
      }
    } else {
      setIsGenerating(true);
      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voice, speed, language, provider }),
        });
        if (!response.ok) throw new Error('Failed to generate speech');
        const data = await response.json();
        setAudioUrl(data.audioUrl);
      } catch (error) {
        console.error(error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  return (
    <section id="textToSpeech" className="tool-section active">
      <div className="control-panel slide-up">
        <form id="ttsForm" onSubmit={handleTtsSubmit}>
          <div className="form-group">
            <label htmlFor="ttsText" className="form-label">📝 Enter Text to Convert</label>
            <div className="prompt-container">
              <textarea id="ttsText" className="prompt-input" placeholder="Enter text to convert..." required value={text} onChange={(e) => setText(e.target.value)}></textarea>
            </div>
          </div>

          <div className="controls-grid">
            <div className="form-group">
              <label htmlFor="ttsVoice" className="form-label">🎤 Voice Type</label>
              <div className="select-wrapper">
                <select id="ttsVoice" className="custom-select" value={voice} onChange={(e) => setVoice(e.target.value)}>
                  <option value="male">Male Voice</option>
                  <option value="female">Female Voice</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="ttsSpeed" className="form-label">⚡ Speech Speed</label>
              <div className="select-wrapper">
                <select id="ttsSpeed" className="custom-select" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))}>
                  <option value="0.8">Slow</option>
                  <option value="1">Normal</option>
                  <option value="1.2">Fast</option>
                  <option value="1.5">Very Fast</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="ttsLanguage" className="form-label">🌍 Language</label>
              <div className="select-wrapper">
                <select id="ttsLanguage" className="custom-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                  <option value="de-DE">German</option>
                  <option value="it-IT">Italian</option>
                  <option value="pt-BR">Portuguese</option>
                  <option value="ja-JP">Japanese</option>
                  <option value="ko-KR">Korean</option>
                  <option value="zh-CN">Chinese</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="ttsProvider" className="form-label">🔊 TTS Engine</label>
              <div className="select-wrapper">
                <select id="ttsProvider" className="custom-select" value={provider} onChange={(e) => setProvider(e.target.value)}>
                  <option value="browser">Browser TTS</option>
                  <option value="elevenlabs">ElevenLabs</option>
                  <option value="openai">OpenAI TTS</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="generate-btn" id="ttsGenerateBtn" disabled={isGenerating || isPlaying}>
            <span className="btn-icon">🎵</span>
            {isGenerating ? 'Generating...' : isPlaying ? 'Playing...' : 'Generate Speech'}
          </button>
        </form>
      </div>

      <div className="results-section slide-up">
        <div className="results-header">
          <h2 className="results-title">◆ Generated Audio ◆</h2>
          <div className="results-count" id="ttsResultsCount">{audioUrl ? '1 Audio' : '0 Audio'}</div>
        </div>

        <div id="ttsResultsContainer">
          {isGenerating && !audioUrl ? (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <div className="loading-text">Generating Speech...</div>
                <div className="loading-subtext">Converting your text to natural speech</div>
            </div>
          ) : audioUrl ? (
            <div className="results-section" style={{ background: "rgba(0, 0, 0, 0.3)", borderRadius: "15px", padding: "25px", marginTop: "20px" }}>
                <div className="audio-card">
                    <div className="audio-info">
                        <h4 style={{ color: "var(--text-light)", marginBottom: "10px" }}>Generated Speech</h4>
                        <p style={{ color: "var(--text-muted)", marginBottom: "15px", wordBreak: "break-word" }}>{text.substring(0, 100)}{text.length > 100 && '...'}</p>
                        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                            <button className="download-btn" onClick={() => { const audio = new Audio(audioUrl); audio.play(); }}>
                                ▶️ Play Audio
                            </button>
                            <a href={provider !== 'browser' ? `/api/download?url=${encodeURIComponent(audioUrl)}` : audioUrl} download={`lnd-tts-${Date.now()}.mp3`} className="download-btn" style={{textDecoration: 'none'}}>
                                ⬇️ Download MP3
                            </a>
                        </div>
                    </div>
                </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🎵</div>
              <div className="empty-text">Ready to Generate Speech</div>
              <div className="empty-subtext">Enter your text above and convert it to natural-sounding speech</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TextToSpeech;
