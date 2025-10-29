import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './FreshdeskStyles.css';

// Inline SVG Icons
const ClockIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const EditIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const UserIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const TagIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const FlagIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

const BuildingIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
  </svg>
);

const MapPinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const GlobeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const HashIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
  </svg>
);

const BriefcaseIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    <rect width="20" height="14" x="2" y="6" rx="2" />
  </svg>
);

const TicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchTicketAndComments = async () => {
      try {
        // Fetch ticket details
        const ticketResponse = await api.get(`/tickets/${ticketId}`);
        setTicket(ticketResponse.data);

        // Fetch related comments
        // In a real app, you might fetch comments from a separate endpoint
        setComments([
          {
            id: 1,
            author: ticketResponse.data.createdBy?.name || 'Requester',
            authorEmail: ticketResponse.data.createdBy?.email || 'requester@example.com',
            content: ticketResponse.data.description || 'No description provided.',
            timestamp: ticketResponse.data.createdAt || new Date().toISOString(),
            isRequester: true
          },
          {
            id: 2,
            author: 'Support Agent',
            authorEmail: 'agent@example.com',
            content: 'Thank you for reporting this issue. We are currently investigating.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            isRequester: false
          }
        ]);
      } catch (error) {
        console.error('Error fetching ticket:', error);
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchTicketAndComments();
    }
  }, [ticketId]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    try {
      // In a real app, this would send the reply to the backend
      const newComment = {
        id: comments.length + 1,
        author: 'Support Agent', // Assuming current user is agent
        authorEmail: 'agent@example.com',
        content: reply,
        timestamp: new Date().toISOString(),
        isRequester: false
      };

      setComments([...comments, newComment]);
      setReply('');
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
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
          <div className="freshdesk-content flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="freshdesk-spinner w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-600">Loading ticket details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="freshdesk-dashboard">
        <Navbar />
        <div className="freshdesk-layout">
          <Sidebar />
          <div className="freshdesk-content flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Ticket Not Found</h2>
              <button 
                onClick={() => navigate('/tickets')}
                className="freshdesk-new-ticket-btn"
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
        <div className="flex-1 flex flex-col min-h-screen freshdesk-main-content">
          {/* Header */}
          <div className="freshdesk-ticket-details-header">
            <div>
              <h1 className="freshdesk-ticket-details-title">
                #{ticket.ticketId || ticket._id || 'N/A'} — {ticket.title || ticket.subject || 'No Title'}
              </h1>
              <p className="freshdesk-ticket-details-subtitle">Reported by {ticket.createdBy?.name || 'Unknown'}</p>
            </div>
            <span className={`freshdesk-ticket-details-status ${
              ticket.status === 'open' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
              ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
              ticket.status === 'pending' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
              ticket.status === 'resolved' ? 'bg-green-100 text-green-800 border border-green-200' :
              ticket.status === 'closed' ? 'bg-gray-100 text-gray-800 border border-gray-200' :
              'bg-gray-100 text-gray-800 border border-gray-200'
            }`}>
              {ticket.status ? ticket.status.replace('_', ' ').toUpperCase() : 'N/A'}
            </span>
          </div>

          {/* Main Content */}
          <div className="freshdesk-ticket-details-content">
            {/* Conversation */}
            <div className="freshdesk-ticket-conversation">
              {comments.map((comment) => (
                <div 
                  key={comment.id} 
                  className={`freshdesk-conversation-message ${comment.isRequester ? 'requester' : ''}`}
                >
                  <div className="freshdesk-message-header">
                    <div className="freshdesk-message-author">
                      <div className="freshdesk-message-author-avatar">
                        {comment.author.charAt(0)}
                      </div>
                      <span>{comment.author}</span>
                    </div>
                    <span className="freshdesk-message-timestamp">
                      {formatDate(comment.timestamp)}
                    </span>
                  </div>
                  <p className="freshdesk-message-content">
                    {comment.content}
                  </p>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  <p>No conversation yet. Be the first to reply!</p>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="freshdesk-ticket-sidebar">
              {/* Status */}
              <div className="freshdesk-sidebar-section">
                <h2 className="freshdesk-sidebar-title">Ticket Details</h2>
                <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <span>First Response Due</span>
                  </div>
                  <EditIcon size={14} className="freshdesk-edit-icon" />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <ClockIcon size={14} className="freshdesk-clock-icon" /> {formatDate(ticket.createdAt || new Date())}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <span>Resolution Due</span>
                  </div>
                  <EditIcon size={14} className="freshdesk-edit-icon" />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ClockIcon size={14} className="freshdesk-clock-icon" /> {formatDate(ticket.updatedAt || new Date())}
                </div>
              </div>

              {/* Properties */}
              <div className="freshdesk-sidebar-subsection">
                <h3 className="freshdesk-sidebar-subtitle">Properties</h3>
                <div className="freshdesk-property-grid">
                  <p className="freshdesk-property-label"><Tag size={14} /> Tags</p>
                  <p className="freshdesk-property-value">{ticket.tags?.join(', ') || 'None'}</p>

                  <p className="freshdesk-property-label"><Hash size={14} /> Type</p>
                  <p className="freshdesk-property-value">{ticket.type || 'Issue'}</p>

                  <p className="freshdesk-property-label"><User size={14} /> Status</p>
                  <p className="freshdesk-property-value">{ticket.status?.replace('_', ' ') || 'N/A'}</p>

                  <p className="freshdesk-property-label"><Flag size={14} /> Priority</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    ticket.priority === 'low' ? 'bg-green-100 text-green-800 border border-green-200' :
                    ticket.priority === 'medium' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    ticket.priority === 'high' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                    ticket.priority === 'urgent' ? 'bg-red-100 text-red-800 border border-red-200' :
                    'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {ticket.priority?.toUpperCase() || 'N/A'}
                  </span>

                  <p className="freshdesk-property-label"><Briefcase size={14} /> Group</p>
                  <p className="freshdesk-property-value">{ticket.group || 'General Support'}</p>

                  <p className="freshdesk-property-label"><User size={14} /> Agent</p>
                  <p className="freshdesk-property-value">{ticket.assignedTo?.name || 'Unassigned'}</p>

                  <p className="freshdesk-property-label"><Building size={14} /> Company</p>
                  <p className="freshdesk-property-value">{ticket.company || 'N/A'}</p>

                  <p className="freshdesk-property-label"><Hash size={14} /> Category</p>
                  <p className="freshdesk-property-value">{ticket.category || 'General'}</p>

                  <p className="freshdesk-property-label"><Hash size={14} /> Store/Site Code</p>
                  <p className="freshdesk-property-value">{ticket.storeCode || 'N/A'}</p>

                  <p className="freshdesk-property-label"><MapPin size={14} /> City</p>
                  <p className="freshdesk-property-value">{ticket.city || 'N/A'}</p>

                  <p className="freshdesk-property-label"><Globe size={14} /> Country</p>
                  <p className="freshdesk-property-value">{ticket.country || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reply Box */}
          <div className="freshdesk-reply-box">
            <form onSubmit={handleReplySubmit} className="freshdesk-reply-form">
              <textarea
                className="freshdesk-reply-input"
                rows="3"
                placeholder="Type your reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <button 
                type="submit"
                className="freshdesk-reply-button"
                disabled={!reply.trim()}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;