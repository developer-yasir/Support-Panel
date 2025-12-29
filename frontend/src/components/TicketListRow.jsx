import React, { useState } from 'react';

const TicketListRow = ({ ticket, isSelected, onSelect, onClick, onPriorityChange, onAssignmentChange, onStatusChange }) => {
    // Dropdown states
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [showAssignedDropdown, setShowAssignedDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
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

    // Get status badge styling
    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'open':
                return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Open' };
            case 'in_progress':
                return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'In Progress' };
            case 'resolved':
                return { bg: 'bg-green-100', text: 'text-green-700', label: 'Resolved' };
            case 'closed':
                return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Closed' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Open' };
        }
    };

    // Get hover border color based on priority
    const getHoverBorderColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'urgent':
                return 'hover:border-l-red-500';
            case 'high':
                return 'hover:border-l-orange-400';
            case 'medium':
                return 'hover:border-l-yellow-400';
            case 'low':
                return 'hover:border-l-green-500';
            default:
                return 'hover:border-l-gray-400';
        }
    };

    const statusBadge = getStatusBadge(ticket.status);
    const hoverBorderColor = getHoverBorderColor(ticket.priority);

    return (
        <div
            className={`flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 border-b border-l-4 border-l-transparent border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent cursor-pointer transition-all duration-200 group hover:shadow-sm ${hoverBorderColor}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            aria-label={`Ticket ${ticket.ticketId || ticket._id?.slice(-4)}: ${ticket.title || ticket.subject}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
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
            <div className={`w-10 h-10 md:w-11 md:h-11 rounded-full ${getAvatarColor(requesterName)} flex items-center justify-center text-white font-bold text-sm md:text-base flex-shrink-0 ring-2 ring-white shadow-md`}>
                {getInitials(requesterName)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Title with Overdue Badge */}
                <div className="flex items-center gap-2 mb-1.5">
                    {isOverdue() && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-semibold rounded uppercase tracking-wide flex-shrink-0 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Overdue
                        </span>
                    )}
                    <h3 className="text-sm md:text-[15px] font-semibold text-gray-900 truncate">
                        {ticket.title || ticket.subject}
                    </h3>
                    <span className="font-mono text-[11px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-medium flex-shrink-0">
                        #{ticket.ticketId || ticket._id?.slice(-4)}
                    </span>
                </div>

                {/* Metadata Row */}
                <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-[11px] text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1.5 flex-shrink-0 font-medium">
                        <svg className="w-3.5 h-3.5 hidden md:block text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {requesterName} ({requesterLocation})
                    </span>
                    <span className="text-gray-300 flex-shrink-0 hidden md:inline">•</span>
                    <span className="hidden md:inline-flex items-center justify-center gap-1 flex-shrink-0 text-gray-500">
                        {ticket.lastRespondedBy ? (
                            <>
                                {['support_agent', 'company_manager', 'superadmin'].includes(ticket.lastRespondedBy.role)
                                    ? 'Agent responded: '
                                    : 'Customer responded: '}
                                {getTimeAgo(ticket.lastRespondedAt || ticket.updatedAt || ticket.createdAt)}
                            </>
                        ) : (
                            <>Created: {getTimeAgo(ticket.createdAt)}</>
                        )}
                    </span>
                    {ticket.dueDate && (
                        <>
                            <span className="text-gray-300 flex-shrink-0 hidden md:inline">•</span>
                            <span className="hidden md:inline-flex items-center justify-center gap-1 flex-shrink-0 text-gray-500">
                                Due in: {(() => {
                                    const now = new Date();
                                    const due = new Date(ticket.dueDate);
                                    const diffInDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
                                    if (diffInDays < 0) return `${Math.abs(diffInDays)} days overdue`;
                                    if (diffInDays === 0) return 'Today';
                                    if (diffInDays === 1) return '1 day';
                                    return `${diffInDays} days`;
                                })()}
                            </span>
                        </>
                    )}
                    {isOverdue() && (
                        <>
                            <span className="text-gray-300 flex-shrink-0 hidden md:inline">•</span>
                            <span className="text-red-600 font-semibold flex-shrink-0 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                Overdue by {getOverdueDuration()}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Priority, Customer, Status - Single Column with refined styling */}
            <div
                className="flex flex-col gap-2.5 w-[240px] flex-shrink-0 pl-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Priority Dropdown */}
                <div className="flex items-center gap-2 relative">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide w-14 flex-shrink-0">Priority</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowPriorityDropdown(!showPriorityDropdown);
                            setShowAssignedDropdown(false);
                            setShowStatusDropdown(false);
                        }}
                        className="flex items-center gap-1.5 hover:bg-gray-100 px-2 py-1 rounded transition-colors cursor-pointer"
                    >
                        <span className={`w-2.5 h-2.5 rounded-full ${priorityColor} flex-shrink-0 shadow-sm`}></span>
                        <span className="text-xs text-gray-700 font-medium capitalize">{ticket.priority || 'Low'}</span>
                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {showPriorityDropdown && (
                        <div className="absolute top-full left-14 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                            {['urgent', 'high', 'medium', 'low'].map((priority) => (
                                <button
                                    key={priority}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowPriorityDropdown(false);
                                        onPriorityChange(ticket._id, priority);
                                    }}
                                    className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg"
                                >
                                    <span className={`w-2.5 h-2.5 rounded-full ${getPriorityColor(priority)} flex-shrink-0`}></span>
                                    <span className="capitalize">{priority}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Assigned To Dropdown */}
                <div className="flex items-center gap-2 relative">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide w-14 flex-shrink-0">Assigned</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowAssignedDropdown(!showAssignedDropdown);
                            setShowPriorityDropdown(false);
                            setShowStatusDropdown(false);
                        }}
                        className="flex items-center gap-1.5 text-xs text-gray-700 flex-1 min-w-0 hover:bg-gray-100 px-2 py-1 rounded transition-colors cursor-pointer"
                    >
                        <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="truncate">{ticket.assignedTo?.name || 'Unassigned'}</span>
                        <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {showAssignedDropdown && (
                        <div className="absolute top-full left-14 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAssignedDropdown(false);
                                    onAssignmentChange(ticket._id, null);
                                }}
                                className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                            >
                                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="text-gray-500">Unassigned</span>
                            </button>
                            {['Admin User', 'SharafDG Agent 1', 'SharafDG Agent 2', 'SharafDG Agent 3', 'SharafDG User 1'].map((agent) => (
                                <button
                                    key={agent}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowAssignedDropdown(false);
                                        onAssignmentChange(ticket._id, agent);
                                    }}
                                    className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <div className={`w-6 h-6 rounded-full ${getAvatarColor(agent)} flex items-center justify-center text-white text-[10px] font-semibold`}>
                                        {getInitials(agent)}
                                    </div>
                                    <span>{agent}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Status Dropdown */}
                <div className="flex items-center gap-2 relative">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide w-14 flex-shrink-0">Status</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowStatusDropdown(!showStatusDropdown);
                            setShowPriorityDropdown(false);
                            setShowAssignedDropdown(false);
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-medium ${statusBadge.bg} ${statusBadge.text} hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1`}
                        aria-label={`Change status from ${statusBadge.label}`}
                    >
                        {statusBadge.label}
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {showStatusDropdown && (
                        <div className="absolute top-full left-14 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                            {[
                                { value: 'open', label: 'Open', bg: 'bg-blue-100', text: 'text-blue-700' },
                                { value: 'in_progress', label: 'In Progress', bg: 'bg-yellow-100', text: 'text-yellow-700' },
                                { value: 'resolved', label: 'Resolved', bg: 'bg-green-100', text: 'text-green-700' },
                                { value: 'closed', label: 'Closed', bg: 'bg-gray-100', text: 'text-gray-700' }
                            ].map((status) => (
                                <button
                                    key={status.value}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowStatusDropdown(false);
                                        onStatusChange(ticket._id, status.value);
                                    }}
                                    className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${status.bg} ${status.text} font-medium`}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketListRow;
