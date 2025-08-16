// Handle image form submission
async function handleImageFormSubmit(event) {
    event.preventDefault();
    if (taskStates.image) return;

    const prompt = document.getElementById('prompt').value.trim();
    if (!prompt) {
        showError('Please enter a prompt to generate images.');
        return;
    }

    const imageCount = parseInt(document.getElementById('imageCount').value);
    const style = document.getElementById('style').value;
    const quality = document.getElementById('quality').value;
    const apiProvider = document.getElementById('apiProvider').value;

    await generateImages(prompt, imageCount, style, quality, apiProvider);
}

// Main image generation function
async function generateImages(prompt, count, style, quality, provider) {
    setGenerating('image', true);
    showLoading();

    try {
        const enhancedPrompt = enhancePrompt(prompt, style, quality);
        const promises = [];
        for (let i = 0; i < count; i++) {
            promises.push(generateSingleImage(enhancedPrompt, provider, i));
        }

        const results = await Promise.allSettled(promises);
        const images = results
            .filter(result => result.status === 'fulfilled' && result.value)
            .map(result => result.value);

        if (images.length === 0) {
            showError('Failed to generate any images. Please try again with a different prompt or provider.', true);
        } else {
            generatedImages = images;
            updateResults(images);
        }
    } catch (error) {
        console.error('Generation error:', error);
        showError('An unexpected error occurred. Please try again.', true);
    } finally {
        setGenerating('image', false);
    }
}

// Generate single image with different providers
async function generateSingleImage(prompt, provider, index) {
    const seed = hashCode(prompt + index + Date.now());
    try {
        switch (provider) {
            case 'stablehorde':
                return await generateWithStableHorde(prompt, seed);
            case 'lexica':
                return await generateWithLexica(prompt, seed);
            case 'pollinations':
            default:
                return await generateWithPollinations(prompt, seed);
        }
    } catch (error) {
        console.error(`Error with ${provider}:`, error);
        // Fallback to pollinations on failure
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}`;
        await validateImageUrl(fallbackUrl, 'pollinations-fallback');
        return { url: fallbackUrl, prompt: prompt, seed: seed, provider: 'pollinations' };
    }
}

// Pollinations API (Free, no API key required)
async function generateWithPollinations(prompt, seed) {
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=1024&height=1024&nologo=true`;
    await validateImageUrl(imageUrl, 'pollinations');
    return { url: imageUrl, prompt: prompt, seed: seed, provider: 'pollinations' };
}

// Stable Horde API
async function generateWithStableHorde(prompt, seed) {
    const API_KEY = '0000000000'; // Anonymous key
    const endpoint = 'https://stablehorde.net/api/v2/generate/async';

    const postResponse = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': API_KEY },
        body: JSON.stringify({ prompt: prompt, params: { seed: seed.toString() } })
    });

    if (!postResponse.ok) throw new Error('Failed to submit job to Stable Horde');
    const job = await postResponse.json();
    if (!job.id) throw new Error('Invalid response from Stable Horde');

    // Poll for result
    const checkEndpoint = `https://stablehorde.net/api/v2/generate/check/${job.id}`;
    for (let i = 0; i < 30; i++) { // Poll for 5 minutes max
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
        const checkResponse = await fetch(checkEndpoint);
        if (checkResponse.ok) {
            const status = await checkResponse.json();
            if (status.done) {
                const statusEndpoint = `https://stablehorde.net/api/v2/generate/status/${job.id}`;
                const statusResponse = await fetch(statusEndpoint);
                const finalStatus = await statusResponse.json();
                if (finalStatus.generations && finalStatus.generations.length > 0) {
                    const imageUrl = finalStatus.generations[0].img;
                    await validateImageUrl(imageUrl, 'stablehorde');
                    return { url: imageUrl, prompt: prompt, seed: seed, provider: 'stablehorde' };
                }
            }
        }
    }
    throw new Error('Stable Horde job timed out');
}

