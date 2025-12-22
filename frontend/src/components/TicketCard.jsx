import React from 'react';

const TicketCard = ({ ticket, onClick }) => {
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get avatar color based on name
  const getAvatarColor = (name) => {
    if (!name) return 'bg-gray-400';
    const colors = [
      'bg-pink-400',
      'bg-purple-400',
      'bg-indigo-400',
      'bg-blue-400',
      'bg-green-400',
      'bg-yellow-400',
      'bg-orange-400',
      'bg-red-400'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return { dot: 'bg-red-500', text: 'text-red-700' };
      case 'high':
        return { dot: 'bg-orange-400', text: 'text-orange-700' };
      case 'medium':
        return { dot: 'bg-blue-400', text: 'text-blue-700' };
      case 'low':
        return { dot: 'bg-green-400', text: 'text-green-700' };
      default:
        return { dot: 'bg-gray-400', text: 'text-gray-700' };
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format time ago
  const getTimeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const ticketDate = new Date(date);
    const diffInSeconds = Math.floor((now - ticketDate) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  };

  // Check if ticket is new (created within last 24 hours)
  const isNew = () => {
    if (!ticket.createdAt) return false;
    const now = new Date();
    const created = new Date(ticket.createdAt);
    const diffInHours = (now - created) / (1000 * 60 * 60);
    return diffInHours < 24;
  };

  // Check if ticket is overdue (simplified logic)
  const isOverdue = () => {
    return ticket.status === 'open' && ticket.priority === 'urgent';
  };

  const priorityColors = getPriorityColor(ticket.priority);
  const requesterName = ticket.createdBy?.name || ticket.requester || 'Unknown';
  const company = ticket.company || 'Customer Support';

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full ${getAvatarColor(requesterName)} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
          {getInitials(requesterName)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Badges Row */}
          <div className="flex items-center gap-2 mb-2">
            {isNew() && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                New
              </span>
            )}
            {isOverdue() && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
                Overdue
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
            {ticket.title || ticket.subject}
          </h3>

          {/* Requester Info */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="truncate">{requesterName}</span>
            {company && (
              <>
                <span className="text-gray-400">•</span>
                <span className="truncate">{company}</span>
              </>
            )}
          </div>

          {/* Priority */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className={`w-2 h-2 rounded-full ${priorityColors.dot}`}></span>
            <span className={`text-xs font-medium ${priorityColors.text}`}>
              {ticket.priority ? ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1) : 'Medium'}
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5 mb-3">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(ticket.status)}`}>
              {ticket.status ? ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1) : 'Open'}
            </span>
          </div>

          {/* Timestamps */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Created: {getTimeAgo(ticket.createdAt)}</span>
            </div>
            {ticket.assignedTo && (
              <div className="flex items-center gap-1">
                <span>Agent: {ticket.assignedTo.name || 'Unassigned'}</span>
              </div>
            )}
          </div>

          {/* Agent responded indicator */}
          {ticket.lastUpdated && ticket.lastUpdated !== ticket.createdAt && (
            <div className="mt-2 text-xs text-gray-500">
              Agent responded: {getTimeAgo(ticket.lastUpdated)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;