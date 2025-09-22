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
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container py-4">
        <div className="dashboard-header d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 font-semibold text-gray-900 d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Support Tickets
            </h1>
            <p className="text-muted mb-0">Manage and track all support requests</p>
          </div>
          <button
            onClick={() => navigate('/ticket/new')}
            className="btn btn-primary d-flex align-items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="icon me-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Ticket
          </button>
        </div>

        {/* Stats */}
        <div className="row mb-4">
          <div className="col-md-3 col-6 mb-3 mb-md-0">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">Total Tickets</p>
                    <h4 className="font-semibold">1</h4>
                  </div>
                  <div className="bg-blue-100 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3 mb-md-0">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">Open Tickets</p>
                    <h4 className="font-semibold">1</h4>
                  </div>
                  <div className="bg-green-100 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">In Progress</p>
                    <h4 className="font-semibold">0</h4>
                  </div>
                  <div className="bg-yellow-100 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">High Priority</p>
                    <h4 className="font-semibold">0</h4>
                  </div>
                  <div className="bg-red-100 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card filters-card shadow-sm">
          <div className="card-body">
            <h5 className="font-medium text-gray-900 mb-3 d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter Tickets
            </h5>
            <div className="row">
              <div className="col-md-6 mb-3 mb-md-0">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="form-control"
                >
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="priority" className="form-label">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                  className="form-control"
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
        <div className="card shadow-sm">
          <div className="card-body">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner"></div>
              </div>
            ) : error ? (
              <div className="alert alert-danger d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            ) : tickets.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="empty-state-title">No tickets found</h3>
                <p className="empty-state-description">There are no tickets matching your current filters.</p>
                <button
                  onClick={() => navigate('/ticket/new')}
                  className="btn btn-primary d-flex align-items-center mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon me-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create your first ticket
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table ticket-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Created By</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket._id}>
                        <td>
                          <div className="ticket-title">{ticket.title}</div>
                          <div className="ticket-description">{ticket.description.substring(0, 50)}...</div>
                        </td>
                        <td>
                          <span className={getStatusBadgeClass(ticket.status)}>
                            {ticket.status}
                          </span>
                        </td>
                        <td>
                          <span className={getPriorityBadgeClass(ticket.priority)}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td>
                          <div className="user-info">{ticket.createdBy?.name}</div>
                          <div className="text-muted text-sm">{ticket.createdBy?.email}</div>
                        </td>
                        <td>
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            onClick={() => viewTicket(ticket._id)}
                            className="btn btn-sm btn-outline d-flex align-items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon me-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;