// --- TEXT TO SPEECH ---
let synth = window.speechSynthesis;
let voices = []; // This is kept for compatibility but the new primary path doesn't use it.

// Use a curated list of high-quality voices from a reliable API for the download feature.
const ttsApiVoices = [
    { name: 'Brian (Male, US)', value: 'Brian' },
    { name: 'Emma (Female, US)', value: 'Emma' },
    { name: 'Geraint (Male, UK)', value: 'Geraint' },
    { name: 'Amy (Female, UK)', value: 'Amy' },
    { name: 'Raveena (Female, IN)', value: 'Raveena' },
    { name: 'Hans (Male, DE)', value: 'Hans' },
    { name: 'Marlene (Female, DE)', value: 'Marlene' }
];

function initializeTtsVoices() {
    const voiceSelect = document.getElementById('ttsVoice');
    if (voiceSelect) {
        voiceSelect.innerHTML = ttsApiVoices
            .map(voice => `<option value="${voice.value}">${voice.name}</option>`)
            .join('');
    }
}

// Handle TTS form submission
async function handleTTSFormSubmit(event) {
    event.preventDefault();
    if (taskStates.tts) return;

    const text = document.getElementById('ttsText').value;
    const voice = document.getElementById('ttsVoice').value;
    const speed = document.getElementById('ttsSpeed').value;
    const container = document.getElementById('ttsResultsContainer');

    if (!text.trim()) {
        container.innerHTML = `<div class="empty-state">⚠️ Please enter some text.</div>`;
        return;
    }

    setGenerating('tts', true);

    try {
        // Using StreamElements API for reliable MP3 generation
        const response = await fetch(`https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=${encodeURIComponent(text)}`);
        if (!response.ok) throw new Error(`API returned status ${response.status}`);

        const blob = await response.blob();
        if (blob.type !== 'audio/mpeg') {
            throw new Error('Invalid audio file received from API. This can happen due to rate-limiting. Please wait a moment and try again.');
        }
        const audioUrl = URL.createObjectURL(blob);

        container.innerHTML = `
            <div class="audio-card" style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 15px; text-align: center;">
                <h4 style="color: var(--text-light); margin-bottom: 15px;">Your speech is ready!</h4>
                <audio id="ttsAudioPlayer" src="${audioUrl}" controls style="width: 100%;"></audio>
                <div style="margin-top: 20px; display: flex; gap: 15px; justify-content: center;">
                    <a href="${audioUrl}" download="lnd-tts-${voice}.mp3" class="download-btn">⬇️ Download MP3</a>
                </div>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 15px;">Use the speed slider above to adjust playback speed.</p>
            </div>
        `;

        // Set initial playback speed and ensure it's applied after metadata loads
        const player = document.getElementById('ttsAudioPlayer');
        if(player) {
            player.onloadedmetadata = () => {
                player.playbackRate = parseFloat(document.getElementById('ttsSpeed').value);
            };
            // For browsers that don't fire onloadedmetadata for blobs quickly
            player.playbackRate = parseFloat(speed);
        }

    } catch (error) {
        console.error('TTS Error:', error);
        container.innerHTML = `<div class="empty-state">❌ Error generating speech: ${error.message}. Please try again.</div>`;
    } finally {
        setGenerating('tts', false);
    }
}
