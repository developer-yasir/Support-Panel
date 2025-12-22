
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TagInput from '../components/TagInput';
import Toast from '../components/Toast';
import ContactSearch from '../components/ContactSearch';
import CustomSelect from '../components/CustomSelect';
import RichTextEditor from '../components/RichTextEditor';
import CustomerProfilePanel from '../components/CustomerProfilePanel';
import FileUploader from '../components/FileUploader';

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'open',
    contactEmail: '',
    projectId: '',
    type: 'Question',
    source: 'Portal',
    tags: [],
    cc: [],
    agent: ''
  });

  const [projects, setProjects] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pReq = api.get('/projects');
        const aReq = api.get('/users/agents');
        const [pRes, aRes] = await Promise.all([pReq, aReq]);
        setProjects(pRes.data || []);
        setAgents(aRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleFormSubmit = async (e, createAnother = false) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Subject is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fix the errors below.', 'error');
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        projectId: formData.projectId || undefined,
        assignedTo: formData.agent || undefined,
      };

      await api.post('/tickets', submitData);

      showToast(`Ticket '${formData.title}' created successfully!`, 'success');

      if (createAnother) {
        setFormData(prev => ({
          ...prev,
          title: '',
          description: '',
          status: 'open',
          priority: 'medium',
          type: 'Question',
          tags: [],
          cc: []
        }));
      } else {
        setTimeout(() => navigate('/tickets'), 1000);
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      showToast(error.response?.data?.message || 'Failed to create ticket', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- Rendering Helpers ---

  const renderStatus = (option, isSelected) => (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${option.value === 'open' ? 'bg-blue-500' :
        option.value === 'pending' ? 'bg-orange-500' :
          option.value === 'resolved' ? 'bg-green-500' : 'bg-gray-500'
        }`}></span>
      <span className={isSelected ? 'font-medium' : ''}>{option.label}</span>
    </div>
  );

  const renderPriority = (option, isSelected) => (
    <div className="flex items-center gap-2">
      <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${option.value === 'urgent' ? 'bg-red-100 text-red-700' :
        option.value === 'high' ? 'bg-orange-100 text-orange-700' :
          option.value === 'medium' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
        }`}>
        {option.label}
      </span>
    </div>
  );

  const renderAgent = (option, isSelected) => (
    <div className="flex items-center gap-2">
      {option.value ? (
        <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
          {option.label.charAt(0)}
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full border border-dashed border-gray-400 flex items-center justify-center text-[10px] text-gray-400">
          -
        </div>
      )}
      <span className={isSelected ? 'text-gray-900' : 'text-gray-700'}>{option.label}</span>
    </div>
  );

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

        <main className="flex-1 overflow-y-auto bg-gray-50/50 mt-[69px]">
          {/* Full Width Container */}
          <div className="h-full flex flex-col pl-16 pr-10 py-6" style={{ marginLeft: '100px' }}>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 py-2">
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">New Ticket</h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/tickets')}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 shadow-sm text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => handleFormSubmit(e, false)}
                  disabled={loading}
                  className="px-6 py-2 text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-indigo-200 text-sm font-semibold transition-all flex items-center gap-2"
                >
                  {loading ? 'Creating...' : 'Create Ticket'}
                </button>
              </div>
            </div>

            {/* 2-Column Layout Grid (Immersive Split) */}
            <div className="grid grid-cols-12 gap-6 flex-1 min-h-0 pb-8">

              {/* CENTER COLUMN (9/12): Main Composer - IMMERSIVE EDITOR */}
              <div className="col-span-12 lg:col-span-9 flex flex-col gap-6 h-full" style={{ padding: '10px', background: '#fff' }}>

                {/* Requester Search (Primary Input) */}
                <div className="bg-white rounded-xl p-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Requesting Contact <span className="text-red-500">*</span>
                      </label>
                      <ContactSearch
                        value={formData.contactEmail}
                        onChange={(val) => setFormData(prev => ({ ...prev, contactEmail: val }))}
                        error={errors.contactEmail}
                      />
                      {errors.contactEmail && <p className="mt-1.5 text-xs text-red-600">{errors.contactEmail}</p>}
                    </div>

                    <div className="pt-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Cc</label>
                      <TagInput
                        tags={formData.cc}
                        onTagsChange={(newCC) => setFormData({ ...formData, cc: newCC })}
                        placeholder="Add Cc..."
                      />
                    </div>
                  </div>
                </div>

                {/* Composer */}
                <div className="bg-white rounded-xl p-6 flex-1 flex flex-col">
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 h-11 bg-gray-50 border rounded-lg outline-none transition-all duration-200 hover:bg-white hover:border-gray-300
                                      ${errors.title
                          ? 'border-red-300 bg-red-50/50'
                          : 'border-gray-200 focus:border-indigo-500 focus:bg-white'
                        } text-gray-900 font-medium placeholder-gray-400`}
                      placeholder="Brief summary of the issue"
                    />
                    {errors.title && <p className="mt-1.5 text-xs text-red-600">{errors.title}</p>}
                  </div>

                  <div className="flex-1 flex flex-col min-h-[400px]">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <RichTextEditor
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      error={errors.description}
                    />
                    {errors.description && <p className="mt-1.5 text-xs text-red-600">{errors.description}</p>}

                    {/* Attachment Section */}
                    <div className="mt-6">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Attachments</label>
                      <FileUploader
                        files={formData.attachments || []}
                        onFilesChange={(files) => setFormData(prev => ({ ...prev, attachments: files }))}
                      />
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                      <TagInput
                        tags={formData.tags}
                        onTagsChange={(newTags) => setFormData({ ...formData, tags: newTags })}
                        placeholder="Add tags..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (3/12): Properties & Context Sidebar */}
              <div className="col-span-12 lg:col-span-3 space-y-6 flex flex-col h-full overflow-hidden">

                {/* Customer Info Panel - Shows when contact selected */}
                {formData.contactEmail && (
                  <div className="shrink-0 animate-in fade-in slide-in-from-right-4 duration-500">
                    <CustomerProfilePanel
                      contactEmail={formData.contactEmail}
                      contactName={formData.contactEmail.split('@')[0]}
                    />
                  </div>
                )}

                {/* Properties */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex-1 overflow-y-auto">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-3 flex items-center justify-between">
                    Properties
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  </h3>

                  <div className="space-y-4">
                    <CustomSelect
                      label="Type"
                      value={formData.type}
                      options={[
                        { value: 'Question', label: 'Question' },
                        { value: 'Incident', label: 'Incident' },
                        { value: 'Problem', label: 'Problem' },
                        { value: 'Feature Request', label: 'Feature Request' },
                      ]}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    />

                    <CustomSelect
                      label="Source"
                      value={formData.source}
                      options={[
                        { value: 'Portal', label: 'Portal' },
                        { value: 'Email', label: 'Email' },
                        { value: 'Phone', label: 'Phone' },
                        { value: 'Chat', label: 'Chat' },
                        { value: 'Feedback Widget', label: 'Feedback Widget' },
                      ]}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    />

                    <CustomSelect
                      label="Status"
                      value={formData.status}
                      options={[
                        { value: 'open', label: 'Open' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'resolved', label: 'Resolved' },
                        { value: 'closed', label: 'Closed' },
                      ]}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      renderOption={renderStatus}
                    />

                    <div className="relative">
                      <CustomSelect
                        label="Priority"
                        value={formData.priority}
                        options={[
                          { value: 'low', label: 'Low' },
                          { value: 'medium', label: 'Medium' },
                          { value: 'high', label: 'High' },
                          { value: 'urgent', label: 'Urgent' },
                        ]}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        renderOption={renderPriority}
                      />
                      {/* SLA Preview Badge */}
                      <div className="absolute top-0 right-0 -mt-1">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 ${formData.priority === 'urgent' ? 'bg-red-50 text-red-600 border-red-100' :
                          formData.priority === 'high' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                            formData.priority === 'medium' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                              'bg-gray-50 text-gray-500 border-gray-100'
                          }`}>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {formData.priority === 'urgent' ? 'Due in 1h' :
                            formData.priority === 'high' ? 'Due in 4h' :
                              formData.priority === 'medium' ? 'Due in 24h' : 'Due in 48h'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-8 mb-6 border-b border-gray-100 pb-3">Assignment</h3>

                  <div className="space-y-4">
                    <CustomSelect
                      label="Project"
                      value={formData.projectId}
                      placeholder="-- No Project --"
                      options={[
                        { value: '', label: '-- No Project --' },
                        ...projects.map(p => ({ value: p._id, label: p.name }))
                      ]}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    />

                    <CustomSelect
                      label="Agent"
                      value={formData.agent}
                      placeholder="-- Unassigned --"
                      options={[
                        { value: '', label: '-- Unassigned --' },
                        ...agents.map(a => ({ value: a._id, label: a.name }))
                      ]}
                      onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
                      renderOption={renderAgent}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateTicket;