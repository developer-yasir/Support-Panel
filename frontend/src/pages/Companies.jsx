import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: ''
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await api.get('/companies');
        setCompanies(response.data);
      } catch (err) {
        console.error('Failed to fetch companies:', err);
        setError('Failed to fetch companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Filter companies based on search
  const filteredCompanies = companies.filter(company => {
    return (
      filters.search === '' ||
      company.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      company.domain.toLowerCase().includes(filters.search.toLowerCase())
    );
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'company-status-badge company-status-badge--active';
      case 'trial':
        return 'company-status-badge company-status-badge--trial';
      case 'inactive':
        return 'company-status-badge company-status-badge--inactive';
      default:
        return 'company-status-badge';
    }
  };

  const getPlanBadgeClass = (plan) => {
    switch (plan) {
      case 'Standard':
        return 'company-plan-badge company-plan-badge--standard';
      case 'Premium':
        return 'company-plan-badge company-plan-badge--premium';
      case 'Enterprise':
        return 'company-plan-badge company-plan-badge--enterprise';
      default:
        return 'company-plan-badge';
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Companies
                </h1>
                <p className="dashboard-header__subtitle">Manage your customer companies</p>
              </div>
              <div className="dashboard-header__actions">
                <button className="btn btn--primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Company
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
                    placeholder="Search companies by name or domain..."
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Companies List */}
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
                <p>Loading companies...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.length === 0 ? (
                  <div className="card">
                    <div className="card__body">
                      <div className="empty-state">
                        <div className="empty-state__icon-wrapper">
                          <svg xmlns="http://www.w3.org/2000/svg" className="empty-state__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <h3 className="empty-state__title">No companies found</h3>
                        <p className="empty-state__description">
                          {filters.search ? 'Try adjusting your search' : 'No companies available yet'}
                        </p>
                        {filters.search ? (
                          <button className="btn btn--primary" onClick={() => setFilters({search: ''})}>
                            Clear Search
                          </button>
                        ) : (
                          <button className="btn btn--primary">
                            Add Company
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  filteredCompanies.map(company => (
                    <div key={company.id} className="company-card">
                      <div className="company-card__header">
                        <div className="company-avatar">
                          <span className="company-initial">{company.avatar}</span>
                        </div>
                        <div className="company-info">
                          <h3 className="company-name">{company.name}</h3>
                          <span className={getStatusBadgeClass(company.status)}>
                            {company.status?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="company-card__body">
                        <div className="company-details">
                          <div className="company-detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" className="company-detail-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="company-detail-text">{company.domain}</span>
                          </div>
                          
                          <div className="company-detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" className="company-detail-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="company-detail-text">{company.contacts} contacts</span>
                          </div>
                          
                          <div className="company-detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" className="company-detail-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span className="company-detail-text">{company.tickets} tickets</span>
                          </div>
                        </div>
                        
                        <div className="company-plan-section">
                          <span className={getPlanBadgeClass(company.plan)}>
                            {company.plan} Plan
                          </span>
                        </div>
                      </div>
                      
                      <div className="company-card__footer">
                        <button className="btn btn--outline btn--small company-card-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          View Contacts
                        </button>
                        <button className="btn btn--outline btn--small company-card-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

export default Companies;