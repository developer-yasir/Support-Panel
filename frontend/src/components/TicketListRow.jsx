import React from 'react';

const TicketListRow = ({ ticket, isSelected, onSelect, onClick }) => {
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

    // Get priority color and label
    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'urgent':
                return 'bg-red-500';
            case 'high':
                return 'bg-orange-400';
            case 'medium':
                return 'bg-yellow-400';
            case 'low':
                return 'bg-green-500';
            default:
                return 'bg-gray-400';
        }
    };

    // Format time ago
    const getTimeAgo = (date) => {
        if (!date) return '';
        const now = new Date();
        const ticketDate = new Date(date);
        const diffInSeconds = Math.floor((now - ticketDate) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) {
            const mins = Math.floor(diffInSeconds / 60);
            return `${mins} minute${mins > 1 ? 's' : ''} ago`;
        }
        if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
        if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
        const weeks = Math.floor(diffInSeconds / 604800);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    };

    // Calculate overdue duration
    const getOverdueDuration = () => {
        if (!ticket.createdAt) return 'a day';
        const now = new Date();
        const created = new Date(ticket.createdAt);
        const diffInDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));

        if (diffInDays < 1) return 'a day';
        if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
        const months = Math.floor(diffInDays / 30);
        return `${months} month${months > 1 ? 's' : ''}`;
    };

    // Check if ticket is overdue
    const isOverdue = () => {
        return ticket.status === 'open' && ticket.priority === 'urgent';
    };

    const requesterName = ticket.createdBy?.name || ticket.requester || 'Unknown';
    const requesterLocation = ticket.createdBy?.email?.includes('RAK') ? 'RAK' : 'SharelDG';
    const company = ticket.company || 'Customer S...';
    const priorityColor = getPriorityColor(ticket.priority);

    return (
        <div
            className="flex items-center gap-2 md:gap-4 px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors group"
            onClick={onClick}
        >
            {/* Checkbox - Hidden on mobile */}
            <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                    e.stopPropagation();
                    onSelect();
                }}
                className="hidden md:block w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer flex-shrink-0"
            />

            {/* Avatar */}
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${getAvatarColor(requesterName)} flex items-center justify-center text-white font-semibold text-xs md:text-sm flex-shrink-0`}>
                {getInitials(requesterName)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Title with Overdue Badge */}
                <div className="flex items-center gap-2 mb-1">
                    {isOverdue() && (
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-semibold rounded uppercase tracking-wide flex-shrink-0">
                            Overdue
                        </span>
                    )}
                    <h3 className="text-xs md:text-sm font-normal text-gray-900 truncate">
                        {ticket.title || ticket.subject} <span className="text-gray-500">#{ticket.ticketId || ticket._id?.slice(-4)}</span>
                    </h3>
                </div>

                {/* Metadata Row */}
                <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-[11px] text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1 flex-shrink-0">
                        <svg className="w-3 h-3 hidden md:block" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {requesterName} ({requesterLocation})
                    </span>
                    <span className="text-gray-400 flex-shrink-0 hidden md:inline">•</span>
                    <span className="flex-shrink-0 hidden md:inline">Agent responded: {getTimeAgo(ticket.lastUpdated || ticket.createdAt)}</span>
                    {isOverdue() && (
                        <>
                            <span className="text-gray-400 flex-shrink-0 hidden md:inline">•</span>
                            <span className="text-red-600 font-medium flex-shrink-0">Overdue by: {getOverdueDuration()}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Priority Indicator - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-1.5 min-w-[70px] flex-shrink-0">
                <span className={`w-2 h-2 rounded-full ${priorityColor} flex-shrink-0`}></span>
                <span className="text-xs text-gray-600 capitalize whitespace-nowrap">{ticket.priority || 'Low'} ▼</span>
            </div>

            {/* Customer/Company - Hidden on mobile and tablet */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-600 min-w-[120px] flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="truncate">Customer S... / -- / --</span>
            </div>

            {/* Status Dropdown */}
            <div className="relative flex-shrink-0">
                <select
                    value={ticket.status || 'open'}
                    onChange={(e) => {
                        e.stopPropagation();
                        // Handle status change
                    }}
                    className="text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 pr-5 md:pr-7 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-gray-700 cursor-pointer appearance-none min-w-[70px] md:min-w-[80px]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <option value="open">Open</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                </select>
                <svg className="w-2.5 md:w-3 h-2.5 md:h-3 absolute right-1.5 md:right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
};

export default TicketListRow;
