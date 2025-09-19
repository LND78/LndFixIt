"use client";
// The text-to-image functionality is implemented on the client-side to replicate the behavior of the original index.html file,
// which uses a variety of public APIs with fallbacks. This approach was requested by the user to fix issues with a
// non-functional backend API endpoint. While not ideal for a production environment, it fulfills the user's immediate requirements.
import React, { useState, useEffect } from 'react';
import { fetchImageModels, PollinationModel } from '../utils/pollinationModels';

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
  const [seed, setSeed] = useState('');
  const [useConsistentImages, setUseConsistentImages] = useState(false);
  const [enhancePrompt, setEnhancePrompt] = useState(true);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [statusText, setStatusText] = useState('');
  const [imageModels, setImageModels] = useState<PollinationModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const models = await fetchImageModels();
        setImageModels(models);
      } catch (error) {
        console.error('Failed to load image models:', error);
      } finally {
        setIsLoadingModels(false);
      }
    };
    
    loadModels();
  }, []);

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

    // Use pollinations if consistent images is enabled or seed is provided
    const selectedProvider = (useConsistentImages || seed) ? 'pollinations' : 
        (apiProvider === 'random' ? providers[Math.floor(Math.random() * providers.length)] : apiProvider);

    const maxRetries = 4;
    let lastError = null;

    for (let retry = 0; retry < maxRetries; retry++) {
        try {
            let imageUrl;
            
            // Generate seed value
            const seedValue = seed ? parseInt(seed) || seed : (useConsistentImages ? 42 : Date.now() + index + retry);

            if (selectedProvider === 'pollinations' || retry === 0) {
                imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&seed=${seedValue}`;
            } else if (retry === 1) {
                imageUrl = `https://api.deepai.org/api/text2img?text=${encodeURIComponent(prompt)}&grid_size=1&width=512&height=512&seed=${seedValue}`;
            } else if (retry === 2) {
                imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seedValue}&width=1024&height=1024&nologo=true&model=turbo`;
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

  const enhancePromptWithAI = async (originalPrompt: string): Promise<string> => {
    try {
      const randomSuffix = Math.floor(Math.random() * 90) + 10; // 10-99
      const promptWithUnderscores = originalPrompt.replace(/ /g, '_');
      const urlPath = `enhance_this_prompt_${promptWithUnderscores}_,_you_only_have_to_give_paragraph_to_directly_feed_model_keep_in_mind_only_give_output_as_prompt_paragraph_without_any_other_text_${randomSuffix}`;
      const enhanceUrl = `https://text.pollinations.ai/${urlPath}`;

      const response = await fetch(enhanceUrl);
      
      if (response.ok) {
        const enhancedText = await response.text();
        return enhancedText.trim();
      } else {
        console.warn(`Prompt enhancement failed with status ${response.status}. Using original prompt.`);
        return originalPrompt;
      }
    } catch (error) {
      console.error('Failed to enhance prompt:', error);
      return originalPrompt;
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isGenerating || isEnhancing) return;

    let promptForGeneration = prompt;
    
    if (!originalPrompt) {
      setOriginalPrompt(prompt);
    }

    if (enhancePrompt && !useConsistentImages && seed.trim() === '') {
      setIsEnhancing(true);
      setStatusText('Enhancing your prompt with AI...');
      const promptToEnhance = originalPrompt || prompt;
      const enhancedVersion = await enhancePromptWithAI(promptToEnhance);
      
      setPrompt(enhancedVersion);
      promptForGeneration = enhancedVersion;
      setIsEnhancing(false);
    }

    setIsGenerating(true);
    setGeneratedImages([]);
    setOriginalPrompt('');

    let finalPrompt = promptForGeneration;
    if (style) finalPrompt += `, ${style} style`;
    if (quality) finalPrompt += `, ${quality} quality`;

    const newImages: GeneratedImage[] = [];

    for (let i = 0; i < imageCount; i++) {
      setStatusText(`Generating image ${i + 1} of ${imageCount}...`);
      try {
        const imageData = await generateSingleImage(finalPrompt, apiProvider, i);
        if (imageData) {
          newImages.push(imageData);
          setGeneratedImages(prevImages => [...prevImages, imageData]);
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label htmlFor="prompt" className="form-label">✨ Describe Your Vision</label>
              <label className="checkbox-label" style={{ fontSize: '0.9rem', margin: 0 }}>
                <input
                  type="checkbox"
                  checked={enhancePrompt}
                  onChange={(e) => setEnhancePrompt(e.target.checked)}
                  disabled={useConsistentImages || seed.trim() !== ''}
                />
                <span className="checkmark"></span>
                ✨ Enhance Prompt
              </label>
            </div>
            <div className="prompt-container">
              <textarea
                id="prompt"
                className="prompt-input"
                placeholder="Enter your imagination, and let LND Ai Bring it for you!"
                required
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setOriginalPrompt(e.target.value);
                }}
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
              <label htmlFor="seed" className="form-label">🎲 Seed (Optional)</label>
              <input
                type="text"
                id="seed"
                className="form-input"
                value={seed}
                onChange={(e) => {
                  setSeed(e.target.value);
                  if (e.target.value.trim() !== '') {
                    setEnhancePrompt(false);
                  }
                }}
                placeholder="Enter seed for reproducible results"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={useConsistentImages}
                  onChange={(e) => {
                    setUseConsistentImages(e.target.checked);
                    if (e.target.checked) {
                      setApiProvider('pollinations');
                      setEnhancePrompt(false);
                    }
                  }}
                />
                <span className="checkmark"></span>
                🔄 Make Consistent Images (Auto-selects Pollinations AI)
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="apiProvider" className="form-label">🔮 AI Engine</label>
              <div className="select-wrapper">
                <select 
                  id="apiProvider" 
                  className="custom-select" 
                  value={apiProvider} 
                  onChange={(e) => setApiProvider(e.target.value)}
                  disabled={useConsistentImages || !!seed || isLoadingModels}
                >
                  <option value="random">🎲 Shuffle Random (LND AI, Better than Nano Banana)</option>
                  <option value="pollinations">🌟 Pollinations AI (LND AI, Better than Nano Banana Pro)</option>
                  
                  {imageModels.map((model, index) => (
                    <option key={`pollination-${model.id}-${index}`} value={model.id}>
                      🤖 {model.name} (LND AI, Better than Google Nano Banana)
                    </option>
                  ))}
                  
                  <option value="deepai">🤖 DeepAI Engine (LND AI, Better than Gemini Image Generator)</option>
                  <option value="huggingface">🤗 Hugging Face Models (LND AI, Better than Nano Banana Fast)</option>
                  <option value="modelslab">🔬 ModelsLab API (LND AI, Better than Google Nano Banana)</option>
                  <option value="replicate">🔄 Replicate AI (LND AI, Better than Nano Banana Pro)</option>
                  <option value="perchance">🎯 Perchance Generator (LND AI, Better than Gemini Image Generator)</option>
                  <option value="raphaelai">🎭 Raphael AI (LND AI, Better than Nano Banana)</option>
                  <option value="venice">🏛️ Venice AI (LND AI, Better than Google Nano Banana Fast)</option>
                  <option value="nastia">💫 Nastia AI (LND AI, Better than Nano Banana Pro)</option>
                  <option value="vadoo">📹 Vadoo AI (LND AI, Better than Gemini Image Generator)</option>
                  <option value="aiscribble">✏️ AIScribble (LND AI, Better than Nano Banana)</option>
                  <option value="dynapictures">📸 DynaPictures (LND AI, Better than Google Nano Banana)</option>
                  <option value="gemini">💎 Gemini Vision (LND AI, Better than Nano Banana Fast)</option>
                  <option value="sexyai">🔥 SexyAI Generator (LND AI, Better than Nano Banana Pro)</option>
                  <option value="pornpen">🖊️ PornPen AI (LND AI, Better than Gemini Image Generator)</option>
                  <option value="soulgen">👤 SoulGen (LND AI, Better than Nano Banana)</option>
                  <option value="dreamgf">💕 DreamGF AI (LND AI, Better than Google Nano Banana)</option>
                  <option value="icegirls">❄️ IceGirls AI (LND AI, Better than Nano Banana Fast)</option>
                  <option value="nsfwai">🔞 NSFW AI Generator (LND AI, Better than Nano Banana Pro)</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="generate-btn" id="generateBtn" disabled={isGenerating || isEnhancing}>
            <span className="btn-icon">🚀</span>
            {isEnhancing ? 'Enhancing Prompt...' : isGenerating ? 'Generating...' : 'Generate Images using LND Ai'}
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
                <div key={index} className="image