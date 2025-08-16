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

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    initializeTtsVoices();
    initializeSettings();
});

function setupEventListeners() {
    document.querySelector('.nav-tabs').addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-tab')) {
            switchTab(e.target.dataset.tab);
        }
    });

    document.getElementById('imageForm').addEventListener('submit', handleImageFormSubmit);
    document.getElementById('ttsForm').addEventListener('submit', handleTTSFormSubmit);
    document.getElementById('scrapeForm').addEventListener('submit', handleScrapeFormSubmit);
    document.getElementById('settingsBtn').addEventListener('click', () => {
        document.getElementById('settingsModal').style.display = 'block';
    });
    document.getElementById('closeSettingsModal').addEventListener('click', () => {
        document.getElementById('settingsModal').style.display = 'none';
    });
    document.getElementById('saveKeysBtn').addEventListener('click', () => {
        geminiKey = document.getElementById('geminiKey').value;
        openrouterKey = document.getElementById('openrouterKey').value;
        localStorage.setItem('geminiKey', geminiKey);
        localStorage.setItem('openrouterKey', openrouterKey);
        document.getElementById('settingsModal').style.display = 'none';
        alert('API keys saved!');
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tool-section').forEach(section => section.classList.remove('active'));
    document.querySelector(`[data-tab=${tabName}]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

function selectTool(toolName) {
    const toolInterface = document.getElementById('toolInterface');
    toolInterface.innerHTML = `<h3>${toolName}</h3><p>This tool is under construction.</p>`;
}

// Helper functions
function setGenerating(taskName, isStarting) {
    taskStates[taskName] = isStarting;
    const btn = document.getElementById(`${taskName}Btn`);
    if (btn) {
        btn.disabled = isStarting;
        btn.textContent = isStarting ? 'Generating...' : 'Generate';
    }
}

function showLoading(containerId) {
    document.getElementById(containerId).innerHTML = '<p>Loading...</p>';
}

function showError(containerId, message) {
    document.getElementById(containerId).innerHTML = `<p style="color: red;">${message}</p>`;
}

function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}
