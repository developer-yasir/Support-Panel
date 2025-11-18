import { memo, useCallback } from 'react';

const OptimizedTicketRow = ({
  ticket,
  selectedTickets,
  handleTicketClick,
  handleSelectTicket,
  handleAssignChange,
  handleStatusChange,
  handlePriorityChange,
  agents,
  getTimeAgo
}) => {
  const isSelected = selectedTickets.has(ticket.ticketId || ticket._id || ticket.id);
  
  const handleClick = useCallback(() => {
    handleTicketClick(ticket);
  }, [handleTicketClick, ticket]);

  const handleCheckboxChange = useCallback((e) => {
    e.stopPropagation();
    handleSelectTicket(ticket.ticketId || ticket._id || ticket.id);
  }, [handleSelectTicket, ticket]);

  const handleAssignChangeLocal = useCallback((e) => {
    e.stopPropagation();
    handleAssignChange(ticket, e.target.value);
  }, [handleAssignChange, ticket]);

  const handleStatusChangeLocal = useCallback((e) => {
    e.stopPropagation();
    handleStatusChange(ticket, e.target.value);
  }, [handleStatusChange, ticket]);

  const handlePriorityChangeLocal = useCallback((e) => {
    e.stopPropagation();
    handlePriorityChange(ticket, e.target.value);
  }, [handlePriorityChange, ticket]);

  return (
    <tr 
      key={ticket.ticketId || ticket._id || ticket.id} 
      className={`freshdesk-ticket-row ticket-row ${isSelected ? 'selected' : ''}`}
    >
      <td>
        <input
          type="checkbox"
          className="freshdesk-checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
        />
      </td>
      <td>
        <div className="freshdesk-ticket-id" onClick={handleClick}>{ticket.ticketId || ticket._id || ticket.id}</div>
      </td>
      <td>
        <div className="freshdesk-ticket-subject" onClick={handleClick}>{ticket.title || ticket.subject}</div>
        <div className="freshdesk-ticket-description" onClick={handleClick}>
          {ticket.description ? (ticket.description.substring(0, 100) + (ticket.description.length > 100 ? '...' : '')) : ''}
        </div>
      </td>
      <td>
        <div className="freshdesk-company-info">
          <div className="freshdesk-company-name">{ticket.createdBy?.company || 'N/A'}</div>
        </div>
      </td>
      <td>
        <div className="freshdesk-time-ago">{getTimeAgo(ticket.lastUpdated)}</div>
      </td>
      <td>
        <div className="freshdesk-ticket-details-block">
          <div className="freshdesk-ticket-assigned">
            <span className="freshdesk-ticket-detail-label">Assigned To:</span>
            <select
              className="freshdesk-quick-action-select"
              value={ticket.assignedTo?._id || ''}
              onChange={handleAssignChangeLocal}
            >
              <option value="">Unassigned</option>
              {agents.map(agent => (
                <option key={agent._id} value={agent._id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>
          <div className="freshdesk-ticket-status">
            <span className="freshdesk-ticket-detail-label">Status:</span>
            <select
              className="freshdesk-quick-action-select"
              value={ticket.status}
              onChange={handleStatusChangeLocal}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="freshdesk-ticket-priority">
            <span className="freshdesk-ticket-detail-label">Priority:</span>
            <select
              className="freshdesk-quick-action-select"
              value={ticket.priority}
              onChange={handlePriorityChangeLocal}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default memo(OptimizedTicketRow);