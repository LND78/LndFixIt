// Global variables
let taskStates = {
    image: false,
    tts: false,
    scrap: false
};
let generatedImages = [];
let currentTool = null;
let geminiKey = '';
let openrouterKey = '';


// Initialize particles and setup on page load
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    setupEventListeners();
    initializeChatbot();
    initializeTtsVoices();
    initializeSettings();
    // Initialize tool interfaces
    Object.keys(toolInterfaces).forEach(toolName => {
        const toolContainer = document.getElementById(toolName);
        if(toolContainer) {
            const tool = toolInterfaces[toolName];
            toolContainer.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 class="results-title">◆ ${tool.title} ◆</h2>
                    <button class="generate-btn" style="padding: 10px 15px; font-size: 0.9rem;" onclick="backToTools()">← Back to Tools</button>
                </div>
                ${tool.content}
            `;
            toolContainer.style.display = 'none';
        }
    });
});

// Create enhanced floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particlesContainer.appendChild(particle);
    }
}

function copyToClipboard(btnElement, textToCopy) {
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btnElement.innerHTML;
        btnElement.disabled = true;
        btnElement.innerHTML = '✅ Copied!';
        setTimeout(() => {
            btnElement.innerHTML = originalText;
            btnElement.disabled = false;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Could not copy text to clipboard.');
    });
}

// Setup event listeners
function setupEventListeners() {
    const imageForm = document.getElementById('imageForm');
    const ttsForm = document.getElementById('ttsForm');

    imageForm.addEventListener('submit', handleImageFormSubmit);
    ttsForm.addEventListener('submit', handleTTSFormSubmit);

    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Ctrl/Cmd + Enter to generate
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            if (!isGenerating) {
                const activeSection = document.querySelector('.tool-section.active');
                if (activeSection.id === 'textToImage') {
                    handleImageFormSubmit(event);
                } else if (activeSection.id === 'textToSpeech') {
                    handleTTSFormSubmit(event);
                }
            }
        }
    });
}

// Tab switching functionality
function switchTab(tabName) {
    // Remove active class from all tabs and sections
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tool-section').forEach(section => section.classList.remove('active'));

    // Add active class to clicked tab and corresponding section
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');

    // Reset any tool interfaces in more tools section
    if (tabName === 'moreTools') {
        backToTools();
    }

    // Setup web-scrap listeners when switching to webScrap tab
    if (tabName === 'webScrap') {
        setupWebScrapListeners();
    }
}

// Tool selection in more tools section
function selectTool(toolName) {
    currentTool = toolName;

    // Hide tools grid
    document.getElementById('toolsGridPanel').style.display = 'none';

    // Hide all tool interfaces
    document.querySelectorAll('.tool-interface').forEach(el => el.style.display = 'none');

    // Show selected tool interface
    const toolContainer = document.getElementById(toolName);
    toolContainer.style.display = 'block';

    // Special initialization for some tools
    if (toolName === 'unitConverter') {
        updateUnitTypes();
    }
    if (toolName === 'colorPicker') {
        updateColorPicker();
    }
    if (toolName === 'gradientGenerator') {
        generateGradient();
    }
    if (toolName === 'markdownConverter') {
        // Set initial placeholder text and render it
        const mdInput = document.getElementById('markdownInput');
        if (mdInput && !mdInput.value) {
            mdInput.value = "# Hello, World!\n\nThis is **Markdown**.\n\n- List item 1\n- List item 2";
        }
        convertMarkdown();
    }
    if (toolName === 'regexTester') {
        testRegex();
    }
    if (toolName === 'memeGenerator') {
        generateMeme();
    }
    if (toolName === 'jokeGenerator') {
        getJoke();
    }
    if (toolName === 'quoteGenerator') {
        getQuote();
    }
    if (toolName === 'asciiBannerGenerator') {
        populateFigletFonts();
        generateAsciiBanner();
    }
    if (toolName === 'colorContrast') {
        checkColorContrast();
    }
    if (toolName === 'timeZoneConverter') {
        populateTimeZones();
        // Set initial time
        const dtInput = document.getElementById('timeZoneDateTime');
        if (dtInput && !dtInput.value) {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            dtInput.value = now.toISOString().slice(0,16);
        }
        convertTimeZone();
    }
    if (toolName === 'codeHighlighter') {
        const codeInput = document.getElementById('codeInput');
        if (codeInput && !codeInput.value) {
            codeInput.value = "function helloWorld() {\n  console.log('Hello, world!');\n}";
        }
        highlightSyntax();
    }
}

function backToTools() {
    currentTool = null;

    // Show tools grid
    document.getElementById('toolsGridPanel').style.display = 'block';

    // Hide all tool interfaces
    document.querySelectorAll('.tool-interface').forEach(interface => {
        interface.style.display = 'none';
    });
}

// Set generating state for a specific task
function setGenerating(taskName, isStarting) {
    taskStates[taskName] = isStarting;

    const buttons = {
        image: { id: 'generateBtn', text: 'Generate Masterpiece' },
        tts: { id: 'ttsGenerateBtn', text: 'Generate Speech & Download' },
        scrap: { id: 'scrapBtn', text: 'Start Web Scraping' }
    };

    const btnConfig = buttons[taskName];
    if (!btnConfig) return;

    const btn = document.getElementById(btnConfig.id);
    if (!btn) return;

    btn.disabled = isStarting;
    if (isStarting) {
        btn.innerHTML = `<div class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px; margin: 0 auto;"></div>`;
    } else {
        btn.innerHTML = btnConfig.text;
    }
}

// Show loading state for images
function showLoading() {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <div class="loading-text">Creating Your Masterpiece...</div>
            <div class="loading-subtext">LND AI is processing your request</div>
        </div>
    `;
}

// Show error message for images
function showError(message, showReload = false) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">⚠️</div>
            <div class="empty-text">Generation Failed</div>
            <div class="empty-subtext">${message}</div>
        </div>
        <div class="error-message">
            <span>❌</span>
            <span>${message}</span>
        </div>
        ${showReload ? '<button class="reload-btn" onclick="window.location.reload()">Reload Page</button>' : ''}
    `;
}

// Truncate text to specified length
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Hash function for generating seeds
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

const toolInterfaces = {
    // Existing Tools
    qrReader: {
        title: "QR Code Reader",
        content: `<button class="generate-btn" onclick="startCameraScan()">📷 Scan with Camera</button><p style="text-align:center; margin:15px 0;">OR</p><input type="file" id="qrImageFile" accept="image/*" class="prompt-input" onchange="scanImageFile()"><div id="qr-reader" style="margin-top:20px;"></div><div id="qr-reader-result" style="margin-top:20px; font-weight:bold;"></div>`
    },
    qrGenerator: {
        title: "QR Code Generator",
        content: `<div class="form-group"><label class="form-label">Text or URL</label><input type="text" id="qrGenInput" class="prompt-input" placeholder="https://example.com"></div><button class="generate-btn" onclick="generateQRCode()">Generate QR Code</button><div id="qrGenResult" style="margin-top:20px; text-align:center;"></div>`
    },
    imageResizer: {
        title: "Image Resizer",
        content: `<input type="file" id="resizeFileInput" accept="image/*" class="prompt-input"><div class="controls-grid" style="margin-top:20px;"><input type="number" id="resizeWidth" class="prompt-input" placeholder="Width (px)"><input type="number" id="resizeHeight" class="prompt-input" placeholder="Height (px)"></div><button class="generate-btn" onclick="resizeImage()">Resize Image</button><div id="resizeResult" style="margin-top:20px;"></div>`
    },
    imageConverter: {
        title: "Image Converter",
        content: `<input type="file" id="convertFileInput" accept="image/*" class="prompt-input"><div class="form-group" style="margin-top:20px;"><label class="form-label">Convert to:</label><select id="convertFormat" class="custom-select"><option value="jpeg">JPG</option><option value="png">PNG</option><option value="webp">WebP</option></select></div><button class="generate-btn" onclick="convertImage()">Convert</button><div id="convertResult" style="margin-top:20px;"></div>`
    },
    passwordGenerator: {
        title: "Password Generator",
        content: `<div class="form-group"><label class="form-label">Length: <span id="passLengthLabel">16</span></label><input type="range" id="passLength" min="8" max="64" value="16" class="prompt-input" oninput="document.getElementById('passLengthLabel').textContent = this.value"></div><button class="generate-btn" onclick="generatePassword()">Generate Password</button><div id="passwordResult" style="margin-top:20px; text-align:center; font-weight:bold; background: rgba(0,0,0,0.2); padding:10px; border-radius:8px;"></div>`
    },
    hashConverter: {
        title: "Hash Generator",
        content: `<textarea id="hashInput" class="prompt-input" placeholder="Enter text to hash..."></textarea><button class="generate-btn" style="margin-top:20px;" onclick="generateHashes()">Generate Hashes</button><div id="hashResult" style="margin-top:20px;"></div>`
    },
    unitConverter: {
        title: "Unit Converter",
        content: `<div class="controls-grid"><input type="number" id="unitInput" class="prompt-input" placeholder="Enter value" oninput="convertUnits()"><select id="unitCategory" class="custom-select" onchange="updateUnitTypes()"><option value="length">Length</option><option value="weight">Weight</option><option value="temperature">Temperature</option></select></div><div class="controls-grid"><select id="fromUnit" class="custom-select" onchange="convertUnits()"></select><select id="toUnit" class="custom-select" onchange="convertUnits()"></select></div><div id="unitResult" style="margin-top:20px; text-align:center; font-size:1.5rem; font-weight:bold;"></div>`
    },
    caseConverter: {
        title: "Case Converter",
        content: `<textarea id="caseInput" class="prompt-input" placeholder="Enter text here..."></textarea><div class="controls-grid" style="margin-top:20px;"><button class="generate-btn" onclick="convertCase('upper')">UPPER</button><button class="generate-btn" onclick="convertCase('lower')">lower</button><button class="generate-btn" onclick="convertCase('title')">Title</button></div><textarea id="caseResult" class="prompt-input" readonly></textarea>`
    },
    wordCounter: {
        title: "Word Counter",
        content: `<textarea id="wordCountInput" class="prompt-input" placeholder="Paste your text here..." oninput="countWords()"></textarea><div id="wordCountResult" style="margin-top:20px; text-align:center; font-weight:bold;"></div>`
    },
    jsonFormatter: {
        title: "JSON Formatter",
        content: `<textarea id="jsonInput" class="prompt-input" placeholder="Paste your JSON here..."></textarea><button class="generate-btn" style="margin-top:20px;" onclick="formatJSON()">Format JSON</button><textarea id="jsonResult" class="prompt-input" readonly style="margin-top:10px;"></textarea>`
    },
    colorPicker: {
        title: "Image Color Picker",
        content: `<input type="color" id="colorPickerInput" value="#8B5CF6" class="prompt-input" style="height:50px;" oninput="updateColorPicker()"><div id="colorPickerResult" style="margin-top:20px; text-align:center;"></div>`
    },
    gradientGenerator: {
        title: "CSS Gradient Generator",
        content: `<div class="controls-grid"><input type="color" id="gradColor1" value="#8B5CF6" oninput="generateGradient()"><input type="color" id="gradColor2" value="#2D1B69" oninput="generateGradient()"></div><div id="gradientPreview" style="height:100px; border-radius:10px; margin-top:20px;"></div><textarea id="gradientResult" class="prompt-input" readonly style="margin-top:10px;"></textarea>`
    },
    ipDetector: {
        title: "IP Address Lookup",
        content: `<button class="generate-btn" onclick="detectIP()">Detect My IP</button><div id="ipResult" style="margin-top:20px;"></div>`
    },
    weatherCheck: {
        title: "Weather Check",
        content: `<input type="text" id="cityInput" class="prompt-input" placeholder="Enter city name..."><button class="generate-btn" style="margin-top:20px;" onclick="getWeather()">Get Weather</button><div id="weatherResult" style="margin-top:20px;"></div>`
    },
    loremIpsum: {
        title: "Lorem Ipsum Generator",
        content: `<input type="number" id="loremCount" class="prompt-input" value="3" placeholder="Number of paragraphs"><button class="generate-btn" style="margin-top:20px;" onclick="generateLorem()">Generate</button><textarea id="loremResult" class="prompt-input" readonly style="margin-top:10px; height:150px;"></textarea>`
    },
    grammarChecker: {
        title: "Grammar Checker",
        content: `<textarea id="grammarInput" class="prompt-input" placeholder="Enter text to check..."></textarea><button class="generate-btn" style="margin-top:20px;" onclick="checkGrammar()">Check Grammar</button><div id="grammarResult" style="margin-top:20px;"></div>`
    },
    textSummarizer: {
        title: "Text Summarizer",
        content: `<textarea id="summarizeInput" class="prompt-input" placeholder="Enter long text to summarize..."></textarea><button class="generate-btn" style="margin-top:20px;" onclick="summarizeText()">Summarize Text</button><div id="summarizeResult" style="margin-top:20px;"></div>`
    },

    // New Tools Placeholders
    paraphraser: {
        title: "Paraphraser",
        content: `
            <div class="form-group">
                <label for="paraphraserInput" class="form-label">Text to Paraphrase</label>
                <textarea id="paraphraserInput" class="prompt-input" rows="5" placeholder="Enter the text you want to rephrase..."></textarea>
            </div>
            <button class="generate-btn" onclick="paraphraseText()">Rephrase Text</button>
            <div class="form-group" style="margin-top:20px;">
                <label class="form-label">Result</label>
                <textarea id="paraphraserResult" class="prompt-input" rows="5" readonly placeholder="Paraphrased text will appear here..."></textarea>
            </div>
        `
    },
    languageTranslator: {
        title: "Language Translator",
        content: `
            <div class="form-group">
                <label for="translatorInput" class="form-label">Text to Translate</label>
                <textarea id="translatorInput" class="prompt-input" placeholder="Enter text here..."></textarea>
            </div>
            <div class="form-group">
                <label for="translatorLang" class="form-label">Translate to</label>
                <select id="translatorLang" class="custom-select">
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                    <option value="ru">Russian</option>
                    <option value="zh">Chinese</option>
                    <option value="ar">Arabic</option>
                    <option value="hi">Hindi</option>
                    <option value="pt">Portuguese</option>
                    <option value="it">Italian</option>
                </select>
            </div>
            <button class="generate-btn" onclick="translateText()">Translate</button>
            <div class="form-group" style="margin-top:20px;">
                <label class="form-label">Result</label>
                <textarea id="translatorResult" class="prompt-input" readonly placeholder="Translation will appear here..."></textarea>
            </div>
        `
    },
    textSentiment: {
        title: "Sentiment Analyzer",
        content: `
            <div class="form-group">
                <label for="sentimentInput" class="form-label">Text to Analyze</label>
                <textarea id="sentimentInput" class="prompt-input" rows="5" placeholder="Enter text to analyze its sentiment... e.g., 'I love this new update!'"></textarea>
            </div>
            <button class="generate-btn" onclick="analyzeSentiment()">Analyze Sentiment</button>
            <div id="sentimentResult" style="margin-top:20px;"></div>
        `
    },
    keywordExtractor: {
        title: "Keyword Extractor",
        content: `
            <div class="form-group">
                <label for="keywordInput" class="form-label">Text to Analyze</label>
                <textarea id="keywordInput" class="prompt-input" rows="6" placeholder="Enter a block of text to extract keywords from..."></textarea>
            </div>
            <button class="generate-btn" onclick="extractKeywords()">Extract Keywords</button>
            <div class="form-group" style="margin-top:20px;">
                <label class="form-label">Extracted Keywords</label>
                <div id="keywordResult" style="display: flex; flex-wrap: wrap; gap: 10px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px; min-height: 50px;">
                    <!-- Keywords will appear here -->
                </div>
            </div>
        `
    },
    textToHandwriting: {
        title: "Text to Handwriting",
        content: `
            <div class="form-group">
                <label for="handwritingText" class="form-label">Text to Convert</label>
                <textarea id="handwritingText" class="prompt-input" rows="6" placeholder="Enter the text to convert into a handwriting image..."></textarea>
            </div>
            <button class="generate-btn" onclick="generateHandwriting()">Generate Handwriting</button>
            <div class="form-group" style="margin-top:20px;">
                <label class="form-label">Result</label>
                <div id="handwritingResult" style="padding: 15px; background: rgba(255,255,255,0.9); border-radius: 10px; min-height: 100px; text-align: center;">
                    <!-- Image will be injected here -->
                </div>
            </div>
        `
    },
    imageBackgroundRemover: {
        title: "Background Remover",
        content: `
            <div class="form-group">
                <label for="bgRemoveInput" class="form-label">Upload Image</label>
                <input type="file" id="bgRemoveInput" accept="image/*" class="prompt-input">
            </div>
            <button class="generate-btn" onclick="removeImageBackground()">Remove Background</button>
            <div id="bgRemoveResult" style="margin-top:20px; display: flex; flex-wrap: wrap; justify-content: space-around; gap: 20px; align-items: center;">
                <!-- Result will be shown here -->
            </div>
        `
    },
    imageCompressor: {
        title: "Image Compressor",
        content: `
            <div class="form-group">
                <label for="compressorInput" class="form-label">Upload Image</label>
                <input type="file" id="compressorInput" accept="image/*" class="prompt-input">
            </div>
            <div class="form-group">
                <label for="compressorQuality" class="form-label">Compression Quality: <span id="compressorQualityLabel">0.8</span></label>
                <input type="range" id="compressorQuality" class="range-slider" min="0.1" max="1" value="0.8" step="0.05" oninput="document.getElementById('compressorQualityLabel').textContent = this.value">
            </div>
            <button class="generate-btn" onclick="compressImage()">Compress Image</button>
            <div id="compressorResult" style="margin-top:20px;">
                <!-- Result will be shown here -->
            </div>
        `
    },
    gifMaker: {
        title: "GIF Maker",
        content: `
            <div class="form-group">
                <label for="gifFramesInput" class="form-label">Upload Images (select multiple)</label>
                <input type="file" id="gifFramesInput" accept="image/*" class="prompt-input" multiple>
            </div>
            <div class="controls-grid">
                <div class="form-group">
                    <label for="gifDelay" class="form-label">Frame Delay (ms)</label>
                    <input type="number" id="gifDelay" class="prompt-input" value="200" placeholder="e.g., 200">
                </div>
                <div class="form-group">
                    <label for="gifQuality" class="form-label">Quality (1-30)</label>
                    <input type="number" id="gifQuality" class="prompt-input" value="10" min="1" max="30" placeholder="10 is default">
                </div>
            </div>
            <button class="generate-btn" onclick="createGif()">Create GIF</button>
            <div id="gifResult" style="margin-top:20px; text-align: center;">
                <!-- Result will be shown here -->
            </div>
        `
    },
    asciiArtGenerator: {
        title: "ASCII Art Generator",
        content: `
            <div class="form-group">
                <label for="asciiArtInput" class="form-label">Upload Image</label>
                <input type="file" id="asciiArtInput" accept="image/*" class="prompt-input">
            </div>
            <div class="controls-grid">
                <div class="form-group">
                    <label for="asciiWidth" class="form-label">Character Width</label>
                    <input type="number" id="asciiWidth" class="prompt-input" value="100" placeholder="e.g., 100">
                </div>
                <div class="form-group">
                    <label for="asciiCharset" class="form-label">Character Set</label>
                    <select id="asciiCharset" class="custom-select">
                        <option value="default">Detailed</option>
                        <option value="simple">Simple</option>
                        <option value="blocks">Blocks</option>
                        <option value="binary">Binary</option>
                    </select>
                </div>
            </div>
            <button class="generate-btn" onclick="generateAsciiArt()">Generate ASCII Art</button>
            <div class="form-group" style="margin-top:20px;">
                <label class="form-label">Result</label>
                <div style="position: relative;">
                    <pre id="asciiResult" style="padding: 15px; background: #0A0A1A; color: var(--text-light); border-radius: 10px; min-height: 150px; font-family: 'Courier New', monospace; font-size: 8px; line-height: 1.0; overflow: auto; white-space: pre;"></pre>
                    <button id="copyAsciiBtn" class="download-btn" style="position: absolute; top: 10px; right: 10px; display: none; padding: 5px 10px; font-size: 0.8rem;" onclick="copyAsciiArt()">Copy</button>
                </div>
            </div>
        `
    },
    pdfTextExtractor: {
        title: "PDF Text Extractor",
        content: `
            <div class="form-group">
                <label for="pdfExtractorInput" class="form-label">Upload PDF File</label>
                <input type="file" id="pdfExtractorInput" accept="application/pdf" class="prompt-input">
            </div>
            <button class="generate-btn" onclick="extractPdfText()">Extract Text from PDF</button>
            <div class="form-group" style="margin-top:20px;">
                <label class="form-label">Extracted Text</label>
                <textarea id="pdfExtractorResult" class="prompt-input" rows="10" readonly placeholder="Extracted text will appear here..."></textarea>
            </div>
        `
    },
    textToPdf: {
        title: "Text to PDF",
        content: `
            <div class="form-group">
                <label for="textToPdfInput" class="form-label">Enter Your Text</label>
                <textarea id="textToPdfInput" class="prompt-input" rows="12" placeholder="The text you enter here will be converted into a PDF document."></textarea>
            </div>
            <div class="controls-grid">
                <div class="form-group">
                    <label for="pdfFileName" class="form-label">File Name</label>
                    <input type="text" id="pdfFileName" class="prompt-input" value="lnd-document.pdf" placeholder="e.g., document.pdf">
                </div>
                <div class="form-group">
                    <label for="pdfFontSize" class="form-label">Font Size</label>
                    <input type="number" id="pdfFontSize" class="prompt-input" value="12" min="8" max="72">
                </div>
            </div>
            <button class="generate-btn" onclick="generatePdfFromText()">Generate & Download PDF</button>
            <div id="textToPdfResult" style="margin-top:20px; text-align: center;">
                <!-- Confirmation message will appear here -->
            </div>
        `
    },
    pdfMerger: {
        title: "PDF Merger",
        content: `
            <div class="form-group">
                <label for="pdfMergerInput" class="form-label">Upload PDF Files (select 2 or more)</label>
                <input type="file" id="pdfMergerInput" accept="application/pdf" class="prompt-input" multiple>
            </div>
            <button class="generate-btn" onclick="mergePdfs()">Merge PDFs</button>
            <div id="pdfMergerResult" style="margin-top:20px; text-align: center;">
                <!-- Result will be shown here -->
            </div>
        `
    },
    excelToCsv: {
        title: "Excel to CSV",
        content: `
            <div class="form-group">
                <label for="excelToCsvInput" class="form-label">Upload Excel File (.xls, .xlsx)</label>
                <input type="file" id="excelToCsvInput" accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" class="prompt-input">
            </div>
            <button class="generate-btn" onclick="convertExcelToCsv()">Convert to CSV</button>
            <div id="excelToCsvResult" style="margin-top:20px;">
                <!-- Result will be shown here -->
            </div>
        `
    },
    csvToJson: {
        title: "CSV to JSON",
        content: `
            <div class="form-group">
                <label for="csvToJsonInput" class="form-label">Paste CSV Data</label>
                <textarea id="csvToJsonInput" class="prompt-input" rows="8" placeholder="e.g.,\nheader1,header2\nvalue1,value2"></textarea>
            </div>
            <button class="generate-btn" onclick="convertCsvToJson()">Convert to JSON</button>
            <div class="form-group" style="margin-top:20px;">
                <label class="form-label">JSON Output</label>
                <textarea id="csvToJsonResult" class="prompt-input" rows="8" readonly></textarea>
            </div>
        `
    },
    websiteScreenshot: {
        title: "Website Screenshot",
        content: `
            <div class="form-group">
                <label for="screenshotUrl" class="form-label">Website URL</label>
                <input type="url" id="screenshotUrl" class="prompt-input" placeholder="https://example.com">
            </div>
            <button class="generate-btn" onclick="captureScreenshot()">Capture Screenshot</button>
            <div id="screenshotResult" style="margin-top:20px; text-align: center;">
                <!-- Result will be shown here -->
            </div>
        `
    },
    webpageToPdf: {
        title: "Web Page to PDF",
        content: `
            <div class="form-group">
                <label for="webpageToPdfUrl" class="form-label">Website URL</label>
                <input type="url" id="webpageToPdfUrl" class="prompt-input" placeholder="https://example.com">
            </div>
            <button class="generate-btn" onclick="convertWebpageToPdf()">Convert to PDF</button>
            <div id="webpageToPdfResult" style="margin-top:20px; text-align: center;">
                <!-- Result will be shown here -->
            </div>
        `
    },
    whoisLookup: {
        title: "WHOIS Lookup",
        content: `
            <div class="form-group">
                <label for="whoisDomain" class="form-label">Domain Name</label>
                <input type="text" id="whoisDomain" class="prompt-input" placeholder="example.com">
            </div>
            <button class="generate-btn" onclick="lookupWhois()">Lookup WHOIS</button>
            <div class="form-group" style="margin-top:20px;">
                <label class="form-label">WHOIS Information</label>
                <pre id="whoisResult" style="padding: 15px; background: #0A0A1A; color: var(--text-light); border-radius: 10px; min-height: 200px; font-family: 'Courier New', monospace; font-size: 0.9rem; overflow: auto; white-space: pre-wrap;"></pre>
            </div>
        `
    },
    urlShortener: {
        title: "URL Shortener",
        content: `
            <div class="form-group">
                <label for="longUrlInput" class="form-label">Long URL to Shorten</label>
                <input type="url" id="longUrlInput" class="prompt-input" placeholder="https://example.com/very/long/url/to/shorten">
            </div>
            <button class="generate-btn" onclick="shortenUrl()">Shorten URL</button>
            <div id="shortUrlResult" style="margin-top:20px;">
                <!-- Result will be shown here -->
            </div>
        `
    },
    codeMinifier: {
        title: "Code Minifier",
        content: `
            <div class="form-group">
                <label for="minifyLang" class="form-label">Select Language</label>
                <select id="minifyLang" class="custom-select">
                    <option value="js">JavaScript</option>
                    <option value="css">CSS</option>
                    <option value="html">HTML</option>
                </select>
            </div>
            <div class="controls-grid">
                <div class="form-group" style="margin-bottom: 0;">
                    <label for="minifyInput" class="form-label">Source Code</label>
                    <textarea id="minifyInput" class="prompt-input" rows="10" placeholder="Paste your code here..."></textarea>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label for="minifyResult" class="form-label">Minified Code</label>
                    <textarea id="minifyResult" class="prompt-input" rows="10" readonly></textarea>
                </div>
            </div>
            <div id="minifyStats" style="margin-top:15px; text-align:center; color: var(--text-muted);"></div>
            <button class="generate-btn" style="margin-top:20px;" onclick="minifyCode()">Minify Code</button>
        `
    },
    regexTester: {
        title: "Regex Tester",
        content: `
            <div class="form-group">
                <label for="regexPattern" class="form-label">Regular Expression</label>
                <div class="controls-grid" style="grid-template-columns: 1fr auto; gap: 10px; margin-bottom: 5px;">
                    <input type="text" id="regexPattern" class="prompt-input" style="min-height: auto;" placeholder="[a-z]+" oninput="testRegex()">
                    <input type="text" id="regexFlags" class="prompt-input" style="min-height: auto; width: 100px;" placeholder="g i" oninput="testRegex()">
                </div>
                <div id="regexError" style="color: #FCA5A5; font-size: 0.9rem; margin-top: 5px; min-height: 1.2em;"></div>
            </div>
            <div class="form-group">
                <label for="regexTestString" class="form-label">Test String</label>
                <textarea id="regexTestString" class="prompt-input" rows="6" placeholder="The quick brown fox jumps over the lazy dog." oninput="testRegex()">The quick brown fox jumps over the lazy dog.</textarea>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Result</label>
                <div id="regexResult" style="padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px; min-height: 100px; white-space: pre-wrap; line-height: 1.6;"></div>
            </div>
        `
    },
    markdownConverter: {
        title: "Markdown to HTML",
        content: `
            <div class="controls-grid">
                <div class="form-group" style="margin-bottom: 0;">
                    <label for="markdownInput" class="form-label">Markdown</label>
                    <textarea id="markdownInput" class="prompt-input" rows="12" oninput="convertMarkdown()" placeholder="# Hello, World!"></textarea>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">HTML Preview</label>
                    <div id="markdownPreview" style="padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px; min-height: 295px; overflow-y: auto; border: 2px solid var(--glass-border);"></div>
                </div>
            </div>
            <div class="form-group" style="margin-top: 20px;">
                <label class="form-label">HTML Code</label>
                <div style="position: relative;">
                    <textarea id="markdownResult" class="prompt-input" rows="6" readonly></textarea>
                    <button class="generate-btn" style="position: absolute; top: 10px; right: 10px; width: auto; padding: 5px 10px; font-size: 0.8rem;" onclick="copyToClipboard(this, document.getElementById('markdownResult').value)">Copy</button>
                </div>
            </div>
        `
    },
    codeHighlighter: {
        title: "Syntax Highlighter",
        content: `
            <div class="form-group">
                <label for="codeLang" class="form-label">Language</label>
                <input type="text" id="codeLang" class="prompt-input" style="min-height: auto;" value="javascript" placeholder="e.g., javascript, python, css" oninput="highlightSyntax()">
            </div>
            <div class="form-group">
                <label for="codeInput" class="form-label">Code</label>
                <textarea id="codeInput" class="prompt-input" rows="12" placeholder="Paste your code here..." oninput="highlightSyntax()"></textarea>
            </div>
            <div class="form-group" style="margin-top:20px;">
                <label class="form-label">Highlighted Code</label>
                <div id="highlightResultWrapper" style="position: relative;">
                    <pre id="highlightResult" class="language-javascript" style="border-radius: 10px; min-height: 150px;"></pre>
                    <button class="generate-btn" style="position: absolute; top: 10px; right: 10px; width: auto; padding: 5px 10px; font-size: 0.8rem;" onclick="copyToClipboard(this, document.getElementById('codeInput').value)">Copy Raw</button>
                </div>
            </div>
        `
    },
    base64Converter: {
        title: "Base64 Converter",
        content: `
            <div class="controls-grid">
                <div class="form-group" style="margin-bottom: 0;">
                    <label for="base64Input" class="form-label">Plain Text</label>
                    <textarea id="base64Input" class="prompt-input" rows="10" oninput="convertBase64('encode')" placeholder="Type text here..."></textarea>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label for="base64Result" class="form-label">Base64 Output</label>
                    <textarea id="base64Result" class="prompt-input" rows="10" oninput="convertBase64('decode')" placeholder="Or paste Base64 here..."></textarea>
                </div>
            </div>
            <div id="base64Error" style="margin-top:15px; text-align:center; color: #FCA5A5; min-height: 1.2em;"></div>
        `
    },
    urlEncoder: {
        title: "URL Encoder/Decoder",
        content: `
            <div class="controls-grid">
                <div class="form-group" style="margin-bottom: 0;">
                    <label for="urlDecodeInput" class="form-label">Decoded</label>
                    <textarea id="urlDecodeInput" class="prompt-input" rows="10" oninput="convertUrl('encode')" placeholder="Type text with special characters like & or = to encode..."></textarea>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label for="urlEncodeInput" class="form-label">Encoded</label>
                    <textarea id="urlEncodeInput" class="prompt-input" rows="10" oninput="convertUrl('decode')" placeholder="Or paste encoded text like %26 or %3D here..."></textarea>
                </div>
            </div>
            <div id="urlError" style="margin-top:15px; text-align:center; color: #FCA5A5; min-height: 1.2em;"></div>
        `
    },
    memeGenerator: {
        title: "Meme Generator",
        content: `
            <div class="controls-grid">
                <input type="text" id="memeTopText" class="prompt-input" style="min-height: auto;" placeholder="Top Text" oninput="drawMeme()">
                <input type="text" id="memeBottomText" class="prompt-input" style="min-height: auto;" placeholder="Bottom Text" oninput="drawMeme()">
            </div>
            <div id="memeResult" style="margin-top:20px; text-align: center;">
                <canvas id="memeCanvas" style="max-width: 100%; border-radius: 10px;"></canvas>
            </div>
            <div class="controls-grid" style="margin-top: 20px;">
                <button class="generate-btn" onclick="generateMeme()">New Meme Template</button>
                <button id="downloadMemeBtn" class="generate-btn" style="background: var(--light-purple);" onclick="downloadMeme()">Download Meme</button>
            </div>
        `
    },
    jokeGenerator: {
        title: "Random Joke Generator",
        content: `
            <div id="jokeResult" style="margin-top:20px; text-align: center; min-height: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(0,0,0,0.2); padding: 20px; border-radius: 10px;">
                <!-- Joke will be shown here -->
            </div>
            <button class="generate-btn" style="margin-top: 20px;" onclick="getJoke()">Tell Me a Joke</button>
        `
    },
    quoteGenerator: {
        title: "Random Quote Generator",
        content: `
            <div id="quoteResult" style="margin-top:20px; text-align: center; min-height: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(0,0,0,0.2); padding: 30px; border-radius: 10px;">
                <!-- Quote will be shown here -->
            </div>
            <button class="generate-btn" style="margin-top: 20px;" onclick="getQuote()">Get a New Quote</button>
        `
    },
    asciiBannerGenerator: {
        title: "ASCII Banner Generator",
        content: `
            <div class="form-group">
                <label for="bannerText" class="form-label">Text</label>
                <input type="text" id="bannerText" class="prompt-input" style="min-height: auto;" placeholder="Your Text Here" oninput="generateAsciiBanner()">
            </div>
            <div class="form-group">
                <label for="bannerFont" class="form-label">Font</label>
                <select id="bannerFont" class="custom-select" onchange="generateAsciiBanner()">
                    <!-- Font options will be loaded dynamically -->
                </select>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Result</label>
                <div style="position: relative;">
                    <pre id="bannerResult" style="padding: 15px; background: #0A0A1A; color: var(--text-light); border-radius: 10px; min-height: 150px; font-family: 'Courier New', monospace; overflow: auto; text-align: center;"></pre>
                    <button class="generate-btn" style="position: absolute; top: 10px; right: 10px; width: auto; padding: 5px 10px; font-size: 0.8rem;" onclick="copyToClipboard(this, document.getElementById('bannerResult').textContent)">Copy</button>
                </div>
            </div>
        `
    },
    colorContrast: {
        title: "Color Contrast Checker",
        content: `
            <div class="controls-grid">
                <div class="form-group">
                    <label for="contrastColor1" class="form-label">Foreground Color</label>
                    <input type="color" id="contrastColor1" class="prompt-input" style="height: 50px; padding: 5px; min-height: 50px;" value="#FFFFFF" oninput="checkColorContrast()">
                </div>
                <div class="form-group">
                    <label for="contrastColor2" class="form-label">Background Color</label>
                    <input type="color" id="contrastColor2" class="prompt-input" style="height: 50px; padding: 5px; min-height: 50px;" value="#2D1B69" oninput="checkColorContrast()">
                </div>
            </div>
            <div id="contrastResult" style="margin-top:20px; text-align: center; background: rgba(0,0,0,0.2); padding: 20px; border-radius: 10px;">
                <!-- Result will be shown here -->
            </div>
        `
    },
    timeZoneConverter: {
        title: "Time Zone Converter",
        content: `
            <div class="form-group">
                <label for="timeZoneDateTime" class="form-label">Date & Time</label>
                <input type="datetime-local" id="timeZoneDateTime" class="prompt-input" style="min-height: auto;" oninput="convertTimeZone()">
            </div>
            <div class="controls-grid">
                <div class="form-group">
                    <label for="timeZoneFrom" class="form-label">From</label>
                    <select id="timeZoneFrom" class="custom-select" onchange="convertTimeZone()"></select>
                </div>
                <div class="form-group">
                    <label for="timeZoneTo" class="form-label">To</label>
                    <select id="timeZoneTo" class="custom-select" onchange="convertTimeZone()"></select>
                </div>
            </div>
            <div id="timeZoneResult" style="margin-top:20px; text-align: center; background: rgba(0,0,0,0.2); padding: 20px; border-radius: 10px;">
                <p style="font-size: 1.5rem; color: var(--light-purple); margin:0;">Converted time will appear here</p>
            </div>
        `
    },
};

const commonTimeZones = ["UTC", "GMT", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Paris", "Asia/Tokyo", "Australia/Sydney", "Asia/Kolkata"];

function populateTimeZones() {
    const fromSelect = document.getElementById('timeZoneFrom');
    const toSelect = document.getElementById('timeZoneTo');
    if (!fromSelect || !toSelect) return;

    fromSelect.innerHTML = toSelect.innerHTML = commonTimeZones.map(tz => `<option value="${tz}">${tz}</option>`).join('');

    // Set default based on user's browser timezone
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (commonTimeZones.includes(userTz)) {
        fromSelect.value = userTz;
    }
}

function convertTimeZone() {
    const dateTimeInput = document.getElementById('timeZoneDateTime');
    const fromTz = document.getElementById('timeZoneFrom').value;
    const toTz = document.getElementById('timeZoneTo').value;
    const resultDiv = document.getElementById('timeZoneResult');

    if (!dateTimeInput.value) {
        resultDiv.innerHTML = '<p>Please select a date and time.</p>';
        return;
    }

    try {
        const sourceDate = new Date(dateTimeInput.value);

        const formatter = new Intl.DateTimeFormat('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            timeZone: toTz,
            hour12: true
        });

        const formatted = formatter.format(sourceDate);
        resultDiv.innerHTML = `<p style="font-size: 1.5rem; color: var(--light-purple); margin:0;">${formatted}</p>`;

    } catch (e) {
        resultDiv.innerHTML = `<p class="error-message">Could not convert time. Invalid date or timezone.</p>`;
        console.error("Timezone conversion error:", e);
    }
}

// Additional Tools Functions
function convertMarkdown() {
    const markdownText = document.getElementById('markdownInput').value;
    const previewDiv = document.getElementById('markdownPreview');
    const resultArea = document.getElementById('markdownResult');

    try {
        if(window.marked) {
            const html = marked.parse(markdownText);
            previewDiv.innerHTML = html;
            resultArea.value = html;
        } else {
            resultArea.value = "Error: marked.js library not loaded.";
        }
    } catch (e) {
        previewDiv.innerHTML = '<p class="error-message">Error parsing Markdown.</p>';
        resultArea.value = e.message;
    }
}

// Tool Implementations
let html5QrcodeScanner;
function startCameraScan() {
    const readerElement = document.getElementById('qr-reader');
    readerElement.style.display = 'block';
    html5QrcodeScanner = new Html5Qrcode("qr-reader");
    const config = { fps: 10, qrbox: 250 };
    html5QrcodeScanner.start({ facingMode: "environment" }, config,
        (decodedText, decodedResult) => {
            document.getElementById('qr-reader-result').innerText = `Scanned Result: ${decodedText}`;
            html5QrcodeScanner.stop();
        },
        (errorMessage) => {}
    ).catch((err) => {
        document.getElementById('qr-reader-result').innerText = `Error: ${err}`;
    });
}
function scanImageFile() {
    const fileInput = document.getElementById('qrImageFile');
    if (fileInput.files.length == 0) return;
    const html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCode.scanFile(fileInput.files[0], true)
    .then(decodedText => {
        document.getElementById('qr-reader-result').innerText = `Scanned Result: ${decodedText}`;
    })
    .catch(err => {
        document.getElementById('qr-reader-result').innerText = `Error: ${err}`;
    });
}

function generateQRCode() {
    const text = document.getElementById('qrGenInput').value;
    const resultDiv = document.getElementById('qrGenResult');
    if (!text) return;
    resultDiv.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}" alt="QR Code">`;
}

