import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';

const CreateProject = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const companyIdFromUrl = searchParams.get('company');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        clientCompanyId: companyIdFromUrl || '',
        status: 'active'
    });
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await api.get('/client-companies');
            setCompanies(response.data);
        } catch (err) {
            console.error('Failed to fetch client companies:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/projects', formData);
            showToast('Project created successfully!', 'success');
            setTimeout(() => {
                navigate('/projects');
            }, 1000);
        } catch (err) {
            console.error('Error creating project:', err);
            setError(err.response?.data?.message || 'Failed to create project');
            showToast(err.response?.data?.message || 'Failed to create project', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
            <Sidebar />
            <div className="flex flex-col w-full min-w-0 pl-[268px] [.sidebar-collapsed_&]:pl-[72px] transition-all duration-300">
                <Navbar />

                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}

                <main className="flex-1 overflow-y-auto bg-gray-50/50" style={{ marginTop: '65px', marginRight: '12px' }}>
                    <div className="h-full flex flex-col pl-16 pr-10 py-6" style={{ marginLeft: '100px' }}>

                        <div className="flex justify-between items-center mb-6 py-2">
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">New Project</h1>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigate('/projects')}
                                    className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 shadow-sm text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create Project'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-2xl">
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-100">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Project Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 h-11 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 font-medium"
                                        placeholder="Website Redesign"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Client Company <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="clientCompanyId"
                                        value={formData.clientCompanyId}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 h-11 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 font-medium"
                                    >
                                        <option value="">Select a client company</option>
                                        {companies.map((company) => (
                                            <option key={company._id} value={company._id}>
                                                {company.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 font-medium resize-none"
                                        placeholder="Project description..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 h-11 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 font-medium"
                                    >
                                        <option value="active">Active</option>
                                        <option value="on_hold">On Hold</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default CreateProject;
