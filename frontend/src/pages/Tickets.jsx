import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    agent: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;
  const navigate = useNavigate();

  // Mock data for tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        // In a real app, this would come from an API
        const mockTickets = [
          { id: 'TK-1001', title: 'Cannot login to account', customer: 'John Doe', status: 'open', priority: 'high', agent: 'Jane Smith', date: '2023-06-15', tags: ['login', 'account'] },
          { id: 'TK-1002', title: 'Payment not processed', customer: 'Alice Johnson', status: 'in_progress', priority: 'urgent', agent: 'Bob Wilson', date: '2023-06-14', tags: ['payment', 'billing'] },
          { id: 'TK-1003', title: 'Feature request: Dark mode', customer: 'Mike Brown', status: 'pending', priority: 'low', agent: null, date: '2023-06-13', tags: ['feature', 'ui'] },
          { id: 'TK-1004', title: 'Password reset issue', customer: 'Sarah Davis', status: 'resolved', priority: 'medium', agent: 'John Doe', date: '2023-06-12', tags: ['password', 'account'] },
          { id: 'TK-1005', title: 'API integration problem', customer: 'Tech Solutions Inc', status: 'closed', priority: 'high', agent: 'Alice Johnson', date: '2023-06-11', tags: ['api', 'integration'] },
          { id: 'TK-1006', title: 'Billing inquiry', customer: 'Emma Wilson', status: 'open', priority: 'low', agent: 'Bob Wilson', date: '2023-06-10', tags: ['billing', 'question'] },
          { id: 'TK-1007', title: 'UI improvement suggestion', customer: 'David Miller', status: 'open', priority: 'medium', agent: 'Jane Smith', date: '2023-06-09', tags: ['ui', 'suggestion'] },
          { id: 'TK-1008', title: 'Security concern', customer: 'Secure Corp', status: 'in_progress', priority: 'urgent', agent: 'Alice Johnson', date: '2023-06-08', tags: ['security', 'urgent'] },
          { id: 'TK-1009', title: 'Feature not working', customer: 'Lisa Taylor', status: 'pending', priority: 'high', agent: null, date: '2023-06-07', tags: ['feature', 'bug'] },
          { id: 'TK-1010', title: 'Account upgrade request', customer: 'Global Enterprises', status: 'resolved', priority: 'medium', agent: 'John Doe', date: '2023-06-06', tags: ['account', 'upgrade'] },
        ];
        setTickets(mockTickets);
      } catch (err) {
        setError('Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Filter tickets based on filters
  const filteredTickets = tickets.filter(ticket => {
    return (
      (filters.status === '' || ticket.status === filters.status) &&
      (filters.priority === '' || ticket.priority === filters.priority) &&
      (filters.agent === '' || ticket.agent === filters.agent) &&
      (filters.search === '' || ticket.title.toLowerCase().includes(filters.search.toLowerCase()) || ticket.customer.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  // Pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open': return 'badge badge-success';
      case 'in_progress': return 'badge badge-warning';
      case 'resolved': return 'badge badge-info';
      case 'closed': return 'badge badge-secondary';
      case 'pending': return 'badge badge-primary';
      default: return 'badge badge-secondary';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'low': return 'badge badge-success';
      case 'medium': return 'badge badge-warning';
      case 'high': return 'badge badge-danger';
      case 'urgent': return 'badge badge-danger';
      default: return 'badge badge-secondary';
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      agent: '',
      search: ''
    });
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Tickets
                </h1>
                <p className="dashboard-header__subtitle">Manage and track all customer support tickets</p>
              </div>
              <div className="dashboard-header__actions">
                <button
                  onClick={() => navigate('/ticket/new')}
                  className="btn btn--primary dashboard-header__create-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Ticket
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
                  <label htmlFor="search" className="form-label filters-card__label">Search</label>
                  <input
                    type="text"
                    id="search"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="form-control"
                    placeholder="Search tickets..."
                  />
                </div>
                
                <div className="filters-card__form-group">
                  <label htmlFor="status" className="form-label filters-card__label">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="form-control form-control--select"
                  >
                    <option value="">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                
                <div className="filters-card__form-group">
                  <label htmlFor="priority" className="form-label filters-card__label">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={filters.priority}
                    onChange={handleFilterChange}
                    className="form-control form-control--select"
                  >
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div className="filters-card__form-group">
                  <label htmlFor="agent" className="form-label filters-card__label">Agent</label>
                  <select
                    id="agent"
                    name="agent"
                    value={filters.agent}
                    onChange={handleFilterChange}
                    className="form-control form-control--select"
                  >
                    <option value="">All Agents</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Bob Wilson">Bob Wilson</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Alice Johnson">Alice Johnson</option>
                  </select>
                </div>
              </form>
            </div>
          </div>

          {/* Tickets Table */}
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
                    <p>Loading tickets...</p>
                  </div>
                ) : (
                  <>
                    <table className="tickets-table">
                      <thead>
                        <tr>
                          <th>Ticket ID</th>
                          <th>Title</th>
                          <th>Customer</th>
                          <th>Status</th>
                          <th>Priority</th>
                          <th>Agent</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTickets.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="tickets-table__empty">
                              <div className="empty-state">
                                <div className="empty-state__icon-wrapper">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="empty-state__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <h3 className="empty-state__title">No tickets found</h3>
                                <p className="empty-state__description">
                                  {filters.status || filters.priority || filters.agent || filters.search 
                                    ? 'Try adjusting your filters' 
                                    : 'No tickets available yet'}
                                </p>
                                {filters.status || filters.priority || filters.agent || filters.search ? (
                                  <button className="btn btn--primary" onClick={resetFilters}>
                                    Reset Filters
                                  </button>
                                ) : (
                                  <button 
                                    className="btn btn--primary" 
                                    onClick={() => navigate('/ticket/new')}
                                  >
                                    Create Ticket
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ) : (
                          currentTickets.map(ticket => (
                            <tr key={ticket.id} onClick={() => navigate(`/ticket/${ticket.id}`)} style={{ cursor: 'pointer' }}>
                              <td className="ticket-cell__id">
                                <div className="ticket-cell__title">{ticket.id}</div>
                              </td>
                              <td>
                                <div className="ticket-cell__title">{ticket.title}</div>
                                <div className="ticket-cell__tags">
                                  {ticket.tags.map(tag => (
                                    <span key={tag} className="badge badge--secondary" style={{ marginRight: '0.25rem', fontSize: '0.75rem' }}>{tag}</span>
                                  ))}
                                </div>
                              </td>
                              <td>
                                <div className="ticket-cell__user-name">{ticket.customer}</div>
                              </td>
                              <td>
                                <span className={getStatusBadgeClass(ticket.status)}>
                                  {ticket.status.replace('_', ' ').toUpperCase()}
                                </span>
                              </td>
                              <td>
                                <span className={getPriorityBadgeClass(ticket.priority)}>
                                  {ticket.priority.toUpperCase()}
                                </span>
                              </td>
                              <td>
                                <div className="ticket-cell__user-name">
                                  {ticket.agent || <span className="text-muted">Unassigned</span>}
                                </div>
                              </td>
                              <td>
                                <div className="ticket-cell__date">{new Date(ticket.date).toLocaleDateString()}</div>
                              </td>
                              <td className="ticket-cell__actions">
                                <button 
                                  className="btn btn--outline btn--small ticket-actions__view-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/ticket/${ticket.id}`);
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
              {!loading && !error && filteredTickets.length > 0 && (
                <div className="pagination">
                  <div className="pagination__info">
                    Showing {indexOfFirstTicket + 1}-{Math.min(indexOfLastTicket, filteredTickets.length)} of {filteredTickets.length} tickets
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

export default Tickets;