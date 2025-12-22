import React from 'react';

const ActivityTimeline = ({ ticket }) => {
    const getActivityEvents = () => {
        const events = [];

        // Ticket created event
        events.push({
            id: 'created',
            type: 'created',
            timestamp: ticket.createdAt,
            user: ticket.createdBy,
            description: 'Ticket created'
        });

        // Add comments as events
        if (ticket.comments && ticket.comments.length > 0) {
            ticket.comments.forEach((comment, index) => {
                events.push({
                    id: `comment-${comment._id || index}`,
                    type: comment.isInternal ? 'note' : 'reply',
                    timestamp: comment.createdAt,
                    user: comment.createdBy || comment.author,
                    description: comment.isInternal ? 'Added internal note' : 'Posted reply',
                    content: comment.content
                });
            });
        }

        // Sort by timestamp
        return events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    };

    const getEventIcon = (type) => {
        switch (type) {
            case 'created':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                );
            case 'reply':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                );
            case 'note':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z M11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                );
            case 'status_change':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                );
            case 'assigned':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                );
        }
    };

    const getEventClass = (type) => {
        switch (type) {
            case 'created':
                return 'timeline-event-created';
            case 'reply':
                return 'timeline-event-reply';
            case 'note':
                return 'timeline-event-note';
            case 'status_change':
                return 'timeline-event-status';
            case 'assigned':
                return 'timeline-event-assigned';
            default:
                return 'timeline-event-default';
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const events = getActivityEvents();

    return (
        <div className="activity-timeline">
            <h3 className="freshdesk-sidebar-title">Activity</h3>
            <div className="timeline-events">
                {events.map((event, index) => (
                    <div key={event.id} className={`timeline-event ${getEventClass(event.type)}`}>
                        <div className="timeline-event-line">
                            {index < events.length - 1 && <div className="timeline-connector"></div>}
                        </div>
                        <div className="timeline-event-icon">
                            {getEventIcon(event.type)}
                        </div>
                        <div className="timeline-event-content">
                            <div className="timeline-event-header">
                                <span className="timeline-event-user">
                                    {event.user?.name || 'System'}
                                </span>
                                <span className="timeline-event-action">{event.description}</span>
                            </div>
                            {event.content && (
                                <div className="timeline-event-text">
                                    {event.content.length > 100
                                        ? `${event.content.substring(0, 100)}...`
                                        : event.content}
                                </div>
                            )}
                            <div className="timeline-event-timestamp">
                                {formatTimestamp(event.timestamp)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityTimeline;
