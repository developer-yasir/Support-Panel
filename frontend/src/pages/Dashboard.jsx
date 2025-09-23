import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.priority) queryParams.append('priority', filters.priority);
      
      const response = await api.get(`/tickets?${queryParams.toString()}`);
      setTickets(response.data);
    } catch (err) {
      setError('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const viewTicket = (ticketId) => {
    navigate(`/ticket/${ticketId}`);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open': return 'badge badge-success';
      case 'in_progress': return 'badge badge-warning';
      case 'resolved': return 'badge badge-info';
      case 'closed': return 'badge badge-secondary';
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

  return (
    <div className="dashboard">
      <Navbar />
      <div className="container dashboard__container">
        <div className="dashboard__header">
          <div className="dashboard-header__content">
            <div className="dashboard-header__title-wrapper">
              <h1 className="dashboard-header__title">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="28" height="28">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Support Tickets
              </h1>
              <p className="dashboard-header__subtitle">Manage and track all support requests</p>
            </div>
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

        {/* Stats */}
        <div className="dashboard__stats-grid">
          <div className="dashboard__stats-col">
            <div className="stats-card stats-card--total">
              <div className="stats-card__content">
                <div className="stats-card__header">
                  <div className="stats-card__info">
                    <p className="stats-card__label">Total Tickets</p>
                    <h4 className="stats-card__value">1</h4>
                  </div>
                  <div className="stats-card__icon-wrapper stats-card__icon-wrapper--primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon stats-card__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <div className="stats-card__progress">
                  <div className="progress-bar progress-bar--primary" style={{width: '100%'}}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard__stats-col">
            <div className="stats-card stats-card--open">
              <div className="stats-card__content">
                <div className="stats-card__header">
                  <div className="stats-card__info">
                    <p className="stats-card__label">Open Tickets</p>
                    <h4 className="stats-card__value">1</h4>
                  </div>
                  <div className="stats-card__icon-wrapper stats-card__icon-wrapper--success">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon stats-card__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="stats-card__progress">
                  <div className="progress-bar progress-bar--success" style={{width: '75%'}}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard__stats-col">
            <div className="stats-card stats-card--progress">
              <div className="stats-card__content">
                <div className="stats-card__header">
                  <div className="stats-card__info">
                    <p className="stats-card__label">In Progress</p>
                    <h4 className="stats-card__value">0</h4>
                  </div>
                  <div className="stats-card__icon-wrapper stats-card__icon-wrapper--warning">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon stats-card__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="stats-card__progress">
                  <div className="progress-bar progress-bar--warning" style={{width: '0%'}}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard__stats-col">
            <div className="stats-card stats-card--priority">
              <div className="stats-card__content">
                <div className="stats-card__header">
                  <div className="stats-card__info">
                    <p className="stats-card__label">High Priority</p>
                    <h4 className="stats-card__value">0</h4>
                  </div>
                  <div className="stats-card__icon-wrapper stats-card__icon-wrapper--danger">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon stats-card__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
                <div className="stats-card__progress">
                  <div className="progress-bar progress-bar--danger" style={{width: '0%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card filters-card">
          <div className="card__body">
            <div className="filters-card__header">
              <h5 className="filters-card__title">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon filters-card__title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter Tickets
              </h5>
              <button 
                className="btn btn--secondary btn--small filters-card__reset-btn"
                onClick={() => setFilters({ status: '', priority: '' })}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="icon filters-card__reset-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Filters
              </button>
            </div>
            <div className="filters-card__form">
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
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="card tickets-table-card">
          <div className="card__body card__body--no-padding">
            <div className="tickets-table-container">
              {loading ? (
                <div className="tickets-table__loading">
                  <div className="spinner spinner--primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert--danger tickets-table__error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon alert__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              ) : tickets.length === 0 ? (
                <div className="empty-state tickets-table__empty">
                  <div className="empty-state__icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon empty-state__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="empty-state__title">No tickets found</h3>
                  <p className="empty-state__description">There are no tickets matching your current filters.</p>
                  <button
                    onClick={() => navigate('/ticket/new')}
                    className="btn btn--primary empty-state__btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon empty-state__btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create your first ticket
                  </button>
                </div>
              ) : (
                <table className="table table--hover tickets-table">
                  <thead className="table__head">
                    <tr className="table__row">
                      <th className="table__header">Title</th>
                      <th className="table__header">Status</th>
                      <th className="table__header">Priority</th>
                      <th className="table__header">Created By</th>
                      <th className="table__header">Created At</th>
                      <th className="table__header table__header--actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table__body">
                    {tickets.map((ticket) => (
                      <tr key={ticket._id} className="table__row">
                        <td className="table__cell">
                          <div className="ticket-cell__title">{ticket.title}</div>
                          <div className="ticket-cell__description">{ticket.description.substring(0, 60)}...</div>
                        </td>
                        <td className="table__cell">
                          <span className={getStatusBadgeClass(ticket.status)}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="table__cell">
                          <span className={getPriorityBadgeClass(ticket.priority)}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="table__cell">
                          <div className="ticket-cell__user-name">{ticket.createdBy?.name}</div>
                          <div className="ticket-cell__user-email">{ticket.createdBy?.email}</div>
                        </td>
                        <td className="table__cell">
                          <div className="ticket-cell__date">{new Date(ticket.createdAt).toLocaleDateString()}</div>
                          <div className="ticket-cell__time">{new Date(ticket.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </td>
                        <td className="table__cell table__cell--actions">
                          <button
                            onClick={() => viewTicket(ticket._id)}
                            className="btn btn--outline-primary btn--small ticket-actions__view-btn"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon ticket-actions__view-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;