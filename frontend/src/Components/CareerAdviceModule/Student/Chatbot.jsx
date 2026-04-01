import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your Career AI Assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const sendToChat = async (text) => {
        const newMessages = [...messages, { text, sender: 'user' }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/chat/ask", { message: text });
            setMessages(prev => [...prev, { text: response.data.reply, sender: 'bot' }]);
        } catch (error) {
            console.error("Error connecting to Chatbot AI:", error);
            const errorMessage = error.response?.data?.reply || "I'm sorry, I am having trouble connecting to my brain right now.";
            setMessages(prev => [...prev, { text: errorMessage, sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() === '') return;
        sendToChat(inputMessage);
        setInputMessage('');
    };

    const quickActions = ["Resume Tips", "Interview Prep", "Program Details"];

    return (
        <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
            {/* Toggle Button */}
            <button className="chatbot-toggle-btn" onClick={toggleChat} aria-label="Toggle Chat">
                {isOpen ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                )}
            </button>

            {/* Chat Window */}
            <div className="chatbot-window">
                <div className="chatbot-header">
                    <div className="chatbot-header-info">
                        <div className="chatbot-avatar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"></path>
                                <path d="M12 8v4l3 3"></path>
                            </svg>
                        </div>
                        <div>
                            <h3>Career AI</h3>
                            <span className="online-status">Online</span>
                        </div>
                    </div>
                    <button className="chatbot-close-btn" onClick={toggleChat}>&times;</button>
                </div>

                <div className="chatbot-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.sender}`}>
                            <div className="message-bubble">{msg.text}</div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="chat-message bot">
                            <div className="message-bubble">Typing...</div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chatbot-quick-actions">
                    {quickActions.map((action, idx) => (
                        <button
                            key={idx}
                            type="button"
                            className="quick-action-btn"
                            onClick={() => sendToChat(action)}
                        >
                            {action}
                        </button>
                    ))}
                </div>

                <form className="chatbot-input-area" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                    />
                    <button type="submit" className="send-btn" disabled={!inputMessage.trim()}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
