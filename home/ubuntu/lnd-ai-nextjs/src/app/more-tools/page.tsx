import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '10+ Free Utility Tools | LND AI',
  description: 'Explore a collection of 10+ free utility tools, including a calculator, QR code generator, password generator, converters, and more. All part of the LND AI suite by Naman Soni.',
  keywords: ['Free Tools', 'Utility Tools', 'Calculator', 'Converter', 'QR Generator', 'LND AI', 'Naman Ai'],
};

export default function MoreToolsPage() {
    return (
        <div className="control-panel slide-up">
            <h2 className="results-title" style={{ marginBottom: '30px', textAlign: 'center' }}>◆ More Tools ◆</h2>
            <div className="tools-grid">
                <Link href="/image-resize" className="tool-card">
                    <span className="tool-icon">📐</span>
                    <h3 className="tool-title">Image Resize</h3>
                    <p className="tool-description">Resize images to any dimensions while maintaining quality</p>
                </Link>
                <Link href="/image-converter" className="tool-card">
                    <span className="tool-icon">🔄</span>
                    <h3 className="tool-title">Image Converter</h3>
                    <p className="tool-description">Convert between different image formats (JPG, PNG, WebP, etc.)</p>
                </Link>
                <Link href="/qr-generator" className="tool-card">
                    <span className="tool-icon">📱</span>
                    <h3 className="tool-title">QR Code Generator</h3>
                    <p className="tool-description">Create QR codes for URLs, text, or contact information</p>
                </Link>
                <Link href="/weather" className="tool-card">
                    <span className="tool-icon">🌤️</span>
                    <h3 className="tool-title">Weather Check</h3>
                    <p className="tool-description">Get current weather information for any city</p>
                </Link>
                <Link href="/ip-detector" className="tool-card">
                    <span className="tool-icon">🌐</span>
                    <h3 className="tool-title">IP Detector</h3>
                    <p className="tool-description">Get detailed information about any IP address</p>
                </Link>
                <Link href="/calculator" className="tool-card">
                    <span className="tool-icon">🧮</span>
                    <h3 className="tool-title">Calculator</h3>
                    <p className="tool-description">Advanced calculator with scientific functions</p>
                </Link>
                <Link href="/hash-converter" className="tool-card">
                    <span className="tool-icon">🔐</span>
                    <h3 className="tool-title">Hash Converter</h3>
                    <p className="tool-description">Generate hashes with various algorithms and salt options</p>
                </Link>
                <Link href="/binary-converter" className="tool-card">
                    <span className="tool-icon">💻</span>
                    <h3 className="tool-title">Binary Converter</h3>
                    <p className="tool-description">Convert between binary, decimal, hex, and octal</p>
                </Link>
                <Link href="/password-generator" className="tool-card">
                    <span className="tool-icon">🔑</span>
                    <h3 className="tool-title">Password Generator</h3>
                    <p className="tool-description">Generate secure passwords with custom options</p>
                </Link>
                <Link href="/coin-toss" className="tool-card">
                    <span className="tool-icon">🪙</span>
                    <h3 className="tool-title">Coin Toss</h3>
                    <p className="tool-description">Flip a virtual coin to get heads or tails.</p>
                </Link>
                <Link href="/advanced-clock" className="tool-card">
                    <span className="tool-icon">🕒</span>
                    <h3 className="tool-title">Advanced Clock</h3>
                    <p className="tool-description">View the current time in different timezones.</p>
                </Link>
                <Link href="/audio-recorder" className="tool-card">
                    <span className="tool-icon">🎙️</span>
                    <h3 className="tool-title">Audio Recorder</h3>
                    <p className="tool-description">Record audio from your microphone and save it.</p>
                </Link>
                <Link href="/tone-generator" className="tool-card">
                    <span className="tool-icon">🎶</span>
                    <h3 className="tool-title">Tone Generator</h3>
                    <p className="tool-description">Generate audio tones with custom frequencies and wave shapes.</p>
                </Link>
                <Link href="/code-scanner" className="tool-card">
                    <span className="tool-icon">📷</span>
                    <h3 className="tool-title">Code Scanner</h3>
                    <p className="tool-description">Scan QR and barcodes using your device&apos;s camera.</p>
                </Link>
                <Link href="/net-speed" className="tool-card">
                    <span className="tool-icon">⚡</span>
                    <h3 className="tool-title">Net Speed Test</h3>
                    <p className="tool-description">Check your internet download and upload speed.</p>
                </Link>
                <Link href="/color-converter" className="tool-card">
                    <span className="tool-icon">🎨</span>
                    <h3 className="tool-title">Color Converter</h3>
                    <p className="tool-description">Pick colors and convert between HEX, RGB, and HSL.</p>
                </Link>
                <Link href="/notes" className="tool-card">
                    <span className="tool-icon">📝</span>
                    <h3 className="tool-title">Notes App</h3>
                    <p className="tool-description">A simple notepad that saves to your browser.</p>
                </Link>
                <Link href="/image-editor" className="tool-card">
                    <span className="tool-icon">🖼️</span>
                    <h3 className="tool-title">Image Editor</h3>
                    <p className="tool-description">Apply filters like brightness, contrast, and more.</p>
                </Link>
                <Link href="/html-viewer" className="tool-card">
                    <span className="tool-icon">🌐</span>
                    <h3 className="tool-title">HTML Viewer</h3>
                    <p className="tool-description">Write and render HTML, CSS, and JS in a live sandbox.</p>
                </Link>
                <Link href="/whiteboard" className="tool-card">
                    <span className="tool-icon">🖌️</span>
                    <h3 className="tool-title">Online Whiteboard</h3>
                    <p className="tool-description">A simple drawing board for sketches and notes.</p>
                </Link>
            </div>
        </div>
    );
}
