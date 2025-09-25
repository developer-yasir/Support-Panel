import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Mock data for contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        // In a real app, this would come from an API
        const mockContacts = [
          { id: 1, name: 'John Doe', email: 'john.doe@example.com', company: 'Tech Solutions Inc', phone: '+1 (555) 123-4567', tickets: 5, lastContact: '2023-06-15', status: 'active' },
          { id: 2, name: 'Alice Johnson', email: 'alice.j@example.com', company: 'Global Enterprises', phone: '+1 (555) 987-6543', tickets: 12, lastContact: '2023-06-14', status: 'active' },
          { id: 3, name: 'Mike Brown', email: 'mike.b@example.com', company: 'Innovate Corp', phone: '+1 (555) 456-7890', tickets: 3, lastContact: '2023-06-13', status: 'inactive' },
          { id: 4, name: 'Sarah Davis', email: 'sarah.d@example.com', company: 'Secure Systems', phone: '+1 (555) 234-5678', tickets: 8, lastContact: '2023-06-12', status: 'active' },
          { id: 5, name: 'Emma Wilson', email: 'emma.w@example.com', company: 'Cloud Services Ltd', phone: '+1 (555) 876-5432', tickets: 2, lastContact: '2023-06-11', status: 'active' },
          { id: 6, name: 'David Miller', email: 'david.m@example.com', company: 'Data Insights Inc', phone: '+1 (555) 345-6789', tickets: 7, lastContact: '2023-06-10', status: 'active' },
          { id: 7, name: 'Lisa Taylor', email: 'lisa.t@example.com', company: 'Analytics Pro', phone: '+1 (555) 567-8901', tickets: 1, lastContact: '2023-06-09', status: 'inactive' },
          { id: 8, name: 'James Anderson', email: 'james.a@example.com', company: 'Enterprise Solutions', phone: '+1 (555) 654-3210', tickets: 15, lastContact: '2023-06-08', status: 'active' },
          { id: 9, name: 'Olivia Thomas', email: 'olivia.t@example.com', company: 'Innovation Labs', phone: '+1 (555) 789-0123', tickets: 4, lastContact: '2023-06-07', status: 'active' },
          { id: 10, name: 'William Jackson', email: 'will.j@example.com', company: 'Future Tech', phone: '+1 (555) 890-1234', tickets: 6, lastContact: '2023-06-06', status: 'active' },
          { id: 11, name: 'Sophia Martinez', email: 'sophia.m@example.com', company: 'Cloud Services Ltd', phone: '+1 (555) 901-2345', tickets: 9, lastContact: '2023-06-05', status: 'active' },
          { id: 12, name: 'Benjamin Clark', email: 'ben.c@example.com', company: 'Secure Systems', phone: '+1 (555) 012-3456', tickets: 3, lastContact: '2023-06-04', status: 'inactive' },
        ];
        setContacts(mockContacts);
      } catch (err) {
        setError('Failed to fetch contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => {
    return searchTerm === '' || 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': return 'badge badge-success';
      case 'inactive': return 'badge badge-secondary';
      default: return 'badge badge-secondary';
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
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
                  Contacts
                </h1>
                <p className="dashboard-header__subtitle">Manage and view all customer contacts</p>
              </div>
              <div className="dashboard-header__actions">
                <button
                  onClick={() => navigate('/contact/new')}
                  className="btn btn--primary dashboard-header__create-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Add Contact
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card filters-card">
            <div className="card__body">
              <div className="filters-card__header">
                <h3 className="filters-card__title">Filters</h3>
                <button 
                  className="btn btn--secondary btn--small filters-card__reset-btn"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
              
              <form className="filters-card__form">
                <div className="filters-card__form-group">
                  <label htmlFor="search" className="form-label filters-card__label">Search Contacts</label>
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="form-control"
                    placeholder="Search by name, email, or company..."
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Contacts Table */}
          <div className="card tickets-table-card">
            <div className="card__body">
              <div className="tickets-table-container">
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
                    <p>Loading contacts...</p>
                  </div>
                ) : (
                  <>
                    <table className="tickets-table">
                      <thead>
                        <tr>
                          <th>Contact</th>
                          <th>Company</th>
                          <th>Phone</th>
                          <th>Tickets</th>
                          <th>Last Contact</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentContacts.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="tickets-table__empty">
                              <div className="empty-state">
                                <div className="empty-state__icon-wrapper">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="empty-state__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                </div>
                                <h3 className="empty-state__title">No contacts found</h3>
                                <p className="empty-state__description">
                                  {searchTerm 
                                    ? 'Try adjusting your search' 
                                    : 'No contacts available yet'}
                                </p>
                                {searchTerm ? (
                                  <button className="btn btn--primary" onClick={resetFilters}>
                                    Reset Filters
                                  </button>
                                ) : (
                                  <button 
                                    className="btn btn--primary" 
                                    onClick={() => navigate('/contact/new')}
                                  >
                                    Add Contact
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ) : (
                          currentContacts.map(contact => (
                            <tr key={contact.id} onClick={() => navigate(`/contact/${contact.id}`)} style={{ cursor: 'pointer' }}>
                              <td>
                                <div className="ticket-cell__user-name">{contact.name}</div>
                                <div className="ticket-cell__user-email">{contact.email}</div>
                              </td>
                              <td>
                                <div className="ticket-cell__user-name">{contact.company}</div>
                              </td>
                              <td>
                                <div className="ticket-cell__user-email">{contact.phone}</div>
                              </td>
                              <td>
                                <span className="badge badge--primary">{contact.tickets}</span>
                              </td>
                              <td>
                                <div className="ticket-cell__date">{new Date(contact.lastContact).toLocaleDateString()}</div>
                              </td>
                              <td>
                                <span className={getStatusBadgeClass(contact.status)}>
                                  {contact.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="ticket-cell__actions">
                                <button 
                                  className="btn btn--outline btn--small ticket-actions__view-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/contact/${contact.id}`);
                                  }}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
              
              {/* Pagination */}
              {!loading && !error && filteredContacts.length > 0 && (
                <div className="pagination">
                  <div className="pagination__info">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredContacts.length)} of {filteredContacts.length} contacts
                  </div>
                  <div className="pagination__controls">
                    <button 
                      className="btn btn--outline btn--small" 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span className="pagination__page-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button 
                      className="btn btn--outline btn--small" 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;