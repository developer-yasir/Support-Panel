import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateData, setUpdateData] = useState({});

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await api.get(`/tickets/${id}`);
        setTicket(response.data);
        setUpdateData({
          status: response.data.status,
          priority: response.data.priority,
          escalationLevel: response.data.escalationLevel
        });
      } catch (error) {
        console.error('Error fetching ticket:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await api.get(`/comments/ticket/${id}`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchTicket();
    fetchComments();
  }, [id]);

  const handleUpdateTicket = async () => {
    setUpdating(true);
    try {
      const response = await api.put(`/tickets/${id}`, updateData);
      setTicket(response.data);
    } catch (error) {
      console.error('Error updating ticket:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/comments', {
        content: commentText,
        ticket: id
      });
      setComments([...comments, response.data]);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="dashboard__layout">
          <Sidebar />
          <div className="container dashboard__container">
            <div className="loading-placeholder">
              <div className="spinner spinner--primary"></div>
              <p>Loading ticket details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="dashboard__layout">
          <Sidebar />
          <div className="container dashboard__container">
            <div className="card">
              <div className="card__body">
                <div className="empty-state">
                  <h3 className="empty-state__title">Ticket not found</h3>
                  <p className="empty-state__description">The ticket you're looking for doesn't exist.</p>
                  <button className="btn btn--primary" onClick={() => navigate('/tickets')}>
                    Back to Tickets
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard__layout">
        <Sidebar />
        <div className="container dashboard__container">
          <div className="dashboard__header">
            <div className="dashboard-header__content">
              <div className="dashboard-header__title-wrapper">
                <h1 className="dashboard-header__title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="28" height="28">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ticket #{ticket.id || id}
                </h1>
                <p className="dashboard-header__subtitle">{ticket.title}</p>
              </div>
              <div className="dashboard-header__actions">
                <button
                  onClick={() => navigate('/tickets')}
                  className="btn btn--outline"
                >
                  Back to Tickets
                </button>
              </div>
            </div>
          </div>

          <div className="ticket-detail-grid">
            <div className="ticket-detail-main">
              <div className="card">
                <div className="card__body">
                  <div className="ticket-detail-header">
                    <div className="ticket-detail-id">
                      <span className="ticket-status-badge ticket-status-badge--{ticket.status}">
                        {ticket.status?.replace('_', ' ')?.toUpperCase()}
                      </span>
                      <h2 className="ticket-detail-title">{ticket.title}</h2>
                      <div className="ticket-detail-priority">
                        <span className={`ticket-priority-badge ticket-priority-badge--${ticket.priority}`}>
                          {ticket.priority?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="ticket-detail-actions">
                      <button className="btn btn--outline btn--small">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        Share
                      </button>
                      <button className="btn btn--outline btn--small">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        Bookmark
                      </button>
                    </div>
                  </div>

                  <div className="ticket-detail-content">
                    <p className="ticket-detail-description">{ticket.description}</p>
                    
                    <div className="ticket-detail-meta">
                      <div className="ticket-meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" className="ticket-meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="ticket-meta-label">Created by:</span>
                        <span className="ticket-meta-value">{ticket.createdBy?.name || 'Unknown'}</span>
                      </div>
                      
                      <div className="ticket-meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" className="ticket-meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="ticket-meta-label">Assigned to:</span>
                        <span className="ticket-meta-value">{ticket.assignedTo?.name || 'Unassigned'}</span>
                      </div>
                      
                      <div className="ticket-meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" className="ticket-meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="ticket-meta-label">Created:</span>
                        <span className="ticket-meta-value">{formatDate(ticket.createdAt)}</span>
                      </div>
                      
                      <div className="ticket-meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" className="ticket-meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="ticket-meta-label">Updated:</span>
                        <span className="ticket-meta-value">{formatDate(ticket.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="card">
                <div className="card__header">
                  <h3 className="card__title">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Comments ({comments.length})
                  </h3>
                </div>
                
                <div className="card__body">
                  <div className="comments-list">
                    {comments.map(comment => (
                      <div key={comment._id} className="comment-item">
                        <div className="comment-header">
                          <div className="comment-author">
                            <div className="comment-avatar">
                              <span className="comment-initial">
                                {comment.createdBy?.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div className="comment-author-info">
                              <span className="comment-author-name">{comment.createdBy?.name || 'Unknown'}</span>
                              <span className="comment-date">{formatDate(comment.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="comment-content">
                          {comment.content}
                        </div>
                      </div>
                    ))}
                    
                    {comments.length === 0 && (
                      <div className="empty-comments">
                        <p>No comments yet. Be the first to add a comment.</p>
                      </div>
                    )}
                  </div>
                  
                  <form onSubmit={handleAddComment} className="comment-form">
                    <div className="form-group">
                      <label htmlFor="commentText" className="form-label">Add a comment</label>
                      <textarea
                        id="commentText"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="form-control"
                        rows="3"
                        placeholder="Type your comment here..."
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn--primary">
                      Add Comment
                    </button>
                  </form>
                </div>
              </div>
            </div>
            
            <div className="ticket-detail-sidebar">
              <div className="card">
                <div className="card__header">
                  <h3 className="card__title">Update Ticket</h3>
                </div>
                
                <div className="card__body">
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      value={updateData.status}
                      onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                      className="form-control form-control--select"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select
                      value={updateData.priority}
                      onChange={(e) => setUpdateData({...updateData, priority: e.target.value})}
                      className="form-control form-control--select"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Escalation Level</label>
                    <select
                      value={updateData.escalationLevel}
                      onChange={(e) => setUpdateData({...updateData, escalationLevel: parseInt(e.target.value)})}
                      className="form-control form-control--select"
                    >
                      <option value={1}>Level 1</option>
                      <option value={2}>Level 2</option>
                      <option value={3}>Level 3</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={handleUpdateTicket}
                    disabled={updating}
                    className="btn btn--primary w-100"
                  >
                    {updating ? 'Updating...' : 'Update Ticket'}
                  </button>
                </div>
              </div>
              
              <div className="card">
                <div className="card__header">
                  <h3 className="card__title">Ticket Details</h3>
                </div>
                
                <div className="card__body">
                  <div className="ticket-details-list">
                    <div className="ticket-detail-item">
                      <span className="ticket-detail-label">Ticket ID</span>
                      <span className="ticket-detail-value">#{ticket.id || id}</span>
                    </div>
                    
                    <div className="ticket-detail-item">
                      <span className="ticket-detail-label">Priority</span>
                      <span className={`ticket-priority-badge ticket-priority-badge--${ticket.priority}`}>
                        {ticket.priority?.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="ticket-detail-item">
                      <span className="ticket-detail-label">Status</span>
                      <span className={`ticket-status-badge ticket-status-badge--${ticket.status}`}>
                        {ticket.status?.replace('_', ' ')?.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="ticket-detail-item">
                      <span className="ticket-detail-label">Escalation Level</span>
                      <span className="ticket-detail-value">Level {ticket.escalationLevel}</span>
                    </div>
                    
                    <div className="ticket-detail-item">
                      <span className="ticket-detail-label">Created</span>
                      <span className="ticket-detail-value">{formatDate(ticket.createdAt)}</span>
                    </div>
                    
                    <div className="ticket-detail-item">
                      <span className="ticket-detail-label">Updated</span>
                      <span className="ticket-detail-value">{formatDate(ticket.updatedAt)}</span>
                    </div>
                  </div>
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