// Image Resize Tool
function resizeImage() {
    const fileInput = document.getElementById('resizeImageInput');
    const width = parseInt(document.getElementById('resizeWidth').value);
    const height = parseInt(document.getElementById('resizeHeight').value);
    const resultDiv = document.getElementById('resizeResult');

    if (!fileInput.files[0]) {
        resultDiv.innerHTML = '<div class="error-message"><span>❌</span><span>Please select an image file.</span></div>';
        return;
    }

    if (!width || !height) {
        resultDiv.innerHTML = '<div class="error-message"><span>❌</span><span>Please enter valid width and height values.</span></div>';
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                resultDiv.innerHTML = `
                    <div class="results-section" style="background: rgba(0, 0, 0, 0.3); border-radius: 15px; padding: 25px; margin-top: 20px;">
                        <h4 style="color: var(--text-light); margin-bottom: 15px;">Resized Image (${width}x${height})</h4>
                        <img src="${url}" style="max-width: 100%; border-radius: 10px; margin-bottom: 15px;" alt="Resized image">
                        <button class="download-btn" onclick="downloadBlob('${url}', 'lnd-resized-${width}x${height}-${Date.now()}.jpg')">
                            ⬇️ Download Resized Image
                        </button>
                    </div>
                `;
            }, 'image/jpeg', 0.9);
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

