"use client";
// The text-to-image functionality is implemented on the client-side to replicate the behavior of the original index.html file,
// which uses a variety of public APIs with fallbacks. This approach was requested by the user to fix issues with a
// non-functional backend API endpoint. While not ideal for a production environment, it fulfills the user's immediate requirements.
import React, { useState } from 'react';

interface GeneratedImage {
  url: string;
  prompt: string;
  provider: string;
}

const TextToImage = () => {
  const [prompt, setPrompt] = useState('');
  const [imageCount, setImageCount] = useState(1);
  const [style, setStyle] = useState('');
  const [quality, setQuality] = useState('standard');
  const [apiProvider, setApiProvider] = useState('random');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [statusText, setStatusText] = useState('');

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(url, '_blank');
    }
  };

  const generateSingleImage = async (prompt: string, apiProvider: string, index: number): Promise<GeneratedImage | null> => {
    const providers = [
        'pollinations', 'deepai', 'huggingface', 'modelslab', 'replicate',
        'perchance', 'raphaelai', 'venice', 'nastia', 'vadoo', 'flux',
        'stablediffusion', 'aiscribble', 'nsfwai', 'dynapictures', 'gemini',
        'sexyai', 'pornpen', 'soulgen', 'dreamgf', 'icegirls'
    ];

    const selectedProvider = apiProvider === 'random'
        ? providers[Math.floor(Math.random() * providers.length)]
        : apiProvider;

    const maxRetries = 4;
    let lastError = null;

    for (let retry = 0; retry < maxRetries; retry++) {
        try {
            let imageUrl;

            if (selectedProvider === 'pollinations' || retry === 0) {
                imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&seed=${Date.now() + index + retry}`;
            } else if (retry === 1) {
                imageUrl = `https://api.deepai.org/api/text2img?text=${encodeURIComponent(prompt)}&grid_size=1&width=512&height=512&seed=${Date.now() + index + retry}`;
            } else if (retry === 2) {
                imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${Date.now() + index}&width=1024&height=1024&nologo=true&model=turbo`;
            } else {
                imageUrl = `https://source.unsplash.com/512x512/?${encodeURIComponent(prompt.split(' ').slice(0, 3).join(','))}&sig=${Date.now() + index + retry}`;
            }

            const testImage = new Image();
            await new Promise((resolve, reject) => {
                testImage.onload = resolve;
                testImage.onerror = reject;
                testImage.src = imageUrl;
            });

            return {
                url: imageUrl,
                prompt: prompt,
                provider: selectedProvider,
            };

        } catch (error) {
            lastError = error;
            console.warn(`Attempt ${retry + 1} failed for image ${index + 1}:`, error);

            if (retry < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (retry + 1)));
            }
        }
    }

    console.error(`Failed to generate image ${index + 1} after ${maxRetries} attempts:`, lastError);
    return null;
  }

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isGenerating) return;

    setIsGenerating(true);
    setGeneratedImages([]);

    let enhancedPrompt = prompt;
    if (style) enhancedPrompt += `, ${style} style`;
    if (quality) enhancedPrompt += `, ${quality} quality`;

    const newImages: GeneratedImage[] = [];

    for (let i = 0; i < imageCount; i++) {
      setStatusText(`Generating image ${i + 1} of ${imageCount}...`);
      try {
        const imageData = await generateSingleImage(enhancedPrompt, apiProvider, i);
        if (imageData) {
          newImages.push(imageData);
          setGeneratedImages([...newImages]);
        }
      } catch (error) {
        console.error(error);
      }
    }

    setIsGenerating(false);
    setStatusText('');
  };

  return (
    <section id="textToImage" className="tool-section active">
      <div className="control-panel slide-up">
        <form id="imageForm" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="prompt" className="form-label">✨ Describe Your Vision</label>
            <div className="prompt-container">
              <textarea
                id="prompt"
                className="prompt-input"
                placeholder="Enter your imagination, and let LND Ai Bring it for you!"
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="controls-grid">
            <div className="form-group">
              <label htmlFor="imageCount" className="form-label">🎯 Number of Images</label>
              <div className="select-wrapper">
                <select id="imageCount" className="custom-select" value={imageCount} onChange={(e) => setImageCount(parseInt(e.target.value))}>
                  <option value="1">1 Image</option>
                  <option value="2">2 Images</option>
                  <option value="3">3 Images</option>
                  <option value="4">4 Images</option>
                  <option value="5">5 Images</option>
                  <option value="6">6 Images</option>
                  <option value="10">10 Images</option>
                  <option value="15">15 Images</option>
                  <option value="20">20 Images</option>
                  <option value="25">25 Images</option>
                  <option value="30">30 Images</option>
                  <option value="35">35 Images</option>
                  <option value="40">40 Images</option>
                  <option value="45">45 Images</option>
                  <option value="50">50 Images</option>
                  <option value="100">100 Images</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="style" className="form-label">🎨 Art Style</label>
              <div className="select-wrapper">
                <select id="style" className="custom-select" value={style} onChange={(e) => setStyle(e.target.value)}>
                  <option value="">Default</option>
                  <option value="photorealistic">Photorealistic</option>
                  <option value="digital art">Digital Art</option>
                  <option value="oil painting">Oil Painting</option>
                  <option value="watercolor">Watercolor</option>
                  <option value="anime">Anime Style</option>
                  <option value="cyberpunk">Cyberpunk</option>
                  <option value="steampunk">Steampunk</option>
                  <option value="fantasy art">Fantasy Art</option>
                  <option value="abstract">Abstract</option>
                  <option value="ghibli">Ghibli</option>
                  <option value="vintage">Vintage</option>
                  <option value="noir">Film Noir</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="quality" className="form-label">⚡ Quality Level</label>
              <div className="select-wrapper">
                <select id="quality" className="custom-select" value={quality} onChange={(e) => setQuality(e.target.value)}>
                  <option value="standard">Standard</option>
                  <option value="high">High Quality</option>
                  <option value="ultra">Ultra HD</option>
                  <option value="masterpiece">Masterpiece</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="apiProvider" className="form-label">🔮 AI Engine</label>
              <div className="select-wrapper">
                <select id="apiProvider" className="custom-select" value={apiProvider} onChange={(e) => setApiProvider(e.target.value)}>
                  <option value="random">🎲 Shuffle Random (Recommended)</option>
                  <option value="pollinations">Pollinations AI ( By LND AI )</option>
                  <option value="deepai">DeepAI Engine ( By LND AI )</option>
                  <option value="huggingface">Google Nano Banana ( By LND AI )</option>
                  <option value="modelslab">Nano Banana Free ( By LND AI )</option>
                  <option value="replicate">Replicate AI ( By LND AI )</option>
                  <option value="perchance">Dalle ( By LND AI )</option>
                  <option value="raphaelai">Raphael AI  ( By LND AI )</option>
                  <option value="venice">Venice AI  ( By LND AI )</option>
                  <option value="nastia">Nano Banana preview ( By LND AI )</option>
                  <option value="vadoo">Vadoo AI  ( By LND AI )</option>
                  <option value="flux">FLUX.1  ( By LND AI )</option>
                  <option value="stablediffusion">Stable Diffusion  ( By LND AI )</option>
                  <option value="aiscribble">AIScribble  ( By LND AI )</option>
                  <option value="nsfwai">NSFW AI Generator  ( By LND AI )</option>
                  <option value="dynapictures">Nano Banana Pro ( By LND AI )</option>
                  <option value="gemini">Nano Banana ( By LND AI )</option>
                  <option value="sexyai">Gemni Image Flash  ( By LND AI )</option>
                  <option value="pornpen">Pornpen Ai  ( By LND AI )</option>
                  <option value="soulgen">SoulGen  ( By LND AI )</option>
                  <option value="dreamgf">DreamGF AI  ( By LND AI )</option>
                  <option value="icegirls">IceGirls AI  ( By LND AI )</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="generate-btn" id="generateBtn" disabled={isGenerating}>
            <span className="btn-icon">🚀</span>
            {isGenerating ? 'Generating...' : 'Generate Images using LND Ai'}
          </button>
        </form>
      </div>

      <div className="results-section slide-up">
        <div className="results-header">
          <h2 className="results-title">◆ Generated Images ◆</h2>
          <div className="results-count" id="resultsCount">{generatedImages.length} Images</div>
        </div>

        <div id="resultsContainer">
          {isGenerating && generatedImages.length === 0 && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">Creating Your Masterpiece...</div>
              <div className="loading-subtext">{statusText}</div>
            </div>
          )}

          {(generatedImages.length > 0) && (
            <div className="image-grid">
              {generatedImages.map((image, index) => (
                <div key={index} className="image-card">
                  <div className="image-container">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.url} alt={image.prompt} className="generated-image" loading="lazy" />
                    <div className="image-overlay">
                      <button onClick={() => downloadImage(image.url, `lnd-ai-generated-${index}.jpg`)} className="download-btn">
                        ⬇️ Download
                      </button>
                    </div>
                  </div>
                  <div className="image-info">
                    <div className="image-source">🎨 {image.provider}</div>
                    <div className="image-prompt" style={{wordBreak: "break-all"}}>{image.prompt}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isGenerating && generatedImages.length > 0 && (
             <div className="loading-container" style={{padding: '40px'}}>
                <div className="loading-spinner"></div>
                <div className="loading-text">{statusText}</div>
            </div>
          )}

          {!isGenerating && generatedImages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🎨</div>
              <div className="empty-text">Ready to Generate Free Images</div>
              <div className="empty-subtext">Enter your prompt above and let LND AI bring your imagination to life</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TextToImage;
