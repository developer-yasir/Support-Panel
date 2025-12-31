import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const CompanyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState({ totalContacts: 0, totalProjects: 0, totalTickets: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tickets');

    useEffect(() => {
        fetchCompanyDetails();
    }, [id]);

    const fetchCompanyDetails = async () => {
        try {
            setLoading(true);
            const [companyRes, statsRes, contactsRes, projectsRes] = await Promise.all([
                api.get(`/client-companies/${id}`),
                api.get(`/client-companies/${id}/stats`),
                api.get(`/client-companies/${id}/contacts`),
                api.get(`/client-companies/${id}/projects`)
            ]);

            setCompany(companyRes.data);
            setStats(statsRes.data);
            setContacts(contactsRes.data);
            setProjects(projectsRes.data);
        } catch (error) {
            console.error('Failed to fetch company details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCompany = async () => {
        if (!window.confirm(`Are you sure you want to delete "${company.name}"?`)) {
            return;
        }
        try {
            await api.delete(`/client-companies/${id}`);
            navigate('/companies');
        } catch (err) {
            console.error('Failed to delete company:', err);
            alert('Failed to delete company');
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex flex-col w-full min-w-0 pl-[268px] [.sidebar-collapsed_&]:pl-[72px] transition-all duration-300">
                    <Navbar />
                    <main className="flex-1 flex items-center justify-center" style={{ marginTop: '65px' }}>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </main>
                </div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex flex-col w-full min-w-0 pl-[268px] [.sidebar-collapsed_&]:pl-[72px] transition-all duration-300">
                    <Navbar />
                    <main className="flex-1 flex items-center justify-center" style={{ marginTop: '65px' }}>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Not Found</h2>
                            <button
                                onClick={() => navigate('/companies')}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Back to Companies
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white font-sans text-gray-900 overflow-hidden">
            <Sidebar />

            <div className="flex flex-col w-full min-w-0 pl-[268px] [.sidebar-collapsed_&]:pl-[72px] transition-all duration-300">
                <Navbar />

                <main className="flex-1 overflow-y-auto bg-white" style={{ marginTop: '65px' }}>
                    <div className="h-full max-w-6xl mx-auto">

                        {/* Breadcrumb and Actions */}
                        <div className="px-8 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2 text-sm mb-3">
                                <button
                                    onClick={() => navigate('/companies')}
                                    className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                                >
                                    Companies
                                </button>
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-gray-700 font-medium">{company.name}</span>
                            </div>

                            {/* Edit and Delete buttons */}
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => navigate(`/client-companies/${id}/edit`)}
                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <span className="font-medium">Edit</span>
                                </button>
                                <button
                                    onClick={handleDeleteCompany}
                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span className="font-medium">Delete</span>
                                </button>
                            </div>
                        </div>

                        {/* Company Header */}
                        <div className="px-8 py-8 border-b border-gray-100">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-3xl font-semibold text-gray-900 mb-3 tracking-tight">{company.name}</h1>
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="text-indigo-600 font-semibold">{stats.totalContacts} contacts</span>
                                        {company.domain && (
                                            <>
                                                <span className="text-gray-300">•</span>
                                                <span className="text-gray-600">{company.domain}</span>
                                            </>
                                        )}
                                    </div>
                                    {company.industry && (
                                        <div className="mt-2 text-sm text-gray-600">
                                            <span className="font-medium">Industry:</span> {company.industry}
                                        </div>
                                    )}
                                </div>
                                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                                    Upload photo
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-100">
                            <div className="px-8">
                                <nav className="flex gap-10">
                                    {[
                                        { id: 'tickets', label: 'TICKETS' },
                                        { id: 'contacts', label: 'CONTACTS' },
                                        { id: 'projects', label: 'PROJECTS' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`py-4 px-1 border-b-2 text-xs font-semibold tracking-wider transition-all ${activeTab === tab.id
                                                    ? 'border-gray-900 text-gray-900'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="px-8 py-8">
                            {activeTab === 'tickets' && (
                                <div className="space-y-4">
                                    <div className="text-sm">
                                        <p className="text-gray-700 font-medium mb-1">Company created</p>
                                        <p className="text-gray-500">
                                            {new Date(company.createdAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'contacts' && (
                                <div>
                                    {contacts.length === 0 ? (
                                        <div className="text-center py-16">
                                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <p className="text-gray-500 mb-5 text-sm">No contacts yet</p>
                                            <button
                                                onClick={() => navigate('/contacts/new')}
                                                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors shadow-sm"
                                            >
                                                Add First Contact
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            {contacts.map((contact) => (
                                                <div
                                                    key={contact._id}
                                                    className="border-b border-gray-50 pb-4 pt-4 hover:bg-gray-50 cursor-pointer -mx-4 px-4 rounded-lg transition-colors"
                                                    onClick={() => navigate(`/users/${contact._id}`)}
                                                >
                                                    <p className="font-medium text-gray-900 text-sm mb-1">{contact.name}</p>
                                                    <p className="text-xs text-gray-500">{contact.email}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'projects' && (
                                <div>
                                    {projects.length === 0 ? (
                                        <div className="text-center py-16">
                                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            <p className="text-gray-500 mb-5 text-sm">No projects yet</p>
                                            <button
                                                onClick={() => navigate('/projects/new')}
                                                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors shadow-sm"
                                            >
                                                Create First Project
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            {projects.map((project) => (
                                                <div
                                                    key={project._id}
                                                    className="border-b border-gray-50 pb-4 pt-4 hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium text-gray-900 text-sm mb-1">{project.name}</p>
                                                            <p className="text-xs text-gray-500">{project.description}</p>
                                                        </div>
                                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                                                            {project.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default CompanyDetails;
