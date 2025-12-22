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
    const [replyText, setReplyText] = useState('');
    const [activeTab, setActiveTab] = useState('reply');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [ticketRes, commentsRes, agentsRes] = await Promise.all([
                    api.get(`/tickets/${ticketId}`),
                    api.get(`/comments/ticket/${ticketId}`).catch(() => ({ data: [] })),
                    api.get('/users/agents').catch(() => ({ data: [] }))
                ]);

                setTicket({
                    ...ticketRes.data,
                    comments: commentsRes.data
                });
                setAgents(agentsRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ticketId]);

    const handlePropertyChange = async (field, value) => {
        try {
            await api.patch(`/tickets/${ticketId}`, { [field]: value });
            setTicket(prev => ({ ...prev, [field]: value }));
        } catch (err) {
            console.error('Error updating ticket:', err);
        }
    };

    const handleSubmit = async () => {
        if (!replyText.trim()) return;

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
            setReplyText('');
        } catch (err) {
            console.error('Error submitting comment:', err);
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
        const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));

        const timeStr = d.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        if (diffDays === 0) return `today (${timeStr})`;
        if (diffDays === 1) return `yesterday (${timeStr})`;
        return `${diffDays} days ago (${d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })})`;
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
                className="transition-all duration-300 mt-16"
                style={{ marginLeft: isCollapsed ? '69px' : '265px' }}
            >
                {/* Top Bar */}
                <div className="bg-white border-b border-gray-200">
                    <div className="px-6 py-3">
                        {/* Breadcrumb */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-sm">
                                <button
                                    onClick={() => navigate('/tickets')}
                                    className="text-indigo-600 hover:underline"
                                >
                                    All unresolved tickets
                                </button>
                                <span className="text-gray-400">›</span>
                                <span className="text-gray-700">{ticket.ticketId || ticket._id?.slice(-4)}</span>
                            </div>
                            {ticket.status === 'resolved' && (
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-gray-900">Resolved on time</div>
                                    <div className="text-xs text-gray-500">by {formatTime(ticket.updatedAt)}</div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Close
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                    Merge
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </button>
                                <button className="p-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                    </svg>
                                </button>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Show activities
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex">
                    {/* Left - Conversation Thread */}
                    <div className="flex-1 p-6">
                        {/* Initial Ticket Message */}
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4 overflow-hidden">
                            {/* Message Header */}
                            <div className="px-6 py-4 border-b border-gray-100">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                                            {ticket.createdBy?.name?.charAt(0)?.toUpperCase() || 'M'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-gray-900">{ticket.createdBy?.name || 'Unknown'}</span>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-sm text-gray-500">{formatTime(ticket.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <span>via email</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Ticket Title */}
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">{ticket.title}</h2>

                                {/* To/Cc - Compact Inline Display */}
                                <div className="text-xs space-y-1">
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 font-medium min-w-[24px]">To:</span>
                                        <span className="text-gray-700 leading-relaxed">
                                            "kamran"@innovent.io, "aby.j"@innovent.io, "rohan.singhvi"@rakceramics.com, "irtaza.m"@innovent.io, "anjum"@innovent.io, "Support_Innovent" &lt;support@innovent.io&gt;
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 font-medium min-w-[24px]">Cc:</span>
                                        <span className="text-gray-700 leading-relaxed">
                                            {ticket.cc?.join(', ') || 'rohan.singhvi@rakceramics.com, irtaza.m@innovent.io, anjum@innovent.io, pravin.patil@rakceramics.com'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Message Content with Markdown Rendering */}
                            <div className="px-6 py-5">
                                <div className="prose prose-sm max-w-none text-gray-800">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkBreaks, remarkGfm]}
                                        components={{
                                            p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
                                            strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                                            em: ({ node, ...props }) => <em className="italic text-gray-700" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
                                            li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                                            code: ({ node, inline, ...props }) =>
                                                inline ?
                                                    <code className="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded text-xs font-mono" {...props} /> :
                                                    <code className="block p-3 bg-gray-50 rounded text-xs font-mono overflow-x-auto" {...props} />
                                        }}
                                    >
                                        {ticket.description}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        {/* Replies/Comments */}
                        {ticket.comments && ticket.comments.length > 0 && ticket.comments.map((comment, index) => (
                            <div key={comment._id || index} className={`bg-white border border-gray-200 rounded-lg shadow-sm mb-4 overflow-hidden ${comment.isInternal ? 'border-l-4 border-l-yellow-400 bg-yellow-50/30' : ''}`}>
                                <div className="px-6 py-4">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                                            {comment.author?.name?.charAt(0)?.toUpperCase() || 'S'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-gray-900">{comment.author?.name || 'Support Agent'}</span>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-sm text-gray-500">{formatTime(comment.createdAt)}</span>
                                                {comment.isInternal && (
                                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">Internal Note</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {comment.to && (
                                        <div className="text-xs space-y-1 mb-3">
                                            <div className="flex items-start gap-2">
                                                <span className="text-gray-500 font-medium min-w-[24px]">To:</span>
                                                <span className="text-gray-700 leading-relaxed">{comment.to}</span>
                                            </div>
                                            {comment.cc && (
                                                <div className="flex items-start gap-2">
                                                    <span className="text-gray-500 font-medium min-w-[24px]">Cc:</span>
                                                    <span className="text-gray-700 leading-relaxed">{comment.cc}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="prose prose-sm max-w-none text-gray-800">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkBreaks, remarkGfm]}
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
                                                strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                                                em: ({ node, ...props }) => <em className="italic text-gray-700" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
                                                li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                                                code: ({ node, inline, ...props }) =>
                                                    inline ?
                                                        <code className="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded text-xs font-mono" {...props} /> :
                                                        <code className="block p-3 bg-gray-50 rounded text-xs font-mono overflow-x-auto" {...props} />
                                            }}
                                        >
                                            {comment.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Reply/Note Buttons */}
                        <div className="flex items-center gap-2 mb-4">
                            <button
                                onClick={() => setActiveTab('reply')}
                                className={`flex items-center gap-2 px-4 py-2 text-sm rounded border ${activeTab === 'reply'
                                    ? 'bg-white border-gray-300 shadow-sm'
                                    : 'bg-gray-50 border-gray-200 text-gray-600'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                                Reply
                            </button>
                            <button
                                onClick={() => setActiveTab('note')}
                                className={`flex items-center gap-2 px-4 py-2 text-sm rounded border ${activeTab === 'note'
                                    ? 'bg-white border-gray-300 shadow-sm'
                                    : 'bg-gray-50 border-gray-200 text-gray-600'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Add note
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm rounded border bg-gray-50 border-gray-200 text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Forward
                            </button>
                        </div>

                        {/* Reply Editor */}
                        {activeTab && (
                            <div className={`bg-white border rounded-lg shadow-sm overflow-hidden ${activeTab === 'note' ? 'border-yellow-200 bg-yellow-50/30' : 'border-gray-200'}`}>
                                <div className="p-6">
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
                                                className={`px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors ${activeTab === 'note'
                                                    ? 'bg-yellow-500 hover:bg-yellow-600 shadow-sm'
                                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-sm'
                                                    }`}
                                            >
                                                {activeTab === 'note' ? 'Add Note' : 'Send Reply'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right - Properties Sidebar */}
                    <div className="w-80 border-l border-gray-200 bg-white p-4">
                        <div className="mb-4">
                            <h3 className="text-xs font-semibold text-gray-700 uppercase mb-3">Properties</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Tags</label>
                                    <input
                                        type="text"
                                        value={ticket.tags?.join(', ') || ''}
                                        onChange={(e) => handlePropertyChange('tags', e.target.value.split(',').map(t => t.trim()))}
                                        className="w-full h-11 px-3 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Type</label>
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
                                    <label className="block text-xs text-gray-600 mb-1">Status *</label>
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
                                    <label className="block text-xs text-gray-600 mb-1">Priority</label>
                                    <CustomSelect
                                        value={ticket.priority}
                                        onChange={(value) => handlePropertyChange('priority', value)}
                                        options={[
                                            { value: 'low', label: 'Low' },
                                            { value: 'medium', label: 'Medium' },
                                            { value: 'high', label: 'High' },
                                            { value: 'urgent', label: 'Urgent' }
                                        ]}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Group</label>
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
                                    <label className="block text-xs text-gray-600 mb-1">Agent</label>
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
                                    <label className="block text-xs text-gray-600 mb-1">Company *</label>
                                    <CustomSelect
                                        value={ticket.company}
                                        onChange={(value) => handlePropertyChange('company', value)}
                                        options={[
                                            { value: 'RAK', label: 'RAK' },
                                            { value: 'innovent', label: 'Innovent' }
                                        ]}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Category *</label>
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
                                    <label className="block text-xs text-gray-600 mb-1">Types *</label>
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
                                    <label className="block text-xs text-gray-600 mb-1">Specific Version *</label>
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
                                    <label className="block text-xs text-gray-600 mb-1">Store/Location/Site Code *</label>
                                    <input
                                        type="text"
                                        value={ticket.storeLocation || 'Dubai'}
                                        onChange={(e) => handlePropertyChange('storeLocation', e.target.value)}
                                        className="w-full h-11 px-3 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">City</label>
                                    <input
                                        type="text"
                                        value={ticket.city || 'Dubai'}
                                        onChange={(e) => handlePropertyChange('city', e.target.value)}
                                        className="w-full h-11 px-3 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Country *</label>
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

                                <button
                                    onClick={() => handlePropertyChange('updated', true)}
                                    className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded transition-colors"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
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
            )}
        </div>
    );
};

export default TicketDetails;