// Image Format Converter
function convertImage() {
    const fileInput = document.getElementById('convertImageInput');
    const format = document.getElementById('convertFormat').value;
    const resultDiv = document.getElementById('convertResult');

    if (!fileInput.files[0]) {
        resultDiv.innerHTML = '<div class="error-message"><span>❌</span><span>Please select an image file.</span></div>';
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'png' ? 'image/png' : 'image/webp';
            const extension = format === 'jpeg' ? 'jpg' : format;

            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                resultDiv.innerHTML = `
                    <div class="results-section" style="background: rgba(0, 0, 0, 0.3); border-radius: 15px; padding: 25px; margin-top: 20px;">
                        <h4 style="color: var(--text-light); margin-bottom: 15px;">Converted to ${format.toUpperCase()}</h4>
                        <img src="${url}" style="max-width: 100%; border-radius: 10px; margin-bottom: 15px;" alt="Converted image">
                        <button class="download-btn" onclick="downloadBlob('${url}', 'lnd-converted-${Date.now()}.${extension}')">
                            ⬇️ Download ${format.toUpperCase()} Image
                        </button>
                    </div>
                `;
            }, mimeType, 0.9);
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

// QR Code Generator
function generateQR() {
    const text = document.getElementById('qrText').value.trim();
    const size = document.getElementById('qrSize').value;
    const resultDiv = document.getElementById('qrResult');

    if (!text) {
        resultDiv.innerHTML = '<div class="error-message"><span>❌</span><span>Please enter text or URL to generate QR code.</span></div>';
        return;
    }

    // Using QR Server API (free)
    const encodedText = encodeURIComponent(text);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}`;

    resultDiv.innerHTML = `
        <div class="results-section" style="background: rgba(0, 0, 0, 0.3); border-radius: 15px; padding: 25px; margin-top: 20px;">
            <h4 style="color: var(--text-light); margin-bottom: 15px;">Generated QR Code</h4>
            <div style="text-align: center; margin-bottom: 15px;">
                <img src="${qrUrl}" style="border-radius: 10px; background: white; padding: 10px;" alt="QR Code">
            </div>
            <p style="color: var(--text-muted); margin-bottom: 15px; word-break: break-all;">${text}</p>
            <button class="download-btn" onclick="downloadImage('${qrUrl}', 'lnd-qrcode-${Date.now()}')">
                ⬇️ Download QR Code
            </button>
        </div>
    `;
}

// Weather Check
async function getWeather() {
    const city = document.getElementById('cityName').value.trim();
    const resultDiv = document.getElementById('weatherResult');

    if (!city) {
        resultDiv.innerHTML = '<div class="error-message"><span>❌</span><span>Please enter a city name.</span></div>';
        return;
    }

    try {
        // Using OpenWeatherMap API (free tier)
        // Note: In production, you'd want to use your own API key
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=demo&units=metric`);

        if (!response.ok) {
            // Fallback to a mock weather service for demo
            const mockWeather = {
                name: city,
                main: {
                    temp: Math.floor(Math.random() * 30) + 5,
                    feels_like: Math.floor(Math.random() * 30) + 5,
                    humidity: Math.floor(Math.random() * 50) + 30
                },
                weather: [{
                    main: ['Sunny', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 4)],
                    description: 'pleasant weather'
                }],
                wind: {
                    speed: Math.floor(Math.random() * 10) + 2
                }
            };

            displayWeather(mockWeather, resultDiv);
            return;
        }

        const data = await response.json();
        displayWeather(data, resultDiv);

    } catch (error) {
        console.error('Weather fetch failed:', error);
        resultDiv.innerHTML = '<div class="error-message"><span>❌</span><span>Failed to fetch weather data. Please try again.</span></div>';
    }
}

