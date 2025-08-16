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

async function handleTTSFormSubmit(event) {
    event.preventDefault();
    if (taskStates.tts) return;

    const text = document.getElementById('ttsText').value;
    const voice = document.getElementById('ttsVoice').value;
    const container = document.getElementById('ttsResultsContainer');

    if (!text.trim()) {
        showError('ttsResultsContainer', 'Please enter some text.');
        return;
    }

    setGenerating('tts', true);
    showLoading('ttsResultsContainer');

    try {
        const response = await fetch(`https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=${encodeURIComponent(text)}`);
        if (!response.ok) throw new Error(`API returned status ${response.status}`);

        const blob = await response.blob();
        if (blob.type !== 'audio/mpeg') {
            throw new Error('Invalid audio file received from API.');
        }
        const audioUrl = URL.createObjectURL(blob);

        container.innerHTML = `
            <audio src="${audioUrl}" controls></audio>
            <a href="${audioUrl}" download="lnd-tts-${voice}.mp3">Download MP3</a>
        `;

    } catch (error) {
        console.error('TTS Error:', error);
        showError('ttsResultsContainer', `Error generating speech: ${error.message}.`);
    } finally {
        setGenerating('tts', false);
    }
}