// Lexica API (Search, not generation)
async function generateWithLexica(prompt, seed) {
    const encodedPrompt = encodeURIComponent(prompt);
    const searchUrl = `https://lexica.art/api/v1/search?q=${encodedPrompt}`;

    const response = await fetch(searchUrl);
    if (!response.ok) throw new Error('Lexica API search failed');

    const data = await response.json();
    if (!data.images || data.images.length === 0) {
        throw new Error('No images found on Lexica for this prompt');
    }

    // Return a random image from the search results
    const randomImage = data.images[Math.floor(Math.random() * data.images.length)];
    const imageUrl = randomImage.src;

    await validateImageUrl(imageUrl, 'lexica');
    return { url: imageUrl, prompt: prompt, seed: seed, provider: 'lexica' };
}

// Validate image URL by attempting to load it
async function validateImageUrl(imageUrl, provider) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(imageUrl);
        img.onerror = () => reject(new Error(`Image failed to load from ${provider}`));
        img.src = imageUrl;
        setTimeout(() => reject(new Error(`Image load timeout from ${provider}`)), 15000);
    });
}

// Enhance prompt with style and quality modifiers
function enhancePrompt(prompt, style, quality) {
    let enhanced = prompt;

    // Add style modifiers
    if (style) {
        enhanced += `, ${style} style`;
    }

    // Add quality modifiers
    switch (quality) {
        case 'high':
            enhanced += ', high quality, detailed';
            break;
        case 'ultra':
            enhanced += ', ultra high definition, 8K, highly detailed';
            break;
        case 'masterpiece':
            enhanced += ', masterpiece, ultra high definition, 8K, highly detailed, professional photography';
            break;
    }

    return enhanced;
}

// Update results display for images
function updateResults(images) {
    const container = document.getElementById('resultsContainer');
    const countElement = document.getElementById('resultsCount');
    const shuffleCheckbox = document.getElementById('shuffleResults');

    countElement.textContent = `${images.length} Image${images.length !== 1 ? 's' : ''}`;

    if (shuffleCheckbox.checked) {
        // Fisher-Yates shuffle algorithm
        for (let i = images.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [images[i], images[j]] = [images[j], images[i]];
        }
    }

    if (images.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎨</div>
                <div class="empty-text">Ready to Create Magic</div>
                <div class="empty-subtext">Enter your prompt above and let LND AI bring your imagination to life</div>
            </div>
        `;
        return;
    }

    const imageGrid = document.createElement('div');
    imageGrid.className = 'image-grid';

    images.forEach((image, index) => {
        const imageCard = createImageCard(image, index);
        imageGrid.appendChild(imageCard);
    });

    container.innerHTML = '';
    container.appendChild(imageGrid);
}

// Create image card element
function createImageCard(image, index) {
    const card = document.createElement('div');
    card.className = 'image-card fade-in';
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
        <div class="image-container">
            <img
                src="${image.url}"
                alt="${image.prompt}"
                class="generated-image"
                loading="lazy"
                onerror="this.parentElement.parentElement.style.display='none'"
            />
            <div class="image-overlay">
                <button class="download-btn" onclick="downloadImage('${image.url}', 'lnd-ai-generated-${image.seed}')">
                    ⬇️ Download
                </button>
            </div>
        </div>
        <div class="image-info">
            <div class="image-source">LND AI • ${getProviderName(image.provider)}</div>
            <div class="image-prompt">${truncateText(image.prompt, 100)}</div>
            <button class="download-btn" onclick="downloadImage('${image.url}', 'lnd-ai-generated-${image.seed}')">
                ⬇️ Download HD
            </button>
        </div>
    `;

    return card;
}

// Download image function
async function downloadImage(url, filename) {
    try {
        // Fetch the image as a blob
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch image');

        const blob = await response.blob();

        // Create a temporary URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Create download link
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${filename}.jpg`;
        link.style.display = 'none';

        // Add to DOM, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the blob URL
        window.URL.revokeObjectURL(blobUrl);

    } catch (error) {
        console.error('Download failed:', error);
        try {
            // Fallback: try direct download
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}.jpg`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (fallbackError) {
            console.error('Fallback download failed:', fallbackError);
            // Last resort: open in new tab
            window.open(url, '_blank');
        }
    }
}

// Get provider display name
function getProviderName(provider) {
    const names = {
        'pollinations': 'Pollinations Engine',
        'deepai': 'DeepAI Engine',
        'huggingface': 'HuggingFace Engine',
        'modelslab': 'ModelsLab (Uncensored)',
        'replicate': 'Replicate Engine'
    };
    return names[provider] || 'LND AI Engine';
}