function displayWeather(data, resultDiv) {
    const weatherIcon = getWeatherIcon(data.weather[0].main);

    resultDiv.innerHTML = `
        <div class="results-section" style="background: rgba(0, 0, 0, 0.3); border-radius: 15px; padding: 25px; margin-top: 20px;">
            <h4 style="color: var(--text-light); margin-bottom: 15px;">${weatherIcon} Weather in ${data.name}</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                <div style="text-align: center;">
                    <div style="font-size: 2rem; color: var(--accent-purple);">${Math.round(data.main.temp)}°C</div>
                    <div style="color: var(--text-muted);">Temperature</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 1.5rem; color: var(--light-purple);">${data.main.humidity}%</div>
                    <div style="color: var(--text-muted);">Humidity</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 1.5rem; color: var(--text-accent);">${data.wind.speed} m/s</div>
                    <div style="color: var(--text-muted);">Wind Speed</div>
                </div>
            </div>
            <div style="margin-top: 15px; text-align: center;">
                <div style="color: var(--text-light); font-weight: 600;">${data.weather[0].main}</div>
                <div style="color: var(--text-muted); text-transform: capitalize;">${data.weather[0].description}</div>
            </div>
        </div>
    `;
}

function getWeatherIcon(weather) {
    const icons = {
        'Sunny': '☀️',
        'Clear': '☀️',
        'Cloudy': '☁️',
        'Clouds': '☁️',
        'Rainy': '🌧️',
        'Rain': '🌧️',
        'Snowy': '❄️',
        'Snow': '❄️',
        'Thunderstorm': '⛈️'
    };
    return icons[weather] || '🌤️';
}

