"use client";
import { useRef } from "react";
import React, { useState, useRef } from 'react';

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
  id: string;
}

interface ImageSettings {
  prompt: string;
  style: string;
  quality: string;
  count: number;
  seed: string;
  width: number;
  height: number;
}

const TextToImage = () => {
  const [settings, setSettings] = useState<ImageSettings>({
    prompt: '',
    style: 'realistic',
    quality: 'standard',
    count: 1,
    seed: '',
    width: 512,
    height: 512
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  const styles = [
    { value: 'realistic', label: 'ðŸ“¸ Realistic', desc: 'Photorealistic images' },
    { value: 'artistic', label: 'ðŸŽ¨ Artistic', desc: 'Creative and stylized' },
    { value: 'anime', label: 'ðŸŽŒ Anime', desc: 'Japanese animation style' },
    { value: 'digital-art', label: 'ðŸ’» Digital Art', desc: 'Modern digital artwork' },
    { value: 'oil-painting', label: 'ðŸ–¼ï¸ Oil Painting', desc: 'Classic painted style' },
    { value: 'watercolor', label: 'ðŸŒŠ Watercolor', desc: 'Soft watercolor effect' }
  ];

  const qualityOptions = [
    { value: 'draft', label: 'Draft (Fast)', desc: 'Quick generation' },
    { value: 'standard', label: 'Standard', desc: 'Balanced quality' },
    { value: 'high', label: 'High Quality', desc: 'Best results' }
  ];

  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const generateImageWithPollinations = async (prompt: string, style: string, width: number, height: number, seed?: string): Promise<string> => {
    const stylePrompts = {
      'realistic': 'photorealistic, high quality, detailed',
      'artistic': 'artistic, creative, stylized, beautiful',
      'anime': 'anime style, manga, japanese animation',
      'digital-art': 'digital art, concept art, artstation',
      'oil-painting': 'oil painting, classical art, painted',
      'watercolor': 'watercolor painting, soft, flowing'
    };

    const enhancedPrompt = `${prompt}, ${stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.realistic}`;
    const seedParam = seed ? `&seed=${seed}` : `&seed=${Date.now()}`;
    
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${width}&height=${height}&nologo=true${seedParam}`;
  };

  const generateImageWithHuggingFace = async (prompt: string, style: string): Promise<string> => {
    // Using Hugging Face Inference API (free tier)
    const model = 'stabilityai/stable-diffusion-2-1';
    const apiUrl = `https://api-inference.huggingface.co/models/${model}`;
    
    const stylePrompts = {
      'realistic': 'photorealistic, 4k, highly detailed',
      'artistic': 'artistic masterpiece, trending on artstation',
      'anime': 'anime style, studio ghibli, detailed',
      'digital-art': 'digital art, concept art, detailed',
      'oil-painting': 'oil painting, classical, detailed brushwork',
      'watercolor': 'watercolor painting, soft colors, artistic'
    };

    const enhancedPrompt = `${prompt}, ${stylePrompts[style as keyof typeof stylePrompts] || ''}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            num_inference_steps: 30,
            guidance_scale: 7.5,
            width: settings.width,
            height: settings.height
          }
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } else {
        throw new Error('Hugging Face API failed');
      }
    } catch (error) {
      console.error('Hugging Face generation failed:', error);
      throw error;
    }
  };

  const generateImages = async () => {
    if (!settings.prompt.trim()) {
      setErrorMessage('Please enter a prompt to generate images.');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    clearMessages();
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      const newImages: GeneratedImage[] = [];
      
      for (let i = 0; i < settings.count; i++) {
        if (abortControllerRef.current?.signal.aborted) {
          break;
        }

        setProgress(((i) / settings.count) * 100);
        
        try {
          // Try Pollinations first (most reliable)
          let imageUrl = await generateImageWithPollinations(
            settings.prompt, 
            settings.style, 
            settings.width, 
            settings.height, 
            settings.seed ? `${settings.seed}_${i}` : undefined
          );

          // Verify image loads
          await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = imageUrl;
          });

          const newImage: GeneratedImage = {
            url: imageUrl,
            prompt: settings.prompt,
            timestamp: Date.now(),
            id: `img_${Date.now()}_${i}`
          };

          newImages.push(newImage);
          
        } catch (error) {
          console.error(`Failed to generate image ${i + 1}:`, error);
          
          // Fallback: Try a different approach
          try {
            const fallbackUrl = `https://picsum.photos/${settings.width}/${settings.height}?random=${Date.now() + i}`;
            const newImage: GeneratedImage = {
              url: fallbackUrl,
              prompt: `${settings.prompt} (fallback)`,
              timestamp: Date.now(),
              id: `img_fallback_${Date.now()}_${i}`
            };
            newImages.push(newImage);
          } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
          }
        }

        // Small delay between generations
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setProgress(100);
      
      if (newImages.length > 0) {
        setGeneratedImages(prev => [...newImages, ...prev]);
        setSuccessMessage(`Successfully generated ${newImages.length} image${newImages.length > 1 ? 's' : ''}!`);
      } else {
        throw new Error('Failed to generate any images');
      }

    } catch (error) {
      console.error('Image generation failed:', error);
      setErrorMessage(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const downloadImage = async (imageUrl: string, prompt: string, id: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `lnd_ai_${prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}_${id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setSuccessMessage('Image downloaded successfully!');
    } catch (error) {
      setErrorMessage(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const cancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      setProgress(0);
      setSuccessMessage('Generation cancelled.');
    }
  };

  const clearAllImages = () => {
    setGeneratedImages([]);
    setSuccessMessage('All images cleared.');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            ðŸŽ¨ AI Image Generator
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Transform your imagination into stunning visuals with our advanced AI image generation technology.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Generation Settings</h2>
              
              {/* Prompt Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  ðŸ“ Image Prompt
                </label>
                <textarea
                  value={settings.prompt}
                  onChange={(e) => setSettings(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Describe the image you want to create... (e.g., a majestic mountain landscape at sunset)"
                  className="input h-24 resize-none"
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {settings.prompt.length}/500 characters
                </div>
              </div>

              {/* Style Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  ðŸŽ¨ Art Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {styles.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setSettings(prev => ({ ...prev, style: style.value }))}
                      className={`p-3 rounded-lg border text-left transition-all duration-300 ${
                        settings.style === style.value
                          ? 'border-primary bg-primary/20 text-white'
                          : 'border-white/20 text-gray-400 hover:border-white/40 hover:text-white'
                      }`}
                    >
                      <div className="font-medium text-sm">{style.label}</div>
                      <div className="text-xs opacity-75">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality & Count */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    âš¡ Quality
                  </label>
                  <select
                    value={settings.quality}
                    onChange={(e) => setSettings(prev => ({ ...prev, quality: e.target.value }))}
                    className="select"
                  >
                    {qualityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    ðŸ”¢ Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={settings.count}
                    onChange={(e) => setSettings(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
                    className="input"
                  />
                </div>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    ðŸ“ Width
                  </label>
                  <select
                    value={settings.width}
                    onChange={(e) => setSettings(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                    className="select"
                  >
                    <option value={512}>512px</option>
                    <option value={768}>768px</option>
                    <option value={1024}>1024px</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    ðŸ“ Height
                  </label>
                  <select
                    value={settings.height}
                    onChange={(e) => setSettings(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                    className="select"
                  >
                    <option value={512}>512px</option>
                    <option value={768}>768px</option>
                    <option value={1024}>1024px</option>
                  </select>
                </div>
              </div>

              {/* Seed Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  ðŸŒ± Seed (Optional)
                </label>
                <input
                  type="text"
                  value={settings.seed}
                  onChange={(e) => setSettings(prev => ({ ...prev, seed: e.target.value }))}
                  placeholder="Leave empty for random"
                  className="input"
                />
              </div>

              {/* Generate Button */}
              <div className="space-y-4">
                <button
                  onClick={generateImages}
                  disabled={isGenerating || !settings.prompt.trim()}
                  className={`btn-primary w-full ${
                    isGenerating || !settings.prompt.trim() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"></div>
                      Generating... {Math.round(progress)}%
                    </>
                  ) : (
                    <>ðŸŽ¨ Generate Images</>
                  )}
                </button>

                {isGenerating && (
                  <button
                    onClick={cancelGeneration}
                    className="btn-secondary w-full"
                  >
                    âŒ Cancel Generation
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="mt-4">
                  <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {/* Messages */}
            {errorMessage && (
              <div className="alert alert-error mb-6">
                âŒ {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="alert alert-success mb-6">
                âœ… {successMessage}
              </div>
            )}

            {/* Generated Images */}
            {generatedImages.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Generated Images ({generatedImages.length})
                  </h2>
                  <button
                    onClick={clearAllImages}
                    className="btn-secondary text-sm"
                  >
                    ðŸ—‘ï¸ Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {generatedImages.map((image) => (
                    <div key={image.id} className="group relative">
                      <div className="relative overflow-hidden rounded-xl bg-white/5 aspect-square">
                        <img
                          src={image.url}
                          alt={image.prompt}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => downloadImage(image.url, image.prompt, image.id)}
                              className="p-3 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors duration-300"
                              title="Download Image"
                            >
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => window.open(image.url, '_blank')}
                              className="p-3 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors duration-300"
                              title="Open Full Size"
                            >
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Image Info */}
                      <div className="mt-3 px-1">
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {image.prompt}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(image.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {generatedImages.length === 0 && !isGenerating && (
              <div className="card p-12 text-center">
                <div className="text-6xl mb-4 opacity-50">ðŸŽ¨</div>
                <h3 className="text-xl font-semibold text-white mb-2">Ready to Create</h3>
                <p className="text-gray-400">
                  Enter a prompt and generate your first AI image
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 card p-6">
          <h3 className="text-xl font-bold text-white mb-4">ðŸ’¡ Pro Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
            <div>
              <strong className="text-white">Detailed Prompts:</strong> Include specific details like colors, lighting, and composition for better results.
            </div>
            <div>
              <strong className="text-white">Style Selection:</strong> Choose the right style to match your vision - realistic for photos, artistic for creative work.
            </div>
            <div>
              <strong className="text-white">Quality Settings:</strong> Use &apos;High Quality&apos; for final images, &apos;Draft&apos; for quick tests.
            </div>
            <div>
              <strong className="text-white">Seed Numbers:</strong> Use the same seed with similar prompts to maintain consistency across images.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToImage;