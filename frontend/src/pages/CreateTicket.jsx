import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './CreateTicketStyles.css';

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    type: 'Question',
    status: 'open',
    category: '',
    city: '',
    country: '',
    tags: '',
    storeLocationCode: '',
    contact: '',
    cc: '',
    company: '',
    group: '',
    agent: ''
  });
  
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [agents, setAgents] = useState([]);
  const [partnerAgents, setPartnerAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch contacts, companies, agents, and partner agents
    const fetchData = async () => {
      try {
        const contactsResponse = await api.get('/contacts');
        setContacts(contactsResponse.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        // Fallback to sample data if API fails
        setContacts([
          { _id: 'c1', name: 'John Doe', email: 'john@example.com' },
          { _id: 'c2', name: 'Jane Smith', email: 'jane@example.com' },
          { _id: 'c3', name: 'Bob Johnson', email: 'bob@example.com' }
        ]);
      }

      try {
        const companiesResponse = await api.get('/companies');
        setCompanies(companiesResponse.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setCompanies([
          { _id: 'comp1', name: 'ABC Corp' },
          { _id: 'comp2', name: 'XYZ Ltd' },
          { _id: 'comp3', name: '123 Industries' }
        ]);
      }

      try {
        const agentsResponse = await api.get('/users/agents');
        setAgents(agentsResponse.data);
      } catch (error) {
        console.error('Error fetching agents:', error);
        // Check if the error is related to authentication
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Show a warning to the user about authentication
          console.warn('Authentication required to fetch agents. Using sample data.');
        }
        // Fallback to sample data if API fails
        setAgents([
          { _id: 'a1', name: 'Alice Cooper', email: 'alice@support.com' },
          { _id: 'a2', name: 'Bob Marley', email: 'bob@support.com' },
          { _id: 'a3', name: 'Carol King', email: 'carol@support.com' }
        ]);
      }

      try {
        // Fetch partner agents from partnerships
        const partnerAgentsResponse = await api.get('/partnerships/agents');
        setPartnerAgents(partnerAgentsResponse.data);
      } catch (error) {
        console.error('Error fetching partner agents:', error);
        // Don't throw an error here since partnerships may not be set up yet
        setPartnerAgents([]);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddCCTag = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (newTag) {
        const currentCC = formData.cc ? formData.cc.split(',').map(tag => tag.trim()) : [];
        if (!currentCC.includes(newTag)) {
          setFormData(prev => ({
            ...prev,
            cc: [...currentCC, newTag].join(',')
          }));
        }
        e.target.value = '';
      }
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (newTag) {
        const currentTags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];
        if (!currentTags.includes(newTag)) {
          setFormData(prev => ({
            ...prev,
            tags: [...currentTags, newTag].join(',')
          }));
        }
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Subject is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.contact) newErrors.contact = 'Contact is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      const submitData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        createdBy: formData.contact, // This might need to be handled differently depending on your backend
        assignedTo: formData.agent || undefined,
        company: formData.company || undefined
      };

      const response = await api.post('/tickets', submitData);
      alert('Ticket created successfully!');
      navigate('/tickets');
    } catch (error) {
      console.error('Error creating ticket:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create ticket';
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnother = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Subject is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.contact) newErrors.contact = 'Contact is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      const submitData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        createdBy: formData.contact, // This might need to be handled differently depending on your backend
        assignedTo: formData.agent || undefined,
        company: formData.company || undefined
      };

      const response = await api.post('/tickets', submitData);
      alert('Ticket created successfully!');
      
      // Reset form for another ticket
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        type: 'Question',
        status: 'open',
        category: '',
        city: '',
        country: '',
        tags: '',
        storeLocationCode: '',
        contact: '',
        cc: '',
        company: '',
        group: '',
        agent: ''
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create ticket';
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/tickets');
  };

  const getContactById = (id) => {
    return contacts.find(contact => contact._id === id);
  };

  const getCompanyById = (id) => {
    return companies.find(company => company._id === id);
  };

  const getAgentById = (id) => {
    return agents.find(agent => agent._id === id);
  };

  return (
    <div className="freshdesk-create-ticket-page">
      <Navbar />
      <div className="freshdesk-layout">
        <Sidebar />
        <div className="freshdesk-create-ticket-content">
          <div className="freshdesk-page-header">
            <h1 className="freshdesk-page-title">Create Ticket</h1>
            <div className="freshdesk-header-actions">
              <button 
                onClick={handleCancel} 
                className="freshdesk-btn freshdesk-btn--secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateAnother}
                disabled={loading}
                className="freshdesk-btn freshdesk-btn--secondary"
              >
                Create Another
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="freshdesk-btn freshdesk-btn--primary"
              >
                {loading ? 'Creating...' : 'Create Ticket'}
              </button>
            </div>
          </div>

          <div className="freshdesk-create-ticket-form">
            <form onSubmit={handleSubmit}>
              <div className="freshdesk-form-section">
                <div className="freshdesk-form-row">
                  <div className="freshdesk-form-group">
                    <label className="freshdesk-form-label">Contact *</label>
                    <div className="freshdesk-flex-row">
                      <select
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        className={`freshdesk-form-select ${errors.contact ? 'freshdesk-form-error' : ''}`}
                      >
                        <option value="">Select Contact</option>
                        {contacts.map(contact => (
                          <option key={contact._id} value={contact._id}>
                            {contact.name} ({contact.email})
                          </option>
                        ))}
                      </select>
                      <button type="button" className="freshdesk-add-btn">
                        Add new contact
                      </button>
                    </div>
                    {errors.contact && (
                      <div className="freshdesk-error-message">{errors.contact}</div>
                    )}
                  </div>

                  <div className="freshdesk-form-group">
                    <label className="freshdesk-form-label">Add Cc</label>
                    <div className="freshdesk-tag-input">
                      <div className="freshdesk-tags-container">
                        {formData.cc && formData.cc.split(',').filter(tag => tag.trim()).map((tag, index) => (
                          <span key={`cc-${index}`} className="freshdesk-tag">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Type and press Enter to add CC"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value) {
                            e.preventDefault();
                            const newTag = e.target.value.trim();
                            if (newTag) {
                              const currentCC = formData.cc ? formData.cc.split(',').map(tag => tag.trim()) : [];
                              if (!currentCC.includes(newTag)) {
                                setFormData(prev => ({
                                  ...prev,
                                  cc: [...currentCC, newTag].join(',')
                                }));
                              }
                            }
                            e.target.value = '';
                          }
                        }}
                        className="freshdesk-tag-input-field"
                      />
                    </div>
                  </div>
                </div>

                <div className="freshdesk-form-group">
                  <label className="freshdesk-form-label">Subject *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`freshdesk-form-input ${errors.title ? 'freshdesk-form-error' : ''}`}
                    placeholder="Enter subject"
                  />
                  {errors.title && (
                    <div className="freshdesk-error-message">{errors.title}</div>
                  )}
                </div>

                <div className="freshdesk-form-row">
                  <div className="freshdesk-form-group">
                    <label className="freshdesk-form-label">Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="freshdesk-form-select"
                    >
                      <option value="Question">Question</option>
                      <option value="Incident">Incident</option>
                      <option value="Problem">Problem</option>
                      <option value="Change">Change</option>
                    </select>
                  </div>

                  <div className="freshdesk-form-group">
                    <label className="freshdesk-form-label">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="freshdesk-form-select"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="freshdesk-form-group">
                    <label className="freshdesk-form-label">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="freshdesk-form-select"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="freshdesk-form-row">
                  <div className="freshdesk-form-group">
                    <label className="freshdesk-form-label">Group</label>
                    <select
                      name="group"
                      value={formData.group}
                      onChange={handleInputChange}
                      className="freshdesk-form-select"
                    >
                      <option value="">Select Group</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing</option>
                      <option value="sales">Sales</option>
                    </select>
                  </div>

                  <div className="freshdesk-form-group">
                    <label className="freshdesk-form-label">Agent</label>
                    <select
                      name="agent"
                      value={formData.agent}
                      onChange={handleInputChange}
                      className="freshdesk-form-select"
                    >
                      <option value="">Select Agent</option>

                      {/* Regular agents from the current company */}
                      {agents.length > 0 && (
                        <optgroup label="Your Company Agents">
                          {agents.map(agent => (
                            <option key={agent._id} value={agent._id}>
                              {agent.name} {agent.companyId?.name ? `(${agent.companyId.name})` : '(Your Company)'}
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {/* Partner company agents */}
                      {partnerAgents.length > 0 && (
                        <optgroup label="Partner Company Agents">
                          {partnerAgents.map(agent => (
                            <option key={agent._id} value={agent._id}>
                              {agent.name} {agent.companyId?.name ? `(${agent.companyId.name})` : '(Partner)'}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>

                  <div className="freshdesk-form-group">
                    <label className="freshdesk-form-label">Company</label>
                    <select
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="freshdesk-form-select"
                    >
                      <option value="">Select Company</option>
                      {companies.map(company => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="freshdesk-form-group">
                  <label className="freshdesk-form-label">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`freshdesk-form-textarea ${errors.description ? 'freshdesk-form-error' : ''}`}
                    rows="6"
                    placeholder="Describe the issue here..."
                  />
                  {errors.description && (
                    <div className="freshdesk-error-message">{errors.description}</div>
                  )}
                </div>
              </div>

              {/* Additional Fields Section */}
              <div className="freshdesk-form-section freshdesk-form-section--border-top">
                <h3 className="freshdesk-section-title">Additional Fields</h3>
                
                <div className="freshdesk-form-row">
                  <div className="freshdesk-form-group">
                    <label className="freshdesk-form-label">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="freshdesk-form-select"
                    >
                      <option value="">Select Category</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing Query</option>
                      <option value="account">Account Issue</option>
                      <option value="feature">Feature Request</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="freshdesk-form-group">
                    <label className="freshdesk-form-label">Store/Location/Site Code</label>
                    <input
                      type="text"
                      name="storeLocationCode"
                      value={formData.storeLocationCode}
                      onChange={handleInputChange}
                      className="freshdesk-form-input"
                      placeholder="Enter store/location/site code"
                    />
                  </div>
                </div>

                <div className="freshdesk-form-row">
                  <div className="freshdesk-form-group">
                    <label className="freshdesk-form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="freshdesk-form-input"
                      placeholder="Enter city"
                    />
                  </div>

                  <div className="freshdesk-form-group">
                    <label className="freshdesk-form-label">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="freshdesk-form-select"
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="IN">India</option>
                      <option value="JP">Japan</option>
                      <option value="CN">China</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="freshdesk-form-group">
                  <label className="freshdesk-form-label">Tags</label>
                  <div className="freshdesk-tag-input">
                    <div className="freshdesk-tags-container">
                      {formData.tags && formData.tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                        <span key={`tag-${index}`} className="freshdesk-tag">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Type and press Enter to add tags"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value) {
                          e.preventDefault();
                          const newTag = e.target.value.trim();
                          if (newTag) {
                            const currentTags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];
                            if (!currentTags.includes(newTag)) {
                              setFormData(prev => ({
                                ...prev,
                                tags: [...currentTags, newTag].join(',')
                              }));
                            }
                          }
                          e.target.value = '';
                        }
                      }}
                      className="freshdesk-tag-input-field"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Form Actions at Bottom */}
      <div className="freshdesk-create-ticket-actions">
        <div className="freshdesk-actions-container">
          <button 
            onClick={handleCancel} 
            className="freshdesk-btn freshdesk-btn--secondary"
          >
            Cancel
          </button>
          <div className="freshdesk-actions-right">
            <button 
              onClick={handleCreateAnother}
              disabled={loading}
              className="freshdesk-btn freshdesk-btn--secondary"
            >
              Create Another
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="freshdesk-btn freshdesk-btn--primary"
            >
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;