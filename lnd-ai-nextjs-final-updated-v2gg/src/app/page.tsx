import Link from 'next/link';

export default function Home() {
  return (
    <div className="control-panel slide-up">
      <h2 className="results-title" style={{ marginBottom: '30px', textAlign: 'center' }}>◆ Welcome to LND Ai ◆</h2>
      <p className="subtitle" style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
        Your all-in-one suite of free AI-powered tools. Select a tool below to get started.
      </p>
      <div className="tools-grid">
        <Link href="/text-to-image" className="tool-card">
          <span className="tool-icon">🎨</span>
          <h3 className="tool-title">Text to Image</h3>
          <p className="tool-description">Bring your imagination to life with our powerful AI image generator.</p>
        </Link>
        <Link href="/text-to-speech" className="tool-card">
          <span className="tool-icon">🔊</span>
          <h3 className="tool-title">Text to Speech</h3>
          <p className="tool-description">Convert any text into natural-sounding speech with various voices.</p>
        </Link>
        <Link href="/image-analysis" className="tool-card">
          <span className="tool-icon">🖼️</span>
          <h3 className="tool-title">Image Analysis</h3>
          <p className="tool-description">Upload images for AI-powered analysis and detailed descriptions.</p>
        </Link>
        <Link href="/web-scraping" className="tool-card">
          <span className="tool-icon">🔍</span>
          <h3 className="tool-title">Web Scraping</h3>
          <p className="tool-description">Scrape and download high-quality images from the web for your projects.</p>
        </Link>
        <Link href="/more-tools" className="tool-card">
          <span className="tool-icon">🛠️</span>
          <h3 className="tool-title">More Tools</h3>
          <p className="tool-description">Explore a collection of 10+ utility tools for everyday tasks.</p>
        </Link>
      </div>
    </div>
  );
}
