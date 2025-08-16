async function handleImageFormSubmit(event) {
    event.preventDefault();
    if (taskStates.image) return;

    const prompt = document.getElementById('prompt').value.trim();
    if (!prompt) {
        showError('resultsContainer', 'Please enter a prompt to generate images.');
        return;
    }

    const imageCount = parseInt(document.getElementById('imageCount').value);
    const apiProvider = document.getElementById('apiProvider').value;

    await generateImages(prompt, imageCount, apiProvider);
}

async function generateImages(prompt, count, provider) {
    setGenerating('image', true);
    showLoading('resultsContainer');

    try {
        const promises = [];
        for (let i = 0; i < count; i++) {
            promises.push(generateSingleImage(prompt, provider, i));
        }

        const results = await Promise.allSettled(promises);
        const images = results
            .filter(result => result.status === 'fulfilled' && result.value)
            .map(result => result.value);

        if (images.length === 0) {
            showError('resultsContainer', 'Failed to generate any images. Please try again with a different prompt or provider.');
        } else {
            updateResults(images);
        }
    } catch (error) {
        console.error('Generation error:', error);
        showError('resultsContainer', 'An unexpected error occurred. Please try again.');
    } finally {
        setGenerating('image', false);
    }
}

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
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}`;
        return { url: fallbackUrl, prompt: prompt, seed: seed, provider: 'pollinations' };
    }
}

async function generateWithPollinations(prompt, seed) {
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=512&height=512&nologo=true`;
    return { url: imageUrl, prompt: prompt, seed: seed, provider: 'pollinations' };
}

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
    for (let i = 0; i < 30; i++) { // Poll for 5 minutes max
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
        const checkResponse = await fetch(`https://stablehorde.net/api/v2/generate/check/${job.id}`);
        if (checkResponse.ok) {
            const status = await checkResponse.json();
            if (status.done) {
                const statusResponse = await fetch(`https://stablehorde.net/api/v2/generate/status/${job.id}`);
                const finalStatus = await statusResponse.json();
                if (finalStatus.generations && finalStatus.generations.length > 0) {
                    const imageUrl = finalStatus.generations[0].img;
                    return { url: imageUrl, prompt: prompt, seed: seed, provider: 'stablehorde' };
                }
            }
        }
    }
    throw new Error('Stable Horde job timed out');
}

async function generateWithLexica(prompt, seed) {
    const encodedPrompt = encodeURIComponent(prompt);
    const searchUrl = `https://lexica.art/api/v1/search?q=${encodedPrompt}`;

    const response = await fetch(searchUrl);
    if (!response.ok) throw new Error('Lexica API search failed');

    const data = await response.json();
    if (!data.images || data.images.length === 0) {
        throw new Error('No images found on Lexica for this prompt');
    }

    const randomImage = data.images[Math.floor(Math.random() * data.images.length)];
    const imageUrl = randomImage.src;

    return { url: imageUrl, prompt: prompt, seed: seed, provider: 'lexica' };
}

function updateResults(images) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '';
    const imageGrid = document.createElement('div');
    imageGrid.className = 'image-grid';

    images.forEach((image, index) => {
        const imageCard = createImageCard(image, index);
        imageGrid.appendChild(imageCard);
    });
    container.appendChild(imageGrid);
}

function createImageCard(image, index) {
    const card = document.createElement('div');
    card.className = 'image-card';
    card.innerHTML = `
        <img src="${image.url}" alt="${image.prompt}" class="generated-image" loading="lazy"/>
        <div class="image-info">
            <p>${truncateText(image.prompt, 100)}</p>
            <button onclick="downloadImage('${image.url}', 'lnd-ai-generated-${image.seed}')">Download</button>
        </div>
    `;
    return card;
}

async function downloadImage(url, filename) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${filename}.jpg`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Download failed:', error);
        window.open(url, '_blank');
    }
}
