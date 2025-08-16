// --- AI CHATBOT ---
let chatbotOpen = false;
let currentChatModel = 'gemini';

function initializeChatbot() {
    const container = document.getElementById('chatbotContainer');
    container.innerHTML = `
        <div id="chatbotToggle" class="chatbot-toggle" onclick="toggleChatbot()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg>
        </div>
        <div id="chatbotWindow" class="chatbot-window">
            <div class="chatbot-header">
                <span class="chatbot-title">AI Assistant</span>
                <select id="chatModelSelect" class="chat-model-select" onchange="currentChatModel = this.value">
                    <option value="gemini">🤖 Gemini</option>
                    <option value="deepseek">🧠 DeepSeek</option>
                    <option value="pollinations">🌸 Pollinations (Gemma)</option>
                    <option value="llama">🦙 Llama 3</option>
                    <option value="claude">🎭 Claude 3</option>
                </select>
                <button class="chatbot-close" onclick="toggleChatbot()">×</button>
            </div>
            <div class="chatbot-messages" id="chatbotMessages">
                <div class="chat-message bot-message"><div class="message-avatar">🤖</div><div class="message-content"><p>Hello! How can I help you?</p></div></div>
            </div>
            <div class="chatbot-input-area">
                <div class="chat-input-container">
                    <textarea id="chatInput" class="chat-input" placeholder="Type a message..." rows="1" onkeydown="if(event.key==='Enter' && !event.shiftKey){event.preventDefault(); sendChatMessage();}"></textarea>
                    <button id="chatSendBtn" class="chat-send-btn" onclick="sendChatMessage()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                    </button>
                </div>
            </div>
        </div>`;
}

function toggleChatbot() {
    chatbotOpen = !chatbotOpen;
    document.getElementById('chatbotWindow').classList.toggle('open');
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
        if (currentChatModel === 'gemini') {
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
        } else { // Use OpenRouter for other models
            const keyToUse = openrouterKey;
            if (!keyToUse) {
                throw new Error('OpenRouter API key not found. Please set it in the settings.');
            }
            let modelName;
            switch(currentChatModel){
                case 'deepseek': modelName = 'deepseek/deepseek-chat'; break;
                case 'pollinations': modelName = 'google/gemma-7b-it'; break; // Using Gemma for Pollinations
                case 'llama': modelName = 'meta-llama/llama-3-8b-instruct'; break;
                case 'claude': modelName = 'anthropic/claude-3-haiku-20240307'; break;
            }
            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${keyToUse}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ model: modelName, messages: [{ role: 'user', content: text }] })
            });
            if (!res.ok) {
                const errorBody = await res.text();
                throw new Error(`OpenRouter API Error: ${res.statusText} - ${errorBody}`);
            }
            const data = await res.json();
            responseText = data.choices[0].message.content;
        }
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
    btn.innerHTML = isLoading ? `<span class="loading-spinner" style="width:16px; height:16px; border-width:2px;"></span>` : `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>`;
}
