import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/freshdesk-styles.css';



const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        // Fetch ticket from the backend API
        const response = await api.get(`/tickets/${id}`);
        setTicket(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching ticket:', error);
        setError('Ticket not found');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]); // Only run when the id parameter changes

  // Get status and priority colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-300';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'high': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Format time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="freshdesk-dashboard">
        <Navbar />
        <div className="freshdesk-layout">
          <Sidebar />
          <div className="freshdesk-main-content">
            <div className="freshdesk-loading">
              <div className="freshdesk-spinner"></div>
              <p>Loading ticket details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="freshdesk-dashboard">
        <Navbar />
        <div className="freshdesk-layout">
          <Sidebar />
          <div className="freshdesk-main-content">
            <div className="freshdesk-empty-state">
              <svg className="freshdesk-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3>Ticket Not Found</h3>
              <p>{error}</p>
              <button 
                className="freshdesk-new-ticket-btn" 
                style={{ marginTop: '16px' }}
                onClick={() => navigate('/tickets')}
              >
                Back to Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="freshdesk-dashboard">
      <Navbar />
      <div className="freshdesk-layout">
        <Sidebar />
        
        <div className="freshdesk-content" style={{ display: 'block' }}>
          {/* Ticket Header */}
          <div className="freshdesk-header">
            <div className="freshdesk-header-content">
              <div className="freshdesk-ticket-header">
                <div className="freshdesk-ticket-id">#{ticket.ticketId || ticket._id || ticket.id}</div>
                <h1 className="freshdesk-ticket-title">{ticket.title || ticket.subject}</h1>
              </div>
              
              <div className="freshdesk-header-actions">
                <button 
                  className="freshdesk-new-ticket-btn"
                  onClick={() => navigate('/tickets')}
                >
                  <svg className="freshdesk-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Tickets
                </button>
              </div>
            </div>
          </div>
          
          <div className="freshdesk-main-content" style={{ padding: '24px' }}>
            <div className="freshdesk-ticket-detail-container">
              {/* Ticket Overview */}
              <div className="freshdesk-ticket-overview">
                <div className="freshdesk-ticket-header-info">
                  <div className="freshdesk-ticket-status-priority">
                    <span className={`freshdesk-status-badge ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`freshdesk-priority-badge ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="freshdesk-ticket-timestamps">
                    <div className="freshdesk-timestamp">
                      <span className="freshdesk-timestamp-label">Created:</span>
                      <span className="freshdesk-timestamp-value">{formatDate(ticket.createdAt)}</span>
                    </div>
                    <div className="freshdesk-timestamp">
                      <span className="freshdesk-timestamp-label">Updated:</span>
                      <span className="freshdesk-timestamp-value">{getTimeAgo(ticket.updatedAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="freshdesk-ticket-description">
                  <h3>Description</h3>
                  <p>{ticket.description}</p>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="freshdesk-ticket-main">
                {/* Requester Info */}
                <div className="freshdesk-ticket-section">
                  <h3 className="freshdesk-ticket-section-title">Requester Info</h3>
                  <div className="freshdesk-requester-details">
                    <div className="freshdesk-requester-field">
                      <label>User ID</label>
                      <div>{ticket.createdBy || 'N/A'}</div>
                    </div>
                    <div className="freshdesk-requester-field">
                      <label>Ticket Title</label>
                      <div>{ticket.title || 'N/A'}</div>
                    </div>
                    <div className="freshdesk-requester-field">
                      <label>Description</label>
                      <div>{ticket.description || 'N/A'}</div>
                    </div>
                  </div>
                </div>
                
                {/* Ticket Properties */}
                <div className="freshdesk-ticket-section">
                  <h3 className="freshdesk-ticket-section-title">Properties</h3>
                  <div className="freshdesk-properties">
                    <div className="freshdesk-property">
                      <label>Ticket ID</label>
                      <div>{ticket.ticketId || ticket._id || ticket.id}</div>
                    </div>
                    <div className="freshdesk-property">
                      <label>Priority</label>
                      <div>{ticket.priority || 'N/A'}</div>
                    </div>
                    <div className="freshdesk-property">
                      <label>Status</label>
                      <div>{ticket.status || 'N/A'}</div>
                    </div>
                    <div className="freshdesk-property">
                      <label>Escalation Level</label>
                      <div>{ticket.escalationLevel || 1}</div>
                    </div>
                    {ticket.assignedTo && (
                      <div className="freshdesk-property">
                        <label>Assigned To</label>
                        <div>Agent ID: {ticket.assignedTo}</div>
                      </div>
                    )}
                    {ticket.dueDate && (
                      <div className="freshdesk-property">
                        <label>Due Date</label>
                        <div>{new Date(ticket.dueDate).toLocaleDateString()}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Description */}
                <div className="freshdesk-ticket-section">
                  <h3 className="freshdesk-ticket-section-title">Description</h3>
                  <div className="freshdesk-ticket-description-content">
                    <p>{ticket.description}</p>
                  </div>
                </div>
                
                {/* Comments Section */}
                <div className="freshdesk-ticket-section">
                  <h3 className="freshdesk-ticket-section-title">Comments</h3>
                  <div className="freshdesk-comments-list">
                    <p className="freshdesk-empty-comments">No comments yet. Be the first to add a comment.</p>
                  </div>
                  
                  <div className="freshdesk-reply-form">
                    <textarea 
                      placeholder="Add a comment..." 
                      className="freshdesk-reply-textarea"
                    ></textarea>
                    <div className="freshdesk-reply-actions">
                      <button className="freshdesk-reply-btn freshdesk-reply-btn--primary">Add Comment</button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sidebar with actions */}
              <div className="freshdesk-ticket-sidebar">
                <div className="freshdesk-ticket-actions">
                  <h4 className="freshdesk-ticket-sidebar-title">Actions</h4>
                  
                  <div className="freshdesk-ticket-action-group">
                    <label className="freshdesk-ticket-action-label">Status</label>
                    <select className="freshdesk-filter-select">
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  
                  <div className="freshdesk-ticket-action-group">
                    <label className="freshdesk-ticket-action-label">Priority</label>
                    <select className="freshdesk-filter-select">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div className="freshdesk-ticket-action-group">
                    <label className="freshdesk-ticket-action-label">Assignee</label>
                    <select className="freshdesk-filter-select">
                      <option value="">Unassigned</option>
                      <option value="sarah">Sarah Johnson</option>
                      <option value="alex">Alex Chen</option>
                      <option value="david">David Kim</option>
                    </select>
                  </div>
                  
                  <div className="freshdesk-ticket-action-group">
                    <label className="freshdesk-ticket-action-label">Add Tags</label>
                    <input 
                      type="text" 
                      className="freshdesk-filter-input"
                      placeholder="Add tags..." 
                    />
                  </div>
                  
                  <button className="freshdesk-new-ticket-btn" style={{ width: '100%', marginTop: '16px' }}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;