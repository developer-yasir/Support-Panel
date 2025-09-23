import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchTicket();
    fetchComments();
    testApiConnection(); // Test API connection
    
    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        const menu = dropdownRef.current.querySelector('.dropdown__menu');
        if (menu) {
          menu.classList.remove('show');
        }
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tickets/${id}`);
      setTicket(response.data);
    } catch (err) {
      setError('Failed to fetch ticket');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/ticket/${id}`);
      setComments(response.data);
    } catch (err) {
      setError('Failed to fetch comments');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const response = await api.post('/comments', {
        content: newComment,
        ticketId: id
      });
      
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setStatusLoading(true);
      console.log('Updating ticket status to:', newStatus);
      
      // Close dropdown after selection
      if (dropdownRef.current) {
        const menu = dropdownRef.current.querySelector('.dropdown__menu');
        if (menu) {
          menu.classList.remove('show');
        }
      }
      
      const payload = { status: newStatus };
      console.log('Sending PUT request with payload:', payload);
      
      const response = await api.put(`/tickets/${id}`, payload);
      
      console.log('Ticket update response:', response.data);
      setTicket(response.data);
      
      // Show success message
      console.log('Status updated successfully to:', newStatus);
    } catch (err) {
      console.error('Error updating ticket status:', err);
      console.error('Error response:', err.response);
      setError('Failed to update ticket status: ' + (err.response?.data?.message || err.message));
    } finally {
      setStatusLoading(false);
    }
  };

  const handleEscalateTicket = async () => {
    try {
      setStatusLoading(true);
      const response = await api.post(`/tickets/${id}/escalate`);
      setTicket(response.data);
      
      // Show success message
      console.log('Ticket escalated successfully');
    } catch (err) {
      console.error('Error escalating ticket:', err);
      setError('Failed to escalate ticket: ' + (err.response?.data?.message || err.message));
    } finally {
      setStatusLoading(false);
    }
  };

  // Test function to verify API connectivity
  const testApiConnection = async () => {
    try {
      console.log('Testing API connection for ticket:', id);
      const response = await api.get(`/tickets/${id}`);
      console.log('API connection test successful:', response.data);
    } catch (err) {
      console.error('API connection test failed:', err);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open': return 'badge badge-success';
      case 'in_progress': return 'badge badge-warning';
      case 'resolved': return 'badge badge-info';
      case 'closed': return 'badge badge-secondary';
      default: return 'badge badge-secondary';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'low': return 'badge badge-success';
      case 'medium': return 'badge badge-warning';
      case 'high': return 'badge badge-danger';
      case 'urgent': return 'badge badge-danger';
      default: return 'badge badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="ticket-detail">
        <Navbar />
        <div className="container ticket-detail__container">
          <div className="ticket-detail__loading-wrapper">
            <div className="loading-text">Loading ticket details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ticket-detail">
        <Navbar />
        <div className="container ticket-detail__container">
          <div className="alert alert--danger ticket-detail__error">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon alert__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-detail">
      <Navbar />
      <div className="container ticket-detail__container">
        <div className="ticket-detail__header">
          <button
            onClick={() => window.history.back()}
            className="btn btn--outline ticket-detail__back-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="icon ticket-detail__back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        <div className="card ticket-detail__card">
          <div className="card__header ticket-detail-card__header">
            <div className="ticket-detail-card__title-wrapper">
              <h3 className="ticket-detail-card__title">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon ticket-detail-card__title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {ticket?.title}
              </h3>
              <p className="ticket-detail-card__subtitle">Ticket #{ticket?._id?.substring(0, 8)}</p>
            </div>
            <div className="ticket-detail-card__badges">
              <span className={`badge ${getStatusBadgeClass(ticket?.status)}`}>
                {ticket?.status}
              </span>
              <span className={`badge ${getPriorityBadgeClass(ticket?.priority)}`}>
                {ticket?.priority}
              </span>
            </div>
          </div>
          <div className="card__body">
            <div className="ticket-detail__content">
              <div className="ticket-detail__main">
                <div className="ticket-detail__description-header">
                  <h5 className="ticket-detail__section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon ticket-detail__section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Description
                  </h5>
                  {/* Status Change Dropdown */}
                  <div className="dropdown ticket-detail__status-dropdown" ref={dropdownRef}>
                    <button 
                      className="btn btn--outline-primary btn--small dropdown__toggle"
                      type="button"
                      aria-expanded="false"
                      disabled={statusLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        const menu = e.currentTarget.nextElementSibling;
                        if (menu) {
                          menu.classList.toggle('show');
                        }
                      }}
                    >
                      {statusLoading ? (
                        'Updating...'
                      ) : (
                        "Change Status"
                      )}
                    </button>
                    <ul className="dropdown__menu" aria-labelledby="statusDropdown">
                      <li>
                        <button 
                          className="dropdown__item" 
                          onClick={() => handleStatusChange('open')}
                          disabled={ticket?.status === 'open'}
                        >
                          Open
                        </button>
                      </li>
                      <li>
                        <button 
                          className="dropdown__item" 
                          onClick={() => handleStatusChange('in_progress')}
                          disabled={ticket?.status === 'in_progress'}
                        >
                          In Progress
                        </button>
                      </li>
                      <li>
                        <button 
                          className="dropdown__item" 
                          onClick={() => handleStatusChange('resolved')}
                          disabled={ticket?.status === 'resolved'}
                        >
                          Resolved
                        </button>
                      </li>
                      <li>
                        <button 
                          className="dropdown__item" 
                          onClick={() => handleStatusChange('closed')}
                          disabled={ticket?.status === 'closed'}
                        >
                          Closed
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="ticket-detail__description">{ticket?.description}</p>
                
                <h5 className="ticket-detail__section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon ticket-detail__section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Comments ({comments.length})
                </h5>
                <form onSubmit={handleAddComment} className="ticket-detail__comment-form">
                  <div className="form-group ticket-detail__form-group">
                    <textarea
                      rows="4"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="form-control ticket-detail__comment-input"
                      placeholder="Add a comment..."
                    />
                  </div>
                  <div className="ticket-detail__form-actions">
                    <button
                      type="submit"
                      disabled={commentLoading}
                      className="btn btn--primary ticket-detail__comment-btn"
                    >
                      {commentLoading ? (
                        'Adding...'
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon ticket-detail__comment-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Add Comment
                        </>
                      )}
                    </button>
                  </div>
                </form>
                
                <div className="ticket-detail__comments">
                  {comments.length === 0 ? (
                    <div className="empty-state ticket-detail__empty-comments">
                      <div className="empty-state__icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon empty-state__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="empty-state__title">No comments yet</h3>
                      <p className="empty-state__description">Be the first to comment on this ticket.</p>
                    </div>
                  ) : (
                    <div className="ticket-detail__comments-list">
                      {comments.map((comment) => (
                        <div key={comment._id} className="comment-item ticket-detail__comment">
                          <div className="comment-item__header">
                            <div className="comment-item__user">
                              <div className="comment-item__user-avatar" style={{ width: '32px', height: '32px' }}>
                                <span className="comment-item__user-initial">
                                  {comment.createdBy?.name?.charAt(0)?.toUpperCase()}
                                </span>
                              </div>
                              <div className="comment-item__user-info">
                                <h6 className="comment-item__user-name">{comment.createdBy?.name}</h6>
                                <p className="comment-item__user-email">{comment.createdBy?.email}</p>
                              </div>
                            </div>
                            <p className="comment-item__timestamp">
                              {new Date(comment.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <p className="comment-item__content">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="ticket-detail__sidebar">
                <div className="card card--light ticket-detail__info-card">
                  <div className="card__body">
                    <h5 className="ticket-detail__info-title">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon ticket-detail__info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Ticket Details
                    </h5>
                    <div className="ticket-detail__info-section">
                      <p className="ticket-detail__info-label">Created By</p>
                      <div className="ticket-detail__user">
                        <div className="ticket-detail__user-avatar" style={{ width: '24px', height: '24px' }}>
                          <span className="ticket-detail__user-initial">
                            {ticket?.createdBy?.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div className="ticket-detail__user-details">
                          <p className="ticket-detail__user-name">{ticket?.createdBy?.name}</p>
                          <p className="ticket-detail__user-email">{ticket?.createdBy?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="ticket-detail__info-section">
                      <p className="ticket-detail__info-label">Assigned To</p>
                      <div className="ticket-detail__assigned">
                        {ticket?.assignedTo ? (
                          <div className="ticket-detail__user">
                            <div className="ticket-detail__user-avatar" style={{ width: '24px', height: '24px' }}>
                              <span className="ticket-detail__user-initial">
                                {ticket?.assignedTo?.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            <div className="ticket-detail__user-details">
                              <p className="ticket-detail__user-name">{ticket?.assignedTo?.name}</p>
                              <p className="ticket-detail__user-email">{ticket?.assignedTo?.email}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="ticket-detail__unassigned">Unassigned</span>
                        )}
                      </div>
                    </div>
                    {ticket?.dueDate && (
                      <div className="ticket-detail__info-section">
                        <p className="ticket-detail__info-label">Due Date</p>
                        <p className="ticket-detail__due-date">
                          {new Date(ticket.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {ticket?.escalationLevel > 1 && (
                      <div className="ticket-detail__info-section">
                        <p className="ticket-detail__info-label">Escalation Level</p>
                        <p className="ticket-detail__escalation-level">
                          Level {ticket.escalationLevel}
                        </p>
                      </div>
                    )}
                    <div className="ticket-detail__info-section">
                      <p className="ticket-detail__info-label">Created At</p>
                      <p className="ticket-detail__created-at">
                        {new Date(ticket?.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {ticket?.escalationLevel < 3 && (
                      <div className="ticket-detail__info-section">
                        <button 
                          className="btn btn--warning ticket-detail__escalate-btn"
                          onClick={handleEscalateTicket}
                          disabled={statusLoading}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon ticket-detail__escalate-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                          Escalate Ticket
                        </button>
                      </div>
                    )}
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