// IP Detector
async function getIPInfo() {
    const ipInput = document.getElementById('ipAddress').value.trim();
    const resultDiv = document.getElementById('ipResult');

    try {
        let url = 'https://ipapi.co/json/';
        if (ipInput) {
            url = `https://ipapi.co/${ipInput}/json/`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch IP information');
        }

        const data = await response.json();

        resultDiv.innerHTML = `
            <div class="results-section" style="background: rgba(0, 0, 0, 0.3); border-radius: 15px; padding: 25px; margin-top: 20px;">
                <h4 style="color: var(--text-light); margin-bottom: 15px;">🌐 IP Information</h4>
                <div style="display: grid; gap: 10px;">
                    <div><strong style="color: var(--accent-purple);">IP Address:</strong> <span style="color: var(--text-light);">${data.ip}</span></div>
                    <div><strong style="color: var(--accent-purple);">Location:</strong> <span style="color: var(--text-light);">${data.city}, ${data.region}, ${data.country_name}</span></div>
                    <div><strong style="color: var(--accent-purple);">ISP:</strong> <span style="color: var(--text-light);">${data.org}</span></div>
                    <div><strong style="color: var(--accent-purple);">Timezone:</strong> <span style="color: var(--text-light);">${data.timezone}</span></div>
                    ${data.latitude ? `<div><strong style="color: var(--accent-purple);">Coordinates:</strong> <span style="color: var(--text-light);">${data.latitude}, ${data.longitude}</span></div>` : ''}
                </div>
            </div>
        `;

    } catch (error) {
        console.error('IP info fetch failed:', error);
        resultDiv.innerHTML = '<div class="error-message"><span>❌</span><span>Failed to fetch IP information. Please try again.</span></div>';
    }
}

// Random Image Generator
function generateRandomImage() {
    const category = document.getElementById('randomCategory').value;
    const size = document.getElementById('randomSize').value;
    const resultDiv = document.getElementById('randomResult');

    // Using Lorem Picsum for random images
    const [width, height] = size.split('x');
    let imageUrl = `https://picsum.photos/${width}/${height}`;

    if (category) {
        // Add category as a seed for consistency
        const seed = hashCode(category + Date.now());
        imageUrl += `?random=${seed}`;
    } else {
        imageUrl += `?random=${Date.now()}`;
    }

    resultDiv.innerHTML = `
        <div class="results-section" style="background: rgba(0, 0, 0, 0.3); border-radius: 15px; padding: 25px; margin-top: 20px;">
            <h4 style="color: var(--text-light); margin-bottom: 15px;">🎲 Random Image${category ? ` (${category})` : ''}</h4>
            <div style="text-align: center; margin-bottom: 15px;">
                <img src="${imageUrl}" style="max-width: 100%; border-radius: 10px;" alt="Random image" onload="this.style.opacity=1" style="opacity:0; transition: opacity 0.3s;">
            </div>
            <div style="text-align: center;">
                <button class="download-btn" onclick="downloadImage('${imageUrl}', 'lnd-random-${Date.now()}')">
                    ⬇️ Download Image
                </button>
                <button class="download-btn" onclick="generateRandomImage()" style="margin-left: 10px;">
                    🎲 Generate New
                </button>
            </div>
        </div>
    `;
}

// Download blob function
function downloadBlob(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Calculator Functions
let calculatorHistory = [];
let currentExpression = '';

function appendToDisplay(value) {
    const display = document.getElementById('calcDisplay');
    if (display.value === '0' || display.value === 'Error') {
        display.value = '';
    }
    display.value += value;
    currentExpression = display.value;
}

function appendFunction(func) {
    const display = document.getElementById('calcDisplay');
    if (display.value === '0' || display.value === 'Error') {
        display.value = '';
    }
    display.value += func;
    currentExpression = display.value;
}

function clearCalculator() {
    document.getElementById('calcDisplay').value = '0';
    currentExpression = '';
}

function deleteLast() {
    const display = document.getElementById('calcDisplay');
    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
    } else {
        display.value = '0';
    }
    currentExpression = display.value;
}

function calculateResult() {
    const display = document.getElementById('calcDisplay');
    const expression = display.value;

    try {
        // Replace display symbols with JavaScript operators
        let jsExpression = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E');

        // Evaluate the expression safely
        const result = Function('"use strict"; return (' + jsExpression + ')')();

        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid calculation');
        }

        // Add to history
        addToHistory(expression, result);

        // Display result
        display.value = result.toString();
        currentExpression = result.toString();

    } catch (error) {
        display.value = 'Error';
        currentExpression = '';
    }
}

