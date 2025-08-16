// --- WEB SCRAPER ---
let currentScrapeTaskId = null;
let scrapePollingInterval = null;
let allScrapedImages = [];
const BACKEND_URL = 'https://lnd-duckduckgo-scraper.onrender.com/';

// Setup web-scrap event listeners
function setupWebScrapListeners() {
    const scrapeForm = document.getElementById('scrapeForm');
    const downloadZipBtn = document.getElementById('downloadZipBtn');

    if (scrapeForm) {
        scrapeForm.addEventListener('submit', handleScrapeFormSubmit);
    }

    if (downloadZipBtn) {
        downloadZipBtn.addEventListener('click', downloadScrapedImages);
    }
}

// Handle scrape form submission
async function handleScrapeFormSubmit(event) {
    event.preventDefault();

    if (taskStates.scrap) {
        return;
    }

    const keyword = document.getElementById('scrapeKeyword').value.trim();
    if (!keyword) {
        showScrapError('Please enter a keyword to search for images.');
        return;
    }

    const numImages = parseInt(document.getElementById('scrapeCount').value);
    const quality = document.getElementById('scrapeQuality').value;

    await startImageScraping(keyword, numImages, quality);
}

// Start image scraping process
async function startImageScraping(keyword, numImages, quality) {
    setGenerating(true, 'scrap');
    showScrapLoading();

    try {
        const requestData = {
            keyword: keyword,
            num_images: numImages,
            quality: quality,
            safe_search_off: true
        };

        const response = await fetch(`${BACKEND_URL}/api/scrape`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        currentScrapeTaskId = data.task_id;

        // Start polling for status
        scrapePollingInterval = setInterval(checkScrapeStatus, 2000);

    } catch (error) {
        console.error('Scraping error:', error);
        showScrapError(`Failed to start web scraping: ${error.message}`);
        setGenerating(false, 'scrap');
    }
}

// Check scraping status
async function checkScrapeStatus() {
    if (!currentScrapeTaskId) {
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/status/${currentScrapeTaskId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        updateScrapeProgress(data);

        if (data.status === 'completed') {
            clearInterval(scrapePollingInterval);
            scrapePollingInterval = null;
            allScrapedImages = data.images || [];
            displayScrapedImages(data);
            setGenerating(false, 'scrap');
        } else if (data.status === 'error') {
            clearInterval(scrapePollingInterval);
            scrapePollingInterval = null;
            showScrapError(data.message || 'Web scraping failed');
            setGenerating(false, 'scrap');
        }

    } catch (error) {
        console.error('Status check error:', error);
        clearInterval(scrapePollingInterval);
        scrapePollingInterval = null;
        showScrapError('Failed to check scraping status');
        setGenerating(false, 'scrap');
    }
}

// Update scraping progress
function updateScrapeProgress(data) {
    const container = document.getElementById('scrapResultsContainer');
    const progress = data.progress || 0;
    const message = data.message || 'Processing...';

    container.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <div class="loading-text">${message}</div>
            <div class="loading-subtext">Progress: ${progress}% • Web Search in Progress</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
        </div>
    `;
}

// Display scraped images (MAX 6 for optimal viewing)
function displayScrapedImages(data) {
    const container = document.getElementById('scrapResultsContainer');
    const countElement = document.getElementById('scrapResultsCount');
    const downloadBtn = document.getElementById('downloadZipBtn');

    const images = data.images || [];
    const totalImages = data.total_images || images.length;

    countElement.textContent = `${totalImages} Images (Showing 6)`;

    if (images.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❌</div>
                <div class="empty-text">No Images Found</div>
                <div class="empty-subtext">Try a different keyword or check your connection</div>
            </div>
        `;
        return;
    }

    // Show download button
    downloadBtn.style.display = 'inline-block';

    // Display only first 6 images for optimal viewing
    const displayImages = images.slice(0, 6);

    container.innerHTML = `
        <div class="image-grid">
            ${displayImages.map((img, index) => `
                <div class="image-card" style="animation: fadeIn 0.5s ease ${index * 0.1}s both">
                    <div class="image-container">
                        <img src="${BACKEND_URL}/api/image/${currentScrapeTaskId}/${index}"
                             alt="Web scraped image ${index + 1}"
                             loading="lazy"
                             style="width: 100%; height: 300px; object-fit: cover;"
                             onerror="this.src=\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==\';"
                        />
                        <div class="image-overlay">
                            <button class="download-btn" onclick="downloadSingleImage(${index})">
                                ⬇️ Download
                            </button>
                        </div>
                    </div>
                    <div class="image-info">
                        <div class="image-source">Source: Web Search</div>
                        <div class="image-filename">${img.filename || `web_image_${index + 1}.jpg`}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        ${totalImages > 6 ? `
            <div style="text-align: center; margin-top: 20px; padding: 20px; background: rgba(139, 92, 246, 0.1); border-radius: 15px;">
                <p style="color: var(--text-accent); margin-bottom: 10px;">
                    Showing 6 of ${totalImages} images for optimal viewing. Download the ZIP file to get all images.
                </p>
                <div style="color: var(--accent-purple); font-weight: 700;">
                    🔍 WEB SCRAPING: ${totalImages} images scraped successfully!
                </div>
            </div>
        ` : ''}
    `;
}

// Download single scraped image
async function downloadSingleImage(imageIndex) {
    if (!currentScrapeTaskId) {
        return;
    }

    try {
        const imageUrl = `${BACKEND_URL}/api/image/${currentScrapeTaskId}/${imageIndex}`;

        const response = await fetch(imageUrl);

        if (!response.ok) {
            throw new Error(`Failed to download image: HTTP ${response.status}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const filename = allScrapedImages[imageIndex]?.filename || `web_image_${imageIndex + 1}.jpg`;

        downloadBlob(url, filename);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Download error:', error);
        showScrapError('Failed to download image');
    }
}

// Download all scraped images as ZIP
async function downloadScrapedImages() {
    if (!currentScrapeTaskId) {
        return;
    }

    // Show download message
    showDownloadMessage();

    try {
        const downloadUrl = `${BACKEND_URL}/api/download/${currentScrapeTaskId}`;

        const response = await fetch(downloadUrl);

        if (!response.ok) {
            throw new Error(`Failed to download ZIP file: HTTP ${response.status}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const keyword = document.getElementById('scrapeKeyword').value.trim();
        const filename = `web_scraped_${keyword}_images_${allScrapedImages.length}_files.zip`;

        downloadBlob(url, filename);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error('ZIP download error:', error);
        showScrapError(`Failed to download ZIP file: ${error.message}`);
    }
}

// Show download message
function showDownloadMessage() {
    const container = document.getElementById('scrapResultsContainer');
    const existingMessage = container.querySelector('.download-message');

    if (!existingMessage) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'download-message';
        messageDiv.innerHTML = `
            <div style="background: rgba(139, 92, 246, 0.1); border: 2px solid var(--accent-purple); border-radius: 15px; padding: 20px; margin-bottom: 20px; text-align: center;">
                <div style="color: var(--accent-purple); font-weight: 700; font-size: 1.1rem; margin-bottom: 5px;">📦 Your ZIP will be downloaded shortly!</div>
                <div style="color: var(--text-accent); font-size: 0.9rem;">Please wait patiently while we prepare your images...</div>
            </div>
        `;
        container.insertBefore(messageDiv, container.firstChild);

        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Show scraping loading state
function showScrapLoading() {
    const container = document.getElementById('scrapResultsContainer');
    container.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <div class="loading-text">Starting Web Scraping</div>
            <div class="loading-subtext">Searching for images across the web...</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
        </div>
    `;
}

// Show scraping error
function showScrapError(message) {
    const container = document.getElementById('scrapResultsContainer');
    container.innerHTML = `
        <div class="error-message">
            <span style="font-size: 1.5rem;">⚠️</span>
            <div>
                <div style="font-weight: 700; margin-bottom: 5px;">Web Scraping Error</div>
                <div>${message}</div>
            </div>
        </div>
    `;
}
