// Utility functions to fetch available models from Pollination AI

export interface PollinationModel {
  id: string;
  name: string;
  type: 'text' | 'image' | 'audio' | 'search';
  capabilities?: string[];
  voices?: string[];
}

// Cache for models to avoid repeated API calls
let cachedTextModels: PollinationModel[] | null = null;
let cachedImageModels: PollinationModel[] | null = null;

export async function fetchTextModels(): Promise<PollinationModel[]> {
  if (cachedTextModels) {
    return cachedTextModels;
  }

  try {
    const response = await fetch('https://text.pollinations.ai/models');
    if (!response.ok) {
      throw new Error(`Failed to fetch text models: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Parse the response based on the actual structure
    let models: PollinationModel[] = [];
    
    if (Array.isArray(data)) {
      type TextModelFromApi = string | { id?: string; name?: string; capabilities?: string[]; voices?: string[] };
      models = data.map((model: TextModelFromApi) => {
        if (typeof model === 'string') {
          return { id: model, name: model, type: 'text' as const, capabilities: [], voices: [] };
        }
        return {
          id: model.id || model.name || 'unknown',
          name: model.name || model.id || 'unknown',
          type: 'text' as const,
          capabilities: model.capabilities || [],
          voices: model.voices || []
        };
      });
    } else if (typeof data === 'object') {
      models = Object.keys(data).map(key => ({
        id: key,
        name: data[key].name || key,
        type: 'text' as const,
        capabilities: data[key].capabilities || [],
        voices: data[key].voices || []
      }));
    }
    
    // Add known models if not present
    const knownModels = [
      { id: 'openai', name: 'OpenAI GPT', type: 'text' as const },
      { id: 'openai-fast', name: 'OpenAI GPT Fast', type: 'text' as const },
      { id: 'openai-reasoning', name: 'OpenAI Reasoning', type: 'text' as const },
      { id: 'claude-hybridspace', name: 'Claude Hybrid Space', type: 'text' as const },
      { id: 'gemini', name: 'Google Gemini', type: 'text' as const },
      { id: 'mistral', name: 'Mistral AI', type: 'text' as const },
      { id: 'deepseek-reasoning', name: 'DeepSeek Reasoning', type: 'text' as const },
      { id: 'qwen-coder', name: 'Qwen Coder', type: 'text' as const },
      { id: 'searchgpt', name: 'SearchGPT', type: 'search' as const },
      { id: 'elixposearch', name: 'Elixpo Search', type: 'search' as const },
      { id: 'openai-audio', name: 'OpenAI Audio (TTS/STT)', type: 'audio' as const, voices: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'] }
    ];
    
    // Merge with known models, avoiding duplicates
    const existingIds = new Set(models.map(m => m.id));
    knownModels.forEach(model => {
      if (!existingIds.has(model.id)) {
        models.push(model);
      }
    });
    
    cachedTextModels = models;
    return models;
  } catch (error) {
    console.error('Error fetching text models:', error);
    
    // Return fallback models
    return [
      { id: 'openai', name: 'OpenAI GPT', type: 'text' },
      { id: 'openai-fast', name: 'OpenAI GPT Fast', type: 'text' },
      { id: 'claude-hybridspace', name: 'Claude Hybrid Space', type: 'text' },
      { id: 'gemini', name: 'Google Gemini', type: 'text' },
      { id: 'mistral', name: 'Mistral AI', type: 'text' },
      { id: 'searchgpt', name: 'SearchGPT', type: 'search' },
      { id: 'elixposearch', name: 'Elixpo Search', type: 'search' },
      { id: 'openai-audio', name: 'OpenAI Audio (TTS/STT)', type: 'audio', voices: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'] }
    ];
  }
}

export async function fetchImageModels(): Promise<PollinationModel[]> {
  if (cachedImageModels) {
    return cachedImageModels;
  }

  try {
    const response = await fetch('https://image.pollinations.ai/models');
    if (!response.ok) {
      throw new Error(`Failed to fetch image models: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Parse the response based on the actual structure
    let models: PollinationModel[] = [];
    
    if (Array.isArray(data)) {
      type ImageModelFromApi = string | { id?: string; name?: string; capabilities?: string[] };
      models = data.map((model: ImageModelFromApi) => {
        if (typeof model === 'string') {
          return { id: model, name: model, type: 'image' as const, capabilities: [] };
        }
        return {
          id: model.id || model.name || 'unknown',
          name: model.name || model.id || 'unknown',
          type: 'image' as const,
          capabilities: model.capabilities || []
        };
      });
    } else if (typeof data === 'object') {
      models = Object.keys(data).map(key => ({
        id: key,
        name: data[key].name || key,
        type: 'image' as const,
        capabilities: data[key].capabilities || []
      }));
    }
    
    // Add known models if not present
    const knownModels = [
      { id: 'flux', name: 'FLUX.1 Schnell', type: 'image' as const },
      { id: 'turbo', name: 'Turbo', type: 'image' as const },
      { id: 'kontext', name: 'Kontext (Image-to-Image)', type: 'image' as const },
      { id: 'playground', name: 'Playground AI', type: 'image' as const },
      { id: 'stable-diffusion', name: 'Stable Diffusion', type: 'image' as const }
    ];
    
    // Merge with known models, avoiding duplicates
    const existingIds = new Set(models.map(m => m.id));
    knownModels.forEach(model => {
      if (!existingIds.has(model.id)) {
        models.push(model);
      }
    });
    
    cachedImageModels = models;
    return models;
  } catch (error) {
    console.error('Error fetching image models:', error);
    
    // Return fallback models
    return [
      { id: 'flux', name: 'FLUX.1 Schnell', type: 'image' },
      { id: 'turbo', name: 'Turbo', type: 'image' },
      { id: 'kontext', name: 'Kontext (Image-to-Image)', type: 'image' },
      { id: 'playground', name: 'Playground AI', type: 'image' },
      { id: 'stable-diffusion', name: 'Stable Diffusion', type: 'image' }
    ];
  }
}

export function getTextModels(): PollinationModel[] {
  return cachedTextModels || [];
}

export function getImageModels(): PollinationModel[] {
  return cachedImageModels || [];
}

export function getChatModels(): PollinationModel[] {
  return getTextModels().filter(model => model.type === 'text');
}

export function getSearchModels(): PollinationModel[] {
  return getTextModels().filter(model => model.type === 'search');
}

export function getAudioModels(): PollinationModel[] {
  return getTextModels().filter(model => model.type === 'audio');
}

export function getVoices(): string[] {
  const audioModels = getAudioModels();
  const openaiAudio = audioModels.find(model => model.id === 'openai-audio');
  return openaiAudio?.voices || ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
}
