
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const CreateContact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: ''
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
            navigate('/contacts');
        }, 1000);
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
            <Sidebar />
            <div className="flex flex-col w-full min-w-0 pl-[268px] [.sidebar-collapsed_&]:pl-[72px] transition-all duration-300">
                <Navbar />
                <main className="flex-1 overflow-y-auto bg-gray-50/50" style={{ marginTop: '65px', marginRight: '12px' }}>
                    <div className="h-full flex flex-col pl-16 pr-10 py-6" style={{ marginLeft: '100px' }}>

                        <div className="flex justify-between items-center mb-6 py-2">
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">New Contact</h1>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigate('/contacts')}
                                    className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 shadow-sm text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create Contact'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-2xl">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 h-11 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 font-medium"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 h-11 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 font-medium"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 h-11 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 font-medium"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Company</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        className="w-full px-4 h-11 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 font-medium"
                                        placeholder="Company Name"
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
export default CreateContact;
