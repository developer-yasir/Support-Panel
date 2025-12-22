import React from 'react';

const SLATimer = ({ ticket }) => {
    const calculateSLATime = () => {
        if (!ticket || ticket.status === 'resolved' || ticket.status === 'closed') {
            return null;
        }

        // SLA times based on priority (in hours)
        const slaHours = {
            urgent: 1,
            high: 4,
            medium: 24,
            low: 48
        };

        const hours = slaHours[ticket.priority] || 24;
        const createdAt = new Date(ticket.createdAt);
        const dueDate = new Date(createdAt.getTime() + hours * 60 * 60 * 1000);
        const now = new Date();
        const timeRemaining = dueDate - now;

        // Calculate hours and minutes remaining
        const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

        const isOverdue = timeRemaining < 0;
        const isCritical = timeRemaining < (hours * 0.25 * 60 * 60 * 1000); // Last 25% of time
        const isWarning = timeRemaining < (hours * 0.5 * 60 * 60 * 1000); // Last 50% of time

        return {
            dueDate,
            timeRemaining,
            hoursRemaining: Math.abs(hoursRemaining),
            minutesRemaining: Math.abs(minutesRemaining),
            isOverdue,
            isCritical,
            isWarning,
            totalSLAHours: hours
        };
    };

    const sla = calculateSLATime();

    if (!sla) {
        return null;
    }

    const getStatusClass = () => {
        if (sla.isOverdue) return 'sla-timer-overdue';
        if (sla.isCritical) return 'sla-timer-critical';
        if (sla.isWarning) return 'sla-timer-warning';
        return 'sla-timer-good';
    };

    const getStatusIcon = () => {
        if (sla.isOverdue) {
            return (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            );
        }
        return (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        );
    };

    return (
        <div className={`sla-timer ${getStatusClass()}`}>
            <div className="sla-timer-icon">
                {getStatusIcon()}
            </div>
            <div className="sla-timer-content">
                <div className="sla-timer-label">
                    {sla.isOverdue ? 'SLA Breached' : 'Response Due'}
                </div>
                <div className="sla-timer-time">
                    {sla.isOverdue && '+ '}
                    {sla.hoursRemaining}h {sla.minutesRemaining}m
                    {!sla.isOverdue && ' remaining'}
                </div>
                <div className="sla-timer-date">
                    {sla.dueDate.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
        </div>
    );
};

export default SLATimer;
