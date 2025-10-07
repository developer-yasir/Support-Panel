import { useState, useEffect } from 'react';
import { api } from '../services/api';
import './StartNewChat.css';

const StartNewChat = ({ onNewConversation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Fetch all users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleUserSelect = async (user) => {
    try {
      // Create a new conversation with the selected user
      const response = await api.post('/chat/conversations', {
        subject: `Chat with ${user.name}`,
        targetUserId: user._id,
        message: `Hello ${user.name}, I'm starting a new chat with you.` // Initial message
      });

      // Once conversation is created, update the parent component
      onNewConversation(response.data);
      setSearchTerm('');
      setFilteredUsers([]);
    } catch (err) {
      console.error('Failed to start chat:', err);
      setError('Failed to start chat. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="start-chat-component">
        <div className="loading-placeholder">
          <div className="spinner spinner--primary"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="start-chat-component">
      <div className="start-chat-header">
        <h3 className="start-chat-title">Start New Chat</h3>
        <div className="search-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search for users to chat with..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="start-chat-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {isSearching && filteredUsers.length > 0 && (
        <div className="search-results">
          <div className="users-list">
            {filteredUsers.map(user => (
              <div 
                key={user._id} 
                className="user-item"
                onClick={() => handleUserSelect(user)}
              >
                <div className="user-avatar">
                  <div className="avatar-initial">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
                <div className="user-status">
                  <div className={`status-indicator ${user.isActive ? 'bg-success' : 'bg-gray-500'}`}></div>
                  <span className="status-text">{user.isActive ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isSearching && filteredUsers.length === 0 && searchTerm && (
        <div className="no-results">
          <div className="no-results-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p>No users found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default StartNewChat;