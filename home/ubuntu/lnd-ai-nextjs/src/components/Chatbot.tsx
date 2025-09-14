"use client";
import React, { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', content: "Hello! I'm your LND AI assistant. Welcome To LND Ai. How can I assist you today?" }]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('pollinations');
  const [isLoading, setIsLoading] = useState(false);
  const [keepContext, setKeepContext] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const payload = {
        message: input,
        model: model,
        history: keepContext ? newMessages.slice(0, -1) : [],
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      setMessages([...newMessages, { role: 'bot', content: data.reply }]);

    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'bot', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button className="chatbot-toggle" id="chatbotToggle" onClick={() => setIsOpen(!isOpen)}>💬</button>
      {isOpen && (
        <div className="chatbot-window open" id="chatbotWindow">
          <div className="chatbot-header">
            <div className="chatbot-title">🤖 AI Assistant</div>
            <select className="chat-model-select" id="chatModelSelect" value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="pollinations">Pollinations AI</option>
              <option value="gemini">Google Gemini</option>
              <option value="deepseek">DeepSeek R1</option>
            </select>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="chatbot-messages" id="chatbotMessages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}>
                <div className="message-avatar">{msg.role === 'bot' ? '🤖' : '👤'}</div>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message bot-message">
                <div className="message-avatar">🤖</div>
                <div className="message-content">🤔 Thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input-area">
            <div className="chat-input-container">
              <textarea
                className="chat-input"
                id="chatInput"
                placeholder="Type your message..."
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button className="chat-send-btn" onClick={handleSendMessage} disabled={isLoading}>➤</button>
            </div>
            <div className="form-group" style={{ marginTop: "15px", marginBottom: "0" }}>
                <label className="checkbox-label" style={{ marginLeft: "15px" }}>
                    <input type="checkbox" id="keepContext" checked={keepContext} onChange={(e) => setKeepContext(e.target.checked)} />
                    <span className="checkmark"></span>
                    Keep context
                </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
