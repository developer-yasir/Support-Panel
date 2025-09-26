import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const FreshdeskTicketCard = ({ ticket }) => {
  const navigate = useNavigate();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'info';
      case 'in_progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return priority;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      default: return status.replace('_', ' ');
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch {
      return dateString || 'N/A';
    }
  };

  const handleCardClick = () => {
    navigate(`/ticket/${ticket._id || ticket.id}`);
  };

  return (
    <div className="freshdesk-ticket-card" onClick={handleCardClick}>
      <div className="freshdesk-ticket-card__header">
        <div className="freshdesk-ticket-card__id">
          {ticket.ticketId || `TK-${ticket._id?.slice(-4) || ticket.id?.slice(-4) || '0000'}`}
        </div>
        <div className={`badge badge--${getPriorityColor(ticket.priority)}`}>
          {getPriorityText(ticket.priority)}
        </div>
      </div>

      <div className="freshdesk-ticket-card__title">
        {ticket.title}
      </div>

      <div className="freshdesk-ticket-card__description">
        {ticket.description?.substring(0, 100)}{ticket.description?.length > 100 ? '...' : ''}
      </div>

      <div className="freshdesk-ticket-card__meta">
        <div className="freshdesk-ticket-card__customer">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {ticket.customerName || ticket.createdBy?.name || 'Unknown Customer'}
        </div>
        
        {ticket.assignedTo && (
          <div className="freshdesk-ticket-card__agent">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {ticket.assignedTo?.name || ticket.assignedTo}
          </div>
        )}
      </div>

      <div className="freshdesk-ticket-card__footer">
        <div className="freshdesk-ticket-card__tags">
          {ticket.tags?.map((tag, index) => (
            <span key={index} className="tag tag--small">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="freshdesk-ticket-card__info">
          <div className="freshdesk-ticket-card__date">
            {formatDate(ticket.createdAt)}
          </div>
          
          <div className={`badge badge--${getStatusColor(ticket.status)}`}>
            {getStatusText(ticket.status)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreshdeskTicketCard;