"use client";
import React, { useState, useEffect, useRef } from 'react';
import { fetchTextModels, getChatModels, PollinationModel } from '../utils/pollinationModels';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', content: "Hello! I'm your LND AI assistant. Welcome To LND Ai. How can I assist you today?" }]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('openai');
  const [isLoading, setIsLoading] = useState(false);
  const [keepContext, setKeepContext] = useState(true);
  const [chatModels, setChatModels] = useState<PollinationModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await fetchTextModels(); // Ensure models are loaded
        const models = getChatModels();
        setChatModels(models);
      } catch (error) {
        console.error('Failed to load chat models:', error);
      } finally {
        setIsLoadingModels(false);
      }
    };
    
    loadModels();
  }, []);

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
      // Use Pollination AI Text API for all models
      const encodedMessage = encodeURIComponent(input);
      const response = await fetch(`https://text.pollinations.ai/${encodedMessage}?model=${model}`);
      
      if (!response.ok) {
        throw new Error("Failed to get response from Pollination AI");
      }
      
      const reply = await response.text();
      setMessages([...newMessages, { role: "bot", content: reply }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { role: "bot", content: "Sorry, something went wrong." }]);
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
            <select 
              className="chat-model-select" 
              id="chatModelSelect" 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              disabled={isLoadingModels}
            >
              {isLoadingModels ? (
                <option>Loading models...</option>
              ) : (
                chatModels.map((chatModel) => (
                  <option key={chatModel.id} value={chatModel.id}>
                    {chatModel.name}
                  </option>
                ))
              )}
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
