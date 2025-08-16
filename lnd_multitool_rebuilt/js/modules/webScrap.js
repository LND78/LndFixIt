let currentScrapeTaskId = null;
let scrapePollingInterval = null;
let allScrapedImages = [];
const BACKEND_URL = 'https://lnd-duckduckgo-scraper.onrender.com/';

function setupWebScrapListeners() {
    document.getElementById('scrapeForm').addEventListener('submit', handleScrapeFormSubmit);
}

async function handleScrapeFormSubmit(event) {
    event.preventDefault();
    if (taskStates.scrap) return;

    const keyword = document.getElementById('scrapeKeyword').value.trim();
    if (!keyword) {
        showError('scrapResultsContainer', 'Please enter a keyword.');
        return;
    }
    const numImages = parseInt(document.getElementById('scrapeCount').value);
    await startImageScraping(keyword, numImages);
}

async function startImageScraping(keyword, numImages) {
    setGenerating('scrap', true);
    showLoading('scrapResultsContainer');

    try {
        const response = await fetch(`${BACKEND_URL}/api/scrape`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyword: keyword, num_images: numImages, safe_search_off: true })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);

        currentScrapeTaskId = data.task_id;
        scrapePollingInterval = setInterval(() => checkScrapeStatus(data.task_id), 3000);
    } catch (error) {
        showError('scrapResultsContainer', `Failed to start scraping: ${error.message}`);
        setGenerating('scrap', false);
    }
}

async function checkScrapeStatus(taskId) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/status/${taskId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (data.status === 'completed') {
            clearInterval(scrapePollingInterval);
            allScrapedImages = data.images || [];
            displayScrapedImages(data);
            setGenerating('scrap', false);
        } else if (data.status === 'error') {
            clearInterval(scrapePollingInterval);
            showError('scrapResultsContainer', data.message || 'Web scraping failed');
            setGenerating('scrap', false);
        }
    } catch (error) {
        clearInterval(scrapePollingInterval);
        showError('scrapResultsContainer', 'Failed to check scraping status.');
        setGenerating('scrap', false);
    }
}

function displayScrapedImages(data) {
    const container = document.getElementById('scrapResultsContainer');
    container.innerHTML = '';
    const imageGrid = document.createElement('div');
    imageGrid.className = 'image-grid';
    const images = data.images || [];

    if (images.length === 0) {
        showError('scrapResultsContainer', 'No images found.');
        return;
    }

    images.forEach((img, i) => {
        const imageCard = document.createElement('div');
        imageCard.className = 'image-card';
        imageCard.innerHTML = `
            <img src="${BACKEND_URL}/api/image/${currentScrapeTaskId}/${i}" alt="Scraped image ${i+1}" class="generated-image" loading="lazy"/>
            <div class="image-info">
                <a href="${BACKEND_URL}/api/download/${currentScrapeTaskId}" download class="download-btn">Download All as ZIP</a>
            </div>
        `;
        imageGrid.appendChild(imageCard);
    });
    container.appendChild(imageGrid);
}