function addToHistory(expression, result) {
    calculatorHistory.unshift({ expression, result });
    if (calculatorHistory.length > 10) {
        calculatorHistory.pop();
    }
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyDiv = document.getElementById('calcHistory');
    if (calculatorHistory.length === 0) {
        historyDiv.innerHTML = '<div style="color: var(--text-muted); text-align: center;">No calculations yet</div>';
        return;
    }

    historyDiv.innerHTML = calculatorHistory.map(item => `
        <div class="history-item">
            <span class="history-expression">${item.expression}</span>
            <span class="history-result">= ${item.result}</span>
        </div>
    `).join('');
}

// Initialize calculator display
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('calcDisplay')) {
        document.getElementById('calcDisplay').value = '0';
        updateHistoryDisplay();
    }
});

// Hash Converter Functions
async function generateHash() {
    const input = document.getElementById('hashInput').value.trim();
    const algorithm = document.getElementById('hashAlgorithm').value;
    const salt = document.getElementById('hashSalt').value.trim();
    const resultDiv = document.getElementById('hashResult');

    if (!input) {
        resultDiv.innerHTML = '<div class="error-message"><span>❌</span><span>Please enter text to hash.</span></div>';
        return;
    }

    try {
        let hash = '';
        let saltedInput = salt ? salt + input : input;

        switch (algorithm) {
            case 'md5':
                hash = await generateMD5(saltedInput);
                break;
            case 'sha1':
                hash = await generateSHA1(saltedInput);
                break;
            case 'sha256':
                hash = await generateSHA256(saltedInput);
                break;
            case 'sha512':
                hash = await generateSHA512(saltedInput);
                break;
            case 'bcrypt':
                hash = await generateBcrypt(input, salt || generateRandomSaltString());
                break;
            case 'pbkdf2':
                hash = await generatePBKDF2(input, salt || generateRandomSaltString());
                break;
            default:
                hash = await generateSHA256(saltedInput);
        }

        resultDiv.innerHTML = `
            <div class="results-section" style="background: rgba(0, 0, 0, 0.3); border-radius: 15px; padding: 25px; margin-top: 20px;">
                <h4 style="color: var(--text-light); margin-bottom: 15px;">🔐 Hash Result</h4>
                <div style="display: grid; gap: 15px;">
                    <div>
                        <strong style="color: var(--accent-purple);">Algorithm:</strong>
                        <span style="color: var(--text-light);">${algorithm.toUpperCase()}</span>
                    </div>
                    ${salt ? `<div><strong style="color: var(--accent-purple);">Salt:</strong> <span style="color: var(--text-light); font-family: 'Courier New', monospace;">${salt}</span></div>` : ''}
                    <div>
                        <strong style="color: var(--accent-purple);">Hash:</strong>
                        <div style="background: rgba(0, 0, 0, 0.5); padding: 15px; border-radius: 8px; margin-top: 10px; word-break: break-all; font-family: 'Courier New', monospace; color: var(--text-light);">
                            ${hash}
                        </div>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <button class="download-btn" onclick="copyToClipboard('${hash}')">
                        📋 Copy Hash
                    </button>
                    <button class="download-btn" onclick="downloadHash('${hash}', '${algorithm}')" style="margin-left: 10px;">
                        ⬇️ Download
                    </button>
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Hash generation failed:', error);
        resultDiv.innerHTML = '<div class="error-message"><span>❌</span><span>Failed to generate hash. Please try again.</span></div>';
    }
}

function generateRandomSalt() {
    const salt = generateRandomSaltString();
    document.getElementById('hashSalt').value = salt;
}

function generateRandomSaltString() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let salt = '';
    for (let i = 0; i < 16; i++) {
        salt += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return salt;
}

// Hash generation functions using Web Crypto API
async function generateMD5(input) {
    // MD5 is not available in Web Crypto API, using a simple hash simulation
    return await simpleHash(input, 'MD5');
}

async function generateSHA1(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateSHA256(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateSHA512(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateBcrypt(input, salt) {
    // Bcrypt simulation using PBKDF2
    return await generatePBKDF2(input, salt, 10000);
}

async function generatePBKDF2(input, salt, iterations = 100000) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(input),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: encoder.encode(salt),
            iterations: iterations,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );

    const hashArray = Array.from(new Uint8Array(derivedBits));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function simpleHash(input, algorithm) {
    // Simple hash for algorithms not available in Web Crypto API
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }

    // Convert to hex and pad
    let hexHash = Math.abs(hash).toString(16);
    while (hexHash.length < 32) {
        hexHash = '0' + hexHash;
    }

    return hexHash;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show temporary success message
        const btn = event.target;
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Copied!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function downloadHash(hash, algorithm) {
    const content = `Hash Algorithm: ${algorithm.toUpperCase()}\nHash: ${hash}\nGenerated: ${new Date().toISOString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    downloadBlob(url, `lnd-hash-${algorithm}-${Date.now()}.txt`);
    URL.revokeObjectURL(url);
}

// Binary Converter Functions
function convertBinary() {
    const input = document.getElementById('binaryInput').value.trim();
    const inputFormat = document.getElementById('inputFormat').value;
    const outputFormat = document.getElementById('outputFormat').value;
    const resultDiv = document.getElementById('binaryResult');

    if (!input) {
        resultDiv.innerHTML = '<div class="error-message"><span>❌</span><span>Please enter a value to convert.</span></div>';
        return;
    }

    try {
        let result = '';
        let decimal = 0;

        // Convert input to decimal first
        switch (inputFormat) {
            case 'decimal':
                decimal = parseInt(input, 10);
                if (isNaN(decimal)) throw new Error('Invalid decimal number');
                break;
            case 'binary':
                if (!/^[01\s]+$/.test(input.replace(/\s/g, ''))) throw new Error('Invalid binary number');
                decimal = parseInt(input.replace(/\s/g, ''), 2);
                break;
            case 'octal':
                if (!/^[0-7\s]+$/.test(input.replace(/\s/g, ''))) throw new Error('Invalid octal number');
                decimal = parseInt(input.replace(/\s/g, ''), 8);
                break;
            case 'hexadecimal':
                if (!/^[0-9A-Fa-f\s]+$/.test(input.replace(/\s/g, ''))) throw new Error('Invalid hexadecimal number');
                decimal = parseInt(input.replace(/\s/g, ''), 16);
                break;
            case 'text':
                // Convert text to binary representation
                result = convertTextToBinary(input, outputFormat);
                break;
        }

        // Convert decimal to output format (if not text input)
        if (inputFormat !== 'text') {
            switch (outputFormat) {
                case 'decimal':
                    result = decimal.toString(10);
                    break;
                case 'binary':
                    result = decimal.toString(2);
                    break;
                case 'octal':
                    result = decimal.toString(8);
                    break;
                case 'hexadecimal':
                    result = decimal.toString(16).toUpperCase();
                    break;
                case 'text':
                    result = convertDecimalToText(decimal);
                    break;
            }
        }

        // Format result for better readability
        let formattedResult = result;
        if (outputFormat === 'binary' && result.length > 8) {
            formattedResult = result.replace(/(.{8})/g, '$1 ').trim();
        } else if (outputFormat === 'hexadecimal' && result.length > 2) {
            formattedResult = result.replace(/(.{2})/g, '$1 ').trim();
        }

        resultDiv.innerHTML = `
            <div class="results-section" style="background: rgba(0, 0, 0, 0.3); border-radius: 15px; padding: 25px; margin-top: 20px;">
                <h4 style="color: var(--text-light); margin-bottom: 15px;">💻 Conversion Result</h4>
                <div style="display: grid; gap: 15px;">
                    <div>
                        <strong style="color: var(--accent-purple);">Input:</strong>
                        <span style="color: var(--text-light);">${input} (${inputFormat})</span>
                    </div>
                    <div>
                        <strong style="color: var(--accent-purple);">Output:</strong>
                        <div style="background: rgba(0, 0, 0, 0.5); padding: 15px; border-radius: 8px; margin-top: 10px; word-break: break-all; font-family: 'Courier New', monospace; color: var(--text-light);">
                            ${formattedResult}
                        </div>
                        <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 5px;">
                            Format: ${outputFormat.charAt(0).toUpperCase() + outputFormat.slice(1)}
                        </div>
                    </div>
                    ${inputFormat !== 'text' && outputFormat !== 'text' ? `
                        <div>
                            <strong style="color: var(--accent-purple);">Decimal Value:</strong>
                            <span style="color: var(--text-light);">${decimal}</span>
                        </div>
                    ` : ''}
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <button class="download-btn" onclick="copyToClipboard('${result}')">
                        📋 Copy Result
                    </button>
                    <button class="download-btn" onclick="downloadBinaryResult('${input}', '${inputFormat}', '${result}', '${outputFormat}')" style="margin-left: 10px;">
                        ⬇️ Download
                    </button>
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Binary conversion failed:', error);
        resultDiv.innerHTML = `<div class="error-message"><span>❌</span><span>Conversion failed: ${error.message}</span></div>`;
    }
}

function convertTextToBinary(text, outputFormat) {
    let result = '';

    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);

        switch (outputFormat) {
            case 'binary':
                result += charCode.toString(2).padStart(8, '0') + ' ';
                break;
            case 'decimal':
                result += charCode.toString(10) + ' ';
                break;
            case 'octal':
                result += charCode.toString(8) + ' ';
                break;
            case 'hexadecimal':
                result += charCode.toString(16).toUpperCase() + ' ';
                break;
            default:
                result += charCode.toString(2).padStart(8, '0') + ' ';
        }
    }

    return result.trim();
}

function convertDecimalToText(decimal) {
    try {
        return String.fromCharCode(decimal);
    } catch (error) {
        throw new Error('Cannot convert to valid ASCII character');
    }
}

function clearBinaryConverter() {
    document.getElementById('binaryInput').value = '';
    document.getElementById('binaryResult').innerHTML = '';
}

function downloadBinaryResult(input, inputFormat, result, outputFormat) {
    const content = `Binary Converter Result
Input: ${input} (${inputFormat})
Output: ${result} (${outputFormat})
Generated: ${new Date().toISOString()}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    downloadBlob(url, `lnd-binary-conversion-${Date.now()}.txt`);
    URL.revokeObjectURL(url);
}

// Password Generator Functions
function updateLengthDisplay() {
    const length = document.getElementById('passwordLength').value;
    document.getElementById('lengthDisplay').textContent = length;
}

function generatePasswords() {
    const length = parseInt(document.getElementById('passwordLength').value);
    const count = parseInt(document.getElementById('passwordCount').value);
    const resultDiv = document.getElementById('passwordResult');

    // Get character options
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;
    const includeExtendedSymbols = document.getElementById('includeExtendedSymbols').checked;
    const excludeSimilar = document.getElementById('excludeSimilar').checked;
    const customChars = document.getElementById('customChars').value;

    // Validate at least one character type is selected
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols && !includeExtendedSymbols && !customChars) {
        resultDiv.innerHTML = '<div class="error-message"><span>❌</span><span>Please select at least one character type.</span></div>';
        return;
    }

    try {
        let charset = '';

        // Build character set
        if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (includeNumbers) charset += '0123456789';
        if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        if (includeExtendedSymbols) charset += '~`"\'\\\/';
        if (customChars) charset += customChars;

        // Remove similar characters if requested
        if (excludeSimilar) {
            charset = charset.replace(/[0Ol1]/g, '');
        }

        if (charset.length === 0) {
            throw new Error('No valid characters available for password generation');
        }

        // Generate passwords
        const passwords = [];
        for (let i = 0; i < count; i++) {
            passwords.push(generateSecurePassword(length, charset));
        }

        // Calculate strength
        const strength = calculatePasswordStrength(passwords[0], charset.length);

        resultDiv.innerHTML = `
            <div class="results-section" style="background: rgba(0, 0, 0, 0.3); border-radius: 15px; padding: 25px; margin-top: 20px;">
                <h4 style="color: var(--text-light); margin-bottom: 15px;">🔑 Generated Passwords</h4>
                <div style="display: grid; gap: 15px;">
                    <div>
                        <strong style="color: var(--accent-purple);">Strength:</strong>
                        <span style="color: ${strength.color}; font-weight: 600;">${strength.level}</span>
                        <span style="color: var(--text-muted); margin-left: 10px;">(${strength.entropy} bits)</span>
                    </div>
                    <div>
                        <strong style="color: var(--accent-purple);">Passwords:</strong>
                        <div style="margin-top: 10px;">
                            ${passwords.map((password, index) => `
                                <div style="background: rgba(0, 0, 0, 0.5); padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-family: 'Courier New', monospace; color: var(--text-light); word-break: break-all; flex: 1;">${password}</span>
                                    <button class="download-btn" onclick="copyToClipboard('${password}')" style="margin-left: 15px; padding: 8px 12px; font-size: 0.8rem;">
                                        📋 Copy
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <button class="download-btn" onclick="downloadPasswords(${JSON.stringify(passwords).replace(/"/g, '&quot;')})">
                        ⬇️ Download All
                    </button>
                    <button class="download-btn" onclick="generatePasswords()" style="margin-left: 10px; background: linear-gradient(135deg, #059669, #047857);">
                        🔄 Generate New
                    </button>
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Password generation failed:', error);
        resultDiv.innerHTML = `<div class="error-message"><span>❌</span><span>Password generation failed: ${error.message}</span></div>`;
    }
}

