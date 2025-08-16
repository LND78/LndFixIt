function initializeChatbot() {
    // The chatbot UI is already in index.html, so this function is not needed.
}

function toggleChatbot() {
    // This will be handled in main.js
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    addChatMessage('user', text);
    input.value = '';
    setChatButtonLoading(true);

    try {
        let responseText;
        const keyToUse = geminiKey;
        if (!keyToUse) {
            throw new Error('Gemini API key not found. Please set it in the settings.');
        }
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${keyToUse}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text }] }] })
        });
        if (!res.ok) {
            const errorBody = await res.text();
            throw new Error(`Gemini API Error: ${res.statusText} - ${errorBody}`);
        }
        const data = await res.json();
        responseText = data.candidates[0].content.parts[0].text;

        addChatMessage('bot', responseText);
    } catch (error) {
        console.error(error);
        addChatMessage('bot', `Sorry, an error occurred: ${error.message}`);
    } finally {
        setChatButtonLoading(false);
    }
}

function addChatMessage(sender, content) {
    const messagesDiv = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    const avatar = sender === 'user' ? '👤' : '🤖';
    let messageContent = `<p>${content.replace(/\n/g, '<br>')}</p>`;
    if (content.includes("Please set it in the settings")) {
        messageContent += `<button class="generate-btn" style="margin-top: 10px; padding: 5px 10px; font-size: 0.8rem;" onclick="document.getElementById('settingsBtn').click()">Go to Settings</button>`;
    }
    messageDiv.innerHTML = `<div class="message-avatar">${avatar}</div><div class="message-content">${messageContent}</div>`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function setChatButtonLoading(isLoading) {
    const btn = document.getElementById('chatSendBtn');
    btn.disabled = isLoading;
    btn.innerHTML = isLoading ? '...' : 'Send';
}
