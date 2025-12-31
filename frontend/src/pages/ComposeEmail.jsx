
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RichTextEditor from '../components/RichTextEditor';

const ComposeEmail = () => {
    const [formData, setFormData] = useState({
        to: '',
        subject: '',
        body: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            navigate('/tickets');
            // Ideally show a toast here
        }, 1000);
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
            <Sidebar />

            <div className="flex flex-col w-full min-w-0 pl-[268px] [.sidebar-collapsed_&]:pl-[72px] transition-all duration-300">
                <Navbar />

                <main className="flex-1 overflow-y-auto bg-gray-50/50" style={{ marginTop: '65px', marginRight: '12px' }}>
                    <div className="h-full flex flex-col pl-16 pr-10 py-6" style={{ marginLeft: '100px' }}>

                        {/* Header */}
                        <div className="flex justify-between items-center mb-6 py-2">
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">New Email</h1>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigate('/tickets')}
                                    className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 shadow-sm text-sm font-medium transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                                >
                                    {loading ? 'Sending...' : 'Send Email'}
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="rounded-xl p-6 flex-1 flex flex-col">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">To</label>
                                    <input
                                        type="email"
                                        name="to"
                                        value={formData.to}
                                        onChange={handleInputChange}
                                        className="w-full px-4 h-11 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-gray-900"
                                        placeholder="recipient@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className="w-full px-4 h-11 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-gray-900"
                                        placeholder="Subject line"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col min-h-[400px]">
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
                                    <RichTextEditor
                                        value={formData.body}
                                        onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                                        placeholder="Compose your email..."
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default ComposeEmail;