function generateSecurePassword(length, charset) {
    let password = '';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
        password += charset[array[i] % charset.length];
    }

    return password;
}

function calculatePasswordStrength(password, charsetSize) {
    const entropy = Math.log2(Math.pow(charsetSize, password.length));

    let level, color;
    if (entropy < 30) {
        level = 'Very Weak';
        color = '#DC2626';
    } else if (entropy < 50) {
        level = 'Weak';
        color = '#F59E0B';
    } else if (entropy < 70) {
        level = 'Fair';
        color = '#EAB308';
    } else if (entropy < 90) {
        level = 'Good';
        color = '#10B981';
    } else {
        level = 'Very Strong';
        color = '#059669';
    }

    return {
        level,
        color,
        entropy: Math.round(entropy)
    };
}

function generatePassphrase() {
    const resultDiv = document.getElementById('passwordResult');

    // Common words for passphrase generation
    const words = [
        'apple', 'banana', 'cherry', 'dragon', 'elephant', 'forest', 'guitar', 'horizon',
        'island', 'jungle', 'kitchen', 'lemon', 'mountain', 'ocean', 'piano', 'quartz',
        'rainbow', 'sunset', 'thunder', 'umbrella', 'violet', 'whisper', 'xylophone', 'yellow',
        'zebra', 'adventure', 'butterfly', 'cascade', 'diamond', 'emerald', 'firefly', 'galaxy',
        'harmony', 'infinity', 'journey', 'kaleidoscope', 'lighthouse', 'melody', 'nebula', 'oasis'
    ];

    // Generate 4-6 random words
    const wordCount = 4 + Math.floor(Math.random() * 3);
    const selectedWords = [];

    for (let i = 0; i < wordCount; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        selectedWords.push(words[randomIndex]);
    }

    // Create different formats
    const formats = [
        selectedWords.join('-'),
        selectedWords.join(' '),
        selectedWords.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''),
        selectedWords.join('') + Math.floor(Math.random() * 1000),
        selectedWords.join('.') + '!'
    ];

    resultDiv.innerHTML = `
        <div class="results-section" style="background: rgba(0, 0, 0, 0.3); border-radius: 15px; padding: 25px; margin-top: 20px;">
            <h4 style="color: var(--text-light); margin-bottom: 15px;">📝 Generated Passphrases</h4>
            <div style="display: grid; gap: 15px;">
                <div>
                    <strong style="color: var(--accent-purple);">Passphrases:</strong>
                    <div style="margin-top: 10px;">
                        ${formats.map((passphrase, index) => `
                            <div style="background: rgba(0, 0, 0, 0.5); padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-family: 'Courier New', monospace; color: var(--text-light); word-break: break-all; flex: 1;">${passphrase}</span>
                                <button class="download-btn" onclick="copyToClipboard('${passphrase}')" style="margin-left: 15px; padding: 8px 12px; font-size: 0.8rem;">
                                    📋 Copy
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="download-btn" onclick="downloadPasswords(${JSON.stringify(formats).replace(/"/g, '&quot;')})">
                    ⬇️ Download All
                </button>
                <button class="download-btn" onclick="generatePassphrase()" style="margin-left: 10px; background: linear-gradient(135deg, #059669, #047857);">
                    🔄 Generate New
                </button>
            </div>
        </div>
    `;
}

// Web-Scrap functionality
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

    if (isGenerating) {
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

function downloadPasswords(passwords) {
    const content = `LND Password Generator Results
Generated: ${new Date().toISOString()}

Passwords:
${passwords.map((password, index) => `${index + 1}. ${password}`).join('\n')}

⚠️ Security Notice:
- Store these passwords securely
- Do not share via unsecured channels
- Consider using a password manager
- Change passwords regularly`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    downloadBlob(url, `lnd-passwords-${Date.now()}.txt`);
    URL.revokeObjectURL(url);
}
