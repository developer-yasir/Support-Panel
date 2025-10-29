import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import WebSocketService from '../services/websocket';
import StartNewChat from '../components/StartNewChat';
import './Chat.css';

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showStartNewChat, setShowStartNewChat] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    // Get WebSocket URL from environment or construct it from backend URL
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const cleanBackendUrl = backendUrl.endsWith('/api') ? backendUrl.slice(0, -4) : backendUrl;
    const wsProtocol = cleanBackendUrl.startsWith('https') ? 'wss' : 'ws';
    
    // Remove protocol from URL using string replacement instead of regex to avoid parsing issues
    const cleanUrl = cleanBackendUrl.replace('https://', '').replace('http://', '');
    const wsUrl = `${wsProtocol}://${cleanUrl}/ws`;

    console.log('Connecting to WebSocket:', wsUrl); // Debug log
    
    // Connect to WebSocket
    WebSocketService.connect(wsUrl);

    // Add message listener
    const handleMessage = (data) => {
      // Handle incoming chat messages
      if (data.type === 'chat_message') {
        // Only add the message if it's for the current conversation
        if (data.message.conversationId === activeConversation?.id) {
          setMessages(prev => {
            // Check if message already exists to prevent duplicates
            const messageExists = prev.some(msg => msg.id === data.message.id);
            if (!messageExists) {
              // Ensure message has correct structure and that text is a string
              const processedMessage = {
                ...data.message,
                text: typeof data.message.text === 'object' && data.message.text !== null ? 
                      (data.message.text.text || JSON.stringify(data.message.text)) : 
                      (data.message.text || '')
              };
              return [...prev, processedMessage];
            }
            return prev;
          });
        }
      }
    };

    WebSocketService.addListener('message', handleMessage);

    // Clean up on unmount
    return () => {
      WebSocketService.removeListener('message', handleMessage);
      WebSocketService.disconnect();
    };
  }, [activeConversation?.id]);

  // Fetch conversations from API
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/chat/conversations');
      setConversations(response.data);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setError('Failed to load conversations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Load messages for a conversation
  useEffect(() => {
    if (activeConversation) {
      const fetchMessages = async () => {
        try {
          const response = await api.get(`/chat/conversations/${activeConversation.id}/messages`);
          setMessages(response.data);
        } catch (err) {
          console.error('Failed to fetch messages:', err);
          setError('Failed to load messages. Please try again later.');
        }
      };

      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    try {
      // Create a new message object
      const newMsg = {
        conversationId: activeConversation.id,
        text: newMessage,
        senderType: 'agent', // Assuming this is an agent sending the message
      };

      // Send the message via API
      const response = await api.post('/chat/messages', newMsg);
      
      // Add the message to the local state
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');

      // Broadcast the message via WebSocket to other users in the conversation
      WebSocketService.sendMessage({
        type: 'chat_message',
        message: response.data
      });
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again later.');
    }
  };

  const selectConversation = (conversation) => {
    setActiveConversation(conversation);
  };

  const handleNewConversation = (conversation) => {
    // Close the start new chat modal
    setShowStartNewChat(false);
    // Fetch updated conversations list to include the new one
    fetchConversations();
    // Select the new conversation
    setActiveConversation(conversation);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'sp-bg-success';
      case 'away': return 'sp-bg-warning';
      case 'offline': return 'sp-bg-gray-500';
      default: return 'sp-bg-gray-500';
    }
  };

  return (
    <div className="sp-chat-page">
      <Navbar />
      <div className="dashboard__layout">
        <Sidebar />
        <div className="sp-chat-container">
          {/* Chat Header */}
          <div className="sp-chat-header">
            <div className="sp-chat-header-content">
              <div className="sp-chat-header-info">
                <h1 className="sp-chat-title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="sp-chat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Live Chat
                </h1>
                <p className="sp-chat-subtitle">Real-time customer support</p>
              </div>
              <div className="sp-chat-header-actions">
                <button 
                  className="btn btn--primary chat-header-action-btn"
                  onClick={() => setShowStartNewChat(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Chat
                </button>
                <div className="sp-agent-status">
                  <div className="sp-status-indicator sp-bg-success"></div>
                  <span className="sp-status-text">Online</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sp-chat-content">
            {/* Sidebar - Conversation List */}
            <div className="sp-chat-sidebar">
              <div className="sp-chat-search">
                <div className="sp-search-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" className="sp-search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    className="sp-search-input"
                    placeholder="Search conversations..."
                  />
                </div>
              </div>
              
              <div className="sp-conversations-list">
                {error && (
                  <div className="error-message">
                    <svg xmlns="http://www.w3.org/2000/svg" className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}
                
                {loading && (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading conversations...</p>
                  </div>
                )}
                
                {!loading && conversations.map(conversation => (
                  <div 
                    key={conversation.id}
                    className={`sp-conversation-item ${activeConversation?.id === conversation.id ? 'active' : ''}`}
                    onClick={() => selectConversation(conversation)}
                  >
                    <div className="sp-conversation-avatar">
                      <div className="sp-avatar-initial">{conversation.avatar || conversation.customerName?.charAt(0)?.toUpperCase() || 'U'}</div>
                      <div className={`sp-status-badge ${getStatusColor(conversation.status)}`}></div>
                    </div>
                    <div className="sp-conversation-info">
                      <div className="sp-conversation-header">
                        <h4 className="sp-conversation-name">{conversation.customerName}</h4>
                        <span className="sp-conversation-time">
                          {new Date(conversation.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="sp-conversation-preview">
                        <p className="sp-conversation-message">{conversation.lastMessage}</p>
                        {conversation.unread > 0 && (
                          <span className="sp-unread-count">{conversation.unread}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="sp-chat-main">
              {activeConversation ? (
                <>
                  <div className="sp-chat-room-header">
                    <div className="sp-chat-contact">
                      <div className="sp-contact-avatar">
                        <div className="sp-avatar-initial">{activeConversation.avatar || activeConversation.customerName?.charAt(0)?.toUpperCase() || 'U'}</div>
                        <div className={`sp-status-badge ${getStatusColor(activeConversation.status)}`}></div>
                      </div>
                      <div className="sp-contact-info">
                        <h3 className="sp-contact-name">{activeConversation.customerName}</h3>
                        <p className="sp-contact-status">{activeConversation.customerEmail}</p>
                      </div>
                    </div>
                    <div className="sp-chat-actions">
                      <button className="sp-action-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" className="sp-action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                      <button className="sp-action-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" className="sp-action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="sp-messages-container">
                    {messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`message-bubble ${message.sender?.type === 'agent' ? 'sent' : 'received'}`}
                      >
                        {message.sender?.type !== 'agent' && (
                          <div className="sp-message-avatar">
                            <div className="sp-avatar-initial">{message.avatar || message.senderName?.charAt(0)?.toUpperCase() || 'U'}</div>
                          </div>
                        )}
                        <div className="sp-message-content">
                          <div className="sp-message-text">{typeof message.text === 'object' && message.text !== null ? (message.text?.text || JSON.stringify(message.text)) : (message.text || '')}</div>
                          <div className="sp-message-time">
                            {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </div>
                        </div>
                        {message.sender?.type === 'agent' && (
                          <div className="sp-message-avatar">
                            <div className="sp-avatar-initial">{message.avatar || message.senderName?.charAt(0)?.toUpperCase() || 'A'}</div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <form className="sp-message-input-form" onSubmit={handleSendMessage}>
                    <div className="sp-input-wrapper">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="sp-message-input"
                        placeholder="Type your message..."
                        disabled={loading}
                      />
                      <button 
                        type="submit" 
                        className="sp-send-button"
                        disabled={!newMessage.trim() || loading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="sp-send-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="sp-empty-chat-state">
                  <div className="sp-empty-chat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="sp-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="sp-empty-chat-title">Select a conversation</h3>
                  <p className="sp-empty-chat-description">
                    Choose a conversation from the list to start chatting with a customer
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal for starting a new chat */}
      {showStartNewChat && (
        <div className="modal">
          <div className="modal__overlay" onClick={() => setShowStartNewChat(false)}></div>
          <div className="modal__content start-chat-modal">
            <div className="modal__header">
              <h3 className="modal__title">Start New Chat</h3>
              <button 
                className="modal__close"
                onClick={() => setShowStartNewChat(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="icon modal__close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal__body">
              <StartNewChat onNewConversation={handleNewConversation} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;