import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const TicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [ticketProperties, setTicketProperties] = useState({});
  const [agents, setAgents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // Added state for showing delete confirmation modal
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Initialize with sample ticket data for now
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        
        // First, try to fetch from the backend API
        try {
          const ticketResponse = await api.get(`/tickets/${ticketId}`);
          const ticketData = ticketResponse.data;
          
          // Now fetch comments for this ticket
          const commentsResponse = await api.get(`/comments/ticket/${ticketData._id}`);
          
          // Combine ticket data with comments
          setTicket({
            ...ticketData,
            comments: commentsResponse.data
          });
          setTicketProperties(ticketData);
        } catch (apiError) {
          console.error('API fetch failed, using sample data:', apiError);
          
          // Fallback to sample data
          const sampleTicket = {
            _id: ticketId,
            ticketId: ticketId.startsWith('TK-') ? ticketId : `TK-${ticketId}`,
            title: 'Email delivery issue with customer notifications',
            description: `Customer is experiencing issues with email notifications not being delivered properly.\n\nSteps to reproduce:\n1. Customer submits a support request\n2. System sends notification email\n3. Customer doesn't receive the email\n\nAdditional notes: This appears to be happening only for customers using Gmail.`,
            status: 'open',
            priority: 'high',
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            createdBy: {
              name: 'Sarah Johnson',
              email: 'sarah.j@example.com',
              company: 'Tech Innovations Inc.',
              phone: '+1 (555) 123-4567'
            },
            assignee: {
              name: 'Michael Chen',
              email: 'michael.chen@support.com'
            },
            requesterId: 'user1',
            assigneeId: 'agent1',
            comments: [
              {
                _id: 'comment1',
                author: {
                  name: 'Michael Chen',
                  avatar: 'MC'
                },
                content: 'Hi Sarah, I\'m looking into this issue. Can you confirm if you\'re seeing any bounce-back messages in your email logs?',
                createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                isInternal: false
              },
              {
                _id: 'comment2',
                author: {
                  name: 'Sarah Johnson',
                  avatar: 'SJ'
                },
                content: 'Yes, I can see some bounce-back messages. They seem to indicate a spam filter issue.',
                createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
                isInternal: false
              },
              {
                _id: 'comment3',
                author: {
                  name: 'David Wilson',
                  avatar: 'DW'
                },
                content: 'Internal note: Checking the mail server configuration for possible issues.',
                createdAt: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
                isInternal: true
              }
            ]
          };
          setTicket(sampleTicket);
          setTicketProperties(sampleTicket);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching ticket:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAgents = async () => {
      try {
        // Try to fetch agents using the new endpoint
        const response = await api.get('/users/agents');
        setAgents(response.data);
      } catch (error) {
        console.error('Error fetching agents:', error);
        
        // If user doesn't have permission to get agents, use fallback
        if (error.response?.status === 403) {
          console.warn('User does not have permission to fetch agents list');
        } else {
          // For other errors, show fallback agents
          setAgents([
            { _id: 'agent1', name: 'Michael Chen', email: 'michael.chen@support.com' },
            { _id: 'agent2', name: 'David Wilson', email: 'david.w@support.com' },
            { _id: 'agent3', name: 'Emily Rodriguez', email: 'emily.r@support.com' }
          ]);
        }
      }
    };

    fetchTicketDetails();
    fetchAgents();
  }, [ticketId]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setReplyLoading(true);
    try {
      // Make API call to add comment
      const response = await api.post(`/comments`, {
        ticketId: ticket._id,
        content: replyText,
        isInternal: false
      });

      // Add the new comment to the ticket's comments in state
      setTicket(prev => ({
        ...prev,
        comments: [...(prev.comments || []), response.data]
      }));

      // Clear the reply text
      setReplyText('');
    } catch (err) {
      console.error('Error adding reply:', err);
      // Show error to user
      alert('Failed to add reply: ' + (err.response?.data?.message || err.message));
    } finally {
      setReplyLoading(false);
    }
  };

  const handlePropertyChange = async (field, value) => {
    try {
      // In a real implementation, update the backend
      const response = await api.put(`/tickets/${ticket._id}`, {
        [field]: value
      });
      
      setTicketProperties(prev => ({
        ...prev,
        [field]: value
      }));
      
      // Update the main ticket object too
      setTicket(prev => ({
        ...prev,
        [field]: value
      }));
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
    }
  };

  const handleStatusChange = (newStatus) => {
    handlePropertyChange('status', newStatus);
  };

  const handlePriorityChange = (newPriority) => {
    handlePropertyChange('priority', newPriority);
  };

  const handleAssigneeChange = (agentId) => {
    handlePropertyChange('assigneeId', agentId);
  };

  const handleDeleteTicket = async () => {
    if (!ticket?._id) return;

    try {
      await api.delete(`/tickets/${ticket._id}`);
      navigate('/tickets'); // Redirect to tickets list after deletion
    } catch (err) {
      console.error('Error deleting ticket:', err);
      alert('Failed to delete ticket: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="freshdesk-ticket-detail-page">
        <Navbar />
        <div className="freshdesk-layout">
          <Sidebar />
          <div className="freshdesk-ticket-detail-content">
            <div className="freshdesk-ticket-detail-loading">
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
      <div className="freshdesk-ticket-detail-page">
        <Navbar />
        <div className="freshdesk-layout">
          <Sidebar />
          <div className="freshdesk-ticket-detail-content">
            <div className="freshdesk-ticket-detail-error">
              <h3>Error Loading Ticket</h3>
              <p>{error}</p>
              <button onClick={() => navigate('/tickets')} className="freshdesk-btn freshdesk-btn--primary">
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
      <div className="freshdesk-ticket-detail-page">
        <Navbar />
        <div className="freshdesk-layout">
          <Sidebar />
          <div className="freshdesk-ticket-detail-content">
            <div className="freshdesk-ticket-detail-error">
              <h3>Ticket Not Found</h3>
              <p>The ticket you're looking for doesn't exist.</p>
              <button onClick={() => navigate('/tickets')} className="freshdesk-btn freshdesk-btn--primary">
                Back to Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="freshdesk-ticket-detail-page">
      <Navbar />
      <div className="freshdesk-layout">
        <Sidebar />
        <div className="freshdesk-ticket-detail-content">
          {/* Ticket Header */}
          <div className="freshdesk-ticket-detail-header">
            <div className="freshdesk-ticket-detail-header-left">
              <h1 className="freshdesk-ticket-detail-title">
                {ticket.title}
              </h1>
              <div className="freshdesk-ticket-detail-id">
                {ticket.ticketId.replace(/^TK-/, '')}
              </div>
            </div>
            <div className="freshdesk-ticket-detail-header-right">
              <div className={`freshdesk-ticket-status-badge freshdesk-ticket-status-${ticketProperties.status || ticket.status}`}>
                {ticketProperties.status || ticket.status}
              </div>
              <button 
                onClick={() => navigate('/tickets')}
                className="freshdesk-btn freshdesk-btn--outline"
              >
                ← Back to Tickets
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="freshdesk-ticket-detail-main">
            {/* Conversation */}
            <div className="freshdesk-ticket-conversation">
              {/* Original Ticket */}
              <div className="freshdesk-conversation-message freshdesk-conversation-message--original">
                <div className="freshdesk-message-header">
                  <div className="freshdesk-message-author">
                    <div className="freshdesk-message-author-avatar" style={{background: 'linear-gradient(135deg, #4f46e5, #7c3aed)'}}>
                      {(ticket.createdBy?.name || ticket.requester?.name)?.split(' ').map(n => n[0]).join('').toUpperCase() || 'R'}
                    </div>
                    <div className="freshdesk-message-author-info">
                      <span className="freshdesk-message-author-name">{ticket.createdBy?.name || ticket.requester?.name || 'Requester'}</span>
                      <span className="freshdesk-message-author-role">Requester</span>
                    </div>
                  </div>
                  <div className="freshdesk-message-timestamp">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="freshdesk-message-content">
                  <h3>{ticket.title}</h3>
                  <div className="freshdesk-message-description">
                    {ticket.description?.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comments/Replies */}
              {ticket.comments?.map((comment) => (
                <div 
                  key={comment._id} 
                  className={`freshdesk-conversation-message ${comment.isInternal ? 'freshdesk-conversation-message--internal' : ''}`}
                >
                  <div className="freshdesk-message-header">
                    <div className="freshdesk-message-author">
                      <div className="freshdesk-message-author-avatar" style={{background: comment.isInternal ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : 'linear-gradient(135deg, #4f46e5, #7c3aed)'}}>
                        {(comment.createdBy?.name || comment.author?.name)?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
                      </div>
                      <div className="freshdesk-message-author-info">
                        <span className="freshdesk-message-author-name">{comment.createdBy?.name || comment.author?.name}</span>
                        {comment.isInternal && (
                          <span className="freshdesk-message-author-role freshdesk-message-author-role--internal">Internal Note</span>
                        )}
                      </div>
                    </div>
                    <div className="freshdesk-message-timestamp">
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="freshdesk-message-content">
                    {comment.content}
                  </div>
                </div>
              ))}

              {/* Reply Form */}
              <form onSubmit={handleReplySubmit} className="freshdesk-reply-form">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="freshdesk-reply-textarea"
                  rows="4"
                />
                <div className="freshdesk-reply-actions">
                  <div className="freshdesk-reply-options">
                    <label className="freshdesk-checkbox-label">
                      <input type="checkbox" />
                      <span className="freshdesk-checkbox-custom"></span>
                      Make public reply
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={replyLoading || !replyText.trim()}
                    className="freshdesk-btn freshdesk-btn--primary freshdesk-reply-submit"
                  >
                    {replyLoading ? 'Sending...' : 'Post Reply'}
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className={`freshdesk-ticket-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
              {!sidebarCollapsed && (
                <div className="freshdesk-ticket-sidebar-content">
                  {/* Ticket Status & Resolution */}
                  <div className="freshdesk-sidebar-section">
                    <div className="freshdesk-ticket-status-section">
                      <div className="freshdesk-status-header">
                        <div className="freshdesk-status-badge-container">
                          <div className={`freshdesk-ticket-status-badge freshdesk-ticket-status-${ticketProperties.status || ticket.status}`}>
                            {ticketProperties.status || ticket.status}
                          </div>
                        </div>
                      </div>

                      <div className="freshdesk-property-item">
                        <label className="freshdesk-property-label">Resolution Due</label>
                        <input
                          type="datetime-local"
                          value={ticketProperties.dueDate ? new Date(ticketProperties.dueDate).toISOString().slice(0, 16) : ''}
                          onChange={(e) => handlePropertyChange('dueDate', new Date(e.target.value))}
                          className="freshdesk-property-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ticket Properties */}
                  <div className="freshdesk-sidebar-section">
                    <h3 className="freshdesk-sidebar-title">Properties</h3>

                    <div className="freshdesk-property-item">
                      <label className="freshdesk-property-label">Tags</label>
                      <div className="freshdesk-property-value">
                        {ticket.tags && ticket.tags.length > 0 ? (
                          <div className="freshdesk-tags-container">
                            {ticket.tags.map((tag, index) => (
                              <span key={index} className="freshdesk-tag-badge">{tag}</span>
                            ))}
                          </div>
                        ) : (
                          <span className="freshdesk-placeholder">No tags</span>
                        )}
                      </div>
                    </div>

                <div className="freshdesk-property-item">
                  <label className="freshdesk-property-label">Type</label>
                  <select
                    value={ticketProperties.type || ticket.type || 'Question'}
                    onChange={(e) => handlePropertyChange('type', e.target.value)}
                    className="freshdesk-property-select"
                  >
                    <option value="Question">Question</option>
                    <option value="Incident">Incident</option>
                    <option value="Problem">Problem</option>
                    <option value="Change">Change</option>
                    <option value="Feature Request">Feature Request</option>
                  </select>
                </div>

                <div className="freshdesk-property-item">
                  <label className="freshdesk-property-label">Status</label>
                  <select
                    value={ticketProperties.status || ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="freshdesk-property-select"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="freshdesk-property-item">
                  <label className="freshdesk-property-label">Priority</label>
                  <select
                    value={ticketProperties.priority || ticket.priority}
                    onChange={(e) => handlePriorityChange(e.target.value)}
                    className="freshdesk-property-select"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="freshdesk-property-item">
                  <label className="freshdesk-property-label">Group</label>
                  <select
                    value={ticketProperties.group || ticket.group || ''}
                    onChange={(e) => handlePropertyChange('group', e.target.value)}
                    className="freshdesk-property-select"
                  >
                    <option value="">Select Group</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Billing">Billing</option>
                    <option value="Sales">Sales</option>
                    <option value="Account Management">Account Management</option>
                  </select>
                </div>

                <div className="freshdesk-property-item">
                  <label className="freshdesk-property-label">Agent</label>
                  <select
                    value={ticketProperties.assigneeId || ticket.assigneeId || ''}
                    onChange={(e) => handleAssigneeChange(e.target.value)}
                    className="freshdesk-property-select"
                  >
                    <option value="">Unassigned</option>
                    {agents.map(agent => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="freshdesk-property-item">
                  <label className="freshdesk-property-label">Company</label>
                  <div className="freshdesk-property-value">
                    {ticket.companyId?.name || ticket.companyName || 'Unknown Company'}
                  </div>
                </div>

                <div className="freshdesk-property-item">
                  <label className="freshdesk-property-label">Category</label>
                  <select
                    value={ticketProperties.category || ticket.category || ''}
                    onChange={(e) => handlePropertyChange('category', e.target.value)}
                    className="freshdesk-property-select"
                  >
                    <option value="">Select Category</option>
                    <option value="Technical">Technical</option>
                    <option value="Sales">Sales</option>
                    <option value="Billing">Billing</option>
                    <option value="Account">Account</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Bug Report">Bug Report</option>
                  </select>
                </div>

                <div className="freshdesk-property-item">
                  <label className="freshdesk-property-label">Store/Location/Site Code</label>
                  <input
                    type="text"
                    value={ticketProperties.storeLocationCode || ticket.storeLocationCode || ''}
                    onChange={(e) => handlePropertyChange('storeLocationCode', e.target.value)}
                    placeholder="Enter code"
                    className="freshdesk-property-input"
                  />
                </div>

                <div className="freshdesk-property-item">
                  <label className="freshdesk-property-label">City</label>
                  <input
                    type="text"
                    value={ticketProperties.city || ticket.city || ''}
                    onChange={(e) => handlePropertyChange('city', e.target.value)}
                    placeholder="Enter city"
                    className="freshdesk-property-input"
                  />
                </div>

                <div className="freshdesk-property-item">
                  <label className="freshdesk-property-label">Country</label>
                  <input
                    type="text"
                    value={ticketProperties.country || ticket.country || ''}
                    onChange={(e) => handlePropertyChange('country', e.target.value)}
                    placeholder="Enter country"
                    className="freshdesk-property-input"
                  />
                </div>

                <div className="freshdesk-property-item">
                  <label className="freshdesk-property-label">Requester</label>
                  <div className="freshdesk-property-value">
                    {ticket.createdBy?.name || ticket.requester?.name || 'Unknown'}<br />
                    <small>{ticket.createdBy?.email || ticket.requester?.email || 'No email provided'}</small>
                  </div>
                </div>

                <div className="freshdesk-property-item">
                  <label className="freshdesk-property-label">Created</label>
                  <div className="freshdesk-property-value">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="freshdesk-property-item">
                  <label className="freshdesk-property-label">Last Updated</label>
                  <div className="freshdesk-property-value">
                    {new Date(ticket.lastActivity || ticket.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="freshdesk-sidebar-section">
                <h3 className="freshdesk-sidebar-title">Actions</h3>
                <div className="freshdesk-action-buttons">
                  <button
                    className="freshdesk-btn freshdesk-btn--danger freshdesk-btn--block"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete Ticket
                  </button>
                </div>
              </div>

              {/* Reporter Details */}
              <div className="freshdesk-sidebar-section">
                <h3 className="freshdesk-sidebar-title">Reporter Details</h3>
                <div className="freshdesk-contact-info">
                  <div className="freshdesk-contact-item">
                    <strong>Name:</strong> {ticket.createdBy?.name || ticket.requesterName || 'Unknown'}
                  </div>
                  <div className="freshdesk-contact-item">
                    <strong>Email:</strong> {ticket.createdBy?.email || ticket.requesterEmail || 'No email'}
                  </div>
                  <div className="freshdesk-contact-item">
                    <strong>Phone:</strong> {ticket.createdBy?.phone || ticket.requesterPhone || 'No phone'}
                  </div>
                  <div className="freshdesk-contact-item">
                    <strong>Company:</strong> {ticket.createdBy?.company || ticket.requesterCompany || 'No company'}
                  </div>
                </div>
              </div>

            </div>
          )} {/* Close the conditional rendering */}

          {/* Collapsible toggle button - always visible */}
          <div className="freshdesk-sidebar-toggle">
            <button
              className="freshdesk-sidebar-toggle-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>
        </div> {/* Close the main freshdesk-ticket-sidebar div */}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="freshdesk-modal-overlay">
          <div className="freshdesk-modal">
            <div className="freshdesk-modal-header">
              <h3>Confirm Deletion</h3>
            </div>
            <div className="freshdesk-modal-body">
              <p>Are you sure you want to delete this ticket?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="freshdesk-modal-footer">
              <button
                className="freshdesk-btn freshdesk-btn--secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="freshdesk-btn freshdesk-btn--danger"
                onClick={handleDeleteTicket}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
</div>
</div>
  );
}

export default TicketDetails;