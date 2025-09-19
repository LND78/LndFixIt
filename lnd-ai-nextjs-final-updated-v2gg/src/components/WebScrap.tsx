"use client";
import React, { useState, useEffect } from 'react';

interface ScrapedImage {
  filename: string;
  // Add other properties if the API returns more data
}

const WebScrap = () => {
  const [keyword, setKeyword] = useState('');
  const [numImages, setNumImages] = useState(20);
  const [quality, setQuality] = useState('high');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapingStatus, setScrapingStatus] = useState('');
  const [scrapedImages, setScrapedImages] = useState<ScrapedImage[]>([]);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [completedTaskId, setCompletedTaskId] = useState<string | null>(null);

  const BACKEND_URL = 'https://lnd-duckduckgo-scraper.onrender.com/';

  const handleScrapeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsScraping(true);
    setScrapedImages([]);
    setCompletedTaskId(null);
    setScrapingStatus('Starting...');

    try {
      const response = await fetch(`${BACKEND_URL}/api/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword,
          num_images: numImages,
          quality,
          safe_search_off: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start scraping');
      }

      const data = await response.json();
      if (data.task_id) {
        setTaskId(data.task_id);
      } else {
        throw new Error(data.error || 'Failed to get task ID');
      }
    } catch (error) {
      console.error(error);
      setScrapingStatus('Error starting scrape.');
      setIsScraping(false);
    }
  };

  useEffect(() => {
    if (!taskId || !isScraping) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/status/${taskId}`);
        if (!response.ok) {
          throw new Error('Failed to get status');
        }
        const data = await response.json();
        setScrapingStatus(`Progress: ${data.progress}% • ${data.message}`);

        if (data.status === 'completed') {
          setCompletedTaskId(taskId);
          setScrapedImages(data.images || []);
          setIsScraping(false);
          setTaskId(null);
          clearInterval(interval);
        } else if (data.status === 'error') {
          throw new Error(data.message || 'Scraping failed');
        }
      } catch (error) {
        console.error(error);
        setScrapingStatus('Error checking status.');
        setIsScraping(false);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [taskId, isScraping]);

  const downloadSingleImage = async (imageIndex: number) => {
    if (!completedTaskId) return;
    try {
      const imageUrl = `${BACKEND_URL}/api/image/${completedTaskId}/${imageIndex}`;
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: HTTP ${response.status}`);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const filename = scrapedImages[imageIndex]?.filename || `web_image_${imageIndex + 1}.jpg`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Download error:', error);
      setScrapingStatus('Error downloading image.');
    }
  };


  return (
    <section id="webScrap" className="tool-section active">
      <div className="control-panel slide-up">
        <form id="scrapeForm" onSubmit={handleScrapeSubmit}>
          <div className="form-group">
            <label htmlFor="scrapeKeyword" className="form-label">🔍 Search Keyword</label>
            <input
              type="text"
              id="scrapeKeyword"
              className="prompt-input"
              placeholder="Enter keyword to search for images... e.g., 'nature', 'technology', 'cats'"
              required
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="controls-grid">
            <div className="form-group">
              <label htmlFor="scrapeCount" className="form-label">📊 Number of Images</label>
              <div className="select-wrapper">
                <select id="scrapeCount" className="custom-select" value={numImages} onChange={(e) => setNumImages(parseInt(e.target.value))}>
                  <option value="10">10 Images</option>
                  <option value="20">20 Images</option>
                  <option value="50">50 Images</option>
                  <option value="100">100 Images</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="scrapeQuality" className="form-label">⚡ Image Quality</label>
              <div className="select-wrapper">
                <select id="scrapeQuality" className="custom-select" value={quality} onChange={(e) => setQuality(e.target.value)}>
                  <option value="medium">Medium Quality</option>
                  <option value="high">High Quality</option>
                  <option value="original">Original Quality</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="generate-btn" id="scrapBtn" disabled={isScraping}>
            <span className="btn-icon" id="scrapIcon">🔍</span>
            <span id="scrapText">{isScraping ? 'Scraping...' : 'Start Web Scraping'}</span>
          </button>
        </form>
      </div>

      <div className="results-section slide-up">
        <div className="results-header">
          <h2 className="results-title">◆ Web-Scraped Images (Max 6 Displayed) ◆</h2>
          <div className="results-count" id="scrapResultsCount">{scrapedImages.length} Images</div>
          {scrapedImages.length > 0 && completedTaskId && (
            <a href={`${BACKEND_URL}/api/download/${completedTaskId}`} className="download-btn" style={{ textDecoration: 'none' }}>
              📦 Download All ZIP
            </a>
          )}
        </div>

        <div id="scrapResultsContainer">
          {isScraping ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">{scrapingStatus}</div>
            </div>
          ) : scrapedImages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-text">Ready for Web Scraping</div>
              <div className="empty-subtext">Enter a keyword above and let LND scrape high-quality images from the web</div>
            </div>
          ) : (
            <div className="image-grid">
              {scrapedImages.slice(0, 6).map((img, index) => (
                <div key={index} className="image-card">
                    <div className="image-container">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`${BACKEND_URL}/api/image/${completedTaskId}/${index}`} alt={`Web scraped image ${index + 1}`} className="generated-image" />
                        <div className="image-overlay">
                            <button className="download-btn" onClick={() => downloadSingleImage(index)}>
                                ⬇️ Download
                            </button>
                        </div>
                    </div>
                    <div className="image-info">
                        <div className="image-source">Source: Web Search</div>
                        <div className="image-prompt" style={{wordBreak: "break-all"}}>{img.filename || `web_image_${index + 1}.jpg`}</div>
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WebScrap;
