import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: ''
  });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/contacts');
        // Transform the user data to match the expected contact format
        const formattedContacts = response.data.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || 'N/A',
          company: user.company || 'N/A',
          status: user.isActive !== false ? 'active' : 'inactive', // Assuming all users are active by default
          tickets: Math.floor(Math.random() * 20), // Placeholder for ticket count
          lastContact: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '2023-01-01',
          avatar: user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U'
        }));
        setContacts(formattedContacts);
      } catch (err) {
        console.error('Failed to fetch contacts:', err);
        setError('Failed to fetch contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact => {
    return (
      filters.search === '' ||
      contact.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      contact.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      contact.company.toLowerCase().includes(filters.search.toLowerCase())
    );
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'contact-status-badge contact-status-badge--active';
      case 'inactive':
        return 'contact-status-badge contact-status-badge--inactive';
      default:
        return 'contact-status-badge';
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard__layout">
        <Sidebar />
        <div className="container dashboard__container">
          <div className="dashboard__header">
            <div className="dashboard-header__content">
              <div className="dashboard-header__title-wrapper">
                <h1 className="dashboard-header__title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="28" height="28">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Customers
                </h1>
                <p className="dashboard-header__subtitle">Manage your customer contacts</p>
              </div>
              <div className="dashboard-header__actions">
                <button className="btn btn--primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Customer
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card filters-card">
            <div className="card__body">
              <form className="filters-card__form">
                <div className="filters-card__form-group">
                  <label htmlFor="search" className="form-label filters-card__label">Search</label>
                  <input
                    type="text"
                    id="search"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="form-control"
                    placeholder="Search customers by name, email, or company..."
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Contacts List */}
          <div className="space-y-4">
            {error && (
              <div className="alert alert--danger">
                <div className="alert__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                {error}
              </div>
            )}
            
            {loading ? (
              <div className="tickets-table__loading">
                <div className="spinner spinner--primary"></div>
                <p>Loading customers...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContacts.length === 0 ? (
                  <div className="card">
                    <div className="card__body">
                      <div className="empty-state">
                        <div className="empty-state__icon-wrapper">
                          <svg xmlns="http://www.w3.org/2000/svg" className="empty-state__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="empty-state__title">No customers found</h3>
                        <p className="empty-state__description">
                          {filters.search ? 'Try adjusting your search' : 'No customers available yet'}
                        </p>
                        {filters.search ? (
                          <button className="btn btn--primary" onClick={() => setFilters({search: ''})}>
                            Clear Search
                          </button>
                        ) : (
                          <button className="btn btn--primary">
                            Add Customer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  filteredContacts.map(contact => (
                    <div key={contact.id} className="contact-card">
                      <div className="contact-card__header">
                        <div className="contact-avatar">
                          <span className="contact-initial">{contact.avatar}</span>
                        </div>
                        <div className="contact-info">
                          <h3 className="contact-name">{contact.name}</h3>
                          <span className={getStatusBadgeClass(contact.status)}>
                            {contact.status?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="contact-card__body">
                        <div className="contact-details">
                          <div className="contact-detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" className="contact-detail-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="contact-detail-text">{contact.email}</span>
                          </div>
                          
                          <div className="contact-detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" className="contact-detail-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="contact-detail-text">{contact.phone}</span>
                          </div>
                          
                          <div className="contact-detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" className="contact-detail-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="contact-detail-text">{contact.company}</span>
                          </div>
                        </div>
                        
                        <div className="contact-stats">
                          <div className="contact-stat">
                            <span className="contact-stat-value">{contact.tickets}</span>
                            <span className="contact-stat-label">Tickets</span>
                          </div>
                          <div className="contact-stat">
                            <span className="contact-stat-value">{formatDate(contact.lastContact)}</span>
                            <span className="contact-stat-label">Last Contact</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="contact-card__footer">
                        <button className="btn btn--outline btn--small contact-card-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email
                        </button>
                        <button className="btn btn--outline btn--small contact-card-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          View Tickets
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;