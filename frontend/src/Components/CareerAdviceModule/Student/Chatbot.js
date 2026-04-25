import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Get User ID for persistence
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id || user?._id;

    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(null); // stores index of message being spoken

    // Voices/Speech Logic
    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US'; // Default to English, but can handle others if configured
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInputMessage(transcript);
        };

        recognition.start();
    };

    const speakText = (text, index) => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(null);
            if (isSpeaking === index) return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Language detection hint
        const isSinhala = /[\u0D80-\u0DFF]/.test(text);
        utterance.lang = isSinhala ? 'si-LK' : 'en-US';
        
        utterance.onend = () => setIsSpeaking(null);
        setIsSpeaking(index);
        window.speechSynthesis.speak(utterance);
    };

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Load History on Mount
    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:5001/api/chat/history/${userId}`)
                .then(res => {
                    if (res.data.messages && res.data.messages.length > 0) {
                        setMessages(res.data.messages);
                    } else {
                        setMessages([{ text: "Hello! I'm your Career AI Assistant. How can I help you today?", sender: 'bot' }]);
                    }
                })
                .catch(err => {
                    console.error("Error loading chat history:", err);
                    setMessages([{ text: "Hello! I'm your Career AI Assistant. How can I help you today?", sender: 'bot' }]);
                });
        } else {
            setMessages([{ text: "Hello! I'm your Career AI Assistant. How can I help you today?", sender: 'bot' }]);
        }
    }, [userId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const sendToChat = async (text) => {
        const newMessages = [...messages, { text, sender: 'user' }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:5001/api/chat/ask", { 
                message: text,
                userId: userId 
            });
            setMessages(prev => [...prev, { text: response.data.reply, sender: 'bot' }]);
        } catch (error) {
            console.error("Error connecting to Chatbot AI:", error);
            const errorMessage = "I'm sorry, I am having trouble connecting to my brain right now.";
            setMessages(prev => [...prev, { text: errorMessage, sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file.');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);
        
        const tempMsg = { text: `Uploading resume: ${file.name}...`, sender: 'user' };
        setMessages(prev => [...prev, tempMsg]);
        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:5001/api/chat/analyze-resume", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessages(prev => [...prev, { text: response.data.reply, sender: 'bot' }]);
        } catch (error) {
            console.error("Error analyzing resume:", error);
            setMessages(prev => [...prev, { text: "Failed to analyze resume. Please try again.", sender: 'bot' }]);
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

    const quickActions = ["Resume Tips", "Interview Prep", "Internships", "Salary Negotiation", "Networking", "Skill Development"];

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
                            <div className="message-container" style={{ display: 'flex', flexDirection: 'column' }}>
                                {msg.sender === 'bot' && (
                                    <div className="bot-msg-header">
                                        <button 
                                            className={`speaker-btn ${isSpeaking === index ? 'speaking' : ''}`} 
                                            onClick={() => speakText(msg.text, index)}
                                            title="Read aloud"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                            </svg>
                                        </button>
                                    </div>
                                )}
                                <div className="message-bubble">
                                    {msg.sender === 'bot' ? (
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            </div>
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
                        type="file" 
                        id="resume-upload" 
                        style={{ display: 'none' }} 
                        accept=".pdf" 
                        onChange={handleResumeUpload}
                    />
                    <label htmlFor="resume-upload" className="voice-btn" style={{ cursor: 'pointer' }} title="Upload Resume (PDF)">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                        </svg>
                    </label>
                    <button 
                        type="button" 
                        className={`voice-btn ${isListening ? 'listening' : ''}`} 
                        onClick={startListening}
                        title="Speech to text"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                            <line x1="12" y1="19" x2="12" y2="23"></line>
                            <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                    </button>
                    <input
                        type="text"
                        placeholder={isListening ? "Listening..." : "Type your message..."}
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
