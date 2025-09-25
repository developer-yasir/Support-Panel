import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userStatus, setUserStatus] = useState('online');
  const messagesEndRef = useRef(null);

  // Mock data for conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        // In a real app, this would come from an API
        const mockConversations = [
          { id: 1, customerName: 'John Doe', customerEmail: 'john.doe@example.com', lastMessage: 'Still having issues with the login', lastMessageTime: '2023-06-15T14:45:00Z', unread: 3, status: 'online', avatar: 'JD' },
          { id: 2, customerName: 'Alice Johnson', customerEmail: 'alice.j@example.com', lastMessage: 'Thanks for your help!', lastMessageTime: '2023-06-15T13:20:00Z', unread: 0, status: 'online', avatar: 'AJ' },
          { id: 3, customerName: 'Mike Brown', customerEmail: 'mike.b@example.com', lastMessage: 'Can you explain step 3 again?', lastMessageTime: '2023-06-15T12:15:00Z', unread: 1, status: 'away', avatar: 'MB' },
          { id: 4, customerName: 'Sarah Davis', customerEmail: 'sarah.d@example.com', lastMessage: 'When will this be fixed?', lastMessageTime: '2023-06-15T11:30:00Z', unread: 0, status: 'offline', avatar: 'SD' },
          { id: 5, customerName: 'Emma Wilson', customerEmail: 'emma.w@example.com', lastMessage: 'Works perfectly now, thank you!', lastMessageTime: '2023-06-15T10:45:00Z', unread: 0, status: 'online', avatar: 'EW' },
        ];
        setConversations(mockConversations);
      } catch (err) {
        setError('Failed to fetch conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Simulate loading messages for a conversation
  useEffect(() => {
    if (activeConversation) {
      const fetchMessages = async () => {
        setLoading(true);
        // In a real app, this would come from an API
        const mockMessages = [
          { id: 1, sender: 'customer', text: 'Hi, I\'m having trouble with the login process.', timestamp: '2023-06-15T10:30:00Z', avatar: 'JD' },
          { id: 2, sender: 'agent', text: 'Hello, I can help you with that. Can you please provide your email address?', timestamp: '2023-06-15T10:32:00Z', avatar: 'AJ' },
          { id: 3, sender: 'customer', text: 'Sure, it\'s john.doe@example.com', timestamp: '2023-06-15T10:33:00Z', avatar: 'JD' },
          { id: 4, sender: 'agent', text: 'Thank you. I see the issue. Your account is locked. I\'ll unlock it for you now.', timestamp: '2023-06-15T10:35:00Z', avatar: 'AJ' },
          { id: 5, sender: 'customer', text: 'Great, thank you! I can log in now.', timestamp: '2023-06-15T10:37:00Z', avatar: 'JD' },
          { id: 6, sender: 'agent', text: 'You\'re welcome. Is there anything else I can help you with today?', timestamp: '2023-06-15T10:38:00Z', avatar: 'AJ' },
        ];
        setMessages(mockMessages);
        setLoading(false);
      };

      fetchMessages();
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
      // In a real app, this would make an API call
      const newMsg = {
        id: messages.length + 1,
        sender: 'agent',
        text: newMessage,
        timestamp: new Date().toISOString(),
        avatar: 'AJ' // Agent's avatar
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message');
    }
  };

  const selectConversation = (conversation) => {
    setActiveConversation(conversation);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'away': return 'bg-warning';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="chat">
      <Navbar />
      <div className="dashboard__layout">
        <Sidebar />
        <div className="container dashboard__container">
          <div className="dashboard__header">
            <div className="dashboard-header__content">
              <div className="dashboard-header__title-wrapper">
                <h1 className="dashboard-header__title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="28" height="28">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Live Chat
                </h1>
                <p className="dashboard-header__subtitle">Manage customer conversations in real-time</p>
              </div>
              <div className="dashboard-header__actions">
                <div className="chat-status">
                  <div className="status-indicator">
                    <div className={`status-indicator__dot ${getStatusColor(userStatus)}`}></div>
                    <span className="status-indicator__text">
                      {userStatus.charAt(0).toUpperCase() + userStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="chat__container">
            {/* Conversations List */}
            <div className="chat__sidebar">
              <div className="chat__search">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search conversations..."
                  />
                </div>
              </div>
              
              <div className="chat__conversations-list">
                {error && (
                  <div className="alert alert--danger">
                    <div className="alert__icon">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    {error}
                  </div>
                )}
                
                {loading ? (
                  <div className="chat__loading">
                    <div className="spinner spinner--primary"></div>
                    <p>Loading conversations...</p>
                  </div>
                ) : (
                  conversations.map(conversation => (
                    <div 
                      key={conversation.id}
                      className={`chat__conversation ${activeConversation?.id === conversation.id ? 'chat__conversation--active' : ''}`}
                      onClick={() => selectConversation(conversation)}
                    >
                      <div className="conversation__avatar">
                        <div className="avatar">{conversation.avatar}</div>
                        <div className={`status-indicator status-indicator--small ${getStatusColor(conversation.status)}`}></div>
                      </div>
                      <div className="conversation__info">
                        <div className="conversation__header">
                          <h4 className="conversation__name">{conversation.customerName}</h4>
                          <span className="conversation__time">
                            {new Date(conversation.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="conversation__preview">
                          <p className="conversation__last-message">{conversation.lastMessage}</p>
                          {conversation.unread > 0 && (
                            <span className="badge badge--danger conversation__unread">{conversation.unread}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            {activeConversation ? (
              <div className="chat__main">
                <div className="chat__header">
                  <div className="chat__contact">
                    <div className="contact__avatar">
                      <div className="avatar">{activeConversation.avatar}</div>
                      <div className={`status-indicator status-indicator--small ${getStatusColor(activeConversation.status)}`}></div>
                    </div>
                    <div className="contact__info">
                      <h3 className="contact__name">{activeConversation.customerName}</h3>
                      <p className="contact__email">{activeConversation.customerEmail}</p>
                    </div>
                  </div>
                  <div className="chat__actions">
                    <button className="btn btn--outline btn--small">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </button>
                    <button className="btn btn--outline btn--small">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </button>
                    <button className="btn btn--outline btn--small">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="chat__messages">
                  {messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`message ${message.sender === 'agent' ? 'message--sent' : 'message--received'}`}
                    >
                      <div className="message__avatar">
                        <div className="avatar">{message.avatar}</div>
                      </div>
                      <div className="message__content">
                        <div className="message__text">
                          {message.text}
                        </div>
                        <div className="message__time">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form className="chat__input-form" onSubmit={handleSendMessage}>
                  <div className="chat__input-wrapper">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="form-control chat__input"
                      placeholder="Type your message..."
                      disabled={loading}
                    />
                    <button 
                      type="submit" 
                      className="btn btn--primary chat__send-btn"
                      disabled={!newMessage.trim() || loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="chat__empty-state">
                <div className="empty-state">
                  <div className="empty-state__icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" className="empty-state__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="empty-state__title">No conversation selected</h3>
                  <p className="empty-state__description">
                    Select a conversation from the list to start chatting with a customer
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;