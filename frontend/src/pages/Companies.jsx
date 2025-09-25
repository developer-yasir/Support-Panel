import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Companies = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Mock data for organizations
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        // In a real app, this would come from an API
        const mockOrganizations = [
          { id: 1, name: 'Tech Solutions Inc', industry: 'Technology', size: '50-200', tickets: 15, contacts: 8, lastContact: '2023-06-15', status: 'active' },
          { id: 2, name: 'Global Enterprises', industry: 'Finance', size: '1000+', tickets: 28, contacts: 12, lastContact: '2023-06-14', status: 'active' },
          { id: 3, name: 'Innovate Corp', industry: 'Software', size: '20-50', tickets: 5, contacts: 3, lastContact: '2023-06-13', status: 'active' },
          { id: 4, name: 'Secure Systems', industry: 'Security', size: '200-500', tickets: 12, contacts: 7, lastContact: '2023-06-12', status: 'active' },
          { id: 5, name: 'Cloud Services Ltd', industry: 'Cloud Computing', size: '50-200', tickets: 8, contacts: 5, lastContact: '2023-06-11', status: 'active' },
          { id: 6, name: 'Data Insights Inc', industry: 'Analytics', size: '50-200', tickets: 22, contacts: 9, lastContact: '2023-06-10', status: 'active' },
          { id: 7, name: 'Analytics Pro', industry: 'Data Analysis', size: '10-50', tickets: 3, contacts: 2, lastContact: '2023-06-09', status: 'inactive' },
          { id: 8, name: 'Enterprise Solutions', industry: 'Consulting', size: '500-1000', tickets: 35, contacts: 18, lastContact: '2023-06-08', status: 'active' },
          { id: 9, name: 'Innovation Labs', industry: 'R&D', size: '20-50', tickets: 7, contacts: 4, lastContact: '2023-06-07', status: 'active' },
          { id: 10, name: 'Future Tech', industry: 'Technology', size: '100-500', tickets: 18, contacts: 11, lastContact: '2023-06-06', status: 'active' },
        ];
        setOrganizations(mockOrganizations);
      } catch (err) {
        setError('Failed to fetch organizations');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  // Filter organizations based on search term
  const filteredOrganizations = organizations.filter(org => {
    return searchTerm === '' || 
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.industry.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrganizations = filteredOrganizations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);

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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Organizations
                </h1>
                <p className="dashboard-header__subtitle">Manage and view all customer organizations</p>
              </div>
              <div className="dashboard-header__actions">
                <button
                  onClick={() => navigate('/company/new')}
                  className="btn btn--primary dashboard-header__create-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Add Organization
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
                  <label htmlFor="search" className="form-label filters-card__label">Search Organizations</label>
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="form-control"
                    placeholder="Search by name, industry..."
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Organizations Table */}
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
                    <p>Loading organizations...</p>
                  </div>
                ) : (
                  <>
                    <table className="tickets-table">
                      <thead>
                        <tr>
                          <th>Organization</th>
                          <th>Industry</th>
                          <th>Size</th>
                          <th>Tickets</th>
                          <th>Contacts</th>
                          <th>Last Contact</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentOrganizations.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="tickets-table__empty">
                              <div className="empty-state">
                                <div className="empty-state__icon-wrapper">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="empty-state__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                </div>
                                <h3 className="empty-state__title">No organizations found</h3>
                                <p className="empty-state__description">
                                  {searchTerm 
                                    ? 'Try adjusting your search' 
                                    : 'No organizations available yet'}
                                </p>
                                {searchTerm ? (
                                  <button className="btn btn--primary" onClick={resetFilters}>
                                    Reset Filters
                                  </button>
                                ) : (
                                  <button 
                                    className="btn btn--primary" 
                                    onClick={() => navigate('/company/new')}
                                  >
                                    Add Organization
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ) : (
                          currentOrganizations.map(org => (
                            <tr key={org.id} onClick={() => navigate(`/company/${org.id}`)} style={{ cursor: 'pointer' }}>
                              <td>
                                <div className="ticket-cell__title">{org.name}</div>
                              </td>
                              <td>
                                <div className="ticket-cell__user-name">{org.industry}</div>
                              </td>
                              <td>
                                <div className="ticket-cell__user-name">{org.size}</div>
                              </td>
                              <td>
                                <span className="badge badge--primary">{org.tickets}</span>
                              </td>
                              <td>
                                <span className="badge badge--info">{org.contacts}</span>
                              </td>
                              <td>
                                <div className="ticket-cell__date">{new Date(org.lastContact).toLocaleDateString()}</div>
                              </td>
                              <td>
                                <span className={getStatusBadgeClass(org.status)}>
                                  {org.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="ticket-cell__actions">
                                <button 
                                  className="btn btn--outline btn--small ticket-actions__view-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/company/${org.id}`);
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
              {!loading && !error && filteredOrganizations.length > 0 && (
                <div className="pagination">
                  <div className="pagination__info">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOrganizations.length)} of {filteredOrganizations.length} organizations
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

export default Companies;