import { useNavigate } from 'react-router-dom';

const TicketCard = ({ ticket }) => {
  const navigate = useNavigate();

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open':
        return 'ticket-status-badge ticket-status-badge--open';
      case 'in_progress':
        return 'ticket-status-badge ticket-status-badge--in-progress';
      case 'resolved':
        return 'ticket-status-badge ticket-status-badge--resolved';
      case 'closed':
        return 'ticket-status-badge ticket-status-badge--closed';
      default:
        return 'ticket-status-badge';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'low':
        return 'ticket-priority-badge ticket-priority-badge--low';
      case 'medium':
        return 'ticket-priority-badge ticket-priority-badge--medium';
      case 'high':
        return 'ticket-priority-badge ticket-priority-badge--high';
      case 'urgent':
        return 'ticket-priority-badge ticket-priority-badge--urgent';
      default:
        return 'ticket-priority-badge';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleTicketClick = () => {
    navigate(`/ticket/${ticket._id || ticket.id}`);
  };

  return (
    <div className="ticket-card" onClick={handleTicketClick}>
      <div className="ticket-card__header">
        <div className="ticket-card__id">#{ticket.id || ticket._id?.substring(0, 8) || 'TK-000'}</div>
        <div className="ticket-card__badges">
          <span className={getStatusBadgeClass(ticket.status)}>
            {ticket.status?.replace('_', ' ')?.toUpperCase()}
          </span>
          <span className={getPriorityBadgeClass(ticket.priority)}>
            {ticket.priority?.toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="ticket-card__title">
        {ticket.title || 'No title'}
      </div>
      
      <div className="ticket-card__description">
        {ticket.description?.substring(0, 150) || 'No description provided...'}
        {ticket.description && ticket.description.length > 150 && '...'}
      </div>
      
      <div className="ticket-card__meta">
        <div className="ticket-meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" className="ticket-meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="ticket-meta-text">{ticket.createdBy?.name || ticket.customer || 'Customer'}</span>
        </div>
        
        <div className="ticket-meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" className="ticket-meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="ticket-meta-text">{formatDate(ticket.createdAt || ticket.date || new Date())}</span>
        </div>
        
        {ticket.assignedTo && (
          <div className="ticket-meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" className="ticket-meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="ticket-meta-text">Assigned to {ticket.assignedTo.name || ticket.agent || 'Agent'}</span>
          </div>
        )}
      </div>
      
      <div className="ticket-card__footer">
        <div className="ticket-footer-actions">
          <button 
            className="btn btn--ghost btn--small ticket-footer-btn"
            onClick={(e) => { e.stopPropagation(); navigate(`/ticket/${ticket.id || ticket._id}`); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View
          </button>
          <button 
            className="btn btn--ghost btn--small ticket-footer-btn"
            onClick={(e) => { e.stopPropagation(); navigate(`/ticket/${ticket.id || ticket._id}/edit`); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button 
            className="btn btn--ghost btn--small ticket-footer-btn"
            onClick={(e) => { e.stopPropagation(); /* Implement comment functionality */ }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;