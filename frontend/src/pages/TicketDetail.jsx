import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyText, setReplyText] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [newAttachment, setNewAttachment] = useState(null);

  // Mock ticket data
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        // In a real app, this would come from an API
        const mockTicket = {
          id: 'TK-1001',
          title: 'Cannot login to account',
          description: 'I am unable to log into my account using my credentials. I keep getting an "Invalid credentials" error message.',
          status: 'open',
          priority: 'high',
          customer: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            company: 'Tech Solutions Inc',
            avatar: 'JD'
          },
          agent: {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            avatar: 'JS'
          },
          createdAt: '2023-06-15T10:30:00Z',
          updatedAt: '2023-06-15T14:45:00Z',
          tags: ['login', 'account'],
          organization: 'Tech Solutions Inc',
          type: 'technical',
          sla: '4 hours',
          comments: [
            {
              id: 1,
              user: 'John Doe',
              role: 'customer',
              text: 'I am unable to log into my account using my credentials. I keep getting an "Invalid credentials" error message.',
              avatar: 'JD',
              timestamp: '2023-06-15T10:30:00Z',
              type: 'comment'
            },
            {
              id: 2,
              user: 'Jane Smith',
              role: 'agent',
              text: 'Thank you for reporting this issue. I will look into this right away.',
              avatar: 'JS',
              timestamp: '2023-06-15T11:15:00Z',
              type: 'comment'
            },
            {
              id: 3,
              user: 'Jane Smith',
              role: 'agent',
              text: 'I reset your password. Please check your email for a new temporary password.',
              avatar: 'JS',
              timestamp: '2023-06-15T14:45:00Z',
              type: 'comment'
            }
          ],
          internalNotes: [
            {
              id: 1,
              user: 'Jane Smith',
              text: 'Customer reported login issues. Checked account, seems to be a password issue.',
              timestamp: '2023-06-15T11:20:00Z',
              avatar: 'JS'
            }
          ],
          attachments: [
            {
              id: 1,
              name: 'error_screenshot.png',
              size: '2.4 MB',
              type: 'image',
              url: '#'
            }
          ]
        };
        setTicket(mockTicket);
        setSelectedStatus(mockTicket.status);
        setSelectedAgent(mockTicket.agent?.name || '');
      } catch (err) {
        setError('Failed to fetch ticket details');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      // In a real app, this would make an API call
      const newComment = {
        id: ticket.comments.length + 1,
        user: 'Jane Smith', // Current agent
        role: 'agent',
        text: replyText,
        avatar: 'JS',
        timestamp: new Date().toISOString(),
        type: 'comment'
      };

      setTicket(prev => ({
        ...prev,
        comments: [...prev.comments, newComment]
      }));
      setReplyText('');
    } catch (err) {
      setError('Failed to add reply');
    }
  };

  const handleAddInternalNote = async (e) => {
    e.preventDefault();
    if (!internalNote.trim()) return;

    try {
      // In a real app, this would make an API call
      const newNote = {
        id: ticket.internalNotes.length + 1,
        user: 'Jane Smith', // Current agent
        text: internalNote,
        timestamp: new Date().toISOString(),
        avatar: 'JS'
      };

      setTicket(prev => ({
        ...prev,
        internalNotes: [...prev.internalNotes, newNote]
      }));
      setInternalNote('');
    } catch (err) {
      setError('Failed to add internal note');
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus) return;

    try {
      // In a real app, this would make an API call
      setTicket(prev => ({
        ...prev,
        status: selectedStatus
      }));
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleAssignAgent = async () => {
    if (!selectedAgent) return;

    try {
      // In a real app, this would make an API call
      setTicket(prev => ({
        ...prev,
        agent: {
          name: selectedAgent,
          email: selectedAgent.toLowerCase().replace(' ', '.') + '@example.com',
          avatar: selectedAgent.split(' ').map(n => n[0]).join('').toUpperCase()
        }
      }));
    } catch (err) {
      setError('Failed to assign agent');
    }
  };

  if (loading) {
    return (
      <div className="ticket-detail">
        <Navbar />
        <div className="dashboard__layout">
          <Sidebar />
          <div className="container ticket-detail__container">
            <div className="ticket-detail__loading">
              <div className="spinner spinner--primary spinner--centered"></div>
              <p>Loading ticket details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ticket-detail">
        <Navbar />
        <div className="dashboard__layout">
          <Sidebar />
          <div className="container ticket-detail__container">
            <div className="ticket-detail__error">
              <div className="alert alert--danger">
                <div className="alert__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                {error}
              </div>
              <button className="btn btn--primary" onClick={() => navigate('/tickets')}>
                Back to Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-detail">
        <Navbar />
        <div className="dashboard__layout">
          <Sidebar />
          <div className="container ticket-detail__container">
            <div className="ticket-detail__error">
              <div className="alert alert--danger">
                <div className="alert__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Ticket not found
              </div>
              <button className="btn btn--primary" onClick={() => navigate('/tickets')}>
                Back to Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open': return 'badge badge-success';
      case 'in_progress': return 'badge badge-warning';
      case 'resolved': return 'badge badge-info';
      case 'closed': return 'badge badge-secondary';
      case 'pending': return 'badge badge-primary';
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

  return (
    <div className="ticket-detail">
      <Navbar />
      <div className="dashboard__layout">
        <Sidebar />
        <div className="container ticket-detail__container">
          <div className="ticket-detail__header">
            <button 
              onClick={() => navigate('/tickets')}
              className="btn btn--secondary btn--small ticket-detail__back-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="ticket-detail__back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Tickets
            </button>
          </div>

          <div className="ticket-detail__card">
            <div className="ticket-detail-card__header">
              <div className="ticket-detail-card__title-wrapper">
                <h1 className="ticket-detail-card__title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="ticket-detail-card__title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {ticket.id}: {ticket.title}
                </h1>
                <p className="ticket-detail-card__subtitle">
                  Created on {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="ticket-detail-card__badges">
                <span className={getStatusBadgeClass(ticket.status)}>
                  {ticket.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className={getPriorityBadgeClass(ticket.priority)}>
                  {ticket.priority.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="ticket-detail__content">
              <div className="ticket-detail__main">
                {/* Ticket Description */}
                <div className="ticket-detail__section">
                  <h3 className="ticket-detail__section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" className="ticket-detail__section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Description
                  </h3>
                  <div className="card">
                    <div className="card__body">
                      <p className="ticket-detail__description">{ticket.description}</p>
                    </div>
                  </div>
                </div>

                {/* Comments */}
                <div className="ticket-detail__section">
                  <h3 className="ticket-detail__section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" className="ticket-detail__section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Comments ({ticket.comments.length})
                  </h3>
                  <div className="ticket-detail__comments">
                    {ticket.comments.map(comment => (
                      <div key={comment.id} className="ticket-detail__comment">
                        <div className="comment-item__header">
                          <div className="comment-item__user">
                            <div className="ticket-detail__user-avatar">{comment.avatar}</div>
                            <div className="comment-item__user-info">
                              <p className="comment-item__user-name">{comment.user}</p>
                              <p className="comment-item__user-email">{comment.role === 'customer' ? 'Customer' : 'Agent'}</p>
                            </div>
                          </div>
                          <p className="comment-item__timestamp">
                            {new Date(comment.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p className="comment-item__content">{comment.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reply Form */}
                  <div className="ticket-detail__comment-form">
                    <form onSubmit={handleReply}>
                      <div className="ticket-detail__form-group">
                        <label htmlFor="reply" className="form-label">Add a comment</label>
                        <textarea
                          id="reply"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="form-control"
                          rows="3"
                          placeholder="Type your reply here..."
                        ></textarea>
                      </div>
                      <div className="ticket-detail__form-actions">
                        <button type="submit" className="btn btn--primary ticket-detail__comment-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" className="ticket-detail__comment-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Post Comment
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="ticket-detail__sidebar">
                {/* Ticket Info */}
                <div className="ticket-detail__info-card">
                  <h3 className="ticket-detail__info-title">
                    <svg xmlns="http://www.w3.org/2000/svg" className="ticket-detail__info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ticket Info
                  </h3>
                  <div className="ticket-detail__info-section">
                    <p className="ticket-detail__info-label">Customer</p>
                    <div className="ticket-detail__user">
                      <div className="ticket-detail__user-avatar">{ticket.customer.avatar}</div>
                      <div className="ticket-detail__user-details">
                        <p className="ticket-detail__user-name">{ticket.customer.name}</p>
                        <p className="ticket-detail__user-email">{ticket.customer.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ticket-detail__info-section">
                    <p className="ticket-detail__info-label">Organization</p>
                    <p className="ticket-detail__org">{ticket.organization}</p>
                  </div>
                  
                  <div className="ticket-detail__info-section">
                    <p className="ticket-detail__info-label">Created</p>
                    <p className="ticket-detail__created-at">{new Date(ticket.createdAt).toLocaleString()}</p>
                  </div>
                  
                  <div className="ticket-detail__info-section">
                    <p className="ticket-detail__info-label">Updated</p>
                    <p className="ticket-detail__updated-at">{new Date(ticket.updatedAt).toLocaleString()}</p>
                  </div>
                  
                  <div className="ticket-detail__info-section">
                    <p className="ticket-detail__info-label">Tags</p>
                    <div className="ticket-detail__tags">
                      {ticket.tags.map(tag => (
                        <span key={tag} className="badge badge--secondary" style={{ marginRight: '0.25rem' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Assign & Status */}
                <div className="ticket-detail__info-card">
                  <h3 className="ticket-detail__info-title">
                    <svg xmlns="http://www.w3.org/2000/svg" className="ticket-detail__info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Actions
                  </h3>
                  
                  <div className="ticket-detail__info-section">
                    <p className="ticket-detail__info-label">Status</p>
                    <div className="ticket-detail__status-dropdown">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="form-control form-control--select"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button 
                        onClick={handleUpdateStatus}
                        className="btn btn--primary btn--small"
                        style={{ marginTop: '0.5rem', width: '100%' }}
                      >
                        Update Status
                      </button>
                    </div>
                  </div>
                  
                  <div className="ticket-detail__info-section">
                    <p className="ticket-detail__info-label">Assign to Agent</p>
                    <div className="ticket-detail__status-dropdown">
                      <select
                        value={selectedAgent}
                        onChange={(e) => setSelectedAgent(e.target.value)}
                        className="form-control form-control--select"
                      >
                        <option value="">Unassigned</option>
                        <option value="Jane Smith">Jane Smith</option>
                        <option value="Bob Wilson">Bob Wilson</option>
                        <option value="John Doe">John Doe</option>
                        <option value="Alice Johnson">Alice Johnson</option>
                      </select>
                      <button 
                        onClick={handleAssignAgent}
                        className="btn btn--primary btn--small"
                        style={{ marginTop: '0.5rem', width: '100%' }}
                      >
                        Assign Agent
                      </button>
                    </div>
                  </div>
                  
                  <div className="ticket-detail__info-section">
                    <p className="ticket-detail__info-label">Internal Notes</p>
                    <div className="ticket-detail__internal-notes">
                      {ticket.internalNotes.map(note => (
                        <div key={note.id} className="ticket-detail__comment">
                          <div className="comment-item__header">
                            <div className="comment-item__user">
                              <div className="ticket-detail__user-avatar">{note.avatar}</div>
                              <div className="comment-item__user-info">
                                <p className="comment-item__user-name">{note.user}</p>
                              </div>
                            </div>
                            <p className="comment-item__timestamp">
                              {new Date(note.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <p className="comment-item__content">{note.text}</p>
                        </div>
                      ))}
                    </div>
                    
                    <form onSubmit={handleAddInternalNote} style={{ marginTop: '1rem' }}>
                      <div className="ticket-detail__form-group">
                        <textarea
                          value={internalNote}
                          onChange={(e) => setInternalNote(e.target.value)}
                          className="form-control"
                          rows="2"
                          placeholder="Add internal note..."
                        ></textarea>
                      </div>
                      <button type="submit" className="btn btn--outline btn--small" style={{ width: '100%' }}>
                        Add Internal Note
                      </button>
                    </form>
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