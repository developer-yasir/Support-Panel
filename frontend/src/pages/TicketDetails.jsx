import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RichTextEditor from '../components/RichTextEditor';
import CustomSelect from '../components/CustomSelect';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { useSidebar } from '../contexts/SidebarContext';

const TicketDetails = () => {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const { isCollapsed } = useSidebar();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [agents, setAgents] = useState([]);
    const [clientCompanies, setClientCompanies] = useState([]);
    const [replyText, setReplyText] = useState('');
    const [activeTab, setActiveTab] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [propertiesSidebarCollapsed, setPropertiesSidebarCollapsed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [ticketRes, commentsRes, agentsRes, companiesRes] = await Promise.all([
                    api.get(`/tickets/${ticketId}`),
                    api.get(`/comments/ticket/${ticketId}`).catch(() => ({ data: [] })),
                    api.get('/users/agents').catch(() => ({ data: [] })),
                    api.get('/client-companies').catch(() => ({ data: [] }))
                ]);

                setTicket({
                    ...ticketRes.data,
                    comments: commentsRes.data
                });
                setAgents(agentsRes.data);
                setClientCompanies(companiesRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ticketId]);

    // Auto-scroll to reply section when active
    useEffect(() => {
        if (activeTab) {
            // Small timeout to ensure render
            setTimeout(() => {
                const element = document.getElementById('reply-section');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Try to focus the textarea if possible, or just the container
                    const textarea = element.querySelector('textarea, [contenteditable="true"]');
                    if (textarea) textarea.focus();
                }
            }, 100);
        }
    }, [activeTab]);



    const handlePropertyChange = async (field, value) => {
        try {
            await api.put(`/tickets/${ticketId}`, { [field]: value });
            setTicket(prev => ({ ...prev, [field]: value }));
        } catch (err) {
            console.error('Error updating ticket:', err);
        }
    };

    const handleSubmit = async () => {
        if (!replyText.trim()) return;
        setIsSubmitting(true);

        try {
            const response = await api.post(`/comments`, {
                ticketId: ticket._id,
                content: replyText,
                isInternal: activeTab === 'note'
            });

            setTicket(prev => ({
                ...prev,
                comments: [...(prev.comments || []), response.data]
            }));
            const draftKey = `ticket_${ticketId}_draft_${activeTab}`;
            localStorage.removeItem(draftKey);
            setReplyText('');
        } catch (err) {
            console.error('Error submitting comment:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/tickets/${ticketId}`);
            navigate('/tickets');
        } catch (err) {
            console.error('Error deleting ticket:', err);
        }
    };

    const formatTime = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const now = new Date();
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        let timeAgo = '';
        if (diffMins < 60) timeAgo = `${diffMins} mins ago`;
        else if (diffHours < 24) timeAgo = `${diffHours} hours ago`;
        else if (diffDays < 30) timeAgo = `${diffDays} days ago`;
        else if (diffMonths < 12) timeAgo = `${diffMonths} months ago`;
        else timeAgo = `${diffYears} years ago`;

        const fullDate = d.toLocaleString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        return `${timeAgo} (${fullDate})`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading ticket...</p>
                </div>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || 'Ticket not found'}</p>
                    <button
                        onClick={() => navigate('/tickets')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Back to Tickets
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <Navbar />

            <div
                className="transition-all duration-300"
                style={{
                    marginLeft: isCollapsed ? '75px' : '277px',
                    marginTop: '66px'
                }}
            >
                {/* Top Bar - Clean & Informative */}
                <div className="bg-white border-b border-gray-200 sticky top-[64px] z-10 shadow-sm">
                    <div className="px-6 py-4">
                        {/* BreadCrumb & Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                    <button
                                        onClick={() => navigate('/tickets')}
                                        className="hover:text-gray-900 transition-colors"
                                    >
                                        All unresolved tickets
                                    </button>
                                    <span>›</span>
                                    <span className="font-medium text-gray-900">
                                        {ticket.ticketId || `TK-${ticket._id?.slice(-4)}`}
                                    </span>
                                </div>
                                <h1 className="text-xl font-bold text-gray-900 line-clamp-1">{ticket.title}</h1>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-right mr-2 hidden sm:block">
                                    <div className="text-xs font-medium text-gray-500">
                                        {ticket.status === 'resolved' ? 'Resolved' : 'Created'}
                                    </div>
                                    <div className="text-sm text-gray-900">
                                        {formatTime(ticket.createdAt)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Toolbar - Actions */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setActiveTab('reply');
                                        if (!replyText) {
                                            const name = ticket.createdBy?.name || 'Customer';
                                            setReplyText(`Hi ${name},\n\n\n\nBest Regards,\nSupport Team`);
                                        }
                                    }}
                                    className="btn-toolbar flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                    Reply
                                </button>
                                <button onClick={() => setActiveTab('note')} className="btn-toolbar flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    Add note
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab('forward');
                                        const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' });
                                        const sender = ticket.createdBy?.name || 'Sender';
                                        const email = ticket.createdBy?.email || 'email@example.com';

                                        const forwardTemplate = `\n\n\n\n---------- Forwarded message ---------\nFrom: ${sender} <${email}>\nDate: ${date}\nSubject: ${ticket.title}\nTo: Support <support@innovent.io>\n\nPlease take a look at ticket #${ticket.ticketId || ticket._id?.slice(-4)} raised by ${sender} (${email}).\n\nBest Regards,\n**INNOVENT Support Team | INNOVENT Tech**\n\n![Innovent Logo](https://innovent.io/images/logo.png)\n\nEmail: [support@innovent.io](mailto:support@innovent.io)\nWebsite: [www.innovent.io](https://www.innovent.io)`;

                                        setReplyText(forwardTemplate);
                                    }}
                                    className="btn-toolbar flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    Forward
                                </button>

                                <div className="h-8 w-px bg-gray-300 mx-2"></div>

                                <button className="btn-toolbar flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Close
                                </button>
                                <button className="btn-toolbar flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                    Merge
                                </button>
                                <button onClick={() => setShowDeleteModal(true)} className="btn-toolbar flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Delete
                                </button>
                            </div>

                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
                                onClick={() => setPropertiesSidebarCollapsed(!propertiesSidebarCollapsed)}>
                                {propertiesSidebarCollapsed ? 'Show Properties' : 'Hide Properties'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex">
                    {/* Left - Conversation Thread */}
                    <div className="flex-1 p-6">
                        {/* Initial Ticket Message - Clean Open Style */}
                        <div className="group bg-white border-b border-gray-100 mb-[10px] p-5">
                            <div className="flex gap-6">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-yellow-200 text-yellow-700 ring-2 ring-white flex items-center justify-center text-sm font-bold shadow-sm">
                                        {ticket.createdBy?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                </div>

                                {/* Content Block */}
                                <div className="flex-1 min-w-0">
                                    {/* Header Row */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-bold text-gray-900 text-[15px]">
                                                    {ticket.createdBy?.name || ticket.createdBy?.email || 'Unknown User'}
                                                </span>
                                                <span className="text-gray-500 text-sm">reported via email</span>
                                            </div>
                                            <div className="text-sm text-gray-400 italic">
                                                {formatTime(ticket.createdAt)}
                                            </div>
                                        </div>

                                        {/* Top Right Actions */}
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={() => {
                                                    setActiveTab('reply');
                                                    setTimeout(() => document.getElementById('reply-text')?.focus(), 0);
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded border border-transparent hover:border-gray-200 transition-all"
                                                title="Reply"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Ticket Title (Subject) */}
                                    <div className="mb-4">
                                        <h2 className="text-base font-bold text-gray-900">{ticket.title}</h2>
                                    </div>

                                    {/* Recipients */}
                                    <div className="flex items-start gap-3 mb-6 border-b border-gray-200 pb-6">
                                        <div className="mt-0.5 text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div className="text-sm leading-relaxed">
                                            <div className="text-gray-900">
                                                <span className="text-gray-500">To:</span>{' '}
                                                <span className="text-blue-600 font-medium">{ticket.contactEmail || ticket.createdBy?.email || 'No recipient specified'}</span>
                                                {ticket.cc && ((Array.isArray(ticket.cc) && ticket.cc.length > 0) || (typeof ticket.cc === 'string' && ticket.cc.trim())) && (
                                                    <span className="ml-2">
                                                        <span className="text-gray-500">Cc:</span>{' '}
                                                        <span className="text-blue-600 font-medium">
                                                            {Array.isArray(ticket.cc) ? ticket.cc.join(', ') : ticket.cc}
                                                        </span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="prose prose-sm max-w-none text-gray-800 mb-4">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkBreaks, remarkGfm]}
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-4 leading-normal" {...props} />,
                                                a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                                                strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                                                em: ({ node, ...props }) => <em className="italic text-gray-700" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
                                                img: ({ node, ...props }) => <img className="max-w-full rounded-md my-2" {...props} />
                                            }}
                                        >
                                            {ticket.description}
                                        </ReactMarkdown>
                                    </div>

                                    {/* Footer Actions */}
                                    {/* <button className="..." /> - Hiding footer actions to clean up UI as requested */}
                                </div>
                            </div>
                        </div>

                        {/* Replies/Comments - Clean White Card Style */}
                        {ticket.comments && ticket.comments.length > 0 && (
                            <div className="flex flex-col gap-[10px]">
                                {ticket.comments.map((comment, index) => (
                                    <div key={comment._id || index} className={`group bg-[#f5f7f9] rounded-2xl p-5 border border-white shadow-sm hover:shadow-md transition-all duration-200 ${comment.isInternal ? 'border-yellow-200 bg-yellow-50/10' : ''}`}>
                                        <div className="flex gap-6">
                                            {/* Avatar */}
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 rounded-full bg-yellow-200 text-yellow-700 ring-2 ring-white flex items-center justify-center text-sm font-bold shadow-sm">
                                                    {comment.author?.name?.charAt(0)?.toUpperCase() || 'S'}
                                                </div>
                                            </div>

                                            {/* Content Block */}
                                            <div className="flex-1 min-w-0">
                                                {/* Header Row */}
                                                <div className="flex items-start justify-between mb-[15px]">
                                                    <div>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="font-bold text-gray-900 text-[15px]">
                                                                {comment.author?.name || 'Support Agent'}
                                                            </span>
                                                            <span className="text-gray-500 text-sm">replied</span>
                                                        </div>
                                                        <div className="text-sm text-gray-400 italic">
                                                            {formatTime(comment.createdAt)}
                                                        </div>
                                                    </div>

                                                    {/* Top Right Actions */}
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded border border-transparent hover:border-gray-200 transition-all" title="Reply">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                                        </button>
                                                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-100 transition-all" title="Delete">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Recipients */}
                                                <div className="flex items-start gap-3 mb-[15px] border-b border-gray-200 pb-[15px]">
                                                    <div className="mt-0.5 text-gray-400">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                    </div>
                                                    <div className="text-sm leading-relaxed">
                                                        <div className="text-gray-900">
                                                            <span className="text-gray-500">To:</span>{' '}
                                                            <span className="text-blue-600 font-medium">{comment.to || ticket.contactEmail || 'Customer'}</span>
                                                            {comment.cc && (
                                                                <span className="ml-2">
                                                                    <span className="text-gray-500">Cc:</span>{' '}
                                                                    <span className="text-blue-600 font-medium">{comment.cc}</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Body */}
                                                <div className="prose prose-sm max-w-none text-gray-800 mb-[15px]">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkBreaks, remarkGfm]}
                                                        components={{
                                                            p: ({ node, ...props }) => <p className="mb-4 leading-normal" {...props} />,
                                                            a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                                                            strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                                                            em: ({ node, ...props }) => <em className="italic text-gray-700" {...props} />,
                                                            ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
                                                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
                                                            img: ({ node, ...props }) => <img className="max-w-full rounded-md my-2" {...props} />
                                                        }}
                                                    >
                                                        {comment.content}
                                                    </ReactMarkdown>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Bottom Action Bar */}
                        <div className="flex items-center gap-3 mb-6">
                            <button
                                onClick={() => {
                                    setActiveTab('reply');
                                    setTimeout(() => document.getElementById('reply-text')?.focus(), 0);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                Reply
                            </button>
                            <button
                                onClick={() => setActiveTab('note')}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Add note
                            </button>
                            <button
                                onClick={() => setActiveTab('forward')}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                Forward
                            </button>
                        </div>

                        {/* Reply Editor */}
                        {activeTab && (
                            <div id="reply-section" className={`scroll-mt-20 bg-white border rounded-lg shadow-sm overflow-hidden ${activeTab === 'note' ? 'border-yellow-200 bg-yellow-50/30' : 'border-gray-200'}`}>
                                <div className="p-6">
                                    {activeTab === 'forward' && (
                                        <div className="mb-4 bg-white border border-gray-200 rounded p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-medium text-xs">S</div>
                                                    <span>From: <strong>Support_Innovent</strong> (support@innovent.io)</span>
                                                </div>
                                                <div className="text-gray-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 border border-blue-500 rounded px-3 py-2 bg-white shadow-sm ring-1 ring-blue-100">
                                                <span className="text-gray-500 text-sm font-medium">To:</span>
                                                <input
                                                    type="text"
                                                    className="flex-1 outline-none text-sm text-gray-900"
                                                    autoFocus
                                                />
                                                <div className="flex items-center gap-3 text-sm text-blue-600 font-medium">
                                                    <button className="hover:underline">Cc</button>
                                                    <button className="hover:underline">Bcc</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <RichTextEditor
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder={activeTab === 'note' ? 'Add an internal note...' : 'Write your reply...'}
                                    />
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="text-xs text-gray-500">
                                            {activeTab === 'note' && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                    </svg>
                                                    This note will only be visible to agents
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setActiveTab(null);
                                                    setReplyText('');
                                                }}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSubmit}
                                                className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${activeTab === 'note'
                                                    ? 'bg-yellow-500 hover:bg-yellow-600'
                                                    : 'bg-indigo-600 hover:bg-indigo-700'
                                                    }`}
                                            >
                                                {activeTab === 'note' ? 'Add Note' : activeTab === 'forward' ? 'Forward' : 'Send Reply'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right - Properties Sidebar */}
                    <div className={`border-l border-gray-200 bg-white transition-all duration-300 flex flex-col sticky top-[207px] h-[calc(100vh-207px)] ${propertiesSidebarCollapsed ? 'w-0 overflow-hidden' : 'w-80'}`}>
                        {!propertiesSidebarCollapsed && (
                            <>
                                <div className="p-5 flex-1 overflow-y-auto">
                                    {/* Status Header */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Open</h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                            <span className="font-medium">RESOLUTION DUE</span>
                                            <button className="text-blue-600 hover:text-blue-700 font-medium">Edit</button>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            by {ticket.dueDate ? formatTime(ticket.dueDate) : 'Sat, Oct 4, 2025 8:38 PM'}
                                        </div>
                                    </div>

                                    <div className="h-px bg-gray-100 mb-6"></div>

                                    {/* Properties Form */}
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-4">Properties</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Tags</label>
                                                <input
                                                    type="text"
                                                    value={ticket.tags?.join(', ') || ''}
                                                    onChange={(e) => handlePropertyChange('tags', e.target.value.split(',').map(t => t.trim()))}
                                                    className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50 hover:bg-white"
                                                    placeholder="Add tags..."
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Type</label>
                                                <CustomSelect
                                                    value={ticket.type}
                                                    onChange={(value) => handlePropertyChange('type', value)}
                                                    options={[
                                                        { value: 'question', label: 'Question' },
                                                        { value: 'incident', label: 'Incident' },
                                                        { value: 'problem', label: 'Problem' },
                                                        { value: 'feature', label: 'Feature Request' }
                                                    ]}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Status <span className="text-red-500">*</span></label>
                                                <CustomSelect
                                                    value={ticket.status}
                                                    onChange={(value) => handlePropertyChange('status', value)}
                                                    options={[
                                                        { value: 'open', label: 'Open' },
                                                        { value: 'pending', label: 'Pending' },
                                                        { value: 'resolved', label: 'Resolved' },
                                                        { value: 'closed', label: 'Closed' }
                                                    ]}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Priority</label>
                                                <CustomSelect
                                                    value={ticket.priority}
                                                    onChange={(value) => handlePropertyChange('priority', value)}
                                                    options={[
                                                        { value: 'low', label: '⬇️ Low' },
                                                        { value: 'medium', label: '➡️ Medium' },
                                                        { value: 'high', label: '⬆️ High' },
                                                        { value: 'urgent', label: '🔥 Urgent' }
                                                    ]}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Group</label>
                                                <CustomSelect
                                                    value={ticket.group}
                                                    onChange={(value) => handlePropertyChange('group', value)}
                                                    options={[
                                                        { value: 'customer_support', label: 'Customer Support' },
                                                        { value: 'technical', label: 'Technical' },
                                                        { value: 'billing', label: 'Billing' }
                                                    ]}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Agent</label>
                                                <CustomSelect
                                                    value={ticket.assignedTo?._id}
                                                    onChange={(value) => handlePropertyChange('assignedTo', value)}
                                                    options={[
                                                        { value: '', label: '-- Unassigned --' },
                                                        ...agents.map(agent => ({ value: agent._id, label: agent.name }))
                                                    ]}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Company <span className="text-red-500">*</span></label>
                                                <CustomSelect
                                                    value={ticket.company}
                                                    onChange={(value) => handlePropertyChange('company', value)}
                                                    options={clientCompanies.map(company => ({
                                                        value: company._id,
                                                        label: company.name
                                                    }))}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Category <span className="text-red-500">*</span></label>
                                                <CustomSelect
                                                    value={ticket.category}
                                                    onChange={(value) => handlePropertyChange('category', value)}
                                                    options={[
                                                        { value: 'software', label: 'Software/Solutions' },
                                                        { value: 'hardware', label: 'Hardware/Devices' },
                                                        { value: 'network', label: 'Network' }
                                                    ]}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Types <span className="text-red-500">*</span></label>
                                                <CustomSelect
                                                    value={ticket.types}
                                                    onChange={(value) => handlePropertyChange('types', value)}
                                                    options={[
                                                        { value: 'forkeye', label: 'Forkeye' },
                                                        { value: 'other', label: 'Other' }
                                                    ]}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Specific Version <span className="text-red-500">*</span></label>
                                                <CustomSelect
                                                    value={ticket.specificVersion}
                                                    onChange={(value) => handlePropertyChange('specificVersion', value)}
                                                    options={[
                                                        { value: 'v1', label: 'Version 1' },
                                                        { value: 'v2', label: 'Version 2' }
                                                    ]}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Store/Location/Site Code <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    value={ticket.storeLocation || ''}
                                                    onChange={(e) => handlePropertyChange('storeLocation', e.target.value)}
                                                    className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50 hover:bg-white"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">City</label>
                                                <input
                                                    type="text"
                                                    value={ticket.city || ''}
                                                    onChange={(e) => handlePropertyChange('city', e.target.value)}
                                                    className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50 hover:bg-white"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Country <span className="text-red-500">*</span></label>
                                                <CustomSelect
                                                    value={ticket.country}
                                                    onChange={(value) => handlePropertyChange('country', value)}
                                                    options={[
                                                        { value: 'uae', label: 'United Arab Emirates' },
                                                        { value: 'saudi', label: 'Saudi Arabia' },
                                                        { value: 'qatar', label: 'Qatar' }
                                                    ]}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 border-t border-gray-200 bg-gray-50 sticky bottom-0 z-10">
                                    <button
                                        onClick={() => handlePropertyChange('updated', true)}
                                        className="w-full h-11 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center justify-center gap-2"
                                    >
                                        Update
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            {
                showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h3 className="text-lg font-bold mb-2">Delete Ticket?</h3>
                            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default TicketDetails;
