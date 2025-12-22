
import React from 'react';

const CustomerProfilePanel = ({ contactEmail, contactName }) => {
    // Mock data for demonstration - in real app, fetch this based on contactEmail
    const mockCustomer = {
        role: 'Product Manager',
        company: 'Acme Corp',
        location: 'San Francisco, CA',
        since: 'Oct 2023',
        ltv: '$12,450',
        tags: ['VIP', 'Early Adopter']
    };

    const mockHistory = [
        { id: 'TK-8859', subject: 'Login failing on Safari', status: 'closed', date: '2 days ago' },
        { id: 'TK-8821', subject: 'Need updated invoice', status: 'resolved', date: '1 week ago' },
        { id: 'TK-8740', subject: 'Feature request: Dark mode', status: 'open', date: '2 weeks ago' },
    ];

    if (!contactEmail) return null; // Parent handles rendering logic

    // Generate initials/avatar color
    const initials = (contactName || contactEmail || '?').substring(0, 2).toUpperCase();

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col shrink-0">

            {/* Header Profile Section */}
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-base font-bold shadow-md shadow-indigo-200 shrink-0">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-base font-bold text-gray-900 leading-tight truncate" title={contactName || contactEmail}>{contactName || contactEmail.split('@')[0]}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 truncate">
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <span className="truncate">{contactEmail}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <InfoItem label="Company" value={mockCustomer.company} icon="🏢" />
                    <InfoItem label="Role" value={mockCustomer.role} icon="💼" />
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    {mockCustomer.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] font-bold uppercase tracking-wider rounded border border-yellow-100">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Recent Activity Section - Compact View */}
            <div className="p-5 bg-white">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Recent Tickets
                </h4>

                <div className="space-y-2">
                    {mockHistory.slice(0, 2).map(ticket => ( // Only show 2 items to save space
                        <div key={ticket.id} className="group p-2.5 border border-gray-100 rounded-lg hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-0.5">
                                <span className="text-[10px] font-mono text-gray-500 group-hover:text-indigo-600 font-medium">{ticket.id}</span>
                                <span className={`text-[9px] px-1.5 py-0 rounded uppercase font-bold ${ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                                    ticket.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                    }`}>{ticket.status}</span>
                            </div>
                            <div className="text-xs font-medium text-gray-800 line-clamp-1">{ticket.subject}</div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-3 text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors text-center border-t border-gray-50 pt-2">
                    View All History →
                </button>
            </div>
        </div>
    );
};

const InfoItem = ({ label, value, icon }) => (
    <div>
        <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-0.5 flex items-center gap-1">
            <span>{icon}</span> {label}
        </div>
        <div className="text-xs font-semibold text-gray-700 truncate" title={value}>{value}</div>
    </div>
);

export default CustomerProfilePanel;
