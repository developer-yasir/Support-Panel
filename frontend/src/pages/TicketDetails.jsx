import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './FreshdeskStyles.css';

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
  const [editingField, setEditingField] = useState(null);

  // New states for attachments and time tracking
  const [attachments, setAttachments] = useState([]);
  const [newAttachment, setNewAttachment] = useState(null);
  const [timeLogs, setTimeLogs] = useState([]);
  const [showTimeForm, setShowTimeForm] = useState(false);
  const [timeSpent, setTimeSpent] = useState({ hours: 0, minutes: 0 });
  const [timeNotes, setTimeNotes] = useState('');
  const fileInputRef = useRef(null);

  // State for new ticket actions
  const [noteText, setNoteText] = useState('');
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardAgent, setForwardAgent] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [forwardLoading, setForwardLoading] = useState(false);
  const [isPublicReply, setIsPublicReply] = useState(true);

  // Initialize with sample ticket data for now
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);

        // First, try to fetch from the backend API
        try {
          const ticketResponse = await api.get(`/tickets/${ticketId}`);
          const ticketData = ticketResponse.data;

          // Now fetch comments, attachments, and time logs for this ticket
          const commentsResponse = await api.get(`/comments/ticket/${ticketData._id}`);

          let attachmentsData = [];
          let timeLogsData = [];

          try {
            const attachmentsResponse = await api.get(`/tickets/${ticketData._id}/attachments`);
            attachmentsData = attachmentsResponse.data;
          } catch (err) {
            console.log('Attachments endpoint not available');
          }

          try {
            const timeLogsResponse = await api.get(`/tickets/${ticketData._id}/time-logs`);
            timeLogsData = timeLogsResponse.data;
          } catch (err) {
            console.log('Time logs endpoint not available');
          }

          // Combine ticket data with comments, attachments and time logs
          setTicket({
            ...ticketData,
            comments: commentsResponse.data,
            attachments: attachmentsData,
            timeLogs: timeLogsData
          });
          setTicketProperties(ticketData);
          setAttachments(attachmentsData);
          setTimeLogs(timeLogsData);
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
            ],
            attachments: [],
            timeLogs: []
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

  // New handler functions
  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    setNewAttachment(files[0]);
  };

  const handleUploadAttachment = async () => {
    if (!newAttachment || !ticket?._id) return;

    const formData = new FormData();
    formData.append('attachment', newAttachment);
    formData.append('ticketId', ticket._id);

    try {
      const response = await api.post(`/tickets/${ticket._id}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Add the new attachment to the state
      setAttachments(prev => [...prev, response.data]);
      setNewAttachment(null);

      // Update ticket with new attachment count
      setTicket(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), response.data]
      }));

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error uploading attachment:', err);
      alert('Failed to upload attachment: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLogTime = async () => {
    if (!ticket?._id || timeSpent.hours === 0 && timeSpent.minutes === 0) return;

    const timeLog = {
      ticketId: ticket._id,
      hours: parseInt(timeSpent.hours) || 0,
      minutes: parseInt(timeSpent.minutes) || 0,
      notes: timeNotes,
      loggedAt: new Date().toISOString(),
      loggedBy: 'current_user' // This should be the actual logged-in user
    };

    try {
      const response = await api.post('/time-logs', timeLog);

      // Add the new time log to the state
      setTimeLogs(prev => [...prev, response.data]);
      setTimeSpent({ hours: 0, minutes: 0 });
      setTimeNotes('');
      setShowTimeForm(false);

      // Update ticket with new time log
      setTicket(prev => ({
        ...prev,
        timeLogs: [...(prev.timeLogs || []), response.data]
      }));
    } catch (err) {
      console.error('Error logging time:', err);
      alert('Failed to log time: ' + (err.response?.data?.message || err.message));
    }
  };

  // Calculate total time spent
  const totalTime = timeLogs.reduce((total, log) => {
    const hours = parseInt(log.hours) || 0;
    const minutes = parseInt(log.minutes) || 0;
    return total + hours * 60 + minutes;
  }, 0);

  const totalHours = Math.floor(totalTime / 60);
  const totalMinutes = totalTime % 60;

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setReplyLoading(true);
    try {
      // Make API call to add comment
      const response = await api.post(`/comments`, {
        ticketId: ticket._id,
        content: replyText,
        isInternal: !isPublicReply  // if not public, then it's internal
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

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    setNoteLoading(true);
    try {
      const response = await api.post(`/comments`, {
        ticketId: ticket._id,
        content: noteText,
        isInternal: true  // Internal note, not sent to requester
      });

      // Add the new note to the ticket's comments in state
      setTicket(prev => ({
        ...prev,
        comments: [...(prev.comments || []), response.data]
      }));

      // Clear the note text
      setNoteText('');
      // Close the note section (we'll implement this UI below)
    } catch (err) {
      console.error('Error adding note:', err);
      alert('Failed to add note: ' + (err.response?.data?.message || err.message));
    } finally {
      setNoteLoading(false);
    }
  };

  const handleForward = async () => {
    if (!forwardAgent) return;

    setForwardLoading(true);
    try {
      // Update ticket assignee
      const response = await api.patch(`/tickets/${ticket._id}`, {
        assigneeId: forwardAgent
      });

      // Update ticket in state
      setTicket(prev => ({
        ...prev,
        assigneeId: forwardAgent,
        assignee: agents.find(agent => agent._id === forwardAgent) || null
      }));

      // Add a note about forwarding
      const noteResponse = await api.post(`/comments`, {
        ticketId: ticket._id,
        content: `Ticket forwarded to ${agents.find(agent => agent._id === forwardAgent)?.name || 'agent'}`,
        isInternal: true
      });

      // Add the forwarding note to comments
      setTicket(prev => ({
        ...prev,
        comments: [...(prev.comments || []), noteResponse.data]
      }));

      // Reset and close modal
      setForwardAgent('');
      setShowForwardModal(false);

      alert('Ticket forwarded successfully!');
    } catch (err) {
      console.error('Error forwarding ticket:', err);
      alert('Failed to forward ticket: ' + (err.response?.data?.message || err.message));
    } finally {
      setForwardLoading(false);
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

      // Reset the editing field after successful update
      setEditingField(null);
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
                      <input
                        type="checkbox"
                        checked={isPublicReply}
                        onChange={(e) => setIsPublicReply(e.target.checked)}
                      />
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

            {/* Ticket Action Buttons */}
            <div className="freshdesk-ticket-actions">
              <div className="freshdesk-action-buttons-row">
                <button
                  className="freshdesk-btn freshdesk-btn--primary freshdesk-action-btn"
                  onClick={() => {
                    // Scroll to the existing reply form and focus the textarea
                    document.querySelector('.freshdesk-reply-textarea')?.focus();
                    // Ensure it's set to public reply
                    setIsPublicReply(true);
                  }}
                >
                  <span className="btn-icon">💬</span> Reply
                </button>
                <button
                  className="freshdesk-btn freshdesk-btn--secondary freshdesk-action-btn"
                  onClick={() => {
                    // Toggle visibility of the note form
                    const noteForm = document.getElementById('note-section');
                    if (noteForm.style.display === 'none' || noteForm.style.display === '') {
                      noteForm.style.display = 'block';
                      document.getElementById('note-textarea')?.focus();
                      // Ensure it's set to internal (not public)
                      setIsPublicReply(false);
                    } else {
                      noteForm.style.display = 'none';
                      setNoteText('');
                    }
                  }}
                >
                  <span className="btn-icon">📝</span> Add Note
                </button>
                <button
                  className="freshdesk-btn freshdesk-btn--outline freshdesk-action-btn"
                  onClick={() => setShowForwardModal(true)}
                >
                  <span className="btn-icon">↪️</span> Forward
                </button>
              </div>

              {/* Note Form - Hidden by default */}
              <div id="note-section" className="freshdesk-note-form" style={{display: 'none', marginTop: '15px'}}>
                <textarea
                  id="note-textarea"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Type your internal note here..."
                  className="freshdesk-reply-textarea"
                  rows="3"
                />
                <div className="freshdesk-note-actions" style={{marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'flex-start'}}>
                  <button
                    type="button"
                    onClick={handleAddNote}
                    disabled={noteLoading || !noteText.trim()}
                    className="freshdesk-btn freshdesk-btn--secondary freshdesk-note-submit"
                  >
                    {noteLoading ? 'Saving...' : 'Add Note'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNoteText('');
                      document.getElementById('note-section').style.display = 'none';
                    }}
                    className="freshdesk-btn freshdesk-btn--outline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className={`freshdesk-ticket-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
              <div className="freshdesk-ticket-sidebar-content-wrapper">
                {!sidebarCollapsed && (
                  <div className="freshdesk-ticket-sidebar-content">
                    {/* Ticket Status & Resolution */}
                    <div className="freshdesk-sidebar-section freshdesk-ticket-status-section">
                      <div className="element-flex justify-content--space-between align-items--center">
                        <p className="text--normal text--xxmedium mb-0" data-test-id="ticket-status">
                          {ticketProperties.status || ticket.status}
                        </p>
                      </div>

                      <div className="status-card text--default" data-test-id="status-card">
                        <p className="status-title text--semibold text--xsmall overdue" data-test-id="status-title">
                          <span>Resolution Due</span>
                        </p>
                        <span data-test-id="resolution-due">
                          by {ticketProperties.dueDate ? new Date(ticketProperties.dueDate).toLocaleString() : 'Not set'}
                        </span>
                      </div>
                    </div>

                    {/* Ticket Properties */}
                    <div className="freshdesk-sidebar-section">
                      <h3 className="freshdesk-sidebar-title">Properties</h3>

                    <div className="property-item">
                      <div className="property-title text--semibold text--xsmall">
                        <span>Tags</span>
                      </div>
                      <div
                        className="property-value clickable-field"
                        onClick={() => setEditingField('tags')}
                      >
                        {editingField === 'tags' ? (
                          <input
                            type="text"
                            value={ticket.tags && ticket.tags.length > 0 ? ticket.tags.join(', ') : ''}
                            onChange={(e) => {
                              const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                              handlePropertyChange('tags', tags);
                            }}
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="freshdesk-property-input"
                            placeholder="Enter tags separated by commas"
                          />
                        ) : (
                          <div>
                            {ticket.tags && ticket.tags.length > 0 ? (
                              <div className="freshdesk-tags-container">
                                {ticket.tags.map((tag, index) => (
                                  <span key={index} className="freshdesk-tag-badge">{tag}</span>
                                ))}
                              </div>
                            ) : (
                              <span className="text--default">No tags</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="property-item">
                      <div className="property-title text--semibold text--xsmall">
                        <span>Type</span>
                      </div>
                      <div
                        className="property-value text--default clickable-field selectable"
                        onClick={() => setEditingField('type')}
                      >
                        {editingField === 'type' ? (
                          <select
                            value={ticketProperties.type || ticket.type || 'Question'}
                            onChange={(e) => handlePropertyChange('type', e.target.value)}
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="freshdesk-property-select"
                          >
                            <option value="Question">Question</option>
                            <option value="Incident">Incident</option>
                            <option value="Problem">Problem</option>
                            <option value="Change">Change</option>
                            <option value="Feature Request">Feature Request</option>
                          </select>
                        ) : (
                          <span>{ticketProperties.type || ticket.type || 'Question'}</span>
                        )}
                      </div>
                    </div>

                    <div className="property-item">
                      <div className="property-title text--semibold text--xsmall">
                        <span>Status</span>
                      </div>
                      <div
                        className="property-value text--default clickable-field selectable"
                        onClick={() => setEditingField('status')}
                      >
                        {editingField === 'status' ? (
                          <select
                            value={ticketProperties.status || ticket.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="freshdesk-property-select"
                          >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="pending">Pending</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        ) : (
                          <span>{ticketProperties.status || ticket.status}</span>
                        )}
                      </div>
                    </div>

                    <div className="property-item">
                      <div className="property-title text--semibold text--xsmall">
                        <span>Priority</span>
                      </div>
                      <div
                        className="property-value clickable-field selectable"
                        onClick={() => setEditingField('priority')}
                      >
                        {editingField === 'priority' ? (
                          <select
                            value={ticketProperties.priority || ticket.priority}
                            onChange={(e) => handlePriorityChange(e.target.value)}
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="freshdesk-property-select"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        ) : (
                          <span className={`freshdesk-priority-badge ${ticketProperties.priority || ticket.priority}`}>
                            {ticketProperties.priority || ticket.priority}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="property-item">
                      <div className="property-title text--semibold text--xsmall">
                        <span>Group</span>
                      </div>
                      <div
                        className="property-value text--default clickable-field selectable"
                        onClick={() => setEditingField('group')}
                      >
                        {editingField === 'group' ? (
                          <select
                            value={ticketProperties.group || ticket.group || ''}
                            onChange={(e) => handlePropertyChange('group', e.target.value)}
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="freshdesk-property-select"
                          >
                            <option value="">Select Group</option>
                            <option value="Technical Support">Technical Support</option>
                            <option value="Billing">Billing</option>
                            <option value="Sales">Sales</option>
                            <option value="Account Management">Account Management</option>
                          </select>
                        ) : (
                          <span>{ticketProperties.group || ticket.group || 'Unassigned'}</span>
                        )}
                      </div>
                    </div>

                    <div className="property-item">
                      <div className="property-title text--semibold text--xsmall">
                        <span>Agent</span>
                      </div>
                      <div
                        className="property-value text--default clickable-field selectable"
                        onClick={() => setEditingField('assigneeId')}
                      >
                        {editingField === 'assigneeId' ? (
                          <select
                            value={ticketProperties.assigneeId || ticket.assigneeId || ''}
                            onChange={(e) => handleAssigneeChange(e.target.value)}
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="freshdesk-property-select"
                          >
                            <option value="">Unassigned</option>
                            {agents.map(agent => (
                              <option key={agent._id} value={agent._id}>
                                {agent.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span>{agents.find(agent => agent._id === (ticketProperties.assigneeId || ticket.assigneeId))?.name || 'Unassigned'}</span>
                        )}
                      </div>
                    </div>

                    <div className="property-item">
                      <div className="property-title text--semibold text--xsmall">
                        <span>Company</span>
                      </div>
                      <div
                        className="property-value text--default clickable-field selectable"
                        onClick={() => setEditingField('company')}
                      >
                        {editingField === 'company' ? (
                          <select
                            value={ticket.companyId?._id || ticket.companyId || ''}
                            onChange={(e) => handlePropertyChange('companyId', e.target.value)}
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="freshdesk-property-select"
                          >
                            <option value="">Select Company</option>
                            {/* Add company options here when available */}
                          </select>
                        ) : (
                          <span>{ticket.companyId?.name || ticket.companyName || 'Unknown Company'}</span>
                        )}
                      </div>
                    </div>

                    <div className="property-item">
                      <div className="property-title text--semibold text--xsmall">
                        <span>Category</span>
                      </div>
                      <div
                        className="property-value text--default clickable-field selectable"
                        onClick={() => setEditingField('category')}
                      >
                        {editingField === 'category' ? (
                          <select
                            value={ticketProperties.category || ticket.category || ''}
                            onChange={(e) => handlePropertyChange('category', e.target.value)}
                            onBlur={() => setEditingField(null)}
                            autoFocus
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
                        ) : (
                          <span>{ticketProperties.category || ticket.category || 'Uncategorized'}</span>
                        )}
                      </div>
                    </div>

                    <div className="property-item">
                      <div className="property-title text--semibold text--xsmall">
                        <span>Store/Location/Site Code</span>
                      </div>
                      <div
                        className="property-value text--default clickable-field"
                        onClick={() => setEditingField('storeLocationCode')}
                      >
                        {editingField === 'storeLocationCode' ? (
                          <input
                            type="text"
                            value={ticketProperties.storeLocationCode || ticket.storeLocationCode || ''}
                            onChange={(e) => handlePropertyChange('storeLocationCode', e.target.value)}
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="freshdesk-property-input"
                          />
                        ) : (
                          <span>{ticketProperties.storeLocationCode || ticket.storeLocationCode || 'None'}</span>
                        )}
                      </div>
                    </div>

                    <div className="property-item">
                      <div className="property-title text--semifold text--xsmall">
                        <span>City</span>
                      </div>
                      <div
                        className="property-value text--default clickable-field"
                        onClick={() => setEditingField('city')}
                      >
                        {editingField === 'city' ? (
                          <input
                            type="text"
                            value={ticketProperties.city || ticket.city || ''}
                            onChange={(e) => handlePropertyChange('city', e.target.value)}
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="freshdesk-property-input"
                          />
                        ) : (
                          <span>{ticketProperties.city || ticket.city || 'None'}</span>
                        )}
                      </div>
                    </div>

                    <div className="property-item">
                      <div className="property-title text--semifold text--xsmall">
                        <span>Country</span>
                      </div>
                      <div
                        className="property-value text--default clickable-field"
                        onClick={() => setEditingField('country')}
                      >
                        {editingField === 'country' ? (
                          <input
                            type="text"
                            value={ticketProperties.country || ticket.country || ''}
                            onChange={(e) => handlePropertyChange('country', e.target.value)}
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="freshdesk-property-input"
                          />
                        ) : (
                          <span>{ticketProperties.country || ticket.country || 'None'}</span>
                        )}
                      </div>
                    </div>

                    <div className="property-item">
                      <div className="property-title text--semifold text--xsmall">
                        <span>Requester</span>
                      </div>
                      <div className="property-value text--default">
                        <div>{ticket.createdBy?.name || ticket.requester?.name || 'Unknown'}</div>
                        <div className="freshdesk-requester-email">{ticket.createdBy?.email || ticket.requester?.email || 'No email provided'}</div>
                      </div>
                    </div>

                    <div className="property-item">
                      <div className="property-title text--semifold text--xsmall">
                        <span>Created</span>
                      </div>
                      <div className="property-value text--default">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="property-item">
                      <div className="property-title text--semifold text--xsmall">
                        <span>Last Updated</span>
                      </div>
                      <div className="property-value text--default">
                        {new Date(ticket.lastActivity || ticket.createdAt).toLocaleString()}
                      </div>
                    </div>
              </div>

              {/* Time Tracking Section */}
              <div className="freshdesk-sidebar-section">
                <div className="element-flex justify-content--space-between align-items--center">
                  <h3 className="freshdesk-sidebar-title">Time Tracking</h3>
                  <button
                    className="freshdesk-btn freshdesk-btn--outline"
                    onClick={() => setShowTimeForm(!showTimeForm)}
                  >
                    {showTimeForm ? 'Cancel' : 'Log Time'}
                  </button>
                </div>

                <div className="status-card text--default">
                  <p className="status-title text--semibold text--xsmall overdue">
                    <span>Total Time Spent</span>
                  </p>
                  <span className="freshdesk-total-time">{totalHours}h {totalMinutes}m</span>
                </div>

                {showTimeForm && (
                  <div className="freshdesk-time-form">
                    <div className="freshdesk-time-inputs">
                      <input
                        type="number"
                        min="0"
                        placeholder="Hours"
                        value={timeSpent.hours}
                        onChange={(e) => setTimeSpent({...timeSpent, hours: e.target.value})}
                        className="freshdesk-time-input"
                      />
                      <input
                        type="number"
                        min="0"
                        max="59"
                        placeholder="Minutes"
                        value={timeSpent.minutes}
                        onChange={(e) => setTimeSpent({...timeSpent, minutes: e.target.value})}
                        className="freshdesk-time-input"
                      />
                    </div>
                    <textarea
                      value={timeNotes}
                      onChange={(e) => setTimeNotes(e.target.value)}
                      placeholder="Add notes about time spent..."
                      className="freshdesk-time-notes"
                    />
                    <button
                      className="freshdesk-btn freshdesk-btn--primary"
                      onClick={handleLogTime}
                    >
                      Save Time
                    </button>
                  </div>
                )}

                {timeLogs && timeLogs.length > 0 && (
                  <div className="freshdesk-time-logs">
                    <h4 className="text--semifold text--xsmall">Time Entries</h4>
                    {timeLogs.map((log, index) => (
                      <div key={index} className="freshdesk-time-log-item">
                        <span>{log.hours}h {log.minutes}m</span>
                        <span>{new Date(log.loggedAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Attachments Section */}
              <div className="freshdesk-sidebar-section">
                <h3 className="freshdesk-sidebar-title">Attachments</h3>

                <div className="freshdesk-attachments-upload">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAttachmentChange}
                    className="freshdesk-hidden-input"
                  />
                  <button
                    className="freshdesk-btn freshdesk-btn--outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload File
                  </button>

                  {newAttachment && (
                    <div className="freshdesk-attachment-preview">
                      <span className="freshdesk-attachment-name">{newAttachment.name}</span>
                      <span className="freshdesk-attachment-size">({(newAttachment.size / 1024 / 1024).toFixed(2)} MB)</span>
                      <button
                        className="freshdesk-btn freshdesk-btn--primary"
                        onClick={handleUploadAttachment}
                      >
                        Upload
                      </button>
                    </div>
                  )}
                </div>

                {attachments && attachments.length > 0 && (
                  <div className="freshdesk-attachments-list">
                    {attachments.map((attachment, index) => (
                      <div key={index} className="freshdesk-attachment-item">
                        <span className="freshdesk-attachment-name">{attachment.filename || `File ${index + 1}`}</span>
                        <button className="freshdesk-btn freshdesk-btn--secondary">Download</button>
                      </div>
                    ))}
                  </div>
                )}
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
        </div> {/* Close the freshdesk-ticket-sidebar-content-wrapper */}
      </div> {/* Close the main freshdesk-ticket-sidebar div */}


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

      {/* Forward Ticket Modal */}
      {showForwardModal && (
        <div className="freshdesk-modal-overlay">
          <div className="freshdesk-modal">
            <div className="freshdesk-modal-header">
              <h3>Forward Ticket</h3>
            </div>
            <div className="freshdesk-modal-body">
              <p>Select an agent to forward this ticket to:</p>
              <select
                value={forwardAgent}
                onChange={(e) => setForwardAgent(e.target.value)}
                className="freshdesk-property-select"
                style={{width: '100%', marginTop: '10px'}}
              >
                <option value="">Select an agent</option>
                {agents.map(agent => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name} ({agent.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="freshdesk-modal-footer">
              <button
                className="freshdesk-btn freshdesk-btn--secondary"
                onClick={() => {
                  setShowForwardModal(false);
                  setForwardAgent('');
                }}
              >
                Cancel
              </button>
              <button
                className="freshdesk-btn freshdesk-btn--primary"
                onClick={handleForward}
                disabled={forwardLoading || !forwardAgent}
              >
                {forwardLoading ? 'Forwarding...' : 'Forward Ticket'}